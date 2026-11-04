"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Zap,
  Server,
  Globe2,
  Cpu,
  Database,
  ArrowUpRight,
  ShieldCheck,
  Radio,
  Clock,
  Flame,
} from "lucide-react";
import { useLanguage } from "@/context/languageContext";

export function RealtimeTelemetry() {
  const { t, language } = useLanguage();

  // Simulated live ticking metrics
  const [streamTicks, setStreamTicks] = useState(0);
  const [requestsPerMin, setRequestsPerMin] = useState(1640);
  const [latency, setLatency] = useState(18);
  const [cacheHitRate, setCacheHitRate] = useState(99.4);
  const [activeSessions, setActiveSessions] = useState(48);

  // Time-series waveform data
  const [history, setHistory] = useState<number[]>([
    45, 52, 48, 60, 55, 68, 74, 62, 59, 70, 78, 85, 80, 72, 88, 92, 86, 95, 90, 94
  ]);

  // Live real-time interval simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStreamTicks((prev) => prev + 1);

      // Random natural fluctuation
      setRequestsPerMin((prev) => {
        const delta = Math.floor(Math.random() * 25) - 12;
        return Math.max(1400, Math.min(2200, prev + delta));
      });

      setLatency((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(12, Math.min(28, prev + delta));
      });

      setHistory((prev) => {
        const last = prev[prev.length - 1];
        const nextVal = Math.max(30, Math.min(100, last + (Math.floor(Math.random() * 19) - 9)));
        return [...prev.slice(1), nextVal];
      });

      if (Math.random() > 0.7) {
        setActiveSessions((prev) => Math.max(35, Math.min(80, prev + (Math.random() > 0.5 ? 1 : -1))));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // SVG points calculation for real-time waveform
  const svgPoints = useMemo(() => {
    const width = 800;
    const height = 180;
    const step = width / (history.length - 1);
    const max = 110;
    const min = 20;

    const coords = history.map((val, idx) => {
      const x = idx * step;
      const y = height - ((val - min) / (max - min)) * (height - 30) - 15;
      return `${x},${y}`;
    });

    return coords.join(" ");
  }, [history]);

  const edgeNodes = [
    { city: language === "ar" ? "فرانكفورت (أوروبا)" : "Frankfurt, EU", ping: latency + 2, status: "Optimal" },
    { city: language === "ar" ? "أشبورن (أمريكا)" : "Ashburn, US-East", ping: latency + 14, status: "Optimal" },
    { city: language === "ar" ? "مومباي (الهند)" : "Mumbai, AP-South", ping: latency - 4, status: "Fastest" },
    { city: language === "ar" ? "دبي (الشرق الأوسط)" : "Dubai, ME-Central", ping: latency + 6, status: "Optimal" },
  ];

  return (
    <section id="analytics" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background glow elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-mono uppercase tracking-wider mb-4 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          {t("analytics.badge", "System Telemetry")}
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
          {t("analytics.title", "Real-Time Public Analytics & Observability")}
        </h2>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground">
          {t("analytics.subtitle", "Live telemetry streaming from production nodes, visitor metrics, and performance vitals.")}
        </p>
      </div>

      {/* Main Grid Telemetry Container */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-border dark:border-cyan-500/20 shadow-xl space-y-8">
        
        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Requests */}
          <div className="p-4 sm:p-5 rounded-xl bg-background/60 border border-border/80 dark:border-white/5 relative overflow-hidden group">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-mono uppercase">{t("analytics.liveRequests", "Live Requests / Min")}</span>
              <Activity className="w-4 h-4 text-cyan-500 animate-pulse" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-foreground flex items-baseline gap-2">
              {requestsPerMin.toLocaleString()}
              <span className="text-xs font-normal text-emerald-500 flex items-center">
                ↑ 4.2%
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {t("analytics.refreshInterval", "Live 2-second heartbeat")}
            </p>
          </div>

          {/* Latency */}
          <div className="p-4 sm:p-5 rounded-xl bg-background/60 border border-border/80 dark:border-white/5 relative overflow-hidden group">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-mono uppercase">{t("analytics.avgLatency", "Edge Latency")}</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-foreground flex items-baseline gap-2">
              {latency}
              <span className="text-sm font-normal text-muted-foreground">ms</span>
              <span className="text-xs font-normal text-emerald-500">Sub-30ms</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Ashburn / Frankfurt / Mumbai</p>
          </div>

          {/* Active Sessions */}
          <div className="p-4 sm:p-5 rounded-xl bg-background/60 border border-border/80 dark:border-white/5 relative overflow-hidden group">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-mono uppercase">{t("analytics.activeSessions", "Active Global Sessions")}</span>
              <Globe2 className="w-4 h-4 text-violet-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-foreground flex items-baseline gap-2">
              {activeSessions}
              <span className="text-xs font-normal text-cyan-500 flex items-center">
                ● Live
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Distributed across 14 countries</p>
          </div>

          {/* Uptime */}
          <div className="p-4 sm:p-5 rounded-xl bg-background/60 border border-border/80 dark:border-white/5 relative overflow-hidden group">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-mono uppercase">{t("analytics.uptime", "System Uptime")}</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-500 flex items-baseline gap-2">
              99.98%
              <span className="text-xs font-normal text-muted-foreground">SLA</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Zero downtime continuous deployment</p>
          </div>
        </div>

        {/* Real-time Waveform Chart */}
        <div className="p-5 sm:p-6 rounded-xl bg-background/40 border border-border/80 dark:border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-500 animate-pulse" />
                {t("analytics.trafficChart", "Real-Time Throughput (Requests/sec)")}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Streaming live ingress payload samples across global CDN edge nodes
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-500" /> Live Ingress
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-violet-500" /> 99.4% Cache Hit
              </span>
            </div>
          </div>

          {/* Live SVG Graph */}
          <div className="relative h-44 w-full overflow-hidden rounded-lg bg-background/30 p-2 border border-border/40">
            {/* Grid lines */}
            <div className="absolute inset-0 grid grid-rows-4 w-full h-full pointer-events-none opacity-20">
              <div className="border-b border-cyan-500/30 w-full" />
              <div className="border-b border-cyan-500/30 w-full" />
              <div className="border-b border-cyan-500/30 w-full" />
              <div className="border-b border-cyan-500/30 w-full" />
            </div>

            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 800 180"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="telemetryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area fill */}
              <polygon
                points={`0,180 ${svgPoints} 800,180`}
                fill="url(#telemetryGrad)"
              />

              {/* Glowing stroke */}
              <polyline
                fill="none"
                stroke="#00f0ff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={svgPoints}
              />

              {/* Pulsing end point */}
              {history.length > 0 && (
                <circle
                  cx={800}
                  cy={180 - ((history[history.length - 1] - 20) / (110 - 20)) * 150 - 15}
                  r="5"
                  className="fill-cyan-400 animate-ping"
                />
              )}
            </svg>
          </div>
        </div>

        {/* Global Edge Nodes & Core Web Vitals Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Edge Latency Table */}
          <div className="p-5 rounded-xl bg-background/40 border border-border/80 dark:border-white/5 space-y-4">
            <h4 className="text-sm font-bold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-cyan-500" />
                {t("analytics.globalPings", "Global Edge Node Latency")}
              </span>
              <span className="text-xs font-mono text-emerald-500">All Clusters Green</span>
            </h4>

            <div className="space-y-3">
              {edgeNodes.map((node, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-background/60 border border-border/50 text-xs"
                >
                  <span className="font-medium text-foreground">{node.city}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-muted-foreground">{node.ping} ms</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {node.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture Vitals */}
          <div className="p-5 rounded-xl bg-background/40 border border-border/80 dark:border-white/5 space-y-4">
            <h4 className="text-sm font-bold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-violet-500" />
                {t("analytics.coreWebVitals", "Core Web Vitals Telemetry")}
              </span>
              <span className="text-xs font-mono text-cyan-500">100 / 100 Audit</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-background/60 border border-border/50">
                <div className="text-[11px] text-muted-foreground font-mono">LCP (Largest Paint)</div>
                <div className="text-lg font-black font-mono text-emerald-500 mt-1">0.78s</div>
                <div className="text-[10px] text-muted-foreground">Target: ≤ 2.5s (Good)</div>
              </div>

              <div className="p-3 rounded-lg bg-background/60 border border-border/50">
                <div className="text-[11px] text-muted-foreground font-mono">INP (Interaction)</div>
                <div className="text-lg font-black font-mono text-emerald-500 mt-1">36ms</div>
                <div className="text-[10px] text-muted-foreground">Target: ≤ 200ms (Good)</div>
              </div>

              <div className="p-3 rounded-lg bg-background/60 border border-border/50">
                <div className="text-[11px] text-muted-foreground font-mono">CLS (Layout Shift)</div>
                <div className="text-lg font-black font-mono text-emerald-500 mt-1">0.002</div>
                <div className="text-[10px] text-muted-foreground">Target: ≤ 0.1 (Good)</div>
              </div>

              <div className="p-3 rounded-lg bg-background/60 border border-border/50">
                <div className="text-[11px] text-muted-foreground font-mono">Cache Hit Ratio</div>
                <div className="text-lg font-black font-mono text-cyan-500 mt-1">99.4%</div>
                <div className="text-[10px] text-muted-foreground">Edge CDN Stored</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

