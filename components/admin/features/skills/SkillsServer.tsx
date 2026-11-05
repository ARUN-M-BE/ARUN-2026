import { requireAdmin } from "@/lib/auth-guard";
import { getSkillCategories, getSkills } from "@/lib/actions";
import { PageHeader } from "@/components/admin/page-header";
import { SkillsClient } from "@/components/admin/features/skills/SkillsClient";

export default async function AdminSkillsPage() {
  await requireAdmin();
  const [categories, skills] = await Promise.all([
    getSkillCategories(),
    getSkills(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skills Constellation"
        description="Configure skill nodes, categories, proficiencies, and featured items that appear in the interactive 3D universe."
      />
      <SkillsClient initialCategories={categories} initialSkills={skills} />
    </div>
  );
}
