"use client";

import { useId, useState } from "react";

/**
 * Sign-up's single password field with a show/hide toggle (D-10) — no
 * confirm field. Same accessible-name and error-association approach as
 * TextInput (label always present, visually hidden here since the design
 * shows a placeholder instead).
 */
export interface PasswordInputProps {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  autoComplete?: string;
}

export function PasswordInput({
  label,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  autoComplete,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="w-full" style={{ maxWidth: "286px" }}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="input-field"
          style={{ paddingRight: "56px" }}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute top-1/2 right-3 -translate-y-1/2"
          style={{ font: "var(--type-caption)", color: "var(--color-text-subtle)" }}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {error && (
        <p
          id={errorId}
          role="alert"
          style={{
            font: "var(--type-error)",
            color: "var(--color-error-text)",
            marginTop: "6px",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
