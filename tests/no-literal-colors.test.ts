import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { REPO_ROOT, scanSourceFiles } from "./support/scan-source-files";

/**
 * Sprint 1, req 3 (P6); sprint 2, req 16 / AC17: no hex, rgb()/rgba() or
 * hsl()/hsla() colour literal may appear in application source outside the
 * single token stylesheet (app/tokens.css). Walks every application source
 * directory (see tests/support/scan-source-files.ts) rather than a fixed
 * app/lib allow-list, so a new directory (components/, a root-level file
 * like proxy.ts) is covered the moment it exists, not only once someone
 * remembers to add it here.
 */

const ROOT = REPO_ROOT;
const EXEMPT_FILES = new Set([path.resolve(ROOT, "app/tokens.css")]);

const COLOUR_LITERAL_RE = /#[0-9a-fA-F]{3,8}\b|\bhsla?\(|\brgba?\(/g;

const files = scanSourceFiles([".ts", ".tsx", ".css"]);

describe("no literal colours outside the token stylesheet", () => {
  it("scanned at least one file", () => {
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
