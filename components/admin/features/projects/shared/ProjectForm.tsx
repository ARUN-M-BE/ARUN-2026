"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, type ProjectFormData } from "@/lib/validations";
import { createProject, updateProject } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Loader2, ArrowLeft, Save, Plus, Trash2, Star } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { Status } from "@/types";

interface ProjectFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function ProjectForm({ initialData, isEditing = false }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [techInput, setTechInput] = useState(
    Array.isArray(initialData?.techStack) ? initialData.techStack.join(", ") : ""
  );
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>(
    (Array.isArray(initialData?.images) && initialData.images.length > 0
      ? initialData.images
      : Array.isArray(initialData?.galleryImages)
      ? initialData.galleryImages
      : [])
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      shortDescription: initialData?.shortDescription || "",
      description: initialData?.description || "",
      thumbnail: initialData?.thumbnail || initialData?.thumbnailUrl || "",
      images: (Array.isArray(initialData?.images) && initialData.images.length > 0
        ? initialData.images
        : Array.isArray(initialData?.galleryImages)
        ? initialData.galleryImages
        : []) as string[],
      liveUrl: initialData?.liveUrl || "",
      githubUrl: initialData?.githubUrl || "",
      techStack: initialData?.techStack || [],
      category: initialData?.category || "Cloud Infrastructure",
      client: initialData?.client || "",
      isFeatured: initialData?.isFeatured || false,
      sortOrder: initialData?.sortOrder || 0,
      status: (initialData?.status as Status) || "published",
    },
  });

  const thumbnailVal = watch("thumbnail");

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleAddGalleryImage = () => {
    if (!newGalleryUrl.trim()) return;
    const updated = [...galleryImages, newGalleryUrl.trim()];
    setGalleryImages(updated);
    setValue("images", updated);
    setNewGalleryUrl("");
  };

  const handleRemoveGalleryImage = (index: number) => {
    const updated = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updated);
    setValue("images", updated);
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    const techArray = techInput
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);
    data.techStack = techArray;
    data.images = galleryImages;

    try {
      if (isEditing) {
        const res = await updateProject(initialData.id, data);
        if (res.success) {
          toast.success("Project updated successfully");
          router.push("/admin/projects");
          router.refresh();
        } else {
          toast.error("Failed to update project", { description: res.error });
        }
      } else {
        const res = await createProject(data);
        if (res.success) {
          toast.success("Project created successfully");
          router.push("/admin/projects");
          router.refresh();
        } else {
          toast.error("Failed to create project", { description: res.error });
        }
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link href="/admin/projects">
          <Button variant="ghost" size="sm" type="button" className="text-xs text-muted-foreground">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Projects
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs px-6"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isEditing ? "Update Project" : "Publish Project"}
        </Button>
      </div>

      <Card className="bg-card border-border shadow-xs">
        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-foreground">Project Title *</Label>
              <Input
                placeholder="e.g. Neural Cloud Engine"
                {...register("title", {
                  onChange: (e) => {
                    if (!isEditing) setValue("slug", generateSlug(e.target.value));
                  },
                })}
                className="bg-background/50 border-border"
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-foreground">URL Slug *</Label>
              <Input placeholder="e.g. neural-cloud-engine" {...register("slug")} className="bg-background/50 border-border font-mono text-xs" />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-foreground">Category</Label>
              <Input placeholder="e.g. Cloud Infrastructure / 3D Graphics" {...register("category")} className="bg-background/50 border-border" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-foreground">Client / Organization</Label>
              <Input placeholder="e.g. FinTech Global / Open Source" {...register("client")} className="bg-background/50 border-border" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-foreground">Short Summary (for Cards & Previews)</Label>
            <Input placeholder="One-line punchy architectural summary" {...register("shortDescription")} className="bg-background/50 border-border" />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-foreground">Full Description & Architecture Decisions</Label>
            <Textarea rows={6} placeholder="Detailed case study, problem statement, microservices architecture, metrics..." {...register("description")} className="bg-background/50 border-border text-xs leading-relaxed" />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-foreground">Tech Stack (comma separated)</Label>
            <Input
              placeholder="Next.js 16, TypeScript, Three.js, PostgreSQL, Docker, Redis, Kafka"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              className="bg-background/50 border-border font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-foreground">Live Production URL</Label>
              <Input placeholder="https://app.arun-m.in" {...register("liveUrl")} className="bg-background/50 border-border" />
              {errors.liveUrl && <p className="text-xs text-destructive">{errors.liveUrl.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-foreground">Source Repository (GitHub)</Label>
              <Input placeholder="https://github.com/arun-m/project" {...register("githubUrl")} className="bg-background/50 border-border" />
              {errors.githubUrl && <p className="text-xs text-destructive">{errors.githubUrl.message}</p>}
            </div>
          </div>

          {/* Primary Cover Thumbnail & Live Preview */}
          <div className="space-y-3 pt-4 border-t border-border">
            <Label className="text-xs font-medium text-foreground">Primary Cover Thumbnail URL</Label>
            <div className="flex gap-2">
              <Input placeholder="https://images.unsplash.com/..." {...register("thumbnail")} className="bg-background/50 border-border" />
              {thumbnailVal && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValue("thumbnail", "")}
                  className="text-xs border-border shrink-0"
                >
                  Clear
                </Button>
              )}
            </div>

            {thumbnailVal && (
              <div className="relative aspect-video max-w-sm rounded-2xl overflow-hidden border border-border bg-black/60 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumbnailVal} alt="Cover preview" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/70 text-white backdrop-blur">
                  Cover Preview
                </span>
              </div>
            )}
          </div>

          {/* Multiple Project Gallery Images */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-medium text-foreground">Project Gallery Snapshots</Label>
                <p className="text-[11px] text-muted-foreground">Add multiple screenshots or architecture diagrams</p>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">{galleryImages.length} images added</span>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="https://images.unsplash.com/... or /projects/screenshot-1.jpg"
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                className="bg-background/50 border-border text-xs"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleAddGalleryImage}
                className="bg-secondary text-foreground hover:bg-secondary/80 text-xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add to Gallery
              </Button>
            </div>

            {galleryImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {galleryImages.map((imgUrl, i) => (
                  <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-border group bg-black/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imgUrl} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(i)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/80 text-white hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status, Order & Featured */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-foreground">Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(val) => setValue("status", val as Status)}
              >
                <SelectTrigger className="bg-background/50 border-border">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="published">
                    <span className="text-emerald-400">● Published (Live)</span>
                  </SelectItem>
                  <SelectItem value="draft">
                    <span className="text-amber-400">▲ Draft (Hidden)</span>
                  </SelectItem>
                  <SelectItem value="unpublished">
                    <span className="text-zinc-400">■ Unpublished</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-foreground">Sort Order</Label>
              <Input type="number" {...register("sortOrder", { valueAsNumber: true })} className="bg-background/50 border-border" />
            </div>

            <div className="flex items-center justify-between pt-6">
              <div>
                <Label className="text-xs font-medium text-foreground">Featured Project</Label>
                <p className="text-[11px] text-muted-foreground">Highlight prominently on portfolio home</p>
              </div>
              <Toggle
                pressed={watch("isFeatured")}
                onPressedChange={(checked) => setValue("isFeatured", checked)}
                variant="amber"
                size="sm"
                className="font-mono text-xs"
              >
                <Star className="w-3.5 h-3.5 mr-1" />
                {watch("isFeatured") ? "Featured" : "Standard"}
              </Toggle>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
