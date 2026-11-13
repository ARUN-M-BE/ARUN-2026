import { requireAdmin } from "@/lib/auth-guard";
import { getSections } from "@/lib/actions";
import { PageHeader } from "@/components/admin/page-header";
import { SectionsClient } from "./list/SectionsClient";
import type { WebsiteSection } from "@/types";

export default async function SectionsServer() {
  await requireAdmin();
  const sections = await getSections();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Website Section Architecture"
        description="Individually configure, reorder, duplicate, draft, and publish all website sections for https://arun-m.in."
      />
      <SectionsClient initialData={sections as unknown as WebsiteSection[]} />
    </div>
  );
}
