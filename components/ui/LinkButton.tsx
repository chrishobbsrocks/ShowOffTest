import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { BUTTON_BASE_STYLE, BUTTON_VARIANT_STYLE, type ButtonVariant } from "./button-style";

/**
 * A button-styled navigation link (`Get started`, `Let's play`, `See how
 * it works`). Deliberately its own component rather than `<Link><Button
 * /></Link>`: `<button>` is interactive content, `<a>` is interactive
 * content, and nesting one inside the other is invalid HTML — this
 * renders a single `<a>` styled to look like the button instead.
 */
export interface LinkButtonProps
  extends LinkProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
  variant?: ButtonVariant;
}

export function LinkButton({
  variant = "primary",
  style,
  className,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      {...props}
      className={`inline-flex items-center justify-center ${className ?? ""}`}
      style={{ ...BUTTON_BASE_STYLE, ...BUTTON_VARIANT_STYLE[variant], ...style }}
    />
  );
}
