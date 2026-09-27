import { Router } from "express";
import { db, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { isAdminSession } from "./admin";
import { parseProduct, parseProductId } from "../lib/product-input";

const router = Router();

router.get("/products", async (_req, res) => {
  try {
    const products = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.active, true))
      .orderBy(productsTable.createdAt);
    res.json(products.reverse());
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB error" });
  }
});

router.get("/products/all", async (req, res) => {
  if (!isAdminSession(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const products = await db
      .select()
      .from(productsTable)
      .orderBy(productsTable.createdAt);
    res.json(products.reverse());
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB error" });
  }
});

router.post("/products", async (req, res) => {
  if (!isAdminSession(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  let data;
  try {
    data = parseProduct(req.body);
  } catch {
    res.status(400).json({ error: "Invalid offer" });
    return;
  }
  try {
    const [product] = await db.insert(productsTable).values(data).returning();
    if (!product) {
      res.status(404).json({ error: "Offer not found" });
      return;
    }
    res.json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB error" });
  }
});

router.put("/products/:id", async (req, res) => {
  if (!isAdminSession(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  let id, data;
  try {
    id = parseProductId(req.params.id);
    data = parseProduct(req.body);
  } catch {
    res.status(400).json({ error: "Invalid offer" });
    return;
  }
  try {
    const [product] = await db
      .update(productsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(productsTable.id, id))
      .returning();
    if (!product) {
      res.status(404).json({ error: "Offer not found" });
      return;
    }
    res.json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB error" });
  }
});

router.delete("/products/:id", async (req, res) => {
  if (!isAdminSession(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  let id;
  try {
    id = parseProductId(req.params.id);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  try {
    const deleted = await db
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning({ id: productsTable.id });
    if (!deleted.length) {
      res.status(404).json({ error: "Offer not found" });
      return;
    }
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
