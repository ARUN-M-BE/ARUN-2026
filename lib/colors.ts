/**
 * Colour maths for the palette engine.
 *
 * Pure, dependency-free helpers so the same functions can run during
 * server rendering, in client components and while generating palettes.
 * The WCAG helpers follow WCAG 2.1 relative-luminance and contrast rules,
 * which is what "AA" actually refers to.
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Parses `#rgb`, `#rrggbb` or the same without the hash. Returns null when invalid. */
export function parseHex(value: string): RGB | null {
  if (typeof value !== "string") return null;
  const match = HEX_RE.exec(value.trim());
  if (!match) return null;

  let hex = match[1];
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  };
}

function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

export function toHex({ r, g, b }: RGB): string {
  const part = (channel: number) => clampChannel(channel).toString(16).padStart(2, "0");
  return `#${part(r)}${part(g)}${part(b)}`;
}

/** Returns a safe hex string, falling back when the input is not a colour. */
export function safeHex(value: string, fallback = "#000000"): string {
  const rgb = parseHex(value);
  return rgb ? toHex(rgb) : fallback;
}

/** Linear mix of two colours. `weight` 0 returns `a`, 1 returns `b`. */
export function mix(a: string, b: string, weight: number): string {
  const from = parseHex(a) ?? { r: 0, g: 0, b: 0 };
  const to = parseHex(b) ?? { r: 255, g: 255, b: 255 };
  const t = Math.max(0, Math.min(1, weight));

  return toHex({
    r: from.r + (to.r - from.r) * t,
    g: from.g + (to.g - from.g) * t,
    b: from.b + (to.b - from.b) * t,
  });
}

/** `rgba()` string for translucent surfaces. */
export function withAlpha(color: string, alpha: number): string {
  const rgb = parseHex(color) ?? { r: 0, g: 0, b: 0 };
  const a = Math.max(0, Math.min(1, alpha));
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
}

/** Moves a colour toward white (`amount > 0`) or black (`amount < 0`). */
export function shift(color: string, amount: number): string {
  return amount >= 0 ? mix(color, "#ffffff", amount) : mix(color, "#000000", -amount);
}

function channelLuminance(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(color: string): number {
  const rgb = parseHex(color) ?? { r: 0, g: 0, b: 0 };
  return (
    0.2126 * channelLuminance(rgb.r) +
    0.7152 * channelLuminance(rgb.g) +
    0.0722 * channelLuminance(rgb.b)
  );
}

/** WCAG 2.1 contrast ratio, rounded to two decimals (1 – 21). */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
}

export function isLight(color: string): boolean {
  return relativeLuminance(color) > 0.35;
}

/**
 * Nudges `foreground` toward white or black until it clears `target`
 * against `background`. Returns the best available option when the target
 * cannot be reached (which only happens for mid-grey backgrounds).
 */
export function ensureContrast(foreground: string, background: string, target = 4.5): string {
  const base = safeHex(foreground);
  if (contrastRatio(base, background) >= target) return base;

  const towardWhite = !isLight(background);
  let best = base;
  let bestRatio = contrastRatio(base, background);

  for (let step = 1; step <= 20; step += 1) {
    const candidate = mix(base, towardWhite ? "#ffffff" : "#000000", step / 20);
    const ratio = contrastRatio(candidate, background);
    if (ratio > bestRatio) {
      best = candidate;
      bestRatio = ratio;
    }
    if (ratio >= target) return candidate;
  }

  return best;
}

/** Picks whichever of the candidates reads best on `background`. */
export function bestForeground(
  background: string,
  candidates: readonly string[] = ["#ffffff", "#0b0f19"]
): string {
  let best = candidates[0];
  let bestRatio = -1;

  for (const candidate of candidates) {
    const ratio = contrastRatio(candidate, background);
    if (ratio > bestRatio) {
      best = candidate;
      bestRatio = ratio;
    }
  }

  return best;
}

export interface ContrastCheck {
  label: string;
  foreground: string;
  background: string;
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
}

/** Builds an audit row for one foreground/background pair. */
export function checkContrast(
  label: string,
  foreground: string,
  background: string
): ContrastCheck {
  const ratio = contrastRatio(foreground, background);
  return {
    label,
    foreground,
    background,
    ratio,
    passesAA: ratio >= 4.5,
    passesAAA: ratio >= 7,
  };
}
