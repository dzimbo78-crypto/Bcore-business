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
 assert.ok(bridge.includes('JSON.parse(JSON.stringify({'));assert.ok(bridge.includes('project,state,report:') && bridge.includes('detailerConsistency()'));
 assert.ok(bridge.includes('stageDraft(design,note)'));
});
const design={quoteId:'SV20261110-abcde',project:{projectName:'Balustrada 514'},state:{items:[{name:'Balustrada',type:'railing',qty:2,segments:[{length:.38,angle:90},{length:5.14,angle:0},{length:.38,angle:-90}]}],detailSheets:[{itemIndex:0,itemName:'Balustrada',drawing:base}]},report:{createdAt:'2026-11-10T09:00:00.000Z',issues:[],recommendations:[]}};
const contact={name:'Klient testowy',email:'test@example.invalid',category:'Balustrady',message:'Test zapytania',phone:''};
test('email attachment generation retains PDF CSV and JSON with detailer',()=>{
 const a=steelAttachments(contact,design,'BCS-000024');assert.equal(a.length,3);
 assert.deepEqual(a.map(x=>x.filename.split('.').pop()),['pdf','csv','json']);
 const pdf=Buffer.from(a[0].content,'base64').toString('latin1');
 assert.ok(pdf.startsWith('%PDF-1.4'));assert.ok(pdf.includes('DETAIL DRAWING'));
 assert.ok(pdf.includes('MOUNTING DETAIL'));
 assert.ok(pdf.includes('MOUNTING SCHEDULE'));
 assert.ok(pdf.includes('face left')&&pdf.includes('wall'));assert.ok(pdf.endsWith('%%EOF\n'));
 const csv=Buffer.from(a[1].content,'base64').toString('utf8');assert.ok(csv.includes('design.state.detailSheets[0].drawing.objects'));
 const json=JSON.parse(Buffer.from(a[2].content,'base64').toString('utf8'));
 assert.equal(json.design.state.detailSheets[0].drawing.schema,3);
});
test('email artifact generation is deterministic for identical retries',()=>{
 const x=steelAttachments(contact,design,'BCS-000024'),y=steelAttachments(contact,design,'BCS-000024');
 assert.deepEqual(x,y);
});

test('wall and underside mounting faces survive normalization and BOM',()=>{
 const d=structuredClone(base);
 d.objects.find((o:any)=>o.id==='m1').face='underside';
 d.objects.find((o:any)=>o.id==='w1').face='right';
 const normal=C.normalize(d);
 assert.equal(normal.objects.find((o:any)=>o.id==='m1').face,'underside');
 assert.equal(normal.objects.find((o:any)=>o.id==='w1').face,'right');
 const bill=C.bom(normal).map((x:any)=>x.name).join(' | ');
 assert.ok(bill.includes('Mocowanie do ściany (right)'));
 assert.ok(bill.includes('Wspornik od spodu'));
});
test('duplicate multiple supports makes unique copies preserving surfaces',()=>{
 const r=C.duplicateObjects(base,['w1','m1'],150,0);
 assert.equal(r.ids.length,2);
 assert.equal(new Set(r.drawing.objects.map((x:any)=>x.id)).size,r.drawing.objects.length);
 assert.equal(r.drawing.objects.find((o:any)=>o.id===r.ids[0]).kind,'wall');
 assert.equal(r.drawing.objects.find((o:any)=>o.id===r.ids[1]).kind,'under');
 assert.equal(r.drawing.objects.find((o:any)=>o.id===r.ids[0]).xMm,150);
});
test('repeat multiple objects at fixed increments without altering originals',()=>{
 const original=base.objects.find((o:any)=>o.id==='m1');
 const result=C.repeatObjects(base,['m1'],3,500);
 assert.equal(result.ids.length,3);
 const coords=result.ids.map((id:string)=>result.drawing.objects.find((o:any)=>o.id===id).xMm);
 assert.deepEqual(JSON.parse(JSON.stringify(coords)),[original.xMm+500,original.xMm+1000,original.xMm+1500]);
 assert.equal(base.objects.find((o:any)=>o.id==='m1').xMm,original.xMm);
});
test('bulk move and distribute respect coordinates and snap bounds',()=>{
 const moved=C.transformObjects(base,['p3','p4'],{dx:100,dz:20});
 assert.equal(moved.objects.find((o:any)=>o.id==='p3').xMm,base.objects.find((o:any)=>o.id==='p3').xMm+100);
 assert.equal(moved.objects.find((o:any)=>o.id==='p4').zMm,20);
 const evenly=C.transformObjects(base,['p3','p4','p5'],{space:true});
 assert.ok(evenly.objects.every((o:any)=>Number.isFinite(o.xMm)));
});
test('different top and bottom rail sections influence estimated mass independently',()=>{
 const heavy=structuredClone(base),lighter=structuredClone(base);
 heavy.topRail='60x40x3';heavy.bottomRail='60x40x3';
 lighter.topRail='60x40x3';lighter.bottomRail='40x40x2';
 assert.ok(C.summary(heavy).massKgEstimate>C.summary(lighter).massKgEstimate);
});
test('DXF includes separate layers for underside/wall mounts and supports',()=>{
 const dxf=C.toDXF(base);
 assert.ok(dxf.includes('MOUNTS_WALL')&&dxf.includes('MOUNTS_UNDERSIDE'));
 assert.ok(dxf.includes('SUPPORTS')&&dxf.includes('HOLES'));
});
test('editor UI has repeat, multi-select, clipboard and mount kind controls',()=>{
 const ui=read('steelvision-detailer-ui.js');
 const css=read('steelvision-detailer.css');
 for (const marker of ['data-action="duplicate"','data-action="copy"','data-action="paste"','data-action="repeat"','data-action="align-z"','data-action="space-x"','data-edit="kind"','faceSelect','ref.selection']) {
  assert.ok(ui.includes(marker),marker);
 }
 assert.ok(css.includes('.sv-bulk'));
});


test('v4 includes eight context-specific drafting templates with editable elements',()=>{
 for(const family of ['railing','fence','stairs','gate','frame','platform','screen','custom']){
  const drawing=C.productPreset(family,{name:family+' QA',quantity:2});
  const geom=C.summary(drawing);
  assert.equal(drawing.productType,family);
  assert.equal(drawing.name,family+' QA');
  assert.ok(drawing.objects.length>=2,family+' should initialize editable geometry');
  assert.ok(geom.lengthMm>0);
  assert.ok(!C.validate(drawing).some((x:any)=>x.level==='error'),family+' has blocking geometry');
  assert.ok(C.toDXF(drawing).includes('EOF'));
 }
});
test('v4 structural primitives survive JSON normalization and DXF export',()=>{
 const source=C.productPreset('stairs',{steps:8,lengthMm:2880});
 assert.ok(source.objects.some((x:any)=>x.kind==='step'));
 assert.ok(source.objects.some((x:any)=>x.kind==='beam'));
 const loaded=C.normalize(JSON.parse(JSON.stringify(source)));
 assert.ok(loaded.objects.some((x:any)=>x.kind==='beam'&&x.spanMm>0));
 assert.ok(C.toDXF(loaded).includes('STEPS'));
});
test('v4 gate drawings include hinge positions and export to vector geometry',()=>{
 const d=C.productPreset('gate',{lengthMm:3700,heightMm:1800});
 assert.equal(d.objects.filter((x:any)=>x.kind==='hinge').length,2);
 assert.ok(C.toDXF(d).includes('HINGES'));
});
test('v4 independent view panels clip correctly and support focus/zoom',()=>{
 const ui=read('steelvision-detailer-ui.js'),css=read('steelvision-detailer.css'),html=read('bcore-steelvision.html');
 for(const token of ['sv-quickviews','sv-mainpanel','data-maximize','data-zoom','view===\x27sheet\x27?det+plan:\x27\x27','sv-panehead'])
   assert.ok(ui.includes(token),'UI missing '+token);
 for(const token of ['overflow:hidden','sv-maximized','sv-minipaper','min-width:0'])
   assert.ok(css.includes(token),'CSS missing '+token);
 assert.ok(html.includes('bcore-studio-polish.css?v=4'));
});
test('v4 B-CORE drawing launcher follows product selection and keeps RFQ bridge',()=>{
 const integration=read('bcore-detailer-integration.js'),bridge=read('bcore-steelvision-bridge.js');
 for(const type of ['railing','fence','stairs','gate','frame','platform','screen','custom'])
   assert.ok(integration.includes(type),type);
 assert.ok(integration.includes("productArea.insertAdjacentElement('afterend',launcher)"));
 assert.ok(integration.includes('bcDetailerGeometryButton'));
 assert.ok(integration.includes('state.detailSheets=['));
 assert.ok(integration.includes('if(typeof linear===') && integration.includes('it.segments=drawing.segments.map'));
 assert.ok(bridge.includes('stageDraft(design,note)'));
});
test('v4 mail PDF includes category-specific sheets for stairs and gates',()=>{
 const stairs=C.productPreset('stairs',{steps:7,lengthMm:2800});
 const gate=C.productPreset('gate',{lengthMm:3800});
 const src={quoteId:'SV-4-PREVIEW',state:{items:design.state.items,detailSheets:[
  {itemIndex:0,productType:'stairs',drawing:stairs},{itemIndex:0,productType:'gate',drawing:gate}
 ]},report:design.report};
 const attachments=steelAttachments(contact,src,'BCS-000041');
 assert.equal(attachments.length,3);
 const pdf=Buffer.from(attachments[0].content,'base64').toString('latin1');
 assert.ok(pdf.includes('STAIRS')&&pdf.includes('GATE'));
 assert.ok(pdf.includes('MOUNTING SCHEDULE'));
 const json=JSON.parse(Buffer.from(attachments[2].content,'base64').toString('utf8'));
 assert.equal(json.design.state.detailSheets.length,2);
});


test('v4 stale-category quote guard is present on client and server',()=>{
 const bridge=read('bcore-steelvision-bridge.js');
 assert.ok(bridge.includes('saved drawing belongs to'));
 const server=readFileSync(new URL('../artifacts/api-server/src/routes/steel-enquiries.ts',import.meta.url),'utf8');
 assert.ok(server.includes('stale_detail_sheet'));
});


test("v5: extra top rail geometry is shared by 2D, 3D, BOM and DXF",()=>{
 const d=structuredClone(base);
 d.extraProfiles=[{id:"extra1",label:"Second upper rail",profile:"60x40x3",fromMm:380,toMm:5520,gapMm:110,sideMm:45}];
 const model=C.normalize(d),sc=C.sceneFrom(model),mass=C.summary(model);
 const rails=sc.lines.filter((l:any)=>l.kind==="accent"&&l.profile==="60x40x3");
 assert.ok(rails.length>=4);
 assert.equal(mass.extraRailM,5.14);
 assert.ok(mass.massKgEstimate>C.summary(base).massKgEstimate);
 assert.ok(C.toDXF(model).includes("EXTRA_TOP_PROFILES"));
 assert.ok(C.bom(model).some((r:any)=>r.name.includes("Dodatkowy profil górny")&&r.lengthMm===5140));
 const z=C.extraProfileHeight(model,model.extraProfiles[0]);
 assert.ok(rails.some((r:any)=>Math.abs(r.a[2]-z/1000)<1e-6));
});
test("v5: saved legacy v4 project without extra profiles remains valid",()=>{
 const old=structuredClone(base);delete old.extraProfiles;
 const upgraded=C.normalize(old);
 assert.equal(upgraded.schema,3);assert.equal(upgraded.extraProfiles.length,0);
 assert.ok(C.sceneFrom(upgraded).lines.length>0);
});
test("v5: 3D scene shares exactly the sketch attachment location and panel geometry",()=>{
 const d=structuredClone(base);d.objects.find((x:any)=>x.kind==="under").xMm=990;
 d.objects.find((x:any)=>x.kind==="wall").face="right";
 const scene=C.sceneFrom(d);
 assert.equal(scene.plates.length,d.objects.filter((x:any)=>["plate","under","wall","hinge"].includes(x.kind)).length);
 assert.ok(scene.anchors.length>=scene.plates.length);
 assert.ok(scene.panels.length>0);
 const p=C.atStation(d,990);
 assert.ok(scene.plates.some((x:any)=>Math.abs(x.p[0]-p[0]/1000)<1e-4));
});
test("v5: studio has live 3D canvas alongside 2D with adaptive fitted layout",()=>{
 const ui=read("steelvision-detailer-ui.js"),css=read("steelvision-detailer.css"),integration=read("bcore-detailer-integration.js"),html=read("bcore-steelvision.html");
 for(const key of ["sv5-dual","data-sv-3d","drawPreview3D","add-extra-profile","data-rail-prop","sceneFrom"])
  assert.ok(ui.includes(key),key);
 for(const key of ["sv5-dual","minmax(0,1fr)","sv-preview3d","sv-extra-row"])
  assert.ok(css.includes(key),key);
 for(const key of ["sv5SharedGrid","sv5SharedSketch","svRefreshSharedPreview","mountSharedPreview"])
  assert.ok(integration.includes(key),key);
 assert.ok(html.includes("if(sheet?.drawing && window.SVDetailCore?.sceneFrom)"));
 assert.ok(html.includes("window.svRefreshSharedPreview?.()"));
 assert.ok(html.includes("profil dodatkowy"));
});
test("v5: PDF/CSV/JSON email artefacts contain extra rail drawing and exact editable values",()=>{
 const d=structuredClone(base);
 d.extraProfiles=[{id:"top-2",label:"Secondary rail",profile:"60x40x3",fromMm:0,toMm:5900,gapMm:90,sideMm:35}];
 const data=structuredClone(design);data.state.detailSheets[0].drawing=d;
 const attachments=steelAttachments(contact,data,"BCS-0055");
 assert.equal(attachments.length,3);
 const pdf=Buffer.from(attachments[0].content,"base64").toString("latin1");
 assert.ok(pdf.includes("EXTRA TOP PROFILES"));assert.ok(pdf.includes("Secondary rail"));
 const json=JSON.parse(Buffer.from(attachments[2].content,"base64").toString("utf8"));
 assert.equal(json.design.state.detailSheets[0].drawing.extraProfiles[0].gapMm,90);
 const csv=Buffer.from(attachments[1].content,"base64").toString("utf8");
 assert.ok(csv.includes("extraProfiles[0].sideMm"));
});


test('v6 CAD: rotating and orienting plates affects true 3D positions and DXF',()=>{
 const d=structuredClone(base);
 d.objects.push({id:'w3',kind:'wall',label:'QA rotated wall plate',face:'right',xMm:470,zMm:460,plateWidthMm:120,plateHeightMm:80,holeCount:4,holeDiaMm:10,holePattern:'grid',holeEdgeMm:15,rotationDeg:47,yawDeg:30});
 const model=C.normalize(d);
 const mount=model.objects.find((o:any)=>o.id==='w3');
 assert.equal(mount.rotationDeg,47);assert.equal(mount.yawDeg,30);
 const pts=C.mountPoints2D(mount);assert.equal(pts.holes.length,4);
 assert.ok(pts.corners[0].x!==470-60);
 const scene=C.sceneFrom(model),plate=scene.plates.find((p:any)=>p.mountId==='w3');
 assert.equal(plate.surface,'face_minus');assert.equal(plate.rotationDeg,47);assert.ok(plate.uAxis&&plate.vAxis);
 assert.ok(C.toDXF(model).includes('MOUNTS_WALL'));
});
test('v6 CAD: snap points are optional and use deterministic geometry',()=>{
 const points=C.referencePoints(base);assert.ok(points.some((p:any)=>p.kind==='end'&&p.xMm===0));
 assert.equal(C.snapToReference(base,7,0,{enabled:true,radiusMm:25}).xMm,0);
 assert.equal(C.snapToReference(base,7,0,{enabled:false}).xMm,7);
});
test('v6 CAD: workshop drawing data contains exact X/Z, holes and profile cuts',()=>{
 const d=structuredClone(base),o=d.objects.find((o:any)=>o.kind==='wall');o.rotationDeg=25;o.yawDeg=45;o.holePattern='grid';
 const report=C.fabricationPlan(d);
 assert.equal(report.lengthMm,5900);
 const mount=report.mounts.find((x:any)=>x.id===o.id);
 assert.equal(mount.rotationDeg,25);assert.equal(mount.yawDeg,45);
 assert.equal(mount.holes.length,o.holeCount);
 assert.ok(report.positions.length>0&&report.pieces.length>0);
});
test('v6 CAD: UI contains collapsible tool panels, angle controls and dimensioned A3 package',()=>{
 const ui=read('steelvision-detailer-ui.js'),css=read('steelvision-detailer.css');
 for(const word of ['decoratePanels','sv-panelcard',"field(\'rotationDeg\'",'data-action="show-points"','data-action="snap-points"','fabri'+'cationHTML','data-helper-kind','data-action="print"'])assert.ok(ui.includes(word),word);
 assert.ok(ui.includes("ev.stopPropagation()"),'editor events must not trigger calculator navigation');
 assert.ok(css.includes('.sv-panelcard')&&css.includes('.sv-cadbar'));
});
test('v6 CAD: PDF email attachment includes rotated plate and dimensioned mount pages',()=>{
 const source=structuredClone(design);
 source.state.detailSheets[0].drawing.objects.find((o:any)=>o.kind==='wall').rotationDeg=37;
 source.state.detailSheets[0].drawing.objects.find((o:any)=>o.kind==='wall').yawDeg=25;
 const a=steelAttachments(contact,source,'BCS-0000QA6');
 assert.equal(a.length,3);
 const pdf=Buffer.from(a[0].content,'base64').toString('latin1');
 assert.ok(pdf.includes('DIMENSIONED MOUNT PLATE'));
 assert.ok(pdf.includes('Hole coordinates from left'));
 assert.ok(pdf.includes('Orientation in assembly'));
 const json=JSON.parse(Buffer.from(a[2].content,'base64').toString('utf8'));
 assert.equal(json.design.state.detailSheets[0].drawing.objects.find((o:any)=>o.kind==='wall').rotationDeg,37);
});
