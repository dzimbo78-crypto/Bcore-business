/* B-CORE: small, dependency-free steel enquiry configurator. Loaded only on steel route. */
(()=>{"use strict";
const D={
pl:{ey:"PROJEKT / KONFIGURACJA / ZAPYTANIE",heading:"Skonfiguruj konstrukcję.",intro:"Zaprojektuj wstępny układ balustrady lub konstrukcji. Prześlij nam wymiary i preferencje, a pomożemy dobrać rozwiązanie oraz wykonawcę.",open:"SKONFIGURUJ KONSTRUKCJĘ",type:"Rodzaj",length:"Długość (m)",height:"Wysokość (cm)",pattern:"Wypełnienie",finish:"Wykończenie",where:"Montaż",preview:"SCHEMAT KONCEPCYJNY",summary:"Twoje założenia",send:"WYŚLIJ ZAPYTANIE",reset:"RESETUJ",tip:"Wizualizacja poglądowa — nie jest projektem wykonawczym ani wyceną. Wymiary i wymogi bezpieczeństwa potwierdza wykonawca.",note:"Wybrana konfiguracja zostanie automatycznie dołączona do formularza kontaktowego.",types:["Balustrada","Ogrodzenie","Schody","Rama stalowa","Zadaszenie"],patterns:["Pionowe profile","Poziome profile","Szkło"],finishes:["Malowanie proszkowe","Stal nierdzewna","Ocynk"],locations:["Na zewnątrz","Wewnątrz"],ask:"Proszę o kontakt w sprawie wstępnej wyceny i możliwości realizacji."},
en:{ey:"CONCEPT / CONFIGURATOR / ENQUIRY",heading:"Configure your steelwork.",intro:"Explore an initial railing or steel concept. Send us your dimensions and preferences and we will help identify the right solution and partner.",open:"CONFIGURE STEELWORK",type:"Type",length:"Length (m)",height:"Height (cm)",pattern:"Infill",finish:"Finish",where:"Location",preview:"CONCEPT DIAGRAM",summary:"Your requirements",send:"REQUEST A QUOTE",reset:"RESET",tip:"Illustration only — not a construction drawing or quotation. Final dimensions and safety requirements must be checked by a professional.",note:"Your choices will be included in the contact form automatically.",types:["Railing","Fence","Stairs","Steel frame","Canopy"],patterns:["Vertical bars","Horizontal rails","Glass"],finishes:["Powder-coated steel","Stainless steel","Galvanized steel"],locations:["Outdoor","Indoor"],ask:"Please contact me about feasibility and an indicative quote."},
da:{ey:"KONCEPT / KONFIGURATOR / FORESPØRGSEL",heading:"Konfigurér din stålkonstruktion.",intro:"Udform et foreløbigt koncept til gelænder eller stålkonstruktion. Send os dine mål og ønsker, så hjælper vi med at finde en løsning.",open:"KONFIGURÉR KONSTRUKTION",type:"Type",length:"Længde (m)",height:"Højde (cm)",pattern:"Udfyldning",finish:"Overflade",where:"Placering",preview:"KONCEPTSKITSE",summary:"Dine ønsker",send:"BED OM TILBUD",reset:"NULSTIL",tip:"Kun en illustration — ikke en konstruktionstegning eller et tilbud. Fagfolk skal kontrollere mål og sikkerhedskrav.",note:"Dine valg overføres automatisk til kontaktformularen.",types:["Gelænder","Hegn","Trappe","Stålramme","Overdækning"],patterns:["Lodrette profiler","Vandrette profiler","Glas"],finishes:["Pulverlakeret stål","Rustfrit stål","Galvaniseret stål"],locations:["Udendørs","Indendørs"],ask:"Kontakt mig gerne om muligheder og et vejledende tilbud."},
de:{ey:"KONZEPT / KONFIGURATOR / ANFRAGE",heading:"Konfigurieren Sie Ihre Stahlkonstruktion.",intro:"Entwerfen Sie ein erstes Geländer- oder Stahlkonzept. Senden Sie uns Maße und Wünsche – wir helfen bei der Auswahl des richtigen Partners.",open:"KONSTRUKTION KONFIGURIEREN",type:"Typ",length:"Länge (m)",height:"Höhe (cm)",pattern:"Füllung",finish:"Oberfläche",where:"Montageort",preview:"KONZEPTSKIZZE",summary:"Ihre Anforderungen",send:"ANGEBOT ANFRAGEN",reset:"ZURÜCKSETZEN",tip:"Nur eine Illustration — kein technischer Bauplan und kein Angebot. Maße und Sicherheitsanforderungen müssen fachlich geprüft werden.",note:"Die Auswahl wird automatisch in das Kontaktformular übertragen.",types:["Geländer","Zaun","Treppe","Stahlrahmen","Überdachung"],patterns:["Vertikale Stäbe","Horizontale Stäbe","Glas"],finishes:["Pulverbeschichteter Stahl","Edelstahl","Verzinkter Stahl"],locations:["Außenbereich","Innenbereich"],ask:"Bitte kontaktieren Sie mich zur Machbarkeit und einer ersten Preisindikation."}
};
const categories=["railing","fence","stairs","frame","canopy"],fills=["vertical","horizontal","glass"],coats=["powder","inox","galvanized"],places=["outdoor","indoor"];
const defaults={type:"railing",length:4,height:110,pattern:"vertical",finish:"powder",where:"outdoor"};
const state={...defaults}, ns="http://www.w3.org/2000/svg";
const txt=()=>D[document.getElementById("bcLang")?.value]||D.pl;
const opts=(keys,labels)=>keys.map((v,i)=>'<option value="'+v+'">'+labels[i]+'</option>').join("");
const h=(label,name,html)=>'<label><span>'+label+'</span>'+html+'</label>';
const sel=(name,keys,labels)=>'<select name="'+name+'">'+opts(keys,labels)+'</select>';
function tag(svg,tagName,attributes,caption){
  const el=document.createElementNS(ns,tagName);
  for(const [k,v] of Object.entries(attributes))el.setAttribute(k,String(v));
  if(caption!==undefined)el.textContent=String(caption);
  svg.appendChild(el);return el;
}
function stroke(svg,x1,y1,x2,y2,color,width=3){tag(svg,"line",{x1,y1,x2,y2,stroke:color,"stroke-width":width,"stroke-linecap":"round"});}
function draw(){
  const svg=document.querySelector("#bcore-configurator svg");if(!svg)return;
  svg.replaceChildren();
  const steel=state.finish==="powder"?"#d4b18a":state.finish==="inox"?"#c4d0d5":"#93a6ac";
  const left=65,right=820,base=265,segments=Math.min(10,Math.max(3,Math.ceil(state.length/1.4)));
  stroke(svg,40,base,848,base,"#464649",1);
  if(state.type==="railing"||state.type==="fence"){
    const top=state.type==="railing"?89:57;
    for(let i=0;i<segments;i++){
      const a=left+(right-left)*i/segments,b=left+(right-left)*(i+1)/segments;
      if(state.pattern==="glass")tag(svg,"rect",{x:a+8,y:top+10,width:b-a-16,height:base-top-18,fill:"#789ea6","fill-opacity":.16,stroke:"#789ea6","stroke-opacity":.7,"stroke-width":1});
      else if(state.pattern==="horizontal")for(let j=1;j<=4;j++)stroke(svg,a,top+(base-top)*j/5,b,top+(base-top)*j/5,steel,2);
      else for(let j=1;j<5;j++){const x=a+(b-a)*j/5;stroke(svg,x,top+5,x,base-6,steel,2);}
    }
    for(let i=0;i<=segments;i++){const x=left+(right-left)*i/segments;stroke(svg,x,top,x,base+5,steel,5);}
    stroke(svg,left-10,top,right+10,top,steel,7);
  } else if(state.type==="stairs"){
    for(let i=0;i<12;i++){const x=85+i*57,y=251-i*15;stroke(svg,x,y,x+57,y,steel,5);stroke(svg,x+57,y,x+57,y-15,steel,2);}
    stroke(svg,75,267,777,75,steel,6);stroke(svg,85,205,790,8,steel,3);
    for(let i=0;i<6;i++)stroke(svg,85+i*132,205-i*27,85+i*132,168-i*27,steel,2);
  }else{
    const y=state.type==="canopy"?103:55;
    for(let i=0;i<4;i++){const x=95+i*225;stroke(svg,x,y,x,265,steel,7);}
    stroke(svg,75,y,790,y,steel,8);
    if(state.type==="canopy"){stroke(svg,95,y-3,780,y-43,steel,7);for(let i=0;i<6;i++)stroke(svg,95+i*135,y-5,95+i*135,y-37,steel,2);}
    else{stroke(svg,95,y,320,265,steel,2);stroke(svg,545,y,770,265,steel,2);stroke(svg,95,265,770,265,steel,4);}
  }
  stroke(svg,left,290,right,290,"#78716c",1);stroke(svg,left,284,left,297,"#78716c",1);stroke(svg,right,284,right,297,"#78716c",1);
  tag(svg,"text",{x:442,y:308,fill:"#d4b18a","font-size":15,"text-anchor":"middle","font-family":"Arial,sans-serif"},state.length.toFixed(1)+" m");
  tag(svg,"text",{x:30,y:165,fill:"#d4b18a","font-size":12,transform:"rotate(-90 30 165)","text-anchor":"middle","font-family":"Arial,sans-serif"},Math.round(state.height)+" cm");
}
function details(){
  const t=txt(),i=categories.indexOf(state.type);
  return [t.summary,t.type+": "+t.types[i],t.length+": "+state.length.toFixed(1)+" m",t.height+": "+Math.round(state.height)+" cm",...(i<2?[t.pattern+": "+t.patterns[fills.indexOf(state.pattern)]]:[]),t.finish+": "+t.finishes[coats.indexOf(state.finish)],t.where+": "+t.locations[places.indexOf(state.where)],"",t.ask].join("\n");
}
function refresh(){
  const sec=document.getElementById("bcore-configurator");if(!sec)return;
  const fill=sec.querySelector("[name=pattern]")?.closest("label");
  if(fill)fill.hidden=!(state.type==="railing"||state.type==="fence");
  sec.querySelector(".bcore-config-summary").textContent=details();draw();
}
function mount(){
  if(!location.hash.startsWith("#/konstrukcje-stalowe"))return;
  const app=document.getElementById("app");if(!app||app.querySelector("#bcore-configurator"))return;
  const t=txt(),sec=document.createElement("section");sec.id="bcore-configurator";sec.className="bcore-config-section";
  sec.innerHTML=[
    '<div class="container"><span class="eyebrow with-line">'+t.ey+'</span>',
    '<div class="bcore-config-intro"><h2>'+t.heading+'</h2><p>'+t.intro+'</p></div>',
    '<div class="bcore-config-columns"><form class="bcore-config-form">',
    h(t.type,"type",sel("type",categories,t.types)),
    '<div class="bcore-config-pair">',
    h(t.length,"length",'<input type="number" name="length" min="0.5" max="100" step="0.5" inputmode="decimal" value="4">'),
    h(t.height,"height",'<input type="number" name="height" min="50" max="1200" step="10" inputmode="numeric" value="110">'),
    '</div>',
    h(t.pattern,"pattern",sel("pattern",fills,t.patterns)),
    h(t.finish,"finish",sel("finish",coats,t.finishes)),
    h(t.where,"where",sel("where",places,t.locations)),
    '<p class="bcore-config-notice">'+t.tip+'</p></form>',
    '<div class="bcore-config-output"><p class="bcore-config-preview-title">'+t.preview+'</p>',
    '<div class="bcore-config-drawing"><svg viewBox="0 0 880 325" role="img" aria-label="'+t.preview+'"></svg></div>',
    '<h3>'+t.summary+'</h3><pre class="bcore-config-summary"></pre>',
    '<div class="bcore-config-actions"><button type="button" class="button solid bcore-config-send">'+t.send+'</button>',
    '<button type="button" class="button bcore-config-reset">'+t.reset+'</button></div>',
    '<p class="bcore-config-note">'+t.note+'</p></div></div></div>'
  ].join("");
  const before=app.querySelector(".cta-section");
  if(before)before.before(sec);else app.appendChild(sec);
  const form=sec.querySelector("form");
  for(const [name,val] of Object.entries(state))form.elements.namedItem(name).value=String(val);
  form.addEventListener("submit",ev=>ev.preventDefault());
  form.addEventListener("input",ev=>{
    const field=ev.target;if(!field?.name)return;
    if(field.name==="length"||field.name==="height"){
      if(field.value==="")return;
      const num=Number(field.value);
      if(Number.isFinite(num))state[field.name]=Math.max(field.name==="length"?.5:50,Math.min(field.name==="length"?100:1200,num));
    }else if(Object.prototype.hasOwnProperty.call(state,field.name))state[field.name]=field.value;
    refresh();
  });
  form.addEventListener("change",ev=>{
    const field=ev.target;if(!field?.name)return;
    if(field.name==="type"){
      state.type=field.value;
      state.height=({railing:110,fence:160,stairs:300,frame:300,canopy:260})[field.value]||110;
      form.elements.namedItem("height").value=String(state.height);
    }
    if(field.name==="length"||field.name==="height")field.value=String(state[field.name]);
    refresh();
  });
  sec.querySelector(".bcore-config-reset").addEventListener("click",()=>{
    Object.assign(state,defaults);
    for(const [name,val] of Object.entries(defaults))form.elements.namedItem(name).value=String(val);
    refresh();
  });
  sec.querySelector(".bcore-config-send").addEventListener("click",()=>{
    const content=details();try{sessionStorage.setItem("bcore-config-enquiry",content);}
    catch(error){location.href="mailto:przemyslaw.bugajski78@gmail.com?subject=B-CORE%20Steel&body="+encodeURIComponent(content);return;}
    location.hash="#/kontakt";
  });
  const hero=app.querySelector(".detail-hero .actions");
  if(hero&&!hero.querySelector(".bcore-config-open")){
    const btn=document.createElement("button");btn.type="button";btn.className="button bcore-config-open";btn.textContent=t.open;
    btn.addEventListener("click",()=>sec.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"}));
    hero.appendChild(btn);
  }
  refresh();
}
let scheduled=false;
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;mount();});}
function init(){
  const app=document.getElementById("app");if(!app)return;
  new MutationObserver(schedule).observe(app,{childList:true});
  window.addEventListener("hashchange",schedule);
  document.getElementById("bcLang")?.addEventListener("change",schedule);
  schedule();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();