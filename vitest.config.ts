import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    // The framework's own tooling directories are never part of the app
    // under test (sprint 1, req 1).
    exclude: [
      "node_modules/**",
      "scripts/**",
      ".claude/**",
      "templates/**",
      "docs/sprints/**",
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
