import { requireAdmin } from "@/lib/auth-guard";
import { getTestimonials } from "@/lib/actions";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { TestimonialListClient } from "@/components/admin/features/testimonials/list/TestimonialsListClient";

export default async function AdminTestimonialsPage() {
  await requireAdmin();
  const items = await getTestimonials();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials & Verifiable Recommendations"
        description="Display verified client recommendations and peer endorsements complying with genuine claims legal standards."
      >
        <Link href="/admin/testimonials/new">
          <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Testimonial
          </Button>
        </Link>
      </PageHeader>

      <TestimonialListClient initialData={items} />
    </div>
  );
}
