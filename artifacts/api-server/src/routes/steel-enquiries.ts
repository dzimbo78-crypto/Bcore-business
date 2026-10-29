import { Router } from "express";
import { randomUUID } from "node:crypto";
import { pool } from "@workspace/db";
import { rateLimit } from "../rate-limit";
import { isAdminSession } from "./admin";
import { steelAttachments } from "../lib/steel-exports";

const router = Router();
const MAX_DESIGN_BYTES = 8_000_000;
const DEFAULT_RECIPIENT = "przemyslaw.bugajski78@gmail.com";

// The DB and mail provider are independent destinations. Losing Neon must not
// silently prevent the customer quotation from reaching B-CORE by email.
router.post("/steel-enquiries", rateLimit(6, 15 * 60 * 1000), async (req, res) => {
  const { name, email, phone, category, message, design, website } = req.body ?? {};
  const trimmed = (v: unknown) => typeof v === "string" ? v.trim() : "";
  const contactName = trimmed(name);
  const contactEmail = trimmed(email);
  const contactPhone = trimmed(phone);
  const requestMessage = trimmed(message);
  const requestCategory = trimmed(category) || "Konstrukcje stalowe";
  if (
    website ||
    contactName.length < 2 || contactName.length > 120 ||
    contactEmail.length < 4 || contactEmail.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) ||
    contactPhone.length > 200 ||
    requestCategory.length > 200 ||
    requestMessage.length < 10 || requestMessage.length > 10_000 ||
    !design || typeof design !== "object" || Array.isArray(design) ||
    !Array.isArray(design.state?.items) ||
    design.state.items.length < 1 || design.state.items.length > 60 ||
    !design.state.items.some((item: Record<string, unknown>) => {
      if (!item || typeof item !== "object") return false;
      const n = (value: unknown) => Number.isFinite(Number(value)) && Number(value) > 0;
      const segs = item.segments;
      return (Array.isArray(segs) && segs.some((segment) => segment && n(segment.length))) ||
        n(item.length) || n(item.frameL) || n(item.platformL) ||
        n(item.gateOpening) || (n(item.stairSteps) && n(item.stairRun)) ||
        (Array.isArray(item.beams) && item.beams.length > 0);
    })
  ) {
    res.status(400).json({ error: "Invalid steel enquiry", code: "invalid_data" });
    return;
  }
  let payload: string;
  try { payload = JSON.stringify(design); }
  catch { res.status(400).json({ error: "Invalid design JSON" }); return; }
  if (!payload || Buffer.byteLength(payload, "utf8") > MAX_DESIGN_BYTES) {
    res.status(413).json({ error: "Steel design is too large", code: "design_too_large" });
    return;
  }

  const contact = {
    name: contactName, email: contactEmail, phone: contactPhone,
    category: requestCategory, message: requestMessage,
  };
  const quoteId = typeof design.quoteId === "string" &&
    /^[A-Za-z0-9-]{8,90}$/.test(design.quoteId) ? design.quoteId : null;
  let stored = false, emailed = false, emailId: string | null = null, storedId: string | null = null;
  let emailErrorCode: string | null = null;
  let fallbackNotified = false;
  let previouslyNotified = false;
  let reference = "BCM-" + (quoteId ? quoteId.replace(/-/g, "").slice(0, 12).toUpperCase() : randomUUID().slice(0, 12).toUpperCase());

  try {
    const result = await pool.query<{ id: string | number; fallback_accepted_at?: string | null }>(
      "INSERT INTO steel_enquiries (contact_name, contact_email, contact_phone, category, summary, design, quote_id) " +
      "VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7) " +
      "ON CONFLICT (quote_id) WHERE quote_id IS NOT NULL DO UPDATE SET quote_id=EXCLUDED.quote_id RETURNING id, fallback_accepted_at",
      [contactName, contactEmail, contactPhone, requestCategory, requestMessage, payload, quoteId],
    );
    const id = result.rows[0]?.id;
    // pg decodes BIGSERIAL as a string; Number-only checks reject valid IDs.
    if (id === undefined || !/^\d+$/.test(String(id))) throw new Error("Missing enquiry ID");
    reference = "BCS-" + String(id).padStart(6, "0");
    storedId = String(id);
    previouslyNotified = Boolean(result.rows[0]?.fallback_accepted_at);
    stored = true;
  } catch (err) {
    console.error("B-CORE steel enquiry storage unavailable:", err instanceof Error ? err.name : "UnknownError");
  }

  const apiKey = process.env["RESEND_API_KEY"];
  const configuredSender = process.env["RESEND_FROM_EMAIL"];
  if (apiKey && configuredSender) {
    try {
      const attachments = steelAttachments(contact, design, reference);
      // Provider enforces total post-encoding size. Fail explicitly rather than
      // silently accepting a DB-only enquiry as successful mail delivery.
      const encodedBytes = attachments.reduce((n, file) => n + Buffer.byteLength(file.content, "ascii"), 0);
      if (encodedBytes > 32_000_000) {
        emailErrorCode = "attachments_too_large";
        throw new Error("Attachment size limit");
      }
      const from = configuredSender;
      const recipient = process.env["CONTACT_TO_EMAIL"] || DEFAULT_RECIPIENT;
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + apiKey,
          "Content-Type": "application/json",
          ...(quoteId ? { "Idempotency-Key": "steelvision-" + quoteId + "-" + reference } : {}),
        },
        body: JSON.stringify({
          from, to: [recipient], reply_to: contactEmail,
          subject: "[B-CORE] " + reference + " | SteelVision | " + requestCategory.replace(/[\r\n]/g, " ").slice(0, 100),
          text: "B-CORE SteelVision - zapytanie " + reference + "\nKlient: " + contactName + "\nEmail: " + contactEmail + "\nOpis: " + requestMessage + "\nZalaczniki: PDF, CSV, JSON. Weryfikacja techniczna wymagana.",
          html: "<h2>SteelVision - nowe zapytanie o wycene</h2>" +
            "<p>Numer zapytania: <strong>" + reference + "</strong></p>" +
            "<p>Klient: " + escapeHtml(contactName) + " (" + escapeHtml(contactEmail) + ")</p>" +
            "<p>Wiadomosc: " + escapeHtml(requestMessage).replaceAll("\n", "<br>") + "</p>" +
            "<p>Zalaczniki: PDF (raport/QA/poprawki), CSV (wszystkie pola), JSON (pelny projekt).</p>" +
            "<p>Dokument koncepcyjny - wymagana weryfikacja techniczna.</p>",
          attachments,
        }),
        signal: AbortSignal.timeout(18_000),
      });
      const result = await response.json().catch(() => null) as { id?: unknown } | null;
      emailed = response.ok && typeof result?.id === "string";
      emailId = emailed ? String(result?.id) : null;
      if (!emailed) {
        const providerCode = typeof result === "object" && result &&
          "name" in result && typeof result.name === "string" ? String(result.name).slice(0, 64) : null;
        emailErrorCode = response.status === 401 || response.status === 403
          ? "email_auth_rejected"
          : response.status === 400 || response.status === 422
            ? "sender_or_request_rejected"
            : response.status === 429 ? "provider_rate_limited"
            : response.status >= 500 ? "provider_unavailable"
            : "provider_rejected";
        console.error("B-CORE SteelVision Resend rejected enquiry:", {
          status: response.status, code: providerCode, reference,
        });
      }
    } catch (err) {
      emailErrorCode ||= err instanceof Error && err.name === "TimeoutError"
        ? "provider_timeout" : "provider_network_error";
      console.error("B-CORE SteelVision email failed:", {
        reason: emailErrorCode, reference, error: err instanceof Error ? err.name : "UnknownError"
      });
    }
  } else {
    emailErrorCode = "email_not_configured";
    console.error("B-CORE SteelVision email disabled: missing RESEND_API_KEY or RESEND_FROM_EMAIL");
  }

  // FormSubmit needs no verified custom sending domain. It sends a notification
  // pointing to the complete project stored in the authenticated B-CORE admin.
  // It does NOT contain the three attachment files; those remain in the database.
  // Only enable this path when the business has opted into FormSubmit as provider.
  if (stored && !emailed && process.env["EMAIL_PROVIDER"] === "formsubmit") {
    if (previouslyNotified) {
      fallbackNotified = true;
    } else {
      const recipient = process.env["CONTACT_TO_EMAIL"] || DEFAULT_RECIPIENT;
      try {
        const response = await fetch(
          "https://formsubmit.co/ajax/" + encodeURIComponent(recipient),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json", "Accept": "application/json",
              "User-Agent": "B-CORE-Website/2.0",
              Referer: "https://bcore-business.onrender.com/",
              Origin: "https://bcore-business.onrender.com",
            },
            body: JSON.stringify({
              name: contactName, email: contactEmail, phone: contactPhone,
              category: requestCategory,
              message: "Zapytanie SteelVision " + reference +
                "\nPROJEKT ZAPISANY. Pełne PDF/CSV/JSON: panel administratora B-CORE." +
                "\nTo powiadomienie nie zawiera plików.\n\n" +
                requestMessage.slice(0, 8000),
              _subject: "[B-CORE] SteelVision " + reference + " - nowe zapytanie",
              _template: "table", _captcha: "false", _honey: "",
              _url: "https://bcore-business.onrender.com/#/kontakt",
            }),
            signal: AbortSignal.timeout(12_000),
          },
        );
        const payload = await response.json().catch(() => null) as {
          success?: string | boolean; message?: string;
        } | null;
        fallbackNotified = response.ok &&
          (payload?.success === true || payload?.success === "true");
        console.log("B-CORE SteelVision backup FormSubmit:", {
          reference, accepted: fallbackNotified, status: response.status,
          activationRequired: /activat|confirm/i.test(payload?.message || ""),
        });
        if (fallbackNotified && storedId) {
          await pool.query(
            "UPDATE steel_enquiries SET fallback_accepted_at=NOW() WHERE id=$1",
            [storedId],
          );
        }
      } catch (err) {
        console.error("B-CORE SteelVision backup FormSubmit error:", {
          reference, name: err instanceof Error ? err.name : "UnknownError",
        });
      }
    }
  }

  if (storedId && emailed && emailId) {
    try {
      await pool.query("UPDATE steel_enquiries SET email_accepted_at=NOW(), email_provider_id=$2 WHERE id=$1",
        [storedId, emailId]);
    } catch (err) {
      console.error("B-CORE could not record email provider acceptance:", err instanceof Error ? err.name : "UnknownError");
    }
  }
  if (!stored && !emailed) {
    res.status(503).json({
      ok: false, stored: false, emailed: false, reference,
      code: emailErrorCode || "delivery_unavailable",
      error: "Neither database nor email delivery accepted the enquiry",
    });
    return;
  }
  console.log("B-CORE SteelVision enquiry:", reference, { stored, emailed, emailAccepted: !!emailId });
  res.status(emailed ? 201 : 202).json({
    ok: true, reference, stored, emailed,
    // Accepted by Resend != confirmed to arrive in the inbox.
    delivery: emailed ? "accepted_by_email_provider" : "database_only",
    emailErrorCode: emailed ? null : emailErrorCode,
    fallbackNotified,
    reports: emailed ? ["PDF", "CSV", "JSON"] : [],
  });
});


/**
 * Browser-originated FormSubmit multipart fallback:
 * client requests canonical PDF/CSV/JSON bytes to attach to a native form.
 * Never claims delivery and never exposes stored projects from the database.
 */
router.post("/steel-enquiries/prepare-attachments", rateLimit(4, 15 * 60 * 1000), (req, res) => {
  const { contact, design, website } = req.body ?? {};
  if (website || !contact || typeof contact !== "object" || Array.isArray(contact) ||
      !design || typeof design !== "object" || Array.isArray(design) ||
      !Array.isArray(design.state?.items) || !design.state.items.length ||
      design.state.items.length > 60) {
    res.status(400).json({ error: "Invalid project payload", code: "invalid_data" });
    return;
  }
  let serialized = "";
  try { serialized = JSON.stringify(design); }
  catch { res.status(400).json({error:"Invalid project JSON",code:"invalid_data"});return; }
  if (Buffer.byteLength(serialized,"utf8") > MAX_DESIGN_BYTES) {
    res.status(413).json({error:"Project exceeds 8MB limit",code:"design_too_large"});return;
  }
  const c = {
    name: typeof contact.name === "string" ? contact.name.trim().slice(0,120) : "",
    email: typeof contact.email === "string" ? contact.email.trim().slice(0,254) : "",
    phone: typeof contact.phone === "string" ? contact.phone.trim().slice(0,200) : "",
    category: typeof contact.category === "string" ? contact.category.trim().slice(0,200) : "",
    message: typeof contact.message === "string" ? contact.message.trim().slice(0,10000) : "",
  };
  if (c.name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email) ||
      c.message.length < 10) {
    res.status(400).json({error:"Invalid contact details",code:"invalid_data"});return;
  }
  try {
    const quoteId = typeof design.quoteId === "string" && /^[A-Za-z0-9-]{8,90}$/.test(design.quoteId)
      ? design.quoteId : randomUUID();
    const reference = "BCF-" + quoteId.replace(/[^A-Za-z0-9]/g,"").slice(0,16).toUpperCase();
    const attachments = steelAttachments(c,design,reference);
    // FormSubmit native file uploads have a combined size limit of 10 MB.
    const realBytes = attachments.reduce((sum,f)=>sum+Buffer.byteLength(f.content,"base64"),0);
    if (realBytes > 9_000_000) {
      res.status(413).json({error:"Attachments too large for browser fallback",
        code:"attachments_too_large"});return;
    }
    res.setHeader("Cache-Control","no-store");
    res.json({ok:true,reference,attachments});
  } catch (error) {
    console.error("SteelVision attachment export failed:",error instanceof Error?error.name:"UnknownError");
    res.status(500).json({error:"Report generation unavailable",code:"export_failed"});
  }
});

function escapeHtml(value: unknown) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

// Enquiries are accessible to authenticated B-CORE administrators only.
router.get("/admin/steel-enquiries", async (req, res) => {
  if (!isAdminSession(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 40));
  try {
    const { rows } = await pool.query(
      "SELECT id, contact_name, contact_email, contact_phone, category, summary, created_at, email_accepted_at FROM steel_enquiries ORDER BY created_at DESC LIMIT $1",
      [limit],
    );
    res.json({ ok: true, requests: rows.map((x) => ({
      ...x, reference: "BCS-" + String(x.id).padStart(6, "0"),
    })) });
  } catch {
    res.status(503).json({ error: "Unable to retrieve enquiries" });
  }
});

router.get("/admin/steel-enquiries/:id", async (req, res) => {
  if (!isAdminSession(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    res.status(400).json({ error: "Invalid reference" }); return;
  }
  try {
    const { rows } = await pool.query("SELECT * FROM steel_enquiries WHERE id=$1 LIMIT 1", [id]);
    if (!rows.length) { res.status(404).json({ error: "Enquiry not found" }); return; }
    res.json({ ok: true, enquiry: rows[0] });
  } catch {
    res.status(503).json({ error: "Unable to retrieve enquiry" });
  }
});


/**
 * An administrator may resend the exact stored quotation after fixing
 * provider configuration. The original project data is never modified.
 */
router.post("/admin/steel-enquiries/:id/resend", rateLimit(3, 15 * 60 * 1000), async (req, res) => {
  if (!isAdminSession(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    res.status(400).json({ error: "Invalid reference" }); return;
  }
  const apiKey = process.env["RESEND_API_KEY"];
  const from = process.env["RESEND_FROM_EMAIL"];
  if (!apiKey || !from) {
    res.status(503).json({ error: "Verified sender not configured", code: "email_not_configured" }); return;
  }
  try {
    const { rows } = await pool.query<{
      contact_name: string; contact_email: string; contact_phone: string | null;
      category: string | null; summary: string; design: Record<string, unknown>;
      email_accepted_at: Date | null;
    }>(
      "SELECT contact_name, contact_email, contact_phone, category, summary, design, email_accepted_at " +
      "FROM steel_enquiries WHERE id=$1 LIMIT 1", [id],
    );
    if (!rows.length) { res.status(404).json({ error: "Enquiry not found" }); return; }
    const enquiry = rows[0];
    if (enquiry.email_accepted_at) {
      res.status(409).json({ error: "Email already accepted by provider", code: "already_accepted" }); return;
    }
    const reference = "BCS-" + String(id).padStart(6,"0");
    const contact = {
      name: enquiry.contact_name, email: enquiry.contact_email,
      phone: enquiry.contact_phone || "", category: enquiry.category || "",
      message: enquiry.summary,
    };
    const attachments = steelAttachments(contact, enquiry.design, reference);
    const encodedSize = attachments.reduce((size, file) => size + Buffer.byteLength(file.content, "ascii"), 0);
    if (encodedSize > 32_000_000) {
      res.status(413).json({ error: "Attachments too large", code: "attachments_too_large" }); return;
    }
    const recipient = process.env["CONTACT_TO_EMAIL"] || DEFAULT_RECIPIENT;
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey, "Content-Type": "application/json",
        "Idempotency-Key": "steelvision-admin-retry-" + reference,
      },
      body: JSON.stringify({
        from, to: [recipient], reply_to: contact.email,
        subject: "[B-CORE] " + reference + " | SteelVision | ponowna wysylka",
        text: "Zapytanie " + reference + "\nKlient: " + contact.name + "\n" + contact.message +
          "\nZalaczniki: PDF, CSV, JSON. Projekt koncepcyjny, wymagana weryfikacja techniczna.",
        html: "<h2>SteelVision - ponowna wysylka zapytania " + reference + "</h2>" +
          "<p>Klient: " + escapeHtml(contact.name) + "</p><p>" + escapeHtml(contact.message) + "</p>",
        attachments,
      }),
      signal: AbortSignal.timeout(18_000),
    });
    const result = await response.json().catch(() => null) as { id?: unknown } | null;
    if (!response.ok || typeof result?.id !== "string") {
      console.error("B-CORE admin resend rejected", { reference, status: response.status });
      res.status(502).json({ error: "Email provider rejected delivery request",
        code: response.status === 403 || response.status === 401 ? "email_auth_rejected" : "provider_rejected" });
      return;
    }
    await pool.query(
      "UPDATE steel_enquiries SET email_accepted_at=NOW(), email_provider_id=$2 WHERE id=$1",
      [id, result.id],
    );
    res.json({ ok: true, reference, accepted: true, provider: "resend" });
  } catch (error) {
    console.error("B-CORE admin resend failed", error instanceof Error ? error.name : "UnknownError");
    res.status(503).json({ error: "Unable to complete report resend", code: "resend_unavailable" });
  }
});

/**
 * Recover reports from a stored enquiry even if the email provider was down.
 * Admin-only, dynamically regenerated from the same canonical JSONB project.
 */
router.get("/admin/steel-enquiries/:id/exports/:format", async (req, res) => {
  if (!isAdminSession(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const id = Number(req.params.id);
  const format = String(req.params.format || "").toLowerCase();
  if (!Number.isSafeInteger(id) || id <= 0 || !["pdf", "csv", "json"].includes(format)) {
    res.status(400).json({ error: "Invalid export request" }); return;
  }
  try {
    const { rows } = await pool.query<{
      contact_name: string; contact_email: string; contact_phone: string | null;
      category: string | null; summary: string; design: Record<string, unknown>;
    }>(
      "SELECT contact_name, contact_email, contact_phone, category, summary, design " +
      "FROM steel_enquiries WHERE id=$1 LIMIT 1", [id],
    );
    if (!rows.length) { res.status(404).json({ error: "Enquiry not found" }); return; }
    const item = rows[0];
    const reference = "BCS-" + String(id).padStart(6, "0");
    const files = steelAttachments({
      name: item.contact_name, email: item.contact_email,
      phone: item.contact_phone || "", category: item.category || "",
      message: item.summary,
    }, item.design, reference);
    const file = files.find((f) => f.filename.toLowerCase().endsWith("." + format));
    if (!file) { res.status(500).json({ error: "Export unavailable" }); return; }
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", format === "pdf" ? "application/pdf" :
      format === "csv" ? "text/csv; charset=utf-8" : "application/json; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="' + file.filename + '"');
    res.send(Buffer.from(file.content, "base64"));
  } catch (err) {
    console.error("Steel enquiry report export failed:", err instanceof Error ? err.name : "UnknownError");
    res.status(503).json({ error: "Report export unavailable" });
  }
});

export default router;
