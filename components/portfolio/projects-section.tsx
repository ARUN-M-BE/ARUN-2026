"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TiltCard } from "@/components/ui/tilt-card";
import {
  FolderGit2,
  ExternalLink,
  Code2,
  Search,
  Star,
  Layers,
  Eye,
  GitCompare,
  Check,
  Sparkles,
  LayoutGrid,
  List,
  Images,
} from "lucide-react";
import { useLanguage } from "@/context/languageContext";
import type { Project } from "@/types";

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects = [] }: ProjectsSectionProps) {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Comparison mode
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Extract unique categories safely
  const categories = ["All", ...Array.from(new Set((projects || []).map((p) => p.category).filter(Boolean))) as string[]];

  const filtered = (projects || []).filter((p) => {
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.shortDescription && p.shortDescription.toLowerCase().includes(search.toLowerCase())) ||
      (p.techStack && (p.techStack as string[]).some((tech) => tech.toLowerCase().includes(search.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  const toggleCompare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (compareIds.includes(id)) {
      setCompareIds((prev) => prev.filter((item) => item !== id));
    } else {
      if (compareIds.length >= 2) {
        setCompareIds([compareIds[1], id]);
      } else {
        setCompareIds((prev) => [...prev, id]);
      }
    }
  };

  const openProjectModal = (project: Project) => {
    setActiveProject(project);
    setActiveImageIndex(0);
  };

  const comparedProjects = (projects || []).filter((p) => compareIds.includes(p.id));

  return (
    <section id="projects" className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/25 text-xs font-mono text-sky-600 dark:text-sky-400">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>{t("projects.badge", "Selected Works")}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              {t("projects.title", "Featured Projects & Case Studies")}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              {t("projects.subtitle", "Discover enterprise architectures, open-source utilities, and 3D web applications.")}
            </p>
          </div>

          {/* Search, View Mode & Compare Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {compareIds.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCompareOpen(true)}
                className="border-indigo-500/40 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 text-xs rounded-xl font-mono h-10 px-3.5"
              >
                <GitCompare className="w-3.5 h-3.5 mr-1.5" />
                <span>{t("projects.compareButton", "Compare Architecture")} ({compareIds.length}/2)</span>
              </Button>
            )}

            {/* Grid / List Switcher */}
            <div className="inline-flex items-center p-1 rounded-xl bg-card border border-border">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("grid")}
                className={`h-8 w-8 rounded-lg ${viewMode === "grid" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground"}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("list")}
                className={`h-8 w-8 rounded-lg ${viewMode === "list" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground"}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("projects.searchPlaceholder", "Search projects or stacks...")}
                className="pl-9 h-10 bg-card border-border text-xs rounded-xl text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {categories.map((cat) => (
            <Button
              key={cat}
              type="button"
              size="sm"
              variant={selectedCategory === cat ? "default" : "outline"}
              aria-pressed={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
              className={`h-9 rounded-xl px-4 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-sky-500 to-indigo-600 font-semibold text-white shadow-md shadow-sky-500/15 hover:from-sky-400 hover:to-indigo-500"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat === "All" ? t("projects.allCategories", "All Disciplines") : cat}
            </Button>
          ))}
        </div>

        {/* Project View Display */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-3xl p-8 bg-card/40">
            <Layers className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-foreground">
              {language === "ar" ? "لم يتم العثور على مشاريع تطابق البحث" : "No projects found matching query"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "ar" ? "جرب البحث عن تقنية أخرى أو مسح الفلتر" : "Try searching for a different framework or clear the filter."}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => {
              const isSelectedForCompare = compareIds.includes(project.id);
              return (
                <TiltCard
                  key={project.id}
                  maxTilt={8}
                  className="rounded-3xl glass-panel hover:border-sky-500/40 transition-colors flex flex-col justify-between overflow-hidden relative cursor-pointer border border-border shadow-xs group"
                  onClick={() => openProjectModal(project)}
                >
                  {/* Visual Thumbnail */}
                  <div className="aspect-[16/10] bg-muted relative overflow-hidden flex items-center justify-center">
                    {project.thumbnailUrl ? (
                      <img
                        src={project.thumbnailUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-sky-500/10 via-indigo-500/10 to-card flex items-center justify-center">
                        <FolderGit2 className="w-12 h-12 text-sky-500/40" />
                      </div>
                    )}

                    {/* Featured Badge */}
                    {project.isFeatured && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-[10px] font-mono text-amber-600 dark:text-amber-300 flex items-center gap-1 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        FEATURED
                      </div>
                    )}

                    {/* Gallery indicator */}
                    {project.galleryImages && project.galleryImages.length > 0 && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1">
                        <Images className="w-3 h-3 text-cyan-400" />
                        <span>+{project.galleryImages.length}</span>
                      </div>
                    )}

                    {/* Compare Checkbox Button */}
                    <Button
                      type="button"
                      size="sm"
                      variant={isSelectedForCompare ? "default" : "outline"}
                      aria-pressed={isSelectedForCompare}
                      onClick={(e) => toggleCompare(project.id, e)}
                      className={`absolute bottom-3 right-3 h-8 rounded-xl px-2.5 text-[10px] font-mono backdrop-blur-md transition-all ${
                        isSelectedForCompare
                          ? "border-indigo-400 bg-indigo-600 font-bold text-white hover:bg-indigo-500"
                          : "border-border bg-card/85 text-foreground hover:bg-card"
                      }`}
                      title="Compare with another architecture"
                    >
                      {isSelectedForCompare ? <Check className="w-3 h-3 mr-1" /> : <GitCompare className="w-3 h-3 mr-1" />}
                      Compare
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 uppercase tracking-wider font-semibold">
                          {project.category || "Full-Stack"}
                        </span>
                        {project.client && (
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {project.client}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-sky-500 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {project.shortDescription || project.description || "High-performance software project."}
                      </p>
                    </div>

                    {/* Tech stack tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {((project.techStack as string[]) || []).slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-secondary border border-border text-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                      {((project.techStack as string[]) || []).length > 4 && (
                        <span className="text-[10px] font-mono text-muted-foreground self-center">
                          +{((project.techStack as string[]) || []).length - 4}
                        </span>
                      )}
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-sky-600 dark:text-sky-400 flex items-center gap-1 font-semibold">
                        <Eye className="w-3.5 h-3.5" />
                        {t("projects.caseStudy", "Case Study")}
                      </span>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Source Code"
                          >
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full">
                              <Code2 className="w-4 h-4" />
                            </Button>
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Live Demo"
                          >
                            <Button size="icon" className="h-8 w-8 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-xs">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filtered.map((project) => {
              const isSelectedForCompare = compareIds.includes(project.id);
              return (
                <div
                  key={project.id}
                  onClick={() => openProjectModal(project)}
                  className="rounded-2xl bg-card border border-border hover:border-sky-500/40 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all cursor-pointer group shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 min-w-0 flex-1">
                    <div className="w-full sm:w-36 h-24 rounded-xl overflow-hidden bg-muted shrink-0 relative">
                      {project.thumbnailUrl ? (
                        <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                          <FolderGit2 className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      {project.isFeatured && (
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500/90 text-black font-bold">
                          ★
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-sky-500 uppercase font-semibold">
                          {project.category || "General"}
                        </span>
                        {project.client && (
                          <span className="text-[10px] text-muted-foreground">• {project.client}</span>
                        )}
                      </div>
                      <h3 className="font-bold text-base text-foreground group-hover:text-sky-500 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 max-w-2xl">
                        {project.shortDescription || project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {((project.techStack as string[]) || []).slice(0, 5).map((tech) => (
                          <span key={tech} className="px-2 py-0.5 rounded text-[10px] font-mono bg-secondary border border-border text-foreground">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center" onClick={(e) => e.stopPropagation()}>
                    <Button
                      type="button"
                      size="sm"
                      variant={isSelectedForCompare ? "default" : "outline"}
                      onClick={(e) => toggleCompare(project.id, e)}
                      className={`h-9 rounded-xl px-3 text-xs font-mono ${
                        isSelectedForCompare ? "bg-indigo-600 text-white" : "border-border text-foreground"
                      }`}
                    >
                      {isSelectedForCompare ? <Check className="w-3.5 h-3.5 mr-1" /> : <GitCompare className="w-3.5 h-3.5 mr-1" />}
                      Compare
                    </Button>
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground">
                          <Code2 className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="icon" className="h-9 w-9 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Case Study Detail Modal */}
      <Dialog open={!!activeProject} onOpenChange={(open) => !open && setActiveProject(null)}>
        <DialogContent className="bg-card/95 border-border backdrop-blur-xl max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
          {activeProject && (
            <div className="space-y-6">
              <DialogHeader className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-sky-600 dark:text-sky-400">
                  <Badge variant="outline" className="text-[10px] border-sky-500/30 text-sky-500 bg-sky-500/10">
                    {activeProject.category || "CASE STUDY"}
                  </Badge>
                  {activeProject.client && <span>• Client: {activeProject.client}</span>}
                  {activeProject.isFeatured && (
                    <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-500 bg-amber-500/10">
                      ★ FEATURED
                    </Badge>
                  )}
                </div>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">
                  {activeProject.title}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {activeProject.shortDescription}
                </DialogDescription>
              </DialogHeader>

              {/* Media Visual Showcase */}
              {(() => {
                const allImages = [
                  ...(activeProject.thumbnailUrl ? [activeProject.thumbnailUrl] : []),
                  ...((activeProject.galleryImages as string[]) || []),
                ];
                const currentImg = allImages[activeImageIndex] || activeProject.thumbnailUrl;

                return (
                  <div className="space-y-3">
                    {currentImg && (
                      <div className="aspect-video rounded-2xl overflow-hidden border border-border bg-black/40">
                        <img src={currentImg} alt={activeProject.title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Image thumbnails row */}
                    {allImages.length > 1 && (
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {allImages.map((img, idx) => (
                          <button
                            key={img + idx}
                            type="button"
                            onClick={() => setActiveImageIndex(idx)}
                            className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                              activeImageIndex === idx ? "border-sky-500 scale-105" : "border-border/60 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-sky-500" />
                  Architecture Overview & Highlights
                </h4>
                <div className="p-4 sm:p-5 rounded-2xl bg-secondary/60 border border-border text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-sans">
                  {activeProject.description || "Detailed case study description."}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  Complete Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {((activeProject.techStack as string[]) || []).map((tech: string) => (
                    <Badge key={tech} className="bg-secondary border border-border text-foreground text-xs font-mono py-1 px-2.5">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex gap-2.5">
                  {activeProject.liveUrl && (
                    <a href={activeProject.liveUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="h-9 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-xs">
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                        {t("projects.liveDemo", "Live Production")}
                      </Button>
                    </a>
                  )}
                  {activeProject.githubUrl && (
                    <a href={activeProject.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl text-xs border-border">
                        <Code2 className="w-3.5 h-3.5 mr-1.5" />
                        {t("projects.viewCode", "Source Code")}
                      </Button>
                    </a>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => setActiveProject(null)} className="h-9 rounded-xl text-xs">
                  {t("projects.closeModal", "Close")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Project Comparison Modal */}
      <Dialog open={isCompareOpen} onOpenChange={setIsCompareOpen}>
        <DialogContent className="bg-card/95 border-border backdrop-blur-xl max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-indigo-500" />
              {t("projects.compareButton", "Architecture Comparison Matrix")}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Direct technical evaluation between selected project architectures
            </DialogDescription>
          </DialogHeader>

          {comparedProjects.length < 2 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Please select at least 2 projects using the &quot;Compare&quot; button on project cards.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              {comparedProjects.slice(0, 2).map((p) => (
                <div key={p.id} className="p-5 rounded-2xl bg-secondary/60 border border-border space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 uppercase font-semibold">{p.category}</span>
                    <h3 className="font-bold text-sm text-foreground mt-0.5">{p.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.shortDescription}</p>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-border/50 text-xs">
                    <span className="text-muted-foreground font-semibold block">Client / Domain:</span>
                    <span className="text-foreground">{p.client || "Enterprise"}</span>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-border/50 text-xs">
                    <span className="text-muted-foreground font-semibold block">Tech Stack:</span>
                    <div className="flex flex-wrap gap-1">
                      {((p.techStack as string[]) || []).map((tech: string) => (
                        <span key={tech} className="px-2 py-0.5 rounded text-[10px] bg-card text-foreground font-mono border border-border">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-border/50 text-xs">
                    <span className="text-muted-foreground font-semibold block">Production URL:</span>
                    {p.liveUrl ? (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-mono text-[11px]">
                        {p.liveUrl} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground font-mono text-[11px]">Private Network</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
