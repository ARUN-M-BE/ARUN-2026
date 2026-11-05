import { requireAdmin } from "@/lib/auth-guard";
import { getTestimonials } from "@/lib/actions";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { TestimonialForm } from "@/components/admin/features/testimonials/shared/TestimonialForm";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const items = await getTestimonials();
  const item = items.find((i) => i.id === id);

  if (!item) {
    notFound();
  }

  const serializedItem = JSON.parse(JSON.stringify(item));

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Testimonial: ${item.name}`}
        description="Update quote text, verification status or rating."
      />
      <TestimonialForm initialData={serializedItem} isEditing />
    </div>
  );
}
