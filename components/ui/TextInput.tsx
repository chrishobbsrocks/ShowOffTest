import { useId, type InputHTMLAttributes } from "react";

/**
 * The shared text-input look and error handling (design-tokens.md,
 * "Input"; sprint 2 req 14, NFR-2/NFR-3). `label` is always rendered, but
 * visually hidden when the design instead shows a placeholder — every
 * control still needs a real accessible name (req 14), and a placeholder
 * alone is not a reliable one. The error message, when present, is
 * `role="alert"` and linked to the field via `aria-describedby`, so it is
 * programmatically associated with its field, not just visually near it.
 */
export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  error?: string;
}

export function TextInput({ label, error, className, ...props }: TextInputProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="w-full" style={{ maxWidth: "286px" }}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        className={`input-field ${className ?? ""}`}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
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
