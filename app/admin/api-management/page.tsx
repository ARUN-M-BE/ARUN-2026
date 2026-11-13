import { Suspense } from "react";
import { AdminPageSkeleton } from "@/components/admin/admin-page-skeleton";
import { ApiManagementClient } from "@/components/admin/features/api-management/ApiManagementClient";

export const metadata = {
  title: "API Management & Free Integrations | CMS Nexus",
  description: "Live monitor, test, and audit all REST APIs and external free-tier integrations.",
};

export default function ApiManagementPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <ApiManagementClient />
    </Suspense>
  );
}
