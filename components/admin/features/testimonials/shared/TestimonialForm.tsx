"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { testimonialSchema, type TestimonialFormData } from "@/lib/validations";
import { createTestimonial, updateTestimonial } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Loader2, ArrowLeft, Save, Star, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function TestimonialForm({ initialData, isEditing = false }: { initialData?: any; isEditing?: boolean }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: initialData?.name || "",
      title: initialData?.title || "",
      company: initialData?.company || "",
      content: initialData?.content || "",
      avatar: initialData?.avatar || "",
      rating: initialData?.rating || 5,
      isFeatured: initialData?.isFeatured || false,
      isVerified: initialData?.isVerified || true,
      status: initialData?.status || "published",
    },
  });

  const onSubmit = async (data: TestimonialFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        const res = await updateTestimonial(initialData.id, data);
        if (res.success) {
          toast.success("Testimonial updated");
          router.push("/admin/testimonials");
          router.refresh();
        } else {
          toast.error("Failed to update", { description: res.error });
        }
      } else {
        const res = await createTestimonial(data);
        if (res.success) {
          toast.success("Testimonial added");
          router.push("/admin/testimonials");
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
        <Link href="/admin/testimonials">
          <Button variant="ghost" size="sm" type="button" className="text-xs text-muted-foreground">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Testimonials
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs px-6"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isEditing ? "Update Testimonial" : "Save Testimonial"}
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Author Name *</Label>
              <Input placeholder="e.g. Sarah Jenkins" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Role / Title</Label>
              <Input placeholder="e.g. VP of Engineering" {...register("title")} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Company / Organization</Label>
              <Input placeholder="e.g. Nexus Tech Labs" {...register("company")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-zinc-300">Testimonial Content *</Label>
            <Textarea rows={5} placeholder="Quote regarding technical delivery, collaboration, and results..." {...register("content")} />
            {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Avatar Image URL</Label>
              <Input placeholder="https://images.unsplash.com/..." {...register("avatar")} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Rating (1 to 5 Stars)</Label>
              <Input type="number" min={1} max={5} {...register("rating")} />
            </div>
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

            <div className="flex items-center gap-2.5 pt-6">
              <Toggle
                pressed={watch("isVerified")}
                onPressedChange={(checked) => setValue("isVerified", checked)}
                variant="emerald"
                size="sm"
                className="font-mono text-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                {watch("isVerified") ? "Verified" : "Unverified"}
              </Toggle>
              <div>
                <Label className="text-xs font-medium text-zinc-300">Verified Claim</Label>
                <p className="text-[11px] text-muted-foreground">Authentic claim compliance</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-6">
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
              <div>
                <Label className="text-xs font-medium text-zinc-300">Featured</Label>
                <p className="text-[11px] text-muted-foreground">Show in hero carousel</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
