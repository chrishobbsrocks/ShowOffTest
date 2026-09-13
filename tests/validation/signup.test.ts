import { describe, expect, it } from "vitest";
import {
  AVATAR_IDS,
  RESERVED_DISPLAY_NAMES,
  SIGNUP_MESSAGES,
  hasSignupErrors,
  validateAvatar,
  validateDisplayNameFormat,
  validateEmailFormat,
  validatePassword,
  validateSignupFields,
} from "@/lib/validation/signup";

/**
 * Sprint 2, req 3 / acceptance criterion 3: the one validation module,
 * covering every case the acceptance criterion names. Case-insensitive
 * uniqueness *against another player's chosen name* is a database
 * constraint this module cannot see (RLS) — that is covered by
 * tests/db/profiles.integration.test.ts, not here.
 */

describe("validateDisplayNameFormat: length", () => {
  it("1 character is too short", () => {
    expect(validateDisplayNameFormat("A")).toBe(SIGNUP_MESSAGES.displayNameTooShort);
  });

  it("2 characters is the minimum, and valid", () => {
    expect(validateDisplayNameFormat("Al")).toBeUndefined();
  });

  it("10 characters is the maximum, and valid", () => {
    expect(validateDisplayNameFormat("Abcdefghij")).toBeUndefined();
  });

  it("11 characters exceeds the limit", () => {
    expect(validateDisplayNameFormat("Abcdefghijk")).toBe(SIGNUP_MESSAGES.displayNameTooLong);
  });
});

describe("validateDisplayNameFormat: whitespace", () => {
  it("trims surrounding whitespace before validating length", () => {
    expect(validateDisplayNameFormat("  Al  ")).toBeUndefined();
  });

  it("trims surrounding whitespace that would otherwise make it too short", () => {
    expect(validateDisplayNameFormat("  A  ")).toBe(SIGNUP_MESSAGES.displayNameTooShort);
  });

  it("trims surrounding whitespace before checking the 10-character limit", () => {
    expect(validateDisplayNameFormat("  Abcdefghij  ")).toBeUndefined();
  });
});

describe("validateDisplayNameFormat: reserved starter-opponent names", () => {
  it.each(RESERVED_DISPLAY_NAMES)("rejects the reserved name %s verbatim", (name) => {
    expect(validateDisplayNameFormat(name)).toBe(SIGNUP_MESSAGES.displayNameTaken);
  });

  it.each(RESERVED_DISPLAY_NAMES)("rejects the reserved name %s in a different case", (name) => {
    expect(validateDisplayNameFormat(name.toUpperCase())).toBe(SIGNUP_MESSAGES.displayNameTaken);
    expect(validateDisplayNameFormat(name.toLowerCase())).toBe(SIGNUP_MESSAGES.displayNameTaken);
  });

  it("is not tripped by a name that merely contains a reserved name", () => {
    expect(validateDisplayNameFormat("BuddyX")).toBeUndefined();
  });
});

describe("validateEmailFormat", () => {
  it("rejects a blank email with the single invalid-email message", () => {
    expect(validateEmailFormat("")).toBe(SIGNUP_MESSAGES.emailInvalid);
    expect(validateEmailFormat("   ")).toBe(SIGNUP_MESSAGES.emailInvalid);
  });

  it("rejects a malformed email with the same single message", () => {
    expect(validateEmailFormat("not-an-email")).toBe(SIGNUP_MESSAGES.emailInvalid);
    expect(validateEmailFormat("missing-domain@")).toBe(SIGNUP_MESSAGES.emailInvalid);
  });

  it("accepts a well-formed email", () => {
    expect(validateEmailFormat("player@example.com")).toBeUndefined();
  });
});

describe("validatePassword", () => {
  it("7 characters is too short", () => {
    expect(validatePassword("1234567")).toBe(SIGNUP_MESSAGES.passwordTooShort);
  });

  it("8 characters is the minimum, and valid", () => {
    expect(validatePassword("12345678")).toBeUndefined();
  });
});

describe("validateAvatar", () => {
  it("rejects a missing avatar", () => {
    expect(validateAvatar(null)).toBe(SIGNUP_MESSAGES.avatarRequired);
  });

  it("rejects an avatar id outside the ten", () => {
    expect(validateAvatar("avatar-11")).toBe(SIGNUP_MESSAGES.avatarRequired);
  });

  it.each(AVATAR_IDS)("accepts %s", (id) => {
    expect(validateAvatar(id)).toBeUndefined();
  });
});

describe("validateSignupFields: all errors reported together", () => {
  it("reports every failing field at once (frame 1.05)", () => {
    const errors = validateSignupFields({
      avatar: null,
      displayName: "M",
      email: "mojojojo\\",
      password: "short7c",
    });

    expect(errors).toEqual({
      avatar: SIGNUP_MESSAGES.avatarRequired,
      displayName: SIGNUP_MESSAGES.displayNameTooShort,
      email: SIGNUP_MESSAGES.emailInvalid,
      password: SIGNUP_MESSAGES.passwordTooShort,
    });
    expect(hasSignupErrors(errors)).toBe(true);
  });

  it("the LiveQA fixture (AC3: `M`, `Mojito123456`, `mojojojo\\\\`, no avatar) shows all four design messages", () => {
    // AC3's three strings only produce all four errors under one field
    // assignment: none of them contains "@", so any of them is an invalid
    // email; only "M" (1 char) is short enough to fail the password rule;
    // that leaves "Mojito123456" (12 chars) as the display name, which
    // fails the *other* length rule (exceeds 10). Password="M", display
    // name="Mojito123456", email="mojojojo\\" is the only assignment where
    // display name, email, password and avatar all fail at once.
    const errors = validateSignupFields({
      avatar: null,
      displayName: "Mojito123456",
      email: "mojojojo\\",
      password: "M",
    });

    expect(errors).toEqual({
      avatar: SIGNUP_MESSAGES.avatarRequired,
      displayName: SIGNUP_MESSAGES.displayNameTooLong,
      email: SIGNUP_MESSAGES.emailInvalid,
      password: SIGNUP_MESSAGES.passwordTooShort,
    });
  });

  it("reports no errors for a fully valid submission", () => {
    const errors = validateSignupFields({
      avatar: "avatar-1",
      displayName: "Player",
      email: "player@example.com",
      password: "longenoughpassword",
    });
    expect(hasSignupErrors(errors)).toBe(false);
  });
});
