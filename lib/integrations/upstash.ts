/**
 * Upstash Redis & Rate Limiting - 100% FREE SERVERLESS TIER (10,000 commands/day)
 * Includes built-in sliding window rate limiter with in-memory fallback for local dev.
 */

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  mode: string;
}

class UpstashService {
  get restUrl(): string | null {
    return (process.env.UPSTASH_REDIS_REST_URL || "").replace(/^["']|["']$/g, "").trim() || null;
  }
  get restToken(): string | null {
    return (process.env.UPSTASH_REDIS_REST_TOKEN || "").replace(/^["']|["']$/g, "").trim() || null;
  }
  // Local sliding-window memory store for fallback rate limiting
  private memoryStore = new Map<string, number[]>();

  constructor() {}

  isConfigured(): boolean {
    return Boolean(this.restUrl && this.restToken && this.restUrl.startsWith("https://"));
  }

  /**
   * Redis GET command via Upstash REST API
   */
  async get(key: string): Promise<string | null> {
    if (!this.isConfigured()) return null;

    try {
      const res = await fetch(`${this.restUrl}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${this.restToken}` },
      });
      if (!res.ok) return null;
      const json = await res.json() as { result?: string };
      return json.result || null;
    } catch {
      return null;
    }
  }

  /**
   * Redis SET command via Upstash REST API
   */
  async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      const endpoint = ttlSeconds
        ? `${this.restUrl}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}?ex=${ttlSeconds}`
        : `${this.restUrl}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}`;

      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${this.restToken}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Sliding window rate limiter (free tier)
   * @param identifier user IP or session id
   * @param limit max allowed requests in window (default 30)
   * @param windowSeconds window duration in seconds (default 60)
   */
  async checkRateLimit(identifier: string, limit = 30, windowSeconds = 60): Promise<RateLimitResult> {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const key = `ratelimit:${identifier}`;

    // 1. If Upstash is configured, use REST pipeline
    if (this.isConfigured()) {
      try {
        const pipelineRes = await fetch(`${this.restUrl}/pipeline`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.restToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify([
            ["ZREMRANGEBYSCORE", key, 0, now - windowMs],
            ["ZCARD", key],
            ["ZADD", key, now, `${now}-${Math.random()}`],
            ["EXPIRE", key, windowSeconds],
          ]),
        });

        if (pipelineRes.ok) {
          const results = await pipelineRes.json() as Array<{ result?: number }>;
          const currentCount = (results[1]?.result || 0) + 1;
          const allowed = currentCount <= limit;
          return {
            success: allowed,
            limit,
            remaining: Math.max(0, limit - currentCount),
            reset: Math.ceil((now + windowMs) / 1000),
            mode: "upstash_redis_free_tier",
          };
        }
      } catch {
        // Fall back to in-memory rate limiter
      }
    }

    // 2. In-memory sliding window fallback (100% free, zero external dependency)
    const timestamps = this.memoryStore.get(identifier) || [];
    const validTimestamps = timestamps.filter((t) => now - t < windowMs);

    if (validTimestamps.length >= limit) {
      this.memoryStore.set(identifier, validTimestamps);
      return {
        success: false,
        limit,
        remaining: 0,
        reset: Math.ceil((validTimestamps[0] + windowMs) / 1000),
        mode: "free_local_sliding_window",
      };
    }

    validTimestamps.push(now);
    this.memoryStore.set(identifier, validTimestamps);

    return {
      success: true,
      limit,
      remaining: limit - validTimestamps.length,
      reset: Math.ceil((now + windowMs) / 1000),
      mode: "free_local_sliding_window",
    };
  }

  getHealth() {
    return {
      upstashConfigured: this.isConfigured(),
      plan: "100% Free Serverless Tier (10,000 commands/day)",
      localLimiterFallback: "Active (zero-cost sliding window)",
      cost: "$0.00 / Free",
    };
  }
}

export const upstashService = new UpstashService();
