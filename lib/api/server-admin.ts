import { headers } from "next/headers";
import { apiUrl } from "@/lib/api/client";

/**
 * Server-side authenticated GET helper for admin Server Components.
 * Forwards the incoming Cookie header to the remote API with `no-store`.
 */
export async function fetchAdminServer<T>(path: string, fallback: T): Promise<T> {
  try {
    const cookieHeader = (await headers()).get("cookie") || "";
    const res = await fetch(apiUrl(path), {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}
