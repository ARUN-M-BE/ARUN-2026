import { requireAdmin } from "@/lib/auth-guard";
import { PageHeader } from "@/components/admin/page-header";
import { TestimonialForm } from "@/components/admin/features/testimonials/shared/TestimonialForm";

export default async function NewTestimonialPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Verified Testimonial"
        description="Add a genuine recommendation from a former client or engineering collaborator."
      />
      <TestimonialForm />
    </div>
  );
}
