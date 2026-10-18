import { Router } from "express";
import { pool } from "@workspace/db";
import { rateLimit } from "../rate-limit";
import { isAdminSession } from "./admin";

const router = Router();
const MAX_DESIGN_BYTES = 3_000_000;

// Browser renders all steel geometry; backend stores only the final enquiry.
router.post("/steel-enquiries", rateLimit(6, 15 * 60 * 1000), async (req, res) => {
  const { name, email, phone, category, message, design, website } = req.body ?? {};
  const trimmed = (v: unknown) => typeof v === "string" ? v.trim() : "";
  const contactName = trimmed(name);
  const contactEmail = trimmed(email);
  const contactPhone = trimmed(phone);
  const requestMessage = trimmed(message);
  const requestCategory = trimmed(category) || "Konstrukcje stalowe";
  if (
    website ||
    contactName.length < 2 || contactName.length > 120 ||
    contactEmail.length < 4 || contactEmail.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) ||
    contactPhone.length > 200 ||
    requestCategory.length > 200 ||
    requestMessage.length < 10 || requestMessage.length > 30_000 ||
    !design || typeof design !== "object" || Array.isArray(design) ||
    !Array.isArray(design.state?.items) ||
    design.state.items.length < 1 || design.state.items.length > 60
  ) {
    res.status(400).json({ error: "Invalid steel enquiry" });
    return;
  }
  let payload: string;
  try { payload = JSON.stringify(design); }
  catch { res.status(400).json({ error: "Invalid design JSON" }); return; }
  if (!payload || Buffer.byteLength(payload, "utf8") > MAX_DESIGN_BYTES) {
    res.status(413).json({ error: "Steel design is too large" });
    return;
  }
  try {
    const result = await pool.query<{ id: number }>(
      "INSERT INTO steel_enquiries (contact_name, contact_email, contact_phone, category, summary, design) VALUES ($1,$2,$3,$4,$5,$6::jsonb) RETURNING id",
      [contactName, contactEmail, contactPhone, requestCategory, requestMessage, payload],
    );
    const id = result.rows[0]?.id;
    if (typeof id !== "number") throw new Error("Missing enquiry ID");
    const reference = "BCS-" + String(id).padStart(6, "0");
    console.log("B-CORE steel quote request stored:", reference);
    res.status(201).json({ ok: true, stored: true, reference });
  } catch {
    console.error("B-CORE steel enquiry database save failed");
    res.status(503).json({ error: "Unable to store enquiry", code: "storage_unavailable" });
  }
});

// Enquiries are accessible to authenticated B-CORE administrators only.
router.get("/admin/steel-enquiries", async (req, res) => {
  if (!isAdminSession(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 40));
  try {
    const { rows } = await pool.query(
      "SELECT id, contact_name, contact_email, contact_phone, category, summary, created_at FROM steel_enquiries ORDER BY created_at DESC LIMIT $1",
      [limit],
    );
    res.json({ ok: true, requests: rows.map((x) => ({
      ...x, reference: "BCS-" + String(x.id).padStart(6, "0"),
    })) });
  } catch {
    res.status(503).json({ error: "Unable to retrieve enquiries" });
  }
});

router.get("/admin/steel-enquiries/:id", async (req, res) => {
  if (!isAdminSession(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    res.status(400).json({ error: "Invalid reference" }); return;
  }
  try {
    const { rows } = await pool.query("SELECT * FROM steel_enquiries WHERE id=$1 LIMIT 1", [id]);
    if (!rows.length) { res.status(404).json({ error: "Enquiry not found" }); return; }
    res.json({ ok: true, enquiry: rows[0] });
  } catch {
    res.status(503).json({ error: "Unable to retrieve enquiry" });
  }
});

export default router;
