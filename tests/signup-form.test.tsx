import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ImgHTMLAttributes } from "react";

/**
 * Sprint 2, req 2, 3, 5: the sign-up form itself — its fields, the shared
 * validation module used client-side for immediate feedback, and req 5's
 * "a failed submission keeps everything typed". The actual Server Action
 * (app/signup/actions.ts) is mocked here on purpose: it pulls in
 * lib/auth/create-account.ts (a real database call), which is exercised
 * for real in tests/db/profiles.integration.test.ts instead.
 */

const signupActionMock = vi.fn();
vi.mock("@/app/signup/actions", () => ({
  signupAction: signupActionMock,
}));

vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- test stub, alt spread from props
    <img {...props} />
  ),
}));

describe("SignupForm", () => {
  it("renders the avatar picker and every field with a real accessible name", async () => {
    const { SignupForm } = await import("@/app/signup/SignupForm");
    render(<SignupForm />);

    expect(screen.getByRole("radiogroup", { name: "Choose your avatar." })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(10);
    expect(screen.getByLabelText("Display name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create account" })).toBeInTheDocument();
  });

  it("shows a live validation error on blur, from the shared validation module", async () => {
    const { SignupForm } = await import("@/app/signup/SignupForm");
    render(<SignupForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Display name"), "M");
    await user.tab();

    expect(await screen.findByText("Need at least 2 characters.")).toBeInTheDocument();
  });

  it("keeps every typed value and the chosen avatar after a failed submission (req 5, ACC-3)", async () => {
    signupActionMock.mockResolvedValue({
      values: { avatar: null, displayName: "", email: "", password: "" },
      fieldErrors: { email: "This email is already registered. Log in instead." },
    });
    const { SignupForm } = await import("@/app/signup/SignupForm");
    render(<SignupForm />);
    const user = userEvent.setup();

    await user.click(screen.getAllByRole("radio")[2]);
    await user.type(screen.getByLabelText("Display name"), "Player");
    await user.type(screen.getByLabelText("Email"), "taken@example.com");
    await user.type(screen.getByLabelText("Password"), "longenoughpassword");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("This email is already registered. Log in instead.")).toBeInTheDocument();
    expect(screen.getByLabelText("Display name")).toHaveValue("Player");
    expect(screen.getByLabelText("Email")).toHaveValue("taken@example.com");
    expect(screen.getByLabelText("Password")).toHaveValue("longenoughpassword");
    expect(screen.getAllByRole("radio")[2]).toHaveAttribute("aria-checked", "true");
  });
});
