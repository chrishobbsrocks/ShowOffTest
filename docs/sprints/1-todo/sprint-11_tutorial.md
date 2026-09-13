---
id: 11
title: "Tutorial"
epic: "Show Off Rebuild"
status: todo
created: 2026-09-13T05:05:42+00:00
---

# Master Controller Sprint Definition — Sprint 11

**Epic:** Show Off Rebuild — rebuild the Show Off trivia game from `docs/rebuild/show-off-rebuild-prd.md` as a test of the Fully Completely harness.
**Sprint Objective:** A new player can open the optional two-card tutorial from home, and once they finish it, it is recorded on the server and never offered again.

### Context
The new-user home (sprint 2, now shown by sprint 8's branch) already has `See how it works`, which has redirected to home. This sprint builds the tutorial as the design draws it: a two-card modal over the new-user home (D-41, overriding ONB-3's step-1 quotation and ONB-5), at `/tutorial` (D-43). Completion is stored in the profile's tutorial field created in sprint 2 (ONB-4, PRO-9).

Sources of record: PRD 6.10 (ONB-3, ONB-4), 6.11 (SEC-1); `docs/copy/screen-copy.md` section Tutorial; Figma 3.01, 3.02; D-41, D-43.

### Requirements
1. **Opening it (D-43).** `See how it works` on the new-user home opens `/tutorial`, which renders the new-user home with the tutorial modal over it. The tutorial is never shown automatically. Signed-out visitors to `/tutorial` go to log in (already true since sprint 2).
2. **The cards (3.01, 3.02, D-41).** Card 1: `TROPHIES DON'T LIE` and its body; card 2: `KNOWING ISN'T ENOUGH` and its body; both with the two-dot position indicator and `Got it`, all verbatim (including the two spaces in card 1's body). `Got it` on card 1 shows card 2.
3. **Completing it (ONB-4, SEC-1, PRO-9).** `Got it` on card 2 asks the server to record completion, taking the player from the session. Only when the server confirms does the modal close and `/home` show. Recording completion again is harmless.
4. **Save failure.** If recording completion fails, the modal stays on card 2 and shows `We couldn't save your progress. Try again.` with a `Try again` button that retries; nothing is stored in the browser as a substitute for the server's record.
5. **Never again (ONB-4, D-43).** Once completed — in any browser, after clearing local storage, on any device — `See how it works` is not shown on the new-user home and `/tutorial` redirects to `/home`.
6. **Standards (NFR-3, NFR-6, NFR-7).** The modal traps focus while open, returns focus to `See how it works`'s position (or the page) on close, has an accessible name, and works at 320px; the generic fallback applies to unexpected failures; no unhandled rejections.

### Acceptance Criteria
1. LiveQA: on a new account, `See how it works` opens `/tutorial` with the modal over 3.00; a fresh account's home never opens it by itself.
2. LiveQA: both cards match 3.01 and 3.02 with verbatim copy; `Got it` on card 1 advances.
3. QA1: the handler takes the player from the session and only updates the signed-in player's tutorial field; a test shows a request naming another player changes only the caller. LiveQA: finishing the tutorial closes it and shows home.
4. QA1: a component test with the save failing shows the message and `Try again`, and retry success closes the modal. LiveQA: with the network set offline in dev tools before the final `Got it`, the message appears; back online, `Try again` completes it.
5. LiveQA: after completing, `See how it works` is gone; `/tutorial` redirects to `/home`; the same holds after clearing site data and logging in again, and in a second browser or a private window.
6. LiveQA: keyboard can complete the tutorial with focus kept inside the modal; no horizontal scroll at 320px; no console errors. Accounts created are listed in the notes (D-51).

### Out of Scope
- A skip control — PRD out of scope (not choosing the tutorial is how a player skips it).
- Starting a match from the tutorial — removed by D-41; `Let’s play` on home starts matches.
- Host character animation — PRD out of scope.

### Dependencies
- Blocks: nothing.
- Blocked by: sprint 8 closed (the home branch it modifies).
- External: none. Runs in parallel with sprint 10.

### Team Assignments
- **Dev Team 1:** not assigned (building sprint 10 in the main checkout, which owns `/leaderboard`).
- **Dev Team 2:** the whole sprint. Run `/sprint-worktree 11` before building and work only in that worktree. This sprint owns `/tutorial`, the modal, the completion handler and the `See how it works` link's visibility. It does not change `/home`'s branch logic or the arena home.

### Risks & Mitigations
- Closing the modal before the server confirms would make completion look saved when it isn't (P4's spirit) — requirement 3 waits for confirmation.
- A local-storage shortcut would pass single-browser testing and fail ONB-4 — acceptance 5 tests a cleared browser and a second browser.
