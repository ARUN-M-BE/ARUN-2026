import { requireAdmin } from "@/lib/auth-guard";
import { getExperiences } from "@/lib/actions";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ExperienceListClient } from "./experience-list-client";

export default async function AdminExperiencePage() {
  await requireAdmin();
  const experiences = await getExperiences();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Professional Experience Timeline"
        description="Curate your career trajectory, leadership positions, key achievements, and technology stacks."
      >
        <Link href="/admin/experience/new">
          <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Experience
          </Button>
        </Link>
      </PageHeader>

      <ExperienceListClient initialData={experiences} />
    </div>
  );
}
