"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { educationSchema, type EducationFormData } from "@/lib/validations";
import { createEducation, updateEducation } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function EducationForm({ initialData, isEditing = false }: { initialData?: any; isEditing?: boolean }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: initialData?.institution || "",
      degree: initialData?.degree || "",
      field: initialData?.field || "",
      location: initialData?.location || "",
      description: initialData?.description || "",
      grade: initialData?.grade || "",
      startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split("T")[0] : "",
      endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split("T")[0] : "",
      isCurrent: initialData?.isCurrent || false,
      status: initialData?.status || "published",
    },
  });

  const onSubmit = async (data: EducationFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        const res = await updateEducation(initialData.id, data);
        if (res.success) {
          toast.success("Education record updated");
          router.push("/admin/education");
          router.refresh();
        } else {
          toast.error("Failed to update", { description: res.error });
        }
      } else {
        const res = await createEducation(data);
        if (res.success) {
          toast.success("Education record added");
          router.push("/admin/education");
          router.refresh();
        } else {
          toast.error("Failed to add", { description: res.error });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link href="/admin/education">
          <Button variant="ghost" size="sm" type="button" className="text-xs text-muted-foreground">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Education
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs px-6"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isEditing ? "Update Education" : "Save Record"}
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">University / Institution *</Label>
              <Input placeholder="e.g. Stanford University, IIT Delhi" {...register("institution")} />
              {errors.institution && <p className="text-xs text-destructive">{errors.institution.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Degree / Qualification *</Label>
              <Input placeholder="e.g. Bachelor of Technology, Master of Science" {...register("degree")} />
              {errors.degree && <p className="text-xs text-destructive">{errors.degree.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Major / Field of Study</Label>
              <Input placeholder="e.g. Computer Science & Software Engineering" {...register("field")} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Location</Label>
              <Input placeholder="e.g. Cambridge, MA" {...register("location")} />
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

            <div className="flex items-center gap-2.5 pt-6">
              <Toggle
                pressed={watch("isCurrent")}
                onPressedChange={(checked) => setValue("isCurrent", checked)}
                variant="sky"
                size="sm"
                className="font-mono text-xs"
              >
                {watch("isCurrent") ? "● Enrolled" : "Graduated"}
              </Toggle>
              <Label className="text-xs font-medium text-zinc-300">Currently Studying</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-zinc-300">Description / Honors & Awards</Label>
            <Textarea rows={4} placeholder="Notable coursework, honors, thesis topic..." {...register("description")} />
          </div>

          <div className="space-y-2 pt-2">
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
        </CardContent>
      </Card>
    </form>
  );
}
