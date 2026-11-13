"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema, type ServiceFormData } from "@/lib/validations";
import { createService, updateService } from "@/lib/actions";
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

export function ServiceForm({ initialData, isEditing = false }: { initialData?: Partial<ServiceFormData> & { id?: string }; isEditing?: boolean }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      shortDescription: initialData?.shortDescription || "",
      description: initialData?.description || "",
      price: initialData?.price || "",
      isFeatured: initialData?.isFeatured || false,
      status: initialData?.status || "published",
    },
  });

  const onSubmit = async (data: ServiceFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing && initialData?.id) {
        const res = await updateService(initialData.id, data);
        if (res.success) {
          toast.success("Service updated");
          router.push("/admin/services");
          router.refresh();
        } else {
          toast.error("Failed to update", { description: res.error });
        }
      } else {
        const res = await createService(data);
        if (res.success) {
          toast.success("Service created");
          router.push("/admin/services");
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
        <Link href="/admin/services">
          <Button variant="ghost" size="sm" type="button" className="text-xs text-muted-foreground">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Services
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs px-6"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isEditing ? "Update Service" : "Publish Service"}
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Service Title *</Label>
              <Input
                placeholder="e.g. Full-Stack System Architecture"
                {...register("title", {
                  onChange: (e) => {
                    if (!isEditing) {
                      setValue(
                        "slug",
                        e.target.value.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
                      );
                    }
                  },
                })}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Slug *</Label>
              <Input placeholder="e.g. system-architecture" {...register("slug")} />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Pricing / Engagement Model</Label>
              <Input placeholder="e.g. Starting from $5,000 / Retainer" {...register("price")} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(val: "published" | "draft" | "unpublished") => setValue("status", val)}
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

          <div className="space-y-2">
            <Label className="text-xs font-medium text-zinc-300">Summary</Label>
            <Input placeholder="Short highlight for service cards" {...register("shortDescription")} />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-zinc-300">Detailed Scope & Deliverables</Label>
            <Textarea rows={5} placeholder="What is included, deliverables, timeline..." {...register("description")} />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <Label className="text-xs font-medium text-zinc-300">Featured Service Offering</Label>
              <p className="text-[11px] text-muted-foreground">Highlight this offering on the portfolio services grid</p>
            </div>
            <Toggle
              size="sm"
              variant={watch("isFeatured") ? "primary" : "outline"}
              pressed={Boolean(watch("isFeatured"))}
              onPressedChange={(pressed) => setValue("isFeatured", pressed)}
              className="h-8 text-xs font-mono"
            >
              {watch("isFeatured") ? "★ Featured" : "Standard"}
            </Toggle>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
