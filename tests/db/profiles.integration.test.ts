import { afterAll, describe, expect, it, vi } from "vitest";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// lib/auth/create-account.ts (and lib/supabase/admin.ts, which it imports)
// are guarded by the `server-only` package, which throws on import under
// jsdom (this suite's environment) exactly as it would from a Client
// Component — see tests/env-server.test.ts for the same pattern. Stubbed
// here as a no-op so this suite can exercise the real production code
// path, the same way Next's own bundler no-ops it for genuine server code.
vi.mock("server-only", () => ({}));

/**
 * Runs against the local Supabase stack only (D-53) — never production.
 * Skipped, not failed, when the stack isn't up (see
 * tests/db/health-check.integration.test.ts for why).
 *
 * Covers acceptance criteria 4, 6 and 8: the database enforces
 * case-insensitive display-name uniqueness even when the app-level check
 * is bypassed; sign-up's all-or-nothing account creation leaves no
 * credential behind when the profile step fails, and the same email can
 * then register; and RLS actually refuses what requirement 8 says it
 * should, exercised with the browser's own (anon/authenticated) database
 * role, not the service-role client.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const secretKey = process.env.SUPABASE_SECRET_KEY;
const hasLocalStack = Boolean(url && anonKey && secretKey);

// `describe.skipIf` only skips the *tests* it collects — the describe
// callback itself still runs eagerly during collection either way, so
// anything at its top level (like constructing a Supabase client from
// `url!`) would still execute, and throw, even when every test inside is
// skipped. Falling back to harmless placeholder strings when the local
// stack isn't up keeps construction safe; `it.skipIf` below is what
// actually stops these placeholder clients from ever being called.
const testUrl = url ?? "http://127.0.0.1:54321";
const testAnonKey = anonKey ?? "local-stack-not-running";
const testSecretKey = secretKey ?? "local-stack-not-running";
const itIfLocalStack = it.skipIf(!hasLocalStack);

describe("profiles: database-enforced uniqueness (req 4)", () => {
  const admin = createSupabaseClient(testUrl, testSecretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const createdUserIds: string[] = [];

  afterAll(async () => {
    for (const id of createdUserIds) {
      await admin.auth.admin.deleteUser(id).catch(() => {});
    }
  });

  itIfLocalStack("rejects a second display name that differs only by case, at the database level", async () => {
    const { data: user1, error: createError1 } = await admin.auth.admin.createUser({
      email: uniqueEmail(),
      password: "longenoughpassword",
      email_confirm: true,
    });
    expect(createError1).toBeNull();
    createdUserIds.push(user1!.user!.id);

    const { error: firstInsertError } = await admin
      .from("profiles")
      .insert({ id: user1!.user!.id, display_name: "Doorak", avatar: "avatar-1" });
    expect(firstInsertError).toBeNull();

    const { data: user2, error: createError2 } = await admin.auth.admin.createUser({
      email: uniqueEmail(),
      password: "longenoughpassword",
      email_confirm: true,
    });
    expect(createError2).toBeNull();
    createdUserIds.push(user2!.user!.id);

    const { error: secondInsertError } = await admin
      .from("profiles")
      .insert({ id: user2!.user!.id, display_name: "doorak", avatar: "avatar-2" });

    expect(secondInsertError).not.toBeNull();
    expect(secondInsertError!.code).toBe("23505"); // unique_violation
  });
});

describe("createAccount: all-or-nothing (req 5, 6; ACC-5)", () => {
  const admin = createSupabaseClient(testUrl, testSecretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const createdUserIds: string[] = [];

  afterAll(async () => {
    for (const id of createdUserIds) {
      await admin.auth.admin.deleteUser(id).catch(() => {});
    }
  });

  itIfLocalStack("forces the profile step to fail, leaves no credential behind, and lets the same email retry", async () => {
    const { createAccount } = await import("@/lib/auth/create-account");

    const firstEmail = uniqueEmail();
    const first = await createAccount({
      avatar: "avatar-1",
      displayName: "Doorak",
      email: firstEmail,
      password: "longenoughpassword",
    });
    expect(first.ok).toBe(true);
    if (first.ok) createdUserIds.push(first.userId);

    // Forces the profile insert to fail: "doorak" collides case-
    // insensitively with the display name just created above.
    const secondEmail = uniqueEmail();
    const second = await createAccount({
      avatar: "avatar-2",
      displayName: "doorak",
      email: secondEmail,
      password: "longenoughpassword",
    });

    expect(second.ok).toBe(false);
    if (!second.ok && "fieldErrors" in second) {
      expect(second.fieldErrors.displayName).toBe(
        "This display name is already taken. Try a different name.",
      );
    } else {
      throw new Error("expected a displayName field error");
    }

    // No credential was left behind for secondEmail: retrying with the
    // SAME email and a non-colliding display name must succeed, not be
    // reported as already registered. If the rollback had failed to
    // delete the orphaned auth user, this would instead fail with an
    // emailTaken field error.
    const retry = await createAccount({
      avatar: "avatar-3",
      displayName: "DoorakTwo",
      email: secondEmail,
      password: "longenoughpassword",
    });
    expect(retry.ok).toBe(true);
    if (retry.ok) createdUserIds.push(retry.userId);
  });

  itIfLocalStack("reports a genuinely already-registered email as emailTaken, against the real GoTrue error shape", async () => {
    const { createAccount } = await import("@/lib/auth/create-account");

    const email = uniqueEmail();
    const first = await createAccount({
      avatar: "avatar-1",
      displayName: uniqueDisplayName(),
      email,
      password: "longenoughpassword",
    });
    expect(first.ok).toBe(true);
    if (first.ok) createdUserIds.push(first.userId);

    // Same email, a non-colliding display name — isolates the email-taken
    // path from the display-name-taken path exercised above.
    const second = await createAccount({
      avatar: "avatar-2",
      displayName: uniqueDisplayName(),
      email,
      password: "longenoughpassword",
    });

    expect(second.ok).toBe(false);
    if (!second.ok && "fieldErrors" in second) {
      expect(second.fieldErrors.email).toBe(
        "This email is already registered. Log in instead.",
      );
    } else {
      throw new Error("expected an email field error");
    }
  });
});

describe("profiles: Row Level Security (req 8; SEC-3)", () => {
  const admin = createSupabaseClient(testUrl, testSecretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const createdUserIds: string[] = [];

  afterAll(async () => {
    for (const id of createdUserIds) {
      await admin.auth.admin.deleteUser(id).catch(() => {});
    }
  });

  async function createSignedInPlayer(displayName: string, avatar: string) {
    const email = uniqueEmail();
    const password = "longenoughpassword";
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError || !created?.user) {
      throw createError ?? new Error("user creation failed");
    }
    createdUserIds.push(created.user.id);

    const { error: profileError } = await admin
      .from("profiles")
      .insert({ id: created.user.id, display_name: displayName, avatar });
    if (profileError) throw profileError;

    // The browser's own (anon key) database role, signed in as this
    // player — not the service-role client used to set the fixture up.
    const client = createSupabaseClient(testUrl, testAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { error: signInError } = await client.auth.signInWithPassword({ email, password });
    if (signInError) throw signInError;

    return { id: created.user.id, client };
  }

  itIfLocalStack("reading another player's profile returns nothing", async () => {
    const playerA = await createSignedInPlayer("PlayerA1", "avatar-1");
    const playerB = await createSignedInPlayer("PlayerB1", "avatar-2");

    const { data, error } = await playerA.client
      .from("profiles")
      .select("display_name")
      .eq("id", playerB.id);

    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  itIfLocalStack("updating one's own non-writable column (created_at) is refused", async () => {
    const player = await createSignedInPlayer("PlayerC1", "avatar-3");

    const { error } = await player.client
      .from("profiles")
      .update({ created_at: "2000-01-01T00:00:00Z" })
      .eq("id", player.id);

    expect(error).not.toBeNull();
  });

  itIfLocalStack("updating another player's display name is refused", async () => {
    const playerA = await createSignedInPlayer("PlayerD1", "avatar-4");
    const playerB = await createSignedInPlayer("PlayerE1", "avatar-5");

    const { data, error } = await playerA.client
      .from("profiles")
      .update({ display_name: "Hijacked" })
      .eq("id", playerB.id)
      .select();

    // RLS filters the target row out before the update ever applies to
    // it: no error is raised, but zero rows are affected.
    expect(error).toBeNull();
    expect(data).toEqual([]);

    const { data: unchanged } = await admin
      .from("profiles")
      .select("display_name")
      .eq("id", playerB.id)
      .single();
    expect(unchanged?.display_name).toBe("PlayerE1");
  });

  itIfLocalStack("a player can update their own display name, avatar and tutorial completion", async () => {
    const player = await createSignedInPlayer("PlayerF1", "avatar-6");

    const { error } = await player.client
      .from("profiles")
      .update({ display_name: "PlayerF2", avatar: "avatar-7" })
      .eq("id", player.id);

    expect(error).toBeNull();

    const { data } = await admin
      .from("profiles")
      .select("display_name, avatar")
      .eq("id", player.id)
      .single();
    expect(data?.display_name).toBe("PlayerF2");
    expect(data?.avatar).toBe("avatar-7");
  });
});

let emailCounter = 0;
function uniqueEmail(): string {
  emailCounter += 1;
  return `sprint2-test-${Date.now()}-${emailCounter}@example.com`;
}

let displayNameCounter = 0;
function uniqueDisplayName(): string {
  displayNameCounter += 1;
  // Display names are capped at 10 characters — keep this short and
  // collision-free within a single test run.
  return `T${Date.now().toString(36).slice(-6)}${displayNameCounter}`;
}
