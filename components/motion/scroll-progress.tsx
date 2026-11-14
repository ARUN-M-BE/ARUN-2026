"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/**
 * Reading-progress indicator pinned to the top of the viewport.
 * Uses a spring so the bar trails the scroll position with a natural weight,
 * and renders nothing when the visitor prefers reduced motion.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-primary via-accent to-indigo-500"
    />
  );
}
