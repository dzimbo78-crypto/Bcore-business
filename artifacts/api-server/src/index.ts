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
  // Repeat submission of a quotation must not create duplicate database records.
  await pool.query("ALTER TABLE steel_enquiries ADD COLUMN IF NOT EXISTS quote_id TEXT");
  await pool.query("CREATE UNIQUE INDEX IF NOT EXISTS steel_enquiries_quote_id_uidx ON steel_enquiries (quote_id) WHERE quote_id IS NOT NULL");
  await pool.query("ALTER TABLE steel_enquiries ADD COLUMN IF NOT EXISTS email_accepted_at TIMESTAMPTZ");
  await pool.query("ALTER TABLE steel_enquiries ADD COLUMN IF NOT EXISTS email_provider_id TEXT");
  await pool.query("ALTER TABLE steel_enquiries ADD COLUMN IF NOT EXISTS fallback_accepted_at TIMESTAMPTZ");
}

/**
 * Render must see an open HTTP port *before* database migrations begin.
 * A missing/slow/offline PostgreSQL must not block the public website,
 * /api/healthz or the independent email service.
 */
function start() {
  const webRoot = path.resolve(process.cwd(), "artifacts/sales-platform/dist/public");
  app.get("/", (_req, res) => res.sendFile(path.join(webRoot, "bcore-cinematic.html")));
  app.get(
    /^\/(?:doradztwo-biznesowe|nieruchomosci|rozwiazania-dla-biznesu|konstrukcje-stalowe|o-nas|kontakt)\/?$/,
    (req, res) => res.redirect(302, "/#" + req.path.replace(/\/$/, "")),
  );
  app.use(express.static(webRoot));
  app.get(/^(?!\/api(?:\/|$)).*/, (_req, res) => {
    res.sendFile(path.join(webRoot, "index.html"));
  });

  const server = app.listen(port, "0.0.0.0", () => {
    console.log("B-CORE listening on 0.0.0.0:" + port);
  });
  server.on("error", err => {
    console.error("B-CORE HTTP bind failed:", err);
    process.exitCode = 1;
  });

  let migrating = false;
  const migrate = async (): Promise<boolean> => {
    if (migrating) return false;
    migrating = true;
    try {
      await ensureDatabase();
      console.log("B-CORE database tables ready");
      return true;
    } catch (err) {
      console.error("B-CORE database not ready, will retry:", err instanceof Error ? err.name : "UnknownError");
      return false;
    } finally {
      migrating = false;
    }
  };
  // Never block HTTP startup on database connectivity.
  void migrate().then(ready => {
    if (ready) return;
    const timer = setInterval(() => {
      void migrate().then(ok => { if (ok) clearInterval(timer); });
    }, 60_000);
    timer.unref();
  });
}

start();
