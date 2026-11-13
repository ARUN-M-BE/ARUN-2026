"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Toggle, ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import {
  createNavigation,
  updateNavigation,
  deleteNavigation,
  reorderNavigation,
} from "@/lib/actions";
import {
  Plus,
  Trash2,
  Navigation,
  Loader2,
  Sparkles,
  FolderGit2,
  Cpu,
  Briefcase,
  GraduationCap,
  Activity,
  Mail,
  User,
  Compass,
  Star,
  ExternalLink,
  Globe,
  Layers,
  ArrowUp,
  ArrowDown,
  Edit2,
  Eye,
  CheckCircle2,
  Laptop,
  Smartphone,
  Sun,
  Moon,
} from "lucide-react";
import { toast } from "sonner";
import type { NavigationItem, Status } from "@/types";

const AVAILABLE_ICONS = [
  { name: "Sparkles", icon: Sparkles },
  { name: "FolderGit2", icon: FolderGit2 },
  { name: "Cpu", icon: Cpu },
  { name: "Briefcase", icon: Briefcase },
  { name: "GraduationCap", icon: GraduationCap },
  { name: "Activity", icon: Activity },
  { name: "Mail", icon: Mail },
  { name: "User", icon: User },
  { name: "Compass", icon: Compass },
  { name: "Star", icon: Star },
  { name: "Layers", icon: Layers },
  { name: "Globe", icon: Globe },
];

const COLOR_OPTIONS = [
  { value: "sky", label: "Sky Blue", bg: "bg-sky-500", text: "text-sky-400" },
  { value: "indigo", label: "Indigo", bg: "bg-indigo-500", text: "text-indigo-400" },
  { value: "violet", label: "Violet", bg: "bg-violet-500", text: "text-violet-400" },
  { value: "emerald", label: "Emerald", bg: "bg-emerald-500", text: "text-emerald-400" },
  { value: "amber", label: "Amber", bg: "bg-amber-500", text: "text-amber-400" },
  { value: "rose", label: "Rose", bg: "bg-rose-500", text: "text-rose-400" },
];

function getNavIconComponent(iconName?: string | null) {
  const match = AVAILABLE_ICONS.find((i) => i.name === iconName);
  return match ? match.icon : Navigation;
}

export function NavigationClient({ initialData }: { initialData: NavigationItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState<NavigationItem[]>(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);

  // Form states
  const [label, setLabel] = useState("");
  const [href, setHref] = useState("");
  const [icon, setIcon] = useState("Sparkles");
  const [color, setColor] = useState("sky");
  const [badge, setBadge] = useState("");
  const [style, setStyle] = useState("default");
  const [isExternal, setIsExternal] = useState(false);
  const [status, setStatus] = useState<Status>("published");
  const [isActive, setIsActive] = useState(true);

  // Action states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Preview interactive states
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [previewTheme, setPreviewTheme] = useState<"dark" | "light">("dark");

  const openCreateDialog = () => {
    setEditingItem(null);
    setLabel("");
    setHref("");
    setIcon("Sparkles");
    setColor("sky");
    setBadge("");
    setStyle("default");
    setIsExternal(false);
    setStatus("published");
    setIsActive(true);
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: NavigationItem) => {
    setEditingItem(item);
    setLabel(item.label);
    setHref(item.href);
    setIcon(item.icon || "Sparkles");
    setColor(item.color || "sky");
    setBadge(item.badge || "");
    setStyle(item.style || "default");
    setIsExternal(Boolean(item.isExternal));
    setStatus(item.status || "published");
    setIsActive(Boolean(item.isActive));
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !href.trim()) {
      toast.error("Please enter a valid label and target link");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        label: label.trim(),
        href: href.trim(),
        icon,
        color,
        badge: badge.trim() || null,
        style,
        isExternal,
        status,
        isActive,
        sortOrder: editingItem ? editingItem.sortOrder : items.length + 1,
        group: "main",
      };

      if (editingItem) {
        const res = await updateNavigation(editingItem.id, payload);
        if (res.success) {
          toast.success("Navigation item updated");
          setItems((prev) =>
            prev.map((item) => (item.id === editingItem.id ? { ...item, ...payload } : item))
          );
          setIsDialogOpen(false);
          router.refresh();
        } else {
          toast.error("Update failed", { description: res.error });
        }
      } else {
        const res = await createNavigation(payload);
        if (res.success && res.data) {
          const created = res.data;
          toast.success("Navigation item added");
          setItems((prev) => [...prev, created]);
          setIsDialogOpen(false);
          router.refresh();
        } else {
          toast.error("Failed to add", { description: res.error });
        }
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
        toast.success("Navigation item deleted");
        setItems((prev) => prev.filter((i) => i.id !== deleteId));
        setDeleteId(null);
        router.refresh();
      } else {
        toast.error("Failed to delete", { description: res.error });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // re-assign sortOrders
    const updated = newItems.map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
    setItems(updated);

    const orderedIds = updated.map((i) => i.id);
    await reorderNavigation(orderedIds);
    toast.success("Navbar sequence updated");
    router.refresh();
  };

  const handleQuickToggleStatus = async (item: NavigationItem) => {
    const newStatus: Status = item.status === "published" ? "draft" : "published";
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i))
    );
    await updateNavigation(item.id, { status: newStatus });
    toast.success(`Marked as ${newStatus}`);
    router.refresh();
  };

  const handleQuickToggleActive = async (item: NavigationItem) => {
    const nextActive = !item.isActive;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, isActive: nextActive } : i))
    );
    await updateNavigation(item.id, { isActive: nextActive });
    toast.success(nextActive ? "Item enabled" : "Item hidden");
    router.refresh();
  };

  // Preview filtering (published + active)
  const previewItems = items.filter((i) => i.isActive && i.status === "published");

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border shadow-xs">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Interactive Navigation Builder</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage links, styles, and visibility. Live preview is updated instantly.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={openCreateDialog}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Nav Target
          </Button>
        </div>
      </div>

      {/* Main Grid: Management Table + Live Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Navigation Items List (7 cols) */}
        <div className="xl:col-span-7 space-y-4">
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Configured Nav Links ({items.length})
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                Published: {items.filter((i) => i.status === "published" && i.isActive).length}
              </span>
            </div>

            {items.length === 0 ? (
              <EmptyState
                title="No navigation items"
                description="Add your first target anchor link to appear in the main navbar."
                icon={<Navigation className="w-6 h-6" />}
              />
            ) : (
              <div className="divide-y divide-border">
                {items.map((item, index) => {
                  const IconComp = getNavIconComponent(item.icon);
                  const isFirst = index === 0;
                  const isLast = index === items.length - 1;

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-muted/20 transition-colors"
                    >
                      {/* Left Reorder controls & Icon */}
                      <div className="flex items-center gap-2.5">
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            disabled={isFirst}
                            onClick={() => handleMove(index, "up")}
                            className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:pointer-events-none text-muted-foreground"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={isLast}
                            onClick={() => handleMove(index, "down")}
                            className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:pointer-events-none text-muted-foreground"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                          <IconComp className="w-4 h-4" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-foreground">{item.label}</span>
                            {item.badge && (
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
                                {item.badge}
                              </span>
                            )}
                            {item.isExternal && (
                              <ExternalLink className="w-2.5 h-2.5 text-muted-foreground" />
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-muted-foreground block truncate max-w-[180px] sm:max-w-xs">
                            {item.href}
                          </span>
                        </div>
                      </div>

                      {/* Right: Badges, Visibility Toggle & Actions */}
                      <div className="flex items-center gap-2">
                        {/* Status badge button */}
                        <button
                          type="button"
                          onClick={() => handleQuickToggleStatus(item)}
                          className={`text-[10px] font-medium font-mono px-2 py-0.5 rounded-full border transition-colors ${
                            item.status === "published"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                          }`}
                          title="Click to toggle Draft / Published"
                        >
                          {item.status === "published" ? "Published" : "Draft"}
                        </button>

                        {/* Active Switch */}
                        <Switch
                          checked={item.isActive}
                          onCheckedChange={() => handleQuickToggleActive(item)}
                          className="scale-75"
                          title="Toggle live visibility"
                        />

                        {/* Edit button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(item)}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          title="Edit link"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>

                        {/* Delete button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(item.id)}
                          className="h-7 w-7 text-muted-foreground hover:text-rose-400"
                          title="Delete link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Real-time Live Preview (5 cols) */}
        <div className="xl:col-span-5 space-y-4 sticky top-6">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-semibold text-foreground">Live Navbar Preview</span>
              </div>

              {/* Viewport & Theme controls */}
              <div className="flex items-center gap-1.5">
                <ToggleGroup
                  type="single"
                  value={previewDevice}
                  onValueChange={(val) => {
                    if (val === "desktop" || val === "mobile") setPreviewDevice(val);
                  }}
                  className="bg-muted/40 p-0.5 rounded-lg border border-border/50"
                >
                  <ToggleGroupItem
                    value="desktop"
                    size="icon-sm"
                    variant={previewDevice === "desktop" ? "primary" : "ghost"}
                    title="Desktop Preview"
                    aria-label="Desktop Preview"
                  >
                    <Laptop className="w-3.5 h-3.5" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="mobile"
                    size="icon-sm"
                    variant={previewDevice === "mobile" ? "primary" : "ghost"}
                    title="Mobile Preview"
                    aria-label="Mobile Preview"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </ToggleGroupItem>
                </ToggleGroup>

                <div className="w-[1px] h-3 bg-border mx-0.5" />

                <Toggle
                  pressed={previewTheme === "dark"}
                  onPressedChange={(pressed) => setPreviewTheme(pressed ? "dark" : "light")}
                  size="icon-sm"
                  variant="ghost"
                  title="Toggle Light/Dark Theme"
                >
                  {previewTheme === "dark" ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                </Toggle>
              </div>
            </div>

            {/* Simulated Frame */}
            <div
              className={`rounded-xl border transition-all p-3 overflow-hidden ${
                previewTheme === "dark" ? "bg-black/90 border-zinc-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
              }`}
            >
              <div className="text-[10px] font-mono text-muted-foreground mb-2 flex items-center justify-between">
                <span>https://arun-m.in</span>
                <span>{previewDevice.toUpperCase()} VIEWPORT</span>
              </div>

              {/* Simulated Navigation Bar */}
              <div
                className={`rounded-2xl border px-3 py-2.5 flex items-center justify-between backdrop-blur-md transition-all ${
                  previewTheme === "dark"
                    ? "bg-zinc-950/80 border-zinc-800/80 shadow-md"
                    : "bg-white/80 border-slate-200/80 shadow-md"
                }`}
              >
                {/* Brand */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs block leading-none">ARUN M</span>
                    <span className="text-[8px] font-mono text-sky-400 uppercase font-semibold">3D ARCHITECT</span>
                  </div>
                </div>

                {/* Items */}
                {previewDevice === "desktop" ? (
                  <nav className="flex items-center gap-1 overflow-x-auto max-w-[280px] no-scrollbar">
                    {previewItems.map((item) => {
                      const IconComp = getNavIconComponent(item.icon);
                      const isGlow = item.style === "glow";
                      const isPill = item.style === "pill";

                      return (
                        <span
                          key={item.id}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                            isPill
                              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                              : isGlow
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <IconComp className="w-3 h-3" />
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="text-[8px] px-1 py-0.2 rounded-full bg-sky-500/20 text-sky-400 font-mono font-bold">
                              {item.badge}
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </nav>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] px-2 py-1 rounded-md bg-muted text-muted-foreground">Menu</span>
                  </div>
                )}
              </div>

              {/* Viewport Description */}
              <div className="mt-6 p-4 rounded-xl border border-dashed border-border/50 text-center">
                <p className="text-[11px] text-muted-foreground">
                  {previewItems.length} published targets visible on live website. Draft items remain hidden.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingItem ? "Edit Navigation Link" : "Add Navigation Link"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Customize the label, destination link, icon, and display status.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-foreground">Label</Label>
                <Input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Universe"
                  required
                  className="bg-background/50 border-border"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-foreground">Target Link / Anchor</Label>
                <Input
                  value={href}
                  onChange={(e) => setHref(e.target.value)}
                  placeholder="e.g. #projects or https://..."
                  required
                  className="bg-background/50 border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-foreground">Icon</Label>
                <Select value={icon} onValueChange={setIcon}>
                  <SelectTrigger className="bg-background/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {AVAILABLE_ICONS.map((i) => {
                      const IconC = i.icon;
                      return (
                        <SelectItem key={i.name} value={i.name}>
                          <div className="flex items-center gap-2">
                            <IconC className="w-3.5 h-3.5 text-primary" />
                            <span>{i.name}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-foreground">Color Accent</Label>
                <Select value={color} onValueChange={setColor}>
                  <SelectTrigger className="bg-background/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {COLOR_OPTIONS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${c.bg}`} />
                          <span>{c.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-foreground">Optional Badge</Label>
                <Input
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. NEW or 60FPS"
                  className="bg-background/50 border-border"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-foreground">Style Variant</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="bg-background/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="default">Default Subtext</SelectItem>
                    <SelectItem value="pill">High-Contrast Pill</SelectItem>
                    <SelectItem value="glow">Neon Glow Border</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
              <div className="space-y-1.5">
                <Label className="text-xs text-foreground">Publication Status</Label>
                <Select value={status} onValueChange={(val) => setStatus(val as Status)}>
                  <SelectTrigger className="bg-background/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="published">
                      <span className="text-emerald-400">Published (Live)</span>
                    </SelectItem>
                    <SelectItem value="draft">
                      <span className="text-amber-400">Draft (Hidden)</span>
                    </SelectItem>
                    <SelectItem value="unpublished">
                      <span className="text-zinc-400">Unpublished</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between pt-6">
                <Label className="text-xs text-foreground">Active in Live Menu</Label>
                <Toggle
                  pressed={isActive}
                  onPressedChange={setIsActive}
                  variant="emerald"
                  size="sm"
                  className="font-mono text-xs"
                >
                  {isActive ? "Visible" : "Hidden"}
                </Toggle>
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
                className="border-border text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                    {editingItem ? "Update Link" : "Save Link"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete Navigation Target"
        description="Are you sure you want to remove this navigation target from your navbar?"
      />
    </div>
  );
}
