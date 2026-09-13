import "server-only";
import { required } from "./env";

/**
 * The Supabase secret (service-role) key — server code only.
 *
 * This lives in its own `server-only`-guarded module, separate from
 * lib/env.ts, specifically so it cannot be read from a module reachable
 * from client code (SEC-4, sprint 1 req 8). lib/env.ts is imported by
 * lib/supabase/browser.ts, which is client code; if this accessor lived
 * there too, the variable name — and, once something imports browser.ts
 * from a Client Component, potentially the bundler's treatment of it —
 * would be reachable from a module the client bundle touches. Importing
 * this module from client code fails outright instead (see
 * tests/env-server.test.ts).
 */
export function getSupabaseSecretKey(): string {
  return required("SUPABASE_SECRET_KEY", process.env.SUPABASE_SECRET_KEY);
}
