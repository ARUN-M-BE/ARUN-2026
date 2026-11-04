"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowUpRight, Globe, Server, TrendingUp, Users } from "lucide-react";

export function AdminAnalyticsChart() {
  const [dataPoints, setDataPoints] = useState([
    { hour: "00:00", requests: 120, visitors: 34 },
    { hour: "03:00", requests: 85, visitors: 22 },
    { hour: "06:00", requests: 190, visitors: 48 },
    { hour: "09:00", requests: 430, visitors: 110 },
    { hour: "12:00", requests: 620, visitors: 185 },
    { hour: "15:00", requests: 790, visitors: 240 },
    { hour: "18:00", requests: 940, visitors: 310 },
    { hour: "21:00", requests: 880, visitors: 275 },
    { hour: "Now", requests: 1040, visitors: 330 },
  ]);

  const [realtimeRate, setRealtimeRate] = useState(1040);

  useEffect(() => {
    const timer = setInterval(() => {
      setRealtimeRate((prev) => {
        const delta = Math.floor(Math.random() * 30) - 14;
        return Math.max(900, Math.min(1300, prev + delta));
      });
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const maxVal = Math.max(...dataPoints.map((d) => d.requests), 1200);

  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-500 animate-pulse" />
            Live Ingress & Portfolio Traffic Analytics
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Real-time hourly request volume and concurrent unique visitors
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            {realtimeRate.toLocaleString()} req/hr
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* SVG Bar & Line Composite Chart */}
        <div className="h-48 w-full pt-4 relative flex items-end justify-between gap-2 border-b border-border pb-2">
          {dataPoints.map((item, idx) => {
            const barHeightPercent = (item.requests / maxVal) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                {/* Tooltip on hover */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-[10px] font-mono px-2 py-1 rounded shadow border border-border whitespace-nowrap z-20 pointer-events-none">
                  {item.requests} req • {item.visitors} users
                </div>

                {/* Animated bar */}
                <div className="w-full max-w-[28px] rounded-t-md bg-secondary overflow-hidden h-36 flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-cyan-500 to-violet-600 rounded-t-md group-hover:from-cyan-400 group-hover:to-violet-500 transition-all duration-500"
                    style={{ height: `${barHeightPercent}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{item.hour}</span>
              </div>
            );
          })}
        </div>

        {/* Diagnostic Metrics Row */}
        <div className="grid grid-cols-3 gap-4 pt-1">
          <div className="p-3 rounded-xl bg-secondary/50 border border-border">
            <div className="text-[11px] text-muted-foreground">Total Today</div>
            <div className="text-lg font-bold font-mono text-foreground mt-0.5">5,095 Req</div>
            <div className="text-[10px] text-emerald-500 flex items-center mt-0.5">
              <TrendingUp className="w-3 h-3 mr-1" /> +18.4% vs yesterday
            </div>
          </div>

          <div className="p-3 rounded-xl bg-secondary/50 border border-border">
            <div className="text-[11px] text-muted-foreground">Unique Visitors</div>
            <div className="text-lg font-bold font-mono text-cyan-500 mt-0.5">1,246 Global</div>
            <div className="text-[10px] text-muted-foreground flex items-center mt-0.5">
              <Users className="w-3 h-3 mr-1" /> 84% Desktop / 16% Mobile
            </div>
          </div>

          <div className="p-3 rounded-xl bg-secondary/50 border border-border">
            <div className="text-[11px] text-muted-foreground">Average TTFB</div>
            <div className="text-lg font-bold font-mono text-emerald-500 mt-0.5">14.2 ms</div>
            <div className="text-[10px] text-muted-foreground flex items-center mt-0.5">
              <Server className="w-3 h-3 mr-1" /> Edge Cache Hit 99.4%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

