"use client";

import { MessageSquareQuote, Star, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/languageContext";

interface TestimonialsSectionProps {
  testimonials: any[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const { t } = useLanguage();
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-mono text-indigo-600 dark:text-indigo-400">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>{t("testimonials.badge", "VERIFIED RECOMMENDATIONS")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            {t("testimonials.title", "Client & Peer Testimonials")}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("testimonials.subtitle", "Verifiable feedback from engineering managers, CTOs, and collaborative partners.")}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="glass-panel rounded-3xl p-8 flex flex-col justify-between space-y-6 hover:border-indigo-500/40 transition-all border border-border"
            >
              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-foreground/85 italic leading-relaxed">
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                    {item.name}
                    {item.isVerified && (
                      <span title="Verified Client Claim">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {item.title} {item.company && `• ${item.company}`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
