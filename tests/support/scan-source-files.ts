import { readdirSync, statSync } from "node:fs";
import path from "node:path";

/**
 * Shared file-walker for tests that assert something about "every
 * application source file" (no literal colours, no repeated arena
 * threshold, etc.). Walks the whole repo from its root and excludes only
 * directories that are never application source, rather than an
 * allow-list of app/lib — an allow-list silently stops covering a new
 * source directory (this is what sprint 2's QA1 audit caught: components/
 * and root-level files like proxy.ts were added but the allow-list
 * wasn't, so a colour literal or arena threshold placed there would have
 * passed unnoticed).
 */

const REPO_ROOT = path.resolve(__dirname, "..", "..");

const EXCLUDED_DIR_NAMES = new Set([
  "node_modules",
  ".git",
  ".next",
  ".github",
  ".vscode",
  ".claude",
  "tests",
  "public",
  "docs",
  "supabase",
  "scripts",
  "templates",
]);

function shouldSkipDir(name: string): boolean {
  return EXCLUDED_DIR_NAMES.has(name) || name.startsWith(".");
}

function walk(dir: string, extensions: Set<string>, out: string[]): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      if (!shouldSkipDir(entry)) {
        walk(full, extensions, out);
      }
    } else if (extensions.has(path.extname(full))) {
      out.push(full);
    }
  }
  return out;
}

/**
 * Returns every file under the repo root matching one of `extensions`,
 * excluding node_modules, build output, and every non-source directory
 * listed above (walked from the repo root, not an allow-list of source
 * directories, so a newly added source directory is covered
 * automatically).
 */
export function scanSourceFiles(extensions: string[]): string[] {
  return walk(REPO_ROOT, new Set(extensions), []);
}

export { REPO_ROOT };
