import { NextResponse } from "next/server";
import { checkAllNeonServices } from "@/lib/neon";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const startTime = Date.now();
  const requestId = req.headers.get("x-request-id") || crypto.randomUUID();

  // Run comprehensive health check for all provisioned Neon services
  const neonHealth = await checkAllNeonServices();
  const memory = process.memoryUsage();
  const isHealthy = neonHealth.status === "healthy";

  const responseBody = {
    status: isHealthy ? "healthy" : "degraded",
    requestId,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    latencyMs: Date.now() - startTime,
    neon: {
      branch: neonHealth.branch,
      services: neonHealth.services,
    },
    memory: {
      rssMb: Math.round(memory.rss / 1024 / 1024),
      heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
      heapTotalMb: Math.round(memory.heapTotal / 1024 / 1024),
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
