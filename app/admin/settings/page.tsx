import { requireAdmin } from "@/lib/auth-guard";
import { getSiteSettings } from "@/lib/actions";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsClient } from "./settings-client";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Universe Settings & Theming"
        description="Configure digital universe accents, DPDP 2023 retention rules, cookie banner controls, and site identity."
      />
      <SettingsClient initialSettings={settings} />
    </div>
  );
}
