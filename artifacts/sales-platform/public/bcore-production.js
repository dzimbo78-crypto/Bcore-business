(function () {
  "use strict";
  // This file integrates the approved B-CORE cinematic experience with the production API.
  const mail = "przemyslaw.bugajski78@gmail.com";
  const words = {
    pl: {name:"Imię i nazwisko",email:"Adres e-mail",phone:"Telefon (opcjonalnie)",topic:"Temat",msg:"Opisz swój projekt",send:"Wyślij zapytanie",sending:"Wysyłanie…",sent:"Formularz przyjął zapytanie. Dziękujemy!",error:"Nie udało się wysłać przez AJAX. Możesz ponowić wysyłkę formularza w nowej karcie:",privacy:"Wysyłając formularz, zgadzasz się na kontakt w sprawie zapytania.",hint:"Pola oznaczone * są wymagane.",activation:"FormSubmit wysłał prośbę o aktywację na skrzynkę odbiorcy. Wiadomość nie jest jeszcze dostarczona. Sprawdź Gmail i Spam.",alt:"Napisz e-mail",browser:"Wyślij formularz w nowej karcie",stored:"Projekt stalowy został zapisany w B-CORE. Numer zgłoszenia:",steelError:"Nie udało się zapisać projektu w B-CORE. Wszystkie dane zostały zachowane — spróbuj ponownie za chwilę."},
    en: {name:"Full name",email:"Email address",phone:"Phone (optional)",topic:"Subject",msg:"Describe your project",send:"Send enquiry",sending:"Sending…",sent:"The form accepted your enquiry. Thank you!",error:"AJAX delivery failed. You can submit this form in a new tab:",privacy:"By submitting, you agree to be contacted about your enquiry.",hint:"Fields marked * are required.",activation:"FormSubmit has requested recipient activation. Delivery is not confirmed yet; please check the receiving inbox and spam.",alt:"Send an email",browser:"Submit form in a new tab",stored:"Your steel enquiry was saved by B-CORE. Reference:",steelError:"B-CORE could not save this steel project. Your inputs were preserved — please try again shortly."},
    da: {name:"Fulde navn",email:"E-mailadresse",phone:"Telefon (valgfrit)",topic:"Emne",msg:"Beskriv dit projekt",send:"Send forespørgsel",sending:"Sender…",sent:"Formularen har modtaget din forespørgsel. Tak!",error:"AJAX-afsendelse mislykkedes. Du kan sende formularen i en ny fane:",privacy:"Når du sender formularen, accepterer du kontakt om din henvendelse.",hint:"Felter med * skal udfyldes.",activation:"FormSubmit kræver aktivering af modtageradressen. Kontroller indbakke og spam. Levering er ikke bekræftet.",alt:"Send en e-mail",browser:"Send formular i ny fane",stored:"Din stålkonstruktionsforespørgsel er gemt hos B-CORE. Nummer:",steelError:"Projektet kunne ikke gemmes i B-CORE. Dine data er bevaret — prøv igen om lidt."},
    de: {name:"Vor- und Nachname",email:"E-Mail-Adresse",phone:"Telefon (optional)",topic:"Betreff",msg:"Beschreiben Sie Ihr Projekt",send:"Anfrage senden",sending:"Wird gesendet…",sent:"Das Formular hat Ihre Anfrage angenommen. Vielen Dank!",error:"Die AJAX-Übertragung ist fehlgeschlagen. Bitte Formular in einem neuen Tab senden:",privacy:"Mit dem Absenden stimmen Sie einer Kontaktaufnahme zu Ihrer Anfrage zu.",hint:"Mit * gekennzeichnete Felder sind Pflichtfelder.",activation:"FormSubmit erfordert die Aktivierung der Empfängeradresse. Bitte Posteingang und Spam prüfen.",alt:"E-Mail schreiben",browser:"Formular in neuem Tab senden",stored:"Ihre Stahlbauanfrage wurde bei B-CORE gespeichert. Referenz:",steelError:"B-CORE konnte das Projekt nicht speichern. Ihre Daten bleiben erhalten — bitte später erneut versuchen."}
  };
  const lang = () => words[document.getElementById("bcLang")?.value] ? document.getElementById("bcLang").value : "pl";

  // Drafts are short-lived quotation handoffs, not previous simulator sessions.
  async function openSteelDb() {
    return new Promise((resolve,reject)=>{
      if(!window.indexedDB){reject(Error("IndexedDB unavailable"));return}
      const r=indexedDB.open("bcore-steelvision-handoff",1);
      r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains("drafts"))r.result.createObjectStore("drafts")};
      r.onsuccess=()=>resolve(r.result);
      r.onerror=()=>reject(r.error||Error("Cannot open draft database"));
    });
  }
  async function readSteelDraft(){
    let raw=sessionStorage.getItem("bcore-steelvision-draft");
    if(!raw&&sessionStorage.getItem("bcore-steelvision-draft-idb")==="1"){
      const db=await openSteelDb();
      try{raw=await new Promise((resolve,reject)=>{
        const tx=db.transaction("drafts","readonly"),r=tx.objectStore("drafts").get("active");
        r.onsuccess=()=>resolve(r.result||null);
        r.onerror=()=>reject(r.error||Error("Draft unavailable"));
      })}finally{db.close()}
    }
    return raw?JSON.parse(raw):null;
  }
  async function clearSteelDraft(){
    const inDb=sessionStorage.getItem("bcore-steelvision-draft-idb")==="1";
    sessionStorage.removeItem("bcore-steelvision-draft");
    sessionStorage.removeItem("bcore-steelvision-draft-idb");
    if(!inDb)return;
    try{
      const db=await openSteelDb();
      try{await new Promise((resolve,reject)=>{
        const tx=db.transaction("drafts","readwrite");
        tx.objectStore("drafts").delete("active");
        tx.oncomplete=resolve;
        tx.onerror=()=>reject(tx.error||Error("Delete failed"));
      })}finally{db.close()}
    }catch(_e){/* A submitted project is never reloaded by the simulator. */}
  }

  function appendSteelDownload(status) {
    if(status.querySelector(".bcore-steel-json-backup"))return;
    const button=document.createElement("button");
    button.type="button";
    button.className="bcore-form-native-retry bcore-steel-json-backup";
    button.textContent="Pobierz pełny projekt JSON";
    button.addEventListener("click",async()=>{
      try{
        const design=await readSteelDraft();
        if(!design)throw Error("Draft unavailable");
        const blob=new Blob([JSON.stringify(design,null,2)],{type:"application/json;charset=utf-8"});
        const url=URL.createObjectURL(blob);
        const a=document.createElement("a");
        a.href=url;a.download="B-CORE_SteelVision_kopia_projektu.json";
        document.body.appendChild(a);a.click();a.remove();
        setTimeout(()=>URL.revokeObjectURL(url),1200);
      }catch(_e){alert("Kopia nie jest dostępna. Jeśli projekt pozostaje otwarty w symulatorze, wybierz Eksport projektu.");}
    });
    status.append(document.createTextNode(" "),button);
  }

  function steelMailAdvice(code) {
    const hints = {
      email_not_configured: "Serwer nie ma poprawnie ustawionych RESEND_API_KEY i RESEND_FROM_EMAIL. Administrator musi skonfigurować nadawcę.",
      email_auth_rejected: "Dostawca odrzucił autoryzację. Administrator powinien sprawdzić klucz API oraz uprawnienia Resend.",
      sender_or_request_rejected: "Resend odrzucił nadawcę lub żądanie. Sprawdź weryfikację domeny nadawczej i limity załączników.",
      attachments_too_large: "Pliki przekraczają limit wysyłki. Pobierz JSON i zmniejsz liczbę obrazów referencyjnych.",
      provider_rate_limited: "Dostawca nałożył limit wysyłek. Spróbuj ponownie później.",
      provider_unavailable: "Serwer pocztowy zgłosił przejściową awarię.",
      provider_timeout: "Serwer pocztowy nie odpowiedział na czas.",
      provider_network_error: "Serwer nie mógł połączyć się z dostawcą poczty.",
      invalid_data: "Projekt zawiera nieprawidłowe dane. Wróć do SteelVision i sprawdź geometrię oraz pola projektu.",
      design_too_large: "Projekt jest zbyt duży. Pobierz JSON i ogranicz obrazy referencyjne."
    };
    return hints[code] || "E-mail nie został zaakceptowany. Administrator powinien sprawdzić stan usługi i logi wysyłki.";
  }
  // Resend is the only route for real attachments. If it is not configured,
  // use the visitor browser (not the Render server) to notify FormSubmit
  // with the RFQ reference; full PDFs/CSV/JSON remain in authenticated admin.
  async function sendSteelFallbackNotice(body, reference) {
    const excerpt=String(body.message||"").slice(0,5800);
    const payload={
      name: String(body.name||""),
      email: String(body.email||""),
      phone: String(body.phone||""),
      category: "Konstrukcje stalowe / SteelVision",
      message: "B-CORE SteelVision - zapytanie "+reference+"\n"+
        "Pelny projekt, raport PDF, CSV i JSON zapisano w B-CORE (panel /admin).\n"+
        "To powiadomienie nie zawiera plikow. Pobierz je w panelu admina.\n\n"+excerpt,
      _subject: "[B-CORE] SteelVision "+reference+" - zapytanie do wyceny",
      _template: "table", _captcha:"false", _honey:"",
      _url: window.location.origin+"/#/kontakt"
    };
    const response=await fetch("https://formsubmit.co/ajax/"+mail,{
      method:"POST",mode:"cors",credentials:"omit",
      headers:{"Content-Type":"application/json","Accept":"application/json"},
      signal:AbortSignal.timeout(18000),body:JSON.stringify(payload)
    });
    const result=await response.json().catch(()=>null);
    if(response.ok && (result?.success===true||result?.success==="true"))return true;
    const err=new Error("FormSubmit did not accept browser notification");
    err.activation=/activat|confirm/i.test(String(result?.message||""));
    throw err;
  }
  function installContactForm() {
    const container = document.getElementById("app");
    if (!container || document.getElementById("bcore-contact-form")) return;
    const oldLink = container.querySelector('a[href^="mailto:"]');
    if (!oldLink || !location.hash.startsWith("#/kontakt")) return;
    const l = words[lang()];
    const el = document.createElement("form");
    el.id = "bcore-contact-form";
    el.className = "bcore-contact-form";
    el.innerHTML = [
      '<label>'+l.name+' *<input name="name" type="text" minlength="2" maxlength="120" autocomplete="name" required></label>',
      '<label>'+l.email+' *<input name="email" type="email" maxlength="254" autocomplete="email" required></label>',
      '<label>'+l.phone+'<input name="phone" type="tel" maxlength="200" autocomplete="tel"></label>',
      '<label>'+l.topic+'<input name="category" type="text" maxlength="200"></label>',
      '<label class="form-full">'+l.msg+' *<textarea name="message" rows="6" minlength="10" maxlength="10000" required></textarea></label>',
      '<input type="text" name="website" class="form-honeypot" tabindex="-1" autocomplete="off" aria-hidden="true">',
      '<p class="small-note form-full">'+l.privacy+' <a href="/polityka-prywatnosci" class="bcore-form-policy">Privacy / Polityka prywatności</a></p>',
      '<button type="submit" class="button solid">'+l.send+' ↗</button>',
      '<p class="form-full bcore-form-message" role="status" aria-live="polite"></p>'
    ].join("");
    oldLink.replaceWith(el);
    const previewNote = Array.from(container.querySelectorAll(".small-note")).find(x =>
      x.textContent.includes("W tym podglądzie") || x.textContent.includes("Formularz online pozostaje")
    );
    if (previewNote) previewNote.remove();
    // Official FormSubmit AJAX: the request originates from the actual website
    // in the visitor's browser. A server-side Render proxy was rejected with 403.
    // This integrates directly with the existing React-free contact form.
    function submitNativeInNewTab(body) {
      const fallback = document.createElement("form");
      fallback.method = "POST";
      fallback.action = "https://formsubmit.co/" + mail;
      fallback.target = "_blank";
      fallback.style.display = "none";
      fallback.setAttribute("aria-hidden", "true");
      Object.entries(body).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value ?? "");
        fallback.appendChild(input);
      });
      document.body.appendChild(fallback);
      fallback.submit();
      fallback.remove();
    }
    el.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!el.reportValidity()) return;
      const status = el.querySelector(".bcore-form-message");
      const send = el.querySelector('button[type="submit"]');
      const val = words[lang()];
      const body = Object.fromEntries(new FormData(el).entries());
      // The full steel design brief is already in the message textarea,
      // so it travels with name, email, telephone and subject.
      body._subject = "[B-CORE] " + (body.category || "Enquiry");
      body._template = "table";
      body._captcha = "false";
      body._honey = body.website || "";
      body._url = window.location.origin + "/#/kontakt";
      delete body.website;
      send.disabled = true;
      send.textContent = val.sending;
      status.replaceChildren();
      let steelEnquiry = false;
      try {
        // A full SteelVision project is stored in Neon with one small API
        // request. All 3D calculations remain client-side; no email provider
        // is required to preserve customer quote requests.
        const hasDesign = Boolean(sessionStorage.getItem("bcore-steelvision-draft") ||
          sessionStorage.getItem("bcore-steelvision-draft-idb"));
        if (hasDesign) {
          steelEnquiry = true;
          const steelDraft = await readSteelDraft();
          if (!steelDraft || !Array.isArray(steelDraft.state?.items) || !steelDraft.state.items.length) {
            throw new Error("SteelVision draft missing or corrupted");
          }
          const response = await fetch("/api/steel-enquiries", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            signal: AbortSignal.timeout(30000),
            body: JSON.stringify({
              name: body.name,
              email: body.email,
              phone: body.phone || "",
              category: body.category || "Konstrukcje stalowe",
              message: body.message,
              website: body._honey || "",
              design: steelDraft
            })
          });
          const reply = await response.json().catch(() => ({}));
          if (!response.ok || !reply?.ok || !reply.reference) {
            const error = new Error("Steel project submission failed");
            error.code = reply?.code || String(response.status);
            throw error;
          }
          if (reply.emailed) {
            await clearSteelDraft();
            el.reset();
            status.textContent = "✓ " + (reply.stored ? val.stored : "Zapytanie zostało przyjęte do wysyłki e-mail. Numer:") + " " + reply.reference +
              " · PDF, CSV i JSON zostały przyjęte do wysyłki e-mail przez dostawcę." +
              (!reply.stored ? " (Baza danych jest niedostępna; kopie są w załącznikach e-mail.)" : "");
          } else if (reply.stored) {
            // Resend attachments failed. Recover with a browser-originated
            // FormSubmit notification and authenticated server-side project.
            // Never claim that FormSubmit transported the full files.
            try{
              const notified=await sendSteelFallbackNotice(body,reply.reference);
              if(notified){
                await clearSteelDraft();
                el.reset();
                status.textContent="✓ Projekt "+reply.reference+
                  " zapisano w B-CORE. Powiadomienie e-mail zostało przyjęte przez FormSubmit. "+
                  "PDF, CSV i JSON czekają w panelu administratora /admin (nie są załącznikami tego powiadomienia).";
              }
            }catch(fallbackError){
              status.textContent="Projekt "+reply.reference+" zapisano w bazie, ale żaden dostawca "+
                "nie potwierdził wysłania e-maila. "+steelMailAdvice(reply.emailErrorCode)+
                (fallbackError?.activation?" Aktywuj formularz odbiorcy w FormSubmit.":"");
              appendSteelDownload(status);
              const retry=document.createElement("button");
              retry.type="button";
              retry.className="bcore-form-native-retry";
              retry.textContent="Wyślij powiadomienie w nowej karcie";
              retry.addEventListener("click",()=>{
                const msg="Zapytanie SteelVision "+reply.reference+
                  "\nPelny projekt PDF CSV JSON w panelu administracyjnym B-CORE.\n\n"+
                  String(body.message||"").slice(0,5800);
                submitNativeInNewTab({...body,message:msg,
                  _subject:"[B-CORE] SteelVision "+reply.reference});
              });
              status.append(document.createTextNode(" "),retry);
            }
          } else {
            throw new Error("Neither email nor storage accepted the design");
          }
          return;
        }
        // Prefer our own same-origin API. FormSubmit is only a fallback when
        // server explicitly reports that no mail service is configured.
        let accepted=false;
        const response=await fetch("/api/send-email",{
          method:"POST",credentials:"same-origin",
          headers:{"Content-Type":"application/json","Accept":"application/json"},
          signal:AbortSignal.timeout(20000),
          body:JSON.stringify({
            name:body.name,email:body.email,phone:body.phone||"",
            category:body.category||"",message:body.message,
            subject:body.category||"Zapytanie B-CORE",
            website:body._honey||""
          })
        });
        const result=await response.json().catch(()=>({}));
        if(response.ok&&result.ok===true){
          accepted=true;
        }else if(response.status===503 &&
          ["email_not_configured","Email service is not configured"].includes(String(result.code||result.error||""))){
          // Browser-originated direct FormSubmit works only if the owner has
          // activated the recipient; never treat 200 + success:false as sent.
          const fallback=await fetch("https://formsubmit.co/ajax/"+mail,{
            method:"POST",mode:"cors",credentials:"omit",
            headers:{"Content-Type":"application/json","Accept":"application/json"},
            signal:AbortSignal.timeout(20000),
            body:JSON.stringify(body)
          });
          const resultFallback=await fallback.json().catch(()=>null);
          accepted=fallback.ok&&(resultFallback?.success===true||resultFallback?.success==="true");
          if(!accepted){
            const err=new Error("Fallback email provider rejected enquiry");
            err.activation=/activat|confirm/i.test(String(resultFallback?.message||""));
            throw err;
          }
        }
        if(!accepted){
          const err=new Error("Our email provider has not accepted the enquiry");
          err.code=result.code || "provider_rejected";
          throw err;
        }
        el.reset();
        status.textContent = val.sent;
      } catch (error) {
        if (steelEnquiry) {
          status.textContent = val.steelError + " " + steelMailAdvice(error?.code);
          appendSteelDownload(status);
          return;
        }
        const activation = Boolean(error?.activation);
        status.textContent = (activation ? val.activation : val.error) +
          " " + (!activation ? steelMailAdvice(error?.code) : "") + " ";
        // No data is lost on failure. Offer a native HTML POST in a separate
        // tab when the provider rejects AJAX or the browser blocks CORS.
        const retry = document.createElement("button");
        retry.type = "button";
        retry.textContent = val.browser;
        retry.className = "bcore-form-native-retry";
        retry.addEventListener("click", () => submitNativeInNewTab(body), {once:false});
        status.appendChild(retry);
      } finally {
        send.disabled = false;
        send.textContent = val.send;
      }
    });
  }
  function addLegalLinks() {
    const target = document.querySelector(".footer .copyright");
    if (!target || target.querySelector("a")) return;
    const wrap = document.createElement("span");
    wrap.className = "bcore-legal-links";
    const privacy = document.createElement("a");
    privacy.href = "/polityka-prywatnosci";
    privacy.textContent = "Privacy / Polityka prywatności";
    const terms = document.createElement("a");
    terms.href = "/regulamin";
    terms.textContent = "Terms / Regulamin";
    wrap.append(privacy, document.createTextNode(" · "), terms);
    target.appendChild(wrap);
  }
  function init() {
    const target = document.getElementById("app");
    if (!target) return;
    const observer = new MutationObserver(() => installContactForm());
    observer.observe(target, {childList:true});
    installContactForm();
    addLegalLinks();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
/* Minimal enhancements module; steel configurator is route-lazy. */
(function(){const script=document.createElement("script");script.src="/bcore-enhancements.js?v=2";script.defer=true;document.head.appendChild(script);})();
