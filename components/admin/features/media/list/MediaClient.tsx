"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { createMediaAsset, deleteMediaAsset } from "@/lib/actions";
import { Plus, Trash2, Image, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { MediaAsset } from "@/types";

export function MediaClient({ initialData }: { initialData: MediaAsset[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialData);
  const [isOpen, setIsOpen] = useState(false);
  const [filename, setFilename] = useState("");
  const [url, setUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [copyright, setCopyright] = useState("© 2026 Developer Portfolio. All Rights Reserved.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filename || !url) return;
    setIsSubmitting(true);
    try {
      const res = await createMediaAsset({
        filename,
        originalFilename: filename,
        mimeType: "image/webp",
        size: 102400,
        url,
        altText,
        copyright,
        folder: "general",
      });

      if (res.success && res.data) {
        toast.success("Media asset registered");
        setItems((prev) => [res.data as MediaAsset, ...prev]);
        setFilename("");
        setUrl("");
        setAltText("");
        setIsOpen(false);
        router.refresh();
      } else {
        toast.error("Failed to register media", { description: res.error });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await deleteMediaAsset(deleteId);
      if (res.success) {
        toast.success("Media asset removed");
        setItems((prev) => prev.filter((i) => i.id !== deleteId));
        setDeleteId(null);
        router.refresh();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const copyUrl = (assetUrl: string) => {
    navigator.clipboard.writeText(assetUrl);
    toast.success("URL copied to clipboard");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => setIsOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Register Media Asset
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No media assets recorded"
          description="Register image URLs, project banners, or 3D textures with copyright attribution."
          icon={<Image className="w-6 h-6" />}
        >
          <Button size="sm" onClick={() => setIsOpen(true)} className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs">
            Add Asset
          </Button>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group rounded-xl border border-border bg-card overflow-hidden hover:border-cyan-500/30 transition-all flex flex-col justify-between"
            >
              <div className="aspect-video bg-zinc-900 relative flex items-center justify-center overflow-hidden">
                <img
                  src={item.url}
                  alt={item.altText || item.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to placeholder icon
                    e.currentTarget.style.display = "none";
                  }}
                />
                <Image className="w-8 h-8 text-zinc-700" />
              </div>

              <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-medium text-xs text-white truncate" title={item.filename}>
                    {item.filename}
                  </h4>
                  <p className="text-[10px] text-muted-foreground truncate" title={item.altText ?? undefined}>
                    Alt: {item.altText || "No accessible description"}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono truncate" title={item.copyright ?? undefined}>
                    {item.copyright || "All Rights Reserved"}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyUrl(item.url)}
                    className="h-7 text-[10px] px-2 text-cyan-400 hover:text-cyan-300"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy URL
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(item.id)}
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-white">Register Media Asset</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAsset} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-zinc-300">Asset Label / Filename *</Label>
              <Input
                placeholder="e.g. hero-geometry-texture.webp"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-zinc-300">Public Asset URL *</Label>
              <Input
                placeholder="https://images.unsplash.com/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-zinc-300">WCAG Alt Text Description</Label>
              <Input
                placeholder="Detailed description for screen readers"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-zinc-300">Copyright & License Notice</Label>
              <Input
                value={copyright}
                onChange={(e) => setCopyright(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="text-xs border-border">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs">
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                Register Asset
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete Media Record?"
      />
    </div>
  );
}
