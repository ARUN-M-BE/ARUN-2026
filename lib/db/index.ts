import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let cachedDb: ReturnType<typeof drizzle> | null = null;
let lastConnectionString = "";

export function getDb() {
  const connectionString =
    process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not configured. Set it in .env.local for local dev, or via `wrangler secret put DATABASE_URL` for production."
    );
  }

  if (!cachedDb || lastConnectionString !== connectionString) {
    const sql = neon(connectionString);
    cachedDb = drizzle(sql, { schema });
    lastConnectionString = connectionString;
  }
  return cachedDb;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    const activeDb = getDb();
    const val = (activeDb as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === "function" ? val.bind(activeDb) : val;
  },
});

export type Database = typeof db;
