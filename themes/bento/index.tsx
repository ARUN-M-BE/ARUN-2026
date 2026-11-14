import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Download,
  Mail,
  MapPin,
  Quote,
  Sparkles,
} from "lucide-react";
import { DesignPill, DesignShell, Reveal } from "@/themes/shared";
import CountUp from "@/components/CountUp";
import {
  collectAchievements,
  contactChannels,
  displayBio,
  displayName,
  displayTitle,
  educationRange,
  experienceRange,
  initials,
  projectImage,
  projectStack,
  sectionCopy,
  socialHandle,
} from "@/themes/utils";
import type { DesignProps } from "@/themes/types";

const NAV = [
  { id: "board", label: "Board" },
  { id: "work", label: "Work" },
  { id: "stack", label: "Stack" },
  { id: "path", label: "Path" },
  { id: "contact", label: "Contact" },
];

/** One bento cell. Hover lifts the surface and warms a pointer glow. */
function Tile({
  children,
  className = "",
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  /** `accent` marks the one cell the eye should land on first. */
  tone?: "default" | "accent";
}) {
  const accent = tone === "accent";
  // The accent cell is *tinted* with the theme accent rather than filled with
  // it, so every foreground inside keeps its white-on-dark contrast and long
  // copy stays legible.
  const style: CSSProperties = accent
    ? {
        borderRadius: "var(--pf-radius)",
        background:
          "linear-gradient(145deg, color-mix(in srgb, var(--pf-accent) 30%, transparent) 0%, color-mix(in srgb, var(--pf-accent) 9%, transparent) 100%)",
        borderColor: "color-mix(in srgb, var(--pf-accent) 48%, transparent)",
        boxShadow:
          "0 36px 76px -52px color-mix(in srgb, var(--pf-accent) 90%, transparent), inset 0 1px 0 rgba(255,255,255,0.16)",
      }
    : {
        borderRadius: "var(--pf-radius)",
        background: "var(--pf-card-bg)",
        borderColor: "var(--pf-card-border)",
        // The hairline top highlight is what stops a dark cell from reading as
        // a flat cut-out against the page.
        boxShadow: "var(--pf-card-shadow), inset 0 1px 0 rgba(255,255,255,0.06)",
      };

  return (
    <div
      style={style}
      className={`group relative overflow-hidden border p-5 transition-transform duration-300 will-change-transform hover:-translate-y-1 ${className}`}
    >
      <span
        className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "var(--pf-accent-soft)" }}
        aria-hidden
      />
      <div className="relative">{children}</div>
    </div>
  );
}

function TileLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase leading-none tracking-[0.24em] text-white/55">
      {children}
    </p>
  );
}

/** Section heading for the full-width index below the board. */
function IndexHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-baseline justify-between gap-2 border-b border-white/[0.08] pb-4 sm:flex-row sm:items-end">
      <div>
        <TileLabel>{eyebrow}</TileLabel>
        <h2 className="mt-2.5 text-xl font-semibold tracking-tight text-white sm:text-2xl">
          {title}
        </h2>
      </div>
      {subtitle && <p className="text-[12px] text-white/60">{subtitle}</p>}
    </div>
  );
}

export default function BentoDesign({ content, config }: DesignProps) {
  const name = displayName(content);
  const title = displayTitle(content);
  const achievements = collectAchievements(content).slice(0, 3);
  const channels = contactChannels(content);
  const featured = content.projects.slice(0, 4);
  const [lead, ...rest] = featured;
  const skillTotal = content.skillCategories.reduce(
    (sum, category) => sum + (category.skills?.length ?? 0),
    0
  );

  const copy = {
    work: sectionCopy(content, "projects", {
      title: "Selected work",
      subtitle: "Case studies and shipped products.",
      badge: "Work",
    }),
    stack: sectionCopy(content, "skills", {
      title: "Stack",
      subtitle: "Grouped by discipline.",
      badge: "Skills",
    }),
    path: sectionCopy(content, "experience", {
      title: "Career path",
      subtitle: "Roles, study and credentials.",
      badge: "Experience",
    }),
    contact: sectionCopy(content, "contact", {
      title: "Start a conversation",
      subtitle: "Available for advisory, architecture and delivery.",
      badge: "Contact",
    }),
  };

  return (
    <DesignShell config={config}>
      {/* A bento layout is a grid, so the backdrop says grid: fine rules
          masked to the top of the page plus one accent bloom behind the hero. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute left-1/2 top-[-14rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full opacity-35 blur-[130px]"
          style={{ background: "radial-gradient(circle, var(--pf-accent) 0%, transparent 66%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "linear-gradient(to bottom, #000 0%, transparent 46%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000 0%, transparent 46%)",
          }}
        />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-3 sm:flex-row sm:justify-between sm:px-6">
          <Link href="#top" className="flex min-h-9 items-center gap-2.5 py-1">
            <span
              className="flex size-7 items-center justify-center rounded-lg text-[10px] font-bold"
              style={{ background: "var(--pf-accent)", color: "#08090c" }}
            >
              {initials(name)}
            </span>
            <span className="text-xs font-semibold tracking-tight text-white/90">{name}</span>
          </Link>

          <nav className="flex items-center gap-1" aria-label="Sections">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="inline-flex min-h-6 items-center rounded-full px-3 py-2 text-[11px] font-medium text-white/55 transition-colors hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href={content.profile?.email ? `mailto:${content.profile.email}` : "#contact"}
            className="hidden min-h-6 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[11px] font-semibold sm:inline-flex"
            style={{ borderColor: "var(--pf-accent-line)", color: "var(--pf-accent)" }}
          >
            Hire me
            <ArrowRight className="size-3" />
          </a>
        </div>
      </header>

      {/* These designs exposed no `main` landmark, which axe reports as
          `landmark-one-main`. The content sections now sit inside one. */}
      <main className="relative">
      {/* ── Centred hero ───────────────────────────────── */}
      <section id="top" className="relative px-4 pb-14 pt-16 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          {/* Hero block paints at full opacity on the first frame (LCP). */}
          <Reveal config={config} eager>
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]"
              style={{ borderColor: "var(--pf-accent-line)", color: "var(--pf-accent)" }}
            >
              <Sparkles className="size-3" />
              Design 07 · Bento Grid
            </span>
          </Reveal>
          <Reveal config={config} delay={0.05} eager>
            <h1
              className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl"
              style={{ fontSize: "calc(clamp(2.6rem, 6.5vw, 4.5rem) * var(--pf-font-scale))" }}
            >
              {name}
            </h1>
          </Reveal>
          <Reveal config={config} delay={0.1} eager>
            <p className="mt-3 text-sm font-medium" style={{ color: "var(--pf-accent)" }}>
              {title}
            </p>
          </Reveal>
          <Reveal config={config} delay={0.15} eager>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
              {displayBio(content)}
            </p>
          </Reveal>
          <Reveal config={config} delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold transition-transform hover:-translate-y-0.5"
                style={{ background: "var(--pf-accent)", color: "#08090c" }}
              >
                View the work
                <ArrowRight className="size-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-xs font-semibold text-white/80 transition-colors hover:border-white/35 hover:text-white"
              >
                Contact
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Bento board ────────────────────────────────── */}
      <section id="board" className="relative px-4 pb-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {/* Profile — the widest cell, so it anchors the board. */}
          <Reveal config={config} className="sm:col-span-2 lg:col-span-4">
            <Tile className="h-full">
              <TileLabel>Profile</TileLabel>
              <p className="mt-3 text-lg font-semibold text-white">{name}</p>
              <p className="mt-1 text-[12px] text-white/65">{title}</p>
              <p className="mt-4 line-clamp-4 text-[13px] leading-relaxed text-white/65">
                {content.profile?.bio || displayBio(content)}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {content.profile?.location && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/60">
                    <MapPin className="size-2.5" />
                    {content.profile.location}
                  </span>
                )}
                {content.profile?.availability && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px]"
                    style={{
                      borderColor: "var(--pf-accent-line)",
                      background: "var(--pf-accent-soft)",
                      color: "var(--pf-accent)",
                    }}
                  >
                    {content.profile.availability}
                  </span>
                )}
              </div>
            </Tile>
          </Reveal>

          {/* Lead project. Ordered before the stat row so the twelve-column
              grid packs into full rows instead of leaving ragged gaps. */}
          {lead && (
            <Reveal config={config} className="sm:col-span-2 lg:col-span-8" eager>
              <Tile className="h-full p-0">
                <Link href={`/projects/${lead.slug}`} className="block">
                  <div
                    className="relative h-48 w-full overflow-hidden sm:h-56"
                    style={{ borderTopLeftRadius: "var(--pf-radius)", borderTopRightRadius: "var(--pf-radius)" }}
                  >
                    {projectImage(lead) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={projectImage(lead)!}
                        alt={lead.title}
                        /* The lead tile sits in the first board row, so on a
                           desktop viewport this image *is* the LCP element —
                           it has to be discovered and fetched eagerly. */
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div
                        className="flex h-full items-center justify-center text-3xl font-semibold text-white/75"
                        style={{ background: "var(--pf-accent-soft)" }}
                      >
                        {initials(lead.title)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-x-6 bottom-5">
                      <TileLabel>{lead.category || "Featured case study"}</TileLabel>
                      <p className="mt-1.5 text-xl font-semibold text-white">{lead.title}</p>
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-4 p-6">
                    <p className="line-clamp-2 text-[13px] leading-relaxed text-white/65">
                      {lead.shortDescription || lead.description}
                    </p>
                    <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-[var(--pf-accent)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </Tile>
            </Reveal>
          )}

          {/* Stats */}
          {[
            { label: "Years", value: content.profile?.yearsOfExperience ?? 0, suffix: "+" },
            { label: "Projects", value: content.projects.length, suffix: "" },
            { label: "Skills", value: skillTotal, suffix: "" },
            { label: "Clients", value: content.profile?.happyClients ?? 0, suffix: "" },
          ].map((stat, index) => (
            <Reveal
              key={stat.label}
              config={config}
              delay={0.04 * (index + 1)}
              className="sm:col-span-1 lg:col-span-3"
            >
              <Tile className="h-full text-center">
                <p className="font-mono text-3xl font-semibold leading-none tabular-nums text-white">
                  <CountUp to={stat.value} suffix={stat.suffix} duration={1.4} delay={index * 0.06} />
                </p>
                <p className="mt-2.5 font-mono text-[10px] uppercase leading-none tracking-[0.2em] text-white/55">
                  {stat.label}
                </p>
              </Tile>
            </Reveal>
          ))}

          {/* Secondary projects */}
          {rest.map((project, index) => (
            <Reveal
              key={project.id}
              config={config}
              delay={0.04 * index}
              className="sm:col-span-1 lg:col-span-4"
            >
              <Tile className="h-full p-0">
                <Link href={`/projects/${project.slug}`} className="block p-5 sm:p-6">
                  <TileLabel>{project.category || "Case study"}</TileLabel>
                  <p className="mt-2.5 text-[15px] font-semibold text-white transition-colors group-hover:text-[var(--pf-accent)]">
                    {project.title}
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-white/65">
                    {project.shortDescription || project.description}
                  </p>
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {projectStack(project).slice(0, 3).map((tech) => (
                      <DesignPill key={tech}>{tech}</DesignPill>
                    ))}
                  </div>
                </Link>
              </Tile>
            </Reveal>
          ))}

          {/* Skills */}
          <Reveal config={config} className="sm:col-span-2 lg:col-span-5">
            <Tile className="h-full">
              <div className="flex items-center justify-between">
                <TileLabel>{copy.stack.badge}</TileLabel>
                <span className="font-mono text-[10px] text-white/60">{skillTotal} skills</span>
              </div>
              <h2 className="mt-2.5 text-base font-semibold text-white">{copy.stack.title}</h2>
              <div className="mt-4 space-y-3.5">
                {content.skillCategories.slice(0, 4).map((category) => (
                  <div key={category.id}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-white/65">{category.name}</span>
                      <span className="font-mono text-white/60">{category.skills?.length ?? 0}</span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {(category.skills ?? []).slice(0, 4).map((skill) => (
                        <span
                          key={skill.id}
                          className="rounded-md bg-white/[0.07] px-1.5 py-1 text-[10px] leading-none text-white/70"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Tile>
          </Reveal>

          {/* Experience */}
          <Reveal config={config} className="sm:col-span-2 lg:col-span-7">
            <Tile className="h-full">
              <div className="flex items-center justify-between">
                <TileLabel>{copy.path.badge}</TileLabel>
                <span className="font-mono text-[10px] text-white/60">
                  {content.experiences.length} roles
                </span>
              </div>
              <h2 className="mt-2.5 text-base font-semibold text-white">{copy.path.title}</h2>
              <ul className="mt-4 space-y-3.5">
                {content.experiences.slice(0, 4).map((exp) => (
                  <li key={exp.id} className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 size-3 shrink-0 text-white/50" />
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-semibold text-white/85">
                        {exp.position}
                      </p>
                      <p className="text-[11px] text-white/65">
                        {exp.company} · {experienceRange(exp)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Tile>
          </Reveal>

          {/* Achievements */}
          <Reveal config={config} className="sm:col-span-1 lg:col-span-4">
            <Tile className="h-full">
              <TileLabel>Highlights</TileLabel>
              <ul className="mt-4 space-y-3">
                {achievements.map((item) => (
                  <li key={item.id} className="flex gap-2.5">
                    <BadgeCheck className="mt-0.5 size-3.5 shrink-0" style={{ color: "var(--pf-accent)" }} />
                    <span className="text-[12px] leading-relaxed text-white/65">{item.title}</span>
                  </li>
                ))}
                {achievements.length === 0 && (
                  <li className="text-[12px] text-white/60">
                    Add achievements to experience entries to fill this tile.
                  </li>
                )}
              </ul>
            </Tile>
          </Reveal>

          {/* Education + certifications */}
          <Reveal config={config} className="sm:col-span-1 lg:col-span-4">
            <Tile className="h-full">
              <TileLabel>Education</TileLabel>
              <ul className="mt-4 space-y-3">
                {content.education.slice(0, 2).map((item) => (
                  <li key={item.id}>
                    <p className="text-[12px] font-semibold text-white/85">{item.degree}</p>
                    <p className="text-[11px] text-white/65">{item.institution}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">
                      {educationRange(item)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-white/[0.08] pt-3.5">
                <TileLabel>Certifications</TileLabel>
                <ul className="mt-2.5 space-y-1.5">
                  {content.certifications.slice(0, 3).map((cert) => (
                    <li key={cert.id} className="truncate text-[11px] text-white/60">
                      {cert.name}
                    </li>
                  ))}
                </ul>
              </div>
            </Tile>
          </Reveal>

          {/* Services */}
          {content.services.length > 0 && (
            <Reveal config={config} className="sm:col-span-2 lg:col-span-4">
              <Tile className="h-full">
                <TileLabel>Services</TileLabel>
                <ul className="mt-4 space-y-3">
                  {content.services.slice(0, 4).map((service) => (
                    <li key={service.id}>
                      <p className="text-[12px] font-medium text-white/85">{service.title}</p>
                      <p className="line-clamp-1 text-[11px] text-white/60">
                        {service.shortDescription || service.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </Tile>
            </Reveal>
          )}

          {/* Testimonial */}
          {content.testimonials[0] && (
            <Reveal config={config} className="sm:col-span-2 lg:col-span-8">
              <Tile className="h-full">
                <Quote className="size-5" style={{ color: "var(--pf-accent)" }} />
                <p className="mt-3.5 text-[14px] leading-relaxed text-white/75">
                  {content.testimonials[0].content}
                </p>
                <p className="mt-5 text-[12px] font-semibold text-white/80">
                  {content.testimonials[0].name}
                  <span className="ml-1.5 font-normal text-white/60">
                    {[content.testimonials[0].title, content.testimonials[0].company]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </p>
              </Tile>
            </Reveal>
          )}

          {/* Contact CTA — the one accent-filled cell, so the board has a
              single obvious place for the eye to land. */}
          <Reveal config={config} className="sm:col-span-2 lg:col-span-4">
            <Tile className="h-full" tone="accent">
              <TileLabel>{copy.contact.badge}</TileLabel>
              <h2 className="mt-2.5 text-lg font-semibold text-white">{copy.contact.title}</h2>
              <p className="mt-1.5 text-[12px] leading-relaxed text-white/70">
                {copy.contact.subtitle}
              </p>
              <div className="mt-5 flex flex-col gap-2">
                {channels.slice(0, 4).map((channel) => (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target={channel.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3.5 text-[11px] font-medium text-white/85 transition-colors hover:border-white/40 hover:text-white"
                  >
                    {channel.label === "Email" ? (
                      <Mail className="size-3.5" />
                    ) : channel.label === "Resume" ? (
                      <Download className="size-3.5" />
                    ) : (
                      <ArrowUpRight className="size-3.5" />
                    )}
                    {channel.label}
                  </a>
                ))}
              </div>
            </Tile>
          </Reveal>
        </div>
      </section>

      {/* ── Work index ─────────────────────────────────── */}
      <section id="work" className="relative px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <IndexHeading
            eyebrow={copy.work.badge}
            title={copy.work.title}
            subtitle={copy.work.subtitle}
          />
          {/* A ruled index rather than a third grid. The board above is the
              summary, so repeating it card-for-card down the page is what made
              this design read as an undifferentiated wall of boxes. */}
          <div className="divide-y divide-white/[0.07]">
            {content.projects.map((project, index) => (
              <Reveal key={project.id} config={config} delay={index * 0.02}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group grid grid-cols-[1.75rem_1fr_auto] items-start gap-4 py-5 transition-colors hover:bg-white/[0.03] sm:grid-cols-[2.25rem_1fr_auto] sm:gap-6"
                >
                  <span className="pt-1 font-mono text-[11px] tabular-nums text-white/50">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <p className="text-base font-semibold text-white transition-colors group-hover:text-[var(--pf-accent)]">
                        {project.title}
                      </p>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                        {project.category || "Case study"}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-white/65">
                      {project.shortDescription || project.description}
                    </p>
                    {projectStack(project).length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {projectStack(project).slice(0, 4).map((tech) => (
                          <DesignPill key={tech}>{tech}</DesignPill>
                        ))}
                      </div>
                    )}
                  </div>
                  <ArrowUpRight className="mt-1 size-4 shrink-0 text-white/50 transition-colors group-hover:text-[var(--pf-accent)]" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skills detail ──────────────────────────────── */}
      <section id="stack" className="relative px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <IndexHeading eyebrow={copy.stack.badge} title={copy.stack.title} />
          <div className="mt-8 grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {content.skillCategories.map((category, index) => (
              <Reveal key={category.id} config={config} delay={index * 0.03}>
                <div>
                  <div className="flex items-baseline justify-between border-b border-white/[0.08] pb-2">
                    <p className="text-[13px] font-semibold text-white">{category.name}</p>
                    <span className="font-mono text-[10px] text-white/55">
                      {category.skills?.length ?? 0}
                    </span>
                  </div>
                  <div className="mt-3.5 space-y-2.5">
                    {(category.skills ?? []).slice(0, 6).map((skill) => (
                      <div key={skill.id}>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-white/70">{skill.name}</span>
                          <span className="font-mono text-white/55">{skill.level}%</span>
                        </div>
                        <div className="mt-1.5 h-[2px] overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${skill.level}%`, background: "var(--pf-accent)" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Path timeline ──────────────────────────────── */}
      <section id="path" className="relative px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <IndexHeading eyebrow={copy.path.badge} title={copy.path.title} />
          <ol className="mt-8">
            {content.experiences.map((exp, index) => (
              <Reveal as="li" key={exp.id} config={config} delay={index * 0.03}>
                <div className="grid grid-cols-[auto_1fr] gap-4 sm:gap-5">
                  <div className="flex flex-col items-center pt-1.5">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ background: "var(--pf-accent)" }}
                    />
                    <span
                      className="mt-1 w-px flex-1"
                      style={{ background: "linear-gradient(180deg, var(--pf-accent-line), transparent)" }}
                    />
                  </div>
                  <div className="pb-7">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
                      {experienceRange(exp)}
                    </p>
                    <p className="mt-1.5 text-[14px] font-semibold text-white">{exp.position}</p>
                    <p className="text-[12px] text-white/60">{exp.company}</p>
                    {exp.description && (
                      <p className="mt-2 text-[12px] leading-relaxed text-white/65">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      </main>

      <footer id="contact" className="relative border-t border-white/[0.06] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
            <div>
              <TileLabel>Design 07 · Bento Grid Experience</TileLabel>
              <p className="mt-2 text-sm font-semibold text-white">{name}</p>
              <p className="text-[10px] text-white/60">
                © {new Date().getFullYear()} · All rights reserved
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {content.socialLinks.slice(0, 5).map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-6 items-center rounded-full border border-white/10 px-3 py-2 text-[10px] text-white/55 transition-colors hover:border-white/25 hover:text-white"
                >
                  {socialHandle(link)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </DesignShell>
  );
}
