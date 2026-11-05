import { Suspense } from "react";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import PageContent from "@/components/admin/features/projects/edit/ProjectEditServer";

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <PageContent params={params} />
    </Suspense>
  );
}
