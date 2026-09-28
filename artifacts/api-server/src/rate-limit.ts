import type { RequestHandler } from "express";

/** Single-instance fixed-window limit; no contact contents or credentials retained. */
export function rateLimit(limit: number, windowMs: number): RequestHandler {
  const buckets = new Map<string, { count: number; expires: number }>();
  // Remove expired IP counters even when traffic is low. Never keep enquiry content.
  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets)
      if (bucket.expires <= now) buckets.delete(key);
  }, 60_000);
  cleanup.unref();
  return (req, res, next) => {
    const now = Date.now(),
      key = req.ip || req.socket?.remoteAddress || "unknown";
    if (buckets.size > 1000)
      for (const [ip, bucket] of buckets)
        if (bucket.expires <= now) buckets.delete(ip);
    let bucket = buckets.get(key);
    if (!bucket || bucket.expires <= now) {
      if (buckets.size >= 10000) {
        res.status(429).json({ error: "Please try again later" });
        return;
      }
      bucket = { count: 0, expires: now + windowMs };
      buckets.set(key, bucket);
    }
    if (++bucket.count > limit) {
      res.setHeader("Retry-After", Math.ceil((bucket.expires - now) / 1000));
      res
        .status(429)
        .json({ error: "Too many requests. Please try again later." });
      return;
    }
    next();
  };
}
