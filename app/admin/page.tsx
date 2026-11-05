import { Suspense } from "react";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import PageContent from "@/components/admin/features/dashboard/DashboardServer";

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <PageContent />
    </Suspense>
  );
}
