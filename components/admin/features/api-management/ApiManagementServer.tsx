import { requireAdmin } from "@/lib/auth-guard";
import { getApiManagementDetails, checkApiManagementHealth } from "@/lib/actions";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Server,
  Activity,
  Key,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Database,
  Globe,
  Radio,
  FileCode2,
} from "lucide-react";
import Link from "next/link";

export default async function ApiManagementPage() {
  await requireAdmin();
  const details = await getApiManagementDetails();
  const health = await checkApiManagementHealth();

  const endpoints = [
    { method: "GET", path: "/projects", desc: "List all portfolio projects with filtering" },
    { method: "POST", path: "/projects", desc: "Create a new project record at the Edge" },
    { method: "PUT", path: "/projects/:id", desc: "Update existing project record" },
    { method: "DELETE", path: "/projects/:id", desc: "Remove project record" },
    { method: "GET", path: "/skills", desc: "List constellation skills and levels" },
    { method: "POST", path: "/messages", desc: "Ingress contact inquiries with rate limiting" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="API Management Gateway"
        description="Configure, test, and monitor your Edge REST API infrastructure hosted on api.arun-m.in."
      >
        <div className="flex items-center gap-2">
          <a href={details.testerUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="text-xs border-border">
              <ExternalLink className="w-3.5 h-3.5 mr-1 text-cyan-400" />
              Open API Tester
            </Button>
          </a>
          <a href={details.dashboardUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs">
              <Server className="w-3.5 h-3.5 mr-1" />
              Launch API Dashboard
            </Button>
          </a>
        </div>
      </PageHeader>

      {/* Gateway Status Banner */}
      <Card className="bg-card border-border overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-cyan-500/10 via-violet-500/5 to-transparent pointer-events-none" />
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${health.isOnline ? "bg-emerald-400" : "bg-red-400"} opacity-75`} />
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${health.isOnline ? "bg-emerald-500" : "bg-red-500"}`} />
                </span>
                <span className="text-xs font-mono font-bold uppercase text-muted-foreground">
                  {health.isOnline ? "EDGE GATEWAY ONLINE" : "GATEWAY DEGRADED"}
                </span>
              </div>
              <h2 className="text-2xl font-black text-foreground font-mono">
                {details.baseUrl}
              </h2>
              <p className="text-xs text-muted-foreground max-w-xl">
                Serverless REST API management backed by Neon PostgreSQL, Cloudflare Edge Workers, and JWT/API key authentication.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-secondary/80 border border-border">
                <div className="text-[10px] text-muted-foreground">Edge Latency</div>
                <div className="text-xl font-black text-cyan-500 mt-0.5">{health.latencyMs} ms</div>
              </div>
              <div className="p-3.5 rounded-xl bg-secondary/80 border border-border">
                <div className="text-[10px] text-muted-foreground">HTTP Status</div>
                <div className="text-xl font-black text-emerald-500 mt-0.5">{health.statusCode || 200} OK</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Grid: API Key & Config + CRUD Spec */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Security & Headers Config */}
        <Card className="bg-card border-border space-y-4">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-500" />
              API Key Authentication
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Required header for privileged operations on api.arun-m.in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-secondary/50 border border-border space-y-2">
              <div className="text-[11px] font-mono text-muted-foreground">Header Name</div>
              <code className="text-xs font-bold text-cyan-500 block font-mono">x-api-key: frrm_...</code>
            </div>

            <div className="space-y-1.5 text-muted-foreground leading-relaxed">
              <div className="flex items-center gap-2 text-foreground font-medium">
                {details.hasKey ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                )}
                <span>{details.hasKey ? "Key configured in environment" : "Key not yet set in .env.local"}</span>
              </div>
              <p className="text-[11px] pt-1">
                To link privileged CRUD mutations, set <code className="text-xs font-mono">API_MANAGEMENT_KEY=frrm_...</code> in <code className="text-xs font-mono">.env.local</code>.
              </p>
            </div>

            <div className="pt-2 border-t border-border">
              <a href={details.dashboardUrl} target="_blank" rel="noopener noreferrer" className="w-full block">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                  <ExternalLink className="w-3.5 h-3.5 mr-1" />
                  Generate Key in Edge Dashboard
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Right: Endpoint CRUD Reference */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-violet-500" />
              Available CRUD Endpoints
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Standard REST conventions for portfolio entities hosted at the Edge
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {endpoints.map((ep, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        ep.method === "GET"
                          ? "bg-emerald-500/15 text-emerald-500"
                          : ep.method === "POST"
                          ? "bg-blue-500/15 text-blue-500"
                          : ep.method === "PUT"
                          ? "bg-amber-500/15 text-amber-500"
                          : "bg-red-500/15 text-red-500"
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono font-medium text-foreground">{ep.path}</span>
                  </div>
                  <span className="text-muted-foreground text-[11px] hidden sm:inline">{ep.desc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

