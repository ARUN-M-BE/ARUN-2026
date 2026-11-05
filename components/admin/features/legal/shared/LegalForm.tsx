"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { legalDocumentSchema, type LegalDocumentFormData } from "@/lib/validations";
import { updateLegalDocument } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, ArrowLeft, Save, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function LegalForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(legalDocumentSchema),
    defaultValues: {
      type: initialData?.type || "privacy-policy",
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      content: initialData?.content || "",
      version: initialData?.version || "1.0",
      effectiveDate: initialData?.effectiveDate
        ? new Date(initialData.effectiveDate).toISOString().split("T")[0]
        : "",
      isReviewRequired: initialData?.isReviewRequired ?? true,
      status: initialData?.status || "published",
    },
  });

  const onSubmit = async (data: LegalDocumentFormData) => {
    setIsSubmitting(true);
    try {
      const res = await updateLegalDocument(initialData.id, data);
      if (res.success) {
        toast.success("Legal document updated & version recorded in audit trail");
        router.push("/admin/legal");
        router.refresh();
      } else {
        toast.error("Failed to update", { description: res.error });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link href="/admin/legal">
          <Button variant="ghost" size="sm" type="button" className="text-xs text-muted-foreground">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Legal
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs px-6"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save & Bump Version
        </Button>
      </div>

      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
        <div>
          <p className="font-semibold text-white">Statutory Draft Notice (DPDP Act 2023 & IT Act 2000)</p>
          <p className="mt-0.5 text-amber-200/80">
            This document serves as an editable statutory draft. Always verify legal terms, grievance officer details, and data retention windows with qualified legal counsel. This application does not issue legal certification.
          </p>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Document Title *</Label>
              <Input placeholder="e.g. Privacy Policy" {...register("title")} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Slug *</Label>
              <Input placeholder="e.g. privacy-policy" {...register("slug")} />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Version Number *</Label>
              <Input placeholder="e.g. 1.1" {...register("version")} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Effective Date</Label>
              <Input type="date" {...register("effectiveDate")} />
            </div>

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
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-zinc-300">Markdown Content *</Label>
            <Textarea
              rows={15}
              className="font-mono text-xs leading-relaxed"
              placeholder="# Privacy Policy..."
              {...register("content")}
            />
            {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Switch
              checked={watch("isReviewRequired")}
              onCheckedChange={(checked) => setValue("isReviewRequired", checked)}
            />
            <div>
              <Label className="text-xs font-medium text-zinc-300">Legal Review Required Banner</Label>
              <p className="text-[11px] text-muted-foreground">
                Displays prominent disclaimer informing visitors that this document is in draft review
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
