import { createAnonClient } from "@/lib/supabase/anon";

/**
 * Proves the database is reachable end to end, including that the baseline
 * migration (supabase/migrations) actually applied (sprint 1, req 9, 10).
 * Calls `health_check()` — granted to the `anon` role only — through a
 * client that carries no session at all (D-62; sprint 2 req 16), so a
 * signed-in caller gets exactly the same response as anyone else: this
 * route never reads, forwards or refreshes auth cookies, and
 * `health_check()`'s own grant is unchanged (still anon-only).
 *
 * The response body is deliberately minimal on both paths: no error text,
 * keys, URLs or stack traces ever reach the client. Failures are still
 * logged server-side (Vercel's runtime logs / the server console) per
 * NFR-7 and D-57 — nothing is silently swallowed, it just isn't echoed
 * back to the caller.
 */
export async function GET() {
  try {
    const supabase = createAnonClient();
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
