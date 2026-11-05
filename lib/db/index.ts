import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const FALLBACK_NEON_URL =
  "postgresql://neondb_owner:npg_9qjlOrcT4ImV@ep-wispy-pond-a1oope80-pooler.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";

let cachedDb: ReturnType<typeof drizzle> | null = null;
let lastConnectionString = "";

export function getDb() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    FALLBACK_NEON_URL;

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
    const val = (activeDb as any)[prop];
    return typeof val === "function" ? val.bind(activeDb) : val;
  },
});

export type Database = typeof db;
