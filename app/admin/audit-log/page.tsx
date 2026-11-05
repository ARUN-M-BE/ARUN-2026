import { Suspense } from "react";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import PageContent from "@/components/admin/features/audit-log/list/AuditLogServer";

export default function AdminAuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ entity?: string; page?: string }>;
}) {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <PageContent searchParams={searchParams} />
    </Suspense>
  );
}
