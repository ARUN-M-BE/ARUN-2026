---
name: 33-js-concepts-seo-review
description: Comprehensive JavaScript engine mastery and Technical SEO audit. Covers event loop, microtasks, closures, memory management, JSON-LD Schema markup, OpenGraph, Canonical URLs, and Web Vitals.
version: 1.0.0
---

# 33 JS Concepts & SEO Review

## 1. Core JavaScript Engine Best Practices
- **Closures & Scope**: Prevent memory retention in persistent listeners by scoping variables cleanly and detaching listeners in `useEffect` returns.
- **Event Loop & Timers**: Use `requestAnimationFrame` for continuous visual animations and proper `clearInterval`/`clearTimeout` cleanups.
- **Asynchronous Flow**: Handle Promises with explicit error catch boundaries and fallback states.
- **Type Invariants**: Rely on TypeScript strict mode with zero `any` slips in domain interfaces.

## 2. Technical SEO & Rich Snippets
- **JSON-LD Structured Data**: Provide `Person` schema with `jobTitle`, `alumniOf`, `knowsAbout`, `sameAs`, and `offers`.
- **Open Graph & Twitter Cards**: High-resolution preview images (`1200x630`), canonical URL tags, descriptive titles.
- **Semantic HTML**: Proper heading outline (`h1` -> `h2` -> `h3`), `<main>`, `<article>`, `<section>`, `<nav>`, `<aside>`, `<header>`, `<footer>`.
- **Core Web Vitals**:
  - LCP < 1.2s: Preload critical assets, dynamically import heavy 3D canvases.
  - CLS < 0.05: Explicit aspect ratios and skeleton containers for all dynamic cards and canvases.
  - INP < 100ms: Debounce inputs and offload heavy computation.

