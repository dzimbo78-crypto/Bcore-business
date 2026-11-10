import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { steelAttachments } from '../artifacts/api-server/src/lib/steel-exports.ts';
const root = new URL('../artifacts/sales-platform/public/', import.meta.url);
function read(n: string): string { return readFileSync(new URL(n,root),'utf8'); }
const mod = { exports: {} as Record<string, (...a:any[])=>any> };
runInNewContext(read('steelvision-detailer-core.js'), { module:mod, globalThis:{}, console, Math, Date });
const C = mod.exports;
const base=C.base();
test('sample balcony matches 380 + 5140 + 380 mm and 2 pieces',()=>{
 const s=C.summary(base);assert.equal(s.lengthMm,5900);assert.equal(s.quantity,2);assert.equal(s.posts,9);assert.equal(s.under,7);
 assert.equal(s.plates,8);assert.equal(s.topRailM,5.9);
});
test('profile mass per metre uses outer minus hollow area',()=>{
 const p=C.profileSection('60x40x3');assert.ok(p.kgPerM>4&&p.kgPerM<5);
});
test('normalization bounds suspicious coordinates and limits objects',()=>{
 const d=C.normalize({...base,objects:[{id:'bad',kind:'under',xMm:Infinity,zMm:-99999,holeCount:500,plateWidthMm:-20}],heightMm:-10});
 assert.equal(d.objects.length,1);assert.equal(d.objects[0].zMm,-1000);
 assert.equal(d.objects[0].holeCount,16);assert.equal(d.heightMm,350);
});
test('escaping labels leaves no raw HTML',()=>{
 const x=C.esc('<img src=x onerror=alert(1)>');assert.ok(x.includes('&lt;img'));assert.ok(!x.includes('<img'));
});
test('plan path uses segment angles',()=>{
 const p=C.pathPoints(base);assert.equal(p.length,4);assert.ok(Math.abs(p[1][1]-380)<1);
 assert.ok(Math.abs(p[2][0]-5140)<1);assert.ok(Math.abs(p[3][1]-0)<1);
});
test('mount plate hole geometry is deterministic',()=>{
 const v=C.detailDims({plateWidthMm:120,plateHeightMm:25,holeCount:2,holeDiaMm:10});assert.deepEqual(JSON.parse(JSON.stringify(v.holes)),[{x:40,y:12.5},{x:80,y:12.5}]);
});
test('DXF contains mounted objects and valid sections',()=>{
 const d=C.toDXF(base);assert.ok(d.startsWith('0\nSECTION'));assert.ok(d.includes('HOLES'));assert.ok(d.includes('MOUNTS'));assert.ok(d.endsWith('0\nEOF\n'));
});
test('duplicate posts yield geometry error',()=>{
 const d=structuredClone(base);d.objects.push({...d.objects[0],id:'duplicate'});
 assert.ok(C.validate(d).some((e:{code:string})=>e.code==='POST_DUP'));
});
test('quote portal still loads existing full-project email bridge exactly once',()=>{
 const html=read('bcore-steelvision.html');assert.equal((html.match(/bcore-steelvision-bridge\.js/g)||[]).length,1);
 assert.equal((html.match(/bcore-detailer-integration\.js/g)||[]).length,1);
 assert.ok(html.includes('steelvision-detailer-core.js')&&html.includes('steelvision-detailer-ui.js'));
});
test('bridge includes saved drawings in state and does not intercept server mail',()=>{
 const integration=read('bcore-detailer-integration.js');const bridge=read('bcore-steelvision-bridge.js');
 assert.ok(integration.includes('state.detailSheets=['));assert.ok(integration.includes('it.segments=drawing.segments.map'));
 assert.ok(bridge.includes('JSON.parse(JSON.stringify({'));assert.ok(bridge.includes('state,report:buildReport'));
 assert.ok(bridge.includes('stageDraft(design,note)'));
});
const design={quoteId:'SV20261110-abcde',project:{projectName:'Balustrada 514'},state:{items:[{name:'Balustrada',type:'railing',qty:2,segments:[{length:.38,angle:90},{length:5.14,angle:0},{length:.38,angle:-90}]}],detailSheets:[{itemIndex:0,itemName:'Balustrada',drawing:base}]},report:{createdAt:'2026-11-10T09:00:00.000Z',issues:[],recommendations:[]}};
const contact={name:'Klient testowy',email:'test@example.invalid',category:'Balustrady',message:'Test zapytania',phone:''};
test('email attachment generation retains PDF CSV and JSON with detailer',()=>{
 const a=steelAttachments(contact,design,'BCS-000024');assert.equal(a.length,3);
 assert.deepEqual(a.map(x=>x.filename.split('.').pop()),['pdf','csv','json']);
 const pdf=Buffer.from(a[0].content,'base64').toString('latin1');
 assert.ok(pdf.startsWith('%PDF-1.4'));assert.ok(pdf.includes('DETAIL DRAWING'));
 assert.ok(pdf.includes('MOUNTING DETAIL'));assert.ok(pdf.endsWith('%%EOF\n'));
 const csv=Buffer.from(a[1].content,'base64').toString('utf8');assert.ok(csv.includes('design.state.detailSheets[0].drawing.objects'));
 const json=JSON.parse(Buffer.from(a[2].content,'base64').toString('utf8'));
 assert.equal(json.design.state.detailSheets[0].drawing.schema,3);
});
test('email artifact generation is deterministic for identical retries',()=>{
 const x=steelAttachments(contact,design,'BCS-000024'),y=steelAttachments(contact,design,'BCS-000024');
 assert.deepEqual(x,y);
});