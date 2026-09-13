"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { AvatarPicker } from "@/components/AvatarPicker";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { TextInput } from "@/components/ui/TextInput";
import {
  validateDisplayNameFormat,
  validateEmailFormat,
  validatePassword,
  type AvatarId,
} from "@/lib/validation/signup";
import { signupAction } from "./actions";
import { initialSignupActionState } from "./state";

/**
 * Frames 1.01–1.05. Local field state is the single source of truth for
 * what's on screen — it is never reset from the Server Action's returned
 * state, only merged with its errors — so a failed submission keeps every
 * typed value and the chosen avatar (req 5, ACC-3) with no special-case
 * code needed for it.
 *
 * Client-side validation below calls the exact same lib/validation/signup
 * functions the server re-runs (req 3): this is "the browser" half of
 * "one validation module, used by the browser and re-run by the server".
 */
export function SignupForm() {
  const [state, formAction, pending] = useActionState(signupAction, initialSignupActionState);

  const [avatar, setAvatar] = useState<AvatarId | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const clientErrors = {
    displayName: touched.displayName ? validateDisplayNameFormat(displayName) : undefined,
    email: touched.email ? validateEmailFormat(email) : undefined,
    password: touched.password ? validatePassword(password) : undefined,
  };

  const displayNameError = state.fieldErrors.displayName ?? clientErrors.displayName;
  const emailError = state.fieldErrors.email ?? clientErrors.email;
  const passwordError = state.fieldErrors.password ?? clientErrors.password;
  const avatarError = state.fieldErrors.avatar;

  return (
    <form action={formAction} className="flex w-full flex-col items-center gap-4">
      <input type="hidden" name="avatar" value={avatar ?? ""} />

      <AvatarPicker value={avatar} onChange={setAvatar} error={avatarError} />

      <TextInput
        label="Display name"
        name="displayName"
        placeholder="Display name [2-10 characters]"
        autoComplete="nickname"
        value={displayName}
        onChange={(event) => setDisplayName(event.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, displayName: true }))}
        error={displayNameError}
      />

      <TextInput
        label="Email"
        name="email"
        type="email"
        placeholder="Email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
        error={emailError}
      />

      <PasswordInput
        label="Password"
        name="password"
        placeholder="Password (min 8 characters)"
        autoComplete="new-password"
        value={password}
        onChange={(value) => setPassword(value)}
        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
        error={passwordError}
      />

      {state.formError && (
        <p role="alert" style={{ font: "var(--type-error)", color: "var(--color-error-text)" }}>
          {state.formError}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        onClick={() => setTouched({ displayName: true, email: true, password: true })}
      >
        Create account
      </Button>

      <p style={{ font: "var(--type-link)", color: "var(--color-text-subtle)" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "var(--color-accent)" }}>
          Sign in
        </Link>
      </p>
    </form>
  );
}
