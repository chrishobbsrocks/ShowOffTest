import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

/**
 * Sprint 2, req 9: the log-in form's own fields and error rendering. The
 * actual Server Action (app/login/actions.ts) is mocked — its real
 * behaviour (which message for which failure) is covered by
 * tests/login-action.test.ts.
 */

const loginActionMock = vi.fn();
vi.mock("@/app/login/actions", () => ({
  loginAction: loginActionMock,
}));

describe("LoginForm", () => {
  it("renders email and password fields with real accessible names, and no broken Forgot Password link", async () => {
    const { LoginForm } = await import("@/app/login/LoginForm");
    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute("href", "/signup");
    // req 9: `Forgot Password?` is allowed to be omitted rather than link
    // anywhere broken — this sprint omits it.
    expect(screen.queryByText("Forgot Password?")).not.toBeInTheDocument();
  });

  it("shows the Server Action's form error", async () => {
    loginActionMock.mockResolvedValue({
      email: "player@example.com",
      formError: "Incorrect email or password.",
    });
    const { LoginForm } = await import("@/app/login/LoginForm");
    render(<LoginForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Email"), "player@example.com");
    await user.type(screen.getByLabelText("Password"), "wrongpassword");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(await screen.findByText("Incorrect email or password.")).toBeInTheDocument();
  });
});
