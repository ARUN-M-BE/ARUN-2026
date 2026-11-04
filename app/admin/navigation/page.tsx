import { requireAdmin } from "@/lib/auth-guard";
import { getNavigation } from "@/lib/actions";
import { PageHeader } from "@/components/admin/page-header";
import { NavigationClient } from "./navigation-client";

export default async function AdminNavigationPage() {
  await requireAdmin();
  const items = await getNavigation();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Navigation & Section Routing"
        description="Configure header links, quick navigation items, and section jump points for the 3D portfolio."
      />
      <NavigationClient initialData={items} />
    </div>
  );
}
