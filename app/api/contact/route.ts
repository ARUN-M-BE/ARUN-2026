import { NextRequest, NextResponse } from "next/server";
import { MessageController } from "@/server/controllers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown;
    const result = await MessageController.submitContactForm(body);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to process contact message",
      },
      { status: 500 }
    );
  }
}
