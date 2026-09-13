/**
 * The single arena definition (ARN-1, ARN-2, ARN-3; sprint 2 req 13; PRD
 * 6.8 and Appendix B). Tier number, name, label, trophy threshold, badge
 * path, tag path and background are defined here ONCE — no other file may
 * repeat a threshold or an arena name; tests/arenas.test.ts and QA1's
 * acceptance criterion 13 search the source for the literal threshold
 * numbers (200, 600, 1200, 2000, 3000) and each arena name to enforce that.
 *
 * Backgrounds are `var(--arena-N-background)` references into the six CSS
 * custom properties app/tokens.css defines from PRD Appendix B, so this
 * file — like every other application source file — contains no colour
 * literal of its own (tests/no-literal-colors.test.ts).
 */

export interface Arena {
  readonly tier: 1 | 2 | 3 | 4 | 5 | 6;
  /** The arena's own name, distinct from the "Arena N" prefix. */
  readonly name: string;
  /** The full display label, verbatim from screen-copy.md. */
  readonly label: string;
  /** Trophies needed to be placed in this arena. Exactly on it counts (ARN-3). */
  readonly threshold: number;
  readonly badge: string;
  readonly tag: string;
  readonly background: string;
}

export const ARENAS: readonly Arena[] = [
  {
    tier: 1,
    name: "Warm Up",
    label: "Arena 1 · Warm Up",
    threshold: 0,
    badge: "/arenas/arena-01-badge.png",
    tag: "/arenas/arena-01-tag.svg",
    background: "var(--arena-1-background)",
  },
  {
    tier: 2,
    name: "Contender",
    label: "Arena 2 · Contender",
    threshold: 200,
    badge: "/arenas/arena-02-badge.png",
    tag: "/arenas/arena-02-tag.svg",
    background: "var(--arena-2-background)",
  },
  {
    tier: 3,
    name: "Challenger",
    label: "Arena 3 · Challenger",
    threshold: 600,
    badge: "/arenas/arena-03-badge.png",
    tag: "/arenas/arena-03-tag.svg",
    background: "var(--arena-3-background)",
  },
  {
    tier: 4,
    name: "Expert",
    label: "Arena 4 · Expert",
    threshold: 1200,
    badge: "/arenas/arena-04-badge.png",
    tag: "/arenas/arena-04-tag.svg",
    background: "var(--arena-4-background)",
  },
  {
    tier: 5,
    name: "Champion",
    label: "Arena 5 · Champion",
    threshold: 2000,
    badge: "/arenas/arena-05-badge.png",
    tag: "/arenas/arena-05-tag.svg",
    background: "var(--arena-5-background)",
  },
  {
    tier: 6,
    name: "Legend",
    label: "Arena 6 · Legend",
    threshold: 3000,
    badge: "/arenas/arena-06-badge.png",
    tag: "/arenas/arena-06-tag.svg",
    background: "var(--arena-6-background)",
  },
] as const;

/**
 * A player's arena from their trophy total (ARN-2: never stored separately,
 * always derived, so it can never drift from the total). A total exactly on
 * a threshold is in the higher arena (ARN-3): 200 is Arena 2, not Arena 1.
 */
export function getArenaForTrophies(trophies: number): Arena {
  let current: Arena = ARENAS[0];
  for (const arena of ARENAS) {
    if (trophies >= arena.threshold) {
      current = arena;
    }
  }
  return current;
}
