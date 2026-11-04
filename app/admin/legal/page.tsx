import { requireAdmin } from "@/lib/auth-guard";
import { getLegalDocuments } from "@/lib/actions";
import { PageHeader } from "@/components/admin/page-header";
import { LegalClient } from "./legal-client";

export default async function AdminLegalPage() {
  await requireAdmin();
  const docs = await getLegalDocuments();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Legal, Privacy & DPDP Act 2023 Compliance"
        description="Maintain statutory policies, terms of service, cookie notices, and version audit records in compliance with Indian IT Act 2000 & DPDP Rules 2025."
      />
      <LegalClient initialData={docs} />
    </div>
  );
}
