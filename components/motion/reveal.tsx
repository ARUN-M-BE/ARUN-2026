"use client";

import type { ReactNode } from "react";
// Import from `framer-motion` (not `motion/react`): the project already ships
// framer-motion everywhere else, and mixing both package entry points pulls a
// second copy of the animation engine into the client bundle.
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * Shared easing + timing tokens so every section animates with the same rhythm.
 * `easeOut` keeps entrances snappy at the start and calm at the end.
 */
const REVEAL_TRANSITION = {
  duration: 0.55,
  ease: "easeOut",
} as const;

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: REVEAL_TRANSITION },
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before animating in. */
  delay?: number;
  /** Vertical offset in pixels for the entrance. */
  y?: number;
  /** Fraction of the element that must be visible before triggering. */
  amount?: number;
  /**
   * Keep the first frame painted at full opacity (slide-only entrance). Use for
   * above-the-fold content: a fade from `opacity: 0` makes the element
   * invisible until hydration finishes, which pushes Largest Contentful Paint
   * out to whenever the client bundle executes.
   */
  eager?: boolean;
}

/**
 * Fade + slide entrance driven by scroll position.
 * Automatically disables itself when the user prefers reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  amount = 0.15,
  eager = false,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={eager ? { opacity: 1, y: y / 2 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ ...REVEAL_TRANSITION, delay }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  amount?: number;
}

/** Parent that releases its `StaggerItem` children in sequence when scrolled into view. */
export function StaggerGroup({ children, className, amount = 0.1 }: StaggerProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

/** Individual child of `StaggerGroup`. */
export function StaggerItem({ children, className }: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={staggerItemVariants} className={cn("will-change-transform", className)}>
      {children}
    </motion.div>
  );
}

interface HoverLiftProps {
  children: ReactNode;
  className?: string;
  /** Strength of the lift in pixels. */
  distance?: number;
}

/** Subtle tactile feedback for cards and tiles. */
export function HoverLift({ children, className, distance = 6 }: HoverLiftProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{ y: -distance }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
