"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { certificationSchema, type CertificationFormData } from "@/lib/validations";
import { createCertification, updateCertification } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Star } from "lucide-react";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function CertificationForm({ initialData, isEditing = false }: { initialData?: Partial<CertificationFormData> & { id?: string }; isEditing?: boolean }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      name: initialData?.name || "",
      issuer: initialData?.issuer || "",
      credentialId: initialData?.credentialId || "",
      credentialUrl: initialData?.credentialUrl || "",
      issueDate: initialData?.issueDate ? new Date(initialData.issueDate).toISOString().split("T")[0] : "",
      expiryDate: initialData?.expiryDate ? new Date(initialData.expiryDate).toISOString().split("T")[0] : "",
      isFeatured: initialData?.isFeatured || false,
      status: initialData?.status || "published",
    },
  });

  const onSubmit = async (data: CertificationFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing && initialData?.id) {
        const res = await updateCertification(initialData.id, data);
        if (res.success) {
          toast.success("Certification updated");
          router.push("/admin/certifications");
          router.refresh();
        } else {
          toast.error("Failed to update", { description: res.error });
        }
      } else {
        const res = await createCertification(data);
        if (res.success) {
          toast.success("Certification added");
          router.push("/admin/certifications");
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
        <Link href="/admin/certifications">
          <Button variant="ghost" size="sm" type="button" className="text-xs text-muted-foreground">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Certifications
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs px-6"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isEditing ? "Update Credential" : "Save Credential"}
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Certification Name *</Label>
              <Input placeholder="e.g. AWS Certified Solutions Architect - Professional" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Issuing Authority *</Label>
              <Input placeholder="e.g. Amazon Web Services, Linux Foundation" {...register("issuer")} />
              {errors.issuer && <p className="text-xs text-destructive">{errors.issuer.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Credential ID / License Number</Label>
              <Input placeholder="e.g. AWS-PSA-948218" {...register("credentialId")} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Verification URL</Label>
              <Input placeholder="https://www.credly.com/badges/..." {...register("credentialUrl")} />
              {errors.credentialUrl && <p className="text-xs text-destructive">{errors.credentialUrl.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Issue Date</Label>
              <Input type="date" {...register("issueDate")} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Expiry Date</Label>
              <Input type="date" {...register("expiryDate")} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
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

            <div className="flex items-center gap-3 pt-6">
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
                <Label className="text-xs font-medium text-zinc-300">Featured Credential</Label>
                <p className="text-[11px] text-muted-foreground">Highlight prominently on portfolio</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
