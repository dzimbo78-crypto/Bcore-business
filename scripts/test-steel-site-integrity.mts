import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=(file:string)=>readFileSync(path.join(root,"artifacts/sales-platform/public",file),"utf8");
test("cinematic landing loads production contact integration",()=>{
  const html=read("bcore-cinematic.html");
  assert.match(html,/bcore-production\.js/, "Cinematic contact is not connected to production form");
  assert.match(html,/id=["']app["']/, "SPA container absent");
});
test("SteelVision advanced page actually loads quote bridge and supports contact handoff",()=>{
  const html=read("bcore-steelvision.html");
  const bridge=read("bcore-steelvision-bridge.js");
  assert.match(html,/<script[^>]+src=["']\/bcore-steelvision-bridge\.js/);
  assert.match(bridge,/\/#\/kontakt/);
  assert.match(bridge,/bcore-steelvision-draft/);
  assert.match(bridge,/buildReport/);
  assert.match(bridge,/corrections/);
});
test("Contact integration sends full project through backend rather than text-only provider",()=>{
  const integration=read("bcore-production.js");
  assert.match(integration,/fetch\("\/api\/steel-enquiries"/);
  assert.match(integration,/reply\.emailed/);
  assert.match(integration,/readSteelDraft/);
  assert.match(integration,/appendSteelDownload/);
});
test("SteelVision fallback immediately attempts native PDF/CSV/JSON after failed provider",()=>{
  const src=read("bcore-production.js");
  assert.match(src,/function addSteelMultipartFallback\(status, contact, autoStart=false\)/);
  assert.match(src,/if\(autoStart\) queueMicrotask\(\(\)=>button\.click\(\)\)/);
  assert.match(src,/form\.enctype="multipart\/form-data"/);
  assert.match(src,/form\.action="https:\/\/formsubmit\.co\/"\+mail/);
  assert.match(src,/attachment_pdf","attachment_csv","attachment_json"/);
  assert.equal((src.match(/addSteelMultipartFallback\(status,body,true\)/g)||[]).length,4);
});

test("All entry routes reset their design, old autosave is never restored",()=>{
  const advanced=read("bcore-steelvision.html");
  const quick=read("bcore-configurator.js");
  assert.match(advanced,/const saved=null;/);
  assert.doesNotMatch(advanced,/localStorage\.setItem\("steelvision-v14"/);
  assert.match(advanced,/pageshow/);
  assert.match(quick,/Object\.assign\(state,defaultState\)/);
});
test("Advanced simulator inline scripts and public scripts parse as JavaScript",()=>{
  const html=read("bcore-steelvision.html");
  const scripts=[...html.matchAll(/<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
  assert.ok(scripts.length>=1);
  for(const script of scripts)assert.doesNotThrow(()=>new Function(script));
  for(const script of ["bcore-production.js","bcore-steelvision-bridge.js","bcore-configurator.js","bcore-enhancements.js"])
    assert.doesNotThrow(()=>new Function(read(script)));
});
