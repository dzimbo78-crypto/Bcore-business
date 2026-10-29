import assert from "node:assert/strict";
import test from "node:test";
// Unit tests stub the connection; no external PostgreSQL is required.
process.env.DATABASE_URL ||= "postgresql://qa:qa@127.0.0.1:5432/qa";
const { pool } = await import("../lib/db/src/index.ts");
const { default: router } = await import("../artifacts/api-server/src/routes/steel-enquiries.ts");
import { steelAttachments } from "../artifacts/api-server/src/lib/steel-exports.ts";

const handler = (router as any).stack.find((r: any) => r.route?.path === "/steel-enquiries"
  && r.route?.methods?.post)!.route!.stack.at(-1)!.handle;
const good = {
  name: "QA Customer", email: "customer@example.com", phone: "",
  category: "Steel structures", message: "Please quote the full design in the attachment.",
  design: {
    version: "B-CORE-SteelVision-19", quoteId: "qa-test-quotation-2026",
    project: { projectName: "My railing", projectRef: "SV-42", notes: "=TESTFORMULA" },
    state: { items: [{ name: "Balustrada U", type: "railing", qty: 1, shape: "U",
      segments: [{ name: "Front", length: 4.6, angle: 0, jointType: "Spawane", jointGap: 0 }] }] },
    report: { corrections: [{ item: "Balustrada U", code: "JOINT-SNAP",
      field: "jointGap", before: "1 mm", after: "0 mm", reason: "QA" }],
      validation: { blockers: 0, warnings: 1, issues: [] },
      integrity: { passed: 8, total: 9, issues: [] } },
  },
};
async function call(body: any) {
  let code = 200; let payload: any;
  const res = {status(n: number) {code = n;return this},
    json(p: any) {payload = p;return this}};
  await handler({body} as any, res as any, () => {});
  return {code,payload};
}
test("PDF, CSV and JSON contain the full design and geometry audit", () => {
  const files = steelAttachments(
    {name:good.name,email:good.email,category:good.category,message:good.message},
    good.design, "BCS-000042");
  assert.deepEqual(files.map((x) => x.filename.split(".").pop()), ["pdf","csv","json"]);
  assert.ok(Buffer.from(files[0].content,"base64").toString("ascii").startsWith("%PDF-1.4"));
  const csv = Buffer.from(files[1].content,"base64").toString("utf8");
  assert.match(csv,/Balustrada U/);
  assert.match(csv,/jointGap/);
  assert.ok(csv.includes("'=TESTFORMULA")); // formula injection escaped
  const json = JSON.parse(Buffer.from(files[2].content,"base64").toString("utf8"));
  assert.deepEqual(json.design, good.design);
});
test("steel enquiry validates input and honeypot", async () => {
  for (const body of [{}, {...good,website:"spam"},{...good,email:"bad"},
    {...good,design:{state:{items:[]}}}]) assert.equal((await call(body)).code,400);
});
test("BIGSERIAL string ID is accepted, both storage and email succeed", async () => {
  const originalQuery = pool.query, originalFetch = globalThis.fetch;
  const originalKey = process.env.RESEND_API_KEY;
  (pool as any).query = async () => ({rows:[{id:"42"}]});
  process.env.RESEND_API_KEY = "qa-test-key";
  let sent: any;
  globalThis.fetch = async (_url,options) => {
    sent = JSON.parse(String(options?.body));
    return new Response(JSON.stringify({id:"email-test-id"}),{status:200});
  };
  try{
    const {code,payload} = await call(good);
    assert.equal(code,201); assert.equal(payload.stored,true);
    assert.equal(payload.emailed,true); assert.equal(payload.reference,"BCS-000042");
    assert.equal(sent.attachments.length,3);
    assert.equal(sent.reply_to,good.email);
  }finally{
    (pool as any).query = originalQuery; globalThis.fetch = originalFetch;
    if(originalKey===undefined)delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY=originalKey;
  }
});
test("database outage still sends full reports by email",async()=>{
  const originalQuery=pool.query,originalFetch=globalThis.fetch,originalKey=process.env.RESEND_API_KEY;
  (pool as any).query=async()=>{throw Error("DB offline")};
  process.env.RESEND_API_KEY="qa-test-key";
  globalThis.fetch=async()=>new Response(JSON.stringify({id:"email-id"}),{status:200});
  try{
    const r=await call(good);
    assert.equal(r.code,201);assert.equal(r.payload.stored,false);
    assert.equal(r.payload.emailed,true);assert.match(r.payload.reference,/^BCM-/);
  }finally{
    (pool as any).query=originalQuery;globalThis.fetch=originalFetch;
    if(originalKey===undefined)delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY=originalKey;
  }
});
test("database-only acknowledgement never claims email delivery",async()=>{
  const originalQuery=pool.query,originalFetch=globalThis.fetch,originalKey=process.env.RESEND_API_KEY;
  (pool as any).query=async()=>({rows:[{id:"78"}]});
  process.env.RESEND_API_KEY="qa-test-key";
  globalThis.fetch=async()=>new Response(JSON.stringify({message:"rejected"}),{status:403});
  try{
    const r=await call(good);
    assert.equal(r.code,202);assert.equal(r.payload.stored,true);
    assert.equal(r.payload.emailed,false);assert.deepEqual(r.payload.reports,[]);
  }finally{
    (pool as any).query=originalQuery;globalThis.fetch=originalFetch;
    if(originalKey===undefined)delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY=originalKey;
  }
});
test("dual outage returns error, never success",async()=>{
  const originalQuery=pool.query,originalKey=process.env.RESEND_API_KEY;
  (pool as any).query=async()=>{throw Error("DB offline")};
  delete process.env.RESEND_API_KEY;
  try{
    const r=await call(good);
    assert.equal(r.code,503);assert.equal(r.payload.ok,false);
  }finally{
    (pool as any).query=originalQuery;
    if(originalKey!==undefined)process.env.RESEND_API_KEY=originalKey;
  }
});
