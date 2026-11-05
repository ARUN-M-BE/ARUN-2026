import { requireAdmin } from "@/lib/auth-guard";
import { getProjects } from "@/lib/actions";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ProjectListClient } from "@/components/admin/features/projects/list/ProjectsListClient";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";

  const data = await getProjects({ page, search, limit: 20 });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects Universe"
        description="Manage 3D portfolio project case studies, tech stacks, live links, and media galleries."
      >
        <Link href="/admin/projects/new">
          <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" />
            New Project
          </Button>
        </Link>
      </PageHeader>

      <ProjectListClient initialData={data.items} />
    </div>
  );
}
