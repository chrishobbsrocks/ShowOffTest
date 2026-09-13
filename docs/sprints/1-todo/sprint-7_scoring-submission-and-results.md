---
id: 7
title: "Scoring, submission and results"
epic: "Show Off Rebuild"
status: todo
created: 2026-09-13T05:05:42+00:00
---

# Master Controller Sprint Definition — Sprint 7

**Epic:** Show Off Rebuild — rebuild the Show Off trivia game from `docs/rebuild/show-off-rebuild-prd.md` as a test of the Fully Completely harness.
**Sprint Objective:** Finishing a round records the match, the player's ghost run and the trophy change in one all-or-nothing submission, and shows a truthful win, loss or draw screen.

### Context
Sprint 6 plays a round to its tenth graded question. This sprint makes `See result` submit it (D-47), decides the winner with the tie rules, updates the stored trophy total that profiles and leaderboards will read, keeps each player's win record and streak (D-20 to D-22), and shows the result screens. The player's finished run becomes a ghost other players can race.

Sources of record: PRD 6.5 (RND-11 to RND-14), 6.6 (SCO), 6.7 (GHO-1, GHO-6), 6.9 (LDB-6), 6.2 (PRO-3 to PRO-5, as data), P1, P4; `docs/copy/screen-copy.md` sections Results and Finding a match and pre-match; Figma 7.00, 7.01, 7.03; D-20 to D-22, D-38, D-39, D-47. The scoring function is sprint 6's, reused unchanged.

### Requirements
1. **Submission (RND-12, D-47, P1, P3).** `See result` after question 10 submits the round. The server accepts it only for the session's own round, only when all ten questions are graded and the round has not expired. In one database transaction it writes: the player's run as a ghost run (GHO-1); one match record; the player's new stored trophy total; and the player's updated win record. Either all are written or none are.
2. **Winner (SCO-3).** Both scores come from sprint 6's scoring function over the server's records: the player's round and the ghost's stored run. The higher score wins. On equal scores, the lower total time wins, where total time is the sum of the ten elapsed times with each unanswered question counted as 15,000 ms. Equal scores and equal totals are a draw.
3. **Trophies (PRD 6.6).** Win: `+round(score / 10)`. Loss: `−clamp(200 − round(score / 10), 25, 200)`. Draw: 0. The running total never goes below 0; the recorded change is the change actually applied after the floor (a player on 10 trophies who loses has a recorded change of −10).
4. **Stored trophy total (LDB-6).** Each player has a stored trophy total, written in the same transaction and from the same value as the match that changed it. The migration that adds it sets every existing player to 0 (backfill). Nothing ever recomputes it from match history.
5. **Match record.** Records the player, the opponent ghost run, both scores, both total times, the outcome, the trophy change applied, the new total, and both correct-answer counts (D-38). A player can read only their own match records (SEC-3); the browser cannot write them (SEC-2).
6. **Resubmission changes nothing (RND-13).** Submitting a recorded round again, including two submissions racing each other, writes nothing, and the response says the round was already recorded, with the recorded outcome and scores. The result screen for that response shows the outcome and scores without a trophy-change line or a streak line.
7. **Win record and streaks (D-20 to D-22, PRO-3 to PRO-5).** Kept per player and updated in the submission transaction:
   - match count, wins, losses and draws;
   - the raw consecutive-win count: a win adds 1, a loss resets it to 0, a draw leaves it unchanged;
   - the displayed streak: the raw count when it is 3 or more, otherwise 0;
   - the best displayed streak ever reached.
   A server-side read returns this record with the win rate as a whole percentage: 100% only when every match was won, 0% only when none was, otherwise between 1% and 99% (never rounded to either extreme), and no value at all (not 0%, not blank, not NaN) for a player with no matches. Sprints 8 and 9 display it; this sprint shows the streak on the result screen and uses match count below.
8. **Result screens (SCO-4, P4, D-38).** Win (7.00, or 7.01 when a streak line shows), loss (7.03) and draw, with verbatim copy: headline, sub-heading (none for a draw), the recorded trophy change (`+ n TROPHIES`, `- n TROPHIES`, `0 TROPHIES`), `TOTAL` with the new total, the streak line when the displayed streak is 3 or more (`n win streak! New best!` when it equals a new best, otherwise `n win streak!`), both players' avatars, names, `n/10 CORRECT` and `n pts`, the crown on the winner (none on a draw), the host line and image, `Home` and `Play again` (which starts a new match). Every figure shown is the one the server recorded for this submission.
9. **Pre-match screen (D-39).** Sprint 5's pre-match screen now picks its host lines from the win record (no matches; displayed streak 3 or more; otherwise), and its arena tag from the player's stored trophy total.
10. **The player's run becomes raceable (GHO-2, GHO-4).** The ghost run written at submission is immediately eligible for other players and never for its owner.
11. **Standards (NFR-3, NFR-6, NFR-7).** 320px, accessible names, visible focus, the generic fallback on unexpected failure, no unhandled rejections.

### Acceptance Criteria
1. QA1: the submission path is one transaction; a test forces a failure after the ghost-run write and asserts no ghost run, match, total change or record change remains. Tests show refusal for another player's round, an incomplete round and an expired round.
2. QA1: unit tests: higher score wins; equal scores with lower total time wins; equal scores and equal time draws; an unanswered question counts 15,000 ms in the total, not its recorded elapsed time.
3. QA1: hand-calculated tests: win at 1,720 → +172; loss at 480 → −152 (SCO-6); loss at 0 → −200; loss at 2,400 → −25; loss at 1,800 → −25; draw → 0; a loss on 10 trophies records −10 and a total of 0.
4. QA1: migration read, including the backfill; search shows no code that sums match history into a total.
5. QA1: policies and tests: a player reads their own matches only; browser-role inserts and updates are refused.
6. QA1: a concurrency test fires two submissions of the same round at once and asserts exactly one match, one ghost run and one trophy change. LiveQA: finish a round, then resubmit it (replaying the submit request from the network panel, or reloading the result route if it resubmits); the response says already recorded and the total is unchanged on screen and in the next match's `TOTAL`.
7. QA1: unit tests for the streak sequence W, W, D, W (displayed 3), L (0), W, W, W (3, best stays 3), W (4, new best 4); and win rates for 1/1 → 100%, 0/3 → 0%, 199/200 → 99% not 100%, 1/200 → 1% not 0%, 1/3 → 33%, and no matches → no value.
8. LiveQA: play until at least one win and one loss are recorded (starter opponents range from weak to perfect), comparing each result screen with its frame; every string is verbatim; the `TOTAL` equals the previous total plus the shown change. QA1 or a component test covers the draw screen and the streak-line variants, which are hard to force live.
9. LiveQA: a brand-new account sees the "no matches" host lines before its first match and the "otherwise" lines before its second (unless a streak of 3 is reached).
10. QA1: test shows a newly submitted run is eligible for another player and not its owner. LiveQA: account B, racing repeatedly after account A has finished a round, can be matched against account A by name (record the attempts; if not seen within 25 presses, record that as a note, not a failure, since selection is random over more than 20 runs).
11. LiveQA: keyboard reaches `Home` and `Play again`; no horizontal scroll at 320px; no console errors. Accounts and matches created are listed in the notes (D-51).

### Out of Scope
- Arena promotion screens and best-rank records — sprint 8 (they join this sprint's submission transaction there).
- Displaying the win record on home and profile — sprints 8 and 9.
- Leaderboards — sprint 10.

### Dependencies
- Blocks: sprints 8, 9, 10 and 12.
- Blocked by: sprint 6 closed.
- External: none.

### Team Assignments
- **Dev Team 1:** the whole sprint, in the main checkout.
- **Dev Team 2:** not assigned.

### Risks & Mitigations
- Double-click and two-tab submissions are the classic scoring race — requirement 6 is enforced in storage (for example a uniqueness constraint on the round), not only in the UI, and acceptance 6 tests it concurrently.
- A result screen that computes its own trophy figure could disagree with what was stored (P4) — requirement 8 displays only recorded values.
- Win-rate rounding errors at the extremes — requirement 7's boundary tests.
