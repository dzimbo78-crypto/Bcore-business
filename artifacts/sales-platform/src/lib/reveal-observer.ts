// One event-driven observer for all sections. No scroll listener, polling or RAF.
let observer: IntersectionObserver | null = null;
const targets = new Set<HTMLElement>();

function release(node: HTMLElement) {
  observer?.unobserve(node);
  targets.delete(node);
  if (targets.size === 0) {
    observer?.disconnect();
    observer = null;
  }
}

export function observeReveal(node: HTMLElement) {
  if (!("IntersectionObserver" in window)) {
    node.dataset.reveal = "visible";
    return;
  }
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          target.dataset.reveal = "visible";
          release(target);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -24px 0px" },
    );
  }
  targets.add(node);
  observer.observe(node);
  return () => release(node);
}
