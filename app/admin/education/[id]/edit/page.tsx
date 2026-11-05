import { Suspense } from "react";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import PageContent from "@/components/admin/features/education/edit/EducationEditServer";

export default function EditEducationPage({
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
