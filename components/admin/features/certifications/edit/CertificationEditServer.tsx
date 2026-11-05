import { requireAdmin } from "@/lib/auth-guard";
import { getCertifications } from "@/lib/actions";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { CertificationForm } from "@/components/admin/features/certifications/shared/CertificationForm";

export default async function EditCertificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const items = await getCertifications();
  const cert = items.find((i) => i.id === id);

  if (!cert) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Certification: ${cert.name}`}
        description="Update license identifier, authority or verification link."
      />
      <CertificationForm initialData={cert} isEditing />
    </div>
  );
}
