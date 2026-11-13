/**
 * Geolocation & IPstack Integration - STRICTLY FREE TIER ONLY
 * Zero paid plans. Supports IPstack free tier + automatic 100% free public GeoIP fallback.
 */

export interface GeoLocationResult {
  ip: string;
  countryCode: string;
  countryName: string;
  regionName: string;
  city: string;
  latitude: number;
  longitude: number;
  mode: string;
}

const fallbackGeo: GeoLocationResult = {
  ip: "127.0.0.1",
  countryCode: "IN",
  countryName: "India",
  regionName: "Karnataka",
  city: "Bangalore",
  latitude: 12.9716,
  longitude: 77.5946,
  mode: "local_default",
};

class GeoLocationClient {
  get ipstackKey(): string | null {
    return (process.env.IPSTACK_API_KEY || "").replace(/^["']|["']$/g, "").trim() || null;
  }
  private cache = new Map<string, { data: GeoLocationResult; timestamp: number }>();
  private cacheTTLMs = 3600000; // 1-hour cache per IP to preserve free quotas

  constructor() {}

  isConfigured(): boolean {
    return Boolean(this.ipstackKey && this.ipstackKey.length > 5);
  }

  /**
   * Look up IP location using strictly free tier or free public fallback
   */
  async lookup(ip: string): Promise<GeoLocationResult> {
    const cleanIp = ip.trim().split(",")[0]?.trim() || "127.0.0.1";

    if (cleanIp === "127.0.0.1" || cleanIp === "::1" || cleanIp.startsWith("192.168.") || cleanIp.startsWith("10.")) {
      return { ...fallbackGeo, ip: cleanIp };
    }

    const cached = this.cache.get(cleanIp);
    if (cached && (Date.now() - cached.timestamp) < this.cacheTTLMs) {
      return cached.data;
    }

    // 1. If IPstack key is configured, use free tier endpoint
    if (this.isConfigured()) {
      try {
        const res = await fetch(`http://api.ipstack.com/${cleanIp}?access_key=${this.ipstackKey}`);
        if (res.ok) {
          const json = await res.json() as {
            country_code?: string;
            country_name?: string;
            region_name?: string;
            city?: string;
            latitude?: number;
            longitude?: number;
            error?: unknown;
          };

          if (!json.error && json.country_code) {
            const result: GeoLocationResult = {
              ip: cleanIp,
              countryCode: json.country_code,
              countryName: json.country_name || "Unknown",
              regionName: json.region_name || "",
              city: json.city || "",
              latitude: json.latitude || 0,
              longitude: json.longitude || 0,
              mode: "ipstack_free_tier",
            };
            this.cache.set(cleanIp, { data: result, timestamp: Date.now() });
            return result;
          }
        }
      } catch {
        // Fall through to free public fallback
      }
    }

    // 2. Free-for-life public fallback (FreeIPAPI - 100% free, no key/card required)
    try {
      const res = await fetch(`https://freeipapi.com/api/json/${cleanIp}`);
      if (res.ok) {
        const json = await res.json() as {
          countryCode?: string;
          countryName?: string;
          regionName?: string;
          cityName?: string;
          latitude?: number;
          longitude?: number;
        };

        const result: GeoLocationResult = {
          ip: cleanIp,
          countryCode: json.countryCode || "IN",
          countryName: json.countryName || "India",
          regionName: json.regionName || "Karnataka",
          city: json.cityName || "Bangalore",
          latitude: json.latitude || 12.9716,
          longitude: json.longitude || 77.5946,
          mode: "free_public_geoip",
        };
        this.cache.set(cleanIp, { data: result, timestamp: Date.now() });
        return result;
      }
    } catch {
      // Fallback
    }

    return { ...fallbackGeo, ip: cleanIp };
  }

  getHealth() {
    return {
      ipstackConfigured: this.isConfigured(),
      plan: "100% Free Plan (IPstack Free Tier + FreeIPAPI zero-cost fallback)",
      cacheTTL: "3600s in-memory caching active",
      cost: "$0.00 / Free",
    };
  }
}

export const geoService = new GeoLocationClient();
