"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * D-45: shown on every signed-in route. Current tab is marked with
 * `aria-current="page"` (req 11) — a programmatic indicator, not colour
 * alone, and colour still comes from tokens either way.
 */
const TABS = [
  { href: "/home", label: "Home" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/profile", label: "Profile" },
] as const;

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="flex w-full items-center justify-around border-t"
      style={{
        borderColor: "var(--color-border-default)",
        background: "var(--color-bg-surface)",
        height: "64px",
      }}
    >
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            style={{
              font: "var(--type-caption)",
              color: active ? "var(--color-accent)" : "var(--color-text-subtle)",
            }}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
