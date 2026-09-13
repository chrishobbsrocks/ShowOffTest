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
 * Logo size: D-63 (superseding D-60) sets the target as the logo's
 * lettering box (the crisp ink, excluding the asset's own drop-shadow
 * margin) measuring 173.45px wide, within 2px, as a **fixed pixel size**
 * with no percentage, `max-width` or viewport-relative sizing — the same
 * size at 320px, 375px and desktop. Round 4 shipped `w-[52.4%] max-w-60`,
 * which still scaled with the viewport and failed AC7 for that reason.
 *
 * The fixed width below is derived from the asset itself, not eyeballed:
 * rendering `public/brand/show-off-logo.svg` and measuring the fully-opaque
 * (alpha = 255, i.e. excluding the feathered drop-shadow) pixel bounds
 * gives an ink box of 331 x 246.7 in the SVG's own 375 x 333 viewBox units
 * (aspect ratio 1.3417, matching D-63's stated 1.342). Ink width is
 * therefore 331/375 = 88.267% of the rendered image's own width, so an
 * image box of 173.45 / 0.88267 = 196.51px wide yields an ink box exactly
 * 173.45px wide. `h-auto` preserves the SVG's intrinsic aspect ratio, so
 * ink height comes out to about 129.3px, matching D-63's "about 129px" —
 * not separately constrained, per the decision. Because the box is
 * centred by the flex container, the ink's vertical centre sits about
 * 4.2px above the box's (and so the viewport's) centre — the drop-shadow
 * margin below the letters — within D-63's 5px allowance.
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
        className="h-auto w-[196.51px]"
      />
    </main>
  );
}
