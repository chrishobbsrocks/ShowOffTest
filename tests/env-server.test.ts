import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Sprint 1, req 8 (QA1 round 1 required fix): "the secret key is readable
 * only by server code: its module fails to import into client code."
 *
 * getSupabaseSecretKey used to live in lib/env.ts, which lib/supabase/
 * browser.ts (client code) also imports — no leak yet, but a future
 * client-side import of browser.ts would put the secret key's module in
 * the reachable graph. It now lives in lib/env.server.ts, guarded by the
 * `server-only` package, which throws on import outside a real server
 * module graph. jsdom (this suite's environment) has no `react-server`
 * resolution condition, so importing it here throws exactly the way it
 * would from a Client Component — the first test below is that guard
 * firing for real, not a simulation of it.
 *
 * The remaining tests need the actual accessor logic (throws naming a
 * missing variable, returns a value that's set), which the guard itself
 * prevents exercising directly — the same `server-only` package throws
 * unconditionally under jsdom regardless of which module triggers the
 * import. Those tests stub `server-only` as a no-op via vi.doMock, the
 * same trick Next's own bundler performs via the `react-server` export
 * condition when the module is genuinely used from server code.
 */

const ORIGINAL_SECRET = process.env.SUPABASE_SECRET_KEY;

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  if (ORIGINAL_SECRET === undefined) {
    delete process.env.SUPABASE_SECRET_KEY;
  } else {
    process.env.SUPABASE_SECRET_KEY = ORIGINAL_SECRET;
  }
  vi.doUnmock("server-only");
  vi.resetModules();
});

describe("lib/env.server", () => {
  it("fails to import in a client-like environment (the server-only guard firing for real)", async () => {
    await expect(import("@/lib/env.server")).rejects.toThrow(
      /cannot be imported from a Client Component/,
    );
  });

  it("throws a message naming the missing variable", async () => {
    vi.doMock("server-only", () => ({}));
    delete process.env.SUPABASE_SECRET_KEY;

    const envServer = await import("@/lib/env.server");

    expect(() => envServer.getSupabaseSecretKey()).toThrow(/SUPABASE_SECRET_KEY/);
  });

  it("returns the value once the variable is set", async () => {
    vi.doMock("server-only", () => ({}));
    process.env.SUPABASE_SECRET_KEY = "sb_secret_test_value";

    const envServer = await import("@/lib/env.server");

    expect(envServer.getSupabaseSecretKey()).toBe("sb_secret_test_value");
  });
});
