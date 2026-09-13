import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Sprint 1, req 4: reads docs/design/design-tokens.md itself (never a
 * hardcoded copy of it) and fails if any of the 17 token names/values, or
 * the 7 valued type tokens, is missing from or differs from the shipped
 * token stylesheet (app/tokens.css). A deliberately changed value in
 * either file — the source of truth or the stylesheet — makes this fail.
 */

const DESIGN_TOKENS_PATH = path.resolve(
  __dirname,
  "../docs/design/design-tokens.md",
);
const STYLESHEET_PATH = path.resolve(__dirname, "../app/tokens.css");

const designTokensMd = readFileSync(DESIGN_TOKENS_PATH, "utf8");
const stylesheet = readFileSync(STYLESHEET_PATH, "utf8");

function section(markdown: string, heading: string): string {
  const start = markdown.indexOf(heading);
  if (start === -1) {
    throw new Error(`Heading not found in design-tokens.md: "${heading}"`);
  }
  const rest = markdown.slice(start + heading.length);
  const nextHeading = rest.search(/\n##\s/);
  return nextHeading === -1 ? rest : rest.slice(0, nextHeading);
}

/** The 10 colour custom properties, from the verbatim `:root { ... }` block. */
function parseColourTokens(markdown: string): Map<string, string> {
  const colourSection = section(markdown, "## Colour — CSS variables (verbatim)");
  const tokens = new Map<string, string>();
  const re = /--([\w-]+):\s*([^;]+);/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(colourSection))) {
    tokens.set(match[1], match[2].trim());
  }
  return tokens;
}

/** The 7 shape/padding/shadow/border tokens, from their markdown table. */
function parseShapeTokens(markdown: string): Map<string, string> {
  const shapeSection = section(
    markdown,
    "## Spacing and shape (verbatim from the tokens table)",
  );
  const tokens = new Map<string, string>();
  const re = /\|\s*`([\w-]+)`\s*\|\s*`([^`]+)`\s*\|/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(shapeSection))) {
    tokens.set(match[1], match[2].trim());
  }
  return tokens;
}

type TypeToken = { weight: string; size: string; lineHeight: string | null };

/** The 7 valued type tokens, from their markdown table. */
function parseTypeTokens(markdown: string): Map<string, TypeToken> {
  const typeSection = section(
    markdown,
    "## Type tokens seen in the component specs",
  );
  const tokens = new Map<string, TypeToken>();
  const rowRe = /\|\s*`(type-[\w-]+)`\s*\|\s*([^|]+?)\s*\|/g;
  let row: RegExpExecArray | null;
  while ((row = rowRe.exec(typeSection))) {
    const [, name, prose] = row;
    const valueRe = /(\d{3}),\s*(\d+px)(?:\s*\/\s*(\d+(?:px|%)))?/;
    const parsed = valueRe.exec(prose);
    if (!parsed) {
      throw new Error(
        `Could not parse weight/size/line-height for "${name}" from "${prose}"`,
      );
    }
    const [, weight, size, lineHeight] = parsed;
    tokens.set(name, { weight, size, lineHeight: lineHeight ?? null });
  }
  return tokens;
}

/** Reads a single custom property's value out of the shipped stylesheet. */
function stylesheetValue(name: string): string | null {
  const re = new RegExp(`--${name}:\\s*([^;]+);`);
  const match = re.exec(stylesheet);
  return match ? match[1].trim() : null;
}

describe("token drift: docs/design/design-tokens.md vs app/tokens.css", () => {
  const colourTokens = parseColourTokens(designTokensMd);
  const shapeTokens = parseShapeTokens(designTokensMd);
  const typeTokens = parseTypeTokens(designTokensMd);

  it("parsed all 10 colour tokens and 7 shape tokens from the source file", () => {
    // A guard against the parser itself silently matching nothing and the
    // rest of this suite passing vacuously.
    expect(colourTokens.size).toBe(10);
    expect(shapeTokens.size).toBe(7);
    expect(typeTokens.size).toBe(7);
  });

  it.each([...colourTokens.entries()])(
    "colour token --%s matches design-tokens.md",
    (name, expectedValue) => {
      const actual = stylesheetValue(name);
      expect(actual, `--${name} is missing from app/tokens.css`).not.toBeNull();
      expect(actual?.toLowerCase()).toBe(expectedValue.toLowerCase());
    },
  );

  it.each([...shapeTokens.entries()])(
    "shape token --%s matches design-tokens.md",
    (name, expectedValue) => {
      const actual = stylesheetValue(name);
      expect(actual, `--${name} is missing from app/tokens.css`).not.toBeNull();
      // Normalise incidental whitespace only — the value itself (numbers,
      // units, function syntax) must match exactly.
      expect(actual?.replace(/\s+/g, " ")).toBe(
        expectedValue.replace(/\s+/g, " "),
      );
    },
  );

  it.each([...typeTokens.entries()])(
    "type token --%s matches design-tokens.md's weight, size and line height",
    (name, { weight, size, lineHeight }) => {
      const actual = stylesheetValue(name);
      expect(actual, `--${name} is missing from app/tokens.css`).not.toBeNull();
      const expectedPattern = new RegExp(
        `^${weight}\\s+${size}${lineHeight ? `/${lineHeight}` : ""}\\s+var\\(--font-body\\)$`,
      );
      expect(actual).toMatch(expectedPattern);
    },
  );

  it("type-error is Space Grotesk 400, 11px, 100% line height", () => {
    const typeError = typeTokens.get("type-error");
    expect(typeError).toEqual({ weight: "400", size: "11px", lineHeight: "100%" });
    expect(stylesheetValue("type-error")).toBe("400 11px/100% var(--font-body)");
  });
});
