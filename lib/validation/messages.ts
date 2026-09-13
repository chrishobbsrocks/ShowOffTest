/**
 * Copy strings shared across more than one screen or validation module.
 * Every string here is verbatim from docs/copy/screen-copy.md (Global,
 * and the Log in GAP table) — see that file's "Authority: who owns which
 * string" table before ever editing one.
 */

/** NFR-7 / D-57: shown for any failed action with no message of its own. */
export const GENERIC_FALLBACK_MESSAGE = "Something went wrong. Try again.";

/**
 * ACC-7: deliberately non-disclosing — the same string for an unregistered
 * email and a wrong password, so the log-in form cannot be used to
 * enumerate accounts. This is a security property, not a wording
 * preference; never split it into field-specific errors.
 */
export const INCORRECT_CREDENTIALS_MESSAGE = "Incorrect email or password.";
