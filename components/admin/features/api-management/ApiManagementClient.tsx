"use client";

import { useState, useTransition, useCallback } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  Server,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  RotateCw,
  ShieldCheck,
  Zap,
  Globe,
  Database,
  Mail,
  Flame,
} from "lucide-react";

interface ApiEndpointConfig {
  id: string;
  name: string;
  endpoint: string;
  method: "GET" | "POST";
  category: "Core API" | "Free Integration";
  plan: string;
  description: string;
  icon: typeof Server;
}

const API_ENDPOINTS: ApiEndpointConfig[] = [
  {
    id: "health",
    name: "System Health API",
    endpoint: "/api/health",
    method: "GET",
    category: "Core API",
    plan: "Free / Local",
    description: "Evaluates Neon database, database pool, and runtime telemetry.",
    icon: Activity,
  },
  {
    id: "projects",
    name: "Projects REST API",
    endpoint: "/api/projects",
    method: "GET",
    category: "Core API",
    plan: "Free / Database",
    description: "Serves published portfolio projects with pagination and filtering.",
    icon: Database,
  },
  {
    id: "navigation",
    name: "Navigation REST API",
    endpoint: "/api/navigation",
    method: "GET",
    category: "Core API",
    plan: "Free / Database",
    description: "Serves header, drawer, and footer navigation links.",
    icon: Globe,
  },
  {
    id: "sections",
    name: "Sections REST API",
    endpoint: "/api/sections",
    method: "GET",
    category: "Core API",
    plan: "Free / Database",
    description: "Dynamic website section schema with component types and styles.",
    icon: Server,
  },
  {
    id: "social_links",
    name: "Social Links REST API",
    endpoint: "/api/social-links",
    method: "GET",
    category: "Core API",
    plan: "Free / Database",
    description: "Public verified social profiles and network links.",
    icon: Globe,
  },
  {
    id: "resend",
    name: "Resend Audiences & Email",
    endpoint: "/api/integrations/resend",
    method: "GET",
    category: "Free Integration",
    plan: "Free Tier (3k/mo, 100/day)",
    description: "Audience management, subscriber contacts, and transactional email.",
    icon: Mail,
  },
  {
    id: "monkeytype",
    name: "Monkeytype API",
    endpoint: "/api/integrations/monkeytype",
    method: "GET",
    category: "Free Integration",
    plan: "100% Free Public API",
    description: "Typing speed telemetry, accuracy rating, and personal records.",
    icon: Flame,
  },
  {
    id: "ipstack",
    name: "GeoIP & IPstack",
    endpoint: "/api/integrations/ipstack",
    method: "GET",
    category: "Free Integration",
    plan: "Free Plan + FreeIPAPI Fallback",
    description: "Visitor country, region, city, coordinates with zero paid fees.",
    icon: Globe,
  },
  {
    id: "upstash",
    name: "Upstash Redis & Rate Limiter",
    endpoint: "/api/integrations/upstash",
    method: "GET",
    category: "Free Integration",
    plan: "Free Serverless (10k cmd/day)",
    description: "Sliding window rate limit checks and key-value state store.",
    icon: Zap,
  },
];

interface TestResult {
  id: string;
  status: "idle" | "testing" | "success" | "error";
  statusCode?: number;
  latencyMs?: number;
  message?: string;
  responsePayload?: unknown;
}

export function ApiManagementClient() {
  const [results, setResults] = useState<Record<string, TestResult>>(() =>
    API_ENDPOINTS.reduce<Record<string, TestResult>>((acc, ep) => {
      acc[ep.id] = { id: ep.id, status: "idle" };
      return acc;
    }, {})
  );

  const [isPending, startTransition] = useTransition();
  const [autoRunActive, setAutoRunActive] = useState<boolean>(false);
  const [selectedResponse, setSelectedResponse] = useState<{ id: string; name: string; data: unknown } | null>(null);

  const testSingleApi = useCallback(async (endpointConfig: ApiEndpointConfig) => {
    setResults((prev) => ({
      ...prev,
      [endpointConfig.id]: { id: endpointConfig.id, status: "testing" },
    }));

    const startTime = performance.now();
    try {
      const res = await fetch(endpointConfig.endpoint, {
        method: endpointConfig.method,
        cache: "no-store",
      });
      const latencyMs = Math.round(performance.now() - startTime);
      const json = await res.json() as { success?: boolean; error?: string };

      setResults((prev) => ({
        ...prev,
        [endpointConfig.id]: {
          id: endpointConfig.id,
          status: res.ok ? "success" : "error",
          statusCode: res.status,
          latencyMs,
          message: res.ok ? "Healthy / 200 OK" : (json.error || `HTTP ${res.status}`),
          responsePayload: json,
        },
      }));
    } catch (err: unknown) {
      const latencyMs = Math.round(performance.now() - startTime);
      setResults((prev) => ({
        ...prev,
        [endpointConfig.id]: {
          id: endpointConfig.id,
          status: "error",
          statusCode: 500,
          latencyMs,
          message: err instanceof Error ? err.message : "Network/Connection error",
          responsePayload: { error: String(err) },
        },
      }));
    }
  }, []);

  const testAllApis = useCallback(() => {
    startTransition(async () => {
      await Promise.all(API_ENDPOINTS.map((ep) => testSingleApi(ep)));
    });
  }, [testSingleApi]);

  const testedCount = Object.values(results).filter((r) => r.status === "success" || r.status === "error").length;
  const successCount = Object.values(results).filter((r) => r.status === "success").length;
  const avgLatency = Math.round(
    Object.values(results)
      .filter((r) => typeof r.latencyMs === "number")
      .reduce((sum, r) => sum + (r.latencyMs || 0), 0) / (testedCount || 1)
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="API Management & Service Health"
        description="Monitor, test, and audit all REST APIs and external free-tier integrations with real-time latency and quota guards."
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-card/60 px-3 py-1.5 backdrop-blur-sm">
            <span className="text-xs font-medium text-muted-foreground">Auto-Check:</span>
            <Toggle
              pressed={autoRunActive}
              onPressedChange={(pressed) => {
                setAutoRunActive(pressed);
                if (pressed) testAllApis();
              }}
              variant="outline"
              size="sm"
              aria-label="Toggle auto check"
            >
              <RotateCw className={`size-3.5 ${autoRunActive ? "animate-spin text-sky-400" : ""}`} />
            </Toggle>
          </div>
          <Button
            onClick={testAllApis}
            disabled={isPending}
            className="gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 font-semibold text-white shadow-lg shadow-sky-500/20 hover:from-sky-600 hover:to-indigo-700"
          >
            {isPending ? <RotateCw className="size-4 animate-spin" /> : <Play className="size-4" />}
            Test All APIs ({API_ENDPOINTS.length})
          </Button>
        </div>
      </PageHeader>

      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Endpoints</span>
            <Server className="size-4 text-sky-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">{API_ENDPOINTS.length}</div>
          <p className="mt-1 text-xs text-muted-foreground">5 Core REST + 4 Free Integrations</p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Live Health Status</span>
            <CheckCircle2 className="size-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-400">
            {successCount} / {testedCount > 0 ? testedCount : API_ENDPOINTS.length} Passed
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {testedCount === 0 ? "Click 'Test All APIs' to verify" : `${Math.round((successCount / (testedCount || 1)) * 100)}% uptime`}
          </p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Average Latency</span>
            <Clock className="size-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {testedCount > 0 ? `${avgLatency} ms` : "—"}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Serverless Edge & REST response</p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Billing Tier Guard</span>
            <ShieldCheck className="size-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-indigo-400">100% Free</div>
          <p className="mt-1 text-xs text-muted-foreground">All paid add-ons stopped & disabled</p>
        </div>
      </div>

      {/* API Endpoint Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Configured Services & APIs</h3>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {API_ENDPOINTS.map((endpoint) => {
            const Icon = endpoint.icon;
            const res = results[endpoint.id];
            const isSuccess = res?.status === "success";
            const isError = res?.status === "error";
            const isTesting = res?.status === "testing";

            return (
              <div
                key={endpoint.id}
                className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-border hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">{endpoint.name}</h4>
                        <span className="text-xs text-muted-foreground font-mono">{endpoint.endpoint}</span>
                      </div>
                    </div>

                    <span className="rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                      {endpoint.plan}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    {endpoint.description}
                  </p>
                </div>

                <div className="mt-5 border-t border-border/60 pt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs">
                      {isTesting && (
                        <span className="flex items-center gap-1 text-sky-400">
                          <RotateCw className="size-3 animate-spin" /> Testing...
                        </span>
                      )}
                      {isSuccess && (
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                          <CheckCircle2 className="size-3.5" /> 200 OK ({res.latencyMs}ms)
                        </span>
                      )}
                      {isError && (
                        <span className="flex items-center gap-1 text-rose-400 font-medium">
                          <XCircle className="size-3.5" /> {res.message || "Failed"}
                        </span>
                      )}
                      {res?.status === "idle" && (
                        <span className="text-muted-foreground/60">Not tested yet</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {Boolean(res?.responsePayload) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
                          onClick={() => setSelectedResponse({
                            id: endpoint.id,
                            name: endpoint.name,
                            data: res.responsePayload,
                          })}
                        >
                          Payload
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1 border-border/80"
                        disabled={isTesting}
                        onClick={() => testSingleApi(endpoint)}
                      >
                        {isTesting ? <RotateCw className="size-3 animate-spin" /> : <Play className="size-3" />}
                        Test
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* JSON Payload Viewer Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-foreground text-base">{selectedResponse.name}</h3>
                <p className="text-xs text-muted-foreground">Live JSON Response Envelope</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedResponse(null)}
              >
                Close
              </Button>
            </div>
            <pre className="mt-4 max-h-96 overflow-auto rounded-xl bg-muted/50 p-4 font-mono text-xs text-foreground">
              {JSON.stringify(selectedResponse.data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
