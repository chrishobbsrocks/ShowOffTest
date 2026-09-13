/**
 * Reads the four Supabase/site environment variables Sprint 1 req 8 names,
 * and only those — see CLAUDE.md, D-57: "a sprint that finds it needs
 * another one stops and raises it with Master Controller" rather than
 * silently adding to this list.
 *
 * Every accessor throws a clear error instead of returning `undefined` and
 * letting a missing variable surface later as a confusing runtime failure
 * deep inside the Supabase client (NFR-7: no silent failure).
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Set it in .env.local ` +
        `for local development (see .env.example), or in Vercel's ` +
        `Production environment for a deployed build.`,
    );
  }
  return value;
}

/** Safe to read from client and server code. */
export function getSupabaseUrl(): string {
  return required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
}

/** Safe to read from client and server code — this is the public key. */
export function getSupabasePublishableKey(): string {
  return required(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

/** Safe to read from client and server code. */
export function getSiteUrl(): string {
  return required("NEXT_PUBLIC_SITE_URL", process.env.NEXT_PUBLIC_SITE_URL);
}

/**
 * Server code only. Callers must import this from a module guarded by
 * `server-only` (see lib/supabase/admin.ts) — this function does not
 * itself enforce that, so never call it from a module without that guard.
 */
export function getSupabaseSecretKey(): string {
  return required("SUPABASE_SECRET_KEY", process.env.SUPABASE_SECRET_KEY);
}
