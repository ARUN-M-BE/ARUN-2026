"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { upsertSeoMetadata } from "@/lib/actions";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import type { SeoMetadata } from "@/types";

export function SeoClient({ initialMetadata }: { initialMetadata: SeoMetadata[] }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const homeSeo = initialMetadata.find((m) => m.page === "home");

  const [title, setTitle] = useState(homeSeo?.title || "Full-Stack Architect & 3D Web Creative Developer");
  const [description, setDescription] = useState(
    homeSeo?.description ||
      "Interactive 3D developer portfolio showcasing high-performance web architecture, WebGL experiences, and cloud microservices."
  );
  const [keywords, setKeywords] = useState(
    Array.isArray(homeSeo?.keywords) ? homeSeo.keywords.join(", ") : "React Three Fiber, Next.js, TypeScript, PostgreSQL, 3D Web"
  );
  const [ogImage, setOgImage] = useState(homeSeo?.ogImage || "");
  const [canonicalUrl, setCanonicalUrl] = useState(homeSeo?.canonicalUrl || "");
  const [noIndex, setNoIndex] = useState(homeSeo?.noIndex || false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const kwArray = keywords.split(",").map((k: string) => k.trim()).filter(Boolean);
      const res = await upsertSeoMetadata({
        page: "home",
        title,
        description,
        keywords: kwArray,
        ogImage: ogImage || undefined,
        canonicalUrl: canonicalUrl || undefined,
        noIndex,
      });

      if (res.success) {
        toast.success("SEO Metadata updated", {
          description: "Search engine tags and social sharing cards refreshed.",
        });
        router.refresh();
      } else {
        toast.error("Failed to update SEO", { description: res.error });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs px-6"
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save SEO Meta
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-zinc-300">Meta Title Tag (Home)</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            <p className="text-[11px] text-muted-foreground">{title.length} characters (ideal: 50-60)</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-zinc-300">Meta Description</Label>
            <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            <p className="text-[11px] text-muted-foreground">{description.length} characters (ideal: 120-160)</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-zinc-300">Target Keywords (comma separated)</Label>
            <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Open Graph Social Image URL</Label>
              <Input placeholder="https://domain.com/og-image.jpg" value={ogImage} onChange={(e) => setOgImage(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Canonical URL</Label>
              <Input placeholder="https://domain.com" value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <Label className="text-xs font-medium text-zinc-300">Robots No-Index</Label>
              <p className="text-[11px] text-muted-foreground">Disallow search engines from indexing the portfolio</p>
            </div>
            <Switch checked={noIndex} onCheckedChange={setNoIndex} />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
