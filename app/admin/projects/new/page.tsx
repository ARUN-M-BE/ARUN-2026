import { requireAdmin } from "@/lib/auth-guard";
import { PageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "../project-form";

export default async function NewProjectPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Universe Project"
        description="Add a new project case study with interactive parameters and tech stack tags."
      />
      <ProjectForm />
    </div>
  );
}
