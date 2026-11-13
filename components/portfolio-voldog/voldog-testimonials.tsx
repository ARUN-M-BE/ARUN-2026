"use client";

import { Star } from "lucide-react";
import { LimeUnderlineSwoosh, CarrotThreeLineSpark } from "./voldog-doodles";
import type { Testimonial } from "@/types";
import { fallbackTestimonials } from "@/server/repositories/fallback-data";

interface VoldogTestimonialsProps {
  testimonials?: Testimonial[];
}

export function VoldogTestimonials({ testimonials }: VoldogTestimonialsProps) {
  const tests = testimonials && testimonials.length > 0 ? testimonials : fallbackTestimonials;

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto font-voldog">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-1.5 text-[#ec7357] text-xs font-bold uppercase tracking-widest">
          <CarrotThreeLineSpark className="w-5 h-5" />
          <span>Client & Peer Endorsements</span>
        </div>

        <h2 className="text-[#204e4a] text-3xl sm:text-4xl lg:text-[38.4px] font-medium leading-[1.4] tracking-tight">
          Trusted by engineering leaders{" "}
          <span className="font-bold relative inline-block text-[#204e4a]">
            across the globe.
            <LimeUnderlineSwoosh className="absolute -bottom-2 left-0 w-full h-3" />
          </span>
        </h2>

        <p className="text-[#204e4a]/75 text-base sm:text-lg">
          Unvarnished reviews from CTOs, product directors, and founders who have deployed our architectural systems in production.
        </p>
      </div>

      {/* 
        Grid of Review Cards:
        Paper cards with 8px radius, 25px padding, round avatar, 18px/700 Butcher Green name,
        5 yellow stars, and Stone Gray #666666 text
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {tests.map((t, idx: number) => {
          const initials = t.avatar || (t.name || "").split(" ").map((n: string) => n[0]).join("").slice(0, 2);

          return (
            <div
              key={t.id || idx}
              className="bg-white rounded-[8px] p-6 sm:p-7 border border-[#e4e8e6] shadow-sm flex flex-col justify-between space-y-5 transition-all hover:shadow-md"
            >
              <div className="space-y-4">
                {/* 5 Yellow Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                {/* Stone Gray #666666 Review Text at 1.6 line-height */}
                <p className="text-[#666666] text-base leading-[1.6] font-normal">
                  "{t.content}"
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-[#e4e8e6]">
                <div className="w-10 h-10 rounded-full bg-[#e1e53f] flex items-center justify-center text-[#204e4a] font-bold text-xs shrink-0">
                  {initials}
                </div>
                <div>
                  <h4 className="text-[#204e4a] text-[18px] font-bold leading-tight">
                    {t.name}
                  </h4>
                  <p className="text-[#204e4a]/60 text-[13px] font-normal">
                    {t.title || "Technical Lead"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

