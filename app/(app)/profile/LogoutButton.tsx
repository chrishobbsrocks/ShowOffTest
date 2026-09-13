"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { logoutAction } from "./actions";

/**
 * Frame 8.14 (req 12). A native `<dialog>` so `showModal()` gets the
 * modal semantics (focus moved in, Escape closes, background inert) for
 * free rather than hand-rolling a focus trap. `Cancel` just closes the
 * dialog; confirming submits the Server Action that ends the session.
 */
export function LogoutButton() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        style={{ font: "var(--type-link)", color: "var(--color-text-subtle)" }}
      >
        Log out
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="logout-confirm-heading"
        style={{
          background: "var(--color-bg-surface)",
          color: "var(--color-text-default)",
          border: "var(--border-width) solid var(--color-border-default)",
          borderRadius: "var(--radius-input)",
          padding: "24px",
          maxWidth: "320px",
          width: "90%",
        }}
      >
        <h2
          id="logout-confirm-heading"
          style={{ font: "400 24px var(--font-display)", color: "var(--color-text-emphasis)" }}
        >
          Leaving already?
        </h2>
        <p style={{ font: "var(--type-body)", color: "var(--color-text-subtle)", marginTop: "8px" }}>
          Your trophies will be here when you get back.
        </p>
        <div className="flex flex-col gap-3" style={{ marginTop: "24px" }}>
          <form action={logoutAction}>
            <Button type="submit" className="w-full">
              Log out
            </Button>
          </form>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => dialogRef.current?.close()}
          >
            Cancel
          </Button>
        </div>
      </dialog>
    </>
  );
}
