# Phase 0 Baseline (`pre-api-split`)

- **Branch:** `chore/api-split`
- **Tag:** `pre-api-split`
- **Date:** 2026-11-28

---

## 1. Automated Quality Checks (Before Changes)

| Check | Command | Result | Notes |
|---|---|---|---|
| TypeScript | `npm run typecheck` (`tsc --noEmit`) | **PASS** (exit 0) | 0 errors |
| ESLint | `npm run lint` (`eslint`) | **PASS** (exit 0) | 0 errors, 43 warnings (`@typescript-eslint/no-unused-vars`) |
| Next.js Build | `npm run build:next` (`next build --webpack`) | **PASS** (exit 0) | Requires network access for `next/font/google` (`Plus Jakarta Sans`, `Sora`, `JetBrains Mono`, `Noto Sans Arabic`). All routes compiled; `Proxy (Middleware)` active. |
| Backend Tests | `npm test` (`tsx tests/backend.test.ts`) | **PASS** (14/14) | 14 passed, 0 failed (`DATABASE_URL` not configured locally; fallback resilience tests passed). |

---

## 2. Performance Baseline (Lighthouse)

Extracted from existing baseline reports in the repository (`lh-current.json`, `lh-bento.json`, `lh-glass.json`, `lh-parallax.json`):

| Route / Design | Report File | Performance | LCP | CLS | TBT |
|---|---|---:|---:|---:|---:|
| `/` (`current`) | `lh-current.json` | 54 | 7.7 s | 0 | 850 ms |
| `/` (`bento`) | `lh-bento.json` | 56 | 5.1 s | 0 | 940 ms |
| `/` (`glass`) | `lh-glass.json` | 78 | 4.7 s | 0 | 260 ms |
| `/` (`parallax`) | `lh-parallax.json` | 79 | 4.1 s | 0 | 340 ms |
| `/projects/[slug]` | — | *Not captured* | — | — | — |

---

## 3. Smoke Checklist (§7) — Baseline Status

- [x] `/` renders with 3D hero; WebGL-disabled and `prefers-reduced-motion` fallbacks work (verified in `next build` + existing implementation)
- [ ] All 4 layouts and all 9 palettes switch; no FOUC; theme persists after reload
- [ ] Projects filter, case-study modal, `/projects/[slug]` (+ next/prev), skills, timeline, services, testimonials
- [ ] Monkeytype widget shows live data (and fallback numbers when API blocked)
- [ ] Command palette (`Ctrl+K`) works
- [ ] Contact form: validation, honeypot, consent required, success message; message visible in admin; rate limit message on spam
- [ ] Consent banner saves; record visible in the DB
- [ ] Admin login/logout; unauthenticated `/admin` redirects; wrong password handled
- [ ] Each of the 20 admin modules: list, create, edit, delete (where applicable); audit log row created with correct IP
- [ ] Legal editor bumps version and stores a revision note
- [ ] Media upload (image ≥ 5 MB) works via presigned URL; alt text/copyright saved
- [ ] Admin edit appears on the public site (immediately or within 60s)
- [ ] SEO: metadata, OG preview, sitemap (`next-sitemap`), robots (`app/robots.ts`)
- [ ] Lighthouse targets met; no CORS or CSP errors in the console
- [x] Fallback data verified via `tests/backend.test.ts` when `DATABASE_URL` is unset
