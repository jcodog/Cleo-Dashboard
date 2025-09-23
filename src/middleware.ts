import { NextRequest, NextResponse } from "next/server";
import { getCookieCache } from "better-auth/cookies";
import { auth } from "@/lib/auth"; // server auth instance
import { getDb } from "@/lib/prisma";

// Public (no auth required) paths similar to previous Clerk config
const PUBLIC_PATHS: RegExp[] = [
  /^\/$/,
  /^\/sign-in(.*)$/,
  /^\/sign-up(.*)$/,
  /^\/policies(.*)$/,
  /^\/webhooks(.*)$/,
  /^\/api\/auth(.*)$/, // Better Auth internal endpoints must be public
];

// Staff-only sections
const STAFF_PATHS: RegExp[] = [/^\/staff(.*)$/, /^\/logs(.*)$/];

function matches(pathname: string, patterns: RegExp[]) {
  return patterns.some((r) => r.test(pathname));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip public routes early (but also avoid re-appending redirect repeatedly)
  if (matches(pathname, PUBLIC_PATHS)) {
    return NextResponse.next();
  }

  // Optimistic cookie-based check
  let cookieSession = await getCookieCache(req);

  // If cookie cache missing, attempt an authoritative lightweight session fetch once.
  // (This helps immediately after OAuth callback when cookies were just set.)
  if (!cookieSession) {
    try {
      const full = await auth.api.getSession({ headers: req.headers });
      if (full) {
        cookieSession = { session: { id: full.session.id } } as any;
      }
    } catch (err) {
      // swallow; we'll treat as unauthenticated below
    }
  }

  if (!cookieSession) {
    const isAuthPage =
      pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
    const isAuthCallback = pathname.startsWith("/api/auth/");
    if (isAuthPage || isAuthCallback) {
      return NextResponse.next();
    }
    const target = req.nextUrl.pathname + req.nextUrl.search;
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect", target);
    return NextResponse.redirect(signInUrl);
  }

  // Staff protection: perform authoritative role lookup via DB (NOT cookie-only)
  if (matches(pathname, STAFF_PATHS)) {
    try {
      // Validate session server-side to avoid forged cookie bypass; minimal fields
      const fullSession = await auth.api.getSession({ headers: req.headers });
      if (!fullSession) {
        const signInUrl = new URL("/sign-in", req.url);
        signInUrl.searchParams.set(
          "redirect",
          req.nextUrl.pathname + req.nextUrl.search
        );
        return NextResponse.redirect(signInUrl);
      }

      const userId = fullSession.user.id;
      // Assuming staff role stored on domain Users table (adjust if different schema)
      const db = getDb(process.env.DATABASE_URL!);
      const domainUser = await db.users.findUnique({
        where: { extId: userId },
        select: { role: true },
      });
      if (domainUser?.role !== "staff") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } catch (e) {
      // On any error, fail closed to sign-in
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set(
        "redirect",
        req.nextUrl.pathname + req.nextUrl.search
      );
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Use Node.js runtime so we can call auth.api directly (Next 15.2+ recommended)
  runtime: "nodejs",
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
