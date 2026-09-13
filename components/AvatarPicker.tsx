"use client";

import Image from "next/image";
import { AVATAR_IDS, type AvatarId } from "@/lib/validation/signup";

/**
 * Sprint 2, req 2 (ACC-4); design-tokens.md, "Avatar picker": ten avatars,
 * 68×68, horizontal scroll with snap, ~15px gap (83px centre to centre),
 * 45px left padding, 2.5px accent selection ring, hidden scrollbar.
 * Accessible name "Choose your avatar." (req 2, verbatim including the
 * full stop) on the scrollable group itself — CHROME per
 * docs/copy/screen-copy.md's authority table, distinct from the DESIGN
 * visible label "Choose your avatar" (no full stop) rendered above it.
 */
export interface AvatarPickerProps {
  value: string | null;
  onChange: (avatar: AvatarId) => void;
  error?: string;
}

export function AvatarPicker({ value, onChange, error }: AvatarPickerProps) {
  const errorId = "avatar-picker-error";

  return (
    <div>
      <p id="avatar-picker-label" style={{ font: "var(--type-caption)", color: "var(--color-text-subtle)" }}>
        Choose your avatar
      </p>
      <div
        role="radiogroup"
        aria-label="Choose your avatar."
        aria-describedby={error ? errorId : undefined}
        className="no-scrollbar flex overflow-x-auto"
        style={{
          gap: "15px",
          paddingLeft: "45px",
          paddingRight: "45px",
          paddingTop: "8px",
          paddingBottom: "8px",
          scrollSnapType: "x mandatory",
        }}
      >
        {AVATAR_IDS.map((id) => {
          const selected = id === value;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`Avatar ${id.replace("avatar-", "")}`}
              onClick={() => onChange(id)}
              className="shrink-0 overflow-hidden rounded-full"
              style={{
                width: "68px",
                height: "68px",
                scrollSnapAlign: "center",
                boxShadow: selected ? "0 0 0 2.5px var(--color-accent)" : "none",
              }}
            >
              <Image src={`/avatars/${id}.svg`} alt="" width={68} height={68} />
            </button>
          );
        })}
      </div>
      {error && (
        <p
          id={errorId}
          role="alert"
          style={{
            font: "var(--type-error)",
            color: "var(--color-error-text)",
            marginTop: "6px",
            paddingLeft: "45px",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
