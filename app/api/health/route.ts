import { NextResponse } from "next/server";
import { db } from "@/server/config/database";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const startTime = Date.now();
  const requestId = req.headers.get("x-request-id") || crypto.randomUUID();

  let dbStatus = "unreachable";
  let dbLatencyMs = 0;

  try {
    const dbStart = Date.now();
    await db.execute(sql`SELECT 1`);
    dbLatencyMs = Date.now() - dbStart;
    dbStatus = "connected";
  } catch (error: any) {
    dbStatus = `error: ${error?.message || "connection failed"}`;
  }

  const memory = process.memoryUsage();
  const isHealthy = dbStatus === "connected";

  const responseBody = {
    status: isHealthy ? "healthy" : "degraded",
    requestId,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    latencyMs: Date.now() - startTime,
    checks: {
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
      },
      memory: {
        rssMb: Math.round(memory.rss / 1024 / 1024),
        heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(memory.heapTotal / 1024 / 1024),
      },
    },
    version: "1.0.0",
  };

  return NextResponse.json(responseBody, {
    status: isHealthy ? 200 : 503,
    headers: {
      "x-request-id": requestId,
      "cache-control": "no-store, max-age=0",
    },
  });
}

