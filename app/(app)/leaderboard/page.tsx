import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getVerifiedUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Leaderboard — Showoff",
};

/**
 * D-45: a protected shell until leaderboards exist (a later sprint).
 * Renders the tab bar (from the shared layout) and background only — no
 * invented copy.
 */
export default async function LeaderboardPage() {
  const user = await getVerifiedUser();
  if (!user) {
    redirect("/login");
  }

  return <main className="flex-1" />;
}
