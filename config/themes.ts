/**
 * Portfolio Palette Registry
 *
 * Every visual surface (public + admin) is driven by the CSS custom
 * properties declared here. The root layout serialises the active surface
 * into inline custom properties so the first paint is already themed.
 *
 * Structure:
 * - A *preset* is a colour identity (violet, amber, sunset …).
 * - A *surface* is a preset rendered in one mode (dark or light).
 * - `resolveTheme(id, mode)` flattens the two into the object components use.
 *
 * Rules:
 * - `aurora` is the original Midnight Aurora palette; its dark tokens are kept
 *   verbatim so the default look never regresses.
 * - Derived surfaces pass through `ensureContrast`, so every preset ships an
 *   AA-readable pair in both modes.
 * - Adding a preset means adding one entry. Nothing else changes.
 */

import {
  bestForeground,
  ensureContrast,
  mix,
  shift,
  withAlpha,
} from "@/lib/colors";

export type ThemeId =
  | "aurora"
  | "obsidian"
  | "monolith"
  | "violet"
  | "cyan"
  | "emerald"
  | "amber"
  | "rose"
  | "sunset";

export type ColorMode = "dark" | "light";

export interface ThemeScene {
  primary: string;
  accent: string;
  core: string;
}

export interface ThemeSurface {
  /** CSS custom properties written onto <html>. */
  vars: Record<string, string>;
  /** Colours consumed by the WebGL scene. */
  scene: ThemeScene;
  /** Three hex stops for tiles and swatch rails. */
  swatches: [string, string, string];
}

export interface PaletteSpec {
  id: ThemeId;
  name: string;
  tagline: string;
  description: string;
  darkBg: string;
  lightBg: string;
  /** Dark-mode brand colour. */
  accent: string;
  /** Dark-mode secondary signal. */
  accentAlt: string;
  /** Curated light-mode brand colour (falls back to a darkened `accent`). */
  lightAccent?: string;
  lightAccentAlt?: string;
  /** Verbatim dark tokens for the legacy palettes; skips generation. */
  darkVars?: Record<string, string>;
  darkScene?: ThemeScene;
}

export interface PortfolioTheme extends PaletteSpec {
  dark: ThemeSurface;
  light: ThemeSurface;
  /** Compact swatch triple, taken from the dark surface. */
  swatches: [string, string, string];
}

export interface ResolvedTheme {
  id: ThemeId;
  mode: ColorMode;
  name: string;
  tagline: string;
  description: string;
  vars: Record<string, string>;
  scene: ThemeScene;
  swatches: [string, string, string];
}

export const DEFAULT_THEME_ID: ThemeId = "aurora";
export const DEFAULT_COLOR_MODE: ColorMode = "dark";
export const COLOR_MODES: readonly ColorMode[] = ["dark", "light"];

/** Visitor override cookie for the palette (read on the server, so no flash). */
export const THEME_COOKIE = "pf_theme";
/** Visitor override cookie for the colour mode. */
export const THEME_MODE_COOKIE = "pf_mode";
/** Site-settings key holding the globally published palette id. */
export const THEME_SETTING_KEY = "theme.active";
/** Site-settings key holding the admin's default colour mode. */
export const THEME_MODE_SETTING_KEY = "theme.mode";
/** Site-settings key deciding whether visitors may switch palettes. */
export const THEME_PICKER_SETTING_KEY = "theme.pickerEnabled";

/** Colour-mode class used by the dark-first design system. */
export const DARK_ONLY_CLASS = "dark";

// ─── Surface generation ────────────────────────────────────

type Mode = ColorMode;

function buildSurface(spec: PaletteSpec, mode: Mode): ThemeSurface {
  if (mode === "dark" && spec.darkVars) {
    return {
      vars: spec.darkVars,
      scene:
        spec.darkScene ?? {
          primary: spec.darkVars["--scene-primary"],
          accent: spec.darkVars["--scene-accent"],
          core: spec.darkVars["--scene-core"],
        },
      swatches: [spec.darkVars["--background"], spec.darkVars["--primary"], spec.darkVars["--accent"]],
    };
  }

  const dark = mode === "dark";
  const bg = dark ? spec.darkBg : spec.lightBg;
  const ink = dark ? "#ffffff" : "#000000";

  // Surfaces step away from the page background in a consistent order.
  const card = dark ? mix(bg, ink, 0.055) : "#ffffff";
  const secondary = dark ? mix(bg, ink, 0.08) : mix(bg, ink, 0.05);
  const muted = dark ? mix(bg, ink, 0.04) : mix(bg, ink, 0.03);
  const raised = dark ? mix(bg, ink, 0.1) : "#ffffff";

  // Foregrounds are nudged until they clear 7:1 wherever the surface allows.
  const foreground = ensureContrast(dark ? "#eef2fb" : "#0b0f19", bg, 7);
  const cardForeground = ensureContrast(dark ? "#f6f8ff" : "#0b0f19", card, 7);
  const mutedForeground = ensureContrast(dark ? "#a8b1c6" : "#5b6472", secondary, 4.5);

  const primarySource = dark ? spec.accent : spec.lightAccent ?? spec.accent;
  const accentSource = dark ? spec.accentAlt : spec.lightAccentAlt ?? spec.accentAlt;

  const primary = ensureContrast(primarySource, dark ? bg : card, 4.5);
  const accent = ensureContrast(accentSource, dark ? bg : card, 4.5);
  const primaryForeground = bestForeground(primary, dark ? ["#080a11", "#ffffff"] : ["#ffffff", "#0b0f19"]);
  const accentForeground = bestForeground(accent, dark ? ["#080a11", "#ffffff"] : ["#ffffff", "#0b0f19"]);
  const destructive = ensureContrast(dark ? "#fb7185" : "#c81e4a", bg, 4.5);

  const vars: Record<string, string> = {
    "--background": bg,
    "--foreground": foreground,
    "--card": card,
    "--card-foreground": cardForeground,
    "--popover": card,
    "--popover-foreground": cardForeground,
    "--primary": primary,
    "--primary-foreground": primaryForeground,
    "--secondary": secondary,
    "--secondary-foreground": ensureContrast(foreground, secondary, 4.5),
    "--muted": muted,
    "--muted-foreground": mutedForeground,
    "--accent": accent,
    "--accent-foreground": accentForeground,
    "--destructive": destructive,
    "--destructive-foreground": bestForeground(destructive, ["#0b1020", "#ffffff"]),
    "--border": withAlpha(dark ? "#ffffff" : "#0b0f19", dark ? 0.09 : 0.11),
    "--input": withAlpha(dark ? "#ffffff" : "#0b0f19", dark ? 0.12 : 0.15),
    "--ring": primary,
    "--gradient-brand": `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`,
    "--gradient-accent": `linear-gradient(135deg, ${accent} 0%, ${primary} 100%)`,
    "--gradient-glow": `radial-gradient(circle at 50% 0%, ${withAlpha(primary, dark ? 0.16 : 0.1)} 0%, transparent 75%)`,
    "--shadow-glow": `0 18px 60px -20px ${withAlpha(primary, dark ? 0.55 : 0.28)}`,
    "--surface-raised": raised,
    "--metal-border": withAlpha(dark ? "#ffffff" : "#0b0f19", dark ? 0.1 : 0.14),
    "--mesh-1": withAlpha(primary, dark ? 0.16 : 0.1),
    "--mesh-2": withAlpha(accent, dark ? 0.13 : 0.08),
    "--scene-primary": dark ? shift(primary, 0.16) : primary,
    "--scene-accent": dark ? shift(accent, 0.1) : accent,
    "--scene-core": dark ? mix(bg, "#ffffff", 0.06) : mix(bg, "#000000", 0.06),
  };

  return {
    vars,
    scene: {
      primary: vars["--scene-primary"],
      accent: vars["--scene-accent"],
      core: vars["--scene-core"],
    },
    swatches: [bg, primary, accent],
  };
}

function defineTheme(spec: PaletteSpec): PortfolioTheme {
  const dark = buildSurface(spec, "dark");
  const light = buildSurface(spec, "light");
  return { ...spec, dark, light, swatches: dark.swatches };
}

// ─── Legacy palettes (dark tokens preserved verbatim) ─────

const aurora = defineTheme({
  id: "aurora",
  name: "Midnight Aurora",
  tagline: "Indigo nebula · laser cyan",
  description:
    "The original identity — deep space navy, soft indigo and a laser cyan edge. Balanced for long-form case studies.",
  darkBg: "#070912",
  lightBg: "#f6f7fd",
  accent: "#818cf8",
  accentAlt: "#22d3ee",
  lightAccent: "#4338ca",
  lightAccentAlt: "#0e7490",
  darkScene: { primary: "#38bdf8", accent: "#818cf8", core: "#0c101c" },
  darkVars: {
    "--background": "#070912",
    "--foreground": "#e9edf9",
    "--card": "#0c1020",
    "--card-foreground": "#f3f6ff",
    "--popover": "#0c1020",
    "--popover-foreground": "#f3f6ff",
    "--primary": "#818cf8",
    "--primary-foreground": "#070912",
    "--secondary": "#121830",
    "--secondary-foreground": "#dde4f5",
    "--muted": "#101528",
    "--muted-foreground": "#98a2ba",
    "--accent": "#22d3ee",
    "--accent-foreground": "#04121a",
    "--destructive": "#fb7185",
    "--destructive-foreground": "#0b1020",
    "--border": "rgba(255, 255, 255, 0.09)",
    "--input": "rgba(255, 255, 255, 0.12)",
    "--ring": "#818cf8",
    "--gradient-brand": "linear-gradient(135deg, #818cf8 0%, #22d3ee 100%)",
    "--gradient-accent": "linear-gradient(135deg, #22d3ee 0%, #818cf8 100%)",
    "--gradient-glow":
      "radial-gradient(circle at 50% 0%, rgba(129, 140, 248, 0.16) 0%, transparent 75%)",
    "--shadow-glow": "0 18px 60px -20px rgba(129, 140, 248, 0.55)",
    "--surface-raised": "#111730",
    "--metal-border": "rgba(255, 255, 255, 0.10)",
    "--mesh-1": "rgba(129, 140, 248, 0.16)",
    "--mesh-2": "rgba(34, 211, 238, 0.13)",
    "--scene-primary": "#38bdf8",
    "--scene-accent": "#818cf8",
    "--scene-core": "#0c101c",
  },
});

const obsidian = defineTheme({
  id: "obsidian",
  name: "Obsidian Forge",
  tagline: "Molten bronze · graphite",
  description:
    "A cinematic forge: near-black graphite, brushed champagne metal and a warm copper ember. Editorial, quiet, expensive.",
  darkBg: "#050506",
  lightBg: "#faf8f5",
  accent: "#d9b179",
  accentAlt: "#e0825a",
  lightAccent: "#8a6434",
  lightAccentAlt: "#b2542d",
  darkScene: { primary: "#e7cfa3", accent: "#e0825a", core: "#0b0b0d" },
  darkVars: {
    "--background": "#050506",
    "--foreground": "#eee9e1",
    "--card": "#0b0b0d",
    "--card-foreground": "#f6f2ea",
    "--popover": "#0b0b0d",
    "--popover-foreground": "#f6f2ea",
    "--primary": "#d9b179",
    "--primary-foreground": "#120d06",
    "--secondary": "#16140f",
    "--secondary-foreground": "#e2d9c9",
    "--muted": "#100f0c",
    "--muted-foreground": "#9c9384",
    "--accent": "#e0825a",
    "--accent-foreground": "#160a05",
    "--destructive": "#f06a6a",
    "--destructive-foreground": "#0b0606",
    "--border": "rgba(217, 177, 121, 0.16)",
    "--input": "rgba(255, 255, 255, 0.10)",
    "--ring": "#d9b179",
    "--gradient-brand":
      "linear-gradient(135deg, #e7cfa3 0%, #d9b179 45%, #9a7442 100%)",
    "--gradient-accent": "linear-gradient(135deg, #e0825a 0%, #d9b179 100%)",
    "--gradient-glow":
      "radial-gradient(circle at 50% 0%, rgba(217, 177, 121, 0.14) 0%, transparent 72%)",
    "--shadow-glow": "0 18px 60px -20px rgba(217, 177, 121, 0.38)",
    "--surface-raised": "#121110",
    "--metal-border": "rgba(217, 177, 121, 0.22)",
    "--mesh-1": "rgba(217, 177, 121, 0.13)",
    "--mesh-2": "rgba(224, 130, 90, 0.11)",
    "--scene-primary": "#e7cfa3",
    "--scene-accent": "#e0825a",
    "--scene-core": "#0b0b0d",
  },
});

const monolith = defineTheme({
  id: "monolith",
  name: "Monolith Steel",
  tagline: "Arctic silver · mint",
  description:
    "Precision-engineered minimalism: cool graphite plates, brushed silver type and a single arctic mint signal.",
  darkBg: "#08090b",
  lightBg: "#f5f7f8",
  accent: "#c3ced6",
  accentAlt: "#6fd8be",
  lightAccent: "#3f4d57",
  lightAccentAlt: "#0f766e",
  darkScene: { primary: "#c3ced6", accent: "#6fd8be", core: "#0e1013" },
  darkVars: {
    "--background": "#08090b",
    "--foreground": "#e4e8eb",
    "--card": "#0e1013",
    "--card-foreground": "#f2f5f7",
    "--popover": "#0e1013",
    "--popover-foreground": "#f2f5f7",
    "--primary": "#c3ced6",
    "--primary-foreground": "#0a0c0e",
    "--secondary": "#15181c",
    "--secondary-foreground": "#d6dee4",
    "--muted": "#101317",
    "--muted-foreground": "#94a1ab",
    "--accent": "#6fd8be",
    "--accent-foreground": "#05130f",
    "--destructive": "#f2708a",
    "--destructive-foreground": "#0b0708",
    "--border": "rgba(195, 206, 214, 0.13)",
    "--input": "rgba(255, 255, 255, 0.10)",
    "--ring": "#a9bfcc",
    "--gradient-brand":
      "linear-gradient(135deg, #e9eef2 0%, #c3ced6 42%, #6fd8be 100%)",
    "--gradient-accent": "linear-gradient(135deg, #6fd8be 0%, #c3ced6 100%)",
    "--gradient-glow":
      "radial-gradient(circle at 50% 0%, rgba(111, 216, 190, 0.12) 0%, transparent 72%)",
    "--shadow-glow": "0 18px 60px -20px rgba(111, 216, 190, 0.35)",
    "--surface-raised": "#13161a",
    "--metal-border": "rgba(195, 206, 214, 0.18)",
    "--mesh-1": "rgba(195, 206, 214, 0.12)",
    "--mesh-2": "rgba(111, 216, 190, 0.11)",
    "--scene-primary": "#c3ced6",
    "--scene-accent": "#6fd8be",
    "--scene-core": "#0e1013",
  },
});

// ─── Additional presets (derived surfaces) ────────────────

const violet = defineTheme({
  id: "violet",
  name: "Violet Haze",
  tagline: "Electric violet · lilac",
  description:
    "Saturated ultraviolet with a soft lilac counterpoint. Bold, creative, unmistakably a design-forward studio.",
  darkBg: "#0a0813",
  lightBg: "#f7f5ff",
  accent: "#a78bfa",
  accentAlt: "#f0abfc",
  lightAccent: "#6d28d9",
  lightAccentAlt: "#a21caf",
});

const cyan = defineTheme({
  id: "cyan",
  name: "Cyan Current",
  tagline: "Signal cyan · sky",
  description:
    "Cool, technical and fast. Cyan signals against a deep marine base — the palette of dashboards and low-latency systems.",
  darkBg: "#04121a",
  lightBg: "#f0fbff",
  accent: "#22d3ee",
  accentAlt: "#38bdf8",
  lightAccent: "#0e7490",
  lightAccentAlt: "#0369a1",
});

const emerald = defineTheme({
  id: "emerald",
  name: "Emerald Vault",
  tagline: "Emerald · jade",
  description:
    "Growth-coloured and calm. Deep vault green with jade highlights, built for case studies that talk about scale and reliability.",
  darkBg: "#05130f",
  lightBg: "#f0fdf6",
  accent: "#34d399",
  accentAlt: "#2dd4bf",
  lightAccent: "#047857",
  lightAccentAlt: "#0f766e",
});

const amber = defineTheme({
  id: "amber",
  name: "Amber Archive",
  tagline: "Amber · ember",
  description:
    "Warm archival amber and burnt ember on near-black. Reads like a printed monograph — editorial and confident.",
  darkBg: "#120d04",
  lightBg: "#fffaf0",
  accent: "#fbbf24",
  accentAlt: "#f59e0b",
  lightAccent: "#92400e",
  lightAccentAlt: "#b45309",
});

const rose = defineTheme({
  id: "rose",
  name: "Rose Quartz",
  tagline: "Rose · pink quartz",
  description:
    "Soft rose and pink quartz over ink. Expressive without losing contrast — good for product and brand work.",
  darkBg: "#14070c",
  lightBg: "#fff5f7",
  accent: "#fb7185",
  accentAlt: "#f472b6",
  lightAccent: "#be123c",
  lightAccentAlt: "#9d174d",
});

const sunset = defineTheme({
  id: "sunset",
  name: "Sunset Gradient",
  tagline: "Sunset orange · magenta",
  description:
    "A two-colour gradient identity: sunset orange bleeding into magenta. The most expressive palette in the set.",
  darkBg: "#140808",
  lightBg: "#fff7f3",
  accent: "#fb923c",
  accentAlt: "#ec4899",
  lightAccent: "#c2410c",
  lightAccentAlt: "#be185d",
});

// ─── Registry ─────────────────────────────────────────────

export const THEMES: readonly PortfolioTheme[] = [
  aurora,
  obsidian,
  monolith,
  violet,
  cyan,
  emerald,
  amber,
  rose,
  sunset,
];

export const THEME_IDS = THEMES.map((theme) => theme.id) as ThemeId[];

export function normalizeThemeId(value: unknown): ThemeId {
  if (typeof value === "string") {
    const match = THEMES.find((theme) => theme.id === value);
    if (match) return match.id;
  }
  return DEFAULT_THEME_ID;
}

export function normalizeColorMode(value: unknown): ColorMode {
  if (value === "light" || value === "dark") return value;
  if (typeof value === "string") {
    const trimmed = value.trim().toLowerCase();
    if (trimmed === "light" || trimmed === "dark") return trimmed;
  }
  return DEFAULT_COLOR_MODE;
}

export function getTheme(value: unknown): PortfolioTheme {
  return THEMES.find((theme) => theme.id === normalizeThemeId(value)) ?? THEMES[0];
}

export function getSurface(themeId: unknown, mode: unknown): ThemeSurface {
  const theme = getTheme(themeId);
  return normalizeColorMode(mode) === "light" ? theme.light : theme.dark;
}

/** Flattens a preset + mode into the object components consume. */
export function resolveTheme(themeId: unknown, mode: unknown): ResolvedTheme {
  const theme = getTheme(themeId);
  const colorMode = normalizeColorMode(mode);
  const surface = colorMode === "light" ? theme.light : theme.dark;

  return {
    id: theme.id,
    mode: colorMode,
    name: theme.name,
    tagline: theme.tagline,
    description: theme.description,
    vars: surface.vars,
    scene: surface.scene,
    swatches: surface.swatches,
  };
}
