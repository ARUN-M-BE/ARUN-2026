"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { deleteLegalDocument } from "@/lib/actions";
import { Edit2, Trash2, Scale, AlertTriangle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { LegalDocument } from "@/types";

export function LegalClient({ initialData }: { initialData: LegalDocument[] }) {
  const router = useRouter();
  const [docs, setDocs] = useState(initialData);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await deleteLegalDocument(deleteId);
      if (res.success) {
        toast.success("Document deleted");
        setDocs((prev) => prev.filter((d) => d.id !== deleteId));
        setDeleteId(null);
        router.refresh();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {docs.length === 0 ? (
        <EmptyState
          title="No legal policies found"
          description="Statutory legal documents should be seeded into the database."
          icon={<Scale className="w-6 h-6" />}
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground">Document Title & Slug</TableHead>
                <TableHead className="text-xs text-muted-foreground">Version</TableHead>
                <TableHead className="text-xs text-muted-foreground">Legal Review Notice</TableHead>
                <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map((doc) => (
                <TableRow key={doc.id} className="border-border hover:bg-white/5 transition-colors">
                  <TableCell className="py-3">
                    <div className="font-semibold text-xs text-white">{doc.title}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      /legal/{doc.slug}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-cyan-400 font-mono">
                    v{doc.version}
                  </TableCell>
                  <TableCell className="py-3">
                    {doc.isReviewRequired ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Draft (Review Required)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    <StatusBadge status={doc.status} />
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/legal/${doc.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-cyan-400">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(doc.id)}
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
        title="Delete Legal Document?"
      />
    </div>
  );
}
