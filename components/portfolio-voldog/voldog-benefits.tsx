"use client";

import { Check, Shield, Zap, Activity, Cpu } from "lucide-react";
import { LimeUnderlineSwoosh, CarrotThreeLineSpark } from "./voldog-doodles";

export function VoldogBenefits() {
  const benefits = [
    {
      title: "Stateless HTTP DB Streaming",
      note: "Stateless HTTP query runners replace persistent websockets, eliminating memory leaks and edge cold starts with sub-15ms round-trips.",
      icon: <Zap className="w-5 h-5 text-[#204e4a]" />,
    },
    {
      title: "DPDP Act 2023 Lawful Processing",
      note: "Audited consent ledgers, purpose limitation, session guards, and automated data erasure periods ensuring enterprise privacy readiness.",
      icon: <Shield className="w-5 h-5 text-[#204e4a]" />,
    },
    {
      title: "Sub-50ms Global Edge Routing",
      note: "Cloudflare Workers with OpenNext deliver code execution within 15ms of 95% of the world's connected population with zero downtime.",
      icon: <Cpu className="w-5 h-5 text-[#204e4a]" />,
    },
    {
      title: "Concurrent React 19 Hydration",
      note: "Streaming Server Components with graceful client fallbacks and error boundaries that prevent React minified crashes under all network states.",
      icon: <Activity className="w-5 h-5 text-[#204e4a]" />,
    },
  ];

  return (
    <section id="principles" className="py-24 sm:py-32 px-4 sm:px-8 lg:px-12 bg-[#f4f1eb] relative font-voldog">
      {/* Curved Section Dividers */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-white rounded-b-[40px] sm:rounded-b-[80px]" />
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-white rounded-t-[40px] sm:rounded-t-[80px]" />

      <div className="max-w-[1600px] mx-auto py-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 text-[#ec7357] text-xs font-bold uppercase tracking-widest">
            <CarrotThreeLineSpark className="w-5 h-5" />
            <span>B.A.R.F Engineering Standards</span>
          </div>

          <h2 className="text-[#204e4a] text-3xl sm:text-4xl lg:text-[38.4px] font-medium leading-[1.4] tracking-tight">
            Raw architectural principles{" "}
            <span className="font-bold relative inline-block text-[#204e4a]">
              without enterprise bloat.
              <LimeUnderlineSwoosh className="absolute -bottom-2 left-0 w-full h-3" />
            </span>
          </h2>

          <p className="text-[#204e4a]/75 text-base sm:text-lg">
            Like whole-food raw ingredients, software works best when every layer is essential, clean, and uncompromised by layers of unnecessary middleware.
          </p>
        </div>

        {/* 
          Benefit Callout Cards:
          Paper card with 29px radius, 33px 34px padding, 1px border, 
          25px Lime Zest check disc, 19px Butcher Green title, 17px note
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="bg-white rounded-[29px] p-8 sm:p-9 border border-[#0a0000]/[0.09] shadow-benefit-card flex gap-5 items-start transition-all hover:-translate-y-1 hover:shadow-md"
            >
              {/* 25px Lime Zest Check Disc */}
              <div className="w-7 h-7 rounded-full bg-[#e1e53f] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Check className="w-4 h-4 text-[#204e4a] stroke-[3]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-[#204e4a] text-[19px] font-bold leading-snug">
                  {b.title}
                </h3>
                <p className="text-[#204e4a]/80 text-[16px] sm:text-[17px] leading-[1.6] font-normal">
                  {b.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

