import { requireAdmin } from "@/lib/auth-guard";
import { getExperiences } from "@/lib/actions";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { ExperienceForm } from "../../experience-form";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const experiences = await getExperiences();
  const exp = experiences.find((e) => e.id === id);

  if (!exp) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Milestone: ${exp.position} at ${exp.company}`}
        description="Update role details, dates or achievements."
      />
      <ExperienceForm initialData={exp} isEditing />
    </div>
  );
}
