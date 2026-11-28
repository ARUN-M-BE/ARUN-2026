"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

export interface AdminUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
}

async function fetchMe(): Promise<AdminUser | null> {
  const data = await apiFetch<{ user?: AdminUser | null } | AdminUser>(
    "/api/auth/me",
    { cache: "no-store" }
  );
  return data && typeof data === "object" && "user" in data
    ? (data.user ?? null)
    : (data as AdminUser | null);
}

export function useAdminSession() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setUser(await fetchMe());
    } catch (err) {
      setUser(null);
      setError(err instanceof Error ? err : new Error("Failed to load session"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchMe()
      .then((resolved) => {
        if (!cancelled) {
          setUser(resolved);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setUser(null);
          setError(err instanceof Error ? err : new Error("Failed to load session"));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading, error, refresh };
}
