/**
 * See app/signup/state.ts for why this lives outside actions.ts: a
 * `"use server"` file may only export async functions.
 */
export interface LoginActionState {
  email: string;
  formError?: string;
}

export const initialLoginActionState: LoginActionState = { email: "" };
