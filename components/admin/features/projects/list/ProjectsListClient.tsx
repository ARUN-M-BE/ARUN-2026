"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/admin/status-badge";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { deleteProject } from "@/lib/actions";
import { Edit2, Trash2, ExternalLink, Star, Search, FolderGit2 } from "lucide-react";
import { toast } from "sonner";
import type { Project } from "@/types";

export function ProjectListClient({ initialData }: { initialData: Project[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialData);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await deleteProject(deleteId);
      if (res.success) {
        toast.success("Project deleted successfully");
        setProjects((prev) => prev.filter((p) => p.id !== deleteId));
        setDeleteId(null);
        router.refresh();
      } else {
        toast.error("Failed to delete project", { description: res.error });
      }
    } catch {
      toast.error("An error occurred while deleting");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border text-xs"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No projects found"
          description="Build your interactive 3D portfolio by creating your first showcase project."
          icon={<FolderGit2 className="w-6 h-6" />}
        >
          <Link href="/admin/projects/new">
            <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs">
              Create Project
            </Button>
          </Link>
        </EmptyState>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground">Title & Category</TableHead>
                <TableHead className="text-xs text-muted-foreground">Tech Stack</TableHead>
                <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs text-muted-foreground">Featured</TableHead>
                <TableHead className="text-xs text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((project) => (
                <TableRow key={project.id} className="border-border hover:bg-white/5 transition-colors">
                  <TableCell className="py-3">
                    <div className="font-medium text-xs text-white">{project.title}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      /{project.slug} {project.category && `• ${project.category}`}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {((project.techStack as string[]) || []).slice(0, 4).map((tech) => (
                        <span key={tech} className="px-1.5 py-0.5 rounded text-[10px] bg-secondary text-zinc-300">
                          {tech}
                        </span>
                      ))}
                      {((project.techStack as string[]) || []).length > 4 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{((project.techStack as string[]) || []).length - 4}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <StatusBadge status={project.status} />
                  </TableCell>
                  <TableCell className="py-3">
                    {project.isFeatured ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        Featured
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </a>
                      )}
                      <Link href={`/admin/projects/${project.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-cyan-400">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(project.id)}
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
        title="Delete Project?"
        description="Are you sure you want to remove this project from your interactive universe?"
      />
    </div>
  );
}
