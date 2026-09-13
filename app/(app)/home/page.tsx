import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { LinkButton } from "@/components/ui/LinkButton";
import { getArenaForTrophies } from "@/lib/arenas";
import { getVerifiedUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Home — Showoff",
};

/**
 * Frame 3.00 (req 11; ONB-2, D-45). Every player sees the new-user home
 * in this sprint — match count, which would pick between this and a
 * returning player's arena home, does not exist until sprint 5/6, so
 * every signed-in player's home is 3.00 for now (D-45: "signed-in routes
 * are shells" until their real feature lands).
 *
 * The arena label reads from the one arena definition (req 13, ARN-2):
 * with no trophies recorded yet, every player is at 0, which
 * getArenaForTrophies places in Arena 1.
 */
export default async function HomePage() {
  const user = await getVerifiedUser();
  if (!user) {
    redirect("/login");
  }

  const arena = getArenaForTrophies(0);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-10 text-center">
      <Image
        src="/host/host-01-neutral.png"
        alt=""
        width={160}
        height={160}
        style={{ height: "auto", width: "160px" }}
      />

      <div style={{ font: "var(--type-body)", color: "var(--color-text-default)" }}>
        <p>Fresh meat. I like it.</p>
        <p>Welcome to the Arena.</p>
      </div>

      <p style={{ font: "var(--type-caption)", color: "var(--color-accent)" }}>{arena.label}</p>

      <h1
        style={{ font: "400 28px var(--font-display)", color: "var(--color-text-emphasis)" }}
      >
        YOUR KNOWLEDGE + YOUR SPEED = YOUR TROPHIES
      </h1>

      <p style={{ font: "var(--type-body)", color: "var(--color-text-subtle)" }}>
        10 questions. 1 opponent. The faster you answer correctly, the more you score. Climb the
        arenas...if you can.
      </p>

      <LinkButton href="/play">Let’s play</LinkButton>

      <LinkButton href="/tutorial" variant="secondary">
        See how it works
      </LinkButton>
    </main>
  );
}
