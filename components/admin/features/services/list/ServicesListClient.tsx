"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { deleteService } from "@/lib/actions";
import { Edit2, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function ServiceListClient({ initialData }: { initialData: any[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialData);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await deleteService(deleteId);
      if (res.success) {
        toast.success("Service deleted");
        setItems((prev) => prev.filter((i) => i.id !== deleteId));
        setDeleteId(null);
        router.refresh();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {items.length === 0 ? (
        <EmptyState
          title="No services configured"
          description="Offer architecture, frontend engineering, or 3D development services to potential clients."
          icon={<Sparkles className="w-6 h-6" />}
        >
          <Link href="/admin/services/new">
            <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs">
              Add Service
            </Button>
          </Link>
        </EmptyState>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground">Service Title</TableHead>
                <TableHead className="text-xs text-muted-foreground">Price / Scope</TableHead>
                <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((svc) => (
                <TableRow key={svc.id} className="border-border hover:bg-white/5 transition-colors">
                  <TableCell className="py-3">
                    <div className="font-semibold text-xs text-white">{svc.title}</div>
                    <div className="text-[11px] text-muted-foreground truncate max-w-md">
                      {svc.shortDescription}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-cyan-400 font-mono">
                    {svc.price || "Custom Quote"}
                  </TableCell>
                  <TableCell className="py-3">
                    <StatusBadge status={svc.status} />
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/services/${svc.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-cyan-400">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(svc.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete Service Offering?"
      />
    </div>
  );
}
