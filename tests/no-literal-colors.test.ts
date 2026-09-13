import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

/**
 * Sprint 1, req 3 (P6): no hex, rgb()/rgba() or hsl()/hsla() colour literal
 * may appear in application source outside the single token stylesheet
 * (app/tokens.css). Walks the actual app/ and lib/ source trees — not a
 * fixed file list — so a new file with a literal colour trips this the
 * same way an edit to an existing one would.
 */

const ROOT = path.resolve(__dirname, "..");
const SCAN_DIRS = ["app", "lib"];
const SCANNED_EXTENSIONS = new Set([".ts", ".tsx", ".css"]);
const EXEMPT_FILES = new Set([path.resolve(ROOT, "app/tokens.css")]);

const COLOUR_LITERAL_RE = /#[0-9a-fA-F]{3,8}\b|\bhsla?\(|\brgba?\(/g;

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

const files = SCAN_DIRS.flatMap((dir) => walk(path.join(ROOT, dir)));

describe("no literal colours outside the token stylesheet", () => {
  it("scanned at least one file in app/ and lib/", () => {
    // A guard against this suite passing vacuously because the scan found
    // nothing (e.g. a path typo above).
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files.filter((f) => !EXEMPT_FILES.has(f)))(
    "%s has no literal colour value",
    (file) => {
      const content = readFileSync(file, "utf8");
      const matches = content.match(COLOUR_LITERAL_RE);
      expect(
        matches,
        `${path.relative(ROOT, file)} contains a literal colour value ` +
          `(${matches?.join(", ")}). Use a token from app/tokens.css by name ` +
          `instead of a hex/rgb()/hsl() literal.`,
      ).toBeNull();
    },
  );

  it("app/tokens.css is the only exempt file and still exists", () => {
    for (const exempt of EXEMPT_FILES) {
      expect(files).toContain(exempt);
    }
  });
});
