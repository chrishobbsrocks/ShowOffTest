import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import postcss from "postcss";
import tailwindcssPostcss from "@tailwindcss/postcss";

/**
 * Sprint 1, req 2 (QA1 round 1 required fix): tests/token-drift.test.ts
 * checks that every token is *defined* correctly in app/tokens.css, but
 * that only proves the source file is right — it reads text, never
 * compiled output. Tailwind CSS 4 tree-shakes any `@theme` variable it
 * doesn't see referenced by a scanned utility class, which silently
 * dropped 12 of the 24 tokens here (all 7 shape/shadow/border tokens, plus
 * 5 of 7 type tokens, consumed via `var(--type-*)` rather than as utility
 * class names) even though the drift test passed. This test runs the real
 * `@tailwindcss/postcss` plugin — the same one `next build` uses — over
 * app/globals.css and asserts every token custom property survives into
 * the actual compiled CSS, not just app/tokens.css's source text.
 */

const REPO_ROOT = path.resolve(__dirname, "..");
const GLOBALS_CSS_PATH = path.resolve(REPO_ROOT, "app/globals.css");
const TOKENS_CSS_PATH = path.resolve(REPO_ROOT, "app/tokens.css");

const ALL_TOKEN_NAMES = [
  // Colour tokens (10)
  "color-bg-base",
  "color-bg-surface",
  "color-border-default",
  "color-accent",
  "color-text-default",
  "color-text-emphasis",
  "color-text-subtle",
  "color-text-secondary",
  "color-error",
  "color-error-text",
  // Shape, padding, shadow and border tokens (7)
  "radius-input",
  "radius-button",
  "padding-input-x",
  "padding-input-y",
  "shadow-xs",
  "shadow-sm",
  "border-width",
  // Type tokens (7)
  "type-input",
  "type-button",
  "type-body",
  "type-link",
  "type-caption",
  "type-legal",
  "type-error",
] as const;

describe("compiled token CSS (real @tailwindcss/postcss build)", () => {
  it("parsed the expected 24 tokens from app/tokens.css (guard against a vacuous pass)", () => {
    const stylesheet = readFileSync(TOKENS_CSS_PATH, "utf8");
    for (const name of ALL_TOKEN_NAMES) {
      expect(stylesheet, `--${name} missing from app/tokens.css source`).toMatch(
        new RegExp(`--${name}:`),
      );
    }
  });

  it("every token custom property survives Tailwind's real compile, not just the source file", async () => {
    const css = readFileSync(GLOBALS_CSS_PATH, "utf8");
    const result = await postcss([tailwindcssPostcss({ base: REPO_ROOT })]).process(
      css,
      { from: GLOBALS_CSS_PATH },
    );

    for (const name of ALL_TOKEN_NAMES) {
      expect(
        result.css,
        `--${name} did not survive the real Tailwind compile (tree-shaken out of the emitted CSS)`,
      ).toMatch(new RegExp(`--${name}:`));
    }
  });
});
