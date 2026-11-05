import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const authSecret =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "dev-secret-change-in-production-openssl-rand-base64-32";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept missing static assets to prevent Next server RSC 404 fallback loop and Error 1102
  if (pathname.startsWith("/_next/static/")) {
    const isCss = pathname.endsWith(".css");
    const isJs = pathname.endsWith(".js") || pathname.endsWith(".mjs");
    return new NextResponse(
      isJs ? "/* Chunk not found */" : isCss ? "/* Style not found */" : "Not Found",
      {
        status: 404,
        statusText: "Not Found",
        headers: {
          "Content-Type": isCss
            ? "text/css; charset=utf-8"
            : isJs
            ? "application/javascript; charset=utf-8"
            : "text/plain; charset=utf-8",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }

  // Set request headers including x-pathname for server component & layout context
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  // Skip static assets, favicon, API auth routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Detect session cookies across all NextAuth / Auth.js formats
  const hasAuthJsCookie =
    request.cookies.has("authjs.session-token") ||
    request.cookies.has("__Secure-authjs.session-token");
  const hasNextAuthCookie =
    request.cookies.has("next-auth.session-token") ||
    request.cookies.has("__Secure-next-auth.session-token");

  // Determine active cookie name to allow getToken to decode correctly
  const cookieName = request.cookies.has("__Secure-authjs.session-token")
    ? "__Secure-authjs.session-token"
    : request.cookies.has("authjs.session-token")
    ? "authjs.session-token"
    : request.cookies.has("__Secure-next-auth.session-token")
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";

  const isSecureCookie = cookieName.startsWith("__Secure-");

  // Decode token defensively
  let token = null;
  if (hasAuthJsCookie || hasNextAuthCookie) {
    try {
      token = await getToken({
        req: request,
        secret: authSecret,
        cookieName,
        secureCookie: isSecureCookie,
      });

      if (!token) {
        token = await getToken({
          req: request,
          secret: authSecret,
        });
      }
    } catch (tokenErr) {
      console.warn("[middleware] Token verification failed:", tokenErr);
    }
  }

  // Prevent authenticated user from re-accessing login page
  if (pathname === "/admin/login") {
    if (token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Protect all other admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Rate limiting headers for contact form
  if (pathname === "/api/contact") {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    requestHeaders.set("X-Client-IP", ip);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Next.js 16 forward compatibility export
export const proxy = middleware;

export const config = {
  matcher: [
    "/_next/static/:path*",
    "/((?!_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
