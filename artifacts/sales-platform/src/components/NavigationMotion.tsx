import {
  useCallback,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Router } from "wouter";
import type { AroundNavHandler } from "wouter";
import { useMotionPreferences } from "./MotionPreferences";
import { previewRouter } from "@/lib/preview";
import { anchorId, resolveNavigation } from "@/lib/navigation";

let navigationKind: "initial" | "push" | "history" = "initial";
const getAddress = () =>
  previewRouter?.getAddress() ??
  window.location.pathname + window.location.search + window.location.hash;

function subscribeAddress(listener: () => void) {
  const historyChange = () => {
    navigationKind = "history";
    listener();
  };
  const events = ["pushState", "replaceState", "hashchange"];
  window.addEventListener("popstate", historyChange, true);
  events.forEach((event) => window.addEventListener(event, listener));
  return () => {
    window.removeEventListener("popstate", historyChange, true);
    events.forEach((event) => window.removeEventListener(event, listener));
  };
}
const useBrowserAddress = () =>
  useSyncExternalStore(subscribeAddress, getAddress);
const useAddress = previewRouter?.useAddress ?? useBrowserAddress;

function scrollToAnchor(hash: string, smooth: boolean) {
  const target = document.getElementById(anchorId(hash));
  if (!target) return false;
  target.scrollIntoView({
    behavior: smooth ? "smooth" : "instant",
    block: "start",
  });
  if (target.id === "main-content") target.focus({ preventScroll: true });
  return true;
}

/** No timers or exit queues: rapid clicks always open the latest destination. */
export function NavigationRouter({ children }: { children: ReactNode }) {
  const { paused } = useMotionPreferences();
  const aroundNav = useCallback<AroundNavHandler>(
    (navigate, to, options) => {
      const current = getAddress();
      const target = resolveNavigation(to, current);
      if (target.address === current) {
        if (target.hash) scrollToAnchor(target.hash, !paused);
        else
          window.scrollTo({ top: 0, behavior: paused ? "instant" : "smooth" });
        return;
      }
      navigationKind = "push";
      navigate(target.address, options);
    },
    [paused],
  );
  return (
    <Router
      hook={previewRouter?.hook}
      searchHook={previewRouter?.searchHook}
      base={import.meta.env.BASE_URL.replace(/\/$/, "")}
      aroundNav={aroundNav}
    >
      <NavigationScroll />
      {children}
    </Router>
  );
}

function NavigationScroll() {
  const address = useAddress();
  const previous = useRef<string | null>(null);
  const { paused } = useMotionPreferences();
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  useLayoutEffect(() => {
    const before = previous.current;
    previous.current = address;
    const current = resolveNavigation(address, address);
    const changedPage =
      before !== null &&
      resolveNavigation(before, before).pathname !== current.pathname;

    // Back / Forward retain the browser's native scroll restoration.
    if (navigationKind !== "history") {
      if (current.hash) {
        scrollToAnchor(
          current.hash,
          before !== null && !changedPage && !pausedRef.current,
        );
      } else if (changedPage) {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    }
    if (changedPage && navigationKind === "push") {
      document.getElementById("main-content")?.focus({ preventScroll: true });
    }
  }, [address]);
  return null;
}
