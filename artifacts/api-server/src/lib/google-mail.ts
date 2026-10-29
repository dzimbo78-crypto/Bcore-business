/**
 * Domain-free B-CORE transactional mail transport.
 * Google Apps Script is deployed by the account owner and runs MailApp.
 * The Render backend signs its payload; the public Apps Script verifies
 * the signature before it is allowed to send a message.
 */
import { createHmac } from "node:crypto";

export type BcoreEmailAttachment = { filename: string; content: string; contentType?: string };
export type BcoreGoogleDelivery = { accepted: boolean; code: string };

const RECIPIENT = "przemyslaw.bugajski78@gmail.com";
const GOOGLE_DEPLOYMENT = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec(?:\?[^#]*)?$/;

export async function sendBcoreGoogleMail(args: {
  reference: string;
  name: string;
  email: string;
  phone?: string;
  category?: string;
  message: string;
  attachments?: BcoreEmailAttachment[];
}): Promise<BcoreGoogleDelivery> {
  const target = process.env["BCORE_GOOGLE_MAIL_URL"] || "";
  const secret = process.env["BCORE_GOOGLE_MAIL_SECRET"] || "";
  if (!GOOGLE_DEPLOYMENT.test(target) || secret.length < 32) {
    return { accepted: false, code: "google_mail_not_configured" };
  }
  const attachments = args.attachments || [];
  if (attachments.length > 3) return { accepted: false, code: "attachments_too_large" };
  if (attachments.reduce((n, a) => n + Buffer.byteLength(a.content, "ascii"), 0) > 13_500_000)
    return { accepted: false, code: "attachments_too_large" };
  if (!/^[A-Za-z0-9_-]{4,90}$/.test(args.reference))
    return { accepted: false, code: "invalid_reference" };
  const payload = JSON.stringify({
    reference: args.reference,
    recipient: RECIPIENT,
    name: args.name,
    email: args.email,
    phone: args.phone || "",
    category: args.category || "",
    message: args.message,
    attachments,
  });
  const signature = createHmac("sha256", secret).update(payload, "utf8").digest("hex");
  try {
    // Text/plain is deliberately used to avoid a browser-style preflight.
    // Only Render initiates this server-to-server request.
    const response = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ payload, signature }),
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
    });
    const data = await response.json().catch(() => null) as {ok?: unknown; reference?: unknown} | null;
    if (response.ok && data?.ok === true && data?.reference === args.reference)
      return { accepted: true, code: "accepted_by_google_mail" };
    console.error("B-CORE Google Mail rejected request:", { status: response.status, reference: args.reference });
    return { accepted: false, code: "google_mail_rejected" };
  } catch (error) {
    console.error("B-CORE Google Mail transport failed:", error instanceof Error ? error.name : "UnknownError");
    return { accepted: false, code: "google_mail_unavailable" };
  }
}
