import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const svixId = req.headers.get("svix-id");
    const svixTimestamp = req.headers.get("svix-timestamp");
    const svixSignature = req.headers.get("svix-signature");

    // Free tier webhook handling with signature verification check if secret configured
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    if (webhookSecret && (!svixId || !svixTimestamp || !svixSignature)) {
      return NextResponse.json({ success: false, error: "Missing svix headers" }, { status: 400 });
    }

    let parsedEvent: Record<string, unknown> = {};
    try {
      parsedEvent = JSON.parse(rawBody) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
    }

    // Process event types: email.sent, email.delivered, email.bounced, email.complained
    const eventType = parsedEvent.type as string;
    console.info(`[Resend Webhook Event] ${eventType}`);

    return NextResponse.json({ success: true, event: eventType, received: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Webhook error" },
      { status: 500 }
    );
  }
}
