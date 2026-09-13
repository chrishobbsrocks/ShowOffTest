import { Bebas_Neue, Space_Grotesk } from "next/font/google";

/**
 * Both typefaces are loaded through `next/font/google`, which downloads the
 * font files at build time and self-hosts them alongside the app's own
 * static assets (docs/design/design-tokens.md, "Fonts"; sprint 1, req 5).
 * The browser never requests fonts.googleapis.com or fonts.gstatic.com.
 *
 * Bebas Neue is display-only (titles, above the fold). Space Grotesk is
 * everything else. Both are invoked once here, applied to <html> in the
 * root layout, so every route — including this sprint's text-free Splash
 * screen — has both families loaded and available via the CSS variables
 * below, which the token stylesheet (app/tokens.css) builds on.
 */
export const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas-neue",
});

export const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});
