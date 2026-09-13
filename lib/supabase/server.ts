import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/env";

/**
 * A Supabase client for Server Components, Server Actions and Route
 * Handlers, scoped to the calling user's session (cookies). Uses the
 * publishable key only — the same one the browser client uses — so it
 * carries no more privilege than the signed-in user's session and RLS
 * grants it (SEC-1, SEC-2). For privileged, session-independent access use
 * lib/supabase/admin.ts instead.
 *
 * `cookies()` is async under the App Router; callers must `await` this
 * function.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component, which cannot set cookies.
          // Safe to ignore as long as session refresh also runs in
          // middleware — sprint 2 adds that alongside sign-in.
        }
      },
    },
  });
}
