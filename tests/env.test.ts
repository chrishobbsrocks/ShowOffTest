import { afterEach, beforeEach, describe, expect, it } from "vitest";

/**
 * NFR-7: a missing environment variable fails loudly and specifically,
 * rather than the Supabase client surfacing a confusing error later.
 */

const VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SITE_URL",
  "SUPABASE_SECRET_KEY",
] as const;

const originalValues = new Map<string, string | undefined>();

beforeEach(() => {
  for (const key of VARS) {
    originalValues.set(key, process.env[key]);
    delete process.env[key];
  }
});

afterEach(() => {
  for (const key of VARS) {
    const original = originalValues.get(key);
    if (original === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = original;
    }
  }
});

describe("lib/env", () => {
  it("throws a message naming the missing variable, for each accessor", async () => {
    const env = await import("@/lib/env");

    expect(() => env.getSupabaseUrl()).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
    expect(() => env.getSupabasePublishableKey()).toThrow(
      /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/,
    );
    expect(() => env.getSiteUrl()).toThrow(/NEXT_PUBLIC_SITE_URL/);
    expect(() => env.getSupabaseSecretKey()).toThrow(/SUPABASE_SECRET_KEY/);
  });

  it("returns the value once the variable is set", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:54321";
    const env = await import("@/lib/env");

    expect(env.getSupabaseUrl()).toBe("http://127.0.0.1:54321");
  });
});
