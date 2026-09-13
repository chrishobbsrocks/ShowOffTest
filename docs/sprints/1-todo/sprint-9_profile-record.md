---
id: 9
title: "Profile record"
epic: "Show Off Rebuild"
status: todo
created: 2026-09-13T05:05:42+00:00
---

# Master Controller Sprint Definition — Sprint 9

**Epic:** Show Off Rebuild — rebuild the Show Off trivia game from `docs/rebuild/show-off-rebuild-prd.md` as a test of the Fully Completely harness.
**Sprint Objective:** The profile shows the player's record — trophies, current arena, win rate and streaks — with a truthful zero state for every field.

### Context
The profile so far shows avatar, name, member-since date and log out (sprint 2) and the edit menu (sprint 4). Sprint 7 keeps the win record and stored trophy total. This sprint displays them on the profile, following PRO-1 as narrowed by D-23 (no Perfect games, trophy history or win-rate change) and D-42 (current arena shown).

Sources of record: PRD 6.2 (PRO-1 to PRO-6); `docs/copy/screen-copy.md` section Profile; Figma 8.01, 8.07, 8.08, 8.09; D-21 to D-23, D-42.

### Requirements
1. **Record cards (PRO-1, D-23).** Using 8.01's card layout, four cards: `TROPHIES` (the stored trophy total), `WIN RATE` (a ring filled to the percentage, and the percentage), `BEST STREAK` (best displayed streak) and `CURRENT STREAK` (displayed streak), in the positions of the design's Highest trophies, Win rate, Best streak and Perfect games cards. No trophy-history chart and no win-rate change indicator.
2. **Current arena (PRO-1, D-42, PRO-6).** The player's arena tag and label from the arena definition, shown under the member-since line. Trophies and arena both come from the same stored total the leaderboard uses; nothing on the profile recomputes a total.
3. **New or returning (PRO-5, PRO-2).** Decided by match count, from sprint 7's record:
   - no matches (8.07): the card `Play your first match to start building your record.` with `Let’s play` (starts a match), and the four cards in their zero states;
   - matches but no wins (8.08/8.09 pattern): cards show their real values, except `WIN RATE`, `BEST STREAK` and `CURRENT STREAK` show `Win to unlock` while the player has never won.
   Once a player has won, every card shows its real value, including `0%`-style extremes only where PRO-3 allows and `0` for a broken streak.
4. **Zero states are never blank (PRO-2, PRO-3).** No card ever shows an empty value, `NaN`, `undefined`, `null` or a dash. `TROPHIES` for a player with no matches shows `0`. Win rate values follow sprint 7's win-rate read exactly (never 0% or 100% unless strictly true).
5. **Standards (NFR-3, NFR-6, NFR-7).** 320px with no overlap of cards, an accessible name for each card that includes its value (the ring's value is announced), visible focus, the generic fallback on unexpected failure, no unhandled rejections.

### Acceptance Criteria
1. LiveQA: a returning account's profile matches 8.01's layout with the four specified labels and no chart; values agree with the matches recorded in the live-test notes.
2. QA1: the profile reads the stored total and arena definition; no summing of matches. LiveQA: the profile's trophies equal the `TOTAL` on the account's last result screen, and the arena tag matches the home screen.
3. LiveQA: a new account shows the 8.07 card and zero states; after one lost match it shows real trophies and `Win to unlock` on the other three cards; after its first win, real values. QA1 or component tests cover each state.
4. QA1: component tests render every card for: no matches; 3 losses; 1 win of 1; 199 wins of 200; a broken streak after a best of 4 — asserting no forbidden value appears and win rates match sprint 7's boundary rules.
5. LiveQA: at 320px the cards do not overlap and nothing is cut off; a screen reader reads each card's label and value; no console errors. Accounts and matches created are listed in the notes (D-51).

### Out of Scope
- Editing and password changes — done in sprint 4. Account deletion — sprint 12.
- Perfect games, trophy history and win-rate change — not built (D-23).
- Any change to how the win record is computed — sprint 7 owns it.

### Dependencies
- Blocks: nothing directly.
- Blocked by: sprints 4 and 7 closed.
- External: none. Runs in parallel with sprint 8.
- **Ready to build:** Requirements

### Team Assignments
- **Dev Team 1:** not assigned (building sprint 8 in the main checkout, which owns `/home` and the submission transaction).
- **Dev Team 2:** the whole sprint. Run `/sprint-worktree 9` before building and work only in that worktree. This sprint owns `/profile`'s record display only. It reads sprint 7's win record and the arena definition without changing either; if a change seems necessary, stop and raise it with Master Controller.

### Risks & Mitigations
- Zero states are where blanks and `NaN` appear — acceptance 4's state matrix.
- Two sprints reading one record in parallel could each "fix" it differently — the team assignment forbids changing it here.
