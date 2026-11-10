/* SteelVision Detailer 3.0 — purely geometric concept drafting, not load-bearing approval */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.SVDetailCore=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const safe=(x,n=140)=>String(x??'').slice(0,n);
const num=(x,d=0)=>{const n=Number(x);return Number.isFinite(n)?n:d;};
const clamp=(v,min,max,d=min)=>Math.max(min,Math.min(max,num(v,d)));
const rnd=(v,p=1)=>Math.round((Number(v)||0)*10**p)/10**p;
const esc=s=>safe(s,10000).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const makeId=()=>`OBJ-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
function base(){return {app:'steelvision-detailer',schema:3,productType:'railing',name:'Balustrada 514 + skrzydełka · 2 szt.',revision:'A',quantity:2,material:'Stal S235 + ocynk',finish:'Ocynk ogniowy',heightMm:1120,lowerExtensionMm:170,topRail:'60x40x3',bottomRail:'60x40x3',postProfile:'40x40x3',panelType:'Blacha pełna',panelThicknessMm:3,clearPanelHeightMm:1000,snapMm:10,postIntervalMm:860,extraProfiles:[],segments:[{id:'s1',name:'Skrzydło L',lengthMm:380,angleDeg:90},{id:'s2',name:'Front',lengthMm:5140,angleDeg:0},{id:'s3',name:'Skrzydło P',lengthMm:380,angleDeg:-90}],objects:[
{id:'p1',kind:'post',xMm:0,zMm:0,label:'Słupek pocz.'},{id:'p2',kind:'post',xMm:380,zMm:0,label:'Słupek 1'},
...Array.from({length:5},(_,i)=>({id:'p'+(i+3),kind:'post',xMm:380+(i+1)*857,zMm:0,label:'Słupek '+(i+2)})),
{id:'p8',kind:'post',xMm:5520,zMm:0,label:'Słupek 7'},{id:'p9',kind:'post',xMm:5900,zMm:0,label:'Słupek końc.'},
...Array.from({length:7},(_,i)=>({id:'m'+(i+1),kind:'under',xMm:380+i*857,zMm:0,label:'Wspornik '+(i+1),plateWidthMm:120,plateHeightMm:25,holeDiaMm:10,holeCount:2,projectionMm:440,dropMm:170,face:'front'})),
...Array.from({length:6},(_,i)=>({id:'c'+(i+1),kind:'plate',xMm:380+i*857+425,zMm:900,label:'Blaszka '+(i+1),plateWidthMm:60,plateHeightMm:25,holeDiaMm:10,holeCount:1,face:'front'})),
{id:'w1',kind:'wall',xMm:0,zMm:900,label:'Ściana L',plateWidthMm:100,plateHeightMm:100,holeDiaMm:12,holeCount:4,face:'left'},
{id:'w2',kind:'wall',xMm:5900,zMm:900,label:'Ściana P',plateWidthMm:100,plateHeightMm:100,holeDiaMm:12,holeCount:4,face:'right'}],notes:['Zmiana detalu: blaszka pojedyncza 60×25 mm, podwójna 120×25 mm, otwory Ø10 mm','Dodatkowe mocowania na środku tylko dużych pól','Lewy koniec: lokalne podniesienie o +40 mm — do potwierdzenia'],leftRaiseMm:40,engineeringApproved:false};}
const PRODUCT_TYPES={railing:'Balustrada',fence:'Ogrodzenie',stairs:'Schody',gate:'Brama / furtka',frame:'Konstrukcja stalowa',platform:'Podest / pomost',screen:'Ścianka / osłona',custom:'Inny element'};
const allowedKind=new Set(['post','plate','under','wall','support','note','beam','brace','step','hinge','panel']);
function normalize(raw){let def=base(),d={...def,...(raw&&typeof raw==='object'?raw:{})};d.productType=PRODUCT_TYPES[d.productType]?d.productType:'railing';d.name=safe(d.name,180);d.revision=safe(d.revision,15);d.quantity=Math.floor(clamp(d.quantity,1,100,1));for(const k of ['heightMm','lowerExtensionMm','panelThicknessMm','clearPanelHeightMm','snapMm','postIntervalMm','leftRaiseMm'])d[k]=clamp(d[k],k==='heightMm'?350:0,k==='heightMm'?3500:10000,def[k]);for(const k of ['material','finish','topRail','bottomRail','postProfile','panelType'])d[k]=safe(d[k]);d.segments=(Array.isArray(d.segments)?d.segments:[]).slice(0,30).map((s,i)=>({id:safe(s.id||'s'+i,40),name:safe(s.name||'Odcinek '+(i+1)),lengthMm:clamp(s.lengthMm,50,30000,1000),angleDeg:clamp(s.angleDeg,-360,360,0)}));if(!d.segments.length)d.segments=def.segments;const L=d.segments.reduce((a,s)=>a+s.lengthMm,0);d.objects=(Array.isArray(d.objects)?d.objects:[]).slice(0,400).filter(o=>o&&typeof o==='object'&&allowedKind.has(o.kind)).map((o,i)=>({id:safe(o.id||'o'+i,90),kind:o.kind,label:safe(o.label,100),xMm:clamp(o.xMm,0,L,0),zMm:clamp(o.zMm,-1000,5000,0),plateWidthMm:clamp(o.plateWidthMm,10,1000,o.kind==='plate'?60:120),plateHeightMm:clamp(o.plateHeightMm,10,1000,25),holeDiaMm:clamp(o.holeDiaMm,0,120,10),holeCount:Math.floor(clamp(o.holeCount,0,16,2)),projectionMm:clamp(o.projectionMm,0,2000,440),dropMm:clamp(o.dropMm,0,1500,170),spanMm:clamp(o.spanMm,0,30000,750),riseMm:clamp(o.riseMm,-3000,3000,0),profile:safe(o.profile||d.postProfile,55),rotationDeg:clamp(o.rotationDeg,-360,360,0),yawDeg:clamp(o.yawDeg,-360,360,0),holeEdgeMm:clamp(o.holeEdgeMm,0,300,10),holePattern:['auto','line','grid','custom'].includes(o.holePattern)?o.holePattern:'auto',
plateThicknessMm:clamp(o.plateThicknessMm,1,80,6),
referenceId:safe(o.referenceId||'',90),offsetXmm:clamp(o.offsetXmm,-30000,30000,0),offsetZmm:clamp(o.offsetZmm,-6000,6000,0),normalOffsetMm:clamp(o.normalOffsetMm,-2000,2000,0),
connectionMethod:['unspecified','weld','bolt','clamp'].includes(o.connectionMethod)?o.connectionMethod:'unspecified',
customHoles:(Array.isArray(o.customHoles)?o.customHoles:[]).slice(0,16).filter(p=>p&&typeof p==='object').map(p=>({x:clamp(p.x,0,1000,0),y:clamp(p.y,0,1000,0)})),
face:['front','back','left','right','underside'].includes(o.face)?o.face:'front'}));// Keep linked fasteners positioned relative to their selected component.
// X/Z are derived so downstream 2D, 3D, BOM and PDF read one consistent point.
const refs=new Map(d.objects.map(o=>[o.id,o]));
const resolve=(o,visiting=new Set())=>{
 if(!o.referenceId)return [o.xMm,o.zMm];
 if(visiting.has(o.id))return [o.xMm,o.zMm];
 const next=new Set(visiting);next.add(o.id);
 let target;
 if(o.referenceId==='@start'||o.referenceId==='@floor')target=[0,0];
 else if(o.referenceId==='@end')target=[L,0];
 else if(o.referenceId==='@upper')target=[0,d.heightMm];
 else if(o.referenceId==='@leftwall')target=[0,d.heightMm/2];
 else if(o.referenceId==='@rightwall')target=[L,d.heightMm/2];
 else {const t=refs.get(o.referenceId);if(!t||next.has(t.id))return [o.xMm,o.zMm];target=resolve(t,next);}
 return [clamp(target[0]+o.offsetXmm,0,L,o.xMm),clamp(target[1]+o.offsetZmm,-1000,5000,o.zMm)];
};
for(const o of d.objects)if(o.referenceId){const [x,z]=resolve(o);o.xMm=x;o.zMm=z;}
d.extraProfiles=(Array.isArray(d.extraProfiles)?d.extraProfiles:[]).slice(0,40).filter(e=>e&&typeof e==='object').map((e,i)=>({id:safe(e.id||'X'+i,50),label:safe(e.label||'Dodatkowy profil '+(i+1),100),profile:safe(e.profile||d.topRail,55),fromMm:clamp(e.fromMm,0,L,0),toMm:clamp(e.toMm,0,L,L),gapMm:clamp(e.gapMm,-500,2000,80),sideMm:clamp(e.sideMm,-1000,1000,0)}));d.notes=(Array.isArray(d.notes)?d.notes:[]).slice(0,80).map(s=>safe(s,400));d.engineeringApproved=Boolean(d.engineeringApproved);d.app='steelvision-detailer';d.schema=3;return d;}
const REFERENCE_TARGETS={'@start':'Początek odcinka','@end':'Koniec odcinka','@upper':'Górna krawędź / pochwyt','@floor':'Posadzka / baza','@leftwall':'Ściana lewa','@rightwall':'Ściana prawa'};
function mountTargets(raw,selectedId=''){
 const d=normalize(raw);return [{id:'',label:'Położenie swobodne (X / Z)'},
 ...Object.entries(REFERENCE_TARGETS).map(([id,label])=>({id,label})),
 ...d.objects.filter(o=>o.id!==selectedId && o.kind!=='note').map(o=>({id:o.id,label:(o.label||o.kind)+' · '+o.kind+' ['+Math.round(o.xMm)+' / '+Math.round(o.zMm)+']'}))];
}
function attachMount(raw,id,referenceId,keepPosition=false){
 const d=normalize(raw),o=d.objects.find(o=>o.id===id);if(!o)return d;
 const target=mountTargets(d,id).some(t=>t.id===referenceId)?referenceId:'';
 if(!target){o.referenceId='';return normalize(d);}
 const probe=normalize({...d,objects:d.objects.map(p=>p.id===id?{...p,referenceId:target,offsetXmm:0,offsetZmm:0}:p)});
 const at=probe.objects.find(p=>p.id===id);
 o.referenceId=target;o.offsetXmm=keepPosition?o.xMm-at.xMm:0;o.offsetZmm=keepPosition?o.zMm-at.zMm:0;
 return normalize(d);
}
function moveAbsolute(raw,id,x,z){
 const d=normalize(raw),o=d.objects.find(o=>o.id===id);if(!o)return d;
 const xx=clamp(x,0,length(d),o.xMm),zz=clamp(z,-1000,5000,o.zMm);
 if(o.referenceId){o.offsetXmm+=xx-o.xMm;o.offsetZmm+=zz-o.zMm;}
 else{o.xMm=xx;o.zMm=zz;}
 return normalize(d);
}
function length(d){return normalize(d).segments.reduce((s,x)=>s+x.lengthMm,0);}
function pathPoints(d){let p=[[0,0]],heading=0,at=0;for(let s of normalize(d).segments){heading=s.angleDeg*Math.PI/180;let last=p[p.length-1];p.push([rnd(last[0]+s.lengthMm*Math.cos(heading),4),rnd(last[1]+s.lengthMm*Math.sin(heading),4)]);at+=s.lengthMm;}return p;}
function atStation(d,s){let segs=normalize(d).segments,point=[0,0],remaining=Math.max(0,Math.min(s,segs.reduce((a,b)=>a+b.lengthMm,0)));for(const g of segs){const use=Math.min(remaining,g.lengthMm),a=g.angleDeg*Math.PI/180;point=[point[0]+use*Math.cos(a),point[1]+use*Math.sin(a)];remaining-=use;if(remaining<=0)break;}return point;}
function profileSection(profile){let parts=safe(profile).match(/^(\d+(?:\.\d+)?)[xX×](\d+(?:\.\d+)?)(?:[xX×](\d+(?:\.\d+)?))?$/);if(!parts)return {a:40,b:40,t:2,kgPerM:0};let a=+parts[1],b=+parts[2],t=Math.min(+parts[3]||2,a/2,b/2);let area=a*b-(a-2*t)*(b-2*t);return {a,b,t,kgPerM:rnd(area*.00785,3)};}
function summary(raw){const d=normalize(raw),l=d.segments.reduce((a,s)=>a+s.lengthMm,0),post=d.objects.filter(x=>x.kind==='post'),plates=d.objects.filter(x=>['plate','wall'].includes(x.kind)),under=d.objects.filter(x=>x.kind==='under'),supports=d.objects.filter(x=>x.kind==='support');const rails=(l*2)/1000;const postM=post.length*d.heightMm/1000;let kg=rnd(l/1000*(profileSection(d.topRail).kgPerM+profileSection(d.bottomRail).kgPerM)+postM*profileSection(d.postProfile).kgPerM);const extraRailM=rnd(d.extraProfiles.reduce((n,p)=>n+Math.max(0,p.toMm-p.fromMm),0)/1000,3);kg=rnd(kg+d.extraProfiles.reduce((n,p)=>n+Math.max(0,p.toMm-p.fromMm)/1000*profileSection(p.profile).kgPerM,0));const panelsM2=rnd(l*d.clearPanelHeightMm/1000000,3);if(d.panelType.toLowerCase().includes('blacha'))kg=rnd(kg+panelsM2*d.panelThicknessMm*7.85);return {lengthMm:l,bays:Math.max(0,post.length-1),posts:post.length,plates:plates.length,under:under.length,supports:supports.length,topRailM:rnd(l/1000,3),bottomRailM:rnd(l/1000,3),postM:rnd(postM,3),extraRailM,panelM2:panelsM2,massKgEstimate:kg,quantity:d.quantity};}
function validate(raw){const d=normalize(raw),s=summary(d),issues=[];if(['railing','fence','screen'].includes(d.productType)&&s.posts<2)issues.push({level:'error',code:'POSTS',message:'Wstaw co najmniej dwa słupki.'});if(d.productType==='gate'&&!d.objects.some(o=>o.kind==='hinge'))issues.push({level:'warning',code:'HINGE',message:'Nie dodano zawiasów bramy — sprawdź sposób podparcia.'});if(d.segments.some(x=>x.lengthMm<200))issues.push({level:'warning',code:'SHORT',message:'Bardzo krótki odcinek — sprawdź możliwość wykonania.'});if(d.objects.some(o=>o.xMm<0||o.xMm>s.lengthMm))issues.push({level:'error',code:'OUTSIDE',message:'Element poza odcinkiem.'});const posts=d.objects.filter(x=>x.kind==='post').sort((a,b)=>a.xMm-b.xMm);for(let i=1;i<posts.length;i++){const dist=posts[i].xMm-posts[i-1].xMm;if(dist<=0)issues.push({level:'error',code:'POST_DUP',message:'Dwa słupki mają tę samą stację.'});if(dist>d.postIntervalMm)issues.push({level:'warning',code:'SPAN',message:`Rozstaw słupków ${rnd(dist,0)} mm przekracza ustawiony limit informacyjny ${d.postIntervalMm} mm.`});}
for(let o of d.objects.filter(x=>['plate','under','wall'].includes(x.kind))){if(o.plateWidthMm<o.holeDiaMm+10)issues.push({level:'warning',code:'HOLE_EDGE',message:`${o.label||o.id}: szerokość blaszki może być za mała względem otworu.`});if(o.holeCount>0&&o.holeDiaMm<=0)issues.push({level:'error',code:'HOLE',message:`${o.label||o.id}: brak średnicy otworu.`});if(o.kind==='under'&&o.projectionMm===0)issues.push({level:'warning',code:'SUPPORT_PROJ',message:`${o.label||o.id}: brak wysięgu wspornika.`});if(o.holeCount>0&&o.holeDiaMm>=Math.min(o.plateWidthMm,o.plateHeightMm))issues.push({level:'warning',code:'HOLE_GEOMETRY',message:`${o.label||o.id}: średnica otworu może nie mieścić się w blaszce.`});}
for(const profile of d.extraProfiles){if(profile.toMm<=profile.fromMm)issues.push({level:'error',code:'EXTRA_PROFILE_RANGE',message:'Dodatkowy profil '+profile.label+': koniec musi być za początkiem.'});if(profileSection(profile.profile).kgPerM<=0)issues.push({level:'warning',code:'EXTRA_PROFILE_SPEC',message:'Nieznany przekrój profilu '+profile.profile+' — masa może być niepełna.'});}
for(const o of d.objects.filter(o=>o.referenceId)){
 const target=mountTargets(d,o.id).some(t=>t.id===o.referenceId);
 if(!target)issues.push({level:'warning',code:'MISSING_TARGET',message:(o.label||o.id)+': nie odnaleziono wybranego punktu odniesienia.'});
}
for(const o of d.objects.filter(o=>['plate','wall','under','hinge'].includes(o.kind))){
 const holes=detailDims(o).holes,rad=o.holeDiaMm/2;
 if(holes.some(p=>p.x-rad<0||p.y-rad<0||p.x+rad>o.plateWidthMm||p.y+rad>o.plateHeightMm))
  issues.push({level:'error',code:'HOLE_OUTSIDE',message:(o.label||o.id)+': otwór wychodzi poza obrys blachy.'});
 for(let a=0;a<holes.length;a++)for(let b=a+1;b<holes.length;b++)if(Math.hypot(holes[a].x-holes[b].x,holes[a].y-holes[b].y)<o.holeDiaMm)
  issues.push({level:'warning',code:'HOLES_OVERLAP',message:(o.label||o.id)+': osie otworów za blisko siebie.'});
}
if(!d.engineeringApproved)issues.push({level:'info',code:'ENGINEERING',message:'Obciążenia, kotwy, spoiny i podłoże wymagają niezależnej weryfikacji projektanta.'});return issues;}
function bom(raw){const d=normalize(raw),s=summary(d),cnt={};for(let o of d.objects){let key= o.kind==='post'?'Słupek '+d.postProfile: o.kind==='plate'?'Blaszka '+o.plateWidthMm+'×'+o.plateHeightMm+'×'+o.plateThicknessMm+' '+o.face+' '+o.holeCount+'×Ø'+o.holeDiaMm:o.kind==='under'?'Wspornik od spodu '+o.projectionMm+'×'+o.dropMm+' / '+o.plateWidthMm+'×'+o.plateHeightMm+' '+o.holeCount+'×Ø'+o.holeDiaMm:o.kind==='wall'?'Mocowanie do ściany ('+o.face+') '+o.plateWidthMm+'×'+o.plateHeightMm+' '+o.holeCount+'×Ø'+o.holeDiaMm:o.kind==='support'?'Podpora dodatkowa':o.kind==='hinge'?'Zawias / mocowanie bramy':o.kind==='beam'?'Belka '+o.profile+' '+Math.round(Math.hypot(o.spanMm,o.riseMm))+' mm':o.kind==='brace'?'Stężenie '+o.profile+' '+Math.round(Math.hypot(o.spanMm,o.riseMm))+' mm':o.kind==='step'?'Stopień / stopnica '+Math.round(o.spanMm)+' mm':o.kind==='panel'?'Panel / wypełnienie '+Math.round(o.spanMm)+' mm':'Adnotacja';if(o.kind==='note')continue;cnt[key]=(cnt[key]||0)+1;}return [{name:'Profil górny '+d.topRail,qty:d.quantity,unit:'odc.',lengthMm:s.lengthMm,remark:'Całość z podziałem na odcinki'},{name:'Profil dolny '+d.bottomRail,qty:d.quantity,unit:'odc.',lengthMm:s.lengthMm,remark:'Całość z podziałem na odcinki'},...d.extraProfiles.filter(p=>p.toMm>p.fromMm).map(p=>({name:'Dodatkowy profil górny '+p.profile+' — '+p.label,qty:d.quantity,unit:'odc.',lengthMm:Math.round(p.toMm-p.fromMm),remark:'Odstęp pionowy '+p.gapMm+' mm / odsunięcie boczne '+p.sideMm+' mm'})),...Object.entries(cnt).map(([name,qty])=>({name,qty:qty*d.quantity,unit:'szt.',lengthMm:null,remark:''})),{name:d.panelType+' '+d.panelThicknessMm+' mm',qty:rnd(s.panelM2*d.quantity,3),unit:'m²',lengthMm:null,remark:'Rozkrój płyt do osobnej optymalizacji'}];}
function detailDims(o){
 const obj=o||{kind:'plate',plateWidthMm:120,plateHeightMm:25,holeDiaMm:10,holeCount:2};
 const w=clamp(obj.plateWidthMm,10,1000,120),h=clamp(obj.plateHeightMm,10,1000,25),holeCount=Math.floor(clamp(obj.holeCount,0,16,2)),dia=clamp(obj.holeDiaMm,0,120,10),edge=Math.max(0,Math.min(clamp(obj.holeEdgeMm,0,300,10),w/2-dia/2,h/2-dia/2));
 const pattern=['auto','line','grid','custom'].includes(obj.holePattern)?obj.holePattern:'auto';
 if(pattern==='custom'&&Array.isArray(obj.customHoles)&&obj.customHoles.length){
  const custom=obj.customHoles.slice(0,16).map(p=>({x:rnd(clamp(p.x,0,w,w/2),2),y:rnd(clamp(p.y,0,h,h/2),2)}));
  return {w,h,holeCount:custom.length,dia,pattern,holes:custom};
 }
 const grid=pattern==='grid'||pattern==='auto'&&holeCount>=4;
 const columns=grid?Math.ceil(holeCount/2):Math.max(1,holeCount),rows=grid?2:1;
 const usableW=Math.max(0,w-2*Math.max(edge,dia/2+2)),usableH=Math.max(0,h-2*Math.max(edge,dia/2+2));
 const left=(w-usableW)/2,top=(h-usableH)/2;
 const holes=Array.from({length:holeCount},(_,i)=>{
   const row=grid?Math.floor(i/columns):0,col=grid?i%columns:i;
   return {x:rnd(columns===1?w/2:pattern==='auto'&&!grid?w*(col+1)/(columns+1):left+usableW*col/(columns-1),2),y:rnd(rows===1?h/2:top+usableH*row/(rows-1),2)};
 });
 return {w,h,holeCount,dia,pattern,holes};
}
function rotate2(dx,dy,degrees){const a=num(degrees)*Math.PI/180,c=Math.cos(a),s=Math.sin(a);return [rnd(dx*c-dy*s,4),rnd(dx*s+dy*c,4)];}
function mountPoints2D(o){const d=detailDims(o),a=num(o.rotationDeg),pos={x:num(o.xMm),z:num(o.zMm)},point=(x,y)=>{const r=rotate2(x-d.w/2,y-d.h/2,a);return {x:rnd(pos.x+r[0],3),z:rnd(pos.z+r[1],3)};};return {corners:[point(0,0),point(d.w,0),point(d.w,d.h),point(0,d.h)],holes:d.holes.map(h=>point(h.x,h.y)),dims:d};}
function referencePoints(raw){const d=normalize(raw),L=d.segments.reduce((n,g)=>n+g.lengthMm,0),r=[],push=(x,z,kind,label)=>r.push({xMm:rnd(x,2),zMm:rnd(z,2),kind,label});
 let at=0;push(0,0,'end','Początek');for(const seg of d.segments){push(at+seg.lengthMm/2,0,'mid','Środek '+seg.name);at+=seg.lengthMm;push(at,0,'end','Koniec '+seg.name);}
 const posts=d.objects.filter(o=>o.kind==='post').sort((a,b)=>a.xMm-b.xMm);for(const o of posts){push(o.xMm,0,'post','Oś '+o.label);push(o.xMm,d.heightMm,'post','Góra '+o.label);}for(let i=1;i<posts.length;i++)push((posts[i-1].xMm+posts[i].xMm)/2,0,'bay','Środek pola');
 for(const o of d.objects.filter(o=>['wall','plate','under','support'].includes(o.kind)))push(o.xMm,o.zMm,'mount','Mocowanie '+o.label);
 return r.filter((p,i)=>r.findIndex(q=>q.xMm===p.xMm&&q.zMm===p.zMm&&q.kind===p.kind)===i).slice(0,350);
}
function snapToReference(raw,x,z,{radiusMm=75,enabled=true,axis='both',excludeKind=''}={}){
 if(!enabled)return {xMm:x,zMm:z,matched:null};
 const pts=referencePoints(raw).filter(p=>p.kind!==excludeKind),eps=Math.max(1,num(radiusMm,75));let best=null,dist=eps;
 for(const p of pts){const dx=Math.abs(p.xMm-x),dz=Math.abs(p.zMm-z);const dd=axis==='x'?dx:axis==='z'?dz:Math.hypot(dx,dz);if(dd<=dist){dist=dd;best=p;}}
 return best?{xMm:axis==='z'?x:best.xMm,zMm:axis==='x'?z:best.zMm,matched:best}:{xMm:x,zMm:z,matched:null};
}
function fabricationPlan(raw){const d=normalize(raw),L=length(d),positions=d.objects.filter(o=>o.kind==='post').map(o=>({id:o.id,label:o.label,xMm:o.xMm})).sort((a,b)=>a.xMm-b.xMm),mounts=d.objects.filter(o=>['plate','under','wall','hinge','support'].includes(o.kind)).map(o=>({id:o.id,kind:o.kind,label:o.label,xMm:o.xMm,zMm:o.zMm,face:o.face,rotationDeg:o.rotationDeg,yawDeg:o.yawDeg,widthMm:o.plateWidthMm,heightMm:o.plateHeightMm,holeDiaMm:o.holeDiaMm,holeCount:o.holeCount,holePattern:o.holePattern,holeEdgeMm:o.holeEdgeMm,projectionMm:o.projectionMm,dropMm:o.dropMm,
plateThicknessMm:o.plateThicknessMm,referenceId:o.referenceId,offsetXmm:o.offsetXmm,offsetZmm:o.offsetZmm,
normalOffsetMm:o.normalOffsetMm,connectionMethod:o.connectionMethod,customHoles:o.customHoles,
holes:detailDims(o).holes}));
 const pieces=[];for(const s of d.segments){pieces.push({label:'Profil górny '+s.name,profile:d.topRail,lengthMm:s.lengthMm});if(d.bottomRail!=='Brak')pieces.push({label:'Profil dolny '+s.name,profile:d.bottomRail,lengthMm:s.lengthMm});}
 for(const p of d.extraProfiles){let at=0;for(const s of d.segments){const from=Math.max(at,p.fromMm),to=Math.min(at+s.lengthMm,p.toMm);if(to>from)pieces.push({label:p.label+' · '+s.name,profile:p.profile,lengthMm:to-from,offsetMm:p.sideMm,gapMm:p.gapMm});at+=s.lengthMm;}}
 for(const o of d.objects.filter(o=>o.kind==='post'))pieces.push({label:o.label,profile:d.postProfile,lengthMm:d.heightMm});
 return {schema:1,project:d.name,revision:d.revision,quantity:d.quantity,productType:d.productType,segments:d.segments.map(s=>({...s})),lengthMm:L,heightMm:d.heightMm,positions,mounts,extraProfiles:d.extraProfiles.map(p=>({...p})),pieces,bom:bom(d),warnings:validate(d),note:'Geometria koncepcyjna. Sprawdź tolerancje, obciążenia, materiał, kotwy, połączenia i pomiar przed wydaniem na produkcję.'};
}
function toDXF(raw){const d=normalize(raw),s=summary(d),lines=['0','SECTION','2','HEADER','9','$ACADVER','1','AC1009','0','ENDSEC','0','SECTION','2','ENTITIES'];const line=(x1,y1,x2,y2,layer)=>{lines.push('0','LINE','8',layer,'10',String(rnd(x1,3)),'20',String(rnd(y1,3)),'30','0','11',String(rnd(x2,3)),'21',String(rnd(y2,3)),'31','0')};const circ=(x,y,r,layer)=>lines.push('0','CIRCLE','8',layer,'10',String(rnd(x,3)),'20',String(rnd(y,3)),'30','0','40',String(rnd(r,3)));const rect=(x,y,w,h,layer)=>{line(x,y,x+w,y,layer);line(x+w,y,x+w,y+h,layer);line(x+w,y+h,x,y+h,layer);line(x,y+h,x,y,layer)};rect(0,0,s.lengthMm,d.heightMm,'FRONT_RAILS');for(let o of d.objects){if(o.kind==='post')rect(o.xMm-profileSection(d.postProfile).a/2,0,profileSection(d.postProfile).a,d.heightMm,'POSTS');if(['plate','wall','under'].includes(o.kind)){const dt=detailDims(o);const layer=o.kind==='wall'?'MOUNTS_WALL':o.kind==='under'?'MOUNTS_UNDERSIDE':'MOUNTS_PLATES';const shape=mountPoints2D(o);for(let i=0;i<4;i++){const a=shape.corners[i],b=shape.corners[(i+1)%4];line(a.x,a.z,b.x,b.z,layer);}for(const hole of shape.holes)circ(hole.x,hole.z,dt.dia/2,'HOLES');if(o.kind==='under'){line(o.xMm,0,o.xMm,-o.dropMm,'SUPPORTS');line(o.xMm,-o.dropMm,o.xMm+o.projectionMm,-o.dropMm,'SUPPORTS');}}if(o.kind==='support')line(o.xMm,0,o.xMm,-o.dropMm,'SUPPORTS');if(['beam','brace','step'].includes(o.kind))line(o.xMm,o.zMm,o.xMm+o.spanMm,o.zMm+o.riseMm,o.kind.toUpperCase()+'S');if(o.kind==='panel')rect(o.xMm,o.zMm,Math.max(1,o.spanMm),Math.max(1,o.riseMm||300),'PANELS');if(o.kind==='hinge')circ(o.xMm,o.zMm,Math.max(8,o.holeDiaMm/2),'HINGES');}for(const p of d.extraProfiles){if(p.toMm<=p.fromMm)continue;const z=extraProfileHeight(d,p);line(p.fromMm,z,p.toMm,z,'EXTRA_TOP_PROFILES');}const pts=pathPoints(d);for(let i=0;i<pts.length-1;i++)line(pts[i][0],pts[i][1]-2400,pts[i+1][0],pts[i+1][1]-2400,'PLAN');lines.push('0','ENDSEC','0','EOF');return lines.join('\n')+'\n';}
function duplicateObjects(raw,ids,dx=100,dz=0){
 const d=normalize(raw),wanted=new Set(Array.isArray(ids)?ids:[ids]),existing=new Set(d.objects.map(x=>x.id));
 const copied=[];let seq=1,L=length(d);
 for(const original of [...wanted].map(id=>d.objects.find(o=>o.id===id)).filter(Boolean)){
  if(d.objects.length+copied.length>=400)break;
  let id;do{id=original.id+'-copy'+seq++;}while(existing.has(id));existing.add(id);
  copied.push({...original,id,label:safe((original.label||original.kind)+' (kopia)',100),
   xMm:clamp(original.xMm+num(dx),0,L,original.xMm),zMm:clamp(original.zMm+num(dz),-1000,5000,original.zMm),
   offsetXmm:original.referenceId?original.offsetXmm+num(dx):original.offsetXmm,
   offsetZmm:original.referenceId?original.offsetZmm+num(dz):original.offsetZmm});
 }
 d.objects.push(...copied);return {drawing:normalize(d),ids:copied.map(x=>x.id)};
}
function repeatObjects(raw,ids,count=2,stepMm=500){
 let d=normalize(raw),selection=Array.isArray(ids)?ids:[ids],originals=d.objects.filter(o=>selection.includes(o.id));
 let added=[];const n=Math.floor(clamp(count,1,50,2)),step=clamp(stepMm,-30000,30000,500);
 for(let k=1;k<=n;k++){
  if(d.objects.length>=400)break;
  const copies=duplicateObjects(d,originals.map(o=>o.id),step*k,0);
  const newObjects=copies.drawing.objects.slice(d.objects.length);
  // A copied object at either end may coincide with existing geometry. Keep it,
  // but let validation flag overlapping posts rather than silently altering coordinates.
  d=copies.drawing;added.push(...newObjects.map(o=>o.id));
 }
 return {drawing:d,ids:added};
}
function transformObjects(raw,ids,{dx=0,dz=0,alignZ=null,space=null}={}){
 const d=normalize(raw),wanted=new Set(Array.isArray(ids)?ids:[ids]);const selected=d.objects.filter(o=>wanted.has(o.id));if(!selected.length)return d;
 if(alignZ!==null){const z=clamp(alignZ,-1000,5000,0);for(const o of selected)o.zMm=z;}
 if(space!==null&&selected.length>2){const order=[...selected].sort((a,b)=>a.xMm-b.xMm),first=order[0].xMm,last=order[order.length-1].xMm;
  const step=Math.max(0,last-first)/(order.length-1);order.forEach((o,i)=>o.xMm=rnd(first+step*i,1));}
 for(const o of selected){
  const nx=clamp(o.xMm+num(dx),0,length(d),o.xMm),nz=clamp(o.zMm+num(dz),-1000,5000,o.zMm);
  if(o.referenceId&&!wanted.has(o.referenceId)){
    o.offsetXmm+=nx-o.xMm;o.offsetZmm+=nz-o.zMm;
  }else{o.xMm=nx;o.zMm=nz;}
 }
 return normalize(d);
}


/** Independent, editable concept geometry for each product family. Values are not structural sizing. */

// One geometric source for elevation, real 3D preview, material list and exports.
// Coordinates are mm in the editable drawing and metres in the scene returned below.
function extraProfileHeight(raw,p){const d=normalize(raw);return rnd(d.heightMm+p.gapMm+profileSection(p.profile).b/2,3)}
function sceneFrom(raw){
 const d=normalize(raw),segments=d.segments,L=segments.reduce((a,x)=>a+x.lengthMm,0);
 const scene={lines:[],plates:[],panels:[],anchors:[]};
 const pt=(station,z=0,side=0)=>{
  const v=atStation(d,station),sec=stationSection(station),a=sec.angleDeg*Math.PI/180;
  return [(v[0]-Math.sin(a)*side)/1000,(v[1]+Math.cos(a)*side)/1000,z/1000];
 };
 function stationSection(x){let at=0;for(const s of segments){if(x<=at+s.lengthMm+1e-7)return s;at+=s.lengthMm;}return segments[segments.length-1]||{angleDeg:0};}
 function run(from,to,zA,zB,kind,side=0,profile=''){
   let position=0;for(const seg of segments){const start=Math.max(from,position),end=Math.min(to,position+seg.lengthMm);if(end>start+1e-7){const t1=(start-from)/Math.max(.001,to-from),t2=(end-from)/Math.max(.001,to-from);scene.lines.push({a:pt(start,zA+(zB-zA)*t1,side),b:pt(end,zA+(zB-zA)*t2,side),kind,profile});}position+=seg.lengthMm;}
 }
 const linear=['railing','fence','screen','custom'].includes(d.productType);
 if(linear){const upper=d.heightMm-profileSection(d.topRail).b/2;run(0,L,upper,upper,'accent',0,d.topRail);if(d.bottomRail!=='Brak')run(0,L,60,60,'beam',0,d.bottomRail);
   if(d.panelType!=='Brak'&&!d.objects.some(o=>o.kind==='panel')){
    const posts=d.objects.filter(o=>o.kind==='post').slice().sort((a,b)=>a.xMm-b.xMm),edge=profileSection(d.postProfile).a/2;
    for(let i=1;i<posts.length;i++){const from=posts[i-1].xMm+edge,to=posts[i].xMm-edge;let position=0;for(const seg of segments){const a=Math.max(position,from),b=Math.min(position+seg.lengthMm,to);if(b>a+1e-7){scene.panels.push({a:pt(a,60),b:pt(b,60),h:Math.max(.1,(d.heightMm-60-profileSection(d.topRail).b)/1000),kind:d.panelType.toLowerCase().includes('szk')?'glass':'sheet'});}position+=seg.lengthMm;}}
   }
 }
 for(const extra of d.extraProfiles)if(extra.toMm>extra.fromMm){const z=extraProfileHeight(d,extra);run(extra.fromMm,extra.toMm,z,z,'accent',extra.sideMm,extra.profile);}
 for(const o of d.objects){const x=o.xMm,z=o.zMm;
  if(o.kind==='post')scene.lines.push({a:pt(x,0),b:pt(x,d.heightMm),kind:'post',profile:d.postProfile});
  if(['beam','brace','step'].includes(o.kind)){run(x,Math.min(L,x+o.spanMm),z,z+o.riseMm,o.kind==='brace'?'beam':o.kind==='step'?'infill':'accent',0,o.profile);}
  if(o.kind==='panel'){const width=Math.max(0,Math.min(L-x,o.spanMm));if(width>0)scene.panels.push({a:pt(x,z),b:pt(x+width,z),h:Math.abs(o.riseMm||300)/1000,kind:'sheet'});}
  if(o.kind==='support'){scene.lines.push({a:pt(x,0),b:pt(x,-o.dropMm),kind:'post'});}
  if(['under','wall','plate','hinge'].includes(o.kind)){
   const p=pt(x,z,o.normalOffsetMm),sec=stationSection(x),a=sec.angleDeg*Math.PI/180;
   const tangent=[Math.cos(a),Math.sin(a),0],normal=[-Math.sin(a),Math.cos(a),0],depth=Math.max(.01,o.projectionMm/1000);
   const face=o.kind==='under'?'underside':o.kind==='wall'?(o.face==='right'?'face_minus':'face_plus'):o.face==='underside'?'underside':o.face==='right'?'face_minus':o.face==='left'?'face_plus':'top';
   const vertical=face==='face_plus'||face==='face_minus';
   const w=o.plateWidthMm/1000,ht=o.plateHeightMm/1000;
   const angle=o.rotationDeg*Math.PI/180,yaw=o.yawDeg*Math.PI/180;
   const tangent2=[tangent[0]*Math.cos(yaw)-normal[0]*Math.sin(yaw),tangent[1]*Math.cos(yaw)-normal[1]*Math.sin(yaw),0],normal2=[tangent[0]*Math.sin(yaw)+normal[0]*Math.cos(yaw),tangent[1]*Math.sin(yaw)+normal[1]*Math.cos(yaw),0];
   const basisU=vertical?[tangent2[0]*Math.cos(angle),tangent2[1]*Math.cos(angle),Math.sin(angle)]:[tangent2[0]*Math.cos(angle)+normal2[0]*Math.sin(angle),tangent2[1]*Math.cos(angle)+normal2[1]*Math.sin(angle),0];
   const basisV=vertical?[-tangent2[0]*Math.sin(angle),-tangent2[1]*Math.sin(angle),Math.cos(angle)]:[-tangent2[0]*Math.sin(angle)+normal2[0]*Math.cos(angle),-tangent2[1]*Math.sin(angle)+normal2[1]*Math.cos(angle),0];
   scene.plates.push({p,w,d:ht,orientation:vertical?'vertical':'horizontal',tangent:tangent2,normal:normal2,uAxis:basisU,vAxis:basisV,rotationDeg:o.rotationDeg,yawDeg:o.yawDeg,mountId:o.id,surface:face});
   const holes=detailDims(o).holes;
   for(const hole of holes){
    let q;const ux=(hole.x-o.plateWidthMm/2)/1000,vy=(hole.y-o.plateHeightMm/2)/1000;
    q=[p[0]+basisU[0]*ux+basisV[0]*vy,p[1]+basisU[1]*ux+basisV[1]*vy,p[2]+basisU[2]*ux+basisV[2]*vy];
    scene.anchors.push({p:q,depth:.04,vec:vertical?[-normal[0]*.04,-normal[1]*.04,0]:[0,0,face==='underside'?.04:-.04],surface:face});
   }
   if(o.kind==='under'){
    scene.lines.push({a:pt(x,0),b:pt(x,-o.dropMm),kind:'beam'});
    scene.lines.push({a:pt(x,-o.dropMm),b:[p[0]+normal2[0]*o.projectionMm/1000,p[1]+normal2[1]*o.projectionMm/1000,-o.dropMm/1000],kind:'beam'});
   }
  }
 }
 return scene;
}
function productPreset(type='railing',source={}){
 const category=PRODUCT_TYPES[type]?type:'custom';
 const d=base();d.productType=category;d.name=safe(source.name||PRODUCT_TYPES[category]);d.quantity=Math.floor(clamp(source.quantity,1,100,1));
 d.heightMm=clamp(source.heightMm,350,3500,category==='gate'?1800:category==='frame'?2400:category==='stairs'?1600:1100);
 d.topRail=safe(source.topRail||'60x40x3');d.bottomRail=safe(source.bottomRail||'40x40x2');d.postProfile=safe(source.postProfile||'40x40x3');
 d.material=safe(source.material||'Stal S235');d.finish=safe(source.finish||'Do uzgodnienia');
 d.panelType=['railing','fence','screen'].includes(category)?'Blacha / panel':category==='gate'?'Panel bramy':'Brak';
 const defaultLength={railing:4800,fence:4200,stairs:3200,gate:3600,frame:4800,platform:4400,screen:3600,custom:3000}[category];
 const L=clamp(source.lengthMm,500,30000,defaultLength),numPosts=category==='railing'?5:category==='fence'||category==='screen'?5:3;
 const runs=Array.isArray(source.segments)?source.segments.filter(x=>Number(x.lengthMm)>0).slice(0,30):[];
 d.segments=runs.length?runs:[{id:'S1',name:category==='stairs'?'Bieg schodowy':category==='gate'?'Otwór bramy':category==='frame'?'Oś konstrukcji':'Odcinek główny',lengthMm:L,angleDeg:0}];
 const total=d.segments.reduce((a,x)=>a+Number(x.lengthMm),0);
 d.objects=[];const add=(kind,x,z,label,extra={})=>d.objects.push({id:'P'+(d.objects.length+1),kind,xMm:rnd(x,0),zMm:rnd(z,0),label,...extra});
 if(['railing','fence','screen','custom'].includes(category)){
  const n=category==='custom'?2:numPosts;
  for(let i=0;i<n;i++)add('post',total*i/(n-1),0,'Słupek '+(i+1));
  if(category==='screen'||category==='fence')for(let i=0;i<n-1;i++)add('panel',total*i/(n-1)+40,180,'Panel '+(i+1),{spanMm:Math.max(100,total/(n-1)-80),riseMm:d.heightMm-270});
 }else if(category==='stairs'){
  const steps=Math.floor(clamp(source.steps,2,25,10)),run=total/steps,rise=d.heightMm/steps;
  for(let i=0;i<steps;i++)add('step',run*i,rise*(i+1),'Stopień '+(i+1),{spanMm:run,riseMm:0});
  add('beam',0,0,'Policzek / belka', {spanMm:total,riseMm:d.heightMm,profile:'120x60x3'});
  add('support',0,0,'Podpora dolna',{dropMm:150});
  add('support',total,0,'Podpora górna',{dropMm:150});
 }else if(category==='gate'){
  add('post',0,0,'Słupek zawiasowy');add('post',total,0,'Słupek zamknięcia');
  add('panel',50,100,'Skrzydło bramy',{spanMm:total-100,riseMm:d.heightMm-200});
  add('hinge',0,d.heightMm*.25,'Zawias dolny',{face:'left'});add('hinge',0,d.heightMm*.75,'Zawias górny',{face:'left'});
  add('wall',total,d.heightMm*.5,'Zaczep / odbojnik',{face:'right',holeCount:2});
 }else if(category==='frame'){
  add('post',0,0,'Słup A');add('post',total,0,'Słup B');
  add('beam',0,d.heightMm,'Belka górna',{spanMm:total,riseMm:0,profile:'100x50x3'});
  add('brace',0,0,'Stężenie przekątne',{spanMm:total/3,riseMm:d.heightMm,profile:'40x40x3'});
  add('support',0,0,'Stopa A');add('support',total,0,'Stopa B');
 }else if(category==='platform'){
  add('post',0,0,'Podpora lewa');add('post',total,0,'Podpora prawa');
  add('beam',0,Math.min(300,d.heightMm),'Rygiel pomostu',{spanMm:total,riseMm:0,profile:'100x50x3'});
  add('panel',40,Math.min(300,d.heightMm),'Pomost / poszycie',{spanMm:total-80,riseMm:90});
  add('support',0,0,'Stopa lewa');add('support',total,0,'Stopa prawa');
 }
 d.notes=['Wstępny rysunek koncepcyjny: edytuj swobodnie pozycje, wymiary i detale.','Parametry produkcyjne, obciążenia, kotwienie i połączenia wymagają odrębnej kontroli.'];
 return normalize(d);
}

return {PRODUCT_TYPES,productPreset,REFERENCE_TARGETS,mountTargets,attachMount,moveAbsolute,base,normalize,rotate2,mountPoints2D,referencePoints,snapToReference,fabricationPlan,length,pathPoints,atStation,profileSection,extraProfileHeight,sceneFrom,summary,validate,bom,detailDims,toDXF,duplicateObjects,repeatObjects,transformObjects,esc,rnd};
});