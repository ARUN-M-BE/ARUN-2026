"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import {
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  reorderSocialLinks,
} from "@/lib/actions";
import {
  Plus,
  Trash2,
  ExternalLink,
  Share2,
  Loader2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Eye,
  CheckCircle2,
  Check,
  Globe,
  Mail,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import type { SocialLink, Status } from "@/types";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const PLATFORM_PRESETS = [
  { name: "GitHub", icon: "github", color: "#ffffff", placeholder: "https://github.com/your-username", iconComp: GithubIcon },
  { name: "LinkedIn", icon: "linkedin", color: "#0a66c2", placeholder: "https://linkedin.com/in/your-profile", iconComp: LinkedinIcon },
  { name: "X (Twitter)", icon: "twitter", color: "#1da1f2", placeholder: "https://x.com/your-handle", iconComp: TwitterIcon },
  { name: "Instagram", icon: "instagram", color: "#e1306c", placeholder: "https://instagram.com/your-handle", iconComp: InstagramIcon },
  { name: "YouTube", icon: "youtube", color: "#ff0000", placeholder: "https://youtube.com/@your-channel", iconComp: YoutubeIcon },
  { name: "Facebook", icon: "facebook", color: "#1877f2", placeholder: "https://facebook.com/your-page", iconComp: FacebookIcon },
  { name: "Discord", icon: "discord", color: "#5865f2", placeholder: "https://discord.gg/your-server", iconComp: MessageCircle },
  { name: "Personal Website", icon: "globe", color: "#38bdf8", placeholder: "https://arun-m.in", iconComp: Globe },
  { name: "Email", icon: "mail", color: "#10b981", placeholder: "mailto:arun@arun-m.in", iconComp: Mail },
];

function getSocialIconComponent(iconName?: string | null) {
  switch (iconName?.toLowerCase()) {
    case "github": return GithubIcon;
    case "linkedin": return LinkedinIcon;
    case "twitter":
    case "x": return TwitterIcon;
    case "instagram": return InstagramIcon;
    case "youtube": return YoutubeIcon;
    case "facebook": return FacebookIcon;
    case "discord": return MessageCircle;
    case "mail": return Mail;
    default: return Globe;
  }
}

export function SocialLinksClient({ initialData }: { initialData: SocialLink[] }) {
  const router = useRouter();
  const [links, setLinks] = useState<SocialLink[]>(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);

  // Form states
  const [platform, setPlatform] = useState("GitHub");
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const [icon, setIcon] = useState("github");
  const [color, setColor] = useState("#ffffff");
  const [size, setSize] = useState("md");
  const [style, setStyle] = useState("default");
  const [placements, setPlacements] = useState<string[]>(["navbar", "footer", "profile", "contact"]);
  const [status, setStatus] = useState<Status>("published");
  const [isActive, setIsActive] = useState(true);

  // Action states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreateDialog = () => {
    setEditingLink(null);
    const preset = PLATFORM_PRESETS[0];
    setPlatform(preset.name);
    setUrl(preset.placeholder);
    setLabel(preset.name);
    setIcon(preset.icon);
    setColor(preset.color);
    setSize("md");
    setStyle("default");
    setPlacements(["navbar", "footer", "profile", "contact"]);
    setStatus("published");
    setIsActive(true);
    setIsDialogOpen(true);
  };

  const openEditDialog = (link: SocialLink) => {
    setEditingLink(link);
    setPlatform(link.platform);
    setUrl(link.url);
    setLabel(link.label || link.platform);
    setIcon(link.icon || "globe");
    setColor(link.color || "#38bdf8");
    setSize(link.size || "md");
    setStyle(link.style || "default");
    setPlacements(Array.isArray(link.placements) ? link.placements : ["footer", "contact"]);
    setStatus(link.status || "published");
    setIsActive(Boolean(link.isActive));
    setIsDialogOpen(true);
  };

  const handleSelectPreset = (presetName: string) => {
    const match = PLATFORM_PRESETS.find((p) => p.name === presetName);
    if (!match) return;
    setPlatform(match.name);
    setIcon(match.icon);
    setColor(match.color);
    if (!url || url.includes("your-")) {
      setUrl(match.placeholder);
    }
    if (!label || PLATFORM_PRESETS.some((p) => p.name === label)) {
      setLabel(match.name);
    }
  };

  const togglePlacement = (placeKey: string) => {
    setPlacements((prev) =>
      prev.includes(placeKey) ? prev.filter((p) => p !== placeKey) : [...prev, placeKey]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform.trim() || !url.trim()) {
      toast.error("Please enter a platform name and URL");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        platform: platform.trim(),
        url: url.trim(),
        label: label.trim() || platform.trim(),
        icon,
        color,
        size,
        style,
        placements,
        status,
        isActive,
        sortOrder: editingLink ? editingLink.sortOrder : links.length + 1,
      };

      if (editingLink) {
        const res = await updateSocialLink(editingLink.id, payload);
        if (res.success) {
          toast.success("Social link updated");
          setLinks((prev) =>
            prev.map((l) => (l.id === editingLink.id ? { ...l, ...payload } : l))
          );
          setIsDialogOpen(false);
          router.refresh();
        } else {
          toast.error("Failed to update", { description: res.error });
        }
      } else {
        const res = await createSocialLink(payload);
        if (res.success && res.data) {
          const newLink = res.data;
          toast.success("Social link added");
          setLinks((prev) => [...prev, newLink]);
          setIsDialogOpen(false);
          router.refresh();
        } else {
          toast.error("Failed to add link", { description: res.error });
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
      const res = await deleteSocialLink(deleteId);
      if (res.success) {
        toast.success("Social link deleted");
        setLinks((prev) => prev.filter((l) => l.id !== deleteId));
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
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const newLinks = [...links];
    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;

    const updated = newLinks.map((l, idx) => ({ ...l, sortOrder: idx + 1 }));
    setLinks(updated);

    const orderedIds = updated.map((l) => l.id);
    await reorderSocialLinks(orderedIds);
    toast.success("Social links order updated");
    router.refresh();
  };

  const handleQuickToggleActive = async (link: SocialLink) => {
    const nextActive = !link.isActive;
    setLinks((prev) =>
      prev.map((l) => (l.id === link.id ? { ...l, isActive: nextActive } : l))
    );
    await updateSocialLink(link.id, { isActive: nextActive });
    toast.success(nextActive ? "Account enabled" : "Account disabled");
    router.refresh();
  };

  // Preview filtering (published + active)
  const activeLinks = links.filter((l) => l.isActive && l.status !== "unpublished");

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border shadow-xs">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Social Presence & Channels</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure social channels, custom colors, and control appearance in the navbar, footer, and profile.
          </p>
        </div>
        <Button
          size="sm"
          onClick={openCreateDialog}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Social Account
        </Button>
      </div>

      {/* Grid: Management List (7 cols) + Live Previews (5 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Accounts List */}
        <div className="xl:col-span-7 space-y-4">
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Configured Channels ({links.length})
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                Active: {links.filter((l) => l.isActive).length}
              </span>
            </div>

            {links.length === 0 ? (
              <EmptyState
                title="No social links configured"
                description="Add your GitHub, LinkedIn, or personal handles to connect with visitors."
                icon={<Share2 className="w-6 h-6" />}
              />
            ) : (
              <div className="divide-y divide-border">
                {links.map((link, index) => {
                  const Icon = getSocialIconComponent(link.icon);
                  const isFirst = index === 0;
                  const isLast = index === links.length - 1;
                  const placementsList = Array.isArray(link.placements) ? link.placements : ["footer", "contact"];

                  return (
                    <div
                      key={link.id}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-muted/20 transition-colors"
                    >
                      {/* Left Reorder & Icon */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex flex-col gap-0.5 shrink-0">
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

                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-white/10 shadow-xs"
                          style={{ backgroundColor: `${link.color || "#38bdf8"}20`, color: link.color || "#38bdf8" }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-foreground truncate">{link.label || link.platform}</span>
                            <span className="text-[10px] font-mono text-muted-foreground">({link.platform})</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] font-mono text-muted-foreground truncate max-w-[160px] sm:max-w-xs block">
                              {link.url}
                            </span>
                          </div>
                          {/* Placements pills */}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {placementsList.map((p) => (
                              <span
                                key={p}
                                className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground uppercase"
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Switch & Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Switch
                          checked={link.isActive}
                          onCheckedChange={() => handleQuickToggleActive(link)}
                          className="scale-75"
                          title="Toggle account active"
                        />

                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
                          title="Open link in new tab"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(link)}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          title="Edit social link"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(link.id)}
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

        {/* Right: Real-time Live Placements Preview (5 cols) */}
        <div className="xl:col-span-5 space-y-4 sticky top-6">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-semibold text-foreground">Placements Live Preview</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">REALTIME</span>
            </div>

            {/* Preview 1: In Navbar Bar */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span>[NAVBAR PLACEMENT]</span>
                <span>Active: {activeLinks.filter((l) => (l.placements as string[] | undefined)?.includes("navbar")).length}</span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/80 border border-zinc-800">
                <span className="text-xs font-bold text-white mr-auto">ARUN M</span>
                <div className="flex items-center gap-1.5">
                  {activeLinks
                    .filter((l) => (l.placements as string[] | undefined)?.includes("navbar"))
                    .map((l) => {
                      const Icon = getSocialIconComponent(l.icon);
                      return (
                        <div
                          key={l.id}
                          className="w-6 h-6 rounded-md flex items-center justify-center transition-transform hover:scale-110"
                          style={{ backgroundColor: `${l.color || "#fff"}20`, color: l.color || "#fff" }}
                          title={l.label || l.platform}
                        >
                          <Icon className="w-3 h-3" />
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Preview 2: In Profile & Contact Card */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span>[PROFILE & CONTACT CARD PLACEMENT]</span>
                <span>Active: {activeLinks.filter((l) => (l.placements as string[] | undefined)?.includes("contact") || (l.placements as string[] | undefined)?.includes("profile")).length}</span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-xs">
                    AM
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Arun M</span>
                    <span className="text-[10px] text-zinc-400 block font-mono">Senior Architect</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800">
                  {activeLinks
                    .filter((l) => (l.placements as string[] | undefined)?.includes("contact") || (l.placements as string[] | undefined)?.includes("profile"))
                    .map((l) => {
                      const Icon = getSocialIconComponent(l.icon);
                      const isPill = l.style === "glass-pill";
                      const isNeon = l.style === "neon-glow";

                      return (
                        <div
                          key={l.id}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-medium border transition-transform ${
                            isNeon
                              ? "border-emerald-500/40 bg-emerald-500/10 shadow-xs"
                              : isPill
                              ? "rounded-full bg-white/10 backdrop-blur border-white/20"
                              : "bg-zinc-800 border-zinc-700"
                          }`}
                          style={{ color: l.color || "#fff" }}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{l.label || l.platform}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Preview 3: Footer Placement */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span>[FOOTER BAR PLACEMENT]</span>
                <span>Active: {activeLinks.filter((l) => (l.placements as string[] | undefined)?.includes("footer")).length}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/80 border border-zinc-800">
                <span className="text-[10px] text-zinc-400">© 2026 Arun M (arun-m.in)</span>
                <div className="flex items-center gap-1.5">
                  {activeLinks
                    .filter((l) => (l.placements as string[] | undefined)?.includes("footer"))
                    .map((l) => {
                      const Icon = getSocialIconComponent(l.icon);
                      return (
                        <div
                          key={l.id}
                          className="w-6 h-6 rounded-full flex items-center justify-center bg-zinc-800 border border-zinc-700 hover:scale-110 transition-transform"
                          style={{ color: l.color || "#fff" }}
                        >
                          <Icon className="w-3 h-3" />
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingLink ? "Edit Social Channel" : "Add Social Channel"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Choose a platform preset, customize colors, and assign where it appears.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            {/* Quick Presets */}
            <div className="space-y-1.5">
              <Label className="text-xs text-foreground">Quick Platform Preset</Label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {PLATFORM_PRESETS.map((p) => {
                  const Icon = p.iconComp;
                  const isSelected = platform === p.name;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => handleSelectPreset(p.name)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition-all ${
                        isSelected
                          ? "bg-primary/10 border-primary text-primary font-semibold shadow-xs"
                          : "bg-background/40 border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px] truncate max-w-full">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-foreground">Platform Display Label</Label>
                <Input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. GitHub or Arun on X"
                  required
                  className="bg-background/50 border-border"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-foreground">Target URL</Label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  required
                  className="bg-background/50 border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-foreground">Brand Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-border bg-transparent"
                  />
                  <Input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="bg-background/50 border-border font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-foreground">Icon Size</Label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger className="bg-background/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="sm">Small (16px)</SelectItem>
                    <SelectItem value="md">Medium (20px)</SelectItem>
                    <SelectItem value="lg">Large (24px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-foreground">Display Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="bg-background/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="default">Default Circle</SelectItem>
                    <SelectItem value="glass-pill">Glass Pill</SelectItem>
                    <SelectItem value="neon-glow">Neon Glow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Placements Checkboxes */}
            <div className="space-y-2 pt-2 border-t border-border">
              <Label className="text-xs text-foreground font-semibold">Where should this icon appear?</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: "navbar", label: "Navbar" },
                  { key: "footer", label: "Footer" },
                  { key: "profile", label: "Profile" },
                  { key: "contact", label: "Contact Form" },
                ].map((item) => {
                  const isChecked = placements.includes(item.key);
                  return (
                    <Toggle
                      key={item.key}
                      pressed={isChecked}
                      onPressedChange={() => togglePlacement(item.key)}
                      variant="primary"
                      size="sm"
                      className="justify-between w-full h-9 rounded-xl border"
                    >
                      <span>{item.label}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-primary" />}
                    </Toggle>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="space-y-0.5">
                <Label className="text-xs text-foreground">Account Active</Label>
                <span className="text-[10px] text-muted-foreground block">
                  Enable or disable this social channel globally
                </span>
              </div>
              <Toggle
                pressed={isActive}
                onPressedChange={setIsActive}
                variant="emerald"
                size="sm"
                className="font-mono text-xs px-3"
              >
                {isActive ? "Active (Live)" : "Disabled"}
              </Toggle>
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
                    {editingLink ? "Update Account" : "Save Account"}
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
        title="Delete Social Channel"
        description="Are you sure you want to remove this social media channel?"
      />
    </div>
  );
}
