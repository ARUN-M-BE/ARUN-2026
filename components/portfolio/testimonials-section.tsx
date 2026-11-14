"use client";

import { MessageSquareQuote, Star, CheckCircle2, Quote } from "lucide-react";
import { useLanguage } from "@/context/languageContext";
import { Badge } from "@/components/ui/badge";
import type { Testimonial } from "@/types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials = [] }: TestimonialsSectionProps) {
  const { t } = useLanguage();
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18 space-y-3">
          <Badge
            variant="outline"
            className="h-auto gap-1.5 rounded-full border-primary/25 bg-primary/10 px-3.5 py-1.5 font-mono text-xs text-primary"
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>{t("testimonials.badge", "Verified Recommendations")}</span>
          </Badge>
          <h2 className="font-display text-balance text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {t("testimonials.title", "Client & Peer Testimonials")}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t("testimonials.subtitle", "Verifiable feedback from engineering managers, CTOs, and collaborative partners.")}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-indigo-500/40 transition-all border border-border shadow-xs relative"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  {/* Rating stars */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-muted-foreground/30" />
                </div>

                <p className="text-xs sm:text-sm text-foreground/85 italic leading-relaxed">
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-1.5">
                    {item.name}
                    {item.isVerified && (
                      <span title="Verified Client Claim">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
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
