"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Req 12 (ACC-10, 8.14): confirming ends the session. Uses the
 * cookie-scoped client so `signOut()` actually clears the session cookies
 * proxy.ts and lib/auth/session.ts both read — the session stays gone
 * after a reload because it's gone from the cookie store, not just from
 * client-side memory.
 */
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
