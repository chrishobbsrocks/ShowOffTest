import Image from "next/image";

/**
 * The Splash frame (Game UI page). No text per the sprint's own scope: this
 * route exists so the live test has something real to check tokens, fonts
 * and assets against, before sprint 2 replaces it with the landing page
 * (sprint 1, Context and req 7). `bg-bg-base` is a Tailwind utility applied
 * by the colour token's own name, backed by app/tokens.css — not the
 * frame's own untokenised background literal (see
 * docs/design/design-tokens.md; P6).
 *
 * Logo size: LiveQA round 3 (AC7 Figma comparison) measured the rendered
 * logo about 34-37% larger than the Figma Splash frame's own logo group
 * (Group 91 = OFF + SHOW, 173.45x125.74 at the 375-wide frame) — the
 * previous `w-[70%] max-w-xs` rendered visible ink about 232px wide at a
 * 375px viewport. The source SVG's own viewBox is 375x333 with its visible
 * ink spanning roughly x:22-354 (331px, about 88.3% of the SVG's own
 * width), so matching the Figma group's 173.45px ink width means the
 * rendered image box itself needs to be about 196.5px wide at 375
 * (173.45 / 0.883), i.e. about 52.4% of the viewport rather than 70%, with
 * the desktop cap scaled down by the same ~0.748 factor (320px -> 240px).
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
        className="h-auto w-[52.4%] max-w-60"
      />
    </main>
  );
}
