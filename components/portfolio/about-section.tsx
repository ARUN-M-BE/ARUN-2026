"use client";

import { Terminal, ShieldCheck, Zap, Layers, Sparkles, Database, Globe2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import GradientText from "@/components/GradientText";
import { useLanguage } from "@/context/languageContext";
import type { Profile } from "@/types";

interface AboutSectionProps {
  profile: Profile | null;
}

export function AboutSection({ profile }: AboutSectionProps) {
  const { t, language } = useLanguage();

  const pillars = [
    {
      title: t("about.pillar1Title", "Distributed Systems & Cloud"),
      desc: t("about.pillar1Desc", "High-concurrency microservices, event-driven streaming, and PostgreSQL/Drizzle database optimization."),
      icon: Layers,
      color: "text-primary bg-primary/10 border-primary/25",
    },
    {
      title: t("about.pillar2Title", "Hardware-Accelerated 3D"),
      desc: t("about.pillar2Desc", "Cinematic Three.js and React Three Fiber shaders with 60 FPS mobile-first performance budgets."),
      icon: Sparkles,
      color: "text-accent bg-accent/10 border-accent/25",
    },
    {
      title: t("about.pillar3Title", "Security & DPDP Act 2023"),
      desc: t("about.pillar3Desc", "Zero-trust session auth, cryptographic sanitization, rate limiting, and regulatory privacy compliance."),
      icon: ShieldCheck,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/25",
    },
    {
      title: t("about.pillar4Title", "Production Reliability"),
      desc: t("about.pillar4Desc", "Sub-second LCP, automated CI/CD deployment pipelines, and proactive telemetry observability."),
      icon: Zap,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/25",
    },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18 space-y-3">
          <Badge
            variant="outline"
            className="h-auto gap-1.5 rounded-full border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-mono text-primary"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>{t("about.badge", "Engineering Perspective")}</span>
          </Badge>
          <h2 className="font-display text-balance text-2xl font-extrabold tracking-tight sm:text-4xl">
            <GradientText
              colors={["var(--primary)", "var(--accent)", "var(--primary)"]}
              animationSpeed={7}
            >
              {t("about.title", "Architecting Scalable Real-World Systems")}
            </GradientText>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t("about.description", "Bridging the gap between cutting-edge visual aesthetics and rock-solid enterprise backend engineering.")}
          </p>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Story Card */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-10 space-y-6 relative overflow-hidden border border-border shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <h3 className="font-display text-balance text-lg font-bold tracking-tight text-foreground sm:text-2xl">
              {language === "ar"
                ? "عقد من الزمن في بناء منصات رقمية تؤثر وتتطور باستمرار"
                : "A decade of building software that moves industries forward"}
            </h3>

            <div className="text-xs sm:text-sm text-foreground/85 space-y-4 leading-relaxed font-normal">
              <p>
                {profile?.bio ||
                  (language === "ar"
                    ? "أنا مهندس برمجيات ومصمم تجارب تفاعلية ثلاثية الأبعاد، متخصص في البنى السحابية المتقدمة وتطبيقات الويب عالية الأداء. قمت بتوجيه فرق تقنية لبناء منصات تخدم ملايين الطلبات المتزامنة بأعلى كفاءة."
                    : "Results-driven Front End Developer with 3+ years of experience building responsive, scalable, and user-centric web applications using React.js, Next.js, TypeScript, and JavaScript (ES6+). Currently at SYNKCODE, Dubai, developing reusable UI components, integrating RESTful APIs with Django backends, and managing application state with React Hooks, Redux, and Context API.")}
              </p>
              <p>
                {language === "ar"
                  ? "ترتكز فلسفتي على دقة الصنعة البرمجية: تصميم مخططات قواعد بيانات متينة، كتابة شفرة آمنة من الأخطاء من خلال TypeScript، وبناء واجهات سلسة تحترم تجربة المستخدم واستهلاك البطارية."
                  : " Strong grasp of component-based architecture, server-side rendering, performance optimization, cross-browser compatibility, and UI/UX best practices."}
              </p>
            </div>

            {/* Quick Specs Pill Grid */}
            <div className="pt-6 border-t border-border grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-card/60 border border-border">
                <span className="text-muted-foreground text-[11px] mb-1 flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-primary" />
                  {language === "ar" ? "اللغات الأساسية" : "Primary Stack"}
                </span>
                <span className="text-primary font-bold">TypeScript & Go</span>
              </div>
              <div className="p-3 rounded-xl bg-card/60 border border-border">
                <span className="text-muted-foreground text-[11px] mb-1 flex items-center gap-1">
                  <Database className="w-3 h-3 text-accent" />
                  {language === "ar" ? "قواعد البيانات" : "Database Engine"}
                </span>
                <span className="text-foreground font-bold">PostgreSQL & Drizzle</span>
              </div>
              <div className="p-3 rounded-xl bg-card/60 border border-border col-span-2 sm:col-span-1">
                <span className="text-muted-foreground text-[11px] mb-1 flex items-center gap-1">
                  <Globe2 className="w-3 h-3 text-emerald-500" />
                  {language === "ar" ? "محرك الجرافيكس" : "3D Graphics"}
                </span>
                <span className="text-accent font-bold">Three.js / WebGL</span>
              </div>
            </div>
          </div>

          {/* Pillars List */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-4">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="glass-panel hover:border-primary/40 rounded-2xl p-5 transition-all duration-300 group border border-border shadow-xs"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl border ${pillar.color} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {pillar.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
