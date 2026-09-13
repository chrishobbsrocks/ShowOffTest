"use server";

import { redirect } from "next/navigation";
import { createAccount } from "@/lib/auth/create-account";
import { createClient } from "@/lib/supabase/server";
import { GENERIC_FALLBACK_MESSAGE } from "@/lib/validation/messages";
import type { SignupFieldValues } from "@/lib/validation/signup";
import type { SignupActionState } from "./state";

/**
 * The sign-up Server Action (req 2–7; ACC-1 through ACC-6). Re-runs the
 * same validation module the form already ran client-side (req 3: never
 * trust the client), then delegates the all-or-nothing account creation to
 * lib/auth/create-account.ts. On success it signs the browser in — via the
 * cookie-scoped client, the only place this flow touches a real user
 * session — so the new account is usable at once (req 7).
 */
export async function signupAction(
  _prevState: SignupActionState,
  formData: FormData,
): Promise<SignupActionState> {
  const values: SignupFieldValues = {
    avatar: (formData.get("avatar") as string | null) || null,
    displayName: (formData.get("displayName") as string | null) ?? "",
    email: (formData.get("email") as string | null) ?? "",
    password: (formData.get("password") as string | null) ?? "",
  };

  // `redirect()` throws to unwind to Next's router, so — per
  // node_modules/next/dist/docs/01-app/03-api-reference/04-functions/redirect.md
  // — it must never be called inside this try block, or our own catch
  // below would swallow it and report the generic fallback on a
  // successful sign-up. Both redirect targets are decided here and
  // performed once we're out of the try/catch entirely.
  let redirectTo: "/home" | "/login";
  try {
    const result = await createAccount(values);

    if (!result.ok) {
      if ("fieldErrors" in result) {
        return { values, fieldErrors: result.fieldErrors };
      }
      return { values, fieldErrors: {}, formError: result.formError };
    }

    const supabase = await createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: values.email.trim(),
      password: values.password,
    });

    if (signInError) {
      // The account exists and is fully usable — only the automatic sign-in
      // failed (e.g. a transient network issue). Report it (NFR-7) and send
      // the player to log in rather than claiming the whole submission
      // failed, which would be untrue.
      console.error("[signupAction] sign-in after account creation failed", signInError);
      redirectTo = "/login";
    } else {
      redirectTo = "/home";
    }
  } catch (err) {
    // NFR-7: createAccount/createClient can throw synchronously (e.g. a
    // missing env var reaching createAdminClient) rather than returning an
    // error, and a thrown value from a Server Action reaches the client as
    // an unhandled error with no field or form message. Report it and fall
    // back to the generic message instead (loginAction already does this
    // for the same reason — QA1 gate-1 audit round 1, sprint 2, should-fix
    // item 5).
    console.error("[signupAction] unhandled error", err);
    return { values, fieldErrors: {}, formError: GENERIC_FALLBACK_MESSAGE };
  }

  redirect(redirectTo);
}
