import { Suspense } from "react";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import PageContent from "@/components/admin/features/messages/MessagesServer";

export default function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <PageContent searchParams={searchParams} />
    </Suspense>
  );
}
