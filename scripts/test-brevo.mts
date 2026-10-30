import test from "node:test";
import assert from "node:assert/strict";
import { inflateRawSync } from "node:zlib";
import { mailRequest, usesBrevo, zipProject } from "../artifacts/api-server/src/lib/transactional-mail.ts";

test("ZIP retains the complete UTF-8 project and valid directory", () => {
  const data = Buffer.from(JSON.stringify({ name: "Żółć", nested: { dimensions: [1, 2, 3] } }));
  const zip = zipProject("projekt.json", data);
  assert.equal(zip.readUInt32LE(0), 0x04034b50);
  const size = zip.readUInt32LE(18), start = 30 + zip.readUInt16LE(26);
  assert.deepEqual(inflateRawSync(zip.subarray(start, start + size)), data);
  const end = zip.length - 22, directory = zip.readUInt32LE(end + 16);
  assert.equal(zip.readUInt32LE(directory), 0x02014b50);
  assert.equal(zip.readUInt32LE(directory + 16), zip.readUInt32LE(14));
  assert.equal(zip.readUInt16LE(end + 10), 1);
});
test("Brevo sends three documents, uses client reply-to and requires messageId", async () => {
  const original = globalThis.fetch;
  const env = { ...process.env };
  process.env.EMAIL_PROVIDER = "brevo";
  process.env.BREVO_API_KEY = "test-key";
  process.env.BREVO_FROM_EMAIL = "verified@example.com";
  let responseBody: unknown = { messageId: "<test-id>" };
  globalThis.fetch = async (url, init) => {
    assert.equal(url, "https://api.brevo.com/v3/smtp/email");
    const body = JSON.parse(String(init?.body));
    assert.equal(body.sender.email, "verified@example.com");
    assert.equal(body.replyTo.email, "customer@example.com");
    assert.deepEqual(body.attachment.map((a: any) => a.name), ["report.pdf", "data.csv", "project.json.zip"]);
    assert.equal(new Headers(init?.headers).get("api-key"), "test-key");
    return Response.json(responseBody, { status: 201 });
  };
  const init = { body: JSON.stringify({
    to: ["owner@example.com"], reply_to: "customer@example.com", subject: "TEST",
    attachments: ["report.pdf", "data.csv", "project.json"].map(filename => ({ filename, content: Buffer.from("{}").toString("base64") })),
  }) };
  try {
    assert.equal(usesBrevo(), true);
    assert.deepEqual(await (await mailRequest("unused", init)).json(), { id: "<test-id>" });
    responseBody = {};
    assert.equal((await mailRequest("unused", init)).status, 502);
    delete process.env.BREVO_API_KEY;
    assert.equal((await mailRequest("unused", init)).status, 503);
  } finally {
    globalThis.fetch = original;
    for (const key of Object.keys(process.env)) if (!(key in env)) delete process.env[key];
    Object.assign(process.env, env);
  }
});
