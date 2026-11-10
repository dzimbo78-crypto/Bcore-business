/* B-CORE SteelVision Studio v4 – contextual, non-destructive drawing studio.
 * Adds concept drawings for every product family. Existing estimator and mail
 * handoff remain authoritative; state.detailSheets is carried with RFQs.
 */
(()=>{'use strict';
const C=window.SVDetailCore,U=window.SVDetailer;if(!C||!U)return;
let editor=null,activeIndex=0,baseline='';const $=id=>document.getElementById(id);
const T=(pl,en,de)=>{const l=typeof svPreferences==='undefined'?'pl':svPreferences.lang;return l==='en'?en:l==='de'?de:pl};
const labels={railing:['Balustradę','słupki, profile, podpory i mocowania'],fence:['Ogrodzenie','przęsła, słupki, panele i fundamenty'],stairs:['Schody','stopnie, policzki, podparcia i mocowania'],gate:['Bramę / furtkę','skrzydła, zawiasy, słupki i mocowania'],frame:['Konstrukcję stalową','belki, słupy, stężenia i łączniki'],platform:['Podest / pomost','podpory, rygle, poszycie i połączenia'],screen:['Ściankę / osłonę','panele, słupki i mocowania'],custom:['Dowolny element','profile, osie i dowolne mocowania']};
const validType=x=>Object.prototype.hasOwnProperty.call(labels,x)?x:'custom';
function heightMm(value,defaultValue){const h=Number(value);return Number.isFinite(h)&&h>0?Math.round(h>5?h*10:h*1000):defaultValue}
function drawingFor(it,index){const type=validType(it.type),saved=Array.isArray(state.detailSheets)?state.detailSheets.find(s=>s&&s.itemIndex===index)?.drawing:null;
 if(saved&&saved.app==='steelvision-detailer'&&(saved.productType||'railing')===type)return C.normalize(saved);
 const linearItem=['railing','fence','screen','custom'].includes(type);
 const source={name:it.name,quantity:it.qty,material:it.material,finish:it.finish,topRail:it.topProfile||it.frameMainProfile,bottomRail:it.bottomProfile,postProfile:it.postProfile,
  heightMm:heightMm(type==='gate'?it.gateHeight:type==='frame'?it.frameH:type==='platform'?it.platformH:it.height, type==='frame'?2400:type==='gate'?1800:1100)};
 let segments=Array.isArray(it.segments)?it.segments.filter(s=>s&&Number(s.length)>0).slice(0,30):[];
 if(linearItem&&segments.length)source.segments=segments.map((s,i)=>({id:'seg-'+i,name:String(s.name||('Odcinek '+(i+1))),lengthMm:Math.round(Number(s.length)*1000),angleDeg:Number(s.angle)||0}));
 if(!linearItem){let length=type==='gate'?it.gateOpening:type==='frame'?it.frameL:type==='platform'?it.platformL:type==='stairs'?Number(it.stairSteps)*Number(it.stairRun)/100:0;
  if(Number.isFinite(+length)&&+length>0)source.lengthMm=Math.round(+length*1000);
  if(type==='stairs')source.steps=it.stairSteps;
 }
 let d=C.productPreset(type,source);
 if(linearItem&&source.segments?.length){const L=C.length(d),spacing=Math.max(250,Math.min(4000,(Number(it.postSpacing)||100)*10));const stations=new Set([0,L]);let offset=0;for(const seg of d.segments){const n=Math.max(1,Math.ceil(seg.lengthMm/spacing));for(let i=0;i<=n;i++)stations.add(Math.round(offset+seg.lengthMm*i/n));offset+=seg.lengthMm;}
  // Derive the first draft from actual project dimensions, never copy the balcony demo.
  d.objects=d.objects.filter(o=>o.kind!=='post');d.objects.push(...[...stations].sort((a,b)=>a-b).map((x,i)=>({id:'post-'+i,kind:'post',xMm:x,zMm:0,label:'Słupek '+(i+1)})));
  d.notes=['Wstępne osie słupków wyznaczone wg rozstawu z kalkulatora. Ustal i zweryfikuj mocowania oraz detale na budowie.'];
 }
 return C.normalize(d);
}
function save(){if(!editor||!state||!Array.isArray(state.items))return;const it=state.items[activeIndex];if(!it)return;
 const drawing=editor.getModel(),invalid=C.validate(drawing).filter(x=>x.level==='error');if(invalid.length){alert(T('Popraw błędy rysunku: ','Fix drawing issues: ','Zeichnungsfehler beheben: ')+invalid.map(x=>x.message).join('; '));return;}
 if(typeof saveForm==='function')saveForm();
 const oldSheets=Array.isArray(state.detailSheets)?state.detailSheets.filter(x=>x&&x.itemIndex!==activeIndex):[];
 state.detailSheets=[...oldSheets,{itemIndex:activeIndex,itemName:String(it.name||''),productType:validType(it.type),updatedAt:new Date().toISOString(),drawing,validated:false}].slice(0,60);
 // Only synchronize fields with the same units and semantics. Other products
 // keep their advanced calculation inputs intact; drawing is supplementary.
 if(typeof linear==='function'&&linear(it)){
  const old=Array.isArray(it.segments)?it.segments:[];
  it.segments=drawing.segments.map((s,i)=>({name:s.name,length:Math.round(s.lengthMm)/1000,angle:s.angleDeg,jointType:old[i]?.jointType||(i===drawing.segments.length-1?'Koniec':'Spawane'),jointGap:Number(old[i]?.jointGap)||0}));
  it.qty=drawing.quantity;it.height=drawing.heightMm/10;
  if(typeof renderSegments==='function')renderSegments();
 }else{
  it.qty=drawing.quantity; // geometry for stairs/gates/frames remains a labelled supplemental sheet
 }
 if(typeof updateAll==='function')updateAll();
 editor.destroy();editor=null;$('bcDetailerDialog').close();baseline='';refresh();
 const msg=$('bcStudioMessage');if(msg){msg.textContent=T('Rysunek zapisany w projekcie. PDF / CSV / JSON dołączy go do zapytania.','Drawing saved with the project and included in the RFQ.','Zeichnung mit dem Projekt gespeichert.');}
}
function open(){if(!state||!Array.isArray(state.items)||!state.items.length)return alert(T('Najpierw wybierz produkt.','Choose a product first.','Bitte zuerst ein Produkt auswählen.'));
 if(typeof saveForm==='function')saveForm();activeIndex=Math.max(0,Math.min(Number(state.selected)||0,state.items.length-1));const it=state.items[activeIndex];
 const doc=drawingFor(it,activeIndex);baseline=JSON.stringify(doc);editor?.destroy();editor=U.mount('#bcDetailerHost',{initial:doc});
 $('bcDetailerTitle').textContent='SteelVision · '+(C.PRODUCT_TYPES?.[validType(it.type)]||it.name||'Studio');
 $('bcDetailerDialog').showModal();
}
function close(){if(editor&&JSON.stringify(editor.getModel())!==baseline&&!confirm(T('Odrzucić zmiany rysunku?','Discard drawing edits?','Änderungen verwerfen?')))return;
 editor?.destroy();editor=null;$('bcDetailerDialog').close();baseline='';}
function refresh(){const it=state?.items?.[Math.max(0,Math.min(Number(state.selected)||0,(state.items?.length||1)-1))],type=validType(it?.type),l=labels[type],name=C.PRODUCT_TYPES?.[type]||type;
 const b=$('bcDetailerButton'),secondary=$('bcDetailerGeometryButton'),current=$('bcStudioCategory'),hint=$('bcStudioHint');
 if(b)b.textContent=T('✎ Rysuj '+l[0]+' · edytuj detale','✎ Draw '+name+' · edit details','✎ '+name+' zeichnen');
 if(secondary)secondary.textContent=T('Otwórz studio rysunku: '+name,'Open '+name+' drawing studio','Zeichenstudio öffnen: '+name);
 if(current)current.textContent=name;
 if(hint)hint.textContent=T('Dodawaj, przesuwaj i duplikuj: '+l[1]+'.','Add, move and duplicate '+l[1]+'.','Elemente zeichnen, verschieben und duplizieren.');
 const existing=Array.isArray(state?.detailSheets)&&state.detailSheets.some(x=>x&&x.itemIndex===state.selected);
 for(const el of [b,secondary])if(el){el.dataset.saved=existing?'1':'0';el.title=existing?'Edytuj zapisany rysunek':'Utwórz rysunek i detale';}
}
function init(){if($('bcDetailerButton'))return;
 const css=document.createElement('style');css.textContent=`
 #bcDetailerDialog{border:0;padding:0;width:min(97vw,1800px);height:min(95vh,1200px);max-width:97vw;max-height:95vh;overflow:hidden;border-radius:16px;background:#f1f5f8;color:#173248;box-shadow:0 30px 100px #091d3288}
 #bcDetailerDialog::backdrop{background:rgba(5,20,34,.80);backdrop-filter:blur(5px)}
 #bcDetailerDialog .bc-head{position:sticky;top:0;z-index:35;padding:11px 17px;background:#173952;color:white;display:flex;justify-content:space-between;align-items:center;gap:12px}
 #bcDetailerDialog .bc-head strong{font-size:14px;letter-spacing:.2px}
 #bcDetailerDialog .bc-head span{display:block;font-size:10px;color:#c2d6e2;margin-top:2px}
 #bcDetailerDialog .bc-head>div:last-child{display:flex;gap:8px;flex-wrap:wrap}
 #bcDetailerDialog .bc-head button{font-size:12px;min-height:36px;border-radius:8px}
 #bcDetailerDialog #bcDetailerHost{overflow:auto;max-height:calc(95vh - 65px);min-height:0;overscroll-behavior:contain}
 #bcDetailerDialog #sv-detailer{border:0;border-radius:0;overflow:visible}
 #bcStudioLauncher{background:linear-gradient(115deg,#f0f6fa,#f7fafc);border:1px solid #cbdce7;border-radius:12px;padding:12px 14px;margin:13px 0;display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;box-shadow:0 5px 14px #1b4a6509}
 #bcStudioLauncher .bc-studio-copy{flex:1;min-width:220px}
 #bcStudioLauncher .bc-studio-kicker{font-weight:800;color:#17415b;letter-spacing:.6px;font-size:10px;text-transform:uppercase}
 #bcStudioLauncher .bc-studio-title{font-weight:800;font-size:15px;color:#18364d;margin:3px 0 2px}
 #bcStudioLauncher .bc-studio-hint{font-size:11px;color:#60798a;margin:0;line-height:1.5}
 #bcDetailerButton{background:#153f5e!important;border:1px solid #174866!important;color:white!important;min-height:43px;padding:10px 15px!important;border-radius:9px!important;white-space:normal;box-shadow:0 4px 13px #19415e1f}
 #bcDetailerButton[data-saved="1"]{background:#235b6e!important}
 #bcStudioGeometryBar{display:flex;justify-content:space-between;align-items:center;gap:9px;flex-wrap:wrap;margin:12px 0;padding:10px 13px;border:1px solid #d2e1eb;background:#f5f9fc;border-radius:10px}
 #bcStudioGeometryBar span{font-size:11px;color:#45677c;font-weight:650}
 #bcDetailerGeometryButton{background:#183d57;color:white;border:0;border-radius:8px;padding:10px 14px;min-height:40px;cursor:pointer;font-weight:700}
 #bcoreSteelVisionV19QuoteTop{display:none!important}
 @media(max-width:800px){#bcDetailerDialog{width:100vw;max-width:100vw;height:100dvh;max-height:100dvh;border-radius:0}#bcDetailerDialog #bcDetailerHost{max-height:calc(100dvh - 62px)}#bcDetailerDialog .bc-head{padding:9px 11px}}
 `;document.head.appendChild(css);
 const dialog=document.createElement('dialog');dialog.id='bcDetailerDialog';dialog.innerHTML='<div class="bc-head"><div><strong id="bcDetailerTitle">SteelVision · Studio rysunku</strong><span>Precyzyjne pozycje · niezależne widoki · rysunek koncepcyjny</span></div><div><button type="button" class="soft" id="bcSaveDetails">✓ Zapisz do projektu</button><button type="button" class="ghost" id="bcCloseDetails">Zamknij ✕</button></div></div><div id="bcDetailerHost"></div>';document.body.appendChild(dialog);
 $('bcSaveDetails').addEventListener('click',save);$('bcCloseDetails').addEventListener('click',close);dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
 const launcher=document.createElement('section');launcher.id='bcStudioLauncher';launcher.innerHTML='<div class="bc-studio-copy"><span class="bc-studio-kicker">STEELVISION · STUDIO RYSUNKÓW</span><div class="bc-studio-title">Projektuj: <span id="bcStudioCategory">Balustrada</span></div><p class="bc-studio-hint" id="bcStudioHint">Dodawaj i edytuj profile, podpory oraz mocowania.</p><p id="bcStudioMessage" aria-live="polite" style="font-size:10px;color:#2a745e;margin:5px 0 0"></p></div>';
 const b=document.createElement('button');b.type='button';b.id='bcDetailerButton';b.textContent='✎ Rysuj i edytuj detale';b.addEventListener('click',open);launcher.appendChild(b);
 const productArea=document.querySelector('.productGrid');if(productArea)productArea.insertAdjacentElement('afterend',launcher);
 else document.querySelector('.step[data-step-pane="1"] .stepBody')?.appendChild(launcher);
 const bar=document.createElement('div');bar.id='bcStudioGeometryBar';bar.innerHTML='<span>Studio produktu · rysunki, podpory, mocowania</span>';
 const extra=document.createElement('button');extra.type='button';extra.id='bcDetailerGeometryButton';extra.textContent='Otwórz studio rysunku';extra.addEventListener('click',open);bar.appendChild(extra);
 const position=$('miniGeometry')?.closest('.inlinePreview')||$('segments')?.closest('.section');if(position)position.insertAdjacentElement('afterend',bar);
 // Product cards update selected item without navigating away; observe their class and
 // also update on input, selection, and step changes. No alteration of existing handlers.
 let scheduled=false;const queue=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(()=>{scheduled=false;refresh()})}};
 document.addEventListener('click',queue);document.addEventListener('change',queue);document.addEventListener('input',queue);
 const obs=new MutationObserver(queue);const group=document.querySelector('.productGrid');if(group)obs.observe(group,{subtree:true,attributes:true,attributeFilter:['class']});
 refresh();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();