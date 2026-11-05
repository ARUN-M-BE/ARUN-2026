import { requireAdmin } from "@/lib/auth-guard";
import { getSocialLinks } from "@/lib/actions";
import { PageHeader } from "@/components/admin/page-header";
import { SocialLinksClient } from "@/components/admin/features/social-links/SocialLinksClient";

export default async function AdminSocialLinksPage() {
  await requireAdmin();
  const links = await getSocialLinks();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Social Media & Developer Handles"
        description="Connect your GitHub, LinkedIn, Twitter, Discord, and external developer profiles."
      />
      <SocialLinksClient initialData={links} />
    </div>
  );
}
