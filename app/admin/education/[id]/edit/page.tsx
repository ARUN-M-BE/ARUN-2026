import { requireAdmin } from "@/lib/auth-guard";
import { getEducation } from "@/lib/actions";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { EducationForm } from "../../education-form";

export default async function EditEducationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const items = await getEducation();
  const edu = items.find((i) => i.id === id);

  if (!edu) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Education: ${edu.degree}`}
        description="Update educational degree and institution details."
      />
      <EducationForm initialData={edu} isEditing />
    </div>
  );
}
