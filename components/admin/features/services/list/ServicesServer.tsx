import { requireAdmin } from "@/lib/auth-guard";
import { getServices } from "@/lib/actions";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ServiceListClient } from "@/components/admin/features/services/list/ServicesListClient";

export default async function AdminServicesPage() {
  await requireAdmin();
  const services = await getServices();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services & Architecture Offerings"
        description="Define commercial consulting offerings, cloud architecture services, and custom engineering packages."
      >
        <Link href="/admin/services/new">
          <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Service
          </Button>
        </Link>
      </PageHeader>

      <ServiceListClient initialData={services} />
    </div>
  );
}
