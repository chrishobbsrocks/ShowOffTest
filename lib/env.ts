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

/**
 * Exported so lib/env.server.ts (the secret key's server-only home, see
 * below) can reuse the same throw-loudly behaviour rather than duplicating
 * it.
 */
export function required(name: string, value: string | undefined): string {
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

// getSupabaseSecretKey lives in lib/env.server.ts, not here: this module is
// imported by lib/supabase/browser.ts (client code), and QA1's sprint 1
// round 1 audit found that reading the secret key from a module reachable
// from client code risks it landing in a client bundle once something
// actually imports browser.ts from client code (SEC-4). Moving it to its
// own `server-only`-guarded module makes that fail to import instead.
