/**
 * Check the actual built Node entrypoint boots and serves health checks with
 * an unreachable PostgreSQL host. This reproduces Render's port-scan failure.
 */
import assert from "node:assert/strict";
import { createServer } from "node:net";
import { spawn } from "node:child_process";

const reserve=createServer();
await new Promise((resolve,reject)=>{
  reserve.once("error",reject);
  reserve.listen(0,"127.0.0.1",resolve);
});
const port=reserve.address().port;
await new Promise(resolve=>reserve.close(resolve));
const child=spawn(process.execPath,["artifacts/api-server/dist/index.cjs"],{
  cwd:process.cwd(),
  env:{...process.env,PORT:String(port),DATABASE_URL:"postgresql://qa:qa@127.0.0.1:1/offline",NODE_ENV:"production"},
  stdio:["ignore","pipe","pipe"]
});
let output="";
child.stdout.on("data",x=>{output=(output+x.toString()).slice(-4000)});
child.stderr.on("data",x=>{output=(output+x.toString()).slice(-4000)});
let exited=false;child.once("exit",()=>{exited=true});
const started=Date.now();
try{
  let success=false;
  while(Date.now()-started<8_000&&!exited){
    try{
      const res=await fetch("http://127.0.0.1:"+port+"/api/healthz",{signal:AbortSignal.timeout(700)});
      if(res.ok){
        const body=await res.json();
        assert.equal(body.status,"ok");
        success=true;
        break;
      }
    }catch(_){}
    await new Promise(resolve=>setTimeout(resolve,125));
  }
  assert.equal(success,true,"No health response while DB unavailable. "+output);
  assert.ok(Date.now()-started<8000,"Too slow for reliable port scan.");
  const response=await fetch("http://127.0.0.1:"+port+"/");
  assert.equal(response.status,200);
  const html=await response.text();
  assert.ok(html.includes("B-CORE")||html.includes("B-core")||html.includes("B–CORE"));
  console.log("PASS: production Node server opens /api/healthz and homepage without a database, "+
    (Date.now()-started)+" ms");
}finally{
  if(!exited){
    child.kill("SIGTERM");
    await Promise.race([
      new Promise(resolve=>child.once("exit",resolve)),
      new Promise(resolve=>setTimeout(resolve,2000))
    ]);
    if(!exited)child.kill("SIGKILL");
  }
}
