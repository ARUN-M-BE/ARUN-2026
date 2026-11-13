"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const CONSENT_KEY = "cookie_consent_preferences";
const SESSION_KEY = "pv_visitor_id";
const CONSENT_EVENT = "cookie-consent-updated";

function hasAnalyticsConsent(): boolean {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return false;
    const prefs = JSON.parse(raw) as { analytics?: boolean };
    return prefs?.analytics === true;
  } catch {
    return false;
  }
}

function getVisitorId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `v-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

/**
 * Privacy-first page view beacon.
 * Records one view per path per browser session, only after explicit analytics
 * consent (DPDP Act 2023). Powered by Upstash + IPstack on the server.
 */
export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    const trackedKey = `pv_tracked:${pathname}`;
    const send = () => {
      if (!hasAnalyticsConsent()) return;
      if (sessionStorage.getItem(trackedKey)) return;
      sessionStorage.setItem(trackedKey, "1");

      const payload = JSON.stringify({
        path: pathname,
        referrer: typeof document !== "undefined" ? document.referrer || null : null,
        visitorId: getVisitorId(),
        consent: true,
      });

      void fetch("/api/analytics/pageview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
        cache: "no-store",
      }).catch(() => {
        // Never block rendering on analytics failures.
      });
    };

    send();

    // Re-evaluate the moment the visitor grants consent in the cookie banner.
    const onConsentUpdated = () => send();
    window.addEventListener(CONSENT_EVENT, onConsentUpdated);
    return () => window.removeEventListener(CONSENT_EVENT, onConsentUpdated);
  }, [pathname]);

  return null;
}
