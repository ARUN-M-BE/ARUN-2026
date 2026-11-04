import { requireAdmin } from "@/lib/auth-guard";
import { getSeoMetadata } from "@/lib/actions";
import { PageHeader } from "@/components/admin/page-header";
import { SeoClient } from "./seo-client";

export default async function AdminSeoPage() {
  await requireAdmin();
  const metadata = await getSeoMetadata();

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Search Engine Optimization (SEO) & Open Graph"
        description="Optimize discoverability, structured data schemas (JSON-LD), social card previews, and indexation controls."
      />
      <SeoClient initialMetadata={Array.isArray(metadata) ? metadata : metadata ? [metadata] : []} />
    </div>
  );
}
