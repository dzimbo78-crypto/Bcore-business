/**
 * B-CORE SteelVision — Google Apps Script / MailApp.
 *
 * This is an optional, domain-free email gateway. It is NOT active until the
 * Gmail owner deploys the script as a Web App running under their account
 * and configures the same long shared secret in Script Properties and Render.
 *
 * Required Script Property: BCORE_GOOGLE_MAIL_SECRET (>= 32 characters)
 * Set access: Anyone; Execute as: Me (the Gmail account owner).
 * Never paste Gmail passwords or Google access tokens into B-CORE.
 */
const BCORE_RECIPIENT = "przemyslaw.bugajski78@gmail.com";

function doGet() {
  return jsonResponse_({ ok: true, service: "B-CORE mail gateway", acceptingPostOnly: true });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return jsonResponse_({ ok: false, error: "busy" });
  try {
    const raw = (e && e.postData && e.postData.contents) || "";
    if (raw.length > 15500000) return jsonResponse_({ ok: false, error: "oversized" });
    const request = JSON.parse(raw);
    const secret = PropertiesService.getScriptProperties().getProperty("BCORE_GOOGLE_MAIL_SECRET") || "";
    if (secret.length < 32 || typeof request.payload !== "string" ||
        typeof request.signature !== "string" ||
        !isValidSignature_(request.payload, request.signature, secret)) {
      return jsonResponse_({ ok: false, error: "unauthorized" });
    }
    const d = JSON.parse(request.payload);
    if (!d || d.recipient !== BCORE_RECIPIENT ||
        !/^[A-Za-z0-9_-]{4,90}$/.test(String(d.reference || "")) ||
        typeof d.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) ||
        typeof d.name !== "string" || d.name.length < 2 ||
        typeof d.message !== "string" || d.message.length < 10 ||
        !Array.isArray(d.attachments) || d.attachments.length > 3) {
      return jsonResponse_({ ok: false, error: "invalid_payload" });
    }

    // Persist idempotency in Script Properties. Retried network requests must
    // not send multiple identical customer inquiries to the business inbox.
    const fingerprint = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256, d.reference, Utilities.Charset.UTF_8
    ).map(toHexByte_).join("");
    const marker = "sent_" + fingerprint;
    const props = PropertiesService.getScriptProperties();
    if (props.getProperty(marker)) return jsonResponse_({ ok: true, reference: d.reference, repeat: true });

    const files = d.attachments.map(function (file) {
      if (!file || typeof file.filename !== "string" ||
          !/^[A-Za-z0-9_.-]{1,140}$/.test(file.filename) ||
          !/\.(pdf|csv|json)$/.test(file.filename) ||
          typeof file.content !== "string") throw new Error("bad_attachment");
      const type = /\.pdf$/.test(file.filename) ? "application/pdf"
        : /\.csv$/.test(file.filename) ? "text/csv" : "application/json";
      return Utilities.newBlob(Utilities.base64Decode(file.content), type, file.filename);
    });

    if (MailApp.getRemainingDailyQuota() < 1) {
      return jsonResponse_({ ok: false, error: "daily_quota_exhausted" });
    }

    const subject = "[B-CORE] " + d.reference + " — SteelVision — " +
      String(d.category || "Nowa wycena").replace(/[\r\n]/g, " ").slice(0, 95);
    const text =
      "NOWE ZAPYTANIE Z B-CORE / STEELVISION\n" +
      "Referencja: " + d.reference + "\n" +
      "Klient: " + d.name + "\n" +
      "Email klienta: " + d.email + "\n" +
      "Telefon: " + String(d.phone || "") + "\n" +
      "Kategoria: " + String(d.category || "") + "\n\n" +
      "Opis zamowienia:\n" + d.message + "\n\n" +
      "Zalaczniki: PDF, CSV, JSON (o ile przeslane).\n" +
      "To projekt koncepcyjny wymagajacy weryfikacji przez konstruktora.";

    MailApp.sendEmail({
      to: BCORE_RECIPIENT,
      subject: subject,
      body: text,
      replyTo: d.email,
      name: "B-CORE SteelVision",
      attachments: files,
    });
    // MailApp accepted the request. Inbox arrival still depends on Gmail.
    props.setProperty(marker, new Date().toISOString());
    return jsonResponse_({ ok: true, reference: d.reference });
  } catch (error) {
    console.error("B-CORE mail gateway error: " + (error && error.name || "Error"));
    return jsonResponse_({ ok: false, error: "send_failed" });
  } finally {
    lock.releaseLock();
  }
}

function toHexByte_(b) {
  return ("0" + ((b + 256) % 256).toString(16)).slice(-2);
}

function isValidSignature_(payload, signature, secret) {
  if (!/^[a-f0-9]{64}$/.test(signature)) return false;
  const expected = Utilities.computeHmacSha256Signature(payload, secret)
    .map(toHexByte_).join("");
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < 64; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
