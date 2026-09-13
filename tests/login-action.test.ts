import { afterEach, describe, expect, it, vi } from "vitest";
import { INCORRECT_CREDENTIALS_MESSAGE, GENERIC_FALLBACK_MESSAGE } from "@/lib/validation/messages";

/**
 * Sprint 2, req 9 (ACC-7) / acceptance criterion 9: wrong credentials and
 * an unregistered email both show exactly INCORRECT_CREDENTIALS_MESSAGE;
 * any other failure (offline, thrown exception) shows the generic
 * fallback instead, never the credentials message. On success, always
 * redirects to /home (req 10) — never a `next` parameter.
 */

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
  signInWithPassword.mockReset();
  createClientMock.mockClear();
  redirectMock.mockClear();
  consoleErrorSpy.mockClear();
});

function formDataFor(email: string, password: string): FormData {
  const formData = new FormData();
  formData.set("email", email);
  formData.set("password", password);
  return formData;
}

describe("loginAction", () => {
  it("shows the non-disclosing message for invalid_credentials (wrong password or unregistered email alike)", async () => {
    signInWithPassword.mockResolvedValueOnce({
      error: { code: "invalid_credentials", message: "Invalid login credentials" },
    });
    const { loginAction } = await import("@/app/login/actions");
    const { initialLoginActionState } = await import("@/app/login/state");

    const result = await loginAction(
      initialLoginActionState,
      formDataFor("nobody@example.com", "wrongpassword"),
    );

    expect(result.formError).toBe(INCORRECT_CREDENTIALS_MESSAGE);
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("shows the generic fallback for any other failure, never the credentials message", async () => {
    signInWithPassword.mockResolvedValueOnce({
      error: { code: "over_request_rate_limit", message: "Too many requests" },
    });
    const { loginAction } = await import("@/app/login/actions");
    const { initialLoginActionState } = await import("@/app/login/state");

    const result = await loginAction(
      initialLoginActionState,
      formDataFor("player@example.com", "longenoughpassword"),
    );

    expect(result.formError).toBe(GENERIC_FALLBACK_MESSAGE);
    expect(result.formError).not.toBe(INCORRECT_CREDENTIALS_MESSAGE);
  });

  it("shows the generic fallback when the client throws (e.g. offline)", async () => {
    createClientMock.mockImplementationOnce(async () => {
      throw new Error("network unreachable");
    });
    const { loginAction } = await import("@/app/login/actions");
    const { initialLoginActionState } = await import("@/app/login/state");

    const result = await loginAction(
      initialLoginActionState,
      formDataFor("player@example.com", "longenoughpassword"),
    );

    expect(result.formError).toBe(GENERIC_FALLBACK_MESSAGE);
  });

  it("redirects to /home on success, with no redirect parameter ever consulted", async () => {
    signInWithPassword.mockResolvedValueOnce({ error: null });
    const { loginAction } = await import("@/app/login/actions");
    const { initialLoginActionState } = await import("@/app/login/state");

    await expect(
      loginAction(initialLoginActionState, formDataFor("player@example.com", "longenoughpassword")),
    ).rejects.toThrow("NEXT_REDIRECT");

    expect(redirectMock).toHaveBeenCalledWith("/home");
  });
});
