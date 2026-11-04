import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets, API auth routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Protect admin routes (except login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Already logged in trying to access login page
    if (pathname === "/admin/login" && token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Rate limiting headers for contact form
  if (pathname === "/api/contact") {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const response = NextResponse.next();
    response.headers.set("X-Client-IP", ip);
    return response;
  }

  return NextResponse.next();
}

// Compatibility export
export const middleware = proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

