import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Award,
  BadgeCheck,
  CalendarDays,
  Download,
  Mail,
  MapPin,
  Phone,
  Quote,
  Sparkles,
} from "lucide-react";
import { DesignEyebrow, DesignPill, DesignShell, Reveal } from "@/themes/shared";
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
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "path", label: "Path" },
  { id: "contact", label: "Contact" },
];

/** Frosted surface shared by every block in this design. */
function Glass({
  children,
  className = "",
  strong = false,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  strong?: boolean;
  /** Adds the hover lift + edge brightening used by clickable panels. */
  interactive?: boolean;
}) {
  // Four layers are what separate a sheet of glass from a translucent
  // rectangle: a directional tint (light falls from the top-left), a heavy
  // backdrop blur with a saturation/contrast boost so the bloom behind the
  // pane turns into colour, a 1px specular line caught on the top edge, and a
  // bottom inner shade that gives the sheet thickness.
  const style: CSSProperties = {
    borderRadius: "var(--pf-radius)",
    background: strong
      ? "linear-gradient(152deg, rgba(255,255,255,0.135) 0%, rgba(255,255,255,0.062) 46%, rgba(255,255,255,0.024) 100%)"
      : "linear-gradient(152deg, rgba(255,255,255,0.085) 0%, rgba(255,255,255,0.036) 48%, rgba(255,255,255,0.014) 100%)",
    // Edge colour lives in a custom property so hover states can move it —
    // an inline `borderColor` would outrank any class-based style.
    borderColor: "var(--glass-edge, rgba(255,255,255,0.15))",
    backdropFilter: "blur(calc(var(--pf-blur) + 5px)) saturate(185%) contrast(1.05)",
    WebkitBackdropFilter: "blur(calc(var(--pf-blur) + 5px)) saturate(185%) contrast(1.05)",
    boxShadow: [
      "inset 0 -24px 40px -40px rgba(0,0,0,0.85)",
      "0 34px 80px -58px rgba(0,0,0,0.95)",
    ].join(", "),
  };

  return (
    <div
      style={style}
      className={`relative isolate border ${
        interactive
          ? "transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:[--glass-edge:var(--pf-accent-line)]"
          : ""
      } ${className}`}
    >
      {/* Specular highlight on the top edge — the single detail that reads as
          "polished glass" rather than "grey box with opacity". */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          borderRadius: "inherit",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 18%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.45) 82%, transparent 100%)",
          maskImage:
            "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        }}
      />
      {/* Diagonal streak, offset from the tint above so highlight and body
          disagree slightly — that disagreement is what sells the depth. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: "inherit",
          background:
            "linear-gradient(118deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 32%, rgba(255,255,255,0) 66%, rgba(255,255,255,0.045) 100%)",
        }}
      />
      {/* Accent bloom just inside the top edge of the heavier panels, so the
          frosted colour is the theme's own, not a neutral wash. */}
      {strong && (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-20 left-1/2 h-40 w-56 -translate-x-1/2 rounded-full opacity-70 blur-[64px]"
          style={{ background: "var(--pf-accent-soft)" }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

export default function GlassDesign({ content, config }: DesignProps) {
  const name = displayName(content);
  const title = displayTitle(content);
  const achievements = collectAchievements(content).slice(0, 4);
  const channels = contactChannels(content);
  const featured = content.projects.slice(0, 6);
  const skillTotal = content.skillCategories.reduce(
    (sum, category) => sum + (category.skills?.length ?? 0),
    0
  );

  const copy = {
    work: sectionCopy(content, "projects", {
      title: "Selected work",
      subtitle: "Products, platforms and systems — each with a case study.",
      badge: "Portfolio",
    }),
    about: sectionCopy(content, "about", {
      title: "About the work",
      subtitle: "",
      badge: "Profile",
    }),
    skills: sectionCopy(content, "skills", {
      title: "Capabilities",
      subtitle: "The stack I reach for, grouped by discipline.",
      badge: "Stack",
    }),
    path: sectionCopy(content, "experience", {
      title: "Career path",
      subtitle: "Roles, education and credentials in one thread.",
      badge: "Experience",
    }),
    contact: sectionCopy(content, "contact", {
      title: "Let's talk",
      subtitle: "Open to architectural advisory and product work.",
      badge: "Contact",
    }),
  };

  return (
    <DesignShell config={config}>
      {/* Backdrop field. A frosted pane can only read as *glass* when there
          is something behind it to refract; over near-flat black every panel
          collapses into a translucent grey rectangle however strong its blur
          is. The layer is fixed, so the orbs hold their compositional
          position while the panels scroll across and break them up. */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute -left-[16%] -top-[20%] h-[48rem] w-[48rem] rounded-full opacity-40 blur-[110px]"
          style={{ background: "radial-gradient(circle, var(--pf-accent) 0%, transparent 64%)" }}
        />
        <div
          className="absolute -right-[18%] top-[18%] h-[42rem] w-[42rem] rounded-full opacity-30 blur-[120px]"
          style={{ background: "radial-gradient(circle, var(--pf-accent-2) 0%, transparent 66%)" }}
        />
        <div
          className="absolute -bottom-[26%] left-[24%] h-[44rem] w-[44rem] rounded-full opacity-25 blur-[130px]"
          style={{ background: "radial-gradient(circle, var(--pf-accent) 0%, transparent 68%)" }}
        />
        {/* Fine lattice: gives the blur structure to smear, which is what
            produces the frosted ripple across a panel edge. */}
        <div
          className="absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse at 50% 0%, #000 0%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, #000 0%, transparent 70%)",
          }}
        />
      </div>

      <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6">
        <div
          className="mx-auto flex max-w-5xl items-center justify-between gap-4 border px-4 py-2.5"
          style={{
            borderRadius: 999,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.045) 52%, rgba(255,255,255,0.02) 100%)",
            borderColor: "rgba(255,255,255,0.13)",
            backdropFilter: "blur(calc(var(--pf-blur) + 8px)) saturate(190%)",
            WebkitBackdropFilter: "blur(calc(var(--pf-blur) + 8px)) saturate(190%)",
            boxShadow: "0 18px 44px -34px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.22)",
          }}
        >
          <Link href="#top" className="flex min-h-9 items-center gap-2.5 py-1">
            <span
              className="flex size-7 items-center justify-center rounded-full text-[10px] font-bold"
              style={{ background: "var(--pf-accent)", color: "#08090c" }}
            >
              {initials(name)}
            </span>
            <span className="text-xs font-semibold tracking-tight text-white/90">{name}</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Sections">
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
            className="inline-flex min-h-6 items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-semibold"
            style={{ background: "var(--pf-accent)", color: "#08090c" }}
          >
            Contact
            <ArrowUpRight className="size-3" />
          </a>
        </div>
      </header>

      {/* These designs exposed no `main` landmark, which axe reports as
          `landmark-one-main`. The content sections now sit inside one. */}
      <main className="relative">
      {/* ── Hero ─────────────────────────────────────── */}
      <section id="top" className="relative px-4 pt-16 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          {/* Hero block paints at full opacity on the first frame (LCP). */}
          <Reveal config={config} eager>
            <DesignEyebrow className="justify-center">Design 03 · Glassmorphism</DesignEyebrow>
          </Reveal>
          <Reveal config={config} delay={0.05} eager>
            <h1
              className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl"
              style={{ fontSize: "calc(clamp(2.4rem, 6vw, 4.2rem) * var(--pf-font-scale))" }}
            >
              {name}
            </h1>
          </Reveal>
          <Reveal config={config} delay={0.1} eager>
            <p className="mx-auto mt-3 max-w-xl text-sm font-medium" style={{ color: "var(--pf-accent)" }}>
              {title}
            </p>
          </Reveal>
          <Reveal config={config} delay={0.15} eager>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
              {displayBio(content)}
            </p>
          </Reveal>
          <Reveal config={config} delay={0.2}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold text-black transition-transform hover:-translate-y-0.5"
                style={{ background: "var(--pf-accent)" }}
              >
                Explore the work
                <ArrowDownRight className="size-4" />
              </a>
              {content.profile?.resumeUrl && content.profile.resumeUrl !== "#" && (
                <a
                  href={content.profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-xs font-semibold text-white/80 transition-colors hover:border-white/35 hover:text-white"
                >
                  <Download className="size-4" />
                  Resume
                </a>
              )}
            </div>
          </Reveal>
        </div>

        {/* Frosted stat rail */}
        <Reveal config={config} delay={0.25}>
          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Years", value: content.profile?.yearsOfExperience ?? 0, suffix: "+" },
              { label: "Projects", value: content.projects.length, suffix: "" },
              { label: "Skills", value: skillTotal, suffix: "" },
              { label: "Clients", value: content.profile?.happyClients ?? 0, suffix: "" },
            ].map((stat) => (
              <Glass key={stat.label} className="relative px-4 py-5 text-center">
                <p className="font-mono text-2xl font-semibold tabular-nums text-white">
                  <CountUp to={stat.value} suffix={stat.suffix} duration={1.5} />
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-white/55">
                  {stat.label}
                </p>
                <span
                  aria-hidden
                  className="absolute inset-x-6 bottom-0 h-px"
                  style={{ background: "linear-gradient(90deg, transparent, var(--pf-accent-line), transparent)" }}
                />
              </Glass>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Work ─────────────────────────────────────── */}
      <section id="work" className="relative px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <DesignEyebrow className="justify-center">{copy.work.badge}</DesignEyebrow>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {copy.work.title}
            </h2>
            {copy.work.subtitle && (
              <p className="mx-auto mt-2 max-w-lg text-xs text-white/65">{copy.work.subtitle}</p>
            )}
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {featured.map((project, index) => {
              const image = projectImage(project);
              const stack = projectStack(project).slice(0, 3);
              return (
                <Reveal key={project.id} config={config} delay={index * 0.04}>
                  <Link href={`/projects/${project.slug}`} className="group block">
                    <Glass className="h-full overflow-hidden" interactive>
                      <div className="relative h-44 overflow-hidden" style={{ borderTopLeftRadius: "var(--pf-radius)", borderTopRightRadius: "var(--pf-radius)" }}>
                        {image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={image}
                            alt={project.title}
                            loading={index === 0 ? "eager" : "lazy"}
                            className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-2xl font-semibold text-white/65" style={{ background: "var(--pf-accent-soft)" }}>
                            {initials(project.title)}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      </div>
                      <div className="p-5">
                        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/60">
                          {project.category || "Case study"}
                        </p>
                        <h3 className="mt-2 text-base font-semibold text-white group-hover:text-[var(--pf-accent)]">
                          {project.title}
                        </h3>
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/65">
                          {project.shortDescription || project.description}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-1.5">
                          {stack.map((tech) => (
                            <DesignPill key={tech}>{tech}</DesignPill>
                          ))}
                          <ArrowUpRight className="ml-auto size-3.5 text-[var(--pf-accent)]" />
                        </div>
                      </div>
                    </Glass>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── About + achievements ─────────────────────── */}
      <section id="about" className="relative px-4 py-24 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal config={config}>
            <Glass className="h-full p-7 sm:p-9" strong>
              <DesignEyebrow>{copy.about.badge}</DesignEyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">{copy.about.title}</h2>
              <p className="mt-5 text-sm leading-relaxed text-white/65">
                {content.profile?.bio || displayBio(content)}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {content.profile?.location && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/60">
                    <MapPin className="size-3" />
                    {content.profile.location}
                  </span>
                )}
                {content.profile?.availability && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px]" style={{ borderColor: "var(--pf-accent-line)", background: "var(--pf-accent-soft)", color: "var(--pf-accent)" }}>
                    <Sparkles className="size-3" />
                    {content.profile.availability}
                  </span>
                )}
              </div>
            </Glass>
          </Reveal>

          <div className="space-y-3">
            {achievements.map((item, index) => (
              <Reveal key={item.id} config={config} delay={index * 0.05}>
                <Glass className="flex gap-3.5 p-4">
                  <Award className="mt-0.5 size-4 shrink-0" style={{ color: "var(--pf-accent)" }} />
                  <div>
                    <p className="text-xs font-medium leading-relaxed text-white/85">{item.title}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                      {item.detail}
                    </p>
                  </div>
                </Glass>
              </Reveal>
            ))}
            {achievements.length === 0 && (
              <Glass className="p-6 text-xs text-white/60">
                Achievements appear here once they are added to experience entries in the CMS.
              </Glass>
            )}
          </div>
        </div>
      </section>

      {/* ── Skills ───────────────────────────────────── */}
      <section id="skills" className="relative px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <DesignEyebrow className="justify-center">{copy.skills.badge}</DesignEyebrow>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {copy.skills.title}
            </h2>
            {copy.skills.subtitle && (
              <p className="mx-auto mt-2 max-w-lg text-xs text-white/65">{copy.skills.subtitle}</p>
            )}
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {content.skillCategories.map((category, index) => (
              <Reveal key={category.id} config={config} delay={index * 0.05}>
                <Glass className="p-5">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-sm font-semibold text-white/90">{category.name}</h3>
                    <span className="font-mono text-[10px] text-white/55">
                      {category.skills?.length ?? 0}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2.5">
                    {(category.skills ?? []).slice(0, 5).map((skill) => (
                      <div key={skill.id}>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-white/65">{skill.name}</span>
                          <span className="font-mono text-white/55">{skill.level}%</span>
                        </div>
                        <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${skill.level}%`, background: "var(--pf-accent)" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Glass>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Experience / education ───────────────────── */}
      <section id="path" className="relative px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <DesignEyebrow className="justify-center">{copy.path.badge}</DesignEyebrow>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {copy.path.title}
            </h2>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-3">
              {content.experiences.map((exp, index) => (
                <Reveal key={exp.id} config={config} delay={index * 0.04}>
                  <Glass className="p-5">
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
                      <CalendarDays className="size-3" />
                      {experienceRange(exp)}
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-white">
                      {exp.position} <span className="text-white/60">· {exp.company}</span>
                    </h3>
                    {exp.description && (
                      <p className="mt-2 text-xs leading-relaxed text-white/65">{exp.description}</p>
                    )}
                    {((exp.achievements as string[] | null) ?? []).length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {((exp.achievements as string[] | null) ?? []).slice(0, 3).map((achievement) => (
                          <li key={achievement} className="flex gap-2 text-[11px] text-white/55">
                            <BadgeCheck className="mt-0.5 size-3 shrink-0" style={{ color: "var(--pf-accent)" }} />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Glass>
                </Reveal>
              ))}
            </div>

            <div className="space-y-4">
              <Glass className="p-5">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/60">
                  Education
                </h3>
                <ul className="mt-4 space-y-4">
                  {content.education.map((item) => (
                    <li key={item.id}>
                      <p className="text-xs font-semibold text-white/90">{item.degree}</p>
                      <p className="mt-0.5 text-[11px] text-white/65">{item.institution}</p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
                        {educationRange(item)}
                      </p>
                    </li>
                  ))}
                </ul>
              </Glass>

              <Glass className="p-5">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/60">
                  Certifications
                </h3>
                <ul className="mt-4 space-y-3">
                  {content.certifications.slice(0, 5).map((cert) => (
                    <li key={cert.id} className="flex items-start gap-2.5">
                      <BadgeCheck className="mt-0.5 size-3.5 shrink-0" style={{ color: "var(--pf-accent)" }} />
                      <div>
                        <p className="text-[11px] font-medium text-white/85">{cert.name}</p>
                        <p className="text-[10px] text-white/60">{cert.issuer}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Glass>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────── */}
      {content.services.length > 0 && (
        <section className="relative px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <DesignEyebrow className="justify-center">Services</DesignEyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                How I can help
              </h2>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.services.slice(0, 6).map((service, index) => (
                <Reveal key={service.id} config={config} delay={index * 0.04}>
                  <Glass className="h-full p-5">
                    <h3 className="text-sm font-semibold text-white">{service.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/65">
                      {service.shortDescription || service.description}
                    </p>
                    {service.price && (
                      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--pf-accent)]">
                        {service.price}
                      </p>
                    )}
                  </Glass>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ─────────────────────────────── */}
      {content.testimonials.length > 0 && (
        <section className="relative px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <DesignEyebrow className="justify-center">Testimonials</DesignEyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                What people say
              </h2>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {content.testimonials.slice(0, 4).map((testimonial, index) => (
                <Reveal key={testimonial.id} config={config} delay={index * 0.05}>
                  <Glass className="h-full p-6">
                    <Quote className="size-5" style={{ color: "var(--pf-accent)" }} />
                    <p className="mt-3 text-xs leading-relaxed text-white/70">{testimonial.content}</p>
                    <div className="mt-5 flex items-center gap-2.5">
                      <span
                        className="flex size-8 items-center justify-center rounded-full text-[10px] font-bold text-black"
                        style={{ background: "var(--pf-accent)" }}
                      >
                        {initials(testimonial.name)}
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold text-white/85">{testimonial.name}</p>
                        <p className="text-[10px] text-white/60">
                          {[testimonial.title, testimonial.company].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                    </div>
                  </Glass>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Contact ──────────────────────────────────── */}
      <section id="contact" className="relative px-4 pb-24 pt-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Reveal config={config}>
            <Glass className="p-8 text-center sm:p-12" strong>
              <DesignEyebrow className="justify-center">{copy.contact.badge}</DesignEyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {copy.contact.title}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-white/65">
                {copy.contact.subtitle}
              </p>

              <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
                {channels.map((channel) => (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target={channel.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-left transition-colors hover:border-[var(--pf-accent-line)]"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/5">
                      {channel.label === "Email" ? (
                        <Mail className="size-3.5" style={{ color: "var(--pf-accent)" }} />
                      ) : channel.label === "Phone" ? (
                        <Phone className="size-3.5" style={{ color: "var(--pf-accent)" }} />
                      ) : channel.label === "Resume" ? (
                        <Download className="size-3.5" style={{ color: "var(--pf-accent)" }} />
                      ) : (
                        <MapPin className="size-3.5" style={{ color: "var(--pf-accent)" }} />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/60">
                        {channel.label}
                      </span>
                      <span className="block truncate text-[11px] text-white/80">{channel.value}</span>
                    </span>
                  </a>
                ))}
              </div>

              {content.socialLinks.length > 0 && (
                <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
                  {content.socialLinks.slice(0, 6).map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-6 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-medium text-white/65 transition-colors hover:border-white/25 hover:text-white"
                    >
                      {socialHandle(link)}
                      <ArrowUpRight className="size-2.5" />
                    </a>
                  ))}
                </div>
              )}
            </Glass>
          </Reveal>
        </div>
      </section>

      </main>

      <footer className="relative border-t border-white/[0.07] px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
            Design 03 · Glassmorphism Experience
          </p>
          <p className="text-[10px] text-white/55">
            © {new Date().getFullYear()} {name}
          </p>
        </div>
      </footer>
    </DesignShell>
  );
}
