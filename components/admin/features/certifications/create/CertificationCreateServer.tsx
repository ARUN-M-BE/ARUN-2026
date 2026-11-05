import { requireAdmin } from "@/lib/auth-guard";
import { PageHeader } from "@/components/admin/page-header";
import { CertificationForm } from "@/components/admin/features/certifications/shared/CertificationForm";

export default async function NewCertificationPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Certification"
        description="Add a verified professional certification or industry license."
      />
      <CertificationForm />
    </div>
  );
}
