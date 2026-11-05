import { requireAdmin } from "@/lib/auth-guard";
import { PageHeader } from "@/components/admin/page-header";
import { EducationForm } from "@/components/admin/features/education/shared/EducationForm";

export default async function NewEducationPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Education Qualification"
        description="Archive an academic degree or specialized certification program."
      />
      <EducationForm />
    </div>
  );
}
