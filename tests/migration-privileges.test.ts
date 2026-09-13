import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

/**
 * Sprint 1, req 9 / QA1 acceptance criterion 9: exactly one migration,
 * creating health_check(), with execute revoked from public and granted to
 * anon only.
 */

const MIGRATIONS_DIR = path.resolve(__dirname, "../supabase/migrations");

describe("supabase/migrations", () => {
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql"));

  it("holds exactly one migration", () => {
    expect(files).toHaveLength(1);
  });

  it("creates health_check(), revokes from public, and grants to anon only", () => {
    const sql = readFileSync(path.join(MIGRATIONS_DIR, files[0]), "utf8");

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
