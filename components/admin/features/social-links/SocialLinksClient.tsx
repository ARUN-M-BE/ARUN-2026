"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { createSocialLink, deleteSocialLink } from "@/lib/actions";
import { Plus, Trash2, ExternalLink, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function SocialLinksClient({ initialData }: { initialData: any[] }) {
  const router = useRouter();
  const [links, setLinks] = useState(initialData);
  const [isOpen, setIsOpen] = useState(false);
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform || !url) return;
    setIsSubmitting(true);
    try {
      const res = await createSocialLink({
        platform,
        url,
        label: label || platform,
        isActive: true,
      });

      if (res.success && res.data) {
        toast.success("Social link added");
        setLinks((prev) => [...prev, res.data]);
        setPlatform("");
        setUrl("");
        setLabel("");
        setIsOpen(false);
        router.refresh();
      } else {
        toast.error("Failed to add link", { description: res.error });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await deleteSocialLink(deleteId);
      if (res.success) {
        toast.success("Social link removed");
        setLinks((prev) => prev.filter((l) => l.id !== deleteId));
        setDeleteId(null);
        router.refresh();
      }
    } finally {
      setIsDeleting(false);
    }
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
          Add Social Link
        </Button>
      </div>

      {links.length === 0 ? (
        <EmptyState
          title="No social links configured"
          description="Connect your GitHub, LinkedIn, or personal handles."
          icon={<Share2 className="w-6 h-6" />}
        >
          <Button size="sm" onClick={() => setIsOpen(true)} className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs">
            Add Handle
          </Button>
        </EmptyState>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground">Platform</TableHead>
                <TableHead className="text-xs text-muted-foreground">Label</TableHead>
                <TableHead className="text-xs text-muted-foreground">Profile URL</TableHead>
                <TableHead className="text-xs text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((link) => (
                <TableRow key={link.id} className="border-border hover:bg-white/5 transition-colors">
                  <TableCell className="py-3 font-semibold text-xs text-white">
                    {link.platform}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-zinc-300">
                    {link.label || "-"}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground font-mono truncate max-w-sm">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 inline-flex items-center gap-1">
                      {link.url}
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(link.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-white">Add Social Connection</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-zinc-300">Platform Name *</Label>
              <Input
                placeholder="e.g. GitHub, LinkedIn, Twitter, Discord"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-zinc-300">Display Label</Label>
              <Input
                placeholder="e.g. github.com/username"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-zinc-300">Profile URL *</Label>
              <Input
                placeholder="https://github.com/yourhandle"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="text-xs border-border">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs">
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                Add Connection
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
        title="Remove Social Link?"
      />
    </div>
  );
}
