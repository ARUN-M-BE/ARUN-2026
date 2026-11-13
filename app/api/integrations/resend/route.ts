import { NextRequest, NextResponse } from "next/server";
import { resendService } from "@/lib/integrations/resend";
import { z } from "zod";

const sendSchema = z.object({
  action: z.enum(["send_email", "list_audiences", "add_contact", "status"]),
  to: z.string().email().optional(),
  subject: z.string().min(1).optional(),
  html: z.string().min(1).optional(),
  audienceId: z.string().optional(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export async function GET() {
  const health = resendService.getHealth();
  const audiences = await resendService.listAudiences();
  return NextResponse.json({
    success: true,
    data: {
      health,
      audiences: audiences.data,
      mode: audiences.mode,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown;
    const parsed = sendSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Invalid payload" },
        { status: 400 }
      );
    }

    const { action, to, subject, html, audienceId, email, firstName, lastName } = parsed.data;

    if (action === "status") {
      return NextResponse.json({ success: true, data: resendService.getHealth() });
    }

    if (action === "list_audiences") {
      const res = await resendService.listAudiences();
      return NextResponse.json(res);
    }

    if (action === "send_email") {
      if (!to || !subject || !html) {
        return NextResponse.json({ success: false, error: "Missing required fields (to, subject, html)" }, { status: 400 });
      }
      const res = await resendService.sendEmail({ to, subject, html });
      return NextResponse.json(res);
    }

    if (action === "add_contact") {
      if (!audienceId || !email) {
        return NextResponse.json({ success: false, error: "Missing audienceId or email" }, { status: 400 });
      }
      const res = await resendService.addContact(audienceId, { email, firstName, lastName });
      return NextResponse.json(res);
    }

    return NextResponse.json({ success: false, error: "Unsupported action" }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
