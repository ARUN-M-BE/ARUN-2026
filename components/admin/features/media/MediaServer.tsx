import { requireAdmin } from "@/lib/auth-guard";
import { getMediaAssets } from "@/lib/actions";
import { PageHeader } from "@/components/admin/page-header";
import { MediaClient } from "@/components/admin/features/media/list/MediaClient";

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ folder?: string; page?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const folder = params.folder;
  const page = Number(params.page) || 1;

  const data = await getMediaAssets({ folder, page, limit: 24 });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Assets & Copyright Registry"
        description="Manage portfolio image assets, 3D textures, license attributes, and WCAG accessible alt descriptions."
      />
      <MediaClient initialData={data.items} />
    </div>
  );
}
