"use server";

import { redirect } from "next/navigation";
import { createAccount } from "@/lib/auth/create-account";
import { createClient } from "@/lib/supabase/server";
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
    redirect("/login");
  }

  redirect("/home");
}
