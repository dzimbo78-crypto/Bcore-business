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
  await pool.query(
    "CREATE TABLE IF NOT EXISTS steel_enquiries (" +
    "id BIGSERIAL PRIMARY KEY, " +
    "contact_name TEXT NOT NULL, contact_email TEXT NOT NULL, " +
    "contact_phone TEXT, category TEXT, summary TEXT NOT NULL, " +
    "design JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW())",
  );
}

async function start() {
  await ensureDatabase();

  // Serve the built React application from the same Node service.
  // This keeps /api and the website on one domain and avoids CORS/deployment issues.
  const webRoot = path.resolve(process.cwd(), "artifacts/sales-platform/dist/public");
  // The approved final PL/EN/DA/DE cinematic interface is the public B-CORE website.
  // Admin and legal routes remain served by the existing React app; API stays unchanged.
  app.get("/", (_req, res) => {
    res.sendFile(path.join(webRoot, "bcore-cinematic.html"));
  });
  app.get(
    /^\/(?:doradztwo-biznesowe|nieruchomosci|rozwiazania-dla-biznesu|konstrukcje-stalowe|o-nas|kontakt)\/?$/,
    (req, res) => {
      res.redirect(302, "/#" + req.path.replace(/\/$/, ""));
    },
  );

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
