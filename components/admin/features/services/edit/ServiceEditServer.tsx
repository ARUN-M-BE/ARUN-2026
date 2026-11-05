import { requireAdmin } from "@/lib/auth-guard";
import { getServices } from "@/lib/actions";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { ServiceForm } from "@/components/admin/features/services/shared/ServiceForm";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const items = await getServices();
  const svc = items.find((i) => i.id === id);

  if (!svc) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Service: ${svc.title}`}
        description="Update service scope, deliverables or pricing terms."
      />
      <ServiceForm initialData={svc} isEditing />
    </div>
  );
}
