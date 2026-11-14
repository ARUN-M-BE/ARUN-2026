import { NextRequest, NextResponse } from "next/server";
import { ProjectRepository } from "@/server/repositories";
import { requireAdmin } from "@/server/middleware/auth-guard";
import { projectSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const result = await ProjectRepository.findMany({ search, status, page, limit });
    return NextResponse.json({ success: true, data: result.items, meta: { total: result.total, page, limit, pages: result.pages } });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    const item = await ProjectRepository.create(parsed.data);
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unauthorized or failed to create project" },
      { status: 401 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const body = (await request.json()) as Record<string, unknown>;
    const { id, ...data } = body;
    if (typeof id !== "string" || !id) {
      return NextResponse.json({ success: false, error: "Project ID is required" }, { status: 400 });
    }

    const updated = await ProjectRepository.update(id, data);
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unauthorized or failed to update project" },
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
      return NextResponse.json({ success: false, error: "Project ID is required" }, { status: 400 });
    }

    await ProjectRepository.delete(id);
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unauthorized or failed to delete project" },
      { status: 401 }
    );
  }
}
