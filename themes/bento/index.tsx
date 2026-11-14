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
  span = "",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  span?: string;
  as?: "div" | "section" | "article" | "li" | "a";
}) {
  const Tag = as;
  const style: CSSProperties = {
    borderRadius: "var(--pf-radius)",
    background: "var(--pf-card-bg)",
    borderColor: "var(--pf-card-border)",
    boxShadow: "var(--pf-card-shadow)",
  };

  return (
    <Tag
      style={style}
      className={`group relative overflow-hidden border p-5 transition-transform duration-300 will-change-transform hover:-translate-y-1 ${span} ${className}`}
    >
      <span
        className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "var(--pf-accent-soft)" }}
        aria-hidden
      />
      <div className="relative">{children}</div>
    </Tag>
  );
}

function TileLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-white/35">{children}</p>
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
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute left-1/2 top-0 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full opacity-60 blur-[130px]"
          style={{ background: "var(--pf-glow)" }}
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
              style={{ fontSize: "calc(clamp(2.4rem, 6vw, 4.1rem) * var(--pf-font-scale))" }}
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
          {/* Profile */}
          <Reveal config={config} className="lg:col-span-5">
            <Tile className="h-full" span="">
              <TileLabel>Profile</TileLabel>
              <p className="mt-3 text-base font-semibold text-white">{name}</p>
              <p className="mt-1 text-[11px] text-white/45">{title}</p>
              <p className="mt-4 line-clamp-4 text-xs leading-relaxed text-white/60">
                {content.profile?.bio || displayBio(content)}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {content.profile?.location && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-white/55">
                    <MapPin className="size-2.5" />
                    {content.profile.location}
                  </span>
                )}
                {content.profile?.availability && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px]"
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

          {/* Stats */}
          {[
            { label: "Years", value: content.profile?.yearsOfExperience ?? 0 },
            { label: "Projects", value: content.projects.length },
            { label: "Skills", value: skillTotal },
            { label: "Clients", value: content.profile?.happyClients ?? 0 },
          ].map((stat, index) => (
            <Reveal
              key={stat.label}
              config={config}
              delay={0.04 * (index + 1)}
              className="sm:col-span-1 lg:col-span-3"
            >
              <Tile className="h-full text-center">
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-white/35">
                  {stat.label}
                </p>
              </Tile>
            </Reveal>
          ))}

          {/* Lead project */}
          {lead && (
            <Reveal config={config} className="sm:col-span-2 lg:col-span-7">
              <Tile className="h-full p-0">
                <Link href={`/projects/${lead.slug}`} className="block">
                  <div className="relative h-44 w-full overflow-hidden sm:h-52" style={{ borderTopLeftRadius: "var(--pf-radius)", borderTopRightRadius: "var(--pf-radius)" }}>
                    {projectImage(lead) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={projectImage(lead)!}
                        alt={lead.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div
                        className="flex h-full items-center justify-center text-2xl font-semibold text-white/25"
                        style={{ background: "var(--pf-accent-soft)" }}
                      >
                        {initials(lead.title)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                    <div className="absolute inset-x-5 bottom-4">
                      <TileLabel>{lead.category || "Featured case study"}</TileLabel>
                      <p className="mt-1 text-lg font-semibold text-white">{lead.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-5">
                    <p className="line-clamp-2 text-xs leading-relaxed text-white/55">
                      {lead.shortDescription || lead.description}
                    </p>
                    <ArrowUpRight className="size-4 shrink-0 text-[var(--pf-accent)]" />
                  </div>
                </Link>
              </Tile>
            </Reveal>
          )}

          {/* Secondary projects */}
          {rest.map((project, index) => (
            <Reveal
              key={project.id}
              config={config}
              delay={0.04 * index}
              className="sm:col-span-1 lg:col-span-5"
            >
              <Tile className="h-full p-0">
                <Link href={`/projects/${project.slug}`} className="block p-5">
                  <TileLabel>{project.category || "Case study"}</TileLabel>
                  <p className="mt-2 text-sm font-semibold text-white group-hover:text-[var(--pf-accent)]">
                    {project.title}
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-white/50">
                    {project.shortDescription || project.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
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
                <span className="font-mono text-[9px] text-white/25">{skillTotal} skills</span>
              </div>
              <h2 className="mt-2 text-sm font-semibold text-white">{copy.stack.title}</h2>
              <div className="mt-4 space-y-3">
                {content.skillCategories.slice(0, 4).map((category) => (
                  <div key={category.id}>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-white/60">{category.name}</span>
                      <span className="font-mono text-white/25">{category.skills?.length ?? 0}</span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {(category.skills ?? []).slice(0, 4).map((skill) => (
                        <span
                          key={skill.id}
                          className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[9px] text-white/55"
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
                <span className="font-mono text-[9px] text-white/25">
                  {content.experiences.length} roles
                </span>
              </div>
              <h2 className="mt-2 text-sm font-semibold text-white">{copy.path.title}</h2>
              <ul className="mt-4 space-y-3">
                {content.experiences.slice(0, 4).map((exp) => (
                  <li key={exp.id} className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 size-3 shrink-0 text-white/30" />
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-semibold text-white/85">
                        {exp.position}
                      </p>
                      <p className="text-[10px] text-white/40">
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
              <ul className="mt-3 space-y-2.5">
                {achievements.map((item) => (
                  <li key={item.id} className="flex gap-2">
                    <BadgeCheck className="mt-0.5 size-3 shrink-0" style={{ color: "var(--pf-accent)" }} />
                    <span className="text-[10px] leading-relaxed text-white/60">{item.title}</span>
                  </li>
                ))}
                {achievements.length === 0 && (
                  <li className="text-[10px] text-white/35">
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
              <ul className="mt-3 space-y-3">
                {content.education.slice(0, 2).map((item) => (
                  <li key={item.id}>
                    <p className="text-[11px] font-semibold text-white/85">{item.degree}</p>
                    <p className="text-[10px] text-white/40">{item.institution}</p>
                    <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/25">
                      {educationRange(item)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-white/[0.07] pt-3">
                <TileLabel>Certifications</TileLabel>
                <ul className="mt-2 space-y-1.5">
                  {content.certifications.slice(0, 3).map((cert) => (
                    <li key={cert.id} className="truncate text-[10px] text-white/55">
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
                <ul className="mt-3 space-y-2.5">
                  {content.services.slice(0, 4).map((service) => (
                    <li key={service.id}>
                      <p className="text-[11px] font-medium text-white/85">{service.title}</p>
                      <p className="line-clamp-1 text-[10px] text-white/35">
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
                <Quote className="size-4" style={{ color: "var(--pf-accent)" }} />
                <p className="mt-3 text-xs leading-relaxed text-white/70">
                  {content.testimonials[0].content}
                </p>
                <p className="mt-4 text-[10px] font-semibold text-white/70">
                  {content.testimonials[0].name}
                  <span className="ml-1.5 font-normal text-white/35">
                    {[content.testimonials[0].title, content.testimonials[0].company]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </p>
              </Tile>
            </Reveal>
          )}

          {/* Contact CTA */}
          <Reveal config={config} className="sm:col-span-2 lg:col-span-12">
            <Tile className="h-full">
              <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
                <div>
                  <TileLabel>{copy.contact.badge}</TileLabel>
                  <h2 className="mt-2 text-base font-semibold text-white">{copy.contact.title}</h2>
                  <p className="mt-1 text-[11px] text-white/45">{copy.contact.subtitle}</p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {channels.slice(0, 4).map((channel) => (
                    <a
                      key={channel.label}
                      href={channel.href}
                      target={channel.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="inline-flex min-h-6 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] text-white/70 transition-colors hover:border-[var(--pf-accent-line)] hover:text-white"
                    >
                      {channel.label === "Email" ? (
                        <Mail className="size-3" />
                      ) : channel.label === "Resume" ? (
                        <Download className="size-3" />
                      ) : (
                        <ArrowUpRight className="size-3" />
                      )}
                      {channel.label}
                    </a>
                  ))}
                </div>
              </div>
            </Tile>
          </Reveal>
        </div>
      </section>

      {/* ── Work + path detail (keeps the CMS complete) ── */}
      <section id="work" className="relative px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <TileLabel>{copy.work.badge}</TileLabel>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {copy.work.title}
            </h2>
            {copy.work.subtitle && (
              <p className="mt-1.5 text-[11px] text-white/45">{copy.work.subtitle}</p>
            )}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.projects.map((project, index) => (
              <Reveal key={project.id} config={config} delay={index * 0.03}>
                <Tile className="h-full">
                  <div className="flex items-start justify-between gap-2">
                    <TileLabel>{project.category || "Case study"}</TileLabel>
                    <span className="font-mono text-[9px] text-white/20">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <Link href={`/projects/${project.slug}`} className="mt-2 block">
                    <p className="text-sm font-semibold text-white group-hover:text-[var(--pf-accent)]">
                      {project.title}
                    </p>
                  </Link>
                  <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-white/50">
                    {project.shortDescription || project.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {projectStack(project).slice(0, 3).map((tech) => (
                      <DesignPill key={tech}>{tech}</DesignPill>
                    ))}
                  </div>
                </Tile>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skills detail ──────────────────────────────── */}
      <section id="stack" className="relative px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <TileLabel>{copy.stack.badge}</TileLabel>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {copy.stack.title}
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.skillCategories.map((category, index) => (
              <Reveal key={category.id} config={config} delay={index * 0.03}>
                <Tile className="h-full">
                  <div className="flex items-baseline justify-between">
                    <p className="text-xs font-semibold text-white/90">{category.name}</p>
                    <span className="font-mono text-[9px] text-white/25">
                      {category.skills?.length ?? 0}
                    </span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {(category.skills ?? []).slice(0, 6).map((skill) => (
                      <div key={skill.id}>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-white/60">{skill.name}</span>
                          <span className="font-mono text-white/25">{skill.level}%</span>
                        </div>
                        <div className="mt-1 h-[2px] overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${skill.level}%`, background: "var(--pf-accent)" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Tile>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Path detail ────────────────────────────────── */}
      <section id="path" className="relative px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <TileLabel>{copy.path.badge}</TileLabel>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {copy.path.title}
            </h2>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {content.experiences.map((exp, index) => (
              <Reveal key={exp.id} config={config} delay={index * 0.03}>
                <Tile className="h-full">
                  <TileLabel>{experienceRange(exp)}</TileLabel>
                  <p className="mt-2 text-xs font-semibold text-white">{exp.position}</p>
                  <p className="text-[10px] text-white/40">{exp.company}</p>
                  {exp.description && (
                    <p className="mt-2 line-clamp-3 text-[10px] leading-relaxed text-white/45">
                      {exp.description}
                    </p>
                  )}
                </Tile>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="relative border-t border-white/[0.06] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
            <div>
              <TileLabel>Design 07 · Bento Grid Experience</TileLabel>
              <p className="mt-2 text-sm font-semibold text-white">{name}</p>
              <p className="text-[10px] text-white/35">
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
