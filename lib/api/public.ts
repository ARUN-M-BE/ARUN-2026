const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

if (!BASE && process.env.NODE_ENV === "development") {
  console.error(
    "[api/public] NEXT_PUBLIC_API_URL is not set. Public pages will render bundled fallback data."
  );
}

/**
 * Server-side anonymous, cached GET helper for public endpoints.
 * Never throws: returns `fallback` when the remote API is unconfigured,
 * unreachable, or returns a non-2xx status.
 */
export async function getPublic<T>(
  path: string,
  fallback: T,
  opts: { revalidate?: number; tags?: string[] } = {}
): Promise<T> {
  if (!BASE) return fallback;

  const normalized = path.startsWith("/") ? path : `/${path}`;
  try {
    const res = await fetch(`${BASE}${normalized}`, {
      next: {
        revalidate: opts.revalidate ?? 60,
        ...(opts.tags ? { tags: opts.tags } : {}),
      },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}
