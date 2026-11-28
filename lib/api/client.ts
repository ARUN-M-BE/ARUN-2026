const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

if (!BASE && process.env.NODE_ENV === "development") {
  console.error(
    "[api/client] NEXT_PUBLIC_API_URL is not set. Configure it (e.g. http://localhost:4000/arun) in .env.local."
  );
}

export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return BASE ? `${BASE}${normalized}` : normalized;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown
  ) {
    const message =
      body && typeof body === "object" && "error" in body && typeof (body as { error?: unknown }).error === "string"
        ? (body as { error: string }).error
        : `API ${status}`;
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { timeoutMs?: number } = {}
): Promise<T> {
  if (!BASE) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }
  const { timeoutMs = 10_000, headers, body, ...rest } = init;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const res = await fetch(apiUrl(path), {
    ...rest,
    body,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "X-Requested-With": "fetch",
      ...(body && !isFormData ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    signal: rest.signal ?? AbortSignal.timeout(timeoutMs),
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    throw new ApiError(res.status, data);
  }

  return data as T;
}
