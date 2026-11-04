import { requireAdmin } from "@/lib/auth-guard";
import { getContactMessages } from "@/lib/actions";
import { PageHeader } from "@/components/admin/page-header";
import { MessagesClient } from "./messages-client";

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const status = params.status;
  const page = Number(params.page) || 1;

  const data = await getContactMessages({ status, page, limit: 20 });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Inquiries & Communications"
        description="Review inbound client leads, project proposals, and messages submitted through the 3D portfolio contact form."
      />
      <MessagesClient initialData={data.items} totalPages={data.pages} />
    </div>
  );
}
