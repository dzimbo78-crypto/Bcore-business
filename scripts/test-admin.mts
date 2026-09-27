import assert from "node:assert/strict";
import test from "node:test";
import router, {
  isAdminSession,
} from "../artifacts/api-server/src/routes/admin.ts";
import {
  parseProduct,
  parseProductId,
} from "../artifacts/api-server/src/lib/product-input.ts";
import { rateLimit } from "../artifacts/api-server/src/rate-limit.ts";
function invoke(path: string, req: any) {
  let code = 200,
    data: any,
    cookie: any;
  const res = {
    status(n: number) {
      code = n;
      return this;
    },
    json(value: any) {
      data = value;
      return this;
    },
    cookie(name: string, value: string, options: any) {
      cookie = { name, value, options };
      return this;
    },
    clearCookie() {
      return this;
    },
  };
  const route = router.stack.find((r: any) => r.route?.path === path)!.route!;
  route.stack.at(-1)!.handle(req, res as any, () => {});
  return { code, data, cookie };
}
test("admin rejects wrong and missing credentials; accepts only configured password", () => {
  delete process.env.ADMIN_PASSWORD;
  assert.equal(invoke("/admin/login", { body: {} }).code, 500);
  process.env.ADMIN_PASSWORD = "temporary-unit-test-password";
  try {
    assert.equal(
      invoke("/admin/login", { body: { password: "wrong" } }).code,
      401,
    );
    assert.equal(invoke("/admin/login", { body: { password: {} } }).code, 401);
    const login = invoke("/admin/login", {
      body: { password: process.env.ADMIN_PASSWORD },
    });
    assert.equal(login.code, 200);
    assert.equal(login.cookie.options.httpOnly, true);
    assert.equal(login.cookie.options.sameSite, "lax");
    const req = { cookies: { bcore_admin: login.cookie.value } };
    assert.equal(isAdminSession(req), true);
    invoke("/admin/logout", req);
    assert.equal(isAdminSession(req), false);
    assert.equal(
      isAdminSession({ cookies: { bcore_admin: "invented-token" } }),
      false,
    );
  } finally {
    delete process.env.ADMIN_PASSWORD;
  }
});
test("contact settings are accessible only to an authenticated admin and omit API secrets", () => {
  assert.equal(invoke("/admin/contact-status", {}).code, 401);
  process.env.ADMIN_PASSWORD = "temporary-unit-test-password";
  try {
    const login = invoke("/admin/login", {
      body: { password: process.env.ADMIN_PASSWORD },
    });
    const status = invoke("/admin/contact-status", {
      cookies: { bcore_admin: login.cookie.value },
    });
    assert.equal(status.code, 200);
    assert.deepEqual(Object.keys(status.data).sort(), [
      "configured",
      "recipient",
    ]);
  } finally {
    delete process.env.ADMIN_PASSWORD;
  }
});
test("offer visibility survives creation, whitespace is normalized, invalid content is rejected", () => {
  assert.equal(
    parseProduct({ title: "  Oferta  ", active: false }).active,
    false,
  );
  assert.equal(parseProduct({ title: "  Oferta  " }).title, "Oferta");
  for (const input of [
    { title: " " },
    { title: [] },
    { title: "Offer", active: "false" },
    { title: "Offer", imageBase64: "javascript:alert(1)" },
    { title: "Offer", imageBase64: "data:image/svg+xml;base64,bad" },
    { title: "x".repeat(181) },
  ])
    assert.throws(() => parseProduct(input));
  assert.equal(parseProductId("25"), 25);
  for (const id of ["25abc", "0", "-1", "NaN", "2147483648"])
    assert.throws(() => parseProductId(id));
});
test("rate limit blocks excess requests with a retry interval", () => {
  const middleware = rateLimit(2, 60000);
  let nextCount = 0,
    status = 200,
    retry = 0;
  const req = { ip: "127.0.0.1" } as any;
  const res = {
    status(n: number) {
      status = n;
      return this;
    },
    setHeader(_name: string, value: number) {
      retry = value;
    },
    json() {},
  } as any;
  for (let i = 0; i < 3; i++) middleware(req, res, () => nextCount++);
  assert.equal(nextCount, 2);
  assert.equal(status, 429);
  assert.ok(retry > 0 && retry <= 60);
});
