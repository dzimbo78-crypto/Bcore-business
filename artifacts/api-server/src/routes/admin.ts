import { Router } from "express";
import crypto from "crypto";
import { rateLimit } from "../rate-limit";

const router = Router();

const sessions = new Map<string, { createdAt: number }>();
const SESSION_TTL = 1000 * 60 * 60 * 8; // 8 hours

const cleanupSessions = setInterval(() => {
  for (const [token, session] of sessions)
    if (Date.now() - session.createdAt >= SESSION_TTL) sessions.delete(token);
}, 60_000);
cleanupSessions.unref();

export function isAdminSession(req: {
  cookies?: Record<string, string>;
}): boolean {
  const token = req.cookies?.["bcore_admin"];
  if (!token) return false;
  const session = sessions.get(token);
  if (!session) return false;
  if (Date.now() - session.createdAt > SESSION_TTL) {
    sessions.delete(token);
    return false;
  }
  return true;
}

router.post("/admin/login", rateLimit(8, 15 * 60 * 1000), (req, res) => {
  const { password } = req.body ?? {};
  const adminPassword = process.env["ADMIN_PASSWORD"];

  if (!adminPassword) {
    res.status(500).json({ error: "ADMIN_PASSWORD not configured" });
    return;
  }

  if (
    typeof password !== "string" ||
    password.length > 1024 ||
    !crypto.timingSafeEqual(
      crypto.createHash("sha256").update(password).digest(),
      crypto.createHash("sha256").update(adminPassword).digest(),
    )
  ) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  for (const [key, session] of sessions)
    if (Date.now() - session.createdAt > SESSION_TTL) sessions.delete(key);
  const oldToken = req.cookies?.["bcore_admin"];
  if (oldToken) sessions.delete(oldToken);
  const token = crypto.randomUUID();
  sessions.set(token, { createdAt: Date.now() });

  res.cookie("bcore_admin", token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL,
    path: "/",
  });

  res.json({ ok: true });
});

router.post("/admin/logout", (req, res) => {
  const token = req.cookies?.["bcore_admin"];
  if (token) sessions.delete(token);
  res.clearCookie("bcore_admin");
  res.json({ ok: true });
});

router.get("/admin/me", (req, res) => {
  res.json({ admin: isAdminSession(req) });
});

router.get("/admin/contact-status", (req, res) => {
  if (!isAdminSession(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json({
    recipient:
      process.env["CONTACT_TO_EMAIL"] || "przemyslaw.bugajski78@gmail.com",
    configured: Boolean(
      process.env["RESEND_API_KEY"] && process.env["RESEND_FROM_EMAIL"],
    ),
  });
});

export default router;
