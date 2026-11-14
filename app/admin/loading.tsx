import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";

/**
 * Route-level loading UI for the admin CMS.
 * Reuses the shared admin skeleton so listing pages, forms and tables
 * all settle into the same layout metrics.
 */
export default function AdminLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <AdminPageSkeleton />
    </div>
  );
}
