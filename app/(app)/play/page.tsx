import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getVerifiedUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Play — Showoff",
};

/**
 * D-45: a protected shell until matchmaking exists (sprint 5). Renders the
 * tab bar (from the shared layout) and background only — no invented
 * copy.
 */
export default async function PlayPage() {
  const user = await getVerifiedUser();
  if (!user) {
    redirect("/login");
  }

  return <main className="flex-1" />;
}
