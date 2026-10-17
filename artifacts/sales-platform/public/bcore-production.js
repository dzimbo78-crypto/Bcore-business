(function () {
  "use strict";
  // This file integrates the approved B-CORE cinematic experience with the production API.
  const mail = "przemyslaw.bugajski78@gmail.com";
  const words = {
    pl: {name:"Imię i nazwisko",email:"Adres e-mail",phone:"Telefon (opcjonalnie)",topic:"Temat",msg:"Opisz swój projekt",send:"Wyślij zapytanie",sending:"Wysyłanie…",sent:"Formularz przyjął zapytanie. Dziękujemy!",error:"Wysyłka online jest chwilowo niedostępna. Napisz bezpośrednio:",privacy:"Wysyłając formularz, zgadzasz się na kontakt w sprawie zapytania.",hint:"Pola oznaczone * są wymagane.",activation:"FormSubmit wysłał prośbę o aktywację na skrzynkę odbiorcy. Wiadomość nie jest jeszcze dostarczona. Sprawdź Gmail i Spam.",alt:"Napisz e-mail",browser:"Wyślij formularz w nowej karcie"},
    en: {name:"Full name",email:"Email address",phone:"Phone (optional)",topic:"Subject",msg:"Describe your project",send:"Send enquiry",sending:"Sending…",sent:"The form accepted your enquiry. Thank you!",error:"Online messaging is temporarily unavailable. Email us directly:",privacy:"By submitting, you agree to be contacted about your enquiry.",hint:"Fields marked * are required.",activation:"FormSubmit has requested recipient activation. Delivery is not confirmed yet; please check the receiving inbox and spam.",alt:"Send an email",browser:"Submit form in a new tab"},
    da: {name:"Fulde navn",email:"E-mailadresse",phone:"Telefon (valgfrit)",topic:"Emne",msg:"Beskriv dit projekt",send:"Send forespørgsel",sending:"Sender…",sent:"Formularen har modtaget din forespørgsel. Tak!",error:"Online beskeder er midlertidigt utilgængelige. Skriv direkte til:",privacy:"Når du sender formularen, accepterer du kontakt om din henvendelse.",hint:"Felter med * skal udfyldes.",activation:"FormSubmit kræver aktivering af modtageradressen. Kontroller indbakke og spam. Levering er ikke bekræftet.",alt:"Send en e-mail",browser:"Send formular i ny fane"},
    de: {name:"Vor- und Nachname",email:"E-Mail-Adresse",phone:"Telefon (optional)",topic:"Betreff",msg:"Beschreiben Sie Ihr Projekt",send:"Anfrage senden",sending:"Wird gesendet…",sent:"Das Formular hat Ihre Anfrage angenommen. Vielen Dank!",error:"Online-Nachrichten sind vorübergehend nicht verfügbar. Schreiben Sie direkt an:",privacy:"Mit dem Absenden stimmen Sie einer Kontaktaufnahme zu Ihrer Anfrage zu.",hint:"Mit * gekennzeichnete Felder sind Pflichtfelder.",activation:"FormSubmit erfordert die Aktivierung der Empfängeradresse. Bitte Posteingang und Spam prüfen.",alt:"E-Mail schreiben",browser:"Formular in neuem Tab senden"}
  };
  const lang = () => words[document.getElementById("bcLang")?.value] ? document.getElementById("bcLang").value : "pl";
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
      try {
        const response = await fetch("https://formsubmit.co/ajax/" + mail, {
          method: "POST",
          mode: "cors",
          credentials: "omit",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(body)
        });
        const result = await response.json().catch(() => null);
        if (!response.ok || !result || (result.success !== "true" && result.success !== true)) {
          const err = new Error("Provider did not accept the enquiry");
          err.activation = /activat|confirm/i.test(String(result?.message || ""));
          err.reason = String(result?.message || "").slice(0, 240);
          throw err;
        }
        el.reset();
        status.textContent = val.sent;
      } catch (error) {
        const activation = Boolean(error?.activation);
        status.textContent = (activation ? val.activation : val.error) + " ";
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
