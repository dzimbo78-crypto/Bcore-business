import { memoryLocation } from "wouter/memory-location";
export const isStandalonePreview =
  import.meta.env.VITE_STANDALONE_PREVIEW === "true";
export const previewRouter = isStandalonePreview ? memoryLocation() : undefined;
export function installPreviewNavigation() {
  if (!previewRouter) return;
  document.addEventListener(
    "click",
    (e) => {
      const link = (e.target as Element)?.closest("a");
      if (
        !link ||
        e.defaultPrevented ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("/") && !href.startsWith("#")) return;
      e.preventDefault();
        const [route, anchor] = href.split("#");
      if (route) previewRouter.navigate(route);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (anchor)
            document
              .getElementById(anchor)
              ?.scrollIntoView({ behavior: "auto" });
          else window.scrollTo({ top: 0, behavior: "instant" });
        }),
      );
    },
    true,
  );
}
