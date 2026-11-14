"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Boxes,
  Cloud,
  Code2,
  Cpu,
  Database,
  Gauge,
  Layers,
  Palette,
  Rocket,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/ui/tilt-card";
import { useLanguage } from "@/context/languageContext";
import type { Service } from "@/types";

interface ServicesSectionProps {
  services: Service[];
}

const ICONS = {
  Code2,
  Cloud,
  ShieldCheck,
  Database,
  Sparkles,
  Rocket,
  Layers,
  Cpu,
  Palette,
  Gauge,
  Boxes,
  Workflow,
} as const;

function resolveIcon(name?: string | null) {
  if (!name) return Sparkles;
  const key = name.replace(/[^a-zA-Z0-9]/g, "");
  const match = Object.keys(ICONS).find(
    (icon) => icon.toLowerCase() === key.toLowerCase()
  ) as keyof typeof ICONS | undefined;
  return match ? ICONS[match] : Sparkles;
}

export function ServicesSection({ services = [] }: ServicesSectionProps) {
  const { t, language } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const ordered = useMemo(
    () => [...(services || [])].sort((a, b) => a.sortOrder - b.sortOrder),
    [services]
  );

  if (ordered.length === 0) return null;

  return (
    <section id="services" className="relative overflow-hidden py-20 sm:py-28">
      {/* Etched depth grid */}
      <div className="pointer-events-none absolute inset-0 grid-etch opacity-40" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <Badge
              variant="outline"
              className="h-auto gap-1.5 rounded-full border-primary/25 bg-primary/10 px-3.5 py-1.5 font-mono text-xs text-primary"
            >
              <Workflow className="h-3.5 w-3.5" />
              <span>{t("services.badge", "Engagements & Expertise")}</span>
            </Badge>
            <h2 className="font-display text-balance text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {t("services.title", "Services engineered around outcomes")}
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {t(
                "services.subtitle",
                "Each engagement is scoped as a system: architecture, delivery, and observability. Open a card to see what the work actually involves."
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            <span className="rounded-full border border-border bg-card/70 px-3 py-1.5">
              {ordered.length} {language === "ar" ? "خدمات" : "offerings"}
            </span>
            <span className="hidden items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {language === "ar" ? "متاح للتعاقد" : "open for work"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {ordered.map((service, index) => {
            const Icon = resolveIcon(service.icon);
            const isExpanded = expandedId === service.id;
            const detail = service.description || service.shortDescription;

            return (
              <TiltCard
                key={service.id}
                maxTilt={6}
                className="group relative h-full overflow-hidden rounded-3xl"
              >
                <div
                  className={`flex h-full flex-col justify-between p-6 transition-colors sm:p-7 ${
                    service.isFeatured
                      ? "glass-panel-glow border border-primary/30"
                      : "glass-panel border border-border"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-background/60 text-primary shadow-inner">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-[11px] tracking-widest text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-display text-lg font-bold leading-snug text-foreground">
                        {service.title}
                      </h3>
                      {service.isFeatured && (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-accent">
                          <Sparkles className="h-3 w-3" />
                          {language === "ar" ? "الأكثر طلباً" : "most requested"}
                        </span>
                      )}
                    </div>

                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {service.shortDescription || "Scoped engineering engagement."}
                    </p>

                    <AnimatePresence initial={false}>
                      {isExpanded && detail && (
                        <motion.div
                          key="detail"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="rounded-2xl border border-border bg-background/50 p-4 text-xs leading-relaxed text-foreground/85 whitespace-pre-wrap">
                            {detail}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
                    <div className="min-w-0">
                      {service.price ? (
                        <span className="font-mono text-[11px] uppercase tracking-wider text-foreground/80">
                          {service.price}
                        </span>
                      ) : (
                        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                          {language === "ar" ? "سعر مخصص" : "custom scope"}
                        </span>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-expanded={isExpanded}
                      onClick={() => setExpandedId(isExpanded ? null : service.id)}
                      className="h-8 shrink-0 rounded-full border border-border bg-card/60 px-3 text-[11px] font-semibold text-foreground hover:border-primary/40 hover:text-primary"
                    >
                      {isExpanded
                        ? language === "ar"
                          ? "إغلاق"
                          : "Close"
                        : language === "ar"
                        ? "التفاصيل"
                        : "Details"}
                      <ArrowUpRight
                        className={`ml-1 h-3.5 w-3.5 transition-transform ${
                          isExpanded ? "rotate-90" : "group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        }`}
                      />
                    </Button>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl border border-border bg-card/60 p-6 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <h3 className="font-display text-sm font-bold text-foreground sm:text-base">
              {language === "ar" ? "لديك نظام تريد بناءه؟" : "Have a system that needs to exist?"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {language === "ar"
                ? "أرسل نطاق العمل وسأعود إليك بخطة معمارية خلال 48 ساعة."
                : "Send the scope and you will get an architecture plan within 48 hours."}
            </p>
          </div>
          <Button asChild size="sm" className="h-10 rounded-xl bg-primary px-5 text-xs font-semibold text-primary-foreground">
            <a href="#contact">
              {t("services.cta", "Start a conversation")}
              <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
