import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/env";

/**
 * A Supabase client for Client Components. Uses the publishable key only
 * (never the secret key — see lib/supabase/admin.ts), so it is safe to call
 * from browser code. Works whether the operator configured the newer
 * `sb_publishable_...` key format or a legacy anon key: `createBrowserClient`
 * takes the key as an opaque string either way (sprint 1, req 8).
 */
export function createClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabasePublishableKey());
}
