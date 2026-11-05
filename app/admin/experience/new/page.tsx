import { Suspense } from "react";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import PageContent from "@/components/admin/features/experience/create/ExperienceCreateServer";

export default function NewExperiencePage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <PageContent />
    </Suspense>
  );
}
