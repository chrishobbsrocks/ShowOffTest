---
id: 8
title: "Arenas, promotion and best rank"
epic: "Show Off Rebuild"
status: todo
created: 2026-09-13T05:05:42+00:00
---

# Master Controller Sprint Definition — Sprint 8

**Epic:** Show Off Rebuild — rebuild the Show Off trivia game from `docs/rebuild/show-off-rebuild-prd.md` as a test of the Fully Completely harness.
**Sprint Objective:** Players who have played see their arena's home screen, a result that moves them up an arena shows the promotion screen first, and every completed match records the player's best rank in their arena.

### Context
Sprint 2 defined the six arenas as data and sprint 7 stores trophy totals and win records. This sprint makes arenas visible: the arena home for returning players (ONB-2's branch, D-24), promotion (ARN-5, D-37), and the best-rank records that the leaderboard's arena tiles need (LDB-9), written inside sprint 7's submission transaction.

Sources of record: PRD 6.8 (ARN), 6.9 (LDB-4, LDB-5, LDB-9), 6.10 (ONB-2, ONB-6), P4; `docs/copy/screen-copy.md` section Arena home and promotion; Figma 3.04–3.09, 4.01–4.05; PRD Appendix B; D-24, D-37.

### Requirements
1. **Which home (ONB-2, PRO-5).** `/home` shows the new-user home (3.00) to a signed-in player with no recorded matches, and the arena home to everyone else, decided by match count, never by trophies. A player on 0 trophies with matches sees the Arena 1 home.
2. **Arena home (ARN-6, D-24, 3.04–3.09).** The player's current arena, from the stored total via the arena definition: that arena's background, badge and label; a progress bar from the arena's threshold (left label) to the next arena's threshold (right label), filled in proportion to the total; the trophy total; `Current winning streak` (the displayed streak), `Total wins`, `Total losses` and `Win rates` from sprint 7's win record; `Let’s play`; and the host image with `I believe in you...` and `...most of the time.` Arena 6 shows a full bar with only its threshold label. "3.09 - Home - A9" is Arena 6.
3. **Best rank on every match (LDB-9, LDB-4, LDB-5).** Inside the submission transaction, after the new total is applied, the server computes the player's rank within the arena that total places them in: 1 plus the number of ranked players (players with at least one match) in that arena who are ahead in leaderboard order, which is stored trophy total highest first, then a stable player identifier lowest first. It keeps the lowest (best) rank per player per arena. Records are never deleted by demotion. A resubmitted round records nothing (RND-13).
4. **Promotion (ARN-5, D-37, P4).** The submission response states whether the result moved the player up at least one tier, and to which arena. If so, the `ARENA UNLOCKED!` modal for the new arena (4.01–4.05: tag, label, host image and that arena's line from the copy file) appears before the result screen, and `Continue` closes it to reveal the result screen. If a result crosses two tiers, the modal shows the highest arena reached. A resubmission never shows it.
5. **The floor (ARN-4, ARN-7).** A loss never takes a total below 0 and never takes a player below Arena 1; there is no demotion screen. A first match scoring 1,995 or more moves a new player straight to Arena 2 with no Arena 1 best-rank record; that is intended.
6. **Play is always reachable (ONB-6).** Both home variants offer `Let’s play`.
7. **Standards (NFR-3, NFR-6, NFR-7).** 320px, accessible names (including the progress bar's value), visible focus, the generic fallback on unexpected failure, no unhandled rejections.

### Acceptance Criteria
1. QA1: the branch reads match count. LiveQA: a new account sees 3.00; after one match (win or loss) it sees the arena home.
2. LiveQA: the arena home matches 3.04 for an Arena 1 account, with its own figures: total, streak, wins, losses and win rate agree with the matches actually played in the live test notes. QA1 or component tests render all six arena variants against 3.04–3.09 (background property, badge, label, bar labels 0/200, 200/600, 600/1200, 1200/2000, 2000/3000, and Arena 6's full bar).
3. QA1: unit or database tests: three players on 500, 500 and 700 in Arena 2 give ranks 2 and 3 (by identifier) to the 500s and 1 to the 700; a player without matches is not counted; a later worse rank does not replace a better record; demotion leaves the record; a resubmission writes no record. The rank computation shares the LDB-4 order with no second implementation.
4. QA1: tests cover promotion from Arena 1 to 2, a two-tier jump showing Arena 3, no promotion within an arena, and no modal on resubmission. LiveQA: an account that crosses 200 trophies (play until it does; a strong win gives up to +240) sees the Arena 2 modal with the verbatim line before its result screen, and `Continue` reveals it.
5. QA1: tests for a loss at 0 trophies (stays 0, Arena 1, no modal) and a first-match 1,995 score (Arena 2, no Arena 1 record).
6. LiveQA: `Let’s play` works from both home variants.
7. LiveQA: keyboard reaches `Let’s play` and `Continue`; no horizontal scroll at 320px; no console errors. Accounts and matches created are listed in the notes (D-51).

### Out of Scope
- Leaderboards and arena tiles — sprint 10 (reads the best-rank records).
- Profile statistics — sprint 9.
- Seasons, closing arenas, arena-based matchmaking and question difficulty — PRD out of scope.

### Dependencies
- Blocks: sprint 10 (best-rank records), sprint 11 (the new-user home it modifies).
- Blocked by: sprint 7 closed.
- External: none. Runs in parallel with sprint 9.

### Team Assignments
- **Dev Team 1:** the whole sprint, in the main checkout. Owns `/home`, the promotion modal and the submission-transaction changes.
- **Dev Team 2:** not assigned (building sprint 9 in its worktree, which owns `/profile` only). Both sprints read sprint 7's win record and the arena definition without changing either; if a change to either seems necessary, stop and raise it with Master Controller.

### Risks & Mitigations
- Rank computed inside the transaction can race with another player's concurrent submission — acceptable for best-rank history; tests pin the order definition, and QA1 checks the computation reads committed totals consistently within the transaction.
- Promotion shown from a figure the browser computed would break P4 — requirement 4 takes it from the submission response only.
- Reaching Arena 2 live takes several matches — acceptance 4 allows playing until it happens; starter opponents include weak runs.
