import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { formatShowingOffSince } from "@/lib/format-date";
import { getVerifiedUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./LogoutButton";

export const metadata: Metadata = {
  title: "Profile — Showoff",
};

/**
 * Req 12: avatar, display name, "Showing off since" date, and Log out.
 * Everything beyond this (trophies, streaks, win rate, arena) is a later
 * sprint's PRO-1 build — sprint 2 ships the minimal profile named in its
 * own Context section.
 */
export default async function ProfilePage() {
  const user = await getVerifiedUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("display_name, avatar, created_at")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    console.error("[ProfilePage] failed to load the signed-in player's own profile", error);
    redirect("/login");
  }

  return (
    <main className="flex flex-1 flex-col items-center gap-6 px-6 py-10 text-center">
      <Image
        src={`/avatars/${profile.avatar}.svg`}
        alt=""
        width={96}
        height={96}
        style={{ borderRadius: "9999px" }}
      />

      <h1 style={{ font: "400 28px var(--font-display)", color: "var(--color-text-emphasis)" }}>
        {profile.display_name}
      </h1>

      <p style={{ font: "var(--type-body)", color: "var(--color-text-subtle)" }}>
        Showing off since {formatShowingOffSince(profile.created_at)}
      </p>

      <LogoutButton />
    </main>
  );
}
