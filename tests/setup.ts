import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// vitest.config.ts does not set `test.globals`, so Testing Library's own
// auto-cleanup (which only registers when it detects a global `afterEach`)
// never fires on its own — sprint 2 is the first sprint with more than one
// component-rendering test per file, which is what surfaced this: without
// an explicit unmount between tests, a later test's `getByLabelText` et al.
// could match elements left over from an earlier test's render in the same
// file.
afterEach(() => {
  cleanup();
});
