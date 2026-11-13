import { NextRequest, NextResponse } from "next/server";
import { upstashService } from "@/lib/integrations/upstash";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const identifier = searchParams.get("id") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "client-test";

  const rateLimit = await upstashService.checkRateLimit(identifier, 10, 60);

  return NextResponse.json({
    success: true,
    data: {
      health: upstashService.getHealth(),
      rateLimitTest: rateLimit,
    },
  });
}
