import { requireAdmin } from "@/lib/auth-guard";
import { getEducation } from "@/lib/actions";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { EducationListClient } from "./education-list-client";

export default async function AdminEducationPage() {
  await requireAdmin();
  const education = await getEducation();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Education & Academic Archive"
        description="Manage your university degrees, specializations, academic research, and honors."
      >
        <Link href="/admin/education/new">
          <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Degree
          </Button>
        </Link>
      </PageHeader>

      <EducationListClient initialData={education} />
    </div>
  );
}
