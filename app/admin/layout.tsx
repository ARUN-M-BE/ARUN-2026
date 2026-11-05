import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isLoginPage = pathname === "/admin/login" || pathname.startsWith("/admin/login");

  let session = null;
  try {
    session = await auth();
  } catch (authErr) {
    console.warn("[AdminLayout] Session lookup error:", authErr);
  }

  if (!session?.user) {
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
        <AdminHeader user={session.user} />
        <main className="w-full max-w-[1600px] mx-auto flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
