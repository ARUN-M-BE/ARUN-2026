"use client";

import { useState, useTransition, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Check,
  ExternalLink,
  Eye,
  Loader2,
  Monitor,
  RotateCcw,
  Save,
  Smartphone,
  Sparkles,
  Undo2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UniverseTiles } from "@/components/theme/theme-studio";
import {
  publishDesignTheme,
  rollbackDesignTheme,
  savePaletteTheme,
  setDesignViewerToggle,
  setPalettePickerEnabled,
} from "@/lib/design-actions";
import type { ContrastCheck } from "@/lib/colors";
import type { ColorMode, ThemeId } from "@/config/themes";
import type { DesignId, DesignStatus } from "@/config/designs";

export interface AppearanceDesign {
  id: DesignId;
  name: string;
  tagline: string;
  description: string;
  version: string;
  features: string[];
  traits: Record<string, string>;
  swatches: [string, string, string];
  implemented: boolean;
  status: DesignStatus;
  vars: Record<string, string>;
}

interface AppearanceClientProps {
  designs: AppearanceDesign[];
  publishedId: DesignId;
  selectedId: DesignId;
  canRollback: boolean;
  previousName: string | null;
  paletteId: ThemeId;
  paletteMode: ColorMode;
  pickerEnabled: boolean;
  viewerToggle: boolean;
  contrast: ContrastCheck[];
  contentSummary: { label: string; count: number }[];
}

const STATUS_TONE: Record<DesignStatus, string> = {
  published: "border-emerald-500/40 bg-emerald-500/10 text-emerald-500",
  selected: "border-primary/40 bg-primary/10 text-primary",
  preview: "border-amber-500/40 bg-amber-500/10 text-amber-500",
  draft: "border-border bg-muted/60 text-muted-foreground",
};

function Panel({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card/60">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border/70 px-5 py-4">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-foreground">{title}</h2>
          {description && (
            <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function AppearanceClient({
  designs,
  publishedId,
  selectedId,
  canRollback,
  previousName,
  paletteId,
  paletteMode,
  pickerEnabled,
  viewerToggle,
  contrast,
  contentSummary,
}: AppearanceClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [candidate, setCandidate] = useState<DesignId>(
    designs.some((design) => design.id === selectedId) ? selectedId : publishedId
  );
  const [themeId, setThemeId] = useState<ThemeId>(paletteId);
  const [mode, setMode] = useState<ColorMode>(paletteMode);
  const [toggleOn, setToggleOn] = useState(viewerToggle);
  const [pickerOn, setPickerOn] = useState(pickerEnabled);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const active = designs.find((design) => design.id === candidate) ?? designs[0];
  const isPublished = candidate === publishedId;
  const failingContrast = contrast.filter((row) => !row.passesAA);

  const run = (action: () => Promise<{ success: boolean; error?: string }>, success: string) => {
    startTransition(async () => {
      try {
        const result = await action();
        if (result.success) {
          toast.success(success);
          router.refresh();
        } else {
          toast.error(result.error || "Could not save the change.");
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not save the change.");
      }
    });
  };

  const handlePublish = () => {
    setConfirmOpen(false);
    run(() => publishDesignTheme(candidate), `${active.name} is now live.`);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
      <div className="space-y-6">
        {/* ── Page view ───────────────────────────────── */}
        <Panel
          title="Page view"
          description="Choose the layout the public homepage renders. Selecting is not publishing — the live site only changes when you press Publish."
          action={
            <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider">
              Shared CMS data
            </Badge>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {designs.map((design) => {
              const isActive = design.id === candidate;
              const style: CSSProperties = {
                "--tile-bg": design.vars["--pf-bg"],
                "--tile-accent": design.vars["--pf-accent"],
                "--tile-radius": design.vars["--pf-radius"],
              } as CSSProperties;

              return (
                <div
                  key={design.id}
                  style={style}
                  className={`group relative overflow-hidden rounded-2xl border transition-colors ${
                    isActive ? "border-primary/60 bg-primary/[0.04]" : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 px-4 pt-4">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {String(designs.indexOf(design) + 1).padStart(2, "0")} · v{design.version}
                      </p>
                      <h3 className="mt-1 truncate text-sm font-bold text-foreground">{design.name}</h3>
                      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{design.tagline}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`shrink-0 font-mono text-[9px] uppercase tracking-wider ${STATUS_TONE[design.status]}`}
                    >
                      {design.status}
                    </Badge>
                  </div>

                  {/* Miniature built from the design's real tokens */}
                  <div
                    className="mx-4 mt-3 h-24 overflow-hidden rounded-xl border border-black/40 p-2"
                    style={{ backgroundColor: design.vars["--pf-bg"] }}
                    aria-hidden
                  >
                    <div
                      className="h-2.5 w-16 rounded-full"
                      style={{ backgroundColor: design.vars["--pf-accent"] }}
                    />
                    <div className="mt-2 h-1.5 w-3/4 rounded-full bg-white/25" />
                    <div className="mt-1.5 h-1.5 w-1/2 rounded-full bg-white/15" />
                    <div className="mt-3 flex gap-1.5">
                      {[0, 1, 2].map((index) => (
                        <div
                          key={index}
                          className="h-8 flex-1 rounded-lg border border-white/10"
                          style={{
                            backgroundColor: design.vars["--pf-card-bg"],
                            borderColor: design.vars["--pf-card-border"],
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="mt-3 line-clamp-2 px-4 text-[11px] leading-relaxed text-muted-foreground">
                    {design.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1 px-4">
                    {Object.values(design.traits)
                      .slice(0, 3)
                      .map((trait) => (
                        <span
                          key={trait}
                          className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[9px] text-muted-foreground"
                        >
                          {trait}
                        </span>
                      ))}
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-border/70 px-4 py-3">
                    <Button
                      type="button"
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      className="h-8 rounded-lg text-[11px]"
                      onClick={() => setCandidate(design.id)}
                      disabled={!design.implemented}
                    >
                      {isActive ? <Check className="size-3.5" /> : null}
                      {isActive ? "Selected" : "Select"}
                    </Button>

                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-lg text-[11px]"
                      disabled={!design.implemented}
                    >
                      <Link href={`/?view=${design.id}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="size-3.5" />
                        Preview
                      </Link>
                    </Button>

                    {!design.implemented && (
                      <span className="ml-auto font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                        Not built
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-muted/30 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-foreground">
                {isPublished ? "This view is already live" : `${active.name} is selected, not published`}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Publishing replaces <span className="font-medium text-foreground">{
                  designs.find((design) => design.id === publishedId)?.name ?? "the current view"
                }</span>{" "}
                on the public site. The previous view is kept for rollback.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              className="h-9 rounded-xl"
              onClick={() => setConfirmOpen(true)}
              disabled={isPending || isPublished || !active.implemented}
            >
              {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
              Publish
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 rounded-xl"
              onClick={() => run(() => rollbackDesignTheme(), "Previous view restored.")}
              disabled={isPending || !canRollback}
              title={previousName ? `Restore ${previousName}` : "Nothing to roll back to"}
            >
              <Undo2 className="size-3.5" />
              Rollback
            </Button>
          </div>
        </Panel>

        {/* ── Palette ─────────────────────────────────── */}
        <Panel
          title="Palette & colour mode"
          description="Nine presets, each with a light and a dark surface. The choice below becomes the admin default; visitors can override it only while the picker is enabled."
          action={
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-lg text-[11px]"
              onClick={() => {
                setThemeId("aurora");
                setMode("dark");
              }}
            >
              <RotateCcw className="size-3.5" />
              Reset
            </Button>
          }
        >
          <div className="mb-4 inline-flex rounded-xl border border-border bg-muted/40 p-1">
            {(["dark", "light"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMode(option)}
                aria-pressed={mode === option}
                className={`rounded-lg px-3 py-1.5 text-[11px] font-medium capitalize transition-colors ${
                  mode === option ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <UniverseTiles value={themeId} onChange={setThemeId} mode={mode} />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button
              size="sm"
              className="h-9 rounded-xl"
              onClick={() => run(() => savePaletteTheme(themeId, mode), "Palette saved as the site default.")}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
              Save palette
            </Button>
            <p className="text-[11px] text-muted-foreground">
              {failingContrast.length === 0
                ? "All measured colour pairs pass WCAG AA."
                : `${failingContrast.length} pair${failingContrast.length === 1 ? "" : "s"} below AA — check the table.`}
            </p>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-semibold">Colour pair</th>
                  <th className="px-3 py-2 font-semibold">Ratio</th>
                  <th className="px-3 py-2 font-semibold">AA</th>
                  <th className="px-3 py-2 font-semibold">AAA</th>
                </tr>
              </thead>
              <tbody>
                {contrast.map((row) => (
                  <tr key={row.label} className="border-t border-border/60">
                    <td className="px-3 py-2 text-foreground/85">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="inline-block size-3 rounded-sm ring-1 ring-inset ring-black/20"
                          style={{ backgroundColor: row.foreground }}
                          aria-hidden
                        />
                        {row.label}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-muted-foreground">{row.ratio}:1</td>
                    <td className="px-3 py-2">
                      <Badge
                        variant="outline"
                        className={
                          row.passesAA
                            ? "border-emerald-500/40 bg-emerald-500/10 text-[9px] text-emerald-500"
                            : "border-destructive/40 bg-destructive/10 text-[9px] text-destructive"
                        }
                      >
                        {row.passesAA ? "pass" : "fail"}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <Badge
                        variant="outline"
                        className={
                          row.passesAAA
                            ? "border-emerald-500/40 bg-emerald-500/10 text-[9px] text-emerald-500"
                            : "border-border bg-muted/60 text-[9px] text-muted-foreground"
                        }
                      >
                        {row.passesAAA ? "pass" : "—"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">
            Measured with the WCAG 2.1 relative-luminance formula against the saved{" "}
            {mode} surface. No scores are estimated.
          </p>
        </Panel>

        {/* ── Visitor controls + shared content ───────── */}
        <Panel
          title="Visitor controls & shared content"
          description="Every view reads the same CMS tables — nothing is duplicated per design."
        >
          <div className="space-y-3">
            <label className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-muted/30 px-4 py-3">
              <span>
                <span className="block text-[11px] font-semibold text-foreground">Visitor view switcher</span>
                <span className="mt-0.5 block text-[11px] text-muted-foreground">
                  Shows a small “Views” toggle on the public site. Previews never save.
                </span>
              </span>
              <Switch
                checked={toggleOn}
                onCheckedChange={(next) => {
                  setToggleOn(next);
                  run(() => setDesignViewerToggle(next), next ? "View switcher enabled." : "View switcher hidden.");
                }}
                disabled={isPending}
                aria-label="Toggle the visitor view switcher"
              />
            </label>

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-muted/30 px-4 py-3">
              <span>
                <span className="block text-[11px] font-semibold text-foreground">Palette picker</span>
                <span className="mt-0.5 block text-[11px] text-muted-foreground">
                  Lets visitors override the palette and colour mode. Turning it off pins everyone to the saved default.
                </span>
              </span>
              <Switch
                checked={pickerOn}
                onCheckedChange={(next) => {
                  setPickerOn(next);
                  run(() => setPalettePickerEnabled(next), next ? "Palette picker enabled." : "Palette picker hidden.");
                }}
                disabled={isPending}
                aria-label="Toggle the visitor palette picker"
                className="shrink-0"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {contentSummary.map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-card px-3 py-2">
                  <p className="text-base font-bold text-foreground">{item.count}</p>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* ── Live preview ───────────────────────────────── */}
      <aside className="space-y-3 xl:sticky xl:top-6 xl:self-start">
        <div className="rounded-3xl border border-border bg-card/60">
          <header className="flex items-center justify-between gap-2 border-b border-border/70 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-foreground">Live preview</p>
              <p className="truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {active.name}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-lg border border-border bg-muted/40 p-0.5">
              <button
                type="button"
                onClick={() => setDevice("desktop")}
                aria-pressed={device === "desktop"}
                aria-label="Desktop preview"
                className={`rounded-md p-1.5 ${device === "desktop" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                <Monitor className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDevice("mobile")}
                aria-pressed={device === "mobile"}
                aria-label="Mobile preview"
                className={`rounded-md p-1.5 ${device === "mobile" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                <Smartphone className="size-3.5" />
              </button>
            </div>
          </header>

          <div className="flex justify-center overflow-hidden bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.02)_0_10px,transparent_10px_20px)] p-3">
            <iframe
              key={`${candidate}-${device}`}
              src={`/?view=${candidate}`}
              title={`${active.name} preview`}
              loading="lazy"
              className="h-[520px] rounded-xl border border-border bg-background"
              style={{ width: device === "mobile" ? 360 : "100%" }}
            />
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-border/70 px-4 py-3">
            <Button asChild variant="ghost" size="sm" className="h-8 rounded-lg text-[11px]">
              <Link href={`/?view=${candidate}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-3.5" />
                Open full page
              </Link>
            </Button>
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              preview · not saved
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card/60 p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-3.5 text-primary" />
            <p className="text-xs font-bold text-foreground">What this view changes</p>
          </div>
          <dl className="mt-3 space-y-2">
            {Object.entries(active.traits).map(([key, value]) => (
              <div key={key} className="flex items-baseline justify-between gap-3">
                <dt className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                  {key}
                </dt>
                <dd className="text-right text-[11px] text-foreground/80">{value}</dd>
              </div>
            ))}
          </dl>
          <ul className="mt-3 space-y-1.5 border-t border-border/70 pt-3">
            {active.features.slice(0, 4).map((feature) => (
              <li key={feature} className="flex gap-2 text-[11px] text-muted-foreground">
                <Check className="mt-0.5 size-3 shrink-0 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* ── Publish confirmation ───────────────────────── */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-lg border-border bg-card p-6">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-amber-500/15">
                <AlertTriangle className="size-4 text-amber-500" />
              </span>
              <DialogTitle className="text-base font-bold text-foreground">
                Publish {active.name}?
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs leading-6 text-muted-foreground">
              This replaces the live homepage immediately. Nothing changes for the CMS — projects,
              profile and every other row stay exactly as they are.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-2 rounded-2xl border border-border bg-muted/30 p-3 text-[11px]">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Replacing</span>
              <span className="font-medium text-foreground">
                {designs.find((design) => design.id === publishedId)?.name ?? publishedId}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Publishing</span>
              <span className="font-medium text-foreground">{active.name}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Version</span>
              <span className="font-mono text-foreground">v{active.version}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Colour checks</span>
              <span className={failingContrast.length === 0 ? "text-emerald-500" : "text-destructive"}>
                {failingContrast.length === 0
                  ? "All pairs pass AA"
                  : `${failingContrast.length} below AA`}
              </span>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-border">
            <iframe
              src={`/?view=${candidate}`}
              title="Publish preview"
              className="h-40 w-full"
              loading="lazy"
            />
          </div>

          <div className="mt-5 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" className="h-9 rounded-xl" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="h-9 rounded-xl" onClick={handlePublish} disabled={isPending}>
              {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
              Publish now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
