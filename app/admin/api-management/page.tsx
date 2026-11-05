import { Suspense } from "react";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import PageContent from "@/components/admin/features/api-management/ApiManagementServer";

export default function ApiManagementPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <PageContent />
    </Suspense>
  );
}
