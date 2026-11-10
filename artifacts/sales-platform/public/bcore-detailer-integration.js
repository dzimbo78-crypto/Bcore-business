/* B-CORE / SteelVision Studio v3 Detailer handoff. Adds optional editable drawing
 * sheets and NEVER replaces the existing product configuration or email bridge.
 * state.detailSheets is included automatically in the existing quote JSON/CSV/PDF path.
 */
(()=>{'use strict';
const C=window.SVDetailCore,U=window.SVDetailer;if(!C||!U)return;
let editor=null,activeIndex=0,baseline='',pending=null;
const $=id=>document.getElementById(id);
const T=(pl,en,de)=>{let l=typeof svPreferences==='undefined'?'pl':svPreferences.lang;return l==='en'?en:l==='de'?de:pl;};
function drawingFor(it,index){const saved=Array.isArray(state.detailSheets)?state.detailSheets.find(s=>s&&s.itemIndex===index)?.drawing:null;
 if(saved&&saved.app==='steelvision-detailer')return C.normalize(saved);
 let d=C.base();d.name=String(it.name||('Balustrada '+(index+1)));d.quantity=Math.max(1,Math.floor(Number(it.qty)||1));d.material=String(it.material||'Stal');d.finish=String(it.finish||'Do uzgodnienia');const height=Number(it.height);d.heightMm=Math.round(Number.isFinite(height)&&height>0?(height>5?height*10:height*1000):1120);d.topRail=String(it.topProfile||d.topRail);d.bottomRail=String(it.bottomProfile||d.bottomRail);d.postProfile=String(it.postProfile||d.postProfile);
 const segs=Array.isArray(it.segments)?it.segments.filter(s=>s&&Number(s.length)>0):[];
 if(segs.length){d.segments=segs.slice(0,30).map((s,i)=>({id:'seg-'+i,name:String(s.name||('Odcinek '+(i+1))),lengthMm:Math.round(Number(s.length)*1000),angleDeg:Number(s.angle)||0}));
 let L=d.segments.reduce((a,b)=>a+b.lengthMm,0),spacing=Math.max(250,Math.min(4000,(Number(it.postSpacing)||100)*10));const stations=new Set([0,L]);let at=0;for(let seg of d.segments){const n=Math.max(1,Math.ceil(seg.lengthMm/spacing));for(let i=0;i<=n;i++)stations.add(Math.round(at+seg.lengthMm*i/n));at+=seg.lengthMm;}
 d.objects=[...stations].sort((a,b)=>a-b).map((x,i)=>({id:'post-'+i,kind:'post',xMm:x,zMm:0,label:'Słupek '+(i+1)}));d.notes=['Mocowania i podpory uzupełnij zgodnie z warunkami na obiekcie. Automatycznie wygenerowane są wyłącznie osie słupków.'];d.leftRaiseMm=0;}
 return C.normalize(d);}
function save(){if(!editor||!state||!Array.isArray(state.items))return;const it=state.items[activeIndex];if(!it)return;
 const drawing=editor.getModel();const invalid=C.validate(drawing).filter(x=>x.level==='error');if(invalid.length){alert(T('Popraw błędy geometrii: ','Fix geometry errors: ','Geometriefehler beheben: ')+invalid.map(x=>x.message).join('; '));return;}
 if(typeof saveForm==='function')saveForm();
 const oldSheets=Array.isArray(state.detailSheets)?state.detailSheets.filter(x=>x&&x.itemIndex!==activeIndex):[];
 state.detailSheets=[...oldSheets,{itemIndex:activeIndex,itemName:String(it.name||''),updatedAt:new Date().toISOString(),drawing,validated:false}].slice(0,60);
 // Keep the original RFQ geometry and detailed drawing consistent: translate mm to m.
 // Connection details, structural approvals and material choices are NOT modified.
 if(typeof linear==='function'&&linear(it)){
 const old=Array.isArray(it.segments)?it.segments:[];
 it.segments=drawing.segments.map((s,i)=>({name:s.name,length:Math.round(s.lengthMm)/1000,angle:s.angleDeg,jointType:old[i]?.jointType||(i===drawing.segments.length-1?'Koniec':'Spawane'),jointGap:Number(old[i]?.jointGap)||0}));
 it.qty=drawing.quantity;
 it.height=drawing.heightMm/10; // existing SteelVision linear height is in centimetres
 if(typeof renderSegments==='function')renderSegments();
 if(typeof updateAll==='function')updateAll();
 }
 $('bcDetailerDialog').close();editor=null;pending=null;
 alert(T('Zapisano rysunek. Kliknij „Wyślij pełny projekt do wyceny”, aby dołączyć rysunki i detale w raporcie PDF/CSV/JSON.','Drawing saved. Send the full RFQ to include details in PDF/CSV/JSON.','Zeichnung gespeichert. Vollständige Anfrage senden, um die Details in PDF/CSV/JSON zu übernehmen.'));
}
function open(){if(!state||!Array.isArray(state.items)||!state.items.length)return alert(T('Najpierw dodaj konstrukcję.','Add a structure first.','Bitte zuerst eine Konstruktion hinzufügen.'));
 if(typeof saveForm==='function')saveForm();activeIndex=Math.max(0,Math.min(state.selected||0,state.items.length-1));const it=state.items[activeIndex];if(typeof linear==='function'&&!linear(it))return alert(T('Rysunki detali dostępne dla balustrad, ogrodzeń i innych elementów liniowych.','Detail sheets are for railings and other linear elements.','Detailzeichnungen sind für Geländer und lineare Elemente verfügbar.'));
 pending=drawingFor(it,activeIndex);baseline=JSON.stringify(pending);editor?.destroy();editor=U.mount('#bcDetailerHost',{initial:pending});$('bcDetailerTitle').textContent=T('Edytor detali — ','Detail editor — ','Detaileditor — ')+String(it.name||activeIndex+1);$('bcDetailerDialog').showModal();}
function close(){if(editor&&JSON.stringify(editor.getModel())!==baseline&&!confirm(T('Zamknąć bez zapisania rysunku?','Discard the drawing changes?','Zeichnungsänderungen verwerfen?')))return;$('bcDetailerDialog').close();editor=null;pending=null;}
function init(){if($('bcDetailerButton'))return;
 const style=document.createElement('style');style.textContent='#bcDetailerDialog{border:0;border-radius:14px;padding:0;width:min(98vw,1640px);height:min(94vh,1050px);max-width:98vw;max-height:94vh;background:#ecf2f6;color:#143247;overflow:auto}#bcDetailerDialog::backdrop{background:rgba(13,25,38,.78)}#bcDetailerDialog .bc-head{position:sticky;z-index:20;top:0;background:#153b60;color:white;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;gap:10px}#bcDetailerDialog .bc-head b{font-size:14px}#bcDetailerDialog .bc-head>div{display:flex;gap:7px;flex-wrap:wrap}#bcDetailerDialog .bc-head button{font-size:12px}#bcDetailerDialog #sv-detailer{border-radius:0}';document.head.appendChild(style);
 const dialog=document.createElement('dialog');dialog.id='bcDetailerDialog';dialog.innerHTML='<div class="bc-head"><b id="bcDetailerTitle">SteelVision Detailing</b><div><button type="button" class="soft" id="bcSaveDetails">✓ Zapisz do kalkulatora</button><button type="button" class="ghost" id="bcCloseDetails">Zamknij</button></div></div><div id="bcDetailerHost"></div>';document.body.appendChild(dialog);
 $('bcSaveDetails').addEventListener('click',save);$('bcCloseDetails').addEventListener('click',close);dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
 const b=document.createElement('button');b.type='button';b.id='bcDetailerButton';b.className='soft';b.style.cssText='background:#153b60;color:#fff;min-height:42px;max-width:100%;white-space:normal';b.textContent=T('✎ Rysuj balustradę / edytuj mocowania','✎ Draw railing / edit fixings','✎ Geländer / Befestigungen zeichnen');b.addEventListener('click',open);
 const target=$('exportBtn')||$('copyOrder')||$('v15ExportStudio');if(target)target.insertAdjacentElement('afterend',b);else document.body.appendChild(b);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();