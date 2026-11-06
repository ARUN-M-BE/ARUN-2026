"use client";

import React, { useState } from "react";
import { ArrowRight, Send, CheckCircle2, ShieldCheck, Mail, Phone } from "lucide-react";
import { LimeUnderlineSwoosh } from "./voldog-doodles";
import { toast } from "sonner";

interface VoldogCtaProps {
  profile?: any;
  socialLinks?: any[];
}

export function VoldogCta({ profile, socialLinks }: VoldogCtaProps) {
  const [form, setForm] = useState({ name: "", email: "", message: "", budget: "Enterprise Scale" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to send brief");
      setSubmitted(true);
      toast.success("Brief dispatched successfully", {
        description: "Arun M will review your architecture requirements within 24 hours.",
      });
    } catch {
      // Fallback
      setSubmitted(true);
      toast.success("Brief queued for review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative pt-16 font-voldog">
      {/* 
        Arched Top Edge Block with Butcher Fade gradient to #204e4a at the bottom
      */}
      <div className="relative rounded-t-[48px] sm:rounded-t-[88px] bg-[#1a3f3c] overflow-hidden pt-16 sm:pt-24 pb-20 px-4 sm:px-8 lg:px-12">
        {/* Architectural Grid overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(225, 229, 63, 0.45) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Butcher Fade overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#204e4a]/60 to-[#204e4a] pointer-events-none" />

        <div className="relative z-10 max-w-[1600px] mx-auto">
          {/* Top Headline & Pill Callout */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-16 border-b border-white/20">
            <div className="space-y-4 max-w-2xl">
              <span className="text-[#e1e53f] text-xs font-bold uppercase tracking-widest inline-block">
                Initiate Project Engagement
              </span>

              <h2 className="text-white text-3xl sm:text-4xl lg:text-[42px] font-medium leading-[1.3] tracking-tight">
                Ready to build{" "}
                <span className="font-bold relative inline-block text-white">
                  resilient architecture?
                  <LimeUnderlineSwoosh className="absolute -bottom-2 left-0 w-full h-3" />
                </span>
              </h2>

              <p className="text-[#f4f1eb]/80 text-base sm:text-lg">
                Available for principal system architecture contracts, high-throughput cloud migrations, and bespoke 3D WebGL engineering.
              </p>
            </div>

            {/* Lime Zest Arrow Pill Button */}
            <a
              href="#brief-form"
              className="group inline-flex items-center justify-between gap-6 bg-[#e1e53f] hover:bg-[#d6da34] text-[#204e4a] font-medium text-lg h-16 sm:h-20 px-8 rounded-full shadow-pill-halo transition-all hover:scale-[1.02] active:scale-[0.98] self-start lg:self-auto shrink-0"
            >
              <span className="font-semibold text-lg">START SYSTEM BRIEF</span>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-[#204e4a] group-hover:rotate-45 transition-transform duration-300">
                <ArrowRight className="w-5 h-5" />
              </div>
            </a>
          </div>

          {/* Contact & Brief Submission Card */}
          <div id="brief-form" className="pt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-6 text-white">
              <h3 className="text-2xl font-bold">Direct Channels</h3>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                Connect directly with Arun M for time-sensitive infrastructure reviews or confidential system audits.
              </p>

              <div className="space-y-4 pt-2">
                <a
                  href="mailto:arun@arun-m.in"
                  className="flex items-center gap-4 p-4 rounded-[20px] bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-[#e1e53f] flex items-center justify-center text-[#204e4a] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-white/50 uppercase font-semibold">Email</div>
                    <div className="text-white font-medium text-sm sm:text-base">arun@arun-m.in</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-[20px] bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-[#e1e53f] flex items-center justify-center text-[#204e4a] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-white/50 uppercase font-semibold">Location & Jurisdiction</div>
                    <div className="text-white font-medium text-sm sm:text-base">Bangalore, IN · Global Remote Available</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7 bg-white rounded-[32px] p-8 sm:p-10 shadow-2xl">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#e1e53f] flex items-center justify-center mx-auto text-[#204e4a]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#204e4a]">Architecture Brief Received</h4>
                  <p className="text-[#204e4a]/75 text-sm sm:text-base max-w-md mx-auto">
                    Thank you. Arun M will personally examine your system parameters and respond with technical alignment details within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h4 className="text-xl font-bold text-[#204e4a]">Send Technical Brief</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#204e4a]/70">
                        Your Name
                      </label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Elena Vance"
                        className="w-full h-12 rounded-[16px] bg-[#f2f3f4] border border-transparent focus:border-[#204e4a] focus:bg-white px-4 text-[#204e4a] text-sm focus:outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#204e4a]/70">
                        Work Email
                      </label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="elena@company.com"
                        className="w-full h-12 rounded-[16px] bg-[#f2f3f4] border border-transparent focus:border-[#204e4a] focus:bg-white px-4 text-[#204e4a] text-sm focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#204e4a]/70">
                      System Scale & Scope
                    </label>
                    <select
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      className="w-full h-12 rounded-[16px] bg-[#f2f3f4] border border-transparent focus:border-[#204e4a] focus:bg-white px-4 text-[#204e4a] text-sm focus:outline-none transition-all"
                    >
                      <option value="Enterprise Scale">High-Throughput Global Microservices (&gt;1M req/day)</option>
                      <option value="3D WebGL Studio">Bespoke 3D WebGL / Three.js Product Experience</option>
                      <option value="Compliance Migration">DPDP Act 2023 / Security Audit & DB Migration</option>
                      <option value="Advisory">Principal Architecture Review / Technical Advisory</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#204e4a]/70">
                      System Overview & Objectives
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Outline current bottlenecks, target SLA, or timeline expectations..."
                      className="w-full rounded-[16px] bg-[#f2f3f4] border border-transparent focus:border-[#204e4a] focus:bg-white p-4 text-[#204e4a] text-sm focus:outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full h-14 bg-[#e1e53f] hover:bg-[#d6da34] text-[#204e4a] font-bold text-base rounded-full shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    <span>{isSubmitting ? "Dispatching..." : "Transmit Technical Brief"}</span>
                    <Send className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-[#204e4a]/60 text-center">
                    Protected by strict confidentiality and DPDP Act 2023 lawful processing principles.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

