import type { SignupFieldErrors, SignupFieldValues } from "@/lib/validation/signup";

/**
 * Kept out of actions.ts deliberately: a `"use server"` file may only
 * export async functions — a plain constant exported alongside one is not
 * a valid Server Action export, and Next's build strips/replaces it,
 * which broke static prerendering of /signup (the client component ended
 * up with `state.fieldErrors` undefined). This file has no directive, so
 * it's a normal shared module both actions.ts and SignupForm.tsx can
 * import from safely.
 */
export interface SignupActionState {
  values: SignupFieldValues;
  fieldErrors: SignupFieldErrors;
  formError?: string;
}

export const initialSignupActionState: SignupActionState = {
  values: { avatar: null, displayName: "", email: "", password: "" },
  fieldErrors: {},
};
