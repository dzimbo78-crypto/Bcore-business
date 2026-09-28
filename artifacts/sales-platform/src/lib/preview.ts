import { useSyncExternalStore } from "react";
import { memoryLocation } from "wouter/memory-location";
export const isStandalonePreview =
  import.meta.env.VITE_STANDALONE_PREVIEW === "true";
function createPreviewRouter() {
  const memory = memoryLocation();
  let address = "/";
  const listeners = new Set<() => void>();
  const navigate = (to: string, options?: { replace?: boolean }) => {
    const url = new URL(to, `https://bcore.local${address}`);
    address = url.pathname + url.search + url.hash;
    // Hashes belong to scroll targets, never to Wouter's route pathname.
    memory.navigate(url.pathname + url.search, options);
    listeners.forEach((listener) => listener());
  };
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };
  const getAddress = () => address;
  return {
    hook: (): [string, typeof navigate] => [memory.hook()[0], navigate],
    searchHook: memory.searchHook,
    useAddress: () => useSyncExternalStore(subscribe, getAddress),
    getAddress,
  };
}
export const previewRouter = isStandalonePreview
  ? createPreviewRouter()
  : undefined;
