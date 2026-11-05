import { requireAdmin } from "@/lib/auth-guard";
import { getProjectById } from "@/lib/actions";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/admin/features/projects/shared/ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Project: ${project.title}`}
        description="Update project details, architecture case study, or publish status."
      />
      <ProjectForm initialData={project} isEditing />
    </div>
  );
}
