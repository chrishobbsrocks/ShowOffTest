import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/env";
import { getSupabaseSecretKey } from "@/lib/env.server";

/**
 * A Supabase client authenticated with the secret (service-role) key. This
 * bypasses Row Level Security entirely, so it must only ever be used for
 * server-side work that has already verified the request some other way
 * (SEC-1, SEC-2, SEC-4).
 *
 * The `server-only` import above makes any accidental import of this module
 * from client code fail the build, and `SUPABASE_SECRET_KEY` (no
 * `NEXT_PUBLIC_` prefix) is never bundled for the browser. Works whether the
 * operator configured the newer `sb_secret_...` key format or a legacy
 * service-role key — `createClient` takes the key as an opaque string
 * either way (sprint 1, req 8).
 *
 * Not called anywhere in this sprint (the health check is deliberately
 * grantable to `anon` only, see supabase/migrations); this client is the
 * foundation later sprints' privileged writes (SEC-2) build on.
 */
export function createAdminClient() {
  return createSupabaseClient(getSupabaseUrl(), getSupabaseSecretKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
