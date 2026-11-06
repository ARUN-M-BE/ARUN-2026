"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { LimeUnderlineSwoosh, CarrotThreeLineSpark } from "./voldog-doodles";

export function VoldogFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What makes your architecture 'Raw' compared to standard setups?",
      a: "Raw architecture strips out heavy, opaque abstraction layers. Instead of heavy WebSocket connection pools that leak memory on edge nodes, we use stateless HTTP drivers directly against Neon PostgreSQL. We enforce compile-time Zod validations, sub-50ms p99 SLAs, and zero runtime dependencies where native Web APIs suffice.",
    },
    {
      q: "How do you achieve sub-50ms edge latency worldwide?",
      a: "We deploy Next.js 16 via OpenNext to Cloudflare Workers distributed across 330+ cities worldwide. Combined with static asset caching, smart routing, and Neon's serverless connection pooler, our data stays geographically close to users without maintaining expensive idle servers.",
    },
    {
      q: "What does DPDP Act 2023 compliance mean for our stack?",
      a: "India's Digital Personal Data Protection Act 2023 mandates verifiable user consent, purpose limitation, and automated retention and deletion schedules. We architect compliant consent ledgers, tokenized PII vaults, and automated database pruning scripts from day one.",
    },
    {
      q: "Can you build both backend cloud infrastructure and 3D web engines?",
      a: "Yes. We operate across the entire stack: low-latency cloud infrastructure, high-throughput PostgreSQL databases, and cinematic 3D WebGL experiences powered by Three.js and React Three Fiber with custom GLSL shaders.",
    },
    {
      q: "How are projects scoped and delivered?",
      a: "We begin with a technical blueprint alignment session, formulate architecture diagrams, set latency SLAs, and work in agile two-week iterations accompanied by full Vitest coverage, automated CI/CD, and live staging previews.",
    },
  ];

  return (
    <section id="faq" className="py-20 sm:py-28 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto font-voldog">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: 38.4px Heading */}
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-[#ec7357] text-xs font-bold uppercase tracking-widest">
            <CarrotThreeLineSpark className="w-5 h-5" />
            <span>Architecture Inquiries</span>
          </div>

          <h2 className="text-[#204e4a] text-3xl sm:text-4xl lg:text-[38.4px] font-medium leading-[1.4] tracking-tight">
            Frequently{" "}
            <span className="font-bold relative inline-block text-[#204e4a]">
              asked questions.
              <LimeUnderlineSwoosh className="absolute -bottom-2 left-0 w-full h-3" />
            </span>
          </h2>

          <p className="text-[#204e4a]/75 text-base sm:text-lg leading-relaxed pt-2">
            Have questions about system migrations, latency benchmarks, or security audits? Here is everything you need to know about our engineering approach.
          </p>

          <div className="pt-4 hidden lg:block">
            <div className="bg-[#f4f1eb] rounded-[24px] p-6 border border-[#204e4a]/10 space-y-2">
              <span className="text-[#c1452e] font-bold text-xs uppercase tracking-wider">
                Direct Consultation
              </span>
              <p className="text-[#204e4a] text-sm font-medium">
                Need a bespoke architecture review for an existing system?
              </p>
              <a
                href="#contact"
                className="inline-block text-[#204e4a] font-bold text-sm underline hover:text-[#204e4a]/75"
              >
                Schedule an architecture call →
              </a>
            </div>
          </div>
        </div>

        {/* 
          Right Column: FAQ Accordion Rows
          20px/500 Butcher Green question, 2px solid Sage Hairline rule, Cloud Gray 100px disc holding a plus
        */}
        <div className="lg:col-span-7 space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="border-b-2 border-[#204e4a]/[0.11] py-5 sm:py-6 transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 group"
                  aria-expanded={isOpen}
                >
                  <span className="text-[#204e4a] text-lg sm:text-[20px] font-medium leading-snug group-hover:text-[#204e4a]/80 transition-colors">
                    {faq.q}
                  </span>

                  {/* Cloud Gray 100px radius disc */}
                  <div
                    className={`w-10 h-10 rounded-[100px] bg-[#f2f3f4] group-hover:bg-[#e1e53f] flex items-center justify-center text-[#204e4a] shrink-0 transition-colors ${
                      isOpen ? "bg-[#e1e53f]" : ""
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="pt-4 pr-12 text-[#204e4a]/85 text-base sm:text-[17px] leading-[1.6] font-normal animate-in fade-in-50 duration-200">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

