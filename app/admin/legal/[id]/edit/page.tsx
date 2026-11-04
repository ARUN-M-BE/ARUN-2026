import { requireAdmin } from "@/lib/auth-guard";
import { getLegalDocuments } from "@/lib/actions";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { LegalForm } from "../../legal-form";

export default async function EditLegalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const docs = await getLegalDocuments();
  const doc = docs.find((d) => d.id === id);

  if (!doc) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Legal Document: ${doc.title}`}
        description="Update statutory document clauses, effective dates, or version history records."
      />
      <LegalForm initialData={doc} />
    </div>
  );
}
