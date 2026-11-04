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
import { Switch } from "@/components/ui/switch";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

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
      thumbnail: initialData?.thumbnail || "",
      images: initialData?.images || [],
      liveUrl: initialData?.liveUrl || "",
      githubUrl: initialData?.githubUrl || "",
      techStack: initialData?.techStack || [],
      category: initialData?.category || "Full-Stack Web",
      client: initialData?.client || "",
      isFeatured: initialData?.isFeatured || false,
      sortOrder: initialData?.sortOrder || 0,
      status: initialData?.status || "published",
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    // Parse comma separated techStack
    const techArray = techInput
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);
    data.techStack = techArray;

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
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs px-6"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isEditing ? "Update Project" : "Publish Project"}
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Project Title *</Label>
              <Input
                placeholder="e.g. Neural Cloud Engine"
                {...register("title", {
                  onChange: (e) => {
                    if (!isEditing) setValue("slug", generateSlug(e.target.value));
                  },
                })}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">URL Slug *</Label>
              <Input placeholder="e.g. neural-cloud-engine" {...register("slug")} />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Category</Label>
              <Input placeholder="e.g. Distributed Systems / 3D Graphics" {...register("category")} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Client / Organization</Label>
              <Input placeholder="e.g. Acme Corp / Open-Source" {...register("client")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-zinc-300">Short Summary</Label>
            <Input placeholder="One-line summary for project cards" {...register("shortDescription")} />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-zinc-300">Full Description / Case Study</Label>
            <Textarea rows={6} placeholder="Detailed case study, problem statement, architecture decisions..." {...register("description")} />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-zinc-300">Tech Stack (comma separated)</Label>
            <Input
              placeholder="Next.js, Three.js, PostgreSQL, Docker, AWS"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Live Production URL</Label>
              <Input placeholder="https://app.example.com" {...register("liveUrl")} />
              {errors.liveUrl && <p className="text-xs text-destructive">{errors.liveUrl.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Source Repository (GitHub)</Label>
              <Input placeholder="https://github.com/username/project" {...register("githubUrl")} />
              {errors.githubUrl && <p className="text-xs text-destructive">{errors.githubUrl.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-zinc-300">Thumbnail Image URL</Label>
            <Input placeholder="https://images.unsplash.com/..." {...register("thumbnail")} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(val: any) => setValue("status", val)}
              >
                <SelectTrigger className="bg-background/50 border-border">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="unpublished">Unpublished</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Sort Order</Label>
              <Input type="number" {...register("sortOrder")} />
            </div>

            <div className="flex items-center justify-between pt-6">
              <div>
                <Label className="text-xs font-medium text-zinc-300">Featured in 3D Hero</Label>
                <p className="text-[11px] text-muted-foreground">Highlight in primary universe view</p>
              </div>
              <Switch
                checked={watch("isFeatured")}
                onCheckedChange={(checked) => setValue("isFeatured", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
