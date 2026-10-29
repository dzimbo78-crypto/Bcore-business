/* B-CORE SteelVision v19 quote bridge.
 * Keep existing product logic; only preliminary, constrained geometry changes
 * are automatic. Every change is audit-logged and must be engineering-checked.
 */
(()=>{
  "use strict";
  const $id=id=>document.getElementById(id);
  const pick=(pl,en,de)=>{
    const lang=typeof svPreferences!=="undefined"?svPreferences.lang:"pl";
    return lang==="en"?en:lang==="de"?de:pl;
  };
  function openDraftDb(){
    return new Promise((resolve,reject)=>{
      if(!window.indexedDB){reject(Error("IndexedDB unavailable"));return}
      const request=indexedDB.open("bcore-steelvision-handoff",1);
      request.onupgradeneeded=()=>{
        const db=request.result;
        if(!db.objectStoreNames.contains("drafts"))db.createObjectStore("drafts");
      };
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error||Error("Failed to open draft storage"));
    });
  }
  async function stageDraft(design,note){
    const json=JSON.stringify(design);
    sessionStorage.removeItem("bcore-steelvision-draft-idb");
    try{
      sessionStorage.setItem("bcore-steelvision-draft",json);
    }catch(error){
      // Full-resolution reference images may exceed sessionStorage quota.
      const db=await openDraftDb();
      try{
        await new Promise((resolve,reject)=>{
          const tx=db.transaction("drafts","readwrite");
          tx.objectStore("drafts").put(json,"active");
          tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||Error("Unable to stage design"));
        });
      }finally{db.close()}
      sessionStorage.removeItem("bcore-steelvision-draft");
      sessionStorage.setItem("bcore-steelvision-draft-idb","1");
    }
    sessionStorage.setItem("bcore-config-enquiry",note);
  }
  function automaticGeometryReview(){
    const changes=[],unresolved=[];
    if(!Array.isArray(state?.items))return {changes,unresolved};
    for(const it of state.items){
      // Only tiny, explicitly welded gaps are visually snapped. Do not infer
      // welds, bolt sizes, load capacity or material substitutions.
      if(typeof linear==="function"&&linear(it)&&Array.isArray(it.segments)){
        const tolerance=Math.max(0,Math.min(2,Number(it.allowedJointGapMm)||0));
        it.segments.slice(0,-1).forEach((segment,index)=>{
          const gap=Number(segment.jointGap)||0;
          if(segment.jointType==="Spawane"&&gap>0&&gap<=tolerance){
            segment.jointGap=0;
            changes.push({item:it.name,code:"JOINT-SNAP",field:"segments["+index+"].jointGap",
              before:gap+" mm",after:"0 mm",reason:"Visual closure of a minor preselected welded joint gap; weld detail still requires verification."});
          }else if(!["Spawane","Skręcane","Osobne / dylatacja"].includes(segment.jointType)){
            unresolved.push(it.name+": connection S"+(index+1)+"/S"+(index+2)+" requires a deliberate connection type.");
          }
        });
      }
      // Use the ORIGINAL SteelVision solver rather than a competing formula.
      const suggestions=typeof solverSuggestions==="function"?solverSuggestions(it):[];
      for(const s of suggestions){
        if(s.apply==="infill"&&Number(it.maxOpeningMm)>0){
          const before=Number(it.infillSpacing)||0,after=Math.max(1,Number(it.maxOpeningMm));
          if(after<before){it.infillSpacing=after;changes.push({item:it.name,code:"INFILL-GAP",field:"infillSpacing",before:before+" mm",after:after+" mm",reason:"Respect customer-entered maximum clear opening (preliminary geometry only)."});}
        }else if(s.apply==="hbars"&&Number.isFinite(+s.value)){
          const before=Number(it.hbarCount)||0,after=Math.min(200,Math.max(before,Number(s.value)));
          if(after>before){it.hbarCount=after;changes.push({item:it.name,code:"HORIZONTAL-INFILL",field:"hbarCount",before,after,reason:"Reduce preliminary clear openings; check local safety requirements."});}
        }else if(s.apply==="spacing"&&Number.isFinite(+s.value)&&Number(s.value)>0){
          const before=Number(it.postSpacing)||0,after=Math.min(before,Number(s.value));
          if(after>0&&after<before){it.postSpacing=after;changes.push({item:it.name,code:"MOUNT-SPACING",field:"postSpacing",before:before+" cm",after:after+" cm",reason:"Respect customer-entered maximum automatic fixing spacing; anchor design remains unverified."});}
        }
      }
    }
    if(changes.length&&typeof updateAll==="function")updateAll();
    return {changes,unresolved};
  }
  function buildReport(review){
    const validation=typeof projectValidationSummary==="function"?projectValidationSummary():{issues:[],blockers:0,warnings:0};
    const integrity=typeof v16IntegrityAudit==="function"?v16IntegrityAudit():{issues:[],passed:0,total:0};
    const connections=typeof v16ConnectionSchedule==="function"?v16ConnectionSchedule():[];
    const parts=typeof allProductionParts==="function"?allProductionParts():[];
    const recommendations=[...review.unresolved];
    for(const it of state.items){
      if(typeof solverSuggestions!=="function")continue;
      for(const s of solverSuggestions(it)){
        if(s.code==="STR")recommendations.push(it.name+": "+s.title+" - "+s.suggest+" (screening only; verify by structural engineer).");
        else if(s.sev!=="good"&&!s.apply)recommendations.push(it.name+": "+s.title+" - "+s.suggest);
      }
    }
    recommendations.push("Structural capacity, characteristic load combinations, buckling, deflection, welds, bolted joints, anchors, substrate, ground conditions and EN 1090 execution must be checked by a qualified engineer.");
    return {
      generator:"SteelVision Studio / B-CORE RFQ v19",
      createdAt:new Date().toISOString(),
      corrections:review.changes,
      validation,
      integrity,
      connections,
      parts,
      recommendations,
      totals:typeof v16SummaryJson==="function"?JSON.parse(v16SummaryJson()).totals:null,
      scope:"Concept / RFQ; not a final structural verification or release to fabrication."
    };
  }
  async function sendQuote(){
    const buttons=[$id("bcoreSteelVisionV19Quote"),$id("bcoreSteelVisionV19QuoteTop")].filter(Boolean);
    if(buttons.some(b=>b.disabled))return;
    buttons.forEach(b=>b.disabled=true);
    try{
      if(typeof saveForm==="function")saveForm();
      if(!Array.isArray(projectIds)||!state?.items?.length)throw Error("No project items");
      const review=automaticGeometryReview();
      const project={};
      for(const id of projectIds)project[id]=$id(id)?.value||"";
      const design=JSON.parse(JSON.stringify({
        version:"B-CORE-SteelVision-19",
        quoteId:(window.crypto?.randomUUID?.()||("q"+Date.now()+"-"+Math.random().toString(16).slice(2))),
        project,state,report:buildReport(review)
      }));
      const brief=typeof orderText==="function"?orderText():"SteelVision project: "+(project.projectName||"");
      // Contact textarea is max 10k; JSON/CSV/PDF carry the complete design.
      const note=brief.slice(0,8200)+
        "\n\n[STEELVISION] Pelny projekt JSON, CSV i raport PDF zostana przekazane jako zalaczniki e-mail."+
        (review.changes.length?"\nAutomatyczne poprawki geometrii: "+review.changes.length+" (szczegoly w raporcie).":"");
      await stageDraft(design,note);
      window.location.assign("/#/kontakt");
    }catch(error){
      console.error("SteelVision quote handoff failed:",error?.name||"UnknownError");
      alert(pick(
        "Nie udało się przenieść pełnego projektu. Pobierz JSON przez „Eksport projektu” i ponów próbę.",
        "Could not transfer the complete project. Export JSON and retry.",
        "Das vollständige Projekt konnte nicht übertragen werden. Bitte als JSON sichern und erneut versuchen."
      ));
    }finally{buttons.forEach(b=>b.disabled=false)}
  }
  function init(){
    if($id("bcoreSteelVisionV19Quote"))return;
    const action=document.createElement("button");
    action.id="bcoreSteelVisionV19Quote";action.type="button";action.className="soft";
    action.style.cssText="background:#bb8750;color:#fff;min-height:44px;padding:11px 16px;font-size:12px;max-width:100%;white-space:normal";
    action.textContent=pick("Wyślij pełny projekt do wyceny B-CORE","Send full project for a B-CORE quote","Gesamtes Projekt zur Anfrage an B-CORE senden");
    action.addEventListener("click",sendQuote);
    const bottom=$id("copyOrder");
    if(bottom)bottom.insertAdjacentElement("afterend",action);
    else $id("exportBtn")?.insertAdjacentElement("afterend",action);
    if(bottom){
      const top=document.createElement("button");
      top.type="button";top.className="soft";top.id="bcoreSteelVisionV19QuoteTop";
      top.textContent=pick("Zapytaj o wycenę","Request quote","Angebot anfragen");
      top.addEventListener("click",sendQuote);
      $id("exportBtn")?.insertAdjacentElement("afterend",top);
    }
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();
