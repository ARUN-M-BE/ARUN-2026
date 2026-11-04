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
import { createNavigation, deleteNavigation } from "@/lib/actions";
import { Plus, Trash2, Navigation, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function NavigationClient({ initialData }: { initialData: any[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialData);
  const [isOpen, setIsOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [href, setHref] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !href) return;
    setIsSubmitting(true);
    try {
      const res = await createNavigation({
        label,
        href,
        sortOrder: Number(sortOrder),
        isActive: true,
        group: "main",
      });

      if (res.success && res.data) {
        toast.success("Navigation item added");
        setItems((prev) => [...prev, res.data]);
        setLabel("");
        setHref("");
        setIsOpen(false);
        router.refresh();
      } else {
        toast.error("Failed", { description: res.error });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await deleteNavigation(deleteId);
      if (res.success) {
        toast.success("Navigation item removed");
        setItems((prev) => prev.filter((i) => i.id !== deleteId));
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
          Add Nav Item
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No navigation items"
          description="Create your first navigation target."
          icon={<Navigation className="w-6 h-6" />}
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground">Label</TableHead>
                <TableHead className="text-xs text-muted-foreground">Target Link / Anchor</TableHead>
                <TableHead className="text-xs text-muted-foreground">Sort Order</TableHead>
                <TableHead className="text-xs text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="border-border hover:bg-white/5 transition-colors">
                  <TableCell className="py-3 font-semibold text-xs text-white">
                    {item.label}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-cyan-400 font-mono">
                    {item.href}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground font-mono">
                    {item.sortOrder}
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(item.id)}
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
            <DialogTitle className="text-white">Add Navigation Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-zinc-300">Display Label *</Label>
              <Input
                placeholder="e.g. Projects, Skills, Timeline, Contact"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-zinc-300">Target Anchor or URL *</Label>
              <Input
                placeholder="e.g. #projects, #skills, #experience, #contact"
                value={href}
                onChange={(e) => setHref(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-zinc-300">Sort Order</Label>
              <Input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="text-xs border-border">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs">
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                Add Item
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
        title="Remove Navigation Item?"
      />
    </div>
  );
}
