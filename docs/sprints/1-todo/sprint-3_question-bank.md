---
id: 3
title: "Question bank"
epic: "Show Off Rebuild"
status: todo
created: 2026-09-13T05:05:41+00:00
---

# Master Controller Sprint Definition — Sprint 3

**Epic:** Show Off Rebuild — rebuild the Show Off trivia game from `docs/rebuild/show-off-rebuild-prd.md` as a test of the Fully Completely harness.
**Sprint Objective:** A validated, review-gated bank of at least 40 questions exists in the production database, readable only by server code, with the delivery helpers rounds will use.

### Context
Rounds (sprint 6) and starter opponents (sprint 5) both need reviewed questions to exist. The bank is independent of accounts, so it runs in parallel with sprint 2. PRD 6.4 defines the format and rules; `docs/design/sample-questions.json` is the format of record and must load unchanged.

Per D-36, questions are test content: the review gate is enforced mechanically, but content quality is not audited. Dev Team 2 writes the questions directly; no model or external service is called, at build time or at runtime. Sources of record: PRD 6.4 (QB), P2, SEC-2, SEC-5; `docs/rebuild/mc-decisions.md` D-35, D-36, D-50.

### Requirements
1. **Bank source of record.** The question bank lives in the repository as JSON in the same shape as `docs/design/sample-questions.json` (`id`, `arena`, `setup`, `question`, `options`, `answerIndex`, `fact`). Review records live alongside it in the repository, one per reviewed question, stating only: the question id, the reviewer (for example `dev-team-2`) and the review round (for example `1`).
2. **Loader and validation (QB-1, QB-2, QB-3).** One loader validates the whole bank and fails loudly, listing every failure at once, each naming its question id. A question is valid only if: its id is non-empty and unique; `arena` is a positive integer; `setup`, `question` and `fact` are non-empty; `options` has exactly four non-empty strings with no duplicates (compared after trimming, case-insensitively); and `answerIndex` is `0`, the bank's fixed position for the correct option (the sample file's convention). A review record naming a question id that does not exist is also a failure. The ten sample questions load unchanged.
3. **Content.** At least 40 questions pass validation, including the ten samples unchanged. At least 40 of them have review records. Exactly two questions deliberately have no review record, so the review gate has something real to refuse.
4. **Database and migration (NFR-5, D-50).** Migrations create the question and review-record tables and load the bank's content, generated from the repository JSON rather than retyped, so the content reaches production through the GitHub integration. Re-running the generator on an unchanged bank produces no diff. `arena` is stored but nothing selects on it.
5. **No browser access (QB-6, SEC-2).** Row Level Security gives the browser's database roles (anon and authenticated) no read or write access to either table. No route, API endpoint or server action lists the bank or returns question content. Question content is not imported by any client component, so it never appears in a client bundle.
6. **Server-only bank access.** A server-only module (it fails to import into client code) provides: fetch reviewed questions by an ordered list of ids, preserving that order and failing if any id is missing or unreviewed; choose N distinct reviewed questions at random; and report whether each of a set of ids is currently reviewed. Unreviewed questions are never returned by any of them (QB-4).
7. **Delivery shuffle (QB-3, P2).** A server-only function turns a stored question into a delivery: the four options in a freshly shuffled order, each with an opaque identifier that does not reveal its stored position, plus a server-side record of which identifier is correct. The delivery object sent to a browser must be constructible without the correct identifier or the fact. The shuffle is uniform over all 24 orders.
8. **CI.** Bank validation runs in CI on every push, so a malformed question fails the build.

### Acceptance Criteria
1. QA1: the bank JSON and review records exist in the repository in the stated shape; review records contain only id, reviewer and round.
2. QA1: unit tests feed the loader a bank containing several distinct faults at once (duplicate id, three options, empty fact, duplicate options differing only in case, `answerIndex` 2, arena 0, orphan review record) and assert every fault is reported, each with its id. A test loads `docs/design/sample-questions.json` byte-for-byte unchanged and it passes.
3. QA1: counts checked by a test: ≥40 valid, ≥40 reviewed, exactly 2 unreviewed; the ten sample ids are present and identical to the sample file.
4. QA1: the content migration is generated (the generator is committed and a test or CI step shows regenerating produces no diff). LiveQA: in the Supabase dashboard (operator shares the view if LiveQA cannot open it), both tables hold the expected row counts on production.
5. QA1: policies read; an automated test using the anon and authenticated roles shows reads and writes on both tables are refused. LiveQA: signed in and signed out, searching every JavaScript file served on production for three known question texts and three known facts finds nothing; no network response on any page contains question content.
6. QA1: the module imports a server-only guard; unit tests show fetch-by-ids preserves order and refuses a missing or unreviewed id, random choice never returns an unreviewed question across many draws and never repeats within a draw, and the reviewed-status check is correct for reviewed, unreviewed and unknown ids.
7. QA1: unit tests show the browser-facing delivery shape has no correct-option or fact field, identifiers differ across two deliveries of the same question, and over a large seeded run every one of the 24 orders appears with roughly equal frequency (a tolerance stated in the test).
8. QA1: the CI workflow runs the validation; a scratch commit with a broken question fails CI (shown by Dev Team or confirmed by reading the workflow and test).

### Out of Scope
- Any screen, route or endpoint that uses questions — sprints 5 and 6.
- A question status endpoint (QB-6 allows one; not needed, because the gate is verified by tests here and live in sprint 5).
- Content quality review (D-36), difficulty by arena (PRD out of scope), categories (D-35).

### Dependencies
- Blocks: sprints 5 and 6.
- Blocked by: sprint 1 closed.
- External: none. Runs in parallel with sprint 2.
- **Ready to build:** Requirements

### Team Assignments
- **Dev Team 1:** not assigned (building sprint 2 in the main checkout).
- **Dev Team 2:** the whole sprint. Run `/sprint-worktree 3` before building and work only in that worktree. This sprint owns the question-bank module, its data and generator, and its own migrations. It does not touch routes, auth, profiles, the arena definition or the tab bar. Both sprints may add migrations (distinct timestamps) and dependencies; where `package.json` or the lockfile conflict, Pipeman resolves it at merge.

### Risks & Mitigations
- A bank imported by a shared module could end up in a client bundle without anyone noticing — requirement 5 and the live bundle search.
- Two parallel sprints adding migrations can collide on ordering — each uses its own timestamped file and neither edits the other's; Pipeman checks order at merge.
- A shuffle that looks random but is biased (a common sort-by-random mistake) — requirement 7's distribution test.
