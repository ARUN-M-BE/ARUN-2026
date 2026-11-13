import { NextResponse } from "next/server";
import { monkeytypeService } from "@/lib/integrations/monkeytype";

export async function GET() {
  const health = monkeytypeService.getHealth();
  const stats = await monkeytypeService.getStats();

  return NextResponse.json({
    success: true,
    data: {
      health,
      stats: stats.data,
      mode: stats.mode,
    },
  });
}
