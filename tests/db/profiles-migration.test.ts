import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Sprint 2, req 8 / acceptance criterion 8: statically checks the profiles
 * migration's shape (RLS on, row-scoped policies, column-scoped update
 * grant, no browser-writable insert/delete). The actual runtime behaviour
 * (RLS really refuses what it claims to, the unique constraint really
 * rejects a case-insensitive clash) is proven against the local Supabase
 * stack in tests/db/profiles.integration.test.ts — this suite is QA1's
 * "migration policies read" half of that criterion.
 */

const MIGRATION_PATH = path.resolve(
  __dirname,
  "../../supabase/migrations/20260913010000_profiles.sql",
);
const sql = readFileSync(MIGRATION_PATH, "utf8");

describe("supabase/migrations/20260913010000_profiles.sql", () => {
  it("creates the profiles table with the required columns", () => {
    expect(sql).toMatch(/create\s+table\s+public\.profiles/i);
    expect(sql).toMatch(/id\s+uuid\s+primary\s+key\s+references\s+auth\.users/i);
    expect(sql).toMatch(/display_name\s+text\s+not\s+null/i);
    expect(sql).toMatch(/avatar\s+text\s+not\s+null/i);
    expect(sql).toMatch(/tutorial_completed_at\s+timestamptz/i);
    expect(sql).toMatch(/created_at\s+timestamptz\s+not\s+null\s+default\s+now\(\)/i);
  });

  it("enforces case-insensitive display-name uniqueness in the database", () => {
    expect(sql).toMatch(
      /create\s+unique\s+index\s+profiles_display_name_lower_key\s+on\s+public\.profiles\s*\(\s*lower\(display_name\)\s*\)/i,
    );
  });

  it("enables row level security", () => {
    expect(sql).toMatch(/alter\s+table\s+public\.profiles\s+enable\s+row\s+level\s+security/i);
  });

  it("scopes select and update to the row's own owner", () => {
    expect(sql).toMatch(/for\s+select[\s\S]*?using\s*\(\s*auth\.uid\(\)\s*=\s*id\s*\)/i);
    expect(sql).toMatch(
      /for\s+update[\s\S]*?using\s*\(\s*auth\.uid\(\)\s*=\s*id\s*\)[\s\S]*?with\s+check\s*\(\s*auth\.uid\(\)\s*=\s*id\s*\)/i,
    );
  });

  it("grants update on exactly display_name, avatar and tutorial_completed_at, never the whole row", () => {
    expect(sql).toMatch(
      /grant\s+update\s*\(\s*display_name\s*,\s*avatar\s*,\s*tutorial_completed_at\s*\)\s+on\s+public\.profiles\s+to\s+authenticated/i,
    );
    // No blanket UPDATE grant (without a column list) to authenticated or anon.
    expect(sql).not.toMatch(/grant\s+update\s+on\s+public\.profiles\s+to\b/i);
  });

  it("grants no INSERT or DELETE to anon or authenticated", () => {
    expect(sql).not.toMatch(/grant\s+insert[^;]*\bto\b[^;]*\b(anon|authenticated)\b/i);
    expect(sql).not.toMatch(/grant\s+delete[^;]*\bto\b[^;]*\b(anon|authenticated)\b/i);
  });
});
