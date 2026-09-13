import type { Metadata } from "next";
import { SignupForm } from "./SignupForm";

// CHROME (docs/copy/screen-copy.md authority table): page titles have no
// design surface, Dev Team owns them.
export const metadata: Metadata = {
  title: "Create account — Showoff",
};

/**
 * Frames 1.01–1.05 (req 2). Signed-in visitors are redirected to /home by
 * proxy.ts before this ever renders (req 1) — no duplicate check needed
 * here.
 */
export default function SignupPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center gap-8 bg-bg-base px-6 py-12">
      <h1
        className="text-center"
        style={{ font: "400 32px var(--font-display)", color: "var(--color-text-emphasis)" }}
      >
        CREATE ACCOUNT
      </h1>
      <SignupForm />
    </main>
  );
}
