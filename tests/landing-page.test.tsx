import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// next/image needs the Next.js server runtime (image optimization loader)
// that isn't present under jsdom; stub it down to a plain <img>, same
// pattern as sprint 1's splash-page test.
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- test stub, not shipped UI; alt is spread from props
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

/**
 * Sprint 2, req 1 (ONB-1, D-13): frame 1.00 replaces sprint 1's text-free
 * Splash screen at `/`. Copy is exact — no Terms line, no `v1.0`
 * (PRD scope) — and both links go where req 1 says.
 */
describe("LandingPage", () => {
  it("shows the exact Landing copy and links, and no Terms/version line", async () => {
    const { default: LandingPage } = await import("@/app/page");
    render(<LandingPage />);

    expect(screen.getByText("Earn trophies")).toBeInTheDocument();
    expect(screen.getByText("Climb arenas")).toBeInTheDocument();
    expect(screen.getByText("Think you know stuff? Let's find out.")).toBeInTheDocument();

    const getStarted = screen.getByRole("link", { name: "Get started" });
    expect(getStarted).toHaveAttribute("href", "/signup");

    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    const logIn = screen.getByRole("link", { name: "Log in" });
    expect(logIn).toHaveAttribute("href", "/login");

    expect(document.body.textContent).not.toMatch(/Terms|Privacy|v1\.0/);
  });
});
