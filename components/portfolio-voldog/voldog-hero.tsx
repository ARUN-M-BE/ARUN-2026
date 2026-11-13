"use client";

import { useState } from "react";
import { ArrowRight, Server, Box } from "lucide-react";
import { WhiteHeroScribble, LimeUnderlineSwoosh, CarrotThreeLineSpark } from "./voldog-doodles";

interface VoldogHeroProps {
  profile?: any;
}

export function VoldogHero({ profile: _profile }: VoldogHeroProps) {
  const [activeDomain, setActiveDomain] = useState<"cloud" | "creative">("cloud");

  return (
    <section className="pt-24 sm:pt-28 pb-8 px-3 sm:px-6 lg:px-10 max-w-[1700px] mx-auto font-voldog">
      {/* 
        Framed Hero Panel:
        35px solid Paper (#ffffff) border, 88px radius, deep pine green (#204e4a) backdrop
      */}
      <div className="relative rounded-[40px] sm:rounded-[64px] lg:rounded-[88px] border-[12px] sm:border-[24px] lg:border-[35px] border-white bg-[#204e4a] overflow-hidden min-h-[580px] sm:min-h-[680px] lg:min-h-[740px] flex flex-col justify-between p-6 sm:p-12 lg:p-16 shadow-2xl">
        {/* Architectural Grid & Gradient Overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(225, 229, 63, 0.45) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Giant White Background Wordmark Behind Content */}
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden">
          <span className="text-white/[0.07] font-black text-[18vw] leading-none tracking-tighter uppercase whitespace-nowrap">
            ARUN M
          </span>
        </div>

        {/* Hand-drawn decorative scribbles */}
        <div className="absolute top-10 right-12 hidden md:block pointer-events-none">
          <WhiteHeroScribble className="w-24 h-16" />
        </div>
        <div className="absolute top-24 left-10 hidden md:block pointer-events-none">
          <CarrotThreeLineSpark className="w-8 h-8 opacity-80" />
        </div>

        {/* Top Tagline / Category Badge */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15">
            <span className="w-2 h-2 rounded-full bg-[#e1e53f] animate-pulse" />
            <span className="text-[#e1e53f] text-xs sm:text-sm font-semibold tracking-wider uppercase">
              B.A.R.F — Bespoke Architecture & Resilient Frameworks
            </span>
          </div>
          <span className="hidden sm:inline-block text-white/50 text-xs">
            Bangalore, IN · Global Edge Delivery
          </span>
        </div>

        {/* Center: Main Headline with 500 to 700 weight switch */}
        <div className="relative z-10 my-auto py-8 max-w-4xl space-y-6">
          <h1 className="text-white text-3xl sm:text-5xl lg:text-6xl font-medium leading-[1.3] tracking-tight">
            Raw distributed architecture{" "}
            <span className="font-bold relative inline-block text-white">
              engineered for sub-50ms
              <LimeUnderlineSwoosh className="absolute -bottom-3 left-0 w-full h-3" />
            </span>{" "}
            global scale.
          </h1>

          <p className="text-[#f4f1eb]/85 text-base sm:text-xl lg:text-[21.6px] leading-relaxed max-w-2xl font-normal">
            Senior Full-Stack Architect & 3D Creative Engineer. We cut the enterprise fat and package clean, resilient microservices, high-throughput PostgreSQL databases, and DPDP Act 2023 compliant cloud foundations.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap gap-6 sm:gap-10 pt-2 text-white">
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-bold text-[#e1e53f]">99.99%</div>
              <div className="text-xs uppercase tracking-wider text-white/70">Availability SLA</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-bold text-[#e1e53f]">&lt; 35ms</div>
              <div className="text-xs uppercase tracking-wider text-white/70">P99 Edge Latency</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-bold text-[#e1e53f]">DPDP 2023</div>
              <div className="text-xs uppercase tracking-wider text-white/70">Full Privacy Guard</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Paper Arrow Pill (Left) and Domain Switch (Right) */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4">
          {/* Paper Arrow Pill Button */}
          <a
            href="#systems"
            className="group inline-flex items-center justify-between gap-4 bg-white/95 hover:bg-white text-[#204e4a] font-medium text-base sm:text-lg h-14 sm:h-16 px-6 sm:px-8 rounded-full shadow-pill-halo transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Explore Live Systems</span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#e1e53f] flex items-center justify-center text-[#204e4a] group-hover:rotate-45 transition-transform duration-300">
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </a>

          {/* Species / Domain Toggle Pill */}
          <div className="inline-flex items-center bg-white p-1.5 rounded-[100px] shadow-toggle-lift">
            <button
              onClick={() => setActiveDomain("cloud")}
              className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-[100px] text-xs sm:text-[15px] font-semibold transition-all ${
                activeDomain === "cloud"
                  ? "bg-[#e1e53f] text-[#204e4a] shadow-sm"
                  : "text-[#204e4a]/60 hover:text-[#204e4a]"
              }`}
            >
              <Server className="w-4 h-4" />
              <span>DISTRIBUTED CLOUD</span>
            </button>

            <button
              onClick={() => setActiveDomain("creative")}
              className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-[100px] text-xs sm:text-[15px] font-semibold transition-all ${
                activeDomain === "creative"
                  ? "bg-[#e1e53f] text-[#204e4a] shadow-sm"
                  : "text-[#204e4a]/60 hover:text-[#204e4a]"
              }`}
            >
              <Box className="w-4 h-4" />
              <span>CREATIVE 3D ENG</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

