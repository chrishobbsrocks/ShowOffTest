import { createClient } from "@/lib/supabase/server";

/**
 * Proves the database is reachable end to end, including that the baseline
 * migration (supabase/migrations) actually applied (sprint 1, req 9, 10).
 * Calls `health_check()` — granted to the `anon` role only — through the
 * session-scoped server client, so this route needs no elevated privilege.
 *
 * The response body is deliberately minimal on both paths: no error text,
 * keys, URLs or stack traces ever reach the client. Failures are still
 * logged server-side (Vercel's runtime logs / the server console) per
 * NFR-7 and D-57 — nothing is silently swallowed, it just isn't echoed
 * back to the caller.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("health_check");

    if (error || data !== true) {
      if (error) {
        console.error("[GET /api/health] health_check() failed", error);
      } else {
        console.error(
          "[GET /api/health] health_check() returned an unexpected value",
          data,
        );
      }
      return jsonResponse(false, 503);
    }

    return jsonResponse(true, 200);
  } catch (err) {
    console.error("[GET /api/health] unhandled error calling Supabase", err);
    return jsonResponse(false, 503);
  }
}

function jsonResponse(ok: boolean, status: number): Response {
  return Response.json({ ok, database: ok }, { status });
}
