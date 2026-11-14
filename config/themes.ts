/**
 * Portfolio Universe Themes
 *
 * Every visual surface of the portfolio (public + admin) is driven by the CSS
 * custom properties declared here. The registry is the single source of truth:
 * the root layout serialises the active theme into inline custom properties so
 * the first paint is already themed, and the client theme studio re-applies the
 * same tokens when an admin or visitor switches universes.
 *
 * Rules:
 * - All themes are dark. There is no light mode.
 * - `aurora` is the original Midnight Aurora palette and must remain untouched.
 * - Adding a theme means adding one entry + one swatch triple. Nothing else.
 */

export type ThemeId = "aurora" | "obsidian" | "monolith";

export interface PortfolioTheme {
  id: ThemeId;
  name: string;
  tagline: string;
  description: string;
  /** Three hex stops used for the admin preview tile / swatch rail. */
  swatches: [string, string, string];
  /** CSS custom properties written onto <html>. */
  vars: Record<string, string>;
  /** Colours consumed by the WebGL hero + 3D scenes. */
  scene: {
    primary: string;
    accent: string;
    core: string;
  };
}

export const DEFAULT_THEME_ID: ThemeId = "aurora";

const aurora: PortfolioTheme = {
  id: "aurora",
  name: "Midnight Aurora",
  tagline: "Indigo nebula · laser cyan",
  description:
    "The original identity — deep space navy, soft indigo and a laser cyan edge. Balanced for long-form case studies.",
  swatches: ["#070912", "#818cf8", "#22d3ee"],
  scene: {
    primary: "#38bdf8",
    accent: "#818cf8",
    core: "#0c101c",
  },
  vars: {
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
};

const obsidian: PortfolioTheme = {
  id: "obsidian",
  name: "Obsidian Forge",
  tagline: "Molten bronze · graphite",
  description:
    "A cinematic forge: near-black graphite, brushed champagne metal and a warm copper ember. Editorial, quiet, expensive.",
  swatches: ["#050506", "#d9b179", "#e0825a"],
  scene: {
    primary: "#e7cfa3",
    accent: "#e0825a",
    core: "#0b0b0d",
  },
  vars: {
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
};

const monolith: PortfolioTheme = {
  id: "monolith",
  name: "Monolith Steel",
  tagline: "Arctic silver · mint",
  description:
    "Precision-engineered minimalism: cool graphite plates, brushed silver type and a single arctic mint signal.",
  swatches: ["#08090b", "#c3ced6", "#6fd8be"],
  scene: {
    primary: "#c3ced6",
    accent: "#6fd8be",
    core: "#0e1013",
  },
  vars: {
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
};

export const THEMES: readonly PortfolioTheme[] = [aurora, obsidian, monolith];

export const THEME_IDS = THEMES.map((theme) => theme.id) as ThemeId[];

/** Visitor override cookie (read on the server so SSR stays flash-free). */
export const THEME_COOKIE = "pf_theme";

/** Site-settings key holding the globally published theme id. */
export const THEME_SETTING_KEY = "theme.active";

/** Colour-mode cookie used by next-themes; the portfolio is dark-only. */
export const DARK_ONLY_CLASS = "dark";

export function normalizeThemeId(value: unknown): ThemeId {
  if (typeof value === "string") {
    const match = THEMES.find((theme) => theme.id === value);
    if (match) return match.id;
  }
  return DEFAULT_THEME_ID;
}

export function getTheme(value: unknown): PortfolioTheme {
  return THEMES.find((theme) => theme.id === normalizeThemeId(value)) ?? THEMES[0];
}
