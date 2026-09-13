import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/env";

/**
 * Req 10 (ACC-10): signed-out visitors to any of these are sent to
 * /login. This list, and its counterpart below, are the one place route
 * protection is decided — every protected page also re-checks the session
 * itself server-side (SEC-1), this is only the redirect.
 */
const PROTECTED_PATHS = ["/home", "/play", "/profile", "/leaderboard", "/tutorial"];

/** Req 1: a signed-in player visiting any of these is sent to /home. */
const SIGNED_OUT_ONLY_PATHS = ["/", "/signup", "/login"];

function matchesPath(pathname: string, configured: string): boolean {
  return pathname === configured || pathname.startsWith(`${configured}/`);
}

/**
 * Runs on (almost) every request from proxy.ts (Next.js 16 renamed
 * middleware.ts to proxy.ts; see node_modules/next/dist/docs). Two jobs,
 * both required for a session to "survive a reload" (req 10):
 *
 * 1. Refresh the Supabase session on every request, via the standard
 *    @supabase/ssr cookie-forwarding pattern — the cookies `setAll` writes
 *    here are what actually keeps a long-lived session alive past its
 *    short-lived access token's expiry.
 * 2. Redirect based on the now-current session: protected routes when
 *    signed out, and away from signed-out-only routes when signed in.
 *    `/login?next=...` is deliberately never read (acceptance criterion
 *    10): a signed-in visitor to /login always lands on /home regardless
 *    of any query string, so a crafted `next` can never be used as an
 *    open redirect.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Revalidates against Supabase Auth rather than trusting the cookie, same
  // as lib/auth/session.ts — see that file's comment.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some((path) => matchesPath(pathname, path));
  const isSignedOutOnly = SIGNED_OUT_ONLY_PATHS.includes(pathname);

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isSignedOutOnly && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
