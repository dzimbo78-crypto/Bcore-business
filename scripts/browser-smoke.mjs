import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { mkdtempSync, rmSync, existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root=path.resolve("artifacts/sales-platform/dist/public");
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",
  ".css":"text/css; charset=utf-8",".json":"application/json",".svg":"image/svg+xml",
  ".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".webp":"image/webp",".woff":"font/woff",".woff2":"font/woff2"};
if(!existsSync(path.join(root,"bcore-steelvision.html")))throw Error("Build first: public assets missing");
const server=createServer(async(req,res)=>{
  try {
    const u=new URL(req.url||"/","http://localhost");
    const requested=u.pathname==="/"?"/bcore-cinematic.html":u.pathname;
    const abs=path.resolve(root,"."+decodeURIComponent(requested));
    if(!abs.startsWith(root+path.sep))throw Error("invalid path");
    const info=await stat(abs);
    if(!info.isFile())throw Error("not found");
    res.writeHead(200,{"Content-Type":mime[path.extname(abs)]||"application/octet-stream"});
    res.end(await readFile(abs));
  }catch{
    res.writeHead(404,{"Content-Type":"text/plain"});res.end("Not Found");
  }
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const port=server.address().port;
const candidates=["google-chrome","google-chrome-stable","chromium","chromium-browser"];
const browser=candidates.find(command=>spawnSync("which",[command],{encoding:"utf8"}).status===0);
if(!browser){server.close();throw Error("Chrome or Chromium is required for real-browser smoke tests");}
async function check(name,route,required){
  const profile=mkdtempSync(path.join(os.tmpdir(),"bcore-qa-"));
  try {
    const output=spawnSync(browser,[
      "--headless=new","--disable-gpu","--no-sandbox","--disable-dev-shm-usage",
      "--disable-software-rasterizer","--no-first-run","--no-default-browser-check",
      "--user-data-dir="+profile,"--virtual-time-budget=12000","--dump-dom",
      "http://127.0.0.1:"+port+route,
    ],{encoding:"utf8",timeout:60000,maxBuffer:24*1024*1024});
    if(output.error||output.status!==0)throw Error(name+" Chrome failed: "+String(output.error||output.stderr).slice(-1200));
    for(const token of required){
      if(!output.stdout.includes(token))throw Error(name+" missing DOM token: "+token+
        "\nDOM end: "+output.stdout.slice(-1200)+"\nChrome: "+output.stderr.slice(-500));
    }
    console.log("PASS browser: "+name);
  } finally {rmSync(profile,{force:true,recursive:true})}
}
try{
  await check("advanced SteelVision quote bridge visible","/bcore-steelvision.html",[
    'id="bcoreSteelVisionV19Quote"', 'id="bcoreSteelVisionV19QuoteTop"'
  ]);
  await check("cinematic contact form mounts","/#/kontakt",[
    'id="bcore-contact-form"','name="message"'
  ]);
}finally{await new Promise(resolve=>server.close(resolve))}
