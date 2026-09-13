---
id: 5
title: "Opponents and match start"
epic: "Show Off Rebuild"
status: todo
created: 2026-09-13T05:05:42+00:00
---

# Master Controller Sprint Definition — Sprint 5

**Epic:** Show Off Rebuild — rebuild the Show Off trivia game from `docs/rebuild/show-off-rebuild-prd.md` as a test of the Fully Completely harness.
**Sprint Objective:** Pressing `Let’s play` finds a random opponent from stored ghost runs, including 20 seeded starter opponents, creates a server-held round over that ghost's ten questions, and plays the pre-match screens.

### Context
Every round is played against a ghost (D-30), and ghosts only come from completed rounds, so the game cannot start without seeded starter opponents (D-31). This sprint creates ghost-run storage, seeds the starters, chooses an opponent and creates the round record that sprint 6 plays. The round is server-held from its first moment (PRD section 8: "server-held from the start, not added later").

Sources of record: PRD 6.5 (RND-1, RND-8), 6.7 (GHO), 6.11, P1–P3; `docs/copy/screen-copy.md` sections Finding a match and pre-match, Starter opponents; Figma 4.00, 5.00, 5.01; D-30 to D-33, D-39, D-45, D-50. The question bank's server-only module is sprint 3's.

### Requirements
1. **Ghost-run storage (GHO-1, GHO-6).** A ghost run records its ten question ids in order and, for each position, the outcome (`correct`, `wrong` or `unanswered`) and the server-measured elapsed milliseconds. It records who it belongs to: a player, or no player (a starter or, from sprint 12, an anonymised run). Starter runs carry their own display name and avatar. Once stored, a run's questions, outcomes and times cannot be changed by anyone, including server code, enforced in the database (sprint 12 may change only ownership, to anonymise).
2. **Starter opponents (D-31).** A migration seeds exactly 20 starter runs, one per name in the copy file's Starter opponents list, each with an avatar from the ten (every avatar used at least once). Each run uses ten distinct reviewed questions. Across the 20 runs: at least 4 have 0–3 correct answers, at least 4 have 4–6, at least 4 have 7–9, and at least 2 have all 10; every answered time is between 2,000 and 14,000 ms; at least 3 runs include an unanswered question, recorded at 15,000 ms. Starter runs belong to no player, so they never appear on a leaderboard and cannot sign in.
3. **Choosing an opponent (GHO-2, GHO-4).** On the server, the opponent is chosen uniformly at random from every stored ghost run that is not the signed-in player's own and whose ten questions are all currently reviewed. Opponents are not filtered by arena or skill. If none qualifies, no round is created and the player sees `No opponents are available right now. Try again in a minute.` on the home screen.
4. **Creating the round (RND-1, RND-8, P1, P3).** Starting a match is a server action or route handler that takes the player from the session, chooses the opponent and stores a round: player, ghost run, the ghost's ten question ids in the ghost's order, and creation time. The response identifies the round and the opponent's display name and avatar only: no question ids, question content, option, answer, fact, or the ghost's outcomes or times. If the player already has an unfinished round, starting returns that round instead of creating a second one.
5. **Round storage is server-only (SEC-2).** The browser's database roles cannot read or write ghost runs or rounds, whether or not a request names a player.
6. **Pre-match screens (GHO-5, D-33, D-39).** `Let’s play` on `/home` shows 4.00 (`Finding your opponent...` over the home screen) while the server works, then 5.00: `Opponent Found`, the player's arena tag and name from the arena definition, the player's card and the opponent's card, each showing avatar and name only, and `VS`. The host lines are the "player has no matches" pair (the other two variants arrive with match records in sprint 7). The countdown shows `Starting in 3 seconds...`, then `Starting in 2 seconds...`, then `Starting in 1 second...`, then 5.01 with `GO!`, then navigates to the round at `/play`. The countdown is presentation only; no question timer starts until sprint 6 delivers the first question.
7. **Long names fit.** Both cards display a 10-character display name and the 14-character `Deleted Player` without overflow, overlap or truncation, at 320px and 375px.
8. **Standards (NFR-3, NFR-6, NFR-7).** 320px, accessible names, visible focus, the generic fallback on unexpected failure, no unhandled rejections.

### Acceptance Criteria
1. QA1: migration read; an automated database test shows an update to a stored run's outcomes, times or question ids is refused even by the service role, and deleting a run is refused.
2. QA1: a test over the seed data checks the 20 names match the copy file exactly, avatar coverage, ten distinct reviewed question ids per run, and every distribution rule. LiveQA: over repeated matches on production, opponents shown are starter names with their avatars.
3. QA1: unit tests with an injected random source show selection is uniform over eligible runs, the player's own runs are never eligible, a run containing an unreviewed question is never eligible, and an empty eligible set produces the error and no round. LiveQA: across at least 15 `Let’s play` presses with one account, more than one distinct opponent appears and the player's own name never does.
4. QA1: the handler takes the player from the session; tests show a second start with an unfinished round returns the same round id. LiveQA: in the network panel, the start response contains only the round identifier and the opponent's name and avatar (no question text, ids, options, facts, outcomes or times).
5. QA1: policies read; an automated test with anon and authenticated roles shows reads and writes on both tables are refused, including a write naming the signed-in player.
6. LiveQA: 4.00, 5.00 and 5.01 match the frames with verbatim copy; the countdown shows 3, 2 and 1 with the correct singular on 1; `GO!` appears and `/play` opens. The player's arena tag reads Arena 1 for a new account.
7. LiveQA: with an account named with 10 characters (for example `Smartypan1`), both cards render without overflow at 320px; QA1 or a component test confirms `Deleted Player` renders without overflow.
8. LiveQA: keyboard use and focus on `Let’s play`; no horizontal scroll at 320px; no console errors. Accounts created are listed in the notes (D-51).

### Out of Scope
- Delivering, timing or grading questions, and the round screens — sprint 6.
- Scoring, storing the player's own run as a ghost, match records and results — sprint 7.
- The other two pre-match host-line variants — sprint 7.
- Anonymising deleted players' runs — sprint 12.

### Dependencies
- Blocks: sprint 6.
- Blocked by: sprints 2 and 3 closed.
- External: none. Runs in parallel with sprint 4.

### Team Assignments
- **Dev Team 1:** the whole sprint, in the main checkout. Owns `/home`'s `Let’s play` behaviour, `/play`, matchmaking, ghost-run and round storage and the seed migration.
- **Dev Team 2:** not assigned (building sprint 4 in its worktree, which owns the profile edit screens and reset routes only). Neither sprint edits the other's files.

### Risks & Mitigations
- "Random" selection in SQL is often not uniform (for example, random offsets over gapped ids) — requirement 3's uniformity test with an injected random source.
- Leaking the ghost's questions or outcomes in the start response would break P2 for the whole round — requirement 4 and LiveQA's network inspection.
- Seeding through a migration makes starter data permanent on production — it is intended; the data is fixed and QA1 audits it before push.
