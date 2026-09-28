/** Resolve anchors/queries without dropping the current route or base path. */
export function resolveNavigation(to: string, current: string) {
  const url = new URL(to, `https://bcore.local${current}`);
  return {
    address: url.pathname + url.search + url.hash,
    pathname: url.pathname,
    hash: url.hash,
  };
}

export function anchorId(hash: string) {
  try {
    return decodeURIComponent(hash.replace(/^#/, ""));
  } catch {
    return hash.replace(/^#/, "");
  }
}
