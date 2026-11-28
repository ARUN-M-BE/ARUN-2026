# Phase 1 — API & Server Usage Inventory (`docs/API_USAGE.md`)

> **Note on API Repo Prerequisite:** `https://api-dev.arun-m.in/arun` is not currently resolvable from this environment and `arun-api/docs/INVENTORY.md` is not present on disk. Endpoint mappings below align with `D:\project_api\api.md` (`/arun/api/*`) and existing `app/api/*` routes, and should be cross-checked against `arun-api/docs/INVENTORY.md` before Phase 3 cutover.

---

## 1. Direct `fetch('/api/...')` Calls in Client Components

| File & Line | Method & Path | Caller Component | Purpose / Target API Endpoint |
|---|---|---|---|
| `components/portfolio/page-view-tracker.tsx:57` | `POST /api/analytics/pageview` | `PageViewTracker` | Consent-gated (`cookie_consent_preferences.analytics`) `keepalive` beacon → `POST /api/analytics/pageview` |
| `components/portfolio/realtime-telemetry.tsx:49` | `GET /api/analytics/pageview` | `RealtimeTelemetry` | Live page-view summary (`no-store`) → `GET /api/analytics/pageview` |
| `components/portfolio/realtime-telemetry.tsx:50` | `GET /api/integrations/monkeytype` | `RealtimeTelemetry` | Live Monkeytype typing stats (`no-store`) → `GET /api/integrations/monkeytype` |
| `components/admin/features/api-management/ApiManagementClient.tsx:178` | `GET` / `POST` dynamic (`API_ENDPOINTS`) | `ApiManagementClient` | Tests `/api/health`, `/api/projects`, `/api/navigation`, `/api/sections`, `/api/social-links`, `/api/analytics/pageview`, `/api/integrations/resend`, `/api/integrations/monkeytype`, `/api/integrations/ipstack`, `/api/integrations/upstash` |

---

## 2. Server Actions (`lib/actions.ts` & `lib/design-actions.ts`) → API Endpoints

### 2.1 Public Reads (Target: `getPublic()` with `revalidate` + `tags` + `fallback-data.ts`)

| Server Action | Caller(s) | Return Shape | Target Endpoint |
|---|---|---|---|
| `getPublicProfile()` | `lib/portfolio-content.ts` | `Profile \| null` | `GET /api/public/bootstrap` or `GET /api/profile` |
| `getPublicProjects()` | `lib/portfolio-content.ts`, `app/projects/[slug]/page.tsx` | `Project[]` | `GET /api/projects` |
| `getPublicProjectBySlug(slug)` | `app/projects/[slug]/page.tsx` | `Project \| null` | `GET /api/projects/:slug` |
| `getPublicSkills()` | `lib/portfolio-content.ts` | `SkillCategory[]` | `GET /api/skills` |
| `getPublicExperience()` | `lib/portfolio-content.ts` | `Experience[]` | `GET /api/experience` |
| `getPublicEducation()` | `lib/portfolio-content.ts` | `Education[]` | `GET /api/education` |
| `getPublicCertifications()` | `lib/portfolio-content.ts` | `Certification[]` | `GET /api/certifications` |
| `getPublicServices()` | `lib/portfolio-content.ts` | `ServiceOffering[]` | `GET /api/services` |
| `getPublicTestimonials()` | `lib/portfolio-content.ts` | `Testimonial[]` | `GET /api/testimonials` |
| `getPublicSocialLinks(placement?)` | `lib/portfolio-content.ts` | `SocialLink[]` | `GET /api/social-links` |
| `getPublicNavigation()` | `lib/portfolio-content.ts` | `NavigationItem[]` | `GET /api/navigation` |
| `getPublicSections()` | `lib/portfolio-content.ts` | `WebsiteSection[]` | `GET /api/sections` |
| `getLegalDocumentBySlug(slug)` | `app/legal/[slug]/page.tsx` | `LegalDocument \| null` | `GET /api/legal/:slug` |

### 2.2 Public Mutations (Target: Browser → API directly via `apiFetch(..., { credentials: 'include' })`)

| Server Action | Caller | Return Shape | Target Endpoint |
|---|---|---|---|
| `submitContactForm(data)` | `components/portfolio/contact-section.tsx` | `{ success: boolean; error?: string }` | `POST /api/contact` |
| `recordConsent(data)` | `components/portfolio/cookie-consent.tsx` | `{ success: boolean; error?: string }` | `POST /api/consent` |

### 2.3 Admin Reads & Mutations (Target: Browser → API via `apiFetch` with `no-store` / `credentials: 'include'`)

| Module | Server Actions Used (`lib/actions.ts` / `lib/design-actions.ts`) | Caller Components (`components/admin/features/...`) | Target API Endpoints |
|---|---|---|---|
| **Dashboard** | `getDashboardStats`, `getContactMessages`, `getProfile` | `dashboard/DashboardServer.tsx` | `GET /api/admin/dashboard`, `GET /api/admin/messages`, `GET /api/admin/profile` |
| **Profile** | `getProfile`, `updateProfile` | `profile/ProfileServer.tsx`, `profile/ProfileClient.tsx` | `GET/PUT /api/admin/profile` |
| **Projects** | `getProjects`, `getProjectById`, `createProject`, `updateProject`, `deleteProject` | `projects/*` | `GET/POST /api/admin/projects`, `GET/PUT/DELETE /api/admin/projects/:id` |
| **Skills** | `getSkillCategories`, `createSkillCategory`, `updateSkillCategory`, `deleteSkillCategory`, `getSkills`, `createSkill`, `updateSkill`, `deleteSkill` | `skills/SkillsServer.tsx`, `skills/SkillsClient.tsx` | `GET/POST/PUT/DELETE /api/admin/skill-categories`, `GET/POST/PUT/DELETE /api/admin/skills` |
| **Experience** | `getExperiences`, `createExperience`, `updateExperience`, `deleteExperience` | `experience/*` | `GET/POST /api/admin/experience`, `PUT/DELETE /api/admin/experience/:id` |
| **Education** | `getEducation`, `createEducation`, `updateEducation`, `deleteEducation` | `education/*` | `GET/POST /api/admin/education`, `PUT/DELETE /api/admin/education/:id` |
| **Certifications** | `getCertifications`, `createCertification`, `updateCertification`, `deleteCertification` | `certifications/*` | `GET/POST /api/admin/certifications`, `PUT/DELETE /api/admin/certifications/:id` |
| **Services** | `getServices`, `createService`, `updateService`, `deleteService` | `services/*` | `GET/POST /api/admin/services`, `PUT/DELETE /api/admin/services/:id` |
| **Testimonials** | `getTestimonials`, `createTestimonial`, `updateTestimonial`, `deleteTestimonial` | `testimonials/*` | `GET/POST /api/admin/testimonials`, `PUT/DELETE /api/admin/testimonials/:id` |
| **Messages** | `getContactMessages`, `updateMessageStatus`, `deleteMessage` | `messages/*` | `GET /api/admin/messages`, `PATCH/DELETE /api/admin/messages/:id` |
| **Social Links** | `getSocialLinks`, `createSocialLink`, `updateSocialLink`, `deleteSocialLink`, `reorderSocialLinks` | `social-links/*`, `app/api/social-links/route.ts` | `GET/POST /api/admin/social-links`, `PUT/DELETE /api/admin/social-links/:id`, `PATCH /api/admin/social-links/reorder` |
| **Navigation** | `getNavigation`, `createNavigation`, `updateNavigation`, `deleteNavigation`, `reorderNavigation` | `navigation/*`, `app/api/navigation/route.ts` | `GET/POST /api/admin/navigation`, `PUT/DELETE /api/admin/navigation/:id`, `PATCH /api/admin/navigation/reorder` |
| **Sections** | `getSections`, `createSection`, `updateSection`, `duplicateSection`, `deleteSection`, `reorderSections`, `toggleSectionStatus` | `sections/*`, `app/api/sections/route.ts` | `GET/POST /api/admin/sections`, `PUT/DELETE /api/admin/sections/:id`, `POST .../duplicate`, `PATCH .../reorder`, `PATCH .../status` |
| **Settings** | `getSiteSettings`, `updateSiteSetting`, `setActiveTheme` | `settings/*` | `GET/PUT /api/admin/settings`, `PUT /api/admin/settings/theme` |
| **Appearance / Design** | `saveDesignDraft`, `resetDesignDraft`, `selectDesignTheme`, `publishDesignTheme`, `savePaletteTheme`, `setPalettePickerEnabled`, `setDesignViewerToggle`, `rollbackDesignTheme` | `appearance/*`, `lib/design-actions.ts` | `PUT /api/admin/design/*` / `PUT /api/admin/settings` |
| **SEO** | `getSeoMetadata`, `upsertSeoMetadata` | `seo/*` | `GET/PUT /api/admin/seo` |
| **Legal** | `getLegalDocuments`, `updateLegalDocument`, `deleteLegalDocument` | `legal/*` | `GET /api/admin/legal`, `PUT/DELETE /api/admin/legal/:id` |
| **Media** | `getMediaAssets`, `createMediaAsset`, `deleteMediaAsset` | `media/*` | `POST /api/admin/media/presign`, `GET/POST /api/admin/media`, `DELETE /api/admin/media/:id` |
| **Audit Log** | `getAuditLogs` | `audit-log/*` | `GET /api/admin/audit-log` |

---

## 3. Server Components, Auth, Metadata, Sitemap, Robots & Proxy

| File | Server Dependency | Migration Plan |
|---|---|---|
| `app/layout.tsx` | Calls `getThemePreferences()` (`SettingsRepository.findMany()` + `cookies()`); reads `process.env.NEXT_PUBLIC_SITE_URL` | Fetch `GET /public/bootstrap` via `getPublic()` with fallback; keep cookie-first theme resolution & inline `<html>` CSS vars |
| `app/page.tsx` | Calls `getPortfolioContent()`, `resolvePageView()`, `getActiveTheme()` | Use `getPublic('/api/public/bootstrap')` + `fallback-data.ts` |
| `app/projects/[slug]/page.tsx` | Calls `getPublicProjectBySlug(slug)` (direct Drizzle `db.select()`), `getPublicProjects()` in `generateMetadata` & page | Replace with `getPublic('/api/projects/' + slug)` and `getPublic('/api/projects')` with fallback |
| `app/legal/[slug]/page.tsx` | Calls `getLegalDocumentBySlug(slug)` | Replace with `getPublic('/api/legal/' + slug)` with fallback |
| `app/admin/layout.tsx` | Calls `auth()` (`@/lib/auth`), redirects to `/admin/login` | Forward `Cookie` header to `GET /api/auth/me` (`no-store`) when `isRemoteApi` is true |
| `app/admin/login/page.tsx` | Calls `signIn("credentials", ...)` from `next-auth/react` | Call `POST /api/auth/login` via `apiFetch` when `isRemoteApi` is true |
| `components/admin/features/*/*Server.tsx` | All 20 admin `*Server.tsx` files call `requireAdmin()` (`@/lib/auth-guard`) + `lib/actions.ts` | Gate via `GET /api/auth/me` or client-side `apiFetch` with `useAdminSession()` |
| `app/robots.ts` | Reads `process.env.NEXT_PUBLIC_SITE_URL` | Keep (public env var) |
| `next-sitemap.config.js` | Reads `process.env.NEXT_PUBLIC_SITE_URL` | Keep (public env var) |
| `proxy.ts` | Uses `getToken` from `next-auth/jwt` + `AUTH_SECRET` to guard `/admin/*`, redirects `/admin/login` | In remote API mode, check only for session cookie existence (UX redirect); real auth enforced by API |

---

## 4. Theme Resolution Flow

1. **File:** `lib/theme.ts` (`getThemePreferences`, `getActiveTheme`) + `lib/design-settings.ts` (`getDesignState`)
2. **Current Flow:**
   - Reads `SettingsRepository.findMany()` from PostgreSQL (`theme.active`, `theme.mode`, `theme.picker_enabled`, `design.*`).
   - Reads visitor cookies `pf_theme` and `pf_theme_mode` via `cookies()`.
   - Resolves `ThemeSurface` via `resolveTheme(...)` from `config/themes.ts`.
   - `app/layout.tsx` writes `theme.vars` as inline `style` CSS custom properties onto `<html>` (`suppressHydrationWarning`), eliminating FOUC.
3. **Target Flow (Stage A):**
   - Replace `SettingsRepository.findMany()` with `getPublic('/api/public/bootstrap', fallback)` (cached with `revalidate: 60`, `tags: ['settings']`).
   - Keep cookie priority (`pf_theme`, `pf_theme_mode`) and inline `<html>` style serialization unchanged.

---

## 5. CSP / Security Headers & `wrangler.jsonc` Vars

### 5.1 `next.config.ts` Headers
- Currently sets `Strict-Transport-Security`, `X-DNS-Prefetch-Control`, `X-XSS-Protection`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- **No `Content-Security-Policy` header is currently defined** in `next.config.ts` (we should add or ensure `connect-src` / `img-src` allows `NEXT_PUBLIC_API_URL` origin if/when CSP is configured).

### 5.2 `wrangler.jsonc` `vars`
- **Public vars (keep):** `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL` (currently `https://api.arun-m.in`, update to `https://api.arun-m.in/arun` in prod and `https://api-dev.arun-m.in/arun` in `env.dev`).
- **Legacy/Server vars (remove in Stage B):** `NEXTAUTH_URL`, `ADMIN_EMAIL`, `API_MANAGEMENT_URL`, `NEON_BRANCH`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_JWKS_URL`, `NEON_REALTIME_URL`, `AWS_ENDPOINT_URL_S3`, `AWS_REGION`, `RESEND_FROM_EMAIL`, `UPSTASH_REDIS_REST_URL`.
