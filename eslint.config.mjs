import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // This repository also hosts the Fully Completely framework's own
    // tooling alongside the app. Those directories are not application
    // source and must never be linted or type-checked (sprint 1, req 1).
    "scripts/**",
    ".claude/**",
    "templates/**",
    "docs/sprints/**",
    // Supabase CLI scratch output, not application source.
    "supabase/.temp/**",
  ]),
]);

export default eslintConfig;
