import { requireAdmin } from "@/lib/auth-guard";
import { PageHeader } from "@/components/admin/page-header";
import { ServiceForm } from "../service-form";

export default async function NewServicePage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Service Offering"
        description="Add a technical or consulting service package to your portfolio."
      />
      <ServiceForm />
    </div>
  );
}
