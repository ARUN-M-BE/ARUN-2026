# Original Immersive 3D Developer Portfolio & Admin CMS

A world-class, interactive 3D personal developer portfolio engineered with **Next.js 16 App Router**, **TypeScript**, **PostgreSQL**, **Drizzle ORM**, **Three.js**, and **React Three Fiber**.

Featuring an original futuristic digital universe design, interactive identity sculpture, guided portfolio tour, skills constellation, timeline, and an enterprise-grade `/admin` CMS dashboard.

## Admin Feature Organization

Admin route files are lightweight entry points that render feature Server Components inside a shared Suspense fallback. Feature components live under `components/admin/features/<feature>/`, with data loading and authorization in Server Components, interactive views and forms in Client Components, and shared forms in each feature's `shared/` directory. Database-backed actions, authentication, and public portfolio routes remain unchanged; admin data is not replaced with localStorage mock persistence.

---

## 🌟 Visual Identity & Core Architecture

- **Visual Direction:** Midnight/charcoal theme (`#08090e`) with electric cyan (`#06b6d4`), cosmic violet (`#8b5cf6`), and subtle amber (`#f59e0b`) accents.
- **3D Interactive Engine:** React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`), and custom GLSL lighting/geometry shaders.
- **Micro-Interactions & Transitions:** Smooth camera parallax, glassmorphism (`backdrop-filter: blur(16px)`), and accessibility-first motion reduction.
- **Dynamic CMS:** Complete CRUD operations powered by PostgreSQL with automatic Next.js cache revalidation.
- **Compliance & Privacy:** Full implementation of India's **Digital Personal Data Protection Act, 2023 (DPDP Act)**, **DPDP Rules 2025**, and the **Information Technology Act, 2000**. Target **WCAG 2.2 AA**.

---

## 🚀 Key Modules & Capabilities

### 1. Public Interactive Universe
1. **Cinematic 3D Hero:** Custom animated geometric identity sculpture reacting to mouse orbit, with volumetric lighting and stardust particles.
2. **Guided Portfolio Tour:** Step-by-step interactive walk-through with Next, Previous, and Skip controls.
3. **Project Universe:** Interactive project showcase with category filters, full case-study modals, live links, and repository access.
4. **Skills Constellation:** Grouped technical proficiency clusters with progress bars and featured mastery badges.
5. **Career Milestones Timeline:** Vertical chronological trajectory showcasing leadership, achievements, and tech stacks.
6. **Education & Certifications Archive:** Academic degrees and verified credentials with one-click verification links.
7. **Personal Story & Philosophy:** Narrative bio with technical DNA pillars (Architecture, 3D WebGL, Security, Performance).
8. **Direct Contact Nexus:** Contact form with spam protection and mandatory DPDP 2023 consent capture.
9. **Command Palette (`Ctrl+K`):** Fast keyboard-driven universe navigation.
10. **Audio Ambience Toggle:** Optional synth chime (disabled by default).
11. **Cookie Preference Manager:** Granular essential vs. optional controls with consent audit recording.

### 2. Comprehensive Admin CMS (`/admin`)
- **Secure Authentication:** NextAuth JWT sessions with bcrypt credential verification.
- **Full CRUD Modules:**
  - 👤 **Profile & Identity:** Name, titles, hero stats, contact availability.
  - 📁 **Projects:** Case studies, slugs, tech stacks, live/repo URLs, featured toggles.
  - ⚡ **Skills & Categories:** Skill clusters, proficiency mastery levels (0–100%).
  - 💼 **Experience Timeline:** Positions, organizations, periods, accomplishments.
  - 🎓 **Education:** Degrees, institutions, majors, academic honors.
  - 🏆 **Certifications:** Licenses, authorities, credential IDs, verification URLs.
  - ✨ **Services:** Consulting packages, scopes, deliverables, pricing.
  - 💬 **Testimonials:** Verified peer reviews and ratings complying with genuine claims legal standards.
  - 🔗 **Social Links:** GitHub, LinkedIn, Twitter/X, Discord, and portfolio handles.
  - 📬 **Messages:** Inbound lead management (unread, read, replied, archived, spam) with DPDP consent proof.
  - 🧭 **Site Navigation:** Header links, quick jumps, and section anchor targets.
  - ⚙️ **Settings & Themes:** Real-time hex color pickers, retention days, site metadata.
  - 🔍 **SEO & Open Graph:** Meta titles, descriptions, social preview cards, robots no-index.
  - ⚖️ **Legal Documents:** Markdown editor with automatic version tracking and review banners.
  - 🖼️ **Media Assets:** Asset library with WCAG alt descriptions and copyright notices.
  - 📜 **Audit Logs:** Immutable chronological log of administrative operations.

---

## 🛠️ Stack & Dependencies

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.2.12 (App Router & Turbopack) |
| **Language** | TypeScript 5 (Strict Mode) |
| **Database** | PostgreSQL (Local instance or Neon serverless) |
| **ORM & Migrations** | Drizzle ORM (`drizzle-orm`, `drizzle-kit`) |
| **Authentication** | NextAuth v5 (Beta) with bcryptjs password hashing |
| **Styling & UI** | Tailwind CSS v4, shadcn/ui, Lucide Icons |
| **3D & Graphics** | Three.js, React Three Fiber, Drei, Postprocessing |
| **Form Validation** | React Hook Form + Zod v3 |
| **SEO & Sitemap** | Dynamic Open Graph, next-sitemap, dynamic `robots.ts` |

---

## 📦 Setup & Local Development

### 1. Clone & Install
```bash
git clone <repository-url>
cd ARUNM
npm install --legacy-peer-deps
```

### 2. Configure Environment (`.env.local`)
Create a `.env.local` file with your database and authentication configuration:

### 3. Initialize Database & Seed
```bash
# Push schema tables and indexes to PostgreSQL
npm run db:push

# Seed default profile, initial admin user, and sample portfolio content
npm run db:seed
```

### 4. Run the Development Server
```bash
npm run dev
```

Visit:
- **Public Portfolio:** `http://localhost:3000`
- **Admin CMS Dashboard:** `http://localhost:3000/admin`

---

## 📜 Available NPM Scripts

| Command | Action |
|---|---|
| `npm run dev` | Start local development server on port 3000 |
| `npm run build` | Compile optimized production build & generate sitemaps |
| `npm run start` | Run compiled production build |
| `npm run typecheck` | Run TypeScript strict compiler verification (`tsc --noEmit`) |
| `npm run db:push` | Synchronize Drizzle schema directly with PostgreSQL |
| `npm run db:generate`| Generate migration files from Drizzle schema |
| `npm run db:migrate` | Execute pending database migrations |
| `npm run db:seed` | Seed database with initial admin and editable portfolio records |
| `npm run db:studio` | Launch Drizzle visual web database browser |

---

## ☁️ Deployment Guidelines

### 1. Vercel (Frontend & Serverless Handlers)
1. Push your repository to GitHub.
2. Import the project in Vercel.
3. Add the environment variables:
   - `DATABASE_URL` (e.g. Neon connection string with `?sslmode=require`)
   - `AUTH_SECRET` (generate with `openssl rand -base64 32`)
   - `NEXT_PUBLIC_SITE_URL` (your production domain)
4. The build command will automatically execute `npm run build`, compiling both the application and running `next-sitemap`.

### 2. Neon (PostgreSQL Database)
1. Create a serverless PostgreSQL database at [neon.tech](https://neon.tech).
2. Copy the pooled connection string into `DATABASE_URL`.
3. Run `npm run db:push` followed by `npm run db:seed` to populate the production schema.

---

## ⚖️ Legal & Privacy Compliance

- **DPDP Act 2023:** Consent is captured and stored with explicit timestamps for every contact submission and cookie choice.
- **IT Act 2000:** Clear disclosures and contact points for grievance redressal.
- **WCAG 2.2 AA:** Accessible forms, keyboard focus outlines, image alt tags, and native support for `prefers-reduced-motion`.

---

## ⚖️ Copyright & License

Copyright © 2026 **Arun M** ([arun-m.in](https://arun-m.in)). All Rights Reserved.

This repository, source code, 3D WebGL assets, design systems, algorithms, database schemas, and documentation are proprietary and confidential.

- **No Unauthorized Distribution:** No permission is granted to copy, download, modify, merge, publish, distribute, sublicense, duplicate, or sell this software, repository, or any portion thereof without explicit written permission from the copyright holder.
- **Inquiries:** For licensing inquiries, permissions, or architectural consultations, visit [arun-m.in](https://arun-m.in) or email `arun@arun-m.in`.

