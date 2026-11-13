/**
 * Standalone API Test Runner for All Project Endpoints
 * Tests each API route handler directly, benchmarks latency, and validates JSON envelopes.
 */

import { NextRequest } from "next/server";
import { GET as healthGet } from "../app/api/health/route";
import { GET as projectsGet } from "../app/api/projects/route";
import { GET as navGet } from "../app/api/navigation/route";
import { GET as sectionsGet } from "../app/api/sections/route";
import { GET as socialLinksGet } from "../app/api/social-links/route";
import { GET as resendGet, POST as resendPost } from "../app/api/integrations/resend/route";
import { GET as monkeytypeGet } from "../app/api/integrations/monkeytype/route";
import { GET as ipstackGet } from "../app/api/integrations/ipstack/route";
import { GET as upstashGet } from "../app/api/integrations/upstash/route";
import { POST as contactPost } from "../app/api/contact/route";
import { POST as resendWebhookPost } from "../app/api/webhooks/resend/route";

interface ApiTestDefinition {
  name: string;
  endpoint: string;
  method: "GET" | "POST";
  execute: () => Promise<Response>;
}

const apisToTest: ApiTestDefinition[] = [
  {
    name: "System Health API",
    endpoint: "/api/health",
    method: "GET",
    execute: async () => healthGet(new Request("http://localhost:3000/api/health")),
  },
  {
    name: "Projects API",
    endpoint: "/api/projects?limit=5",
    method: "GET",
    execute: async () => {
      const req = new NextRequest("http://localhost:3000/api/projects?limit=5");
      return projectsGet(req);
    },
  },
  {
    name: "Navigation API",
    endpoint: "/api/navigation",
    method: "GET",
    execute: async () => navGet(new NextRequest("http://localhost:3000/api/navigation")),
  },
  {
    name: "Website Sections API",
    endpoint: "/api/sections",
    method: "GET",
    execute: async () => {
      const req = new NextRequest("http://localhost:3000/api/sections");
      return sectionsGet(req);
    },
  },
  {
    name: "Social Links API",
    endpoint: "/api/social-links",
    method: "GET",
    execute: async () => socialLinksGet(new NextRequest("http://localhost:3000/api/social-links")),
  },
  {
    name: "Resend Audiences & Status",
    endpoint: "/api/integrations/resend",
    method: "GET",
    execute: async () => resendGet(),
  },
  {
    name: "Resend Send Email (Free Mock/API)",
    endpoint: "/api/integrations/resend",
    method: "POST",
    execute: async () => {
      const req = new NextRequest("http://localhost:3000/api/integrations/resend", {
        method: "POST",
        body: JSON.stringify({
          action: "send_email",
          to: "test@example.com",
          subject: "Live API Test",
          html: "<p>Automated API check passed</p>",
        }),
      });
      return resendPost(req);
    },
  },
  {
    name: "Monkeytype Public Stats",
    endpoint: "/api/integrations/monkeytype",
    method: "GET",
    execute: async () => monkeytypeGet(),
  },
  {
    name: "GeoIP & IPstack",
    endpoint: "/api/integrations/ipstack?ip=8.8.8.8",
    method: "GET",
    execute: async () => {
      const req = new NextRequest("http://localhost:3000/api/integrations/ipstack?ip=8.8.8.8");
      return ipstackGet(req);
    },
  },
  {
    name: "Upstash Redis Rate Limiter",
    endpoint: "/api/integrations/upstash?id=live-test-suite",
    method: "GET",
    execute: async () => {
      const req = new NextRequest("http://localhost:3000/api/integrations/upstash?id=live-test-suite");
      return upstashGet(req);
    },
  },
  {
    name: "Contact Form Submission",
    endpoint: "/api/contact",
    method: "POST",
    execute: async () => {
      const req = new NextRequest("http://localhost:3000/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: "Test Runner",
          email: "tester@arun-m.in",
          message: "Live automated API validation message",
          consentGiven: true,
        }),
      });
      return contactPost(req);
    },
  },
  {
    name: "Resend Webhook Handler",
    endpoint: "/api/webhooks/resend",
    method: "POST",
    execute: async () => {
      const req = new NextRequest("http://localhost:3000/api/webhooks/resend", {
        method: "POST",
        body: JSON.stringify({
          type: "email.delivered",
          created_at: new Date().toISOString(),
          data: { email_id: "test_123" },
        }),
      });
      return resendWebhookPost(req);
    },
  },
];

async function main() {

  let passedCount = 0;
  let failedCount = 0;
  const results: Array<{ name: string; endpoint: string; status: number; latency: number; ok: boolean }> = [];

  for (const api of apisToTest) {
    const start = performance.now();
    try {
      const res = await api.execute();
      const latency = Math.round(performance.now() - start);
      const isOk = res.status >= 200 && res.status < 300;

      const body = await res.json() as Record<string, unknown>;
      const hasSuccessFlag = body.success !== false;

      if (isOk && hasSuccessFlag) {
        passedCount++;
        results.push({ name: api.name, endpoint: api.endpoint, status: res.status, latency, ok: true });
        console.log(`  ✓ [${res.status} OK] ${api.name.padEnd(35)} (${latency}ms) -> ${api.endpoint}`);
      } else {
        failedCount++;
        results.push({ name: api.name, endpoint: api.endpoint, status: res.status, latency, ok: false });
        console.error(`  ✗ [${res.status} ERR] ${api.name.padEnd(35)} (${latency}ms) -> Error: ${JSON.stringify(body)}`);
      }
    } catch (err: unknown) {
      const latency = Math.round(performance.now() - start);
      failedCount++;
      results.push({ name: api.name, endpoint: api.endpoint, status: 500, latency, ok: false });
      console.error(`  ✗ [500 EXCEPTION] ${api.name.padEnd(35)} (${latency}ms) -> ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  const avgLatency = Math.round(results.reduce((acc, r) => acc + r.latency, 0) / results.length);

  console.log("\n================================================================================");
  console.log(`TOTAL APIS TESTED : ${results.length}`);
  console.log(`PASSED            : ${passedCount}`);
  console.log(`FAILED            : ${failedCount}`);
  console.log(`AVERAGE LATENCY   : ${avgLatency}ms`);
  console.log("================================================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error running API tests:", err);
  process.exit(1);
});
