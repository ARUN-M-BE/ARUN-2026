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
  Clock,
  Layers,
  Zap,
  Orbit,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/languageContext";

// Instant zero-latency geometric sculpture placeholder
function HeroFallbackSculpture() {
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden select-none">
      <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-sky-500/20 via-indigo-500/15 to-transparent blur-2xl animate-pulse pointer-events-none" />
      <div className="relative flex items-center justify-center">
        {/* Outer Gyroscope Ring */}
        <div className="w-64 h-64 rounded-full border border-sky-500/25 animate-[spin_12s_linear_infinite]" />
        {/* Inner Orbital Ring */}
        <div className="absolute w-48 h-48 rounded-full border border-dashed border-indigo-400/30 animate-[spin_8s_linear_infinite_reverse]" />
        {/* Core Geometric Diamond */}
        <div className="absolute w-28 h-28 rounded-2xl border border-sky-400/40 bg-card/60 backdrop-blur-md rotate-45 flex items-center justify-center shadow-lg shadow-sky-500/10">
          <div className="w-16 h-16 rounded-xl border border-indigo-400/50 -rotate-12 flex items-center justify-center bg-sky-950/30">
            <div className="w-8 h-8 rounded-lg bg-sky-400/20 border border-sky-400/80 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Instant-mount dynamic 3D Canvas
const HeroCanvas = dynamic(() => import("@/components/3d/hero-canvas"), {
  ssr: false,
  loading: () => <HeroFallbackSculpture />,
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
    <section id="hero" className="min-h-[92vh] relative flex items-center justify-center pt-24 pb-16 sm:py-28 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-center relative z-10">
        {/* Left Column: Typography & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left rtl:lg:text-right">
          {/* Availability pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/25 text-xs font-mono text-sky-600 dark:text-sky-400 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
            </span>
            <span>{profile?.availability || t("hero.available", "Available for architectural advisory & engineering")}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            <span className="block">
              {profile?.fullName || "Arun M"}
            </span>
            <span className="block text-xl sm:text-3xl lg:text-4xl font-bold mt-2 text-gradient-brand">
              {profile?.title || t("hero.role", "Senior Full-Stack Architect & 3D Engineer")}
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
            {profile?.subtitle || t("hero.tagline", "Architecting resilient cloud platforms, distributed systems, and cinematic 3D digital experiences for high-growth enterprises.")}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start rtl:lg:justify-end gap-3 sm:gap-4 pt-2">
            <a href="#projects">
              <Button
                size="lg"
                className="h-11 sm:h-12 px-6 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-sky-500/20 group transition-all"
              >
                <span>{t("hero.explore", "View Selected Works")}</span>
                <ArrowRight className="w-4 h-4 ml-2 rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>

            <Button
              variant="outline"
              size="lg"
              onClick={startTour}
              className="h-11 sm:h-12 px-6 rounded-full border-border bg-card/70 hover:bg-card text-foreground text-xs sm:text-sm font-semibold shadow-xs"
            >
              <Compass className="w-4 h-4 mr-2 text-sky-500" />
              <span>{t("hero.guidedTour", "Interactive Tour")}</span>
            </Button>

            {profile?.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="ghost"
                  size="lg"
                  className="h-11 sm:h-12 px-4 rounded-full text-muted-foreground hover:text-foreground text-xs sm:text-sm font-medium"
                >
                  <FileDown className="w-4 h-4 mr-1.5" />
                  <span>{t("hero.downloadResume", "Resume")}</span>
                </Button>
              </a>
            )}
          </div>

          {/* Stat counters */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-border max-w-lg mx-auto lg:mx-0">
            <div className="p-3 sm:p-4 rounded-2xl bg-card/50 border border-border/80">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Clock className="w-3.5 h-3.5 text-sky-500" />
                <span>{t("hero.statYears", "Experience")}</span>
              </div>
              <div className="text-xl sm:text-3xl font-extrabold font-mono text-foreground">
                {profile?.yearsOfExperience || 8}+
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-card/50 border border-border/80">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>{t("hero.statProjects", "Projects")}</span>
              </div>
              <div className="text-xl sm:text-3xl font-extrabold font-mono text-sky-500">
                {profile?.projectsCompleted || 35}+
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-card/50 border border-border/80">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Zap className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t("hero.statPerformance", "Vitals")}</span>
              </div>
              <div className="text-xl sm:text-3xl font-extrabold font-mono text-emerald-500">
                100%
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Identity Sculpture */}
        <div className="lg:col-span-5 h-[340px] sm:h-[440px] lg:h-[520px] w-full relative">
          <div className="w-full h-full glass-panel-glow rounded-3xl overflow-hidden relative border border-border shadow-xl">
            <HeroCanvas />
            {/* Interactive hint pill */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border text-[11px] text-muted-foreground font-mono pointer-events-none flex items-center gap-1.5 shadow-xs">
              <Orbit className="w-3.5 h-3.5 text-sky-500 animate-spin" />
              <span>{language === "ar" ? "اسحب • دوّر • استكشف" : "Drag • Orbit • Explore"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Guided Tour Dialog */}
      <Dialog open={isTourOpen} onOpenChange={setIsTourOpen}>
        <DialogContent className="max-w-md bg-card/95 border-border backdrop-blur-xl p-6 rounded-2xl">
          <DialogHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs font-mono border-sky-500/30 text-sky-500 bg-sky-500/10">
                {language === "ar" ? `المحطة ${tourStep + 1} من ${tourSteps.length}` : `Orbit ${tourStep + 1} of ${tourSteps.length}`}
              </Badge>
              <Sparkles className="w-4 h-4 text-sky-500" />
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">
              {tourSteps[tourStep].title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
              {tourSteps[tourStep].desc}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevStep}
              disabled={tourStep === 0}
              className="text-xs h-9 rounded-xl"
            >
              <ChevronLeft className="w-4 h-4 mr-1 rtl:rotate-180" />
              <span>{language === "ar" ? "السابق" : "Previous"}</span>
            </Button>

            <div className="flex items-center gap-1.5">
              {tourSteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === tourStep ? "w-6 bg-sky-500" : "w-1.5 bg-border"
                  }`}
                />
              ))}
            </div>

            <Button
              size="sm"
              onClick={handleNextStep}
              className="text-xs h-9 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold"
            >
              <span>{tourStep === tourSteps.length - 1 ? (language === "ar" ? "إنهاء الجولة" : "Done") : (language === "ar" ? "التالي" : "Next")}</span>
              <ChevronRight className="w-4 h-4 ml-1 rtl:rotate-180" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
