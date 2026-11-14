import { NextRequest, NextResponse } from "next/server";
import { SectionRepository } from "@/server/repositories";
import { requireAdmin } from "@/server/middleware/auth-guard";
import { sectionSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get("published") === "true";
    const sections = publishedOnly ? await SectionRepository.findPublished() : await SectionRepository.findMany();
    return NextResponse.json({ success: true, data: sections });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch sections" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = sectionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    const sec = await SectionRepository.create(parsed.data);
    revalidatePath("/");
    revalidatePath("/admin/sections");
    return NextResponse.json({ success: true, data: sec }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unauthorized or failed to create section" },
      { status: 401 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const body = (await request.json()) as Record<string, unknown>;

    if (Array.isArray(body.orderedIds)) {
      await SectionRepository.reorder(body.orderedIds as string[]);
      revalidatePath("/");
      revalidatePath("/admin/sections");
      return NextResponse.json({ success: true, message: "Sections reordered successfully" });
    }

    const { id, ...data } = body;
    if (typeof id !== "string" || !id) {
      return NextResponse.json({ success: false, error: "Section ID is required" }, { status: 400 });
    }

    const updated = await SectionRepository.update(id, data);
    revalidatePath("/");
    revalidatePath("/admin/sections");
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unauthorized or failed to update section" },
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
      return NextResponse.json({ success: false, error: "Section ID is required" }, { status: 400 });
    }

    await SectionRepository.delete(id);
    revalidatePath("/");
    revalidatePath("/admin/sections");
    return NextResponse.json({ success: true, message: "Section deleted successfully" });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unauthorized or failed to delete section" },
      { status: 401 }
    );
  }
}
