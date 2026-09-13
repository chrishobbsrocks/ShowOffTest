import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { GENERIC_FALLBACK_MESSAGE } from "@/lib/validation/messages";
import {
  SIGNUP_MESSAGES,
  normalizeDisplayName,
  validateSignupFields,
  type SignupFieldErrors,
  type SignupFieldValues,
} from "@/lib/validation/signup";

export type CreateAccountResult =
  | { ok: true; userId: string }
  | { ok: false; fieldErrors: SignupFieldErrors }
  | { ok: false; formError: string };

/**
 * Sign-up's all-or-nothing account creation (req 5, 6, 7; ACC-5, ACC-6).
 * Runs entirely server-side with the service-role client — never the
 * browser's role — because it has to do two things atomically that live in
 * different systems (Supabase Auth's user table and this app's own
 * `profiles` table) with no single SQL transaction spanning both:
 *
 *   1. Create the auth credential (`auth.admin.createUser`, immediately
 *      confirmed — D-03/ACC-6: no confirmation email is ever sent).
 *   2. Insert the profile row.
 *
 * If step 2 fails (most commonly the case req 4 covers: a case-insensitive
 * display-name clash caught by the database's own unique index), step 1 is
 * rolled back by deleting the just-created auth user, so no credential is
 * ever left behind without a profile — and the same email can then be used
 * to retry immediately, rather than being reported as already registered
 * (ACC-5). The forced-failure path is exercised directly in
 * tests/db/profiles.integration.test.ts.
 *
 * Establishing the browser's actual signed-in session (req 7: "immediate
 * access") is the caller's job, via the cookie-scoped client — this
 * function only ever touches the service-role client, which never carries
 * a session to hand back.
 */
export async function createAccount(values: SignupFieldValues): Promise<CreateAccountResult> {
  const fieldErrors = validateSignupFields(values);
  if (Object.values(fieldErrors).some((message) => message !== undefined)) {
    return { ok: false, fieldErrors };
  }

  const email = values.email.trim();
  const displayName = normalizeDisplayName(values.displayName);
  const avatar = values.avatar as string;
  const admin = createAdminClient();

  const { data: createdUser, error: createUserError } = await admin.auth.admin.createUser({
    email,
    password: values.password,
    email_confirm: true, // No confirmation email is ever sent (D-03/ACC-6).
  });

  if (createUserError || !createdUser?.user) {
    if (isDuplicateEmailError(createUserError)) {
      return { ok: false, fieldErrors: { email: SIGNUP_MESSAGES.emailTaken } };
    }
    console.error("[createAccount] auth.admin.createUser failed", createUserError);
    return { ok: false, formError: GENERIC_FALLBACK_MESSAGE };
  }

  const userId = createdUser.user.id;

  const { error: profileError } = await admin
    .from("profiles")
    .insert({ id: userId, display_name: displayName, avatar });

  if (profileError) {
    const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
    if (deleteError) {
      // Genuinely unrecoverable: a credential now exists with no matching
      // profile, and we could not undo it. Report loudly (NFR-7) rather
      // than let the caller believe "all or nothing" held when it didn't.
      console.error(
        "[createAccount] rollback failed after profile insert error — orphaned auth user",
        userId,
        { profileError, deleteError },
      );
      return { ok: false, formError: GENERIC_FALLBACK_MESSAGE };
    }

    if (isUniqueViolation(profileError)) {
      return { ok: false, fieldErrors: { displayName: SIGNUP_MESSAGES.displayNameTaken } };
    }
    console.error("[createAccount] profile insert failed", profileError);
    return { ok: false, formError: GENERIC_FALLBACK_MESSAGE };
  }

  return { ok: true, userId };
}

function isDuplicateEmailError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  // GoTrue returns a 422/"email_exists" style error for a duplicate email;
  // match on either the structured code (when present) or the message text
  // so this isn't brittle to a code the client library doesn't surface.
  return (
    error.code === "email_exists" ||
    /already registered|already exists|already been registered/i.test(error.message ?? "")
  );
}

function isUniqueViolation(error: { code?: string }): boolean {
  // Postgres unique_violation.
  return error.code === "23505";
}
