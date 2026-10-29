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
    design.state.items.length < 1 || design.state.items.length > 60
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
  let stored = false, emailed = false, emailId: string | null = null;
  let reference = "BCM-" + randomUUID().slice(0, 12).toUpperCase();

  try {
    const result = await pool.query<{ id: string | number }>(
      "INSERT INTO steel_enquiries (contact_name, contact_email, contact_phone, category, summary, design) " +
      "VALUES ($1,$2,$3,$4,$5,$6::jsonb) RETURNING id",
      [contactName, contactEmail, contactPhone, requestCategory, requestMessage, payload],
    );
    const id = result.rows[0]?.id;
    // pg decodes BIGSERIAL as a string; Number-only checks reject valid IDs.
    if (id === undefined || !/^\d+$/.test(String(id))) throw new Error("Missing enquiry ID");
    reference = "BCS-" + String(id).padStart(6, "0");
    stored = true;
  } catch (err) {
    console.error("B-CORE steel enquiry storage unavailable:", err instanceof Error ? err.name : "UnknownError");
  }

  const apiKey = process.env["RESEND_API_KEY"];
  if (apiKey) {
    try {
      const attachments = steelAttachments(contact, design, reference);
      const from = process.env["RESEND_FROM_EMAIL"] || "B-CORE <onboarding@resend.dev>";
      const recipient = process.env["CONTACT_TO_EMAIL"] || DEFAULT_RECIPIENT;
      const quoteId = typeof design.quoteId === "string" &&
        /^[A-Za-z0-9-]{8,90}$/.test(design.quoteId) ? design.quoteId : null;
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + apiKey,
          "Content-Type": "application/json",
          ...(quoteId ? { "Idempotency-Key": "steelvision-" + quoteId } : {}),
        },
        body: JSON.stringify({
          from, to: [recipient], reply_to: contactEmail,
          subject: "[B-CORE] " + reference + " | SteelVision | " + requestCategory.replace(/[\r\n]/g, " ").slice(0, 100),
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
      if (!emailed) console.error("B-CORE SteelVision Resend rejected enquiry:", response.status);
    } catch (err) {
      console.error("B-CORE SteelVision email failed:", err instanceof Error ? err.name : "UnknownError");
    }
  } else {
    console.error("B-CORE SteelVision email disabled: RESEND_API_KEY missing");
  }

  if (!stored && !emailed) {
    res.status(503).json({
      ok: false, stored: false, emailed: false, reference,
      code: "delivery_unavailable",
      error: "Neither database nor email delivery accepted the enquiry",
    });
    return;
  }
  console.log("B-CORE SteelVision enquiry:", reference, { stored, emailed, emailAccepted: !!emailId });
  res.status(emailed ? 201 : 202).json({
    ok: true, reference, stored, emailed,
    // Accepted by Resend != confirmed to arrive in the inbox.
    delivery: emailed ? "accepted_by_email_provider" : "database_only",
    reports: emailed ? ["PDF", "CSV", "JSON"] : [],
  });
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
      "SELECT id, contact_name, contact_email, contact_phone, category, summary, created_at FROM steel_enquiries ORDER BY created_at DESC LIMIT $1",
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

export default router;
