---
id: 10
title: "Leaderboards"
epic: "Show Off Rebuild"
status: todo
created: 2026-09-13T05:05:42+00:00
---

# Master Controller Sprint Definition — Sprint 10

**Epic:** Show Off Rebuild — rebuild the Show Off trivia game from `docs/rebuild/show-off-rebuild-prd.md` as a test of the Fully Completely harness.
**Sprint Objective:** Signed-in players can browse the global board and every arena's board, see their own rank, and see each arena as current, conquered or locked, without the leaderboard exposing anything beyond name, avatar and trophies.

### Context
Sprint 7 stores trophy totals and sprint 8 records best ranks. This sprint builds the leaderboard screen from 9.00–9.03, all-time only (the Weekly and Monthly tabs are PRD out of scope), with the design's arena carousel (D-40) extending LDB-2 so any arena can be browsed.

Sources of record: PRD 6.9 (LDB-1 to LDB-9), 6.11 (SEC-3); `docs/copy/screen-copy.md` section Leaderboards; Figma 9.00–9.03, the `Arena badge` component (`public/arenas/*-tag.svg`); D-40.

### Requirements
1. **Signed-in only (LDB-1).** `/leaderboard` and any data behind it require a verified session. Signed-out visitors are sent to log in and no leaderboard data reaches them in any form.
2. **Boards (LDB-2, D-40).** A carousel of seven tags — global (`global-tag.svg`) then Arena 1 to Arena 6 — selects a board. It opens on the viewer's current arena. The global board ranks every ranked player; an arena board ranks the ranked players whose stored total places them in that arena. Starter and anonymised ghost runs are not players and never appear.
3. **Order and ranks (LDB-4).** Stored trophy total, highest first; ties broken by a stable player identifier, lowest first, so equal totals never swap between loads. Ranks start at 1 and count over that board's whole population. Every ranked player is shown: no pagination, no limit.
4. **Who is ranked (LDB-5).** A player with no matches appears on no board. Such a viewer sees `Play your first match to get ranked.` in place of their rank line.
5. **Rank line (LDB-3).** On the global board: `You rank #n in Global Arena`. On the viewer's current arena: `You rank #n in Arena N`. On other arenas, the tile state's message (requirement 7).
6. **Layout (9.00–9.03).** `LEADERBOARD`, the carousel, the rank or state line, a podium for ranks 1–3 (`1ST`, `2ND`, `3RD`, avatar, name, trophies), then a row for every rank from 4 (rank, avatar, name, trophies). The viewer's own row or podium place is visibly marked. On the global board each entry also shows that player's arena tag and name, derived from their total (9.01). A board with no ranked players shows `Nobody's ranked here yet.`
7. **Arena tile states (LDB-8).** Each of the six arena tags is in exactly one state for the viewer: **current** (the arena the viewer's total places them in; rank line as in requirement 5); **archived** (the viewer has a best-rank record for it and it is not current, above or below; message `You conquered Arena N. Best rank: R.` from sprint 8's record); **locked** (no best-rank record; message `You haven't made it here yet.`). Locked and archived arenas' boards are still shown below their message (D-40).
8. **Least exposure (LDB-7, SEC-3).** The data behind the leaderboard returns, per entry, only: display name, avatar, stored trophy total and whether the entry is the viewer's own (the arena shown on the global board is derived from the total). It returns no player identifiers and no email addresses, and providing it does not widen the browser's access to the player table (for example, a server-side query or a narrowly scoped database function, not a new read policy on profiles).
9. **Standards (NFR-3, NFR-6, NFR-7).** 320px (the carousel scrolls horizontally inside its own area; the page does not), accessible names for tags (including their state) and rows, visible focus, keyboard-operable carousel, the generic fallback on unexpected failure, no unhandled rejections.

### Acceptance Criteria
1. LiveQA: signed out, `/leaderboard` redirects to log in, and requesting the leaderboard data endpoint or action directly (copied from a signed-in session's network panel) returns nothing usable.
2. LiveQA: the carousel opens on the viewer's arena; each of the seven boards loads; no starter name appears on any board.
3. QA1: tests with fixture players cover order, identifier tie-break and ranks across the whole population. LiveQA: reloading five times never changes the order of equal-trophy players.
4. QA1: a player with no matches is absent from every board in tests. LiveQA: a new account is absent from the global board and sees the "get ranked" line.
5. LiveQA: a ranked account's global rank line matches its position counted on the board; its arena line likewise.
6. LiveQA: visual comparison with 9.00 and 9.01 at 375px; the viewer's entry is marked; global entries show arena tags consistent with their trophies. QA1 or a component test covers the empty-board message.
7. QA1: tests for current, archived above (demoted player), archived below (promoted player) and locked (including the Arena 1 skip case, which shows locked). LiveQA: an account promoted to Arena 2 sees Arena 1 as `You conquered Arena 1. Best rank: R.` with R matching its record, and Arena 3 as locked (9.02, 9.03).
8. QA1: the data-access code and migrations read; no player id or email field in the response type; no new browser read policy on profiles. LiveQA: the leaderboard network responses contain only name, avatar, trophies and an own-entry flag per entry — no uuid-shaped values and no `@`.
9. LiveQA: keyboard can move through the carousel and select each tag; the page has no horizontal scroll at 320px; no console errors. Accounts created are listed in the notes (D-51).

### Out of Scope
- Weekly and monthly boards — PRD out of scope (deferred).
- A leaderboard preview for signed-out visitors — forbidden (LDB-1).
- Changing how best ranks are recorded — sprint 8 owns it.

### Dependencies
- Blocks: sprint 12 (deletion must remove leaderboard presence).
- Blocked by: sprints 8 and 9 closed.
- External: none. Runs in parallel with sprint 11.
- **Ready to build:** Requirements

### Team Assignments
- **Dev Team 1:** the whole sprint, in the main checkout. Owns `/leaderboard` and its data access.
- **Dev Team 2:** not assigned (building sprint 11 in its worktree, which owns the tutorial and the new-user home's tutorial link only). Neither sprint edits the other's files.

### Risks & Mitigations
- A convenient "let authenticated users read profiles" policy would leak every player's row — requirement 8 forbids widening access, and acceptance 8 checks responses.
- Rank ties that depend on database scan order appear stable in testing and flip in production — requirement 3's explicit identifier tie-break and repeated live reloads.
- Live data will be sparse (a handful of test accounts) — fixture-based tests carry order and tie coverage; LiveQA verifies with the accounts that exist.
