import { requireAdmin } from "@/lib/auth-guard";
import { getAuditLogs } from "@/lib/actions";
import { PageHeader } from "@/components/admin/page-header";
import { AuditLogClient } from "@/components/admin/features/audit-log/list/AuditLogClient";

export default async function AdminAuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ entity?: string; page?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const entity = params.entity;
  const page = Number(params.page) || 1;

  const data = await getAuditLogs({ entity, page, limit: 50 });
  const serializedItems = JSON.parse(JSON.stringify(data.items || []));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security & System Audit Logs"
        description="Immutable record of administrative actions, data modifications, and security events."
      />
      <AuditLogClient initialData={serializedItems} />
    </div>
  );
}
