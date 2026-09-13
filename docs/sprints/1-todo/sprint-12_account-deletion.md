---
id: 12
title: "Account deletion"
epic: "Show Off Rebuild"
status: todo
created: 2026-09-13T05:05:42+00:00
---

# Master Controller Sprint Definition — Sprint 12

**Epic:** Show Off Rebuild — rebuild the Show Off trivia game from `docs/rebuild/show-off-rebuild-prd.md` as a test of the Fully Completely harness.
**Sprint Objective:** A player can permanently delete their own account, with every consequence for other players applied exactly as PRD 6.3 decides, atomically, and only after a deliberate confirmation.

### Context
Deletion is the product's only irreversible operation (P5), and it comes last because it must account for every table earlier sprints created: profiles, rounds, ghost runs, matches, win records, trophy totals and best ranks. PRD 6.3's table decides each consequence; nothing is left to database defaults by accident.

Sources of record: PRD 6.3 (DEL-1 to DEL-5), 6.11 (SEC-1, SEC-4), P4, P5; `docs/copy/screen-copy.md` sections Account deletion and Profile (edit menu); D-44, D-51. The design has no deletion frame; the screen uses the edit screens' layout (8.10/8.12) with GAP copy.

### Requirements
1. **Entry and screen (D-44).** The 8.15 edit menu gains `Delete account`. It opens a `DELETE ACCOUNT` screen with the three body paragraphs, the `Type your display name to confirm` field, `Delete my account` and `Cancel`, all verbatim.
2. **Deliberate confirmation (DEL-2, D-44).** The screen obtains a single-use confirmation token from the server when it loads. Deletion proceeds only when the request carries that unused token and the typed name matches the player's current display name, ignoring case and surrounding whitespace; a mismatch shows `That doesn't match your display name.` `Delete my account` is disabled until the field is non-empty. Pressing Enter in the field does not delete unless the name matches, and a second click, a resubmitted form, a browser Back followed by resubmission or a replayed request is refused because the token is spent.
3. **Only yourself (DEL-5, SEC-1, SEC-4).** The server verifies the session and deletes the account the session belongs to; nothing in the request can name a different account. The service-role credential needed to remove the sign-in credential is used only in that server path, after the session is verified, and never reaches the browser.
4. **Consequences (PRD 6.3 table, DEL-1).** In this order of effect:
   - the player's in-progress rounds are removed first;
   - their match records, win record and best-rank records are removed;
   - their ghost runs survive, anonymised: they belong to no player, display as `Deleted Player` with `avatar-1`, stay raceable, and keep their questions, outcomes and times unchanged;
   - their profile is removed, freeing the display name for anyone to register;
   - their sign-in credential is removed, so they can no longer log in.
   Leaderboards and ranks recompute without them automatically, because boards read stored totals of existing players. A new account registering the freed name does not appear to own the anonymised runs, because runs link to players by identifier, never by name.
5. **Atomic (DEL-4).** Deletion completes entirely or changes nothing. At no moment, including after a failure at any step, does a credential exist without its profile or a profile without its credential. *Flagged design point, Dev Team must resolve and document before building:* the database changes and the removal of the Supabase Auth credential are two systems; the chosen mechanism (for example, making the credential's removal the single operation that cascades through deliberately declared foreign-key actions, or another approach) must be written up in the sprint notes with why it cannot leave either half behind. Foreign-key actions used for this count as decided (P5) only because this requirement names each one's effect.
6. **After deletion.** The session ends and the player lands on the landing page showing `Your account has been deleted.` Any request using the old session is refused.
7. **Standards (NFR-3, NFR-6, NFR-7).** 320px, accessible names, visible focus, the field's error associated with it, the generic fallback on unexpected failure (and nothing changed), no unhandled rejections.
8. **Test-data cleanup (D-51).** Deletion gives LiveQA a sanctioned way to remove its own test accounts. LiveQA deletes the accounts it creates in this sprint, and lists any older test accounts that remain for the operator's final cleanup.

### Acceptance Criteria
1. LiveQA: the menu shows `Delete account`; the screen's copy is verbatim; `Cancel` returns to the profile with nothing changed.
2. QA1: tests for mismatch, empty field, case and whitespace variants, a reused token, a replayed request and a missing token. LiveQA: a wrong name shows the message; pressing Enter with a wrong name does nothing; after a successful deletion, using Back and resubmitting (or replaying the request from the network panel) is refused.
3. QA1: the handler derives the account from the session only; the service-role client is server-only and used after verification. LiveQA: searching the served JavaScript for the service-role variable name and key prefix finds nothing.
4. QA1: a database-level test with a player who has a round in progress, matches, a win record, best ranks and two ghost runs asserts after deletion: no round, match, win record, best rank or profile remains; both runs remain with no owner, unchanged outcomes and times, and display as `Deleted Player` with `avatar-1`; they remain eligible for matchmaking. A second test registers the freed name and asserts the new account owns no runs. LiveQA: create account A (`example.com`), finish a match, note its global rank, delete it; A can no longer log in; A's name can be registered by a new account B; A is gone from every board and ranks below it moved up; B's profile shows no matches.
5. QA1: the documented mechanism is read against a failure at each step; tests force the credential removal to fail and assert nothing was removed, and force a database step to fail and assert the credential still works and all data remains.
6. LiveQA: after deletion the landing page shows the message; the old session's cookies replayed (or the previous tab refreshed) do not reach any signed-in route.
7. LiveQA: keyboard-only deletion with visible focus; no horizontal scroll at 320px; no console errors.
8. LiveQA: the notes list every test account deleted and every remaining test account for the operator (D-51).

### Out of Scope
- Data export, admin deletion of other accounts, soft delete or recovery — PRD out of scope.
- Changing ghost-run storage beyond anonymising ownership (GHO-6).

### Dependencies
- Blocks: the rebuild's definition of done (PRD section 9).
- Blocked by: sprints 10 and 11 closed (every table the product uses exists).
- External: none.
- **Ready to build:** Requirements

### Team Assignments
- **Dev Team 1:** the whole sprint, in the main checkout.
- **Dev Team 2:** not assigned.

### Risks & Mitigations
- Two systems (Postgres and Supabase Auth) make true atomicity hard — requirement 5 makes the mechanism a documented design decision before building, with failure tests at each step.
- Cascading deletes that silently remove ghost runs would shrink every player's opponent pool — requirement 4 and acceptance 4 assert runs survive.
- A freed name re-registered by someone else could inherit the old player's identity on ghosts — runs link by identifier only, and acceptance 4 tests it.
