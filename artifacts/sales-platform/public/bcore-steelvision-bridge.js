/* B-CORE SteelVision v19 — small quotation handoff bridge.
   All design calculations remain inside the user's browser.
   Only on explicit "request quote" is the project staged for the B-CORE form. */
(()=>{
  "use strict";
  const pick=(pl,en,de)=>{
    const lang=typeof svPreferences!=="undefined"?svPreferences.lang:"pl";
    return lang==="en"?en:lang==="de"?de:pl;
  };
  const $id=id=>document.getElementById(id);
  function sendQuote(){
    try{
      if(typeof saveForm==="function")saveForm();
      const project={};
      if(!Array.isArray(projectIds)||!state?.items?.length)throw Error("No project items");
      for(const id of projectIds)project[id]=$id(id)?.value||"";
      const design=JSON.parse(JSON.stringify(
        {version:"B-CORE-SteelVision-19",project,state},
        (key,value)=>key.startsWith("_")?undefined:value
      ));
      if(!Array.isArray(design.state?.items)||!design.state.items.length)throw Error("Empty design");
      const brief=typeof orderText==="function"?orderText():"SteelVision v19 — "+(project.projectName||"");
      const note=brief.length<=12500?brief:brief.slice(0,12000)+"\n[Pełny projekt jest zapisany w B-CORE jako JSON]";
      // Abort without navigating if browser storage is full.
      sessionStorage.setItem("bcore-steelvision-draft",JSON.stringify(design));
      sessionStorage.setItem("bcore-config-enquiry",note);
      window.location.assign("/#/kontakt");
    }catch(error){
      alert(pick(
        "Nie można przenieść projektu do formularza. Zapisz kopię przez „Eksport projektu” i spróbuj ponownie.",
        "Could not transfer the design to the enquiry form. Export a copy and try again.",
        "Das Projekt konnte nicht übertragen werden. Bitte exportieren und erneut versuchen."
      ));
    }
  }
  function init(){
    if($id("bcoreSteelVisionV19Quote"))return;
    const action=document.createElement("button");
    action.id="bcoreSteelVisionV19Quote";
    action.type="button";
    action.className="soft";
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