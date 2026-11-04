import { requireAdmin } from "@/lib/auth-guard";
import { getCertifications } from "@/lib/actions";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CertificationListClient } from "./certification-list-client";

export default async function AdminCertificationsPage() {
  await requireAdmin();
  const certs = await getCertifications();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Professional Certifications & Licenses"
        description="Showcase verified cloud, security, and systems engineering credentials."
      >
        <Link href="/admin/certifications/new">
          <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Certification
          </Button>
        </Link>
      </PageHeader>

      <CertificationListClient initialData={certs} />
    </div>
  );
}
