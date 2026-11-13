import { NextRequest, NextResponse } from "next/server";
import { AnalyticsService } from "@/server/services";
import { upstashService } from "@/lib/integrations/upstash";
import { geoService } from "@/lib/integrations/ipstack";

export const dynamic = "force-dynamic";

interface PageViewPayload {
  path?: string;
  referrer?: string | null;
  visitorId?: string | null;
  consent?: boolean;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "127.0.0.1"
  );
}

function detectDevice(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk/.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android.*mobile|windows phone/.test(ua)) return "mobile";
  if (ua.length === 0) return "unknown";
  return "desktop";
}

async function hashVisitor(ip: string, userAgent: string): Promise<string> {
  const day = new Date().toISOString().slice(0, 10);
  const input = `${ip}|${userAgent}|${day}`;
  try {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, 24);
  } catch {
    return "anon";
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as PageViewPayload;

    // DPDP Act 2023: analytics is strictly opt-in. Without explicit consent we
    // acknowledge the beacon and store nothing.
    if (body.consent !== true) {
      return NextResponse.json(
        { success: true, data: { recorded: false, reason: "consent_required" } },
        { status: 202 }
      );
    }

    const ip = getClientIp(req);
    const userAgent = req.headers.get("user-agent") || "";
    const rateLimit = await upstashService.checkRateLimit(`pageview:${ip}`, 120, 60);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Please retry shortly." },
        { status: 429, headers: { "retry-after": String(Math.max(1, rateLimit.reset - Math.floor(Date.now() / 1000))) } }
      );
    }

    // Cloudflare already exposes geo in request headers (zero extra latency).
    let countryCode = req.headers.get("cf-ipcountry");
    let countryName: string | null = null;
    let city: string | null = req.headers.get("cf-ipcity");

    // Free IPstack / FreeIPAPI fallback only when the edge did not resolve geo.
    if (!countryCode && ip !== "127.0.0.1" && ip !== "::1") {
      try {
        const geo = await geoService.lookup(ip);
        countryCode = geo.countryCode;
        countryName = geo.countryName;
        city = geo.city || city;
      } catch {
        // Geo enrichment is best effort and never blocks the page view.
      }
    }

    if (countryCode && !countryName) {
      try {
        const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
        countryName = regionNames.of(countryCode.toUpperCase()) || countryCode;
      } catch {
        countryName = countryCode;
      }
    }

    const visitorHash = await hashVisitor(ip, userAgent);
    const path = (body.path || req.headers.get("referer") || "/").slice(0, 300);

    const record = await AnalyticsService.recordPageView({
      path,
      referrer: body.referrer || null,
      countryCode: countryCode || null,
      countryName,
      city: city || null,
      device: detectDevice(userAgent),
      visitorHash,
    });

    // Best-effort Redis counters (Upstash free tier). The database row above is
    // the authoritative source of truth.
    const day = new Date().toISOString().slice(0, 10);
    const [totalCounter, todayCounter] = await Promise.all([
      upstashService.increment("pageviews:total", 60 * 60 * 24 * 30),
      upstashService.increment(`pageviews:day:${day}`, 60 * 60 * 24 * 3),
      upstashService.increment(`pageviews:path:${record.path}`, 60 * 60 * 24 * 7),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        recorded: true,
        id: record.id,
        counters: {
          total: totalCounter,
          today: todayCounter,
          mode: upstashService.isConfigured() ? "upstash_redis" : "database_only",
        },
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Failed to record page view" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const rateLimit = await upstashService.checkRateLimit(`pageview-summary:${ip}`, 60, 60);
  if (!rateLimit.success) {
    return NextResponse.json({ success: false, error: "Rate limit exceeded" }, { status: 429 });
  }

  const summary = await AnalyticsService.getSummary();

  return NextResponse.json(
    {
      success: true,
      data: {
        ...summary,
        rateLimit: { remaining: rateLimit.remaining, mode: rateLimit.mode },
      },
    },
    { headers: { "cache-control": "no-store, max-age=0" } }
  );
}
