/* B-CORE | tiny accessibility, mobile and UI fixes. No animation libraries. */
(() => {
  "use strict";
  const arrowTargets = ".button, .card-more, .arrowlink, .scene-footer a";
  let observer, pending = false, simulatorLoaded = false;

  function refineArrows() {
    const root = document.getElementById("app");
    if (!root) return;
    root.querySelectorAll(arrowTargets).forEach(element => {
      // On iOS the old unicode arrow is rendered as a blue emoji. Remove it,
      // keep the full clickable area and text for accessibility.
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeValue && node.nodeValue.includes("↗")) {
          node.nodeValue = node.nodeValue.replace(/\s*↗\uFE0F?/g, "");
        }
      }
    });
    document.querySelectorAll(".header .button > span[aria-hidden='true']").forEach(span => {
      if (span.textContent.includes("↗")) span.textContent = "";
    });
  }

  function closeBrightness() {
    const pop = document.getElementById("bcBrightPop");
    const btn = document.getElementById("bcBrightBtn");
    if (pop && !pop.hidden) {
      pop.hidden = true;
      if (btn) btn.setAttribute("aria-expanded", "false");
    }
  }

  function setupBrightness() {
    document.addEventListener("pointerdown", event => {
      const pop = document.getElementById("bcBrightPop");
      const button = document.getElementById("bcBrightBtn");
      if (!pop || pop.hidden) return;
      const target = event.target;
      if (pop.contains(target) || (button && button.contains(target))) return;
      closeBrightness();
    }, true);
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeBrightness();
    });
    window.addEventListener("hashchange", closeBrightness);
  }

  function loadSimulator() {
    if (simulatorLoaded || !location.hash.startsWith("#/konstrukcje-stalowe")) return;
    simulatorLoaded = true;
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "/bcore-configurator.css?v=2";
    document.head.appendChild(stylesheet);
    const script = document.createElement("script");
    script.src = "/bcore-configurator.js?v=2";
    script.async = true;
    script.onerror = () => { simulatorLoaded = false; };
    document.head.appendChild(script);
  }

  function enhance() {
    pending = false;
    refineArrows();
    loadSimulator();
    // Refill the enquiry only after the production contact form has been mounted.
    const saved = sessionStorage.getItem("bcore-config-enquiry");
    if (saved && location.hash.startsWith("#/kontakt")) {
      const form = document.getElementById("bcore-contact-form");
      const message = form?.querySelector("textarea[name='message']");
      if (!message) return;
      const category = form.querySelector("input[name='category']");
      if (category) category.value = "Konstrukcje stalowe / Steel structures";
      message.value = saved + (message.value ? "\n\n" + message.value : "");
      sessionStorage.removeItem("bcore-config-enquiry");
      const label = document.createElement("p");
      label.className = "bcore-config-imported";
      label.textContent = "✓ " + ({pl:"Konfiguracja została dodana do zapytania.",en:"Configuration added to your enquiry.",da:"Konfigurationen er tilføjet din forespørgsel.",de:"Konfiguration zur Anfrage hinzugefügt."}[document.getElementById("bcLang")?.value] || "Configuration added.");
      form.prepend(label);
      form.scrollIntoView({behavior:"smooth",block:"center"});
    }
  }

  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(enhance);
  }

  function init() {
    setupBrightness();
    schedule();
    const app = document.getElementById("app");
    if (app) {
      observer = new MutationObserver(schedule);
      // No subtree monitoring: one lightweight callback per page replacement,
      // rather than a callback for every frame of the cinematic animations.
      observer.observe(app, {childList:true});
    }
    window.addEventListener("hashchange", schedule);
    document.getElementById("bcLang")?.addEventListener("change", schedule);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
  else init();
})();