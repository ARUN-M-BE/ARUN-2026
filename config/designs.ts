/**
 * Portfolio Design Registry
 *
 * The six portfolio "designs" are complete presentation layers that all read the
 * same CMS content. Nothing here touches content — this file only describes the
 * designs and the per-design appearance configuration an admin can tune.
 *
 * Rules:
 * - `current` is the original portfolio and must keep rendering byte-identical
 *   markup. It is the default published design.
 * - Every design is dark-only. Accents are tuned per design but always sit on a
 *   near-black surface.
 * - Adding a design = one entry here + one folder under `themes/`.
 */

export type DesignId =
  | "current"
  | "parallax"
  | "glass"
  | "immersive"
  | "minimal"
  | "experimental"
  | "bento";

/** Publication lifecycle shown in the studio. */
export type DesignStatus = "draft" | "preview" | "selected" | "published";

export type FontFamilyToken = "geometric" | "editorial" | "mono" | "serif";
export type CardStyleToken = "solid" | "glass" | "outline" | "elevated";
export type HeaderStyleToken = "floating" | "inline" | "minimal" | "vertical";

/**
 * Everything an admin can tune per design. Values are validated and clamped on
 * read (`normalizeDesignConfig`) so a malformed row can never break a render.
 */
export interface DesignConfig {
  accent: string;
  accentSecondary: string;
  background: string;
  fontFamily: FontFamilyToken;
  /** 0.85 – 1.20 multiplier applied to the design's type scale. */
  fontScale: number;
  /** Card / surface corner radius in px (0 – 32). */
  radius: number;
  cardStyle: CardStyleToken;
  /** 0 – 100. Drives motion distance + duration. */
  animation: number;
  /** 0 – 100. Drives scroll-linked depth. */
  parallax: number;
  /** Backdrop blur in px for glass surfaces (0 – 40). */
  glassBlur: number;
  /** Enables the WebGL hero / 360 interactions where the design supports it. */
  threeD: boolean;
  /** 0.75 – 1.50 section rhythm multiplier. */
  spacing: number;
  headerStyle: HeaderStyleToken;
}

export interface DesignTraits {
  hero: string;
  navigation: string;
  layout: string;
  cards: string;
  motion: string;
  density: string;
}

export interface DesignDefinition {
  id: DesignId;
  /** Display order in the studio ("01" … "06"). */
  order: string;
  name: string;
  tagline: string;
  description: string;
  version: string;
  /** Generated wireframe thumbnail (no fake screenshots). */
  thumbnail: "signature" | "parallax" | "glass" | "immersive" | "minimal" | "experimental" | "bento";
  swatches: [string, string, string];
  features: string[];
  traits: DesignTraits;
  /** True when the design ships a WebGL scene that needs a fallback. */
  webgl: boolean;
  defaults: DesignConfig;
}

const baseConfig: DesignConfig = {
  accent: "#818cf8",
  accentSecondary: "#22d3ee",
  background: "#070912",
  fontFamily: "geometric",
  fontScale: 1,
  radius: 24,
  cardStyle: "solid",
  animation: 70,
  parallax: 40,
  glassBlur: 16,
  threeD: true,
  spacing: 1,
  headerStyle: "floating",
};

export const DESIGNS: readonly DesignDefinition[] = [
  {
    id: "current",
    order: "01",
    name: "Current Design",
    tagline: "The original universe — preserved",
    description:
      "Your existing portfolio exactly as it ships today: floating glass navbar, WebGL identity sculpture, guided tour, section-ordered CMS rendering and full contact flow.",
    version: "1.0.0",
    thumbnail: "signature",
    swatches: ["#070912", "#818cf8", "#22d3ee"],
    features: [
      "Section order driven by the CMS",
      "WebGL hero sculpture with drag orbit",
      "Guided tour, telemetry and command palette",
      "Full contact form with DPDP consent",
    ],
    traits: {
      hero: "WebGL sculpture + stats",
      navigation: "Floating glass pill",
      layout: "Centered, section-stacked",
      cards: "Soft glass with tilt",
      motion: "Section reveals + hero orbit",
      density: "Balanced",
    },
    webgl: true,
    defaults: baseConfig,
  },
  {
    id: "parallax",
    order: "02",
    name: "Parallax Experience",
    tagline: "Layered depth, cinematic scroll",
    description:
      "Motion-driven scroll storytelling: stacked layers drift at different speeds, project frames lift through depth, and sections hand off with cinematic transitions.",
    version: "1.0.0",
    thumbnail: "parallax",
    swatches: ["#05070d", "#7dd3fc", "#a78bfa"],
    features: [
      "Scroll-linked parallax layers",
      "Sticky chapter navigation",
      "Depth-stacked project frames",
      "Reveal choreography per section",
    ],
    traits: {
      hero: "Split hero with drifting depth layers",
      navigation: "Sticky progress header",
      layout: "Full-bleed chapters",
      cards: "Elevated frames with depth offsets",
      motion: "Continuous scroll-linked transforms",
      density: "Airy",
    },
    webgl: false,
    defaults: {
      ...baseConfig,
      accent: "#7dd3fc",
      accentSecondary: "#a78bfa",
      background: "#05070d",
      radius: 18,
      cardStyle: "elevated",
      animation: 85,
      parallax: 95,
      glassBlur: 12,
      spacing: 1.1,
      headerStyle: "floating",
    },
  },
  {
    id: "glass",
    order: "03",
    name: "Glassmorphism Experience",
    tagline: "Frosted light on black",
    description:
      "Premium translucent surfaces: frosted panels over a deep mesh, hairline highlights, reflections and blur that layers the whole portfolio like stacked glass.",
    version: "1.0.0",
    thumbnail: "glass",
    swatches: ["#04060a", "#a5f3fc", "#f0abfc"],
    features: [
      "Frosted glass cards with blur depth",
      "Specular highlights and inner borders",
      "Reflective project showcase",
      "Ambient gradient orbs",
    ],
    traits: {
      hero: "Glass identity panel over mesh",
      navigation: "Frosted inline bar",
      layout: "Bento glass grid",
      cards: "Translucent blur with reflections",
      motion: "Soften, fade, float",
      density: "Balanced",
    },
    webgl: false,
    defaults: {
      ...baseConfig,
      accent: "#a5f3fc",
      accentSecondary: "#f0abfc",
      background: "#04060a",
      radius: 26,
      cardStyle: "glass",
      animation: 55,
      parallax: 45,
      glassBlur: 28,
      threeD: false,
      headerStyle: "inline",
    },
  },
  {
    id: "immersive",
    order: "04",
    name: "Immersive 360° Experience",
    tagline: "Enter the environment",
    description:
      "A navigable 3D world: drag to orbit the identity core, scroll to move the camera, and explore the project ring where each project is a station you can open.",
    version: "1.0.0",
    thumbnail: "immersive",
    swatches: ["#03040a", "#67e8f9", "#c084fc"],
    features: [
      "Drag-orbit 3D hero with scroll camera",
      "Project ring gallery in 3D space",
      "Station-based section transitions",
      "Static fallback when WebGL is unavailable",
    ],
    traits: {
      hero: "Orbiting 3D environment",
      navigation: "Minimal station rail",
      layout: "Spatial, camera-driven",
      cards: "Wireframe stations",
      motion: "Camera moves and orbits",
      density: "Immersive",
    },
    webgl: true,
    defaults: {
      ...baseConfig,
      accent: "#67e8f9",
      accentSecondary: "#c084fc",
      background: "#03040a",
      radius: 20,
      cardStyle: "outline",
      animation: 80,
      parallax: 60,
      glassBlur: 10,
      threeD: true,
      spacing: 1.15,
      headerStyle: "minimal",
    },
  },
  {
    id: "minimal",
    order: "05",
    name: "Minimal Luxury Experience",
    tagline: "Quiet, editorial, expensive",
    description:
      "Large-format typography and disciplined negative space. Hairline rules instead of cards, restrained motion, and a single accent used sparingly.",
    version: "1.0.0",
    thumbnail: "minimal",
    swatches: ["#08080a", "#f5f5f4", "#a8a29e"],
    features: [
      "Editorial type hierarchy",
      "Hairline rules and open grids",
      "Generous vertical rhythm",
      "Motion limited to fades",
    ],
    traits: {
      hero: "Oversized editorial statement",
      navigation: "Minimal text header",
      layout: "Wide margins, single column",
      cards: "Borderless, rule-separated",
      motion: "Subtle fades only",
      density: "Spacious",
    },
    webgl: false,
    defaults: {
      ...baseConfig,
      accent: "#f5f5f4",
      accentSecondary: "#a8a29e",
      background: "#08080a",
      fontFamily: "serif",
      fontScale: 1.08,
      radius: 2,
      cardStyle: "outline",
      animation: 35,
      parallax: 15,
      glassBlur: 0,
      threeD: false,
      spacing: 1.35,
      headerStyle: "minimal",
    },
  },
  {
    id: "experimental",
    order: "06",
    name: "Creative Experimental Experience",
    tagline: "Unconventional by design",
    description:
      "An art-directed layout: asymmetric grid, oversized display type, marquee tickers, horizontal project rail and deliberate rule-breaking that still stays readable.",
    version: "1.0.0",
    thumbnail: "experimental",
    swatches: ["#050507", "#f472b6", "#fbbf24"],
    features: [
      "Asymmetric editorial grid",
      "Marquee tickers and rotated labels",
      "Horizontal project rail",
      "Editorial numerals and index marks",
    ],
    traits: {
      hero: "Asymmetric split with marquee",
      navigation: "Side index rail",
      layout: "Off-grid, overlapping panels",
      cards: "Offset blocks with mono labels",
      motion: "Fast, characterful transitions",
      density: "Dense",
    },
    webgl: false,
    defaults: {
      ...baseConfig,
      accent: "#f472b6",
      accentSecondary: "#fbbf24",
      background: "#050507",
      fontFamily: "geometric",
      radius: 8,
      cardStyle: "elevated",
      animation: 95,
      parallax: 80,
      glassBlur: 6,
      threeD: false,
      spacing: 0.95,
      headerStyle: "vertical",
    },
  },
  {
    id: "bento",
    order: "07",
    name: "Bento Grid Experience",
    tagline: "Structured, scannable, calm",
    description:
      "A modular bento board: every block is a different size, hover lifts the card you are reading, and the whole page stays scannable at a glance.",
    version: "1.0.0",
    thumbnail: "bento",
    swatches: ["#08090c", "#38bdf8", "#f472b6"],
    features: [
      "Modular bento board layout",
      "Hover lift with pointer-tracked glow",
      "Centred hero and section headers",
      "Reduced-motion aware transitions",
    ],
    traits: {
      hero: "Centred statement over a stat bento",
      navigation: "Centred pill navigation",
      layout: "12-column modular board",
      cards: "Rounded solid surfaces, subtle lift",
      motion: "Hover lift and soft fades",
      density: "Balanced",
    },
    webgl: false,
    defaults: {
      ...baseConfig,
      accent: "#38bdf8",
      accentSecondary: "#f472b6",
      background: "#08090c",
      fontFamily: "geometric",
      radius: 22,
      cardStyle: "solid",
      animation: 45,
      parallax: 10,
      glassBlur: 0,
      threeD: false,
      spacing: 1,
      headerStyle: "inline",
    },
  },
];

export const DESIGN_IDS = DESIGNS.map((design) => design.id) as DesignId[];

export const DEFAULT_DESIGN_ID: DesignId = "current";

/**
 * The four views offered on the public site and in the admin Page View
 * picker. Every entry is also a design, so previewing and publishing share
 * one code path. Adding a fifth view = adding its id here.
 */
export const PUBLIC_VIEW_IDS: readonly DesignId[] = [
  "current",
  "parallax",
  "glass",
  "bento",
];

export function isPublicViewId(value: unknown): value is DesignId {
  return typeof value === "string" && PUBLIC_VIEW_IDS.includes(value as DesignId);
}

/** site_settings keys. One row per concern keeps publishing auditable. */
export const DESIGN_SETTING_KEYS = {
  published: "design.published",
  /** Snapshot of the appearance baked into the published design. */
  publishedConfig: "design.publishedConfig",
  /** Previous published design + snapshot, kept for one-click rollback. */
  previous: "design.previous",
  previousConfig: "design.previousConfig",
  selected: "design.selected",
  /** Whether visitors may temporarily switch views from the public site. */
  viewerToggle: "design.viewerToggle",
  draft: (id: DesignId) => `design.draft.${id}`,
} as const;

export const FONT_STACKS: Record<FontFamilyToken, string> = {
  geometric:
    'var(--font-geist-sans, ui-sans-serif), "Segoe UI", system-ui, sans-serif',
  editorial:
    '"Times New Roman", "Iowan Old Style", Georgia, ui-serif, serif',
  mono: 'ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, monospace',
  serif: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, ui-serif, serif',
};

export function normalizeDesignId(value: unknown): DesignId {
  if (typeof value === "string") {
    const trimmed = value.trim().replace(/^"|"$/g, "");
    const match = DESIGNS.find((design) => design.id === trimmed);
    if (match) return match.id;
  }
  return DEFAULT_DESIGN_ID;
}

export function getDesign(value: unknown): DesignDefinition {
  const id = normalizeDesignId(value);
  return DESIGNS.find((design) => design.id === id) ?? DESIGNS[0];
}

export function isDesignId(value: unknown): value is DesignId {
  return typeof value === "string" && DESIGNS.some((design) => design.id === value);
}

/* ── Config normalisation ─────────────────────────────── */

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

function clamp(value: unknown, min: number, max: number, fallback: number) {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, num));
}

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

const FONTS: readonly FontFamilyToken[] = ["geometric", "editorial", "mono", "serif"];
const CARD_STYLES: readonly CardStyleToken[] = ["solid", "glass", "outline", "elevated"];
const HEADER_STYLES: readonly HeaderStyleToken[] = ["floating", "inline", "minimal", "vertical"];

/** Coerces any stored draft into a render-safe config. */
export function normalizeDesignConfig(
  designId: DesignId,
  raw: unknown
): DesignConfig {
  const design = getDesign(designId);
  const defaults = design.defaults;
  const source = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  return {
    accent: HEX.test(String(source.accent ?? "")) ? String(source.accent) : defaults.accent,
    accentSecondary: HEX.test(String(source.accentSecondary ?? ""))
      ? String(source.accentSecondary)
      : defaults.accentSecondary,
    background: HEX.test(String(source.background ?? ""))
      ? String(source.background)
      : defaults.background,
    fontFamily: pick(source.fontFamily, FONTS, defaults.fontFamily),
    fontScale: clamp(source.fontScale, 0.85, 1.2, defaults.fontScale),
    radius: clamp(source.radius, 0, 32, defaults.radius),
    cardStyle: pick(source.cardStyle, CARD_STYLES, defaults.cardStyle),
    animation: clamp(source.animation, 0, 100, defaults.animation),
    parallax: clamp(source.parallax, 0, 100, defaults.parallax),
    glassBlur: clamp(source.glassBlur, 0, 40, defaults.glassBlur),
    threeD: typeof source.threeD === "boolean" ? source.threeD : defaults.threeD,
    spacing: clamp(source.spacing, 0.75, 1.5, defaults.spacing),
    headerStyle: pick(source.headerStyle, HEADER_STYLES, defaults.headerStyle),
  };
}

export function configsEqual(a: DesignConfig, b: DesignConfig): boolean {
  return (Object.keys(a) as (keyof DesignConfig)[]).every((key) => a[key] === b[key]);
}

/* ── Design tokens ────────────────────────────────────── */

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => char + char)
          .join("")
      : clean;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

/** `rgba()` string from a hex colour — used for glow/accent washes. */
export function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const CARD_SURFACES: Record<CardStyleToken, { bg: string; border: string; shadow: string }> = {
  solid: {
    bg: "rgba(255, 255, 255, 0.035)",
    border: "rgba(255, 255, 255, 0.09)",
    shadow: "0 24px 60px -32px rgba(0, 0, 0, 0.9)",
  },
  glass: {
    bg: "rgba(255, 255, 255, 0.06)",
    border: "rgba(255, 255, 255, 0.16)",
    shadow: "0 30px 80px -40px rgba(0, 0, 0, 0.95)",
  },
  outline: {
    bg: "transparent",
    border: "rgba(255, 255, 255, 0.14)",
    shadow: "none",
  },
  elevated: {
    bg: "rgba(255, 255, 255, 0.05)",
    border: "rgba(255, 255, 255, 0.07)",
    shadow: "0 40px 90px -44px rgba(0, 0, 0, 1)",
  },
};

/**
 * CSS custom properties consumed by every design. Namespaced with `--pf-` so a
 * design never collides with the global palette tokens from `config/themes.ts`.
 */
export function designToCssVars(config: DesignConfig): Record<string, string> {
  const surface = CARD_SURFACES[config.cardStyle];
  return {
    "--pf-accent": config.accent,
    "--pf-accent-2": config.accentSecondary,
    "--pf-bg": config.background,
    "--pf-font": FONT_STACKS[config.fontFamily],
    "--pf-font-scale": String(config.fontScale),
    "--pf-radius": `${config.radius}px`,
    "--pf-radius-sm": `${Math.round(config.radius * 0.55)}px`,
    "--pf-blur": `${config.glassBlur}px`,
    "--pf-space": String(config.spacing),
    "--pf-anim": String(config.animation / 100),
    "--pf-parallax": String(config.parallax / 100),
    "--pf-card-bg": surface.bg,
    "--pf-card-border": surface.border,
    "--pf-card-shadow": surface.shadow,
    "--pf-glow": `radial-gradient(circle at 50% 0%, ${withAlpha(config.accent, 0.16)} 0%, transparent 70%)`,
    "--pf-wash": `radial-gradient(circle at 20% 20%, ${withAlpha(config.accentSecondary, 0.12)} 0%, transparent 60%)`,
    "--pf-accent-soft": withAlpha(config.accent, 0.12),
    "--pf-accent-line": withAlpha(config.accent, 0.32),
  };
}

/* ── Motion helpers shared by designs ─────────────────── */

/** Duration in seconds for a "full" motion beat at the configured intensity. */
export function motionDuration(config: DesignConfig): number {
  const intensity = config.animation / 100;
  return Number((0.85 - intensity * 0.5).toFixed(2));
}

/** Travel distance in px for reveal beats at the configured intensity. */
export function motionDistance(config: DesignConfig): number {
  return Math.round(18 + (config.animation / 100) * 46);
}

/** Scroll-linked translation in px for parallax layers. */
export function parallaxShift(config: DesignConfig, progress: number, depth = 1): number {
  return progress * (config.parallax / 100) * 120 * depth;
}
