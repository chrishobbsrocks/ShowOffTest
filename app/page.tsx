import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/ui/LinkButton";

/**
 * Frame 1.00 (req 1; ONB-1, D-13). Replaces sprint 1's text-free Splash
 * screen now that sign-up and log-in exist to link to. Signed-in visitors
 * are redirected to /home by proxy.ts before this ever renders.
 *
 * Copy is exact (docs/copy/screen-copy.md, "Landing"): the Terms line and
 * `v1.0` are not shown (PRD scope), and `Get started` is the live-Figma
 * string (D-13), not ONB-1's own "Sign up" quote.
 */
export default function LandingPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-bg-base px-6 py-12">
      {/* screen-copy.md, Landing: "Tagline above logo" — QA1 gate-1 audit
          round 1, sprint 2, should-fix item 2 caught this rendering below
          the logo instead. */}
      <p
        className="flex items-center gap-2 text-center"
        style={{ font: "var(--type-body)", color: "var(--color-text-default)" }}
      >
        <span>Earn trophies</span>
        <span aria-hidden="true" style={{ color: "var(--color-accent)" }}>
          ★
        </span>
        <span>Climb arenas</span>
      </p>

      <Image
        src="/brand/show-off-logo.svg"
        alt="Show Off"
        width={375}
        height={333}
        priority
        className="h-auto w-[196.51px]"
      />

      <p
        className="text-center"
        style={{ font: "var(--type-body)", color: "var(--color-text-subtle)" }}
      >
        Think you know stuff? Let&apos;s find out.
      </p>

      <LinkButton href="/signup">Get started</LinkButton>

      <p style={{ font: "var(--type-link)", color: "var(--color-text-subtle)" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "var(--color-accent)" }}>
          Log in
        </Link>
      </p>
    </main>
  );
}
