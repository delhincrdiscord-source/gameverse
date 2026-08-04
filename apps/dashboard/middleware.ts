import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Validates that a session token cookie exists for Better Auth.
 * Checks standard, __Secure-, __Host- prefixed HTTPS cookies.
 */
function isAuthenticated(request: NextRequest): boolean {
  const allCookies = request.cookies.getAll();
  const sessionCookie = allCookies.find((c) =>
    c.name.includes("better-auth.session") || c.name.includes("session_token")
  );

  if (!sessionCookie || !sessionCookie.value) return false;
  return sessionCookie.value.trim().length > 0;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Root URL: redirect based on auth status
  if (pathname === "/") {
    if (isAuthenticated(request)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Public paths — always allow
  if (
    pathname === "/login" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname === "/logo.gif" ||
    pathname === "/hero-background.gif"
  ) {
    return NextResponse.next();
  }

  // Protected: /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated(request)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Everything else is public
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.gif|hero-background.gif).*)",
  ],
};
