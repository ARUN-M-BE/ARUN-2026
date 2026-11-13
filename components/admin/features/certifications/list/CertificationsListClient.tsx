"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { deleteCertification } from "@/lib/actions";
import { Edit2, Trash2, Award, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { Certification } from "@/types";

export function CertificationListClient({ initialData }: { initialData: Certification[] }) {
  const router = useRouter();
  const [certs, setCerts] = useState(initialData);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await deleteCertification(deleteId);
      if (res.success) {
        toast.success("Certification deleted");
        setCerts((prev) => prev.filter((c) => c.id !== deleteId));
        setDeleteId(null);
        router.refresh();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {certs.length === 0 ? (
        <EmptyState
          title="No certifications added"
          description="Highlight your credentials (AWS, GCP, CKA, OSCP, etc.)."
          icon={<Award className="w-6 h-6" />}
        >
          <Link href="/admin/certifications/new">
            <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs">
              Add Certification
            </Button>
          </Link>
        </EmptyState>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground">Certification & Issuer</TableHead>
                <TableHead className="text-xs text-muted-foreground">Credential ID</TableHead>
                <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certs.map((c) => (
                <TableRow key={c.id} className="border-border hover:bg-white/5 transition-colors">
                  <TableCell className="py-3">
                    <div className="font-semibold text-xs text-white">{c.name}</div>
                    <div className="text-[11px] text-muted-foreground">{c.issuer}</div>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground font-mono">
                    {c.credentialId || "-"}
                  </TableCell>
                  <TableCell className="py-3">
                    <StatusBadge status={c.status} />
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {c.credentialUrl && (
                        <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </a>
                      )}
                      <Link href={`/admin/certifications/${c.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-cyan-400">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(c.id)}
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
        title="Delete Certification?"
      />
    </div>
  );
}
