---
name: ui-ux-pro-max
description: Elite UI/UX design and frontend craftsmanship principles. Focuses on visual hierarchy, bespoke typography, micro-interactions, dark/light themes, 3D WebGL immersion, accessible contrast, and zero layout shift.
version: 2.0.0
---

# UI/UX Pro Max Design Principles

## 1. Visual Hierarchy & Spatial Rhythm
- Apply strict 8-point baseline grid spacing (`space-y-4`, `gap-6`, `p-8`).
- Contrast ratios: Maintain WCAG 2.1 AA (4.5:1 for body, 3:1 for large headers).
- Layering: Ambient glow blur backgrounds (`blur-[120px]`), frosted glass cards (`backdrop-blur-xl bg-card/60 border border-border/80`), floating interactive elements.

## 2. Micro-Interactions & Motion Design
- Every interactive element must provide feedback: hover transitions (scale, border glow, shadow shift), active/press feedback, and keyboard focus rings.
- Hardware-accelerated transitions: transform and opacity only (`transition-all duration-300`).
- Reduced motion support: Always respect `@media (prefers-reduced-motion: reduce)`.

## 3. 3D & Canvas Integration
- Fallbacks: Always provide elegant 2D/CSS fallbacks if WebGL is unavailable or during SSR.
- Performance budgets: Target stable 60 FPS, throttle mouse movement listeners, and dispose geometries/materials upon unmount to eliminate memory leaks.

## 4. Theme & Palette Harmony
- Tri-color neon accents (Cyan `#06b6d4`, Violet `#8b5cf6`, Amber `#f59e0b`).
- Clean theme transitions with zero flash of unstyled content (FOUC).
- Semantic colors for status badges: Emerald for online/success, Amber for warning, Rose for destructive.
