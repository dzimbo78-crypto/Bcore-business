import assert from "node:assert/strict";
import test from "node:test";
import router from "../artifacts/api-server/src/routes/email.ts";
const handler = router.stack
  .find((r: any) => r.route?.path === "/send-email")!
  .route!.stack.at(-1)!.handle;
const valid = {
  name: "QA Test",
  email: "qa@example.com",
  subject: "Test enquiry",
  message: "Testing the local email response only.",
};
async function call(body: unknown) {
  let code = 200;
  let payload: any;
  const res = {
    status(n: number) {
      code = n;
      return this;
    },
    json(p: any) {
      payload = p;
      return this;
    },
  };
  await handler({ body } as any, res as any, () => {});
  return { code, payload };
}
test("invalid fields and honeypot are rejected before any provider request", async () => {
  for (const body of [
    {},
    { ...valid, email: "bad" },
    { ...valid, message: "short" },
    { ...valid, website: "bot" },
  ])
    assert.equal((await call(body)).code, 400);
});
test("missing configuration is an error, never a successful send", async () => {
  delete process.env.RESEND_API_KEY;
  const r = await call(valid);
  assert.equal(r.code, 503);
  assert.equal(r.payload.ok, undefined);
});
test("provider failure does not report success", async () => {
  process.env.RESEND_API_KEY = "test-only-not-a-real-key";
  const previous = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ message: "Failed" }), { status: 500 });
  try {
    const r = await call(valid);
    assert.equal(r.code, 502);
    assert.equal(r.payload.ok, undefined);
  } finally {
    globalThis.fetch = previous;
    delete process.env.RESEND_API_KEY;
  }
});
test("successful provider response is confirmed and HTML is escaped", async () => {
  process.env.RESEND_API_KEY = "test-only-not-a-real-key";
  const previous = globalThis.fetch;
  let sent: any;
  globalThis.fetch = async (_url, options) => {
    sent = JSON.parse(String(options?.body));
    return new Response(JSON.stringify({ id: "mock-email-id" }), {
      status: 200,
    });
  };
  try {
    const r = await call({
      ...valid,
      name: "<img src=x>",
      subject: "Example\r\nHeader",
      message: "<script>unsafe</script>",
    });
    assert.equal(r.code, 200);
    assert.equal(r.payload.ok, true);
    assert.ok(!sent.html.includes("<script>"));
    assert.ok(sent.html.includes("&lt;script&gt;"));
    assert.ok(!sent.subject.includes("\n"));
    assert.equal(sent.reply_to, valid.email);
  } finally {
    globalThis.fetch = previous;
    delete process.env.RESEND_API_KEY;
  }
});
