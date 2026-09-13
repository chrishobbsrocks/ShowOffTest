import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Log in — Showoff",
};

/** Frame 2.01 (req 9). Signed-in visitors are redirected to /home by proxy.ts. */
export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center gap-6 bg-bg-base px-6 py-12">
      <h1
        className="text-center"
        style={{ font: "400 32px var(--font-display)", color: "var(--color-text-emphasis)" }}
      >
        WELCOME BACK
      </h1>
      <p style={{ font: "var(--type-body)", color: "var(--color-text-subtle)" }}>
        Sign in to pick up where you left off.
      </p>
      <LoginForm />
    </main>
  );
}
