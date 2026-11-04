---
name: responsive-web-design
description: Elite responsive web design mastery. Covers fluid typography, dynamic clamp() scaling, CSS grid/flexbox adaptability, mobile-first breakpoints, touch target ergonomics (>=44px), zero horizontal overflow, and adaptive layouts across mobile, tablet, laptop, and ultrawide monitors.
version: 1.0.0
---

# Responsive Web Design Best Practices

## 1. Viewport & Fluid Scaling
- Mobile-first approach: write base styles for small screens (`<640px`) and scale progressively with `sm:`, `md:`, `lg:`, `xl:`, `2xl:`.
- Fluid sizing: Use `clamp()` for headings and spacing so text never feels cramped on 375px screens or awkwardly stretched on 4K displays.
- Safe area insets: Respect iOS notch and bottom bar with `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.

## 2. Layout & Grid Resilience
- Avoid hardcoded fixed pixel widths (`w-[500px]`); use `max-w-* w-full`.
- Prevent horizontal scrollbars (`overflow-x: hidden` on viewport roots, container max-widths).
- Flexible auto-fit grids: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`.

## 3. Touch Ergonomics & Accessibility
- Minimum tap target size: 44x44px for buttons, navigation links, and dropdown toggles on mobile touch devices.
- Adequate line-height (`leading-relaxed` / `leading-normal`) and readable font sizes (minimum 14px for body text on mobile).
- Responsive navigation: Drawer/Sheet for mobile viewports, seamless horizontal navbar for desktop.
