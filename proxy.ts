import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy-session";

/**
 * Next.js 16 renamed `middleware.ts` to `proxy.ts` (functionality
 * unchanged) — see node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md.
 * This file must be named `proxy.ts` at the repo root, not `middleware.ts`.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Runs on every route except static assets and API routes. API routes
  // handle their own session verification directly (lib/auth/session.ts,
  // req 10) and return a JSON error rather than a redirect; /api/health in
  // particular must never even have its cookies touched here (D-62).
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
