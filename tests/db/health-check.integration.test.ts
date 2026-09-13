import { describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";

/**
 * Sprint 1, req 11 / req 14: runs against the local Supabase stack — never
 * production (D-53) — proving the baseline migration actually applied, not
 * just that its SQL is well-formed (that's tests/migration-privileges.test.ts).
 *
 * Requires `npm run db:start` (or CI's "Start local Supabase and apply
 * migrations" step) to have run first. If NEXT_PUBLIC_SUPABASE_URL isn't
 * set, this suite is skipped rather than failed — see CLAUDE.md, "Local
 * development database" for why a missing local stack isn't treated the
 * same as a broken one.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const hasLocalStack = Boolean(url && anonKey);
const testName = hasLocalStack
  ? "returns true when called as anon"
  : "SKIPPED — NEXT_PUBLIC_SUPABASE_URL not set; run `npm run db:start` first";

describe("health_check() against the local database", () => {
  it.skipIf(!hasLocalStack)(testName, async () => {
    const supabase = createClient(url!, anonKey!);
    const { data, error } = await supabase.rpc("health_check");

    expect(error).toBeNull();
    expect(data).toBe(true);
  });
});
