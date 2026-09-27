import { Router } from "express";
import { rateLimit } from "../rate-limit";

const router = Router();

const DEFAULT_RECIPIENT = "przemyslaw.bugajski78@gmail.com";
const RESEND_ENDPOINT = "https://api.resend.com/emails";

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

router.post("/send-email", rateLimit(5, 10 * 60 * 1000), async (req, res) => {
  const { name, email, phone, subject, message, category, website } =
    req.body ?? {};
  const validString = (v: unknown, min: number, max: number) =>
    typeof v === "string" && v.trim().length >= min && v.length <= max;
  if (
    website ||
    !validString(name, 2, 120) ||
    !validString(email, 3, 254) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email)) ||
    !validString(message, 10, 10000) ||
    [phone, subject, category].some(
      (v) => v !== undefined && v !== "" && !validString(v, 0, 200),
    )
  ) {
    res.status(400).json({ error: "Invalid enquiry" });
    return;
  }

  if (!name || !email || !message) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const apiKey = process.env["RESEND_API_KEY"];
  const recipient = process.env["CONTACT_TO_EMAIL"] || DEFAULT_RECIPIENT;
  const from =
    process.env["RESEND_FROM_EMAIL"] || "B-CORE <onboarding@resend.dev>";

  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured");
    res.status(503).json({ error: "Email service is not configured" });
    return;
  }

  const subjectLine = String(
    subject || category || "Nowe zapytanie z B-CORE",
  ).replace(/[\r\n]/g, " ");
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeCategory = escapeHtml(category);
  const safeMessage = escapeHtml(message);

  const htmlBody = `
    <h2>Nowe zapytanie z B-CORE</h2>
    <table cellpadding="8" style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
      <tr><td style="color:#666;white-space:nowrap">Imię / Nazwa:</td><td><strong>${safeName}</strong></td></tr>
      <tr><td style="color:#666">Email:</td><td><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
      ${phone ? `<tr><td style="color:#666">Telefon:</td><td>${safePhone}</td></tr>` : ""}
      ${category ? `<tr><td style="color:#666">Kategoria / Typ:</td><td>${safeCategory}</td></tr>` : ""}
      <tr><td style="color:#666;vertical-align:top">Wiadomość:</td><td style="white-space:pre-wrap">${safeMessage}</td></tr>
    </table>
    <hr style="margin-top:24px"/>
    <p style="color:#999;font-size:12px">Wiadomość wysłana ze strony B-CORE</p>
  `;

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "B-CORE-Website/1.0",
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: String(email),
        subject: `[B-CORE] ${subjectLine}`,
        html: htmlBody,
      }),
      signal: AbortSignal.timeout(15000),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      id?: unknown;
    };

    if (!response.ok || typeof payload?.id !== "string") {
      console.error("Resend email error:", response.status, payload);
      res.status(502).json({ error: "Failed to send email" });
      return;
    }

    console.log("B-CORE email sent via Resend:", payload?.id ?? "ok");
    res.json({ ok: true });
  } catch (err) {
    console.error("Resend request error:", err);
    res.status(502).json({ error: "Failed to send email" });
  }
});

export default router;
