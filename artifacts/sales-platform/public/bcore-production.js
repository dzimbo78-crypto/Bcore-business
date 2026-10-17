(function () {
  "use strict";
  // This file integrates the approved B-CORE cinematic experience with the production API.
  const mail = "przemyslaw.bugajski78@gmail.com";
  const words = {
    pl: {name:"Imię i nazwisko",email:"Adres e-mail",phone:"Telefon (opcjonalnie)",topic:"Temat",msg:"Opisz swój projekt",send:"Wyślij zapytanie",sending:"Wysyłanie…",sent:"Wiadomość została wysłana. Dziękujemy!",error:"Wysyłka online jest chwilowo niedostępna. Napisz bezpośrednio:",privacy:"Wysyłając formularz, zgadzasz się na kontakt w sprawie zapytania.",hint:"Pola oznaczone * są wymagane.",alt:"Napisz e-mail"},
    en: {name:"Full name",email:"Email address",phone:"Phone (optional)",topic:"Subject",msg:"Describe your project",send:"Send enquiry",sending:"Sending…",sent:"Your message has been sent. Thank you!",error:"Online messaging is temporarily unavailable. Email us directly:",privacy:"By submitting, you agree to be contacted about your enquiry.",hint:"Fields marked * are required.",alt:"Send an email"},
    da: {name:"Fulde navn",email:"E-mailadresse",phone:"Telefon (valgfrit)",topic:"Emne",msg:"Beskriv dit projekt",send:"Send forespørgsel",sending:"Sender…",sent:"Din besked er sendt. Tak!",error:"Online beskeder er midlertidigt utilgængelige. Skriv direkte til:",privacy:"Når du sender formularen, accepterer du kontakt om din henvendelse.",hint:"Felter med * skal udfyldes.",alt:"Send en e-mail"},
    de: {name:"Vor- und Nachname",email:"E-Mail-Adresse",phone:"Telefon (optional)",topic:"Betreff",msg:"Beschreiben Sie Ihr Projekt",send:"Anfrage senden",sending:"Wird gesendet…",sent:"Ihre Nachricht wurde gesendet. Vielen Dank!",error:"Online-Nachrichten sind vorübergehend nicht verfügbar. Schreiben Sie direkt an:",privacy:"Mit dem Absenden stimmen Sie einer Kontaktaufnahme zu Ihrer Anfrage zu.",hint:"Mit * gekennzeichnete Felder sind Pflichtfelder.",alt:"E-Mail schreiben"}
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
    el.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!el.reportValidity()) return;
      const status = el.querySelector(".bcore-form-message");
      const send = el.querySelector('button[type="submit"]');
      const val = words[lang()];
      const body = Object.fromEntries(new FormData(el).entries());
      body.subject = body.category || "B-CORE enquiry";
      send.disabled = true;
      send.textContent = val.sending;
      status.textContent = "";
      try {
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(body)
        });
        if (!response.ok) throw new Error("mail delivery unavailable");
        el.reset();
        status.textContent = val.sent;
      } catch (_) {
        status.textContent = val.error + " ";
        const a = document.createElement("a");
        a.href = "mailto:" + mail;
        a.textContent = mail;
        status.appendChild(a);
      } finally {
        send.disabled = false;
        send.textContent = val.send + " ↗";
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
