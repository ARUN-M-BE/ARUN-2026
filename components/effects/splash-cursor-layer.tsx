"use client";

import { useEffect, useState } from "react";
import SplashCursor from "@/components/effects/splash-cursor";

/**
 * Mounts the React Bits `SplashCursor` ink trail for the whole site.
 *
 * The WebGL simulation compiles ~15 shader programs and allocates float
 * framebuffers, so it is never started during first paint: the layer only
 * arms on fine pointers without `prefers-reduced-motion`, and only once the
 * browser reports an idle slot. The palette is read from whatever theme is
 * published, then kept in sync through a mutation observer.
 */

type CursorTheme = "dark" | "light";
type Quality = "low" | "medium" | "high";

interface Ink {
  theme: CursorTheme;
  palette: string[];
}

interface LayerState extends Ink {
  quality: Quality;
  intro: boolean;
}

/** Midnight Aurora fallbacks used when the CSS tokens cannot be probed. */
const FALLBACK: Record<CursorTheme, string[]> = {
  dark: ["#818cf8", "#22d3ee", "#c4b5fd"],
  light: ["#4f46e5", "#0891b2", "#7c3aed"],
};

const INTRO_KEY = "splash-cursor:intro";
/** Idle delay before the simulation warms up, in ms. */
const ARM_DELAY = 900;

let probe: CanvasRenderingContext2D | null;

/**
 * Normalises any CSS colour (hex, rgb, oklch, named) to the `#rrggbb` form the
 * shader's `parseColor` understands. Returns null for unparseable input.
 */
function toHex(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  if (probe === undefined) {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    probe = canvas.getContext("2d", { willReadFrequently: true });
  }
  if (!probe) return null;
  probe.clearRect(0, 0, 1, 1);
  probe.fillStyle = "#000000";
  probe.fillStyle = value;
  probe.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = probe.getImageData(0, 0, 1, 1).data;
  if (a === 0 || (r === 0 && g === 0 && b === 0)) return null;
  const channel = (c: number) => c.toString(16).padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

/** Reads the ink palette from the theme that is on screen right now. */
function readInk(): Ink {
  // The alternative designs are dark-only and publish their own accents.
  const shell = document.querySelector<HTMLElement>("[data-design-shell]");
  const scope: HTMLElement = shell ?? document.documentElement;
  const styles = getComputedStyle(scope);
  const tokens = shell ? ["--pf-accent", "--pf-accent-2"] : ["--primary", "--accent"];
  const dark = Boolean(shell) || document.documentElement.classList.contains("dark");
  const theme: CursorTheme = dark ? "dark" : "light";

  const palette = tokens
    .map((token) => toHex(styles.getPropertyValue(token)))
    .filter((color): color is string => Boolean(color));

  return { theme, palette: palette.length ? palette : FALLBACK[theme] };
}

function sameInk(a: Ink, b: Ink): boolean {
  return (
    a.theme === b.theme &&
    a.palette.length === b.palette.length &&
    a.palette.every((color, index) => color === b.palette[index])
  );
}

/** Heavier presets only where the hardware and the viewport can afford them. */
function pickQuality(): Quality {
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  if (cores <= 4 || memory <= 4 || window.innerWidth < 1024) return "low";
  return "medium";
}

/** The intro stroke plays once per browser session, and never on reduced motion. */
function claimIntro(): boolean {
  try {
    const seen = sessionStorage.getItem(INTRO_KEY) === "1";
    sessionStorage.setItem(INTRO_KEY, "1");
    return !seen;
  } catch {
    return false;
  }
}

export interface SplashCursorLayerProps {
  /** Stacking order — above the content, under the navbar and any dialog. */
  zIndex?: number;
}

export function SplashCursorLayer({ zIndex = 20 }: SplashCursorLayerProps) {
  const [layer, setLayer] = useState<LayerState | null>(null);
  const armed = layer !== null;

  // Arm once, after the first paint, and only on devices where the effect is
  // both meaningful and cheap enough. State is written from the idle callback
  // rather than the effect body, so the mount stays a single commit.
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    const arm = () => {
      if (cancelled) return;
      setLayer({
        ...readInk(),
        quality: pickQuality(),
        intro: claimIntro(),
      });
    };

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(arm, { timeout: ARM_DELAY * 3 })
      : window.setTimeout(arm, ARM_DELAY);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, []);

  // Theme switches rewrite <html> tokens in place; re-probe without restarting
  // the simulation so the ink always matches the published palette.
  useEffect(() => {
    if (!armed) return;
    const observer = new MutationObserver(() => {
      setLayer((previous) => {
        if (!previous) return previous;
        const next = readInk();
        return sameInk(previous, next) ? previous : { ...previous, ...next };
      });
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "data-mode", "style"],
    });
    return () => observer.disconnect();
  }, [armed]);

  if (!layer) return null;

  return (
    <SplashCursor
      colors={layer.palette}
      rainbow={false}
      colorSpeed={0.35}
      intensity={0.85}
      size={1}
      force={1}
      swirl={3}
      trail={1.35}
      momentum={1}
      shading={1}
      glow={layer.theme === "dark" ? 0.55 : 0.2}
      quality={layer.quality}
      clickSplash
      intro={layer.intro}
      theme={layer.theme}
      zIndex={zIndex}
    />
  );
}
