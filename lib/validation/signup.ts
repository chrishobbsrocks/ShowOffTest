/**
 * The single sign-up validation definition (sprint 2, req 3; ACC-2, D-11,
 * D-31). Imported unchanged by the sign-up form (app/signup) for immediate
 * feedback and by the server action that re-runs it on every submission
 * (never trusting the client) — and, from sprint 4, by profile editing
 * (PRO-7), which reuses these same rules for display name and avatar.
 *
 * What this module can and cannot check: format rules and the static
 * reserved-name list are pure and synchronous, so they run identically in
 * the browser and on the server. Case-insensitive uniqueness against
 * *other players'* chosen display names cannot be checked here — Row Level
 * Security means no signed-out visitor, and no other player, can read
 * another player's display name (SEC-3) — so req 4 enforces that with a
 * database constraint instead. The server maps a `unique_violation` on
 * that constraint to `SIGNUP_MESSAGES.displayNameTaken`, the same string
 * this module already uses for a reserved name, so the message is defined
 * once either way.
 */

export const AVATAR_IDS = [
  "avatar-1",
  "avatar-2",
  "avatar-3",
  "avatar-4",
  "avatar-5",
  "avatar-6",
  "avatar-7",
  "avatar-8",
  "avatar-9",
  "avatar-10",
] as const;

export type AvatarId = (typeof AVATAR_IDS)[number];

/**
 * Starter-opponent display names (D-31; docs/copy/screen-copy.md, "Starter
 * opponents"), reserved so no player can register them. Compared
 * case-insensitively, same as player-vs-player uniqueness.
 */
export const RESERVED_DISPLAY_NAMES = [
  "Buddy",
  "CodeLord",
  "VegasCat",
  "iMonster",
  "Ken",
  "CoolGal",
  "ABC01",
  "Trivianna",
  "FactCheck",
  "BrainFog",
  "Lucky7",
  "NightOwl",
  "Smartypant",
  "KnowItAll",
  "Guesswork",
  "SlowPoke",
  "Zippy",
  "Hotshot",
  "QuizKid",
  "MissTake",
] as const;

/** Verbatim from docs/copy/screen-copy.md, "Create account" validation table. */
export const SIGNUP_MESSAGES = {
  displayNameTooShort: "Need at least 2 characters.",
  displayNameTooLong: "Exceeds 10 character limit.",
  displayNameTaken: "This display name is already taken. Try a different name.",
  passwordTooShort: "Need at least 8 characters.",
  emailTaken: "This email is already registered. Log in instead.",
  avatarRequired: "Please choose an avatar.",
  emailInvalid: "Invalid email address.",
} as const;

export interface SignupFieldValues {
  avatar: string | null;
  displayName: string;
  email: string;
  password: string;
}

export interface SignupFieldErrors {
  avatar?: string;
  displayName?: string;
  email?: string;
  password?: string;
}

// Deliberately permissive: format-only ("looks like an email"), matching
// D-11/ACC-2's single "Invalid email address." message for both a blank
// and a malformed address. Supabase Auth is the authority on whether an
// address is deliverable; this only rejects what could never be one.
const EMAIL_FORMAT_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Leading/trailing whitespace trimmed before validating and storing (req 3). */
export function normalizeDisplayName(raw: string): string {
  return raw.trim();
}

function isReservedDisplayName(trimmed: string): boolean {
  const lower = trimmed.toLowerCase();
  return RESERVED_DISPLAY_NAMES.some((reserved) => reserved.toLowerCase() === lower);
}

export function validateDisplayNameFormat(raw: string): string | undefined {
  const trimmed = normalizeDisplayName(raw);
  if (trimmed.length < 2) {
    return SIGNUP_MESSAGES.displayNameTooShort;
  }
  if (trimmed.length > 10) {
    return SIGNUP_MESSAGES.displayNameTooLong;
  }
  if (isReservedDisplayName(trimmed)) {
    return SIGNUP_MESSAGES.displayNameTaken;
  }
  return undefined;
}

export function validateEmailFormat(raw: string): string | undefined {
  const trimmed = raw.trim();
  if (!trimmed || !EMAIL_FORMAT_RE.test(trimmed)) {
    return SIGNUP_MESSAGES.emailInvalid;
  }
  return undefined;
}

export function validatePassword(raw: string): string | undefined {
  if (raw.length < 8) {
    return SIGNUP_MESSAGES.passwordTooShort;
  }
  return undefined;
}

function isAvatarId(value: string): value is AvatarId {
  return (AVATAR_IDS as readonly string[]).includes(value);
}

export function validateAvatar(avatar: string | null): string | undefined {
  if (!avatar || !isAvatarId(avatar)) {
    return SIGNUP_MESSAGES.avatarRequired;
  }
  return undefined;
}

/**
 * Every failing field is reported at once (req 3; frame 1.05), never only
 * the first invalid one.
 */
export function validateSignupFields(values: SignupFieldValues): SignupFieldErrors {
  const errors: SignupFieldErrors = {};

  const displayNameError = validateDisplayNameFormat(values.displayName);
  if (displayNameError) errors.displayName = displayNameError;

  const emailError = validateEmailFormat(values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;

  const avatarError = validateAvatar(values.avatar);
  if (avatarError) errors.avatar = avatarError;

  return errors;
}

export function hasSignupErrors(errors: SignupFieldErrors): boolean {
  return Object.values(errors).some((message) => message !== undefined);
}
