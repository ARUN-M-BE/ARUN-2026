"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { deleteTestimonial } from "@/lib/actions";
import { Edit2, Trash2, MessageSquareQuote, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function TestimonialListClient({ initialData }: { initialData: any[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialData);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await deleteTestimonial(deleteId);
      if (res.success) {
        toast.success("Testimonial deleted");
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
          title="No testimonials registered"
          description="Collect and publish authentic, verifiable client feedback."
          icon={<MessageSquareQuote className="w-6 h-6" />}
        >
          <Link href="/admin/testimonials/new">
            <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs">
              Add Testimonial
            </Button>
          </Link>
        </EmptyState>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground">Author & Title</TableHead>
                <TableHead className="text-xs text-muted-foreground">Testimonial Quote</TableHead>
                <TableHead className="text-xs text-muted-foreground">Verified</TableHead>
                <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((t) => (
                <TableRow key={t.id} className="border-border hover:bg-white/5 transition-colors">
                  <TableCell className="py-3">
                    <div className="font-semibold text-xs text-white">{t.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {t.title} {t.company && `at ${t.company}`}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground max-w-sm truncate italic">
                    &ldquo;{t.content}&rdquo;
                  </TableCell>
                  <TableCell className="py-3">
                    {t.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">Unverified</span>
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    <StatusBadge status={t.status} />
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/testimonials/${t.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-cyan-400">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(t.id)}
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
        title="Delete Testimonial?"
      />
    </div>
  );
}
