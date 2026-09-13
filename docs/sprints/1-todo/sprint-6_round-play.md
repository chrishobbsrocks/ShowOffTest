---
id: 6
title: "Round play"
epic: "Show Off Rebuild"
status: todo
created: 2026-09-13T05:05:42+00:00
---

# Master Controller Sprint Definition — Sprint 6

**Epic:** Show Off Rebuild — rebuild the Show Off trivia game from `docs/rebuild/show-off-rebuild-prd.md` as a test of the Fully Completely harness.
**Sprint Objective:** A player plays all ten questions of a server-held round, one at a time, timed and graded only by the server, with the opponent's score revealed question by question and no answer ever reaching the browser early.

### Context
This is the product's integrity core. PRD principles P1 (the server decides), P2 (no answer before grading) and requirements RND-2 to RND-11 all land here. The single scoring function (SCO-1, SCO-2) is also built here, because the running `YOU` and `THEY` scores (D-34) need it; sprint 7 reuses it unchanged for submission and results.

When all ten questions are graded, `See result` currently returns to home; sprint 7 turns it into submission and the result screens (D-47). Sources of record: PRD 6.5 (RND), 6.6 (the scoring table, SCO-1, SCO-2, SCO-6), P1–P3, SEC-1, SEC-5; `docs/copy/screen-copy.md` section Question and answer; `docs/design/character-sheet.md`; Figma 6.01–6.05 and the two speed-bonus callout frames; D-34, D-35, D-46, D-48.

### Requirements
1. **One question at a time (RND-2, P2).** The browser requests the round's current question from the server. The server releases question n+1 only after question n is graded. A delivery contains only: position (`Q n/10`), setup line, question text, the four options in a fresh order with opaque identifiers (sprint 3's delivery shuffle), and the time remaining. It never contains the correct identifier, the fact, or anything about undelivered questions.
2. **Server timing (RND-3, RND-4, D-48).** The server records the delivery time the first time a question is delivered, and the grading time when it is graded. Elapsed time is grading time minus that question's delivery time only; it is never computed from other questions and never taken from the browser. The limit is 15,000 ms. The countdown and the `+ n pts` speed indicator are derived from the server's delivery time; the warning state (6.02) begins with 5,000 ms left.
3. **Three outcomes (RND-4, RND-5, D-46).** An answer graded within the limit is `correct` or `wrong`. No answer by the limit is `unanswered`, and so is an answer the server receives after the limit. When the browser's countdown reaches zero it asks the server to grade the question as unanswered; if the server's own elapsed time has not yet reached 15,000 ms it refuses, and the browser asks again. Unanswered and wrong both break the in-round correct-answer run.
4. **Graded exactly once (RND-6).** Resending the same answer returns the same result. A different answer to a graded question is refused. A question cannot be graded before it is delivered, and questions cannot be graded out of order.
5. **Feedback and the fact (RND-7, D-34, D-46).** Grading returns the outcome, which option was correct, the fact, the ghost's outcome for the same position, and both cumulative scores through this question. The screen shows 6.03 (correct), 6.04 (wrong) or the unanswered state, with `💡` and the fact, the player's and opponent's result labels and scores, and `Next question` (`See result` after question 10). Time spent on the feedback screen never counts: the next question's clock starts when the server delivers it.
6. **The browser holds only an identifier (RND-8, RND-11).** The browser may keep the round's identifier, and nothing that is the round itself. Replaying any earlier request or response cannot rewind progress, restart a clock or re-deliver a question with a new delivery time. The saved identifier is stored per player: a different account signed in on the same browser never sees or acts on it, and the server refuses any round request from a player who does not own the round. The browser discards its saved identifier when the server gives a definitive answer (accepted, already recorded, refused or expired) and keeps it only after a network failure or a server error, to retry.
7. **Expiry (RND-9).** A round expires 60 minutes after its first question was delivered. Any request on an expired round is refused, awards nothing, and shows `This round has expired. Start a new match from home.`
8. **Reload resumes (RND-10).** Reloading `/play` continues the unfinished round at the same question, with the same option order, and the countdown shows the time actually left by the server's clock. A question whose limit passed during the reload is graded unanswered when the round is next fetched, and its feedback is shown.
9. **One scoring function (SCO-1, SCO-2).** A single pure function scores a sequence of ten outcomes and elapsed times using PRD 6.6's table exactly: a correct answer earns `100 + round(100 × max(0, 15000 − elapsed_ms) / 15000)`; wrong and unanswered earn 0; each correct answer at position 3 or later of a consecutive correct run earns +50. It is used for the player's and the ghost's running scores, on the server, from the server's own records only. The constants are not adjustable.
10. **The screens (6.01–6.05).** Frames 6.01, 6.02, 6.03, 6.04 and the unanswered state, with verbatim copy. The category slot shows the setup line (D-35). Host images follow the character sheet: `host-06-thinking` while a question is open, `host-03-excited` on correct, `host-05-disappointed` on wrong, `host-09-shocked` on unanswered. Answer buttons are disabled once one is chosen, so a double click submits one answer.
11. **Standards (NFR-3, NFR-6, NFR-7).** 320px, accessible names for options and buttons, visible focus, keyboard answering, the generic fallback for unexpected failures, no unhandled rejections.

### Acceptance Criteria
1. QA1: delivery handler read; tests assert the delivery payload's exact keys. LiveQA: on production, before answering each question, the network responses and the rendered page source contain neither that question's fact nor any later question's text (checked on at least three questions, using the network panel and view-source).
2. QA1: tests with an injected clock show elapsed time uses only that question's delivery and grading times, a second delivery request does not move the delivery time, and the warning threshold is 10,000 ms elapsed. LiveQA: the countdown and `+ n pts` fall steadily and the warning state appears with 5 seconds left.
3. QA1: tests cover grading at 14,999 ms (answered), at 15,001 ms (unanswered, whatever was chosen), and an early timeout request (refused). LiveQA: letting a question run out shows the unanswered state.
4. QA1: tests cover identical resend (same result), a different answer after grading (refused), grading an undelivered question (refused) and grading question 3 before question 2 (refused). LiveQA: a rapid double click on an option records one answer.
5. LiveQA: correct, wrong and unanswered feedback each show the right labels, correct option, fact and both scores; waiting 20 seconds on a feedback screen then answering the next question quickly still shows a high `+ n pts` at answer time.
6. QA1: tests show a replayed earlier response or request cannot rewind or re-time a question, and a round request from a non-owner is refused. LiveQA: sign in as account A, start a round, log out, sign in as account B on the same browser — B never sees A's round; B's request using A's round identifier (copied from the network panel) is refused.
7. QA1: tests with an injected clock show a request at 60 minutes plus 1 second after first delivery is refused and nothing changes. The expired message renders (component test).
8. LiveQA: reload mid-question resumes the same question and option order with less time left, never more; reloading on a question and waiting past its limit before the page loads shows it as unanswered.
9. QA1: unit tests with hand-calculated expectations: all ten correct at 0 ms = 2,400; the design's sanity figures (SCO-6) reproduced from constructed runs; a correct answer at 15,050 ms graded correct in a synthetic test earns 100, never less; runs of 2, 3 and 5 correct earn 0, +50 and +150 bonus; a wrong answer resets the run. Search shows no second scoring implementation.
10. LiveQA: visual comparison with 6.01–6.04 at 375px; host images change as specified; setup line appears beside `Q n/10`.
11. LiveQA: a full round can be played by keyboard alone; no horizontal scroll at 320px; no console errors. Accounts created are listed in the notes (D-51).

### Out of Scope
- Submitting the round, storing the player's run, trophies and result screens — sprint 7. Until then `See result` returns to `/home`.
- Leaderboards, arenas and profile stats — later sprints.
- Rate limiting (SEC-6, accepted risk).

### Dependencies
- Blocks: sprint 7.
- Blocked by: sprint 5 closed.
- External: none.
- **Ready to build:** Requirements

### Team Assignments
- **Dev Team 1:** the whole sprint, in the main checkout.
- **Dev Team 2:** not assigned.

### Risks & Mitigations
- The browser and server clocks disagree — every time shown is derived from the server's delivery time and the time remaining the server reports; the browser never decides an outcome (requirement 3).
- React server components or cached fetches could render the next question or the fact into HTML early — acceptance 1 checks page source as well as network responses.
- Double submission races (double click, two tabs) — requirement 4's grade-once rule is enforced on the server and in storage, not only by disabling buttons.
