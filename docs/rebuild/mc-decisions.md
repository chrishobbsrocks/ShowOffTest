# Show Off rebuild — Master Controller decisions

Decisions made where the PRD (`docs/rebuild/show-off-rebuild-prd.md`) was silent,
or where the PRD and the Figma design disagreed. Each is final unless the
operator reverses it. Sprint files cite these by ID. Where a decision overrides a
PRD requirement, the requirement ID is named.

Recorded 2026-09-12 unless stated.

## Authorities

- **D-01 Inputs.** `docs/design/design-tokens.md`, `docs/copy/screen-copy.md`,
  `docs/design/sample-questions.json`, `docs/design/character-sheet.md` and
  `docs/public/` (moved to `public/` in sprint 1) are the carried-over inputs.
  `screen-copy.md` and `character-sheet.md` were cleaned of previous-build history.
- **D-02 Live Figma beats the copy inventory where the inventory lacks a string**
  (for example `Get started` on 1.00, and input placeholders). Master Controller
  records each such string in `screen-copy.md` before the sprint that needs it.
- **D-03 No email is sent or tested, by any role, anywhere.** See `CLAUDE.md`,
  "Show Off rebuild standards". Supabase "Confirm email" is off.

## Accounts

- **D-10 Sign-up has one password field with a show/hide toggle, no confirm field.**
  Follows the design. Overrides ACC-2's "the two entries must match" for sign-up only.
  Change password (8.12/8.13) keeps its confirm field.
- **D-11 Password minimum is 8 characters everywhere.** The design's "min 6"
  placeholders on 1.01 and 2.01 are design slips; the design's own validation table
  and 1.02/8.12 say 8.
- **D-12 The set-new-password screen (ACC-9) has no design frame.** It is built from
  the 8.12 layout: new password and confirm fields, with GAP heading and button
  copy recorded before the accounts sprint.
- **D-13 Landing button reads `Get started`** (live Figma), not "Sign up" as ONB-1 quotes.
  The Terms line and version string are omitted (PRD scope). Google sign-in is omitted.
- **D-14 Password reset is not verified live.** No reset email can be sent (D-03).
  ACC-8 is verified by automated tests with the auth client mocked, plus QA1's code
  review, plus LiveQA submitting only unregistered `example.com` addresses. ACC-9's
  link handling is verified by automated tests and QA1 only. Accepted gap: the reset
  email and link are never exercised end to end on production.

## Profile, streaks and results

- **D-20 "Streak" means consecutive match wins** everywhere it is shown (profile, home,
  opponent card, win screen). Overrides PRO-4's correct-answer definition. The
  in-round scoring bonus (SCO, +50 per correct answer at position 3+ of a correct run)
  is unchanged.
- **D-21 A streak is only shown once it reaches 3.** Below 3 it displays 0.
  "Best streak" is the highest displayed streak ever reached (so it is 0 or ≥3).
- **D-22 A loss resets the streak to 0. A draw changes nothing:** no trophy change,
  and the streak count neither rises nor falls.
- **D-23 Profile shows the PRD's PRO-1 fields only.** The design's Perfect games,
  trophy-history chart and win-rate delta are not built. Trophies shown are the
  current stored total (LDB-6), not "highest".
- **D-24 The home screen per arena shows the design's stats** (current winning streak,
  total wins, total losses, win rate) and a progress bar whose ends are the PRD's
  arena thresholds, not the design's figures.

## Rounds and opponents

- **D-30 There are no solo rounds.** Every round is played against a ghost.
  Overrides SCO-5 and the solo branch of GHO-2 and RND-1.
- **D-31 Starter opponents are seeded.** About 20 pre-made ghost runs over reviewed
  questions, with a spread of scores and speeds, display names (2–10 characters, from
  a list Master Controller records in `screen-copy.md`) and avatars from the ten.
  They are raceable like any ghost, never modified, never on leaderboards, cannot
  sign in, and their names are reserved so no player can register them.
- **D-32 If no usable ghost exists,** the player sees a GAP error instead of a round.
  The string is recorded before the ghost sprint.
- **D-33 The opponent card (5.00/5.01) shows avatar and name only.** The design's
  opponent trophies, streak and win rate are not shown (GHO-5).
- **D-34 The in-round opponent score ("THEY: … pts") is shown,** cumulative only over
  questions the player has already had graded. The ghost's result for a question is
  revealed at the same moment as the player's own (P2 holds).
- **D-35 Questions have no category.** The design's category slot (`POP CULTURE`)
  shows the question's setup line instead, beside `Q n/10`.
- **D-36 Questions are test content.** The review gate (QB-4) is enforced mechanically,
  but QB-5's content-quality rules are not audited. Review records may name an agent
  session as the reviewer.
- **D-37 The arena-unlocked modal (4.01–4.05) has no dismiss control in the design.**
  A GAP `Continue` button is added, recorded before the arenas sprint.
- **D-38 RND-14's correct-answer count appears on the result screen** (`n/10 CORRECT`,
  from the server's record). Frame 6.05 is the feedback for question 10, not a separate
  summary screen.
- **D-39 Pre-match host lines depend on the player's record:** no matches, displayed
  streak ≥3, or otherwise. Strings in `screen-copy.md`.
- **D-46 An unanswered question shows its own feedback state** (`TIME'S UP!`), with the
  fact, and still needs `Next question`, like a wrong answer.
- **D-47 `See result` after question 10 submits the round** (RND-12). There is no separate
  submit control.
- **D-48 The `+ n pts` indicator during a question is the speed bonus still available**,
  `round(100 × max(0, 15000 − elapsed_ms) / 15000)`, counted down from the server's
  delivery time. The warning state (6.02) starts at 5,000 ms left.

## Delivery

- **D-50 Migrations reach production through Supabase's GitHub integration** on push
  to `main`. Supabase Branching stays off (one production database, PRD section 4).
  Migrations are forward-only once applied.
- **D-51 Test data cleanup.** LiveQA records every account and row it creates in each
  sprint's live-test notes. The operator runs the final cleanup at the end of the
  rebuild (PRD section 9).
- **D-52 Two sprints may run in parallel,** Dev Team 1 in the main checkout and Dev
  Team 2 in its own worktree (`/sprint-worktree <N>`), only where Master Controller has
  checked the two sprints' Dependencies for overlap.

- **D-53 Development and automated database tests use a local Supabase** (Supabase
  CLI with Docker), with migrations applied locally before they are pushed. CI runs the
  same local stack. No production key is used for development or testing.
- **D-54 LiveQA may view the Supabase dashboard, Vercel and GitHub Actions read-only,**
  in the operator's logged-in Chrome, to verify live-test criteria. It never changes a
  setting, runs SQL that writes, or copies a secret.
- **D-55 A push to `main` that auto-deploys to Vercel is not a release publish** for
  this project. Pipeman pushes once QA1 has passed, without asking the operator
  (operator decision, 2026-09-12). Closing a sprint still requires the operator's
  real-time word, unchanged.
- **D-56 The operator sets production environment values in Vercel** from the variable
  names Dev Team 1 lists in sprint 1's `.env.example`, before Pipeman's first push.

## Leaderboards and onboarding

- **D-40 Any arena's leaderboard can be browsed** from the design's carousel
  (global plus A1–A6), each showing its LDB-8 tile state and a top-3 podium.
  Extends LDB-2.
- **D-41 The tutorial follows the design:** a two-card modal over the new-user home,
  titled `TROPHIES DON'T LIE` and `KNOWING ISN'T ENOUGH`, each with `Got it`. Closing
  the second card completes the tutorial and returns to home. Overrides ONB-3's step-1
  quote and ONB-5's "Continue into a first match".
- **D-42 The profile shows the current arena** (arena tag and label) under the
  member-since line, styled like the arena label on the home screen. The design has no
  arena on the profile; PRO-1 requires it.
- **D-43 The tutorial lives at `/tutorial`,** rendered as the modal over the new-user
  home, opened by `See how it works`. It is never shown automatically. Once completed,
  `See how it works` is no longer shown and `/tutorial` redirects to home.
- **D-44 Account deletion** is reached from the profile edit menu (`Delete account`), on
  its own screen. Deleting requires typing the player's current display name
  (case-insensitive) and pressing `Delete my account`. The request carries a single-use
  confirmation token issued when the screen loads; a replayed or reused token is refused.
- **D-45 Until their features exist, signed-in routes are shells.** From sprint 2,
  signed-in players land on `/home` (the new-user home). `/play` and `/leaderboard` exist
  as protected routes that render the tab bar and background only, with no invented copy,
  until the sprints that build them.

## Sprint plan (2026-09-12)

| Sprint | Scope | Team | Parallel with |
|---|---|---|---|
| 1 | Foundation | Dev Team 1 | — |
| 2 | Accounts and session | Dev Team 1 | 3 |
| 3 | Question bank | Dev Team 2 | 2 |
| 4 | Profile editing and password reset | Dev Team 2 | 5 |
| 5 | Opponents and match start | Dev Team 1 | 4 |
| 6 | Round play | Dev Team 1 | — |
| 7 | Scoring, submission and results | Dev Team 1 | — |
| 8 | Arenas, promotion and best rank | Dev Team 1 | 9 |
| 9 | Profile record | Dev Team 2 | 8 |
| 10 | Leaderboards | Dev Team 1 | 11 |
| 11 | Tutorial | Dev Team 2 | 10 |
| 12 | Account deletion | Dev Team 1 | — |
