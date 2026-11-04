import { requireAdmin } from "@/lib/auth-guard";
import { PageHeader } from "@/components/admin/page-header";
import { ExperienceForm } from "../experience-form";

export default async function NewExperiencePage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Career Milestone"
        description="Add a new employment history entry to the animated professional timeline."
      />
      <ExperienceForm />
    </div>
  );
}
