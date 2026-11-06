"use client";

import React from "react";
import { LimeUnderlineSwoosh, CarrotCurlyArrow } from "./voldog-doodles";

export function VoldogRibbon() {
  const repeatedText =
    "ARUN M ★ SUB-50MS LATENCY ★ RAW PERFORMANCE ★ DPDP ACT 2023 COMPLIANT ★ ZERO BLOAT ARCHITECTURE ★ HIGH-THROUGHPUT NEON POSTGRES ★ 60FPS THREE.JS WEBGL ★ ";

  return (
    <section className="relative overflow-hidden bg-[#f4f1eb] py-24 sm:py-32 font-voldog">
      {/* 
        Curved Big Edges:
        Enters Oat Canvas through wide curved transition blocks
      */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-white rounded-b-[40px] sm:rounded-b-[80px]" />
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-white rounded-t-[40px] sm:rounded-t-[80px]" />

      {/* Decorative Carrot Curly Arrow */}
      <div className="absolute top-12 right-12 hidden md:block pointer-events-none">
        <CarrotCurlyArrow className="w-16 h-12" />
      </div>

      {/* 
        Lime Text Ribbon Band:
        Thick Lime Zest #e1e53f band curving across full width carrying repeating bold slogan text
      */}
      <div className="relative py-12">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 -rotate-2 sm:-rotate-1 bg-[#e1e53f] py-4 sm:py-5 shadow-sm overflow-hidden select-none pointer-events-none z-0">
          <div className="whitespace-nowrap flex animate-marquee">
            <span className="text-[#204e4a] text-lg sm:text-2xl font-extrabold tracking-wider uppercase px-4">
              {repeatedText} {repeatedText}
            </span>
          </div>
        </div>

        {/* Centered Heading in front of Ribbon */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-4">
          <div className="inline-block bg-white/90 backdrop-blur-sm px-5 py-2 rounded-full border border-[#204e4a]/10 shadow-sm text-xs font-bold uppercase tracking-widest text-[#204e4a]">
            Pure Architectural Philosophy
          </div>

          <h2 className="text-[#204e4a] text-3xl sm:text-4xl lg:text-[42px] font-medium leading-[1.4] tracking-tight bg-[#f4f1eb]/80 p-4 rounded-[28px] inline-block">
            Engineering distributed platforms{" "}
            <span className="font-bold relative inline-block text-[#204e4a]">
              the way they ought to be.
              <LimeUnderlineSwoosh className="absolute -bottom-2 left-0 w-full h-3" />
            </span>
          </h2>

          <p className="text-[#204e4a]/80 text-base sm:text-xl font-normal max-w-2xl mx-auto">
            No bloated layers, no slow ORM round-trips, no fragile websockets in edge runtimes. We serve clean HTTP query streams directly to global users.
          </p>
        </div>
      </div>
    </section>
  );
}

