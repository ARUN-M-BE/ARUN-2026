import { requireAdmin } from "@/lib/auth-guard";
import { getProfile } from "@/lib/actions";
import { PageHeader } from "@/components/admin/page-header";
import { ProfileForm } from "@/components/admin/features/profile/shared/ProfileForm";

export default async function ProfileAdminPage() {
  await requireAdmin();
  const profile = await getProfile();
  const serializedProfile = profile ? JSON.parse(JSON.stringify(profile)) : null;

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Personal Profile & Developer Identity"
        description="Update your bio, titles, headline stats, and contact availability shown in the 3D hero sculpture."
      />
      <ProfileForm initialData={serializedProfile} />
    </div>
  );
}
