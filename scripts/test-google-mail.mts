import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { sendBcoreGoogleMail } from "../artifacts/api-server/src/lib/google-mail.ts";

const originalEnv={
  url:process.env.BCORE_GOOGLE_MAIL_URL,
  secret:process.env.BCORE_GOOGLE_MAIL_SECRET,
};
const url="https://script.google.com/macros/s/TEST-DEPLOYMENT-ABC_123/exec";
const secret="bcore-unit-test-very-long-secret-000000000000000";
const input={
  reference:"BCS-000012", name:"QA Test",email:"qa@example.com",
  message:"Test complete SteelVision quote without real email",
  attachments:[
    {filename:"SteelVision-QA.pdf",content:Buffer.from("%PDF-1.4").toString("base64")},
    {filename:"SteelVision-QA.csv",content:Buffer.from("x;y\n1;2").toString("base64")},
    {filename:"SteelVision-QA.json",content:Buffer.from("{}").toString("base64")},
  ],
};
function restore(){
  if(originalEnv.url===undefined)delete process.env.BCORE_GOOGLE_MAIL_URL;
  else process.env.BCORE_GOOGLE_MAIL_URL=originalEnv.url;
  if(originalEnv.secret===undefined)delete process.env.BCORE_GOOGLE_MAIL_SECRET;
  else process.env.BCORE_GOOGLE_MAIL_SECRET=originalEnv.secret;
}

test("Google mail requires owner's configured webhook URL and strong shared secret",async()=>{
  delete process.env.BCORE_GOOGLE_MAIL_URL;
  delete process.env.BCORE_GOOGLE_MAIL_SECRET;
  try {
    const res=await sendBcoreGoogleMail(input);
    assert.equal(res.accepted,false);
    assert.equal(res.code,"google_mail_not_configured");
  }finally{restore()}
});
test("Google mail signs original complete PDF CSV JSON JSON payload with HMAC SHA256",async()=>{
  const oldFetch=globalThis.fetch;
  process.env.BCORE_GOOGLE_MAIL_URL=url;
  process.env.BCORE_GOOGLE_MAIL_SECRET=secret;
  let seen=false;
  globalThis.fetch=async (target,opts)=>{
    assert.equal(String(target),url);
    assert.equal(opts?.method,"POST");
    const body=JSON.parse(String(opts?.body));
    const expected=createHmac("sha256",secret).update(body.payload,"utf8").digest("hex");
    assert.equal(body.signature,expected);
    const data=JSON.parse(body.payload);
    assert.equal(data.recipient,"przemyslaw.bugajski78@gmail.com");
    assert.equal(data.reference,input.reference);
    assert.deepEqual(data.attachments,input.attachments);
    seen=true;
    return new Response(JSON.stringify({ok:true,reference:input.reference}),
      {status:200,headers:{"Content-Type":"application/json"}});
  };
  try{
    const result=await sendBcoreGoogleMail(input);
    assert.equal(result.accepted,true);
    assert.equal(result.code,"accepted_by_google_mail");
    assert.equal(seen,true);
  }finally{globalThis.fetch=oldFetch;restore()}
});
test("Google mail rejects spoofed acknowledgement and invalid webhook URLs",async()=>{
  const oldFetch=globalThis.fetch;
  process.env.BCORE_GOOGLE_MAIL_URL=url;
  process.env.BCORE_GOOGLE_MAIL_SECRET=secret;
  globalThis.fetch=async()=>new Response(JSON.stringify({ok:true,reference:"BCS-evil"}),{status:200});
  try{
    assert.equal((await sendBcoreGoogleMail(input)).accepted,false);
    process.env.BCORE_GOOGLE_MAIL_URL="https://some-other-domain.example/collect";
    assert.equal((await sendBcoreGoogleMail(input)).code,"google_mail_not_configured");
  }finally{globalThis.fetch=oldFetch;restore()}
});
