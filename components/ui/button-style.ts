import type { CSSProperties } from "react";

/**
 * Shared between components/ui/Button.tsx (a real `<button>`) and
 * components/ui/LinkButton.tsx (a `<Link>` styled the same way). Kept as
 * one source so the two never visually drift — see LinkButton's own
 * comment for why a styled link exists at all instead of just wrapping
 * Button in a Link.
 */

export type ButtonVariant = "primary" | "secondary";

export const BUTTON_BASE_STYLE: CSSProperties = {
  height: "52px",
  width: "100%",
  maxWidth: "286px",
  borderRadius: "var(--radius-button)",
  boxShadow: "var(--shadow-sm)",
  font: "var(--type-button)",
};

export const BUTTON_VARIANT_STYLE: Record<ButtonVariant, CSSProperties> = {
  primary: {
    backgroundColor: "var(--color-accent)",
    color: "var(--color-bg-base)",
    border: "none",
  },
  secondary: {
    backgroundColor: "transparent",
    color: "var(--color-accent)",
    border: "var(--border-width) solid var(--color-accent)",
  },
};
