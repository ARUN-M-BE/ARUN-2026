import { Suspense } from "react";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import PageContent from "@/components/admin/features/testimonials/create/TestimonialCreateServer";

export default function NewTestimonialPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <PageContent />
    </Suspense>
  );
}
