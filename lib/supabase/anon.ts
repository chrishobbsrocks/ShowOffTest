import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/env";

/**
 * A Supabase client that carries no user session at all: no cookies read,
 * forwarded or refreshed, and no auth state persisted or auto-refreshed.
 * Uses the publishable key only, so it is exactly as privileged as any
 * unauthenticated caller (never more) — the opposite end of the spectrum
 * from lib/supabase/admin.ts, which is more privileged than any caller.
 *
 * D-62 / sprint 2 req 16: GET /api/health uses this instead of the
 * cookie-scoped client from lib/supabase/server.ts, specifically so a
 * signed-in caller gets exactly the same response as anyone else.
 * health_check()'s own grant stays anon-role-only regardless (see
 * supabase/migrations) — this client only changes what the *caller*
 * carries, not what the database allows.
 */
export function createAnonClient() {
  return createSupabaseClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
