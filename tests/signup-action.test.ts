import { afterEach, describe, expect, it, vi } from "vitest";
import { GENERIC_FALLBACK_MESSAGE } from "@/lib/validation/messages";

/**
 * Sprint 2, req 2–7. lib/auth/create-account.ts (a real database call) is
 * mocked here on purpose — its own all-or-nothing behaviour is exercised
 * for real in tests/db/profiles.integration.test.ts. This file covers
 * signupAction's own responsibilities: signing the browser in after a
 * successful create, and — added for QA1 gate-1 audit round 1, sprint 2,
 * should-fix item 5 — falling back to the generic message instead of
 * throwing when createAccount or the sign-in call throws synchronously
 * (e.g. a missing env var reaching createAdminClient).
 *
 * The redirect-target-decided-outside-try-catch shape (see actions.ts) is
 * exercised directly by the "sign-in fails after a successful create"
 * case below: that redirect happens on the *error* branch inside the try,
 * and if it were called from inside the try (an earlier, buggy version of
 * this fix was), the mock redirect's thrown NEXT_REDIRECT would be caught
 * by signupAction's own catch block and misreported as the generic
 * fallback instead of actually redirecting.
 */

const createAccountMock = vi.fn();
vi.mock("@/lib/auth/create-account", () => ({
  createAccount: createAccountMock,
}));

const signInWithPassword = vi.fn();
const createClientMock = vi.fn(async () => ({
  auth: { signInWithPassword },
}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: createClientMock,
}));

const redirectMock = vi.fn((url: string) => {
  throw Object.assign(new Error("NEXT_REDIRECT"), { digest: `NEXT_REDIRECT;${url}` });
});
vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

afterEach(() => {
  createAccountMock.mockReset();
  signInWithPassword.mockReset();
  createClientMock.mockClear();
  redirectMock.mockClear();
  consoleErrorSpy.mockClear();
});

function formDataFor(values: {
  avatar?: string;
  displayName?: string;
  email?: string;
  password?: string;
}): FormData {
  const formData = new FormData();
  if (values.avatar) formData.set("avatar", values.avatar);
  formData.set("displayName", values.displayName ?? "Player");
  formData.set("email", values.email ?? "player@example.com");
  formData.set("password", values.password ?? "longenoughpassword");
  return formData;
}

describe("signupAction", () => {
  it("redirects to /home after a successful create and sign-in", async () => {
    createAccountMock.mockResolvedValueOnce({ ok: true, userId: "user-1" });
    signInWithPassword.mockResolvedValueOnce({ error: null });
    const { signupAction } = await import("@/app/signup/actions");
    const { initialSignupActionState } = await import("@/app/signup/state");

    await expect(
      signupAction(initialSignupActionState, formDataFor({ avatar: "avatar-1" })),
    ).rejects.toThrow("NEXT_REDIRECT");

    expect(redirectMock).toHaveBeenCalledWith("/home");
  });

  it("redirects to /login, not the generic fallback, when sign-in fails after a successful create", async () => {
    createAccountMock.mockResolvedValueOnce({ ok: true, userId: "user-1" });
    signInWithPassword.mockResolvedValueOnce({ error: { message: "network blip" } });
    const { signupAction } = await import("@/app/signup/actions");
    const { initialSignupActionState } = await import("@/app/signup/state");

    await expect(
      signupAction(initialSignupActionState, formDataFor({ avatar: "avatar-1" })),
    ).rejects.toThrow("NEXT_REDIRECT");

    expect(redirectMock).toHaveBeenCalledWith("/login");
  });

  it("returns createAccount's field errors without redirecting", async () => {
    createAccountMock.mockResolvedValueOnce({
      ok: false,
      fieldErrors: { email: "This email is already registered. Log in instead." },
    });
    const { signupAction } = await import("@/app/signup/actions");
    const { initialSignupActionState } = await import("@/app/signup/state");

    const result = await signupAction(initialSignupActionState, formDataFor({ avatar: "avatar-1" }));

    expect(result.fieldErrors.email).toBe("This email is already registered. Log in instead.");
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("shows the generic fallback, not an unhandled throw, when createAccount throws", async () => {
    createAccountMock.mockImplementationOnce(() => {
      throw new Error("missing SUPABASE_SECRET_KEY");
    });
    const { signupAction } = await import("@/app/signup/actions");
    const { initialSignupActionState } = await import("@/app/signup/state");

    const result = await signupAction(initialSignupActionState, formDataFor({ avatar: "avatar-1" }));

    expect(result.formError).toBe(GENERIC_FALLBACK_MESSAGE);
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("shows the generic fallback when the post-create sign-in client throws", async () => {
    createAccountMock.mockResolvedValueOnce({ ok: true, userId: "user-1" });
    createClientMock.mockImplementationOnce(async () => {
      throw new Error("network unreachable");
    });
    const { signupAction } = await import("@/app/signup/actions");
    const { initialSignupActionState } = await import("@/app/signup/state");

    const result = await signupAction(initialSignupActionState, formDataFor({ avatar: "avatar-1" }));

    expect(result.formError).toBe(GENERIC_FALLBACK_MESSAGE);
    expect(redirectMock).not.toHaveBeenCalled();
  });
});
