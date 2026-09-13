import Image from "next/image";

/**
 * The Splash frame (Game UI page). No text per the sprint's own scope: this
 * route exists so the live test has something real to check tokens, fonts
 * and assets against, before sprint 2 replaces it with the landing page
 * (sprint 1, Context and req 7). `bg-bg-base` is a Tailwind utility applied
 * by the colour token's own name, backed by app/tokens.css — not the
 * frame's own untokenised background literal (see
 * docs/design/design-tokens.md; P6).
 */
export default function SplashPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-bg-base">
      <Image
        src="/brand/show-off-logo.svg"
        alt="Show Off"
        width={375}
        height={333}
        priority
        className="h-auto w-[70%] max-w-xs"
      />
    </main>
  );
}
