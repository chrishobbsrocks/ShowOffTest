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
  });
});
