import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// Missing database configuration should not take the unrelated email service
// offline. Database operations fail clearly with a short connection timeout.
const connectionString = process.env.DATABASE_URL ||
  "postgresql://bcore-disabled:bcore-disabled@127.0.0.1:5432/bcore-unconfigured";
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is absent: database actions will be unavailable");
}
export const pool = new Pool({ connectionString, connectionTimeoutMillis: 4000 });
export const db = drizzle(pool, { schema });

export * from "./schema";
