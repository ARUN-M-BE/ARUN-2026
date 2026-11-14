"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { designToCssVars, motionDistance, motionDuration, type DesignConfig } from "@/config/designs";
import ShinyText from "@/components/ShinyText";

/**
 * Shared client primitives for the alternative designs. They only provide
 * motion + token plumbing — every design owns its own markup.
 */

export interface DesignMotion {
  reduceMotion: boolean;
  duration: number;
  distance: number;
  /** 0 – 1 multiplier for offsets so intent survives reduced motion. */
  intensity: number;
}

export function useDesignMotion(config: DesignConfig): DesignMotion {
  const reduce = useReducedMotion();
  return {
    reduceMotion: Boolean(reduce),
    duration: motionDuration(config),
    distance: motionDistance(config),
    intensity: config.animation / 100,
  };
}

/** Root surface: writes the design tokens, base font and background. */
export function DesignShell({
  config,
  children,
  className = "",
  id,
}: {
  config: DesignConfig;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const style = {
    ...designToCssVars(config),
    backgroundColor: "var(--pf-bg)",
    color: "#f5f6f8",
    fontFamily: "var(--pf-font)",
  } as CSSProperties;

  return (
    <div
      id={id}
      data-design-shell
      style={style}
      className={`relative min-h-screen w-full overflow-x-hidden ${className}`}
    >
      {children}
    </div>
  );
}

/** Scroll-linked vertical drift for a depth layer (0 = pinned, 1 = fastest). */
export function useDepth(config: DesignConfig, depth = 1) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const magnitude = (config.parallax / 100) * 140 * depth;
  const y = useTransform(scrollYProgress, [0, 1], [0, -magnitude]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.85, 0.35]);
  return { ref, y, opacity };
}

/** Viewport reveal that respects both reduced-motion and animation intensity. */
export function Reveal({
  config,
  children,
  delay = 0,
  className = "",
  as = "div",
  eager = false,
}: {
  config: DesignConfig;
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
  /** Slide-only entrance that stays painted at full opacity for LCP. */
  eager?: boolean;
}) {
  const { reduceMotion, duration, distance } = useDesignMotion(config);
  const MotionTag = motion[as];

  if (reduceMotion) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <MotionTag
      className={className}
      initial={eager ? { opacity: 1, y: distance / 2 } : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/** Small uppercase label used by the editorial designs. */
export function DesignEyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] ${className}`}
    >
      <span className="h-px w-6 bg-[var(--pf-accent-line)]" aria-hidden />
      {/* 0.58 alpha clears AA for 10px text on the near-black backdrop; 0.45
          measured 4.3:1, which is just under the 4.5 threshold. */}
      <ShinyText color="rgba(255,255,255,0.58)" shineColor="var(--pf-accent)" className="tracking-[0.28em]">
        {children}
      </ShinyText>
    </span>
  );
}

/** Accent-tinted pill used for stacks, tags and meta. */
export function DesignPill({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "accent" | "outline";
}) {
  const tones: Record<string, string> = {
    muted: "bg-white/[0.05] text-white/70 border-white/10",
    accent: "text-[var(--pf-accent)] border-[var(--pf-accent-line)] bg-[var(--pf-accent-soft)]",
    outline: "border-white/15 text-white/60 bg-transparent",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
