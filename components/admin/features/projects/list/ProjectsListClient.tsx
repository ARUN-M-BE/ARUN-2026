"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { deleteProject } from "@/lib/actions";
import {
  Edit2,
  Trash2,
  ExternalLink,
  Star,
  Search,
  FolderGit2,
  LayoutGrid,
  List,
  Eye,
  Code2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import type { Project } from "@/types";

export function ProjectListClient({ initialData }: { initialData: Project[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialData);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Detailed Project Modal
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [activeGalleryImg, setActiveGalleryImg] = useState<string | null>(null);

  // Deletion state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase())) ||
      (p.techStack && (p.techStack as string[]).some((t) => t.toLowerCase().includes(search.toLowerCase())));
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

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

  const openDetailModal = (proj: Project) => {
    setDetailProject(proj);
    const firstImg = proj.thumbnail || (Array.isArray(proj.images) && proj.images.length > 0 ? proj.images[0] : null);
    setActiveGalleryImg(firstImg);
  };

  return (
    <div className="space-y-6">
      {/* Control Bar: Search + Category + View Mode + Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects or tech..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background/50 border-border text-xs"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={String(cat)}
                type="button"
                onClick={() => setSelectedCategory(String(cat))}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted"
                }`}
              >
                {String(cat)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/50">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Link href="/admin/projects/new">
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Projects Display */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No projects match your filter"
          description="Build your interactive 3D portfolio by creating your first showcase project."
          icon={<FolderGit2 className="w-6 h-6" />}
        >
          <Link href="/admin/projects/new">
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Create Project
            </Button>
          </Link>
        </EmptyState>
      ) : viewMode === "grid" ? (
        /* ── Grid View ────────────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((project) => {
            const hasCover = Boolean(project.thumbnail);
            const techList = (project.techStack as string[]) || [];

            return (
              <div
                key={project.id}
                className="group rounded-3xl border border-border bg-card overflow-hidden shadow-xs hover:border-primary/40 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Large Cover Image with Badges */}
                  <div
                    onClick={() => openDetailModal(project)}
                    className="relative aspect-video w-full overflow-hidden bg-muted cursor-pointer"
                  >
                    {hasCover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.thumbnail!}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-sky-950/40 to-indigo-950/40 text-muted-foreground p-4 text-center">
                        <FolderGit2 className="w-8 h-8 text-primary/40 mb-2" />
                        <span className="text-xs font-mono">No cover image uploaded</span>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <StatusBadge status={project.status} />

                      {project.isFeatured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold backdrop-blur-md">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Hover Quick View Pill */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs pointer-events-none">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-black text-xs font-semibold shadow-lg">
                        <Eye className="w-3.5 h-3.5" />
                        Quick View Case Study
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                      <span>{project.category || "Full-Stack Project"}</span>
                      {project.client && <span>• {project.client}</span>}
                    </div>

                    <h3
                      onClick={() => openDetailModal(project)}
                      className="font-bold text-base text-foreground group-hover:text-primary transition-colors cursor-pointer line-clamp-1"
                    >
                      {project.title}
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {project.shortDescription || project.description || "No project description provided."}
                    </p>

                    {/* Tech Stack Chips */}
                    {techList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {techList.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-muted text-muted-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                        {techList.length > 4 && (
                          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono text-muted-foreground">
                            +{techList.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer: Live Links & Admin Controls */}
                <div className="px-5 py-3 border-t border-border/60 bg-muted/20 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-muted transition-colors"
                        title="Live Production Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                        title="GitHub Repository"
                      >
                        <Code2 className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Link href={`/admin/projects/${project.id}/edit`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Edit project">
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(project.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-rose-400"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── List View ─────────────────────────────────── */
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground">Project</TableHead>
                <TableHead className="text-xs text-muted-foreground">Category</TableHead>
                <TableHead className="text-xs text-muted-foreground">Tech Stack</TableHead>
                <TableHead className="text-xs text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs text-muted-foreground">Featured</TableHead>
                <TableHead className="text-xs text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((project) => (
                <TableRow key={project.id} className="border-border hover:bg-muted/20 transition-colors">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      {project.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-10 h-10 rounded-xl object-cover border border-border shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground shrink-0">
                          <FolderGit2 className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <span
                          onClick={() => openDetailModal(project)}
                          className="font-bold text-xs text-foreground hover:text-primary cursor-pointer block"
                        >
                          {project.title}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground block truncate max-w-xs">
                          /{project.slug}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground">
                    {project.category || "Full-Stack"}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {((project.techStack as string[]) || []).slice(0, 3).map((tech) => (
                        <span key={tech} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <StatusBadge status={project.status} />
                  </TableCell>
                  <TableCell className="py-3">
                    {project.isFeatured ? (
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ) : (
                      <Star className="w-4 h-4 text-muted-foreground/30" />
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDetailModal(project)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        title="Preview Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Link href={`/admin/projects/${project.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" title="Edit">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(project.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-rose-400"
                        title="Delete"
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

      {/* Detailed Project View Modal */}
      <Dialog open={Boolean(detailProject)} onOpenChange={(open) => !open && setDetailProject(null)}>
        <DialogContent className="sm:max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
          {detailProject && (
            <div className="space-y-5 py-2">
              <DialogHeader>
                <div className="flex items-center justify-between pr-6">
                  <StatusBadge status={detailProject.status} />
                  {detailProject.category && (
                    <span className="text-xs font-mono text-muted-foreground uppercase">
                      {detailProject.category}
                    </span>
                  )}
                </div>
                <DialogTitle className="text-xl font-black text-foreground mt-2">
                  {detailProject.title}
                </DialogTitle>
                {detailProject.shortDescription && (
                  <DialogDescription className="text-sm text-muted-foreground">
                    {detailProject.shortDescription}
                  </DialogDescription>
                )}
              </DialogHeader>

              {/* Large Active Image Preview */}
              {activeGalleryImg && (
                <div className="rounded-2xl overflow-hidden border border-border aspect-video bg-black/60 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeGalleryImg}
                    alt={detailProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Gallery Thumbnails */}
              {Array.isArray(detailProject.images) && detailProject.images.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Gallery Snapshots ({detailProject.images.length})
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {detailProject.images.map((imgUrl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveGalleryImg(imgUrl)}
                        className={`w-16 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          activeGalleryImg === imgUrl ? "border-primary scale-105 shadow-sm" : "border-border opacity-70 hover:opacity-100"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Case Study Details */}
              {detailProject.description && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Architecture Case Study
                  </span>
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                    {detailProject.description}
                  </div>
                </div>
              )}

              {/* Technologies */}
              {Array.isArray(detailProject.techStack) && detailProject.techStack.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Technologies & Cloud Tools
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {detailProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-muted border border-border text-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links & Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  {detailProject.liveUrl && (
                    <a
                      href={detailProject.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-xs hover:bg-primary/90"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Launch Live App
                    </a>
                  )}
                  {detailProject.githubUrl && (
                    <a
                      href={detailProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted text-foreground border border-border text-xs font-semibold hover:bg-muted/80"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      Source Code
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/admin/projects/${detailProject.id}/edit`}>
                    <Button size="sm" variant="outline" className="text-xs border-border gap-1.5">
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit Project
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDetailProject(null)}
                    className="text-xs border-border"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <DeleteDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete Project"
        description="Are you sure you want to permanently delete this project? This will remove all image associations and public showcase pages."
      />
    </div>
  );
}
