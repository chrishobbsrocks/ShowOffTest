import type { ButtonHTMLAttributes } from "react";
import { BUTTON_BASE_STYLE, BUTTON_VARIANT_STYLE, type ButtonVariant } from "./button-style";

/**
 * design-tokens.md, "Button, primary" / "Button, secondary": 52px tall,
 * 10px radius, token-driven colour, `shadow-sm`, `type-button`. Sizing is
 * expressed as `max-width` rather than a fixed 286/284px so buttons stay
 * usable at 320px (req 14) instead of overflowing it.
 *
 * For a button that navigates, use LinkButton instead — nesting this
 * inside a Next `<Link>` would put a `<button>` (interactive content)
 * inside an `<a>` (also interactive content), which is invalid HTML.
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", style, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center ${className ?? ""}`}
      style={{ ...BUTTON_BASE_STYLE, ...BUTTON_VARIANT_STYLE[variant], ...style }}
    />
  );
}
