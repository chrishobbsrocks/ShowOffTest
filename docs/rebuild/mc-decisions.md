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
- **D-56 The operator sets production environment values in Vercel,** Production
  environment only, before Pipeman's first push: `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` (marked sensitive) and
  `NEXT_PUBLIC_SITE_URL` (the production URL). Preview deployments get none of them, so
  unaudited branch code never reaches the production database.

- **D-57 Errors are reported to the server logs, not a third-party service** (NFR-7).
  "Reports the error for diagnosis" means logging it where Vercel's runtime logs capture
  it (server) or the browser console (client). No error-tracking service, and so no
  extra environment variable, is added. The four variables in D-56 are the complete set;
  a sprint that finds it needs another one stops and raises it with Master Controller.

- **D-58 Sprint 1 LiveQA round 1's `/api/health` 503 was an operator configuration
  error, not a code defect** (recorded 2026-09-13). Vercel's production
  `NEXT_PUBLIC_SUPABASE_URL` had a `/rest/v1/` suffix, so every PostgREST call went to an
  invalid path (Vercel runtime log: `PGRST125` "Invalid path"). The operator corrected
  the value to the bare project URL and redeployed at about 15:18 UTC; production then
  returned 200 `{"ok":true,"database":true}`, confirmed in Supabase's own log. No code
  change was made or needed. **Decision:** the live-test loop continues as the
  lifecycle defines it — Pipeman reships sprint 1 (`/sprint-reship 1`, with the
  round 1 required fix, the production URL recorded in `CLAUDE.md`), and LiveQA runs
  round 2, which must itself observe the 200 on production and complete every item
  round 1 did not run. The sprint file stays exactly as QA1 audited it; an uncommitted
  Decision block added to it was discarded. **Lesson for later sprints:**
  `NEXT_PUBLIC_SUPABASE_URL` is the bare `https://<project-ref>.supabase.co`, with no
  path.

- **D-59 Sprint 1 LiveQA round 2's AC13 failure was an operator configuration error,
  not a code defect** (recorded 2026-09-13). Production Supabase had "Confirm email"
  on: the public auth settings endpoint reported `"mailer_autoconfirm": false`, so D-03
  and ACC-6 did not hold on production. The operator turned "Confirm email" off in the
  Supabase dashboard. No code change was made or needed, and no account was created to
  discover it. **Decision:** no reship. The shipped commit, `9924cb6`, is unchanged, and
  the sprint is still in `liveqa_live` with that commit recorded as last shipped, so
  LiveQA's round 3 retests it directly (`--deployed-commit 9924cb6`) and must itself
  observe `"mailer_autoconfirm": true` on production. **Lesson for later sprints:**
  confirm the production auth settings endpoint, not only the dashboard toggle, before
  any sprint's live test that creates accounts.

- **D-60 (target superseded by D-63) The splash logo is sized to the Figma Splash frame** (sprint 1 LiveQA round 3,
  finding 1; recorded 2026-09-13). In frame `Splash` (375 × 667), the logo layer
  `Group 91` is 173.45 × 125.74 px, centred. Production rendered it about 34–37% larger.
  **Decision:** Dev Team fixes it. At a 375 × 667 viewport the logo's lettering bounds
  (the `Group 91` box, not the SVG's own canvas, which includes drop-shadow margin)
  measure 173.45 × 125.74 px, within 2 px, centred horizontally and vertically. The
  logo is a fixed size, not scaled with the viewport, so it is the same size at 320 px
  and on desktop. The fix is a code change in the live-test loop: Dev Team commits it,
  Pipeman reships, and LiveQA runs round 4, re-checking AC7 at all three widths. The
  sprint file is not amended: AC7 already requires visual comparison with the frame.
- **D-61 In sprint 1's AC2, "exactly" means the same colour, not the same text**
  (LiveQA round 3; recorded 2026-09-13). A computed token value passes when it
  resolves to the same colour as `design-tokens.md`. Case, short hex (`#000` for
  `#000000`) and equivalent `rgb()` forms produced by the build are fine. A different
  colour fails. The same reading applies to every later criterion that compares
  computed token values.
- **D-62 `/api/health` gives the same answer to every caller, signed in or not**
  (QA1 sprint 1 non-blocking note (a); recorded 2026-09-13). `health_check()` stays
  executable by the anon role only; its grant is not widened. The route calls it with
  a client that carries no user session: it does not read, forward or refresh the
  caller's auth cookies. A signed-in caller therefore gets the same 200
  `{"ok":true,"database":true}` as anyone else. Sprint 1's shipped route uses the
  cookie-scoped server client, which is correct today because no sessions exist;
  sprint 2 carries the change (sprint 2 requirement 16). The same sprint also extends
  the no-literal-colour check to every application source directory, not only `app/`
  and `lib/` (QA1 note (b)).

- **D-63 The splash logo's size target, replacing D-60's** (sprint 1 LiveQA round 4;
  recorded 2026-09-13). Round 4 failed AC7 for two reasons. First, the logo was built
  as `w-[52.4%] max-w-60`, which scales with the viewport, where D-60 requires one fixed
  size. Second, D-60's target could not be met as written: the SVG's lettering has an
  aspect ratio of 1.342 and Figma's `Group 91` box 1.379, so width and height cannot
  both land within 2 px at a single scale. **Decision:** at every viewport width, the
  logo's lettering box is **173.45 px wide, within 2 px**, set as a fixed pixel size
  with no percentage, `max-width` or viewport-relative sizing; its height follows the
  SVG's own aspect ratio (about 129 px) and is not separately constrained. The
  lettering box is centred horizontally within 2 px. Vertically it may sit up to 5 px
  from centre, because the asset's drop-shadow margin sits below the letters. D-60's
  process stands: Dev Team commits the fix, Pipeman reships, and LiveQA runs round 5,
  checking AC7 at 320 px, 375 px and desktop. The sprint file is not amended.

- **D-64 Sprint 2's visual findings 4–6 stay in sprint 2, built from written frame
  specs** (sprint 2 LiveQA round 1; recorded 2026-09-14). Finding 4 (landing, 1.00),
  finding 5 (new-user home, 3.00) and finding 6 (log-out dialog, 8.14) are fixed in this
  sprint's live-test loop, not deferred. Dev Team has no Figma access, so before it
  starts, Master Controller writes exact specs for the three frames in `docs/design/`:
  layout, sizes, positions, colours (mapped to tokens where one exists), type, layer
  order, crops, and every asset each frame needs, with any asset the repository lacks
  exported from Figma into `public/`. Dev Team builds from those files, and LiveQA and
  QA1 check against them. A value that has no token is recorded in the spec with its
  hex, and Master Controller decides in the spec whether it becomes a new token
  (sprint 1's no-literal-colour rule still applies). Defects 1–3 (avatar picker
  overflow, missing avatar message, offline login crash) are ordinary code fixes and
  do not wait for the specs.
- **D-65 LiveQA creates its own test accounts** (recorded 2026-09-14). From sprint 2's
  round 2 on, LiveQA may create accounts on production itself, using `example.com`
  addresses only (D-03) and a freshly generated throwaway password per account, so live
  tests no longer need the operator to type a password. The account emails, and what
  each was used for, go in the live-test notes (D-51). **Passwords do not:** the
  repository `chrishobbsrocks/ShowOffTest` is public and the sprint state files are
  committed, so a password in the notes would let anyone sign in to production as that
  account. LiveQA keeps passwords only in `.liveqa/test-accounts.local`, which must be
  git-ignored before first use (Pipeman adds the ignore line), and deletes the file's
  entries once sprint 12 gives it a way to delete the accounts. The operator can reverse
  this safeguard and have passwords recorded in the notes instead. The existing
  `chris@example.com` account created by the operator stays the operator's.
- **D-66 Live-loop fixes get a QA1 audit before Pipeman reships** (recorded
  2026-09-14). When LiveQA fails or conditions a sprint and Dev Team commits a fix,
  QA1 audits that fix commit and records it with `/sprint-qa1` while the sprint is in
  its live-test phase (the lifecycle supports this as a live-loop audit), before
  Pipeman runs `/sprint-reship`. Pipeman reships only a commit QA1 has passed in that
  loop. `/sprint-reship` does not enforce this mechanically, so it is a process rule
  that Pipeman checks in `/sprint-status` before reshipping. It applies to sprint 2's
  current loop and every later one.

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
