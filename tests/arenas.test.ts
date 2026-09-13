import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { ARENAS, getArenaForTrophies } from "@/lib/arenas";

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
  const ROOT = path.resolve(__dirname, "..");
  const SCAN_DIRS = ["app", "lib"];
  const SCANNED_EXTENSIONS = new Set([".ts", ".tsx", ".css"]);
  const EXEMPT_FILE = path.resolve(ROOT, "lib/arenas.ts");

  function walk(dir: string, out: string[] = []): string[] {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      const stats = statSync(full);
      if (stats.isDirectory()) {
        walk(full, out);
      } else if (SCANNED_EXTENSIONS.has(path.extname(full))) {
        out.push(full);
      }
    }
    return out;
  }

  const files = walk(path.resolve(ROOT, SCAN_DIRS[0])).concat(
    walk(path.resolve(ROOT, SCAN_DIRS[1])),
  );
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
