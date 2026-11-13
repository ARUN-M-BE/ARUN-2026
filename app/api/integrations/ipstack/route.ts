import { NextRequest, NextResponse } from "next/server";
import { geoService } from "@/lib/integrations/ipstack";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ipParam = searchParams.get("ip");

  const clientIp = ipParam ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const location = await geoService.lookup(clientIp);

  return NextResponse.json({
    success: true,
    data: {
      health: geoService.getHealth(),
      location,
    },
  });
}
