---
id: 4
title: "Profile editing and password reset"
epic: "Show Off Rebuild"
status: todo
created: 2026-09-13T05:05:42+00:00
---

# Master Controller Sprint Definition — Sprint 4

**Epic:** Show Off Rebuild — rebuild the Show Off trivia game from `docs/rebuild/show-off-rebuild-prd.md` as a test of the Fully Completely harness.
**Sprint Objective:** A player can edit their avatar and display name, change their password, and reset a forgotten password, all under the same rules as sign-up.

### Context
Sprint 2 created accounts and one shared validation module. This sprint adds every remaining way an account's details change: editing profile details (PRO-7), changing the password while signed in (PRO-8), and the forgotten-password flow (ACC-8, ACC-9). They share password rules and the profile screen's edit menu, and none touches game data, so the sprint runs in parallel with sprint 5.

No email may be sent (D-03), so the reset email and the link in it are never exercised live (D-14, accepted gap). The set-new-password screen has no design frame and is built from 8.12's layout (D-12). Sources of record: PRD 6.1 (ACC-8, ACC-9), 6.2 (PRO-7 to PRO-9), 6.11; `docs/copy/screen-copy.md` sections Password reset request, Set a new password, Profile (edit menu), Edit profile and update password; Figma 2.02–2.04, 8.10–8.13, 8.15; D-10 to D-14.

### Requirements
1. **Edit menu (8.15).** The profile shows the design's edit (pencil) control beside the avatar. It opens the 8.15 menu with `Edit profile`, `Update password` and `Cancel`. (`Delete account` is added in sprint 12.)
2. **Edit profile (PRO-7, 8.10–8.11).** Shows the avatar picker and display name, pre-filled with the current values. Saving validates with sprint 2's shared module, unchanged, on the browser and again on the server. A player saving their own current name unchanged succeeds, including when only its letter case changes (`Doorak` to `doorak` for the same player). A failed save shows the design messages, keeps what was typed and the selected avatar, and changes nothing stored. `Cancel` returns to the profile without saving. A successful save returns to the profile showing the new values.
3. **Update password (PRO-8, 8.12–8.13).** Current password, new password and confirm. The server verifies the current password before changing anything; a wrong one shows `Invalid password`. The new password must be at least 8 characters (`Need at least 8 characters.`) and match the confirmation (`Passwords need to match`). Success shows `Your password has been updated.` and the player stays signed in.
4. **Writes go through the session (P3, SEC-1, PRO-9).** Every edit takes the player from the verified session. Nothing in this sprint widens what a player can write: only their own display name and avatar change through editing.
5. **Request a reset (ACC-8, 2.02–2.04).** `Forgot Password?` on log-in opens `RESET PASSWORD`. Submitting a validly formatted email shows `CHECK YOUR INBOX` with the design copy, identically whether or not the email is registered: same screen, same copy, and no difference in the response body, status code or noticeable timing that reveals registration. A malformed email shows `Invalid email address.` `Go back to Log in` returns to log-in.
6. **Set a new password (ACC-9, D-12).** A route reached from the reset link:
   - a valid link shows the `SET NEW PASSWORD` form (new password and confirm, sign-up's rules, `Save changes`);
   - a used, expired, missing or malformed link never shows a working form, and shows `This reset link has expired or has already been used.` with `Request a new reset link`, which opens the request screen;
   - on success the player is taken to log-in, which shows `Your password has been updated.`, and the old password no longer works;
   - the reset link's redirect target is the production site. *Flagged assumption, Dev Team must verify against the installed Supabase library and current Supabase documentation before building on it:* the exact link format and code or token exchange Supabase uses for password recovery, and the Auth URL configuration (site URL and redirect allow-list) it requires. Any dashboard setting needed is written up for the operator to apply.
7. **No email in tests (D-03, D-14).** Automated tests mock the Supabase auth client for the reset request with a registered address, and for valid, used and expired links. No role submits the reset form with a registered address anywhere.
8. **Design values, accessibility and errors (NFR-2, NFR-3, NFR-6, NFR-7).** Same standards as sprint 2 apply to every screen here: token-based sizes, visible focus, errors associated with fields, 320px width, the generic fallback for unexpected failures, no unhandled rejections.

### Acceptance Criteria
1. LiveQA: the pencil opens the menu with exactly the three items; `Cancel` closes it.
2. QA1: the edit handler imports sprint 2's validation module with no duplicated rule. Unit tests cover unchanged own name, own name with case change, another player's name in a different case (rejected), a reserved name (rejected), too short and too long, and a failed save leaving the stored profile unchanged. LiveQA: rename an `example.com` account and change its avatar; both show on the profile after a reload; trying a name another test account holds shows the taken message and keeps the typed values.
3. LiveQA: wrong current password shows `Invalid password`; a 7-character new password and a mismatched confirmation each show their message; a valid change shows the success message, and logging out and back in works only with the new password.
4. QA1: every handler takes the user from the session; an automated test shows a request naming another player's id changes only the signed-in player's own record (or is refused).
5. QA1: tests show the registered and unregistered paths return an identical response and render identical output. LiveQA: submitting two different unregistered `example.com` addresses shows the identical `CHECK YOUR INBOX` screen; a malformed address shows the design message. No registered address is submitted.
6. QA1: tests with the auth client mocked cover valid, used, expired, missing and malformed links, asserting only the valid case renders form inputs, and success leads to log-in with the message. Dev Team's notes record how the flagged assumption was verified and any operator setting applied. LiveQA: opening the set-new-password route with no link parameters and with a garbage token shows the expired message and a working `Request a new reset link`, and never a password field.
7. QA1: no test or code path sends a reset email to a real address; the mocks are in place.
8. LiveQA: keyboard-only use, visible focus and field-associated errors on all five screens; no horizontal scroll at 320px; no console errors. Test accounts created or changed are listed in the notes (D-51).

### Out of Scope
- Profile statistics — sprint 9. Account deletion — sprint 12.
- Changing email — PRD out of scope.
- Signing out other sessions after a password change — not required by the PRD.
- Live end-to-end test of the reset email and link — impossible without sending email (D-14).

### Dependencies
- Blocks: sprint 9 (builds on the profile screen) and sprint 12 (adds to the edit menu).
- Blocked by: sprint 2 closed.
- External: the operator applies any Supabase Auth URL settings Dev Team identifies. Runs in parallel with sprint 5.
- **Ready to build:** Requirements

### Team Assignments
- **Dev Team 1:** not assigned (building sprint 5).
- **Dev Team 2:** the whole sprint. Run `/sprint-worktree 4` before building and work only in that worktree. This sprint owns the profile screen's edit menu and edit screens, the log-in screen's reset link, and the reset and set-new-password routes. It does not touch `/home`, `/play`, matchmaking or the database tables sprint 5 creates. It imports sprint 2's validation module without changing it; if a change seems necessary, stop and raise it with Master Controller.

### Risks & Mitigations
- Supabase's recovery flow has changed across library versions — requirement 6 flags it as an assumption to verify, not a fact.
- "Identical whether registered or not" is easy to break with an error branch or a timing difference — requirement 5 and its tests.
- The reset flow can't be tested live end to end — accepted gap (D-14); QA1 and mocked tests carry that coverage, and LiveQA tests every part reachable without email.
