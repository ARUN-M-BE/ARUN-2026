"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { experienceSchema, type ExperienceFormData } from "@/lib/validations";
import { createExperience, updateExperience } from "@/lib/actions";
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
import type { Experience } from "@/types";

export function ExperienceForm({ initialData, isEditing = false }: { initialData?: Partial<Experience> | null; isEditing?: boolean }) {
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
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: initialData?.company || "",
      position: initialData?.position || "",
      location: initialData?.location || "",
      type: initialData?.type || "Full-time",
      description: initialData?.description || "",
      achievements: initialData?.achievements || [],
      techStack: initialData?.techStack || [],
      companyUrl: initialData?.companyUrl || "",
      startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split("T")[0] : "",
      endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split("T")[0] : "",
      isCurrent: initialData?.isCurrent || false,
      isFeatured: initialData?.isFeatured || false,
      status: initialData?.status || "published",
    },
  });

  const onSubmit = async (data: ExperienceFormData) => {
    setIsSubmitting(true);
    data.techStack = techInput.split(",").map((s: string) => s.trim()).filter(Boolean);
    try {
      if (isEditing && initialData?.id) {
        const res = await updateExperience(initialData.id, data);
        if (res.success) {
          toast.success("Experience updated");
          router.push("/admin/experience");
          router.refresh();
        } else {
          toast.error("Failed to update", { description: res.error });
        }
      } else {
        const res = await createExperience(data);
        if (res.success) {
          toast.success("Experience created");
          router.push("/admin/experience");
          router.refresh();
        } else {
          toast.error("Failed to create", { description: res.error });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link href="/admin/experience">
          <Button variant="ghost" size="sm" type="button" className="text-xs text-muted-foreground">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Experience
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs px-6"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isEditing ? "Update Milestone" : "Save Milestone"}
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Company Name *</Label>
              <Input placeholder="e.g. Stripe, Google, Freelance" {...register("company")} />
              {errors.company && <p className="text-xs text-destructive">{errors.company.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Role / Position *</Label>
              <Input placeholder="e.g. Lead Full-Stack Architect" {...register("position")} />
              {errors.position && <p className="text-xs text-destructive">{errors.position.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Location</Label>
              <Input placeholder="e.g. San Francisco, CA / Remote" {...register("location")} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Company Website</Label>
              <Input placeholder="https://company.com" {...register("companyUrl")} />
              {errors.companyUrl && <p className="text-xs text-destructive">{errors.companyUrl.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Start Date *</Label>
              <Input type="date" {...register("startDate")} />
              {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">End Date</Label>
              <Input type="date" disabled={watch("isCurrent")} {...register("endDate")} />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <Switch
                checked={watch("isCurrent")}
                onCheckedChange={(checked) => setValue("isCurrent", checked)}
              />
              <Label className="text-xs font-medium text-zinc-300">Currently Working Here</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-zinc-300">Role Description & Key Accomplishments</Label>
            <Textarea rows={5} placeholder="Describe core responsibilities and measurable impact..." {...register("description")} />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-zinc-300">Technologies Used (comma separated)</Label>
            <Input
              placeholder="TypeScript, PostgreSQL, Next.js, Kubernetes"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(val: "draft" | "published" | "unpublished") => setValue("status", val)}
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
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
