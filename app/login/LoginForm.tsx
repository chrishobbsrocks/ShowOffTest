"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { TextInput } from "@/components/ui/TextInput";
import { loginAction } from "./actions";
import { initialLoginActionState } from "./state";

/**
 * Frame 2.01. `Forgot Password?` (D-12/req 9) is omitted this sprint —
 * password reset is sprint 4's work, and the requirement explicitly
 * allows omitting the link rather than shipping one with nowhere real to
 * go ("it must not lead anywhere broken").
 */
export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialLoginActionState);
  const [email, setEmail] = useState(state.email);
  const [password, setPassword] = useState("");

  return (
    <form action={formAction} className="flex w-full flex-col items-center gap-4">
      <TextInput
        label="Email"
        name="email"
        type="email"
        placeholder="Email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <PasswordInput
        label="Password"
        name="password"
        placeholder="Password (min 8 characters)"
        autoComplete="current-password"
        value={password}
        onChange={setPassword}
      />

      {state.formError && (
        <p role="alert" style={{ font: "var(--type-error)", color: "var(--color-error-text)" }}>
          {state.formError}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        Log in
      </Button>

      <p style={{ font: "var(--type-link)", color: "var(--color-text-subtle)" }}>
        Don’t have an account?{" "}
        <Link href="/signup" style={{ color: "var(--color-accent)" }}>
          Sign up
        </Link>
      </p>
    </form>
  );
}
