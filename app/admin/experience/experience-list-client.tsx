"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { deleteExperience } from "@/lib/actions";
import { Edit2, Trash2, Briefcase } from "lucide-react";
import { toast } from "sonner";

export function ExperienceListClient({ initialData }: { initialData: any[] }) {
  const router = useRouter();
  const [experiences, setExperiences] = useState(initialData);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await deleteExperience(deleteId);
      if (res.success) {
        toast.success("Experience deleted successfully");
        setExperiences((prev) => prev.filter((e) => e.id !== deleteId));
        setDeleteId(null);
        router.refresh();
      } else {
        toast.error("Failed to delete", { description: res.error });
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {experiences.length === 0 ? (
        <EmptyState
          title="No career milestones recorded"
          description="Add your first company, role, dates and achievements to power the animated timeline."
          icon={<Briefcase className="w-6 h-6" />}
        >
          <Link href="/admin/experience/new">
            <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs">
              Add Milestone
            </Button>
          </Link>
        </EmptyState>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground">Company & Role</TableHead>
                <TableHead className="text-xs text-muted-foreground">Period</TableHead>
                <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experiences.map((exp) => (
                <TableRow key={exp.id} className="border-border hover:bg-white/5 transition-colors">
                  <TableCell className="py-3">
                    <div className="font-semibold text-xs text-white">{exp.position}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {exp.company} {exp.location && `• ${exp.location}`}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground font-mono">
                    {new Date(exp.startDate).getFullYear()} -{" "}
                    {exp.isCurrent ? <span className="text-cyan-400 font-semibold">Present</span> : exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}
                  </TableCell>
                  <TableCell className="py-3">
                    <StatusBadge status={exp.status} />
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/experience/${exp.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-cyan-400">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(exp.id)}
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
        title="Delete Milestone?"
      />
    </div>
  );
}
