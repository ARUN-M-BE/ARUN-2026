import { Suspense } from "react";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import SectionsServer from "@/components/admin/features/sections/SectionsServer";

export const metadata = {
  title: "Website Section Management | CMS Nexus",
  description: "Manage, reorder, duplicate, draft, and publish all website sections.",
};

export default function AdminSectionsPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <SectionsServer />
    </Suspense>
  );
}
