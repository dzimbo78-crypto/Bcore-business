import path from "path";
import express from "express";
import app from "./app";
import { pool } from "@workspace/db";

const rawPort = process.env["PORT"] || "10000";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function ensureDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      image_base64 TEXT,
      location TEXT,
      min_order TEXT,
      price TEXT,
      currency TEXT DEFAULT 'EUR',
      category TEXT,
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

async function start() {
  await ensureDatabase();

  // Serve the built React application from the same Node service.
  // This keeps /api and the website on one domain and avoids CORS/deployment issues.
  const webRoot = path.resolve(process.cwd(), "artifacts/sales-platform/dist/public");
  app.use(express.static(webRoot));

  // SPA fallback for routes such as /produkty, /kontakt and /admin.
  app.get(/^(?!\/api(?:\/|$)).*/, (_req, res) => {
    res.sendFile(path.join(webRoot, "index.html"));
  });

  app.listen(port, "0.0.0.0", () => {
    console.log(`B-CORE listening on port ${port}`);
  });
}

start().catch((error) => {
  console.error("Startup failed:", error);
  process.exit(1);
});
