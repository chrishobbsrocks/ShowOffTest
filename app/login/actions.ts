"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GENERIC_FALLBACK_MESSAGE, INCORRECT_CREDENTIALS_MESSAGE } from "@/lib/validation/messages";
import type { LoginActionState } from "./state";

/**
 * Req 9 (ACC-7). Wrong email and wrong password are deliberately
 * indistinguishable to the caller — both, and an unregistered email, map
 * to the same INCORRECT_CREDENTIALS_MESSAGE — so the form cannot be used
 * to enumerate accounts. Any other failure (offline, a 5xx, a thrown
 * exception) shows the generic fallback instead, never the credentials
 * message, so a network problem is never misreported as a wrong password.
 */
export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = (formData.get("email") as string | null) ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

    if (error) {
      if (isInvalidCredentialsError(error)) {
        return { email, formError: INCORRECT_CREDENTIALS_MESSAGE };
      }
      console.error("[loginAction] sign-in failed", error);
      return { email, formError: GENERIC_FALLBACK_MESSAGE };
    }
  } catch (err) {
    console.error("[loginAction] unhandled error", err);
    return { email, formError: GENERIC_FALLBACK_MESSAGE };
  }

  // Req 10 / acceptance criterion 10: after logging in, a player always
  // lands on /home — no redirect parameter is ever followed.
  redirect("/home");
}

function isInvalidCredentialsError(error: { code?: string; message?: string }): boolean {
  return (
    error.code === "invalid_credentials" ||
    /invalid login credentials/i.test(error.message ?? "")
  );
}
