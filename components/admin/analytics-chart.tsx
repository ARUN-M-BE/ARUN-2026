"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Globe,
  PieChart as PieChartIcon,
  Play,
  Pause,
  Radio,
  Server,
  TrendingUp,
  Zap,
  BarChart3,
} from "lucide-react";

type TimeRange = "1s" | "1m" | "1h" | "24h" | "7d" | "30d" | "1y";
type ChartView = "traffic" | "latency" | "distribution";

interface DataPoint {
  label: string;
  requests: number;
  visitors: number;
  latencyMs: number;
}

// Pre-configured realistic datasets for all time ranges
const RANGE_DATASETS: Record<Exclude<TimeRange, "1s">, DataPoint[]> = {
  "1m": [
    { label: "60s", requests: 42, visitors: 12, latencyMs: 14 },
    { label: "50s", requests: 48, visitors: 14, latencyMs: 16 },
    { label: "40s", requests: 55, visitors: 16, latencyMs: 13 },
    { label: "30s", requests: 39, visitors: 11, latencyMs: 12 },
    { label: "20s", requests: 62, visitors: 19, latencyMs: 15 },
    { label: "10s", requests: 58, visitors: 17, latencyMs: 14 },
    { label: "Now", requests: 65, visitors: 20, latencyMs: 13 },
  ],
  "1h": [
    { label: "50m", requests: 340, visitors: 95, latencyMs: 15 },
    { label: "40m", requests: 410, visitors: 112, latencyMs: 14 },
    { label: "30m", requests: 480, visitors: 135, latencyMs: 16 },
    { label: "20m", requests: 520, visitors: 148, latencyMs: 13 },
    { label: "10m", requests: 610, visitors: 170, latencyMs: 15 },
    { label: "Now", requests: 680, visitors: 192, latencyMs: 14 },
  ],
  "24h": [
    { label: "00:00", requests: 120, visitors: 34, latencyMs: 12 },
    { label: "04:00", requests: 85, visitors: 22, latencyMs: 11 },
    { label: "08:00", requests: 390, visitors: 110, latencyMs: 15 },
    { label: "12:00", requests: 680, visitors: 195, latencyMs: 16 },
    { label: "16:00", requests: 890, visitors: 260, latencyMs: 14 },
    { label: "20:00", requests: 940, visitors: 310, latencyMs: 13 },
    { label: "Now", requests: 1040, visitors: 330, latencyMs: 14 },
  ],
  "7d": [
    { label: "Mon", requests: 4200, visitors: 1150, latencyMs: 14 },
    { label: "Tue", requests: 4850, visitors: 1320, latencyMs: 13 },
    { label: "Wed", requests: 5300, visitors: 1490, latencyMs: 15 },
    { label: "Thu", requests: 5100, visitors: 1410, latencyMs: 14 },
    { label: "Fri", requests: 6200, visitors: 1780, latencyMs: 13 },
    { label: "Sat", requests: 3900, visitors: 980, latencyMs: 12 },
    { label: "Sun", requests: 4400, visitors: 1190, latencyMs: 13 },
  ],
  "30d": [
    { label: "Week 1", requests: 28500, visitors: 7800, latencyMs: 14 },
    { label: "Week 2", requests: 34200, visitors: 9400, latencyMs: 13 },
    { label: "Week 3", requests: 39100, visitors: 10800, latencyMs: 14 },
    { label: "Week 4", requests: 42800, visitors: 11900, latencyMs: 13 },
  ],
  "1y": [
    { label: "Q1", requests: 98000, visitors: 28000, latencyMs: 15 },
    { label: "Q2", requests: 142000, visitors: 41000, latencyMs: 14 },
    { label: "Q3", requests: 189000, visitors: 56000, latencyMs: 13 },
    { label: "Q4", requests: 245000, visitors: 74000, latencyMs: 12 },
  ],
};

const DISTRIBUTION_DATA = [
  { label: "Cloudflare Edge (Workers)", percentage: 62, color: "#38bdf8", count: "318K req" },
  { label: "Static CDN Assets (Cache Hit)", percentage: 26, color: "#818cf8", count: "133K req" },
  { label: "Dynamic SSR & Server Actions", percentage: 9, color: "#34d399", count: "46K req" },
  { label: "Database Pooler (Neon Tech)", percentage: 3, color: "#f59e0b", count: "15K req" },
];

export function AdminAnalyticsChart() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("1s");
  const [chartView, setChartView] = useState<ChartView>("traffic");
  const [isLiveActive, setIsLiveActive] = useState(true);

  // Live 1-Second Sliding Window Dataset
  const [liveStream, setLiveStream] = useState<DataPoint[]>([
    { label: "-9s", requests: 18, visitors: 5, latencyMs: 14 },
    { label: "-8s", requests: 22, visitors: 6, latencyMs: 13 },
    { label: "-7s", requests: 19, visitors: 5, latencyMs: 15 },
    { label: "-6s", requests: 27, visitors: 8, latencyMs: 12 },
    { label: "-5s", requests: 24, visitors: 7, latencyMs: 14 },
    { label: "-4s", requests: 31, visitors: 9, latencyMs: 16 },
    { label: "-3s", requests: 28, visitors: 8, latencyMs: 13 },
    { label: "-2s", requests: 35, visitors: 11, latencyMs: 14 },
    { label: "-1s", requests: 32, visitors: 10, latencyMs: 12 },
    { label: "0s", requests: 38, visitors: 12, latencyMs: 13 },
  ]);

  const [currentRps, setCurrentRps] = useState(38);
  const [currentLatency, setCurrentLatency] = useState(13);

  // 1-Second Realtime Clock Engine
  useEffect(() => {
    if (!isLiveActive || selectedRange !== "1s") return;

    const interval = setInterval(() => {
      const deltaReq = Math.floor(Math.random() * 14) - 6;
      const nextReq = Math.max(15, Math.min(65, currentRps + deltaReq));
      const nextVisitors = Math.max(4, Math.floor(nextReq * 0.32));
      const nextLatency = Math.max(8, Math.min(22, 13 + (Math.floor(Math.random() * 5) - 2)));

      setCurrentRps(nextReq);
      setCurrentLatency(nextLatency);

      setLiveStream((prev) => {
        const next = [...prev.slice(1)];
        next.push({
          label: "0s",
          requests: nextReq,
          visitors: nextVisitors,
          latencyMs: nextLatency,
        });
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLiveActive, selectedRange, currentRps]);

  // Compute active dataset based on selected time range
  const currentDataset = useMemo(() => {
    if (selectedRange === "1s") return liveStream;
    return RANGE_DATASETS[selectedRange];
  }, [selectedRange, liveStream]);

  const maxRequests = useMemo(() => {
    const max = Math.max(...currentDataset.map((d) => d.requests), 10);
    return Math.ceil(max * 1.15);
  }, [currentDataset]);

  const totalAggregatedRequests = useMemo(() => {
    return currentDataset.reduce((acc, curr) => acc + curr.requests, 0);
  }, [currentDataset]);

  return (
    <Card className="bg-card border-border overflow-hidden shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLiveActive ? "bg-emerald-400" : "bg-amber-400"} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLiveActive ? "bg-emerald-500" : "bg-amber-500"}`} />
            </span>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2 font-mono">
              Real-Time Edge Traffic & Ingress Telemetry
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-1">
            Continuous system monitoring from 1-second live telemetry to 1-year annual aggregation
          </CardDescription>
        </div>

        {/* Real-time Status Badge */}
        <div className="flex flex-wrap items-center gap-2">
          {selectedRange === "1s" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsLiveActive(!isLiveActive)}
              className="h-7 px-2.5 text-[11px] font-mono border-border gap-1.5"
            >
              {isLiveActive ? (
                <>
                  <Pause className="w-3 h-3 text-amber-400" />
                  <span>Pause Stream</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-emerald-400" />
                  <span>Resume Live</span>
                </>
              )}
            </Button>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 text-xs font-mono font-semibold">
            <Zap className="w-3.5 h-3.5 animate-pulse" />
            <span>{selectedRange === "1s" ? `${currentRps} req/s` : `${totalAggregatedRequests.toLocaleString()} total`}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-6">
        {/* Navigation & Range Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Time Range Pills */}
          <div className="flex items-center gap-1 p-1 bg-secondary/80 rounded-xl border border-border/80 overflow-x-auto max-w-full">
            {(["1s", "1m", "1h", "24h", "7d", "30d", "1y"] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all duration-150 ${
                  selectedRange === range
                    ? "bg-sky-500 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {range === "1s" ? "1s Live" : range}
              </button>
            ))}
          </div>

          {/* Chart View Switcher */}
          <div className="flex items-center gap-1 p-1 bg-secondary/80 rounded-xl border border-border/80 text-xs font-mono">
            <button
              onClick={() => setChartView("traffic")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                chartView === "traffic" ? "bg-card text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
              <span>Volume</span>
            </button>
            <button
              onClick={() => setChartView("distribution")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                chartView === "distribution" ? "bg-card text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <PieChartIcon className="w-3.5 h-3.5 text-violet-400" />
              <span>Pie / Split</span>
            </button>
            <button
              onClick={() => setChartView("latency")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                chartView === "latency" ? "bg-card text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Latency</span>
            </button>
          </div>
        </div>

        {/* Main Visual Presentation */}
        {chartView === "traffic" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>Request Volume ({selectedRange.toUpperCase()})</span>
              <span>Peak: {maxRequests.toLocaleString()}</span>
            </div>
            <div className="h-48 w-full pt-4 relative flex items-end justify-between gap-2 border-b border-border/80 pb-3">
              {currentDataset.map((item, idx) => {
                const heightPct = Math.max(8, (item.requests / maxRequests) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Hover Floating Tooltip */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-[10px] font-mono px-2.5 py-1.5 rounded-lg shadow-xl border border-border whitespace-nowrap z-30 pointer-events-none">
                      <div className="font-bold text-sky-400">{item.requests.toLocaleString()} requests</div>
                      <div className="text-muted-foreground">{item.visitors.toLocaleString()} visitors • {item.latencyMs}ms</div>
                    </div>

                    {/* Animated Bar with Gradient */}
                    <div className="w-full max-w-[36px] rounded-t-lg bg-secondary/60 overflow-hidden h-36 flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-sky-600 via-sky-400 to-indigo-400 rounded-t-lg transition-all duration-300 group-hover:brightness-125"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground truncate w-full text-center">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {chartView === "distribution" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
            {/* SVG Interactive Donut / Pie Chart */}
            <div className="md:col-span-5 flex items-center justify-center relative">
              <svg viewBox="0 0 100 100" className="w-48 h-48 -rotate-90">
                {(() => {
                  let accumulatedPercent = 0;
                  return DISTRIBUTION_DATA.map((slice, i) => {
                    const strokeDasharray = `${slice.percentage} ${100 - slice.percentage}`;
                    const strokeDashoffset = -accumulatedPercent;
                    accumulatedPercent += slice.percentage;
                    return (
                      <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke={slice.color}
                        strokeWidth="18"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        pathLength="100"
                        className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                      />
                    );
                  });
                })()}
              </svg>
              {/* Centered Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black font-mono text-foreground">100%</span>
                <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Edge Split</span>
              </div>
            </div>

            {/* Segment Breakdown Legend */}
            <div className="md:col-span-7 space-y-3">
              {DISTRIBUTION_DATA.map((slice, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border/70">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: slice.color }} />
                    <div>
                      <div className="text-xs font-semibold text-foreground">{slice.label}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">{slice.count} processed</div>
                    </div>
                  </div>
                  <div className="text-sm font-black font-mono text-foreground">{slice.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {chartView === "latency" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>Edge P99 Latency Sparkline</span>
              <span className="text-emerald-400 font-bold">{currentLatency} ms average</span>
            </div>
            {/* SVG Latency Sparkline Graph */}
            <div className="h-44 w-full relative flex items-center justify-center border-b border-border/80 pb-2">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 120">
                <defs>
                  <linearGradient id="latencyGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {(() => {
                  const pts = currentDataset.map((d, i) => {
                    const x = (i / (currentDataset.length - 1)) * 500;
                    const y = 120 - ((d.latencyMs - 8) / 16) * 100;
                    return `${x},${y}`;
                  });
                  const polyPoints = `0,120 ${pts.join(" ")} 500,120`;
                  return (
                    <>
                      <polygon points={polyPoints} fill="url(#latencyGlow)" />
                      <polyline fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={pts.join(" ")} />
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>
        )}

        {/* Global Architecture KPI Telemetry Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-1">
          <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/80">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>Global Ingress</span>
            </div>
            <div className="text-base sm:text-lg font-black font-mono text-foreground mt-1">
              {totalAggregatedRequests.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center mt-0.5">
              <TrendingUp className="w-3 h-3 mr-1" /> +24.6% edge routing
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/80">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Edge TTFB</span>
            </div>
            <div className="text-base sm:text-lg font-black font-mono text-emerald-400 mt-1">
              {currentLatency} ms
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              Sub-50ms target met
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/80">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Server className="w-3.5 h-3.5 text-violet-400" />
              <span>Cache Hit Ratio</span>
            </div>
            <div className="text-base sm:text-lg font-black font-mono text-violet-400 mt-1">
              99.4%
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              Cloudflare Tiered Cache
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/80">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>Active Sockets</span>
            </div>
            <div className="text-base sm:text-lg font-black font-mono text-cyan-400 mt-1">
              {Math.floor(currentRps * 1.8)}
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">
              Neon Realtime Live
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
