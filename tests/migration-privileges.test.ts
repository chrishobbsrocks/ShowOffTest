import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

/**
 * Sprint 1, req 9 / QA1 acceptance criterion 9: the baseline migration
 * creates health_check(), with execute revoked from public and granted to
 * anon only. Sprint 2 adds its own migration (profiles + RLS) alongside
 * this one — see tests/db/profiles-migration.test.ts — so this suite now
 * locates the health-check migration by name instead of assuming it is the
 * only file in the directory.
 */

const MIGRATIONS_DIR = path.resolve(__dirname, "../supabase/migrations");
const HEALTH_CHECK_MIGRATION = "20260913000000_health_check.sql";

describe("supabase/migrations", () => {
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql"));

  it("holds the health-check migration", () => {
    expect(files).toContain(HEALTH_CHECK_MIGRATION);
  });

  it("creates health_check(), revokes from public, and grants to anon only", () => {
    const sql = readFileSync(path.join(MIGRATIONS_DIR, HEALTH_CHECK_MIGRATION), "utf8");

    expect(sql).toMatch(/create\s+function\s+public\.health_check\s*\(\s*\)/i);
    expect(sql).toMatch(/returns\s+boolean/i);
    expect(sql).toMatch(/revoke\s+all\s+on\s+function\s+public\.health_check\(\)\s+from\s+public/i);
    expect(sql).toMatch(
      /grant\s+execute\s+on\s+function\s+public\.health_check\(\)\s+to\s+anon\s*;/i,
    );
    // Not granted to authenticated or service_role.
    expect(sql).not.toMatch(/grant\s+execute[^;]*\bto\b[^;]*\bauthenticated\b/i);
    expect(sql).not.toMatch(/grant\s+execute[^;]*\bto\b[^;]*\bservice_role\b/i);
  });
});
