import { deflateRawSync } from "node:zlib";

export function usesBrevo() {
  return process.env["EMAIL_PROVIDER"] === "brevo" || Boolean(process.env["BREVO_API_KEY"]);
}
export function mailConfig() {
  return usesBrevo()
    ? { apiKey: process.env["BREVO_API_KEY"], from: process.env["BREVO_FROM_EMAIL"] || process.env["CONTACT_TO_EMAIL"], provider: "brevo" }
    : { apiKey: process.env["RESEND_API_KEY"], from: process.env["RESEND_FROM_EMAIL"], provider: "resend" };
}

// Single-file ZIP, with UTF-8 names, CRC32 and a central directory.
export function zipProject(filename: string, data: Buffer): Buffer {
  const name = Buffer.from(filename, "utf8");
  const compressed = deflateRawSync(data);
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  crc = (crc ^ 0xffffffff) >>> 0;
  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4); local.writeUInt16LE(0x800, 6);
  local.writeUInt16LE(8, 8); local.writeUInt16LE(33, 12);
  local.writeUInt32LE(crc, 14); local.writeUInt32LE(compressed.length, 18);
  local.writeUInt32LE(data.length, 22); local.writeUInt16LE(name.length, 26);
  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6);
  central.writeUInt16LE(0x800, 8); central.writeUInt16LE(8, 10);
  central.writeUInt16LE(33, 14); central.writeUInt32LE(crc, 16);
  central.writeUInt32LE(compressed.length, 20); central.writeUInt32LE(data.length, 24);
  central.writeUInt16LE(name.length, 28);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(1, 8); end.writeUInt16LE(1, 10);
  end.writeUInt32LE(central.length + name.length, 12);
  end.writeUInt32LE(local.length + name.length + compressed.length, 16);
  return Buffer.concat([local, name, compressed, central, name, end]);
}

/** Normalize provider acceptance; never imply inbox delivery. */
export async function mailRequest(url: string, init: RequestInit): Promise<Response> {
  if (!usesBrevo()) return fetch(url, init);
  const config = mailConfig();
  if (!config.apiKey || !config.from) return Response.json({ name: "email_not_configured" }, { status: 503 });
  const input = JSON.parse(String(init.body));
  const attachment = (input.attachments || []).map((file: { filename: string; content: string }) =>
    file.filename.endsWith(".json")
      ? { name: file.filename + ".zip", content: zipProject(file.filename, Buffer.from(file.content, "base64")).toString("base64") }
      : { name: file.filename, content: file.content });
  const body = JSON.stringify({
    sender: { email: config.from, name: "B-CORE SteelVision" },
    to: input.to.map((email: string) => ({ email })),
    replyTo: { email: input.reply_to },
    subject: input.subject,
    htmlContent: input.html ? input.html + (attachment.length ? "<p>Pełny projekt JSON znajduje się w załączniku ZIP.</p>" : "") : undefined,
    textContent: input.text ? input.text + (attachment.length ? "\nPełny projekt JSON znajduje się w załączniku ZIP." : "") : undefined,
    ...(attachment.length ? { attachment } : {}),
  });
  // Reserve headroom under Brevo's 20 MB total message limit.
  if (Buffer.byteLength(body, "utf8") > 18_000_000)
    return Response.json({ name: "attachments_too_large" }, { status: 413 });
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST", signal: init.signal,
    headers: { "api-key": config.apiKey, "Content-Type": "application/json", Accept: "application/json" },
    body,
  });
  const result = await response.json().catch(() => null) as { messageId?: unknown } | null;
  const accepted = response.ok && typeof result?.messageId === "string" && result.messageId.length > 0;
  console.log("B-CORE Brevo acceptance:", { accepted, status: response.status });
  return Response.json(accepted ? { id: result!.messageId } : { name: "brevo_rejected" },
    { status: accepted ? 200 : response.ok ? 502 : response.status });
}
