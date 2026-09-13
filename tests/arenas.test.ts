import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { ARENAS, getArenaForTrophies } from "@/lib/arenas";
import { REPO_ROOT, scanSourceFiles } from "./support/scan-source-files";

/**
 * Sprint 2, req 13 / acceptance criterion 13 (ARN-1, ARN-2, ARN-3): exactly
 * one arena definition, and no threshold or arena name repeated anywhere
 * else in application source.
 */

describe("ARENAS", () => {
  it("defines exactly six tiers, in order, with the PRD's thresholds and labels", () => {
    expect(ARENAS.map((a) => a.tier)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(ARENAS.map((a) => a.threshold)).toEqual([0, 200, 600, 1200, 2000, 3000]);
    expect(ARENAS.map((a) => a.label)).toEqual([
      "Arena 1 · Warm Up",
      "Arena 2 · Contender",
      "Arena 3 · Challenger",
      "Arena 4 · Expert",
      "Arena 5 · Champion",
      "Arena 6 · Legend",
    ]);
  });

  it("every background is a var() reference, never a colour literal", () => {
    for (const arena of ARENAS) {
      expect(arena.background).toMatch(/^var\(--arena-\d-background\)$/);
    }
  });
});

describe("getArenaForTrophies", () => {
  it.each([
    [0, 1],
    [199, 1],
    [200, 2],
    [599, 2],
    [600, 3],
    [1199, 3],
    [1200, 4],
    [1999, 4],
    [2000, 5],
    [2999, 5],
    [3000, 6],
    [100000, 6],
  ])("%i trophies -> tier %i", (trophies, expectedTier) => {
    expect(getArenaForTrophies(trophies).tier).toBe(expectedTier);
  });
});

describe("no threshold or arena name is repeated outside lib/arenas.ts", () => {
  const ROOT = REPO_ROOT;
  const EXEMPT_FILE = path.resolve(ROOT, "lib/arenas.ts");

  // Walks every application source directory (see
  // tests/support/scan-source-files.ts), not a fixed app/lib allow-list —
  // sprint 2's QA1 audit caught this same allow-list gap in the sibling
  // no-literal-colors check, and it applies here identically: a threshold
  // or arena name placed in components/ or a root-level file would have
  // passed unnoticed under the old app+lib-only scan.
  const files = scanSourceFiles([".ts", ".tsx", ".css"]);
  const otherFiles = files.filter((f) => f !== EXEMPT_FILE);
  // Route handlers legitimately use HTTP status code literals (200, and
  // others that could collide with a threshold, e.g. a future 1200ms
  // timeout) that have nothing to do with arena trophy thresholds — those
  // are out of scope for this check, which exists to catch a threshold
  // copied into UI/business logic, not an unrelated numeral.
  const nonRouteFiles = otherFiles.filter((f) => !f.endsWith("route.ts"));

  const THRESHOLDS = ["200", "600", "1200", "2000", "3000"];
  const ARENA_NAMES = ARENAS.map((a) => a.name);

  it("scanned at least one file outside lib/arenas.ts", () => {
    expect(otherFiles.length).toBeGreaterThan(0);
  });

  it.each(nonRouteFiles)("%s contains no arena threshold", (file) => {
    const content = readFileSync(file, "utf8");
    for (const threshold of THRESHOLDS) {
      expect(
        content,
        `${path.relative(ROOT, file)} repeats arena threshold ${threshold}`,
      ).not.toMatch(new RegExp(`\\b${threshold}\\b`));
    }
  });

  it.each(otherFiles)("%s contains no arena name", (file) => {
    const content = readFileSync(file, "utf8");
    for (const name of ARENA_NAMES) {
      expect(
        content,
        `${path.relative(ROOT, file)} repeats arena name "${name}"`,
      ).not.toContain(name);
    }
  });
});
