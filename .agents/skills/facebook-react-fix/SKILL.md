---
name: facebook-react-fix
description: Modern React 19 and Next.js 16 best practices, bug fixing, anti-pattern remediation, hydration mismatch fixes, and strict concurrent mode optimization.
version: 1.0.0
---

# Modern React Best Practices & Anti-Pattern Fixes

## 1. Hydration Mismatch Remediation
- Never render server-different values without mounting gates:
  ```tsx
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <SkeletonLoader />;
  ```
- Use `suppressHydrationWarning` strictly on `<html>` for theme class injection.

## 2. Server vs Client Component Boundaries
- Keep `"use client"` strictly at leaves where interactivity or browser APIs (`window`, `localStorage`, WebGL) are needed.
- Keep data-fetching, database access, and SEO metadata in Server Components or Server Actions.

## 3. State Management & Re-render Prevention
- Derive state during render instead of chaining `useEffect` calls.
- Wrap complex array filtering and SVG path calculations with `useMemo`.
- Clean up event listeners, intervals, and Three.js resources in effect cleanup functions.

## 4. Key Management & Reconciliation
- Never use array indices as React keys on reorderable lists; use stable unique IDs (`item.id`).
- Ensure consistent fragment structures across conditional branches.

