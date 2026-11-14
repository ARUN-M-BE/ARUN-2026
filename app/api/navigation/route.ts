import { NextRequest, NextResponse } from "next/server";
import { NavigationRepository } from "@/server/repositories";
import { requireAdmin } from "@/server/middleware/auth-guard";
import { navigationSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get("published") === "true";
    const items = publishedOnly ? await NavigationRepository.findActive() : await NavigationRepository.findMany();
    return NextResponse.json({ success: true, data: items });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch navigation" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = navigationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    const item = await NavigationRepository.create(parsed.data);
    revalidatePath("/");
    revalidatePath("/admin/navigation");
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unauthorized or failed to create navigation" },
      { status: 401 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const body = (await request.json()) as Record<string, unknown>;

    // Reorder check
    if (Array.isArray(body.orderedIds)) {
      await NavigationRepository.reorder(body.orderedIds as string[]);
      revalidatePath("/");
      revalidatePath("/admin/navigation");
      return NextResponse.json({ success: true, message: "Reordered successfully" });
    }

    const { id, ...data } = body;
    if (typeof id !== "string" || !id) {
      return NextResponse.json({ success: false, error: "Navigation ID is required" }, { status: 400 });
    }

    const updated = await NavigationRepository.update(id, data);
    revalidatePath("/");
    revalidatePath("/admin/navigation");
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unauthorized or failed to update navigation" },
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
      return NextResponse.json({ success: false, error: "Navigation ID is required" }, { status: 400 });
    }

    await NavigationRepository.delete(id);
    revalidatePath("/");
    revalidatePath("/admin/navigation");
    return NextResponse.json({ success: true, message: "Navigation deleted successfully" });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unauthorized or failed to delete navigation" },
      { status: 401 }
    );
  }
}
