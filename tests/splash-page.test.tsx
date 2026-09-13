import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// next/image needs the Next.js server runtime (image optimization loader)
// that isn't present under jsdom; stub it down to a plain <img> the same
// way the App Router itself does for static export, so this test exercises
// SplashPage's own markup rather than Next's image pipeline.
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- test stub, not shipped UI; alt is spread from props
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

describe("SplashPage", () => {
  it("renders the logo with no visible text, on the base background token", async () => {
    const { default: SplashPage } = await import("@/app/page");
    render(<SplashPage />);

    const logo = screen.getByRole("img", { name: "Show Off" });
    expect(logo).toHaveAttribute("src", "/brand/show-off-logo.svg");

    // req 7: the Splash route renders no text.
    expect(document.body.textContent).toBe("");

    // req 2 acceptance criterion: a Tailwind utility used by token name.
    expect(logo.closest("main")).toHaveClass("bg-bg-base");

    // req 7 / AC7, D-63: the logo's lettering box must be a fixed pixel
    // size (173.45px ink width, derived from the asset — see app/page.tsx's
    // own comment) with no percentage, max-width or viewport-relative
    // sizing, so it renders identically at every viewport width. Pin the
    // exact fixed-width class so a future change can't silently regress
    // back to a viewport-relative class (round 3's w-[70%] max-w-xs, or
    // round 4's still-percentage-based w-[52.4%] max-w-60) that LiveQA
    // already found scales with the viewport and fails AC7.
    expect(logo).toHaveClass("w-[196.51px]");
    expect(logo.className).not.toMatch(/%|max-w-/);
  });
});
