import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let cachedDb: ReturnType<typeof drizzle> | null = null;
let lastConnectionString = "";

export function getDb() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    "";

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
