// In-memory token bucket / sliding window rate limiter for edge & node runtimes
const ipRateMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string, limit = 10, windowMs = 60000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = ipRateMap.get(ip);

  if (!record || now > record.resetAt) {
    ipRateMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count };
}

export const rateLimiter = {
  check: checkRateLimit,
};
