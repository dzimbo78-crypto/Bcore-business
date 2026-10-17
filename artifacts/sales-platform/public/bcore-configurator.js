/* B-CORE | Detailed steel configurator v2
 * Isolated, lazy-loaded and dependency-free. No 3D engine, external calls or analytics.
 * This tool creates indicative enquiry geometry; never structural/permit documentation.
 */
(()=>{"use strict";
const i18n={
pl:{
eye:"NARZĘDZIE PROJEKTOWE / B-CORE",title:"Twój projekt. Dokładniejsze parametry.",intro:"Zaprojektuj układ profili, ustaw rozstaw i zobacz liczbę elementów. Przygotuj czytelną specyfikację do wstępnej wyceny.",
type:"Rodzaj konstrukcji",length:"Całkowita szerokość / długość (mm)",height:"Wysokość (mm)",posts:"Profil słupków / podpór",span:"Maks. rozstaw osi słupków (mm)",bays:"Liczba przęseł (0 = automatycznie)",rail:"Profil górny / poręcz",pattern:"Wypełnienie",bar:"Profil wypełnienia",gap:"Maks. światło między profilami (mm)",bottom:"Prześwit od podłoża (mm)",hbars:"Liczba poziomych profili w przęśle",glass:"Grubość szkła (mm)",main:"Profil belki / konstrukcji",brace:"Stężenia (poglądowe)",steps:"Liczba stopni",roofDrop:"Różnica wysokości dachu (mm)",finish:"Wykończenie",mount:"Sposób montażu",
drawing:"WIDOK Z PRZODU · SCHEMAT Z WYMIARAMI",top:"RZUT Z GÓRY · ROZSTAW OSIOWY",stats:"WYLICZONE PARAMETRY",bill:"ORIENTACYJNE ZESTAWIENIE",total:"Wymiar całkowity",postCount:"Słupki / podpory",bayCount:"Przęsła",axis:"Rozstaw osiowy",open:"Światło między słupkami",barCount:"Profile wypełnienia",actualGap:"Wyliczony prześwit",railLength:"Łączna długość poręczy",barLength:"Długość jednego profilu",glassCount:"Panele szklane",glassWidth:"Szerokość jednego panelu",hbarCount:"Poziome profile",stairsRise:"Orientacyjna wysokość stopnia",stairsGoing:"Orientacyjna głębokość stopnia",mainLen:"Łączna długość belek (schemat)",countUnit:"szt.",noPrice:"Bez automatycznej ceny — wycena po potwierdzeniu warunków.",disclaimer:"Symulator przedstawia wstępną geometrię. Nie sprawdza obciążeń, ugięć, norm, bezpieczeństwa dzieci, fundamentów, połączeń ani zgodności z przepisami. Wymiary i dobór przekrojów musi zatwierdzić uprawniony projektant lub wykonawca.",note:"Po wysłaniu konfiguracja trafi do formularza kontaktowego. Możesz też pobrać zestawienie TXT.",request:"WYŚLIJ DO WYCENY",download:"POBIERZ SPECYFIKACJĘ",reset:"WYCZYŚĆ",manual:"Pomiary orientacyjne · nie jest to dokumentacja wykonawcza",glassNotice:"Grubość szkła i sposób mocowania wymagają osobnego doboru technicznego.",auto:"Auto",types:["Balustrada","Ogrodzenie","Schody stalowe","Rama / konstrukcja stalowa","Zadaszenie"],patterns:["Profile pionowe","Profile poziome","Szkło"],finishes:["Malowanie proszkowe","Stal nierdzewna","Ocynk"],mountings:["Montaż od góry","Montaż boczny"],braces:["Bez stężeń na schemacie","Ukośne","Krzyżowe"],summaryTitle:"Konfiguracja B-CORE do wstępnej wyceny",extra:"Proszę o sprawdzenie wykonalności, konstrukcji, obowiązujących wymagań i przygotowanie oferty po potwierdzeniu wymiarów.",unknown:"—"},
en:{
eye:"DESIGN TOOL / B-CORE",title:"Your concept. Better detail.",intro:"Choose steel profiles, adjust spacing, and see the estimated number of parts. Create a clear brief for an initial quote.",
type:"Structure type",length:"Overall width / length (mm)",height:"Height (mm)",posts:"Post / support profile",span:"Maximum post centre spacing (mm)",bays:"Number of bays (0 = automatic)",rail:"Top rail profile",pattern:"Infill",bar:"Infill bar profile",gap:"Maximum clear gap between bars (mm)",bottom:"Ground clearance (mm)",hbars:"Horizontal bars per bay",glass:"Glass thickness (mm)",main:"Primary beam profile",brace:"Bracing (illustration)",steps:"Number of treads",roofDrop:"Roof fall (mm)",finish:"Finish",mount:"Installation",
drawing:"FRONT ELEVATION · DIMENSIONED CONCEPT",top:"PLAN VIEW · POST CENTRES",stats:"CALCULATED DIMENSIONS",bill:"INDICATIVE MATERIAL SCHEDULE",total:"Overall dimensions",postCount:"Posts / supports",bayCount:"Bays",axis:"Post centre distance",open:"Clear opening between posts",barCount:"Infill bars",actualGap:"Calculated clear gap",railLength:"Total top rail length",barLength:"Length per bar",glassCount:"Glass panels",glassWidth:"Width per panel",hbarCount:"Horizontal bars",stairsRise:"Indicative riser",stairsGoing:"Indicative going",mainLen:"Indicative beam length",countUnit:"pcs",noPrice:"No automatic price — quote subject to site and technical review.",disclaimer:"This is an indicative layout, not a structural design. It does not validate loading, deflection, standards, child safety, foundations, joints or building approval. All dimensions and profiles require professional verification.",note:"Your brief is added to the contact form. You can also download a TXT specification.",request:"REQUEST A QUOTE",download:"DOWNLOAD BRIEF",reset:"RESET",manual:"Indicative geometry · not fabrication documents",glassNotice:"Glass thickness and fixing method must be specified by a specialist.",auto:"Auto",types:["Railing","Fence","Steel stairs","Steel frame","Canopy"],patterns:["Vertical bars","Horizontal bars","Glass"],finishes:["Powder-coated steel","Stainless steel","Galvanized steel"],mountings:["Top-mounted","Side-mounted"],braces:["No braces shown","Diagonal bracing","Cross bracing"],summaryTitle:"B-CORE configuration for an initial quotation",extra:"Please verify feasibility, loads, local standards and specifications before submitting a quotation.",unknown:"—"},
da:{
eye:"DESIGNVÆRKTØJ / B-CORE",title:"Dit projekt. Flere detaljer.",intro:"Vælg profiler, justér afstande og se det beregnede antal dele. Lav et præcist oplæg til et indledende tilbud.",
type:"Konstruktionstype",length:"Samlet længde / bredde (mm)",height:"Højde (mm)",posts:"Stolpe- / støtteprofil",span:"Maks. centerafstand mellem stolper (mm)",bays:"Antal fag (0 = automatisk)",rail:"Håndlisteprofil",pattern:"Udfyldning",bar:"Udfyldningsprofil",gap:"Maks. fri afstand mellem profiler (mm)",bottom:"Frihøjde over gulv (mm)",hbars:"Vandrette profiler pr. fag",glass:"Glastykkelse (mm)",main:"Hovedbjælkeprofil",brace:"Afstivning (skitse)",steps:"Antal trin",roofDrop:"Tagfald (mm)",finish:"Overflade",mount:"Montering",
drawing:"FRONTOPSTALT · MÅLSAT SKITSE",top:"PLAN · CENTERAFSTANDE",stats:"BEREGNEDE MÅL",bill:"VEJLEDENDE MATERIALELISTE",total:"Samlede mål",postCount:"Stolper / støtter",bayCount:"Fag",axis:"Centerafstand",open:"Fri åbning mellem stolper",barCount:"Udfyldningsprofiler",actualGap:"Beregnet fri afstand",railLength:"Samlet håndlistelængde",barLength:"Længde pr. profil",glassCount:"Glasfelter",glassWidth:"Bredde pr. glasfelt",hbarCount:"Vandrette profiler",stairsRise:"Vejledende trinhøjde",stairsGoing:"Vejledende trindybde",mainLen:"Vejledende bjælkelængde",countUnit:"stk.",noPrice:"Ingen automatisk pris — tilbud efter faglig vurdering.",disclaimer:"Kun en vejledende geometri, ikke et statisk projekt. Belastninger, nedbøjning, normer, børnesikkerhed, fundamenter, samlinger og byggetilladelse kontrolleres ikke. Fagfolk skal verificere mål og profiler.",note:"Konfigurationen indsættes i kontaktformularen. Du kan også hente en TXT-oversigt.",request:"BED OM TILBUD",download:"HENT SPECIFIKATION",reset:"NULSTIL",manual:"Vejledende geometri · ikke arbejdstegninger",glassNotice:"Glastykkelse og fastgørelse skal dimensioneres fagligt.",auto:"Auto",types:["Gelænder","Hegn","Ståltrappe","Stålramme","Overdækning"],patterns:["Lodrette profiler","Vandrette profiler","Glas"],finishes:["Pulverlakeret stål","Rustfrit stål","Galvaniseret stål"],mountings:["Topmontering","Sidemontering"],braces:["Ingen synlig afstivning","Diagonal","Kryds"],summaryTitle:"B-CORE konfiguration til tilbud",extra:"Kontrollér udførelse, belastninger, gældende krav og specifikationer før tilbud.",unknown:"—"},
de:{
eye:"KONFIGURATOR / B-CORE",title:"Ihr Projekt. Mehr Details.",intro:"Wählen Sie Profile, Abstände und Elementanzahlen. Erstellen Sie eine nachvollziehbare Grundlage für eine erste Anfrage.",
type:"Konstruktionstyp",length:"Gesamtlänge / -breite (mm)",height:"Höhe (mm)",posts:"Pfosten- / Stützenprofil",span:"Max. Pfostenachsabstand (mm)",bays:"Felder (0 = automatisch)",rail:"Handlaufprofil",pattern:"Füllung",bar:"Füllungsprofil",gap:"Max. lichter Abstand (mm)",bottom:"Abstand zum Boden (mm)",hbars:"Horizontale Profile je Feld",glass:"Glasdicke (mm)",main:"Hauptträgerprofil",brace:"Aussteifung (Skizze)",steps:"Stufenanzahl",roofDrop:"Dachgefälle (mm)",finish:"Oberfläche",mount:"Montage",
drawing:"VORDERANSICHT · BEMASSTE SKIZZE",top:"DRAUFSICHT · PFOSTENACHSEN",stats:"BERECHNETE MASSE",bill:"UNVERBINDLICHE STÜCKLISTE",total:"Gesamtmaß",postCount:"Pfosten / Stützen",bayCount:"Felder",axis:"Achsabstand",open:"Lichte Weite zwischen Pfosten",barCount:"Füllungsprofile",actualGap:"Berechneter lichter Abstand",railLength:"Gesamtlänge des Handlaufs",barLength:"Länge je Profil",glassCount:"Glasscheiben",glassWidth:"Breite je Scheibe",hbarCount:"Horizontale Profile",stairsRise:"Voraussichtliche Steigung",stairsGoing:"Voraussichtlicher Auftritt",mainLen:"Geschätzte Trägerlänge",countUnit:"Stk.",noPrice:"Kein automatischer Preis — Angebot nach technischer Prüfung.",disclaimer:"Dies ist eine Konzeptskizze, keine statische Berechnung. Lasten, Verformung, Normen, Kindersicherheit, Fundamente, Verbindungen und Genehmigungen werden nicht geprüft. Alle Maße und Profile sind fachlich zu bestätigen.",note:"Die Konfiguration wird im Kontaktformular übernommen. Eine TXT-Datei ist ebenfalls verfügbar.",request:"ANGEBOT ANFRAGEN",download:"SPEZIFIKATION LADEN",reset:"ZURÜCKSETZEN",manual:"Unverbindliche Maße · keine Werkplanung",glassNotice:"Glasdicke und Befestigung müssen fachlich dimensioniert werden.",auto:"Auto",types:["Geländer","Zaun","Stahltreppe","Stahlrahmen","Überdachung"],patterns:["Vertikale Stäbe","Horizontale Stäbe","Glas"],finishes:["Pulverbeschichteter Stahl","Edelstahl","Verzinkter Stahl"],mountings:["Aufgesetzte Montage","Seitliche Montage"],braces:["Keine Aussteifung dargestellt","Diagonal","Kreuz"],summaryTitle:"B-CORE Konfiguration für ein Erstangebot",extra:"Bitte Machbarkeit, Lasten, örtliche Normen und technische Ausführung vor Angebotstellung prüfen.",unknown:"—"}
};
const types=["railing","fence","stairs","frame","canopy"], patterns=["vertical","horizontal","glass"];
const posts=["30x30","40x40","50x50","60x60","80x80","100x100"];
const fills=["10x10","12x12","15x15","20x20","R16","R20"];
const rails=["40x20","40x40","50x30","60x40","R42"];
const beams=["60x40","80x40","100x50","120x60","160x80","200x100"];
const coats=["powder","inox","galvanized"], mounts=["top","side"], braces=["none","diagonal","cross"];
const defaultState={type:"railing",length:4000,height:1100,post:"40x40",maxSpan:1500,manualBays:0,rail:"40x40",pattern:"vertical",bar:"12x12",maxGap:100,bottom:70,hBars:4,glass:10,beam:"100x50",brace:"diagonal",steps:12,roofDrop:180,finish:"powder",mount:"top"};
const state={...defaultState};
const clamps={length:[700,20000],height:[400,5000],maxSpan:[400,4000],manualBays:[0,32],maxGap:[10,250],bottom:[0,350],hBars:[1,12],glass:[6,24],steps:[2,30],roofDrop:[0,1000]};
const locale=()=>i18n[document.getElementById("bcLang")?.value]||i18n.pl;
const measure=()=>state.type==="railing"||state.type==="fence";
const width=p=>p.startsWith("R")?Number(p.slice(1)):Number(p.split("x")[0]);
const depth=p=>p.startsWith("R")?Number(p.slice(1)):Number(p.split("x")[1]);
const format=n=>Number.isFinite(n)?(Math.round(n*10)/10).toLocaleString(document.getElementById("bcLang")?.value==="pl"?"pl-PL":"en-GB",{maximumFractionDigits:1}):"—";
function calc(){
  const p=width(state.post),usable=Math.max(1,state.length-p);
  const bayCount=state.manualBays>0?state.manualBays:Math.max(1,Math.ceil(usable/state.maxSpan));
  const centre=usable/bayCount,opening=Math.max(0,centre-p);
  const postCount=bayCount+1;
  const vertical=state.pattern==="vertical",horizontal=state.pattern==="horizontal",glass=state.pattern==="glass";
  const bw=width(state.bar);
  const railsH=depth(state.rail),innerH=Math.max(0,state.height-railsH-state.bottom);
  const perBay=vertical?Math.max(0,Math.ceil((opening-state.maxGap)/(bw+state.maxGap))):0;
  const totalBars=perBay*bayCount;
  const actualGap=vertical?(opening-perBay*bw)/(perBay+1):horizontal?Math.max(0,(innerH-state.hBars*bw)/(state.hBars+1)):null;
  const glassW=Math.max(0,opening-40);
  return{postWidth:p,bayCount,postCount,centre,opening,barsPerBay:perBay,totalBars,barWidth:bw,actualGap,barLength:innerH,glassW,glassCount:bayCount,hBarCount:state.hBars*bayCount,glass,horizontal,vertical};
}
function select(name,values,labels){
  return '<select name="'+name+'">'+values.map((v,i)=>'<option value="'+v+'">'+labels[i]+'</option>').join("")+'</select>';
}
function input(name,min,max,step){
  return '<input name="'+name+'" type="number" inputmode="decimal" min="'+min+'" max="'+max+'" step="'+step+'">';
}
function row(label,field,extraClass=""){
  return '<label class="bcore-sim-field '+extraClass+'"><span>'+label+'</span>'+field+'</label>';
}
function configMarkup(t){
  return [
'<div class="container bcore-sim-container">',
'<p class="bcore-sim-eyebrow">'+t.eye+'</p>',
'<div class="bcore-sim-header"><h2>'+t.title+'</h2><p>'+t.intro+'</p></div>',
'<div class="bcore-sim-layout"><form class="bcore-sim-form" id="bcore-sim-form">',
'<div class="bcore-sim-group">'+row(t.type,select("type",types,t.types))+'</div>',
'<div class="bcore-sim-pair">'+row(t.length,input("length",700,20000,50))+row(t.height,input("height",400,5000,10))+'</div>',
'<div class="bcore-sim-pair">'+row(t.posts,select("post",posts,posts))+row(t.span,input("maxSpan",400,4000,50))+'</div>',
row(t.bays,input("manualBays",0,32,1)),
'<div class="bcore-sim-dynamic" data-show="rail">'+row(t.rail,select("rail",rails,rails))+'</div>',
'<div class="bcore-sim-dynamic" data-show="infill">'+row(t.pattern,select("pattern",patterns,t.patterns))+'</div>',
'<div class="bcore-sim-dynamic" data-show="vertical">'+
  '<div class="bcore-sim-pair">'+row(t.bar,select("bar",fills,fills))+row(t.gap,input("maxGap",10,250,5))+'</div></div>',
'<div class="bcore-sim-dynamic" data-show="horizontal">'+
  '<div class="bcore-sim-pair">'+row(t.bar+" (mm)",select("bar2",fills,fills))+row(t.hbars,input("hBars",1,12,1))+'</div></div>',
'<div class="bcore-sim-dynamic" data-show="glass">'+row(t.glass,input("glass",6,24,2))+'<p class="bcore-sim-note">'+t.glassNotice+'</p></div>',
'<div class="bcore-sim-dynamic" data-show="rail">'+row(t.bottom,input("bottom",0,350,10))+'</div>',
'<div class="bcore-sim-dynamic" data-show="structure">'+row(t.main,select("beam",beams,beams))+row(t.brace,select("brace",braces,t.braces))+'</div>',
'<div class="bcore-sim-dynamic" data-show="stairs">'+row(t.steps,input("steps",2,30,1))+'</div>',
'<div class="bcore-sim-dynamic" data-show="canopy">'+row(t.roofDrop,input("roofDrop",0,1000,10))+'</div>',
'<div class="bcore-sim-pair">'+row(t.finish,select("finish",coats,t.finishes))+row(t.mount,select("mount",mounts,t.mountings))+'</div>',
'<p class="bcore-sim-disclaimer">'+t.disclaimer+'</p></form>',
'<div class="bcore-sim-results" aria-live="polite">',
'<p class="bcore-sim-pane-label">'+t.drawing+'</p><div class="bcore-sim-svg-wrap"><svg class="bcore-sim-elevation" viewBox="0 0 900 378" role="img"></svg></div>',
'<p class="bcore-sim-pane-label">'+t.top+'</p><div class="bcore-sim-plan-wrap"><svg class="bcore-sim-plan" viewBox="0 0 900 120" role="img"></svg></div>',
'<h3>'+t.stats+'</h3><div class="bcore-sim-stats"></div>',
'<h3>'+t.bill+'</h3><div class="bcore-sim-bom"></div>',
'<p class="bcore-sim-note">'+t.manual+'</p><p class="bcore-sim-note">'+t.noPrice+'</p>',
'<div class="bcore-sim-actions"><button type="button" class="button solid bcore-sim-send">'+t.request+'</button><button type="button" class="button bcore-sim-download">'+t.download+'</button><button type="button" class="button bcore-sim-reset">'+t.reset+'</button></div>',
'<p class="bcore-sim-note">'+t.note+'</p>',
'</div></div></div>'].join("");
}
const ns="http://www.w3.org/2000/svg";
function shape(svg,type,att,content){
  const el=document.createElementNS(ns,type);
  for(const [key,val] of Object.entries(att))el.setAttribute(key,String(val));
  if(content!==undefined)el.textContent=String(content);
  svg.appendChild(el);return el;
}
function line(svg,x1,y1,x2,y2,color="#c9aa86",weight=2){
  shape(svg,"line",{x1,y1,x2,y2,stroke:color,"stroke-width":weight,"stroke-linecap":"round"});
}
function label(svg,x,y,str,size=13,color="#d1ae87"){
  shape(svg,"text",{x,y,fill:color,"font-family":"Arial, sans-serif","font-size":size,"text-anchor":"middle"},str);
}
function box(svg,x,y,w,h,fill="#d1ae87",opacity=1){
  shape(svg,"rect",{x,y,width:Math.max(w,0),height:Math.max(h,0),fill,opacity});
}
function postsPositions(geo,L,R,scale){
  const centres=[];
  for(let i=0;i<=geo.bayCount;i++)centres.push(L+(geo.postWidth/2 + i*geo.centre)*scale);
  return centres;
}
function front(){
  const svg=document.querySelector("#bcore-configurator .bcore-sim-elevation");if(!svg)return;
  svg.replaceChildren();const g=calc(),L=55,R=845,top=49,base=304;
  const scale=(R-L)/state.length,vscale=(base-top)/state.height;
  const postPx=Math.max(2,g.postWidth*scale), centres=postsPositions(g,L,R,scale);
  const metal=state.finish==="inox"?"#c5d4d7":state.finish==="galvanized"?"#9eabb0":"#d1ae87";
  line(svg,25,base+5,870,base+5,"#454447",1);
  if(measure()){
    const railH=Math.max(2,depth(state.rail)*vscale),barW=Math.max(1.4,g.barWidth*scale);
    const yTop=base-state.height*vscale, yBarTop=yTop+railH;
    const yFillBottom=base-state.bottom*vscale;
    if(g.glass){
      for(let j=0;j<g.bayCount;j++){
        const x1=centres[j]+postPx/2+20*scale,x2=centres[j+1]-postPx/2-20*scale;
        if(x2>x1)shape(svg,"rect",{x:x1,y:yBarTop+8,width:x2-x1,height:Math.max(0,yFillBottom-yBarTop-13),fill:"#81a1ae","fill-opacity":.18,stroke:"#7d9ba5","stroke-width":1});
      }
    }else if(g.horizontal){
      const n=state.hBars;
      for(let j=0;j<g.bayCount;j++){
        const left=centres[j]+postPx/2,right=centres[j+1]-postPx/2;
        const room=Math.max(1,yFillBottom-yBarTop);
        for(let k=1;k<=n;k++){
          const y=yBarTop+room*k/(n+1);
          box(svg,left,y-barW/2,right-left,barW,metal);
        }
      }
    }else{
      const bwReal=g.barWidth;
      for(let j=0;j<g.bayCount;j++){
        const start=centres[j]+postPx/2;
        for(let k=0;k<g.barsPerBay;k++){
          const gx=g.actualGap+(k*(bwReal+g.actualGap));
          box(svg,start+gx*scale,yBarTop,barW,Math.max(1,yFillBottom-yBarTop),metal);
        }
      }
    }
    for(let j=0;j<=g.bayCount;j++)box(svg,centres[j]-postPx/2,yTop,postPx,base-yTop+2,metal);
    box(svg,L,yTop,R-L,railH,metal);
  }else if(state.type==="stairs"){
    const steps=state.steps;
    for(let j=0;j<steps;j++){
      const x=L+(R-L)*j/steps,y=base-(base-top)*(j+1)/steps;
      line(svg,x,y,x+(R-L)/steps,y,metal,4);
      line(svg,x+(R-L)/steps,y,x+(R-L)/steps,y+(base-top)/steps,metal,3);
    }
    line(svg,L,base,R,top,metal,5);
    line(svg,L,base-65,R,top-65,metal,2);
  }else{
    const beamHeight=Math.max(2,depth(state.beam)*vscale),fall=state.type==="canopy"?state.roofDrop*vscale:0;
    centres.forEach((x,j)=>box(svg,x-postPx/2,top+(fall*j/g.bayCount),postPx,base-top-(fall*j/g.bayCount),metal));
    const start=centres[0],end=centres[centres.length-1];
    line(svg,start,top,end,top+fall,metal,Math.max(3,beamHeight));
    if(state.brace!=="none"){
      for(let j=0;j<g.bayCount;j++){
        const x1=centres[j],x2=centres[j+1],y1=top+fall*j/g.bayCount,y2=top+fall*(j+1)/g.bayCount;
        line(svg,x1,y1+beamHeight,x2,base,metal,2);
        if(state.brace==="cross")line(svg,x2,y2+beamHeight,x1,base,metal,2);
      }
    }
  }
  const dimension=base+37;
  line(svg,L,dimension,R,dimension,"#77736f",1);line(svg,L,dimension-7,L,dimension+7,"#77736f",1);line(svg,R,dimension-7,R,dimension+7,"#77736f",1);
  label(svg,450,dimension+20,format(state.length)+" mm",16);
  label(svg,24,(top+base)/2,format(state.height)+" mm",12);
  if(g.bayCount<=12&&state.type!=="stairs"){
    for(let j=0;j<g.bayCount;j++)label(svg,(centres[j]+centres[j+1])/2,base-12,format(g.centre),11,"#9ba5a4");
  }
}
function plan(){
  const svg=document.querySelector("#bcore-configurator .bcore-sim-plan");if(!svg)return;
  svg.replaceChildren();const g=calc(),L=55,R=845,scale=(R-L)/state.length;
  const x=postsPositions(g,L,R,scale),p=Math.max(3,g.postWidth*scale);
  line(svg,L,49,R,49,"#a2a09d",3);
  x.forEach(c=>{box(svg,c-p/2,36,p,25,"#d1ae87");line(svg,c,24,c,85,"#686866",1);});
  if(x.length<=13)for(let j=0;j<x.length-1;j++)label(svg,(x[j]+x[j+1])/2,107,format(g.centre)+" mm",11);
  else label(svg,450,107,format(g.centre)+" mm",13);
}
function scheduleText(){
  const t=locale(),g=calc();
  const arr=[
  [t.total,format(state.length)+" × "+format(state.height)+" mm"],
  [t.postCount,g.postCount+" "+t.countUnit+" · "+state.post],
  [t.bayCount,String(g.bayCount)],
  [t.axis,format(g.centre)+" mm"],
  [t.open,format(g.opening)+" mm"]
  ];
  const parts=[];
  if(measure()){
    parts.push(t.postCount+": "+g.postCount+" × "+state.post+" · "+format(state.height)+" mm");
    parts.push(t.railLength+": "+format(state.length)+" mm ("+state.rail+")");
    if(g.vertical){
      arr.push([t.barCount,g.totalBars+" "+t.countUnit+" · "+state.bar]);
      arr.push([t.actualGap,format(g.actualGap)+" mm"]);
      arr.push([t.barLength,format(g.barLength)+" mm"]);
      parts.push(t.barCount+": "+g.totalBars+" × "+state.bar+" · "+format(g.barLength)+" mm");
    }else if(g.horizontal){
      arr.push([t.hbarCount,g.hBarCount+" "+t.countUnit+" · "+state.bar]);
      arr.push([t.actualGap,format(g.actualGap)+" mm"]);
      parts.push(t.hbarCount+": "+g.hBarCount+" × "+state.bar+" · "+format(g.opening)+" mm");
    }else{
      arr.push([t.glassCount,g.glassCount+" "+t.countUnit+" · "+state.glass+" mm"]);
      arr.push([t.glassWidth,format(g.glassW)+" mm"]);
      parts.push(t.glassCount+": "+g.glassCount+" × "+format(g.glassW)+" mm × "+format(g.barLength)+" mm × "+state.glass+" mm");
    }
  }else if(state.type==="stairs"){
    arr.push([t.stairsRise,format(state.height/state.steps)+" mm"]);
    arr.push([t.stairsGoing,format(state.length/state.steps)+" mm"]);
    parts.push(t.steps+": "+state.steps);
    parts.push(t.main+": "+state.beam+" · "+t.manual);
  }else{
    arr.push([t.mainLen,format(state.length)+" mm"]);
    parts.push(t.postCount+": "+g.postCount+" × "+state.post+" · "+format(state.height)+" mm");
    parts.push(t.mainLen+": "+format(state.length)+" mm ("+state.beam+")");
  }
  const stats=document.querySelector("#bcore-configurator .bcore-sim-stats");
  const bom=document.querySelector("#bcore-configurator .bcore-sim-bom");
  if(stats)stats.replaceChildren(...arr.map(([k,v])=>{
    const e=document.createElement("div"),a=document.createElement("span"),b=document.createElement("strong");
    a.textContent=k;b.textContent=v;e.append(a,b);return e;
  }));
  if(bom)bom.textContent=parts.join("\n");
}
function spec(){
  const t=locale(),g=calc();
  const arr=[t.summaryTitle,"",t.type+": "+t.types[types.indexOf(state.type)],t.length+": "+format(state.length)+" mm",t.height+": "+format(state.height)+" mm",t.posts+": "+state.post,t.postCount+": "+g.postCount,t.bayCount+": "+g.bayCount,t.axis+": "+format(g.centre)+" mm",t.open+": "+format(g.opening)+" mm"];
  if(measure()){
    arr.push(t.rail+": "+state.rail,t.pattern+": "+t.patterns[patterns.indexOf(state.pattern)],t.bottom+": "+state.bottom+" mm");
    if(g.glass)arr.push(t.glass+": "+state.glass+" mm",t.glassWidth+": "+format(g.glassW)+" mm");
    else arr.push(t.bar+": "+state.bar,t.barCount+": "+(g.vertical?g.totalBars:g.hBarCount),t.actualGap+": "+format(g.actualGap)+" mm",t.barLength+": "+format(g.vertical?g.barLength:g.opening)+" mm");
  }else arr.push(t.main+": "+state.beam,t.brace+": "+t.braces[braces.indexOf(state.brace)]);
  arr.push(t.finish+": "+t.finishes[coats.indexOf(state.finish)],t.mount+": "+t.mountings[mounts.indexOf(state.mount)],"",t.disclaimer,"",t.extra);
  return arr.join("\n");
}
function activeControls(){
  const root=document.getElementById("bcore-configurator");if(!root)return;
  const infill=measure();
  for(const node of root.querySelectorAll("[data-show]")){
    const c=node.dataset.show;const visible=
    c==="rail"?infill:
    c==="infill"?infill:
    c==="vertical"?infill&&state.pattern==="vertical":
    c==="horizontal"?infill&&state.pattern==="horizontal":
    c==="glass"?infill&&state.pattern==="glass":
    c==="structure"?(state.type==="frame"||state.type==="canopy"):
    c==="stairs"?state.type==="stairs":
    c==="canopy"?state.type==="canopy":true;
    node.hidden=!visible;
  }
  for(const key of ["bar","bar2"]){
    const ctrl=root.querySelector("[name="+key+"]");
    if(ctrl)ctrl.value=state.bar;
  }
}
function redraw(){
  activeControls();front();plan();scheduleText();
}
function mount(){
  if(!location.hash.startsWith("#/konstrukcje-stalowe"))return;
  const app=document.getElementById("app");if(!app||app.querySelector("#bcore-configurator"))return;
  const section=document.createElement("section");section.id="bcore-configurator";section.className="bcore-sim-section";
  section.innerHTML=configMarkup(locale());
  const cta=app.querySelector(".cta-section");
  if(cta)cta.before(section);else app.appendChild(section);
  const form=section.querySelector("form");
  for(const [key,value] of Object.entries(state)){
    const control=form.elements.namedItem(key);
    if(control)control.value=String(value);
  }
  form.addEventListener("submit",ev=>ev.preventDefault());
  form.addEventListener("input",ev=>{
    const element=ev.target,key=element?.name;if(!key||!(key in state))return;
    if(key in clamps){
      const number=Number(element.value);
      if(element.value===""||!Number.isFinite(number))return;
      state[key]=Math.min(clamps[key][1],Math.max(clamps[key][0],number));
    }else state[key]=element.value;
    if(key==="bar"||key==="bar2")state.bar=element.value;
    redraw();
  });
  form.addEventListener("change",ev=>{
    const element=ev.target,key=element?.name;if(!key)return;
    if(key==="type"){
      state.height=state.type==="fence"?1600:state.type==="railing"?1100:state.type==="stairs"?3000:state.type==="canopy"?2600:3000;
      form.elements.namedItem("height").value=String(state.height);
      state.post=state.type==="frame"||state.type==="canopy"?"80x80":"40x40";
      form.elements.namedItem("post").value=state.post;
    }
    if(key in clamps)element.value=String(state[key]);
    redraw();
  });
  section.querySelector(".bcore-sim-reset").addEventListener("click",()=>{
    Object.assign(state,defaultState);
    for(const [key,value] of Object.entries(state)){
      const control=form.elements.namedItem(key);
      if(control)control.value=String(value);
    }
    redraw();
  });
  section.querySelector(".bcore-sim-send").addEventListener("click",()=>{
    const message=spec();
    try{sessionStorage.setItem("bcore-config-enquiry",message);}
    catch(error){
      location.href="mailto:przemyslaw.bugajski78@gmail.com?subject=B-CORE%20Steel&body="+encodeURIComponent(message);return;
    }
    location.hash="#/kontakt";
  });
  section.querySelector(".bcore-sim-download").addEventListener("click",()=>{
    const blob=new Blob([spec()],{type:"text/plain;charset=utf-8"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download="B-CORE-konfiguracja.txt";document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),800);
  });
  // Add a compact jump link to the details without changing the existing hero.
  const actions=app.querySelector(".detail-hero .actions");
  if(actions&&!actions.querySelector(".bcore-sim-open")){
    const btn=document.createElement("button");btn.className="button bcore-sim-open";btn.type="button";
    btn.textContent=locale().title;
    btn.addEventListener("click",()=>section.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"}));
    actions.appendChild(btn);
  }
  redraw();
}
let queued=false;
function check(){
  if(queued)return;queued=true;
  requestAnimationFrame(()=>{queued=false;mount();});
}
function start(){
  const app=document.getElementById("app");if(!app)return;
  new MutationObserver(check).observe(app,{childList:true});
  window.addEventListener("hashchange",check);
  document.getElementById("bcLang")?.addEventListener("change",check);
  check();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
else start();
})();