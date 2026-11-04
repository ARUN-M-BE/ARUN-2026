"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Compass,
  FileDown,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/languageContext";

// Dynamic import of 3D Canvas to optimize LCP and bundle size
const HeroCanvas = dynamic(() => import("@/components/3d/hero-canvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
    </div>
  ),
});

interface HeroSectionProps {
  profile: any;
}

export function HeroSection({ profile }: HeroSectionProps) {
  const { t, language } = useLanguage();
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const tourSteps = [
    {
      title: language === "ar" ? "المجسم التفاعلي ثلاثي الأبعاد" : "Interactive 3D Identity Sculpture",
      desc: language === "ar"
        ? "مجسم هندسي يتفاعل مع حركة الفأرة واللمس، يمثل التوافق بين التصميم الإبداعي وهندسة الأنظمة."
        : "The geometric sculpture rotates and reacts to cursor movement. It represents the nexus of creative design and scalable software engineering.",
      target: "hero",
    },
    {
      title: language === "ar" ? "كون المشاريع ودراسات الحالة" : "Projects Universe",
      desc: language === "ar"
        ? "استكشف دراسات حالة متكاملة مع الروابط الحية والمعمارية البرمجية وتقنيات الإنتاج."
        : "Explore full-stack case studies with live production URLs, architecture diagrams, and tech stack tags.",
      target: "projects",
    },
    {
      title: language === "ar" ? "كوكبة المهارات التفاعلية" : "Skills Constellation",
      desc: language === "ar"
        ? "خريطة عنقودية للكفاءات البرمجية تشمل الواجهات الأمامية، الأنظمة الموزعة، والبنية السحابية."
        : "Interactive cluster map of engineering proficiencies spanning frontend, distributed systems, and cloud infrastructure.",
      target: "skills",
    },
    {
      title: language === "ar" ? "التحليلات الحية والمراقبة" : "Live System Telemetry",
      desc: language === "ar"
        ? "لوحة بيانية لمراقبة تدفق البيانات المباشر، سرعة الاستجابة، ونشاط الخوادم في الوقت الفعلي."
        : "Real-time observability dashboard streaming requests, edge latency, and Core Web Vitals.",
      target: "analytics",
    },
    {
      title: language === "ar" ? "خط الخبرة والمؤهلات" : "Career Timeline & Credentials",
      desc: language === "ar"
        ? "المحطات المهنية السابقة، الشهادات المعتمدة، والتوصيات الموثقة."
        : "Chronological milestones, verified certifications, and client testimonials.",
      target: "experience",
    },
    {
      title: language === "ar" ? "التواصل والتعاقد" : "Contact & Collaboration",
      desc: language === "ar"
        ? "بوابة المراسلة المباشرة مع تسجيل موافقة الخصوصية وفق القانون وتأكيد التسليم."
        : "Direct message gateway with DPDP Act 2023 consent records and prompt replies.",
      target: "contact",
    },
  ];

  const handleNextStep = () => {
    if (tourStep < tourSteps.length - 1) {
      const next = tourStep + 1;
      setTourStep(next);
      const element = document.getElementById(tourSteps[next].target);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    } else {
      setIsTourOpen(false);
    }
  };

  const handlePrevStep = () => {
    if (tourStep > 0) {
      const prev = tourStep - 1;
      setTourStep(prev);
      const element = document.getElementById(tourSteps[prev].target);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const startTour = () => {
    setTourStep(0);
    setIsTourOpen(true);
  };

  return (
    <section id="hero" className="min-h-screen relative flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Typography & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left rtl:lg:text-right">
          {/* Availability pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-600 dark:text-cyan-400 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
            <span>{profile?.availability || t("hero.available", "Available for architectural advisory & engineering")}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
            <span className="block">
              {profile?.fullName || "Arun M"}
            </span>
            <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-cyan-400 to-violet-500">
              {profile?.title || t("hero.role", "Senior Full-Stack Architect & 3D Engineer")}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
            {profile?.subtitle || t("hero.tagline", "Architecting resilient cloud platforms, distributed systems, and cinematic 3D digital experiences for high-growth enterprises.")}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start rtl:lg:justify-end gap-4 pt-2">
            <a href="#projects">
              <Button
                size="lg"
                className="h-12 px-6 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 group transition-all"
              >
                <span>{t("hero.explore", "View projects")}</span>
                <ArrowRight className="w-4 h-4 ml-2 rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>

            <Button
              variant="outline"
              size="lg"
              onClick={startTour}
              className="h-12 px-6 rounded-full border-border bg-secondary/80 hover:bg-secondary text-foreground text-sm font-semibold"
            >
              <Compass className="w-4 h-4 mr-2 text-cyan-500" />
              <span>{t("hero.guidedTour", "Guided Tour")}</span>
            </Button>

            {profile?.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="ghost"
                  size="lg"
                  className="h-12 px-4 rounded-full text-muted-foreground hover:text-foreground text-sm font-medium"
                >
                  <FileDown className="w-4 h-4 mr-1.5" />
                  <span>{t("hero.downloadResume", "Resume")}</span>
                </Button>
              </a>
            )}
          </div>

          {/* Stat counters */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border max-w-lg mx-auto lg:mx-0">
            <div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
                {profile?.yearsOfExperience || 8}+
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{t("hero.statYears", "Years Experience")}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-500">
                {profile?.projectsCompleted || 32}+
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{t("hero.statProjects", "Projects Delivered")}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-violet-500">
                100%
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{t("hero.statPerformance", "Lighthouse Vitals")}</div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Identity Sculpture */}
        <div className="lg:col-span-5 h-[420px] sm:h-[500px] lg:h-[550px] w-full relative">
          <div className="w-full h-full glass-panel-glow rounded-3xl overflow-hidden relative border border-cyan-500/20 shadow-2xl">
            <HeroCanvas />
            {/* Interactive hint pill */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border text-[11px] text-muted-foreground font-mono pointer-events-none">
              {language === "ar" ? "اسحب • دوّر • استكشف" : "Drag • Orbit • Explore"}
            </div>
          </div>
        </div>
      </div>

      {/* Guided Tour Modal */}
      <Dialog open={isTourOpen} onOpenChange={setIsTourOpen}>
        <DialogContent className="relative max-w-lg overflow-hidden rounded-3xl border-cyan-500/20 bg-card p-0 shadow-cyan-950/20">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500" />
          <div className="space-y-7 p-6 pt-8 sm:p-8">
            <DialogHeader className="gap-5">
              <Badge
                variant="outline"
                className="h-auto w-fit gap-2 rounded-full border-cyan-500/25 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] text-cyan-700 dark:text-cyan-300"
              >
                <Sparkles className="size-3" />
                {language === "ar" ? "جولة استكشافية" : "PORTFOLIO GUIDED TOUR"}
              </Badge>

              <div className="space-y-3">
                <DialogTitle aria-live="polite" className="text-xl font-bold leading-tight tracking-tight text-foreground sm:text-2xl">
                  {tourSteps[tourStep].title}
                </DialogTitle>
                <DialogDescription className="max-w-md text-sm leading-7 text-muted-foreground">
                  {tourSteps[tourStep].desc}
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span className="text-muted-foreground">
                  {language === "ar" ? "التقدم في الجولة" : "YOUR PROGRESS"}
                </span>
                <span className="font-mono text-cyan-700 dark:text-cyan-300">
                  {String(tourStep + 1).padStart(2, "0")} / {String(tourSteps.length).padStart(2, "0")}
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={language === "ar" ? "التقدم في الجولة" : "Tour progress"}
                aria-valuemin={1}
                aria-valuemax={tourSteps.length}
                aria-valuenow={tourStep + 1}
                className="h-1.5 overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-[width] duration-500"
                  style={{ width: `${((tourStep + 1) / tourSteps.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-5">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevStep}
                disabled={tourStep === 0}
                className="h-10 rounded-full px-3 text-muted-foreground"
              >
                <ChevronLeft className="size-4 rtl:rotate-180" />
                {language === "ar" ? "السابق" : "Previous"}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsTourOpen(false)}
                  className="h-10 rounded-full px-3 text-muted-foreground"
                >
                  {language === "ar" ? "تخطي" : "Skip tour"}
                </Button>
                <Button
                  size="sm"
                  onClick={handleNextStep}
                  className="h-10 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 px-4 font-semibold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-violet-500"
                >
                  {tourStep === tourSteps.length - 1
                    ? (language === "ar" ? "إنهاء الجولة" : "Complete tour")
                    : (language === "ar" ? "القسم التالي" : "Next section")}
                  <ChevronRight className="size-4 rtl:rotate-180" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
