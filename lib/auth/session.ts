import "server-only";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * The one place a player-acting handler gets "who is making this request"
 * from (req 10; SEC-1, P3). Every server action and route handler that
 * acts for a player must call this — and only this — never trust a player
 * id carried in the request body or a query string.
 *
 * `supabase.auth.getUser()` (not `getSession()`) is used deliberately: it
 * revalidates the token against Supabase Auth on every call rather than
 * trusting whatever the cookie claims, so a forged or stale cookie is
 * rejected here rather than believed.
 */
export async function getVerifiedUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
