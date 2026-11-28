import { apiUrl } from "@/lib/api/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const cookieHeader = (await headers()).get("cookie") || "";
  if (!cookieHeader) {
    redirect("/admin/login");
  }
  try {
    const res = await fetch(apiUrl("/api/auth/me"), {
      method: "GET",
      headers: {
        Accept: "application/json",
        Cookie: cookieHeader,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      redirect("/admin/login");
    }
    const data = (await res.json()) as {
      user?: { id?: string; name?: string | null; email?: string | null; role?: string | null } | null;
    };
    const user = data?.user ?? (data as { id?: string; role?: string | null });
    if (!user || !("role" in user)) {
      redirect("/admin/login");
    }
    return { user };
  } catch {
    redirect("/admin/login");
  }
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (session.user.role !== "admin") {
    redirect("/admin/login");
  }
  return session;
}
