import { apiUrl } from "@/lib/api/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

interface SessionUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
}

async function resolveAdminSession(cookieHeader: string): Promise<SessionUser | null> {
  if (!cookieHeader) return null;
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
    if (!res.ok) return null;
    const data = (await res.json()) as { user?: SessionUser | null } | SessionUser;
    if (data && typeof data === "object" && "user" in data) {
      return data.user ?? null;
    }
    return (data as SessionUser) ?? null;
  } catch {
    return null;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isLoginPage = pathname === "/admin/login" || pathname.startsWith("/admin/login");

  let user: SessionUser | null = null;
  try {
    user = await resolveAdminSession(headersList.get("cookie") || "");
  } catch (authErr) {
    console.warn("[AdminLayout] Session lookup error:", authErr);
  }

  if (!user) {
    if (isLoginPage) {
      return <>{children}</>;
    }
    // Top-level layout redirect: executed before any child Suspense boundary is mounted.
    // This prevents React Error #441 stream aborts.
    redirect("/admin/login");
  }

  // Prevent authenticated admin from seeing login page
  if (isLoginPage) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader user={user} />
        <main className="w-full max-w-[1600px] mx-auto flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
