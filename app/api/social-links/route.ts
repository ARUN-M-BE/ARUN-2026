import { NextRequest, NextResponse } from "next/server";
import { getSocialLinks, getPublicSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink, reorderSocialLinks } from "@/lib/actions";
import { requireAdmin } from "@/server/middleware/auth-guard";
import { socialLinkSchema } from "@/lib/validations";

export async function GET(request?: NextRequest) {
  try {
    const { searchParams } = new URL(request?.url || "http://localhost:3000/api/social-links");
    const placement = searchParams.get("placement") || undefined;
    const links = placement ? await getPublicSocialLinks(placement) : await getSocialLinks();
    return NextResponse.json({ success: true, data: links });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch social links" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = socialLinkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    const res = await createSocialLink(parsed.data);
    return NextResponse.json(res, { status: res.success ? 201 : 400 });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unauthorized or failed to create social link" },
      { status: 401 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    if (Array.isArray(body.orderedIds)) {
      const res = await reorderSocialLinks(body.orderedIds);
      return NextResponse.json(res);
    }

    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "Social link ID is required" }, { status: 400 });
    }

    const res = await updateSocialLink(id, data);
    return NextResponse.json(res);
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unauthorized or failed to update social link" },
      { status: 401 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Social link ID is required" }, { status: 400 });
    }

    const res = await deleteSocialLink(id);
    return NextResponse.json(res);
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unauthorized or failed to delete social link" },
      { status: 401 }
    );
  }
}
