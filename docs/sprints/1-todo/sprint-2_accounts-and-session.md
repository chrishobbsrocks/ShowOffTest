---
id: 2
title: "Accounts and session"
epic: "Show Off Rebuild"
status: todo
created: 2026-09-13T05:05:41+00:00
---

# Master Controller Sprint Definition — Sprint 2

**Epic:** Show Off Rebuild — rebuild the Show Off trivia game from `docs/rebuild/show-off-rebuild-prd.md` as a test of the Fully Completely harness.
**Sprint Objective:** A visitor can create an account, log in, stay signed in and log out, and every signed-in route is protected, with arenas defined once as data.

### Context
Nothing player-facing can be built until players exist (PRD 6.1). This sprint replaces sprint 1's splash with the landing page, and builds sign-up, log-in, session handling, log-out, the signed-in shell (tab bar, new-user home, a minimal profile) and the arena definitions every later screen reads. Password reset and profile editing are sprint 4.

Sources of record: PRD 6.1 (ACC), 6.8 (ARN-1 to ARN-3), 6.11 (SEC), section 7 (NFR); `docs/copy/screen-copy.md` (sections Global, Landing, Create account, Log in, Log out confirmation, New-user home, Starter opponents); `docs/design/design-tokens.md`; `docs/rebuild/mc-decisions.md` D-03, D-10, D-11, D-13, D-31, D-45. Figma frames 1.00–1.05, 2.01, 3.00, 8.14, and the `tab bar` component. No email is ever sent (D-03): test accounts use `example.com` only.

### Requirements
1. **Landing (ONB-1, D-13).** `/` shows frame 1.00 to signed-out visitors, with the copy in the Landing section; `Get started` goes to sign-up and `Log in` to log-in. A signed-in player visiting `/`, `/signup` or `/login` is sent to `/home`.
2. **Sign-up form (ACC-1, ACC-4).** `/signup` (frames 1.01–1.05) collects avatar, display name, email and password, with one password field and a show/hide toggle (D-10). The avatar picker follows the `Avatar picker` spec in `design-tokens.md` (ten avatars from `public/avatars/`, 68×68, horizontal scroll with snap, 2.5px accent selection ring) and its accessible name is `Choose your avatar.`
3. **One validation definition (ACC-2, D-11, D-31).** A single validation module, used by the browser and re-run by the server on every submission, and reused unchanged by sprint 4's profile editing:
   - display name: leading and trailing whitespace trimmed before validating and storing; 2–10 characters after trimming; not taken by any player, compared case-insensitively; not one of the reserved starter-opponent names in `screen-copy.md`, compared case-insensitively, which returns the same "already taken" message;
   - email: valid format and not already registered;
   - password: at least 8 characters;
   - avatar: one of the ten.
   All messages are verbatim from the copy file, and every failing field shows its message at once (1.05).
4. **Uniqueness is enforced by the database.** Case-insensitive display-name uniqueness is a database constraint, not only an application check, so two simultaneous sign-ups with `Doorak` and `doorak` cannot both succeed; the loser sees the "already taken" message.
5. **A failed submission keeps everything (ACC-3):** every typed value and the chosen avatar.
6. **All or nothing (ACC-5).** Creating the sign-in credential and the player's profile record either both succeed or both leave no trace. If the profile cannot be created, no credential remains, and retrying with the same email succeeds rather than reporting it as already registered.
7. **No email, immediate access (ACC-6, D-03).** A new account is signed in and usable at once. Nothing in sign-up causes an email to be sent.
8. **Profile record and row security (SEC-2, SEC-3, PRO-9).** Each player has a profile record holding display name, avatar, a tutorial-completion field (empty until sprint 11) and creation time. Row Level Security lets a signed-in player read only their own profile and update only their own display name, avatar and tutorial completion; no other column is writable from the browser, and no player can read another player's row or anyone's email.
9. **Log in (ACC-7).** `/login` (frame 2.01). Wrong email or wrong password shows exactly `Incorrect email or password.` Any other failure, such as the network being down, shows the generic fallback, never the credentials message. `Forgot Password?` is shown but inert until sprint 4 (it may be omitted if the team prefers; it must not lead anywhere broken).
10. **Session (ACC-10).** A signed-in session survives a reload. Every server action or route handler that acts for a player takes the player from the verified session only (P3, SEC-1). Signed-out visitors to `/home`, `/play`, `/profile`, `/leaderboard` or `/tutorial` are sent to `/login`; after logging in, a player always lands on `/home` (no redirect parameter is followed).
11. **Signed-in shell (D-45).** Signed-in routes show the tab bar (`Home`, `Leaderboard`, `Profile`) with the current tab marked. `/home` is the new-user home, frame 3.00, for every player in this sprint, with copy from its section and host image `public/host/host-01-neutral.png` cropped as in the frame; `Let’s play` goes to `/play` and `See how it works` goes to `/tutorial`. `/play` and `/leaderboard` render the tab bar and background only. `/tutorial` redirects signed-in players to `/home` until sprint 11.
12. **Minimal profile and log out (8.14).** `/profile` shows the player's avatar, display name and `Showing off since` date (format `MMM D, YYYY`, taken from the profile's creation time in UTC), and `Log out`. `Log out` opens the 8.14 confirmation; `Cancel` closes it; confirming ends the session, and the session stays gone after a reload.
13. **Arenas defined once (ARN-1, ARN-2, ARN-3).** A single arena definition holds, for each of the six tiers: tier number, name, label (`Arena 1 · Warm Up` and so on), trophy threshold (0, 200, 600, 1200, 2000, 3000), badge path, tag path and background. The six backgrounds from PRD Appendix B are CSS custom properties in the token stylesheet, referenced from the arena definition by name (sprint 1's no-literal-colour check still passes). One function returns a player's arena from a trophy total; a total exactly on a threshold is in the higher arena. No threshold or label is written anywhere else; the new-user home's arena label reads from it.
14. **Design values and accessibility (NFR-2, NFR-3, NFR-6).** Inputs are 44px tall with an 8px radius, buttons 52px with a 10px radius, a focused input's border uses `--color-accent`, and error text uses `type-error` in `--color-error-text`, placed below its field. Every control has an accessible name, keyboard focus is always visible, and each error message is programmatically associated with its field. Every screen in this sprint works from 320px wide.
15. **No silent failures (NFR-7).** Any failed action shows its own message or the generic fallback and reports the error for diagnosis; no unhandled promise rejection reaches the console.
16. **Health check ignores sessions (D-62).** `/api/health` calls `health_check()` through a client that carries no user session and never reads, forwards or refreshes auth cookies, so a signed-in caller gets exactly the same response as a signed-out one. `health_check()`'s grant stays anon-only. The no-literal-colour check from sprint 1 scans every application source directory (including any `components/` or similar added in this sprint), not only `app/` and `lib/`.

### Acceptance Criteria
1. LiveQA: signed out, `/` shows 1.00 with exactly the Landing strings and no Terms line; both links work. Signed in, `/`, `/signup` and `/login` land on `/home`.
2. QA1: the picker renders ten avatars from `public/avatars/` with the spec's sizes, snap and ring from tokens, and the accessible name. LiveQA: at 320px all ten avatars are reachable by scrolling and by keyboard, and the selected one shows the ring.
3. QA1: one module holds the rules; both the form and the server handler import it; no rule is duplicated. Unit tests cover: 1, 2, 10 and 11 characters; surrounding whitespace; case-insensitive clash; each reserved name in two different cases; bad and taken email; 7 and 8-character passwords; missing avatar; and all errors reported together. LiveQA: submitting `M`, `Mojito123456`, `mojojojo\\` and no avatar together shows all four design messages at once.
4. QA1: a migration creates the case-insensitive unique constraint. An automated test (or a documented database test) shows a second insert differing only in case is rejected, and the server maps that rejection to the "already taken" message.
5. LiveQA: after a failed submission, every field and the avatar selection are still filled.
6. QA1: the creation path is read line by line for a state that leaves a credential without a profile; an automated test forces the profile step to fail and asserts no credential remains and the same email can then register.
7. LiveQA: a new `example.com` account reaches `/home` immediately after `Create account`. QA1: no code path in this sprint calls an email-sending API.
8. QA1: migration policies read, and an automated test using the browser's (anon/authenticated) database role shows: reading another player's profile returns nothing; updating one's own trophy-like or non-writable columns is refused; updating another player's display name is refused.
9. LiveQA: wrong password and unregistered email both show exactly `Incorrect email or password.`; with the network disabled in dev tools, submitting shows `Something went wrong. Try again.`
10. LiveQA: reload keeps the session; signed out, each of the five routes redirects to `/login`; `/login?next=https://example.com` still lands on `/home` after log-in. QA1: every player-acting handler gets the user from the verified session and never from the request body or query.
11. LiveQA: tab bar present and correct on `/home`, `/play`, `/profile`, `/leaderboard`; `/home` matches 3.00 with verbatim copy; both buttons navigate as specified; `/play` and `/leaderboard` contain no text other than the tab bar.
12. LiveQA: profile shows avatar, name and a correctly formatted date; Log out → Cancel keeps the session; Log out → `Log out` ends it, and a reload stays signed out.
13. QA1: exactly one arena definition exists; searching the source for `200`, `600`, `1200`, `2000`, `3000` and each arena name finds them only there (and in tests). Unit tests cover 0, 199, 200, 599, 600, 2999, 3000 and 100000. The six background properties match Appendix B.
14. QA1: sizes, radii and colours come from tokens. LiveQA: keyboard-only sign-up and log-in are possible with visible focus throughout; a screen reader announces each error with its field; every screen in this sprint has no horizontal scroll at 320px.
15. LiveQA: the console shows no errors or unhandled rejections through every flow tested above.
16. LiveQA: every account created is listed in the live-test notes (D-51).
17. QA1: the health route's client carries no session and the `health_check()` grant is unchanged; an automated test calls the route with a valid signed-in session cookie and asserts 200 `{"ok":true,"database":true}`. The no-literal-colour check's scanned paths cover every source directory. LiveQA: while signed in, `GET /api/health` returns 200 `{"ok":true,"database":true}`.

### Out of Scope
- Password reset, set new password, profile editing and change password — sprint 4.
- Profile statistics and zero states — sprint 9. Arena home for returning players — sprint 8.
- Tutorial content — sprint 11. Matchmaking and rounds — sprints 5 and 6.
- Google sign-in, Terms and Privacy, changing email — PRD out of scope.

### Dependencies
- Blocks: sprints 4, 5 and everything after.
- Blocked by: sprint 1 closed.
- External: none beyond sprint 1's Supabase and Vercel setup. Runs in parallel with sprint 3.
- **Ready to build:** Requirements

### Team Assignments
- **Dev Team 1:** the whole sprint, in the main checkout.
- **Dev Team 2:** not assigned (building sprint 3 in its own worktree). Sprint 3 owns only the question-bank module, its data files and its own migrations. Neither sprint edits the other's files. Both may add migrations (distinct timestamps) and dependencies; where `package.json` or the lockfile conflict at merge, Pipeman resolves it and neither team reformats shared config files.

### Risks & Mitigations
- Supabase Auth and the profile insert are two systems, so "all or nothing" is easy to get subtly wrong — requirement 6 and its forced-failure test.
- Session handling in the Next.js 16 App Router (server components, route handlers, middleware or its replacement) differs from older guides — verify against the installed version's documentation; QA1 checks every handler takes the player from the session.
- A reserved-name check done only in the browser is bypassable — requirement 3 requires the server to re-run the same module.
