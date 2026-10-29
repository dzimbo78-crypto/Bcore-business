import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { mkdtempSync, rmSync, existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

const root=path.resolve("artifacts/sales-platform/dist/public");
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",
  ".css":"text/css; charset=utf-8",".json":"application/json",".svg":"image/svg+xml",
  ".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".webp":"image/webp",".woff":"font/woff",".woff2":"font/woff2"};
if(!existsSync(path.join(root,"bcore-steelvision.html")))throw Error("Build first: public assets missing");
let testQuote=null;
let quoteMode=false;
let fallbackMode=false;
const automationSteel="<script>\nwindow.addEventListener(\"load\",()=>{\n  try {\n    state.items[0].shape=\"I\";\n    state.items[0].segments=[{name:\"Front\",length:3.76,angle:0,jointType:\"Koniec\",jointGap:0}];\n    document.getElementById(\"projectName\").value=\"B-CORE QA BROWSER TEST\";\n    document.getElementById(\"projectRef\").value=\"QA-376\";\n    updateAll();\n    setTimeout(()=>document.getElementById(\"bcoreSteelVisionV19Quote\").click(),150);\n  } catch(error) { document.body.dataset.qaError=String(error); }\n});\n</script>";
const automationContact="<script>\n(function(){\n  let submitted=false;\n  const check=()=>{\n    const form=document.getElementById(\"bcore-contact-form\");\n    if(!form)return;\n    const status=form.querySelector(\".bcore-form-message\");\n    if(status&&status.textContent.includes(\"BCS-QA0001\")){\n      if(!document.getElementById(\"bcore-qa-end-to-end-complete\")){\n        const badge=document.createElement(\"div\");\n        badge.id=\"bcore-qa-end-to-end-complete\";\n        badge.textContent=\"QUOTE SUCCESS\";\n        document.body.appendChild(badge);\n      }\n      return;\n    }\n    if(submitted)return;\n    const draft=sessionStorage.getItem(\"bcore-steelvision-draft\");\n    const message=form.querySelector('textarea[name=\"message\"]');\n    if(!draft||!message||message.value.length<10)return;\n    form.querySelector('input[name=\"name\"]').value=\"QA Browser\";\n    form.querySelector('input[name=\"email\"]').value=\"qa@example.com\";\n    submitted=true;\n    form.requestSubmit();\n  };\n  window.addEventListener(\"DOMContentLoaded\",()=>{check();setInterval(check,150)});\n})();\n</script>";
const fallbackInterceptor="<script>\n(function(){\nconst native=HTMLFormElement.prototype.submit;\nHTMLFormElement.prototype.submit=function(){\n if(String(this.action).startsWith('https://formsubmit.co/')){\n  const files=[...this.querySelectorAll('input[type=file]')];\n  if(files.length===3&&files.every(f=>f.files&&f.files.length===1&&f.files[0].size>0)){\n   const ok=document.createElement('div');ok.id='bcore-qa-native-multipart-ok';\n   ok.textContent='ALL 3 ATTACHMENTS PREPARED';document.body.append(ok);\n  }else document.body.dataset.qaFileError='wrong file input count';\n  return;\n }\n return native.call(this);\n};\nconst fetchOriginal=window.fetch.bind(window);\nwindow.fetch=(url,options)=>{\n if(String(url).startsWith('https://formsubmit.co/ajax/'))\n   return Promise.resolve(new Response(JSON.stringify({success:false,message:'QA simulated 403'}),{status:403,headers:{'Content-Type':'application/json'}}));\n return fetchOriginal(url,options);\n};\n})();\n</script>";

const server=createServer(async(req,res)=>{
  try {
    const u=new URL(req.url||"/","http://localhost");
    if(fallbackMode&&req.method==="POST"&&u.pathname==="/api/steel-enquiries/prepare-attachments"){
      const attachments=[
        {filename:"QA-geometry.pdf",content:Buffer.from("%PDF-1.4\nQA report\n").toString("base64")},
        {filename:"QA-fields.csv",content:Buffer.from("field;value\nsize;3.76\n").toString("base64")},
        {filename:"QA-full-project.json",content:Buffer.from('{"project":"QA"}').toString("base64")}
      ];
      res.writeHead(200,{"Content-Type":"application/json"});
      res.end(JSON.stringify({ok:true,reference:"BCS-QA0002",attachments}));
      return;
    }
    if(req.method==="POST" && u.pathname==="/api/steel-enquiries"){
      const chunks=[];
      for await(const chunk of req)chunks.push(chunk);
      testQuote=JSON.parse(Buffer.concat(chunks).toString("utf8"));
      res.writeHead(fallbackMode?202:201,{"Content-Type":"application/json"});
      res.end(JSON.stringify(fallbackMode?
        {ok:true,stored:true,emailed:false,fallbackNotified:false,reference:"BCS-QA0002",emailErrorCode:"email_auth_rejected"}:
        {ok:true,stored:true,emailed:true,reference:"BCS-QA0001"}));
      return;
    }
    if(u.pathname==="/bcore-steelvision.html" && ["1","fallback"].includes(u.searchParams.get("bcore_qa"))){
      quoteMode=true;fallbackMode=u.searchParams.get("bcore_qa")==="fallback";
    }
    const requested=u.pathname==="/"?"/bcore-cinematic.html":u.pathname;
    const abs=path.resolve(root,"."+decodeURIComponent(requested));
    if(!abs.startsWith(root+path.sep))throw Error("invalid path");
    const info=await stat(abs);
    if(!info.isFile())throw Error("not found");
    res.writeHead(200,{"Content-Type":mime[path.extname(abs)]||"application/octet-stream"});
    const raw=await readFile(abs);
    if(quoteMode && path.extname(abs)===".html" && (requested==="/bcore-cinematic.html"||requested==="/bcore-steelvision.html")){
      const inject=requested==="/bcore-steelvision.html"?automationSteel:
        (fallbackMode?fallbackInterceptor:"")+automationContact;
      const original=raw.toString("utf8");
      const pos=original.lastIndexOf("</body>");
      if(pos<0)throw Error("HTML body closing tag missing");
      res.end(original.slice(0,pos)+inject+original.slice(pos));
    }else res.end(raw);
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
    // An async child is essential here: spawnSync would block the Node HTTP
    // server event loop and prevent Chrome from ever loading the page.
    const output=await new Promise((resolve,reject)=>{
      const child=spawn(browser,[
        "--headless=new","--disable-gpu","--no-sandbox","--disable-dev-shm-usage",
        "--disable-software-rasterizer","--no-first-run","--no-default-browser-check",
        "--user-data-dir="+profile,"--virtual-time-budget=22000","--dump-dom",
        "http://127.0.0.1:"+port+route,
      ],{stdio:["ignore","pipe","pipe"]});
      let stdout="",stderr="";
      const timer=setTimeout(()=>{child.kill();reject(Error(name+" timed out"))},60000);
      child.stdout.on("data",chunk=>{
        stdout+=chunk.toString();
        if(stdout.length>24*1024*1024){child.kill();reject(Error("Chrome DOM too large"));}
      });
      child.stderr.on("data",chunk=>{stderr=(stderr+chunk.toString()).slice(-10000);});
      child.on("error",err=>{clearTimeout(timer);reject(err)});
      child.on("close",status=>{clearTimeout(timer);resolve({stdout,stderr,status})});
    });
    if(output.error||output.status!==0)throw Error(name+" Chrome failed: "+String(output.error||output.stderr).slice(-1200));
    for(const token of required){
      if(!output.stdout.includes(token))throw Error(name+" missing DOM token: "+token+
        "\nDOM end: "+output.stdout.slice(-1200)+"\nChrome: "+output.stderr.slice(-500));
    }
    console.log("PASS browser: "+name);
    return output.stdout;
  } finally {rmSync(profile,{force:true,recursive:true})}
}
try{
  await check("advanced SteelVision quote bridge visible","/bcore-steelvision.html",[
    'id="bcoreSteelVisionV19Quote"', 'id="bcoreSteelVisionV19QuoteTop"'
  ]);
  await check("cinematic contact form mounts","/#/kontakt",[
    'id="bcore-contact-form"','name="message"'
  ]);
  const finalDom=await check("complete advanced quote browser handoff with simulated provider",
    "/bcore-steelvision.html?bcore_qa=1",['id="bcore-contact-form"']);
  if(!testQuote || !finalDom.includes('<div id="bcore-qa-end-to-end-complete"')){
    const formPos=finalDom.indexOf('id="bcore-contact-form"');
    console.log("DEBUG form DOM:",formPos>=0?finalDom.slice(formPos,formPos+2600):"form missing");
    console.log("DEBUG QA error:",finalDom.match(/data-qa-error="[^"]{0,600}"/)?.[0]||"none");
    throw Error("Browser did not complete advanced quote API POST and client acknowledgement");
  }
  if(testQuote.design?.project?.projectName!=="B-CORE QA BROWSER TEST" ||
     testQuote.design?.state?.items?.[0]?.segments?.[0]?.length!==3.76 ||
     !testQuote.design?.report?.validation ||
     testQuote.email!=="qa@example.com")
    throw Error("Browser quotation payload is incomplete: "+JSON.stringify(testQuote).slice(0,1200));
  console.log("PASS browser: complete JSON project posted from advanced simulator through contact form");
  // This replaces provider responses with a controlled rejection and checks
  // that the native form contains 3 actual non-empty File objects.
  const fallbackDom=await check("one-click native multipart recovery after email provider 403",
    "/bcore-steelvision.html?bcore_qa=fallback",['id="bcore-qa-native-multipart-ok"']);
  if(!fallbackDom.includes('ALL 3 ATTACHMENTS PREPARED'))
    throw Error("Fallback form did not stage all three attachments in the browser");

}finally{await new Promise(resolve=>server.close(resolve))}
