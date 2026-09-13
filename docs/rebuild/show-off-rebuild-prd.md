---
title: Show Off Rebuild PRD
subtitle: Everything a fresh team needs to rebuild Show Off, the head-to-head trivia game on a six-arena trophy ladder, as a controlled test of the Fully Completely harness.
Version: 1.0
Date: 11 September 2026
Status: Ready for decomposition
Stack: Next.js 16 · Supabase · Vercel
Scope: Full feature set, no Terms or Privacy
Audience: The rebuild's Master Controller
---

## 1. What this is

Show Off is a trivia game. A player answers ten timed multiple-choice questions against a *ghost*: another player's recorded run over the same ten questions. Correct and fast scores more, and the higher score wins trophies. Trophies move the player up six arenas, and leaderboards rank everyone.

This document is the product requirements for **rebuilding Show Off from scratch as a test of the Fully Completely sprint harness**. The product is not being launched. It exists so the harness has a real, non-trivial application to run through its full lifecycle, and so the result can be compared against a previous build of the same product.

The comparison measures two things:

- **Whether a fully decided plan ships with less rework.** Every product decision the previous build had to discover mid-flight is written down here as a requirement. Sprints should not stall on missing inputs, undefined mechanisms or unmade decisions.
- **Whether the harness's gates catch implementation defects.** This document says what must be true. It does not describe how anything went wrong before, deliberately.

### Rules of engagement

- **Build in a new repository, against a new Supabase project and a new Vercel project.** Nothing is shared with the previous build's infrastructure.
- **No role consults the previous implementation.** That means its code, sprint files, lifecycle state, test notes and the project standards in its `CLAUDE.md`. The inputs listed in section 4 are the only things carried over.
- **Install Fully Completely fresh at its current published version.** Start `CLAUDE.md`'s project-standards section empty, apart from the stack facts in section 4. Standards the team learns during this build are written there as they are learned.
- **An evaluation key exists and is held by the operator.** Do not look for it or ask for it. It describes the previous build's failures, and seeing it would invalidate the comparison.
- **Where this document is silent, the rebuild's Master Controller decides and records the decision in the sprint file.** Do not reverse-engineer the previous build to find out what it did.

## 2. The product on one page

A match is one round of ten questions, played against one ghost.

1. The player opens Play. The game finds an opponent: a stored run by another player. It shows the opponent's avatar and name, then counts down from three.
2. The ten questions arrive one at a time. Each has four options and a 15-second clock. After each answer the player sees whether they were right, plus a short fact about the question.
3. At the end, both runs are scored by the same rules. Correct answers earn points, faster correct answers earn more, and a run of three or more correct in a row earns a bonus.
4. The higher score wins. A win adds trophies and a loss removes some. Enough trophies promotes the player to the next arena, with a celebration screen.
5. The player's profile shows their record. Leaderboards rank everyone by trophies, and arena tiles show which arenas the player has reached, conquered or not yet unlocked.

The host's voice is sardonic and short. The copy is part of the product, not placeholder text.

**Audience.** This is a test harness with no real users, no launch, no monetisation and no legal exposure. Accounts exist for the operator and for testing. Some requirements below would change for a real launch, and they are marked where that matters.

## 3. Scope

### In scope

| Area | Covers | Section |
|---|---|---|
| Accounts | Sign up, log in, password reset, session, log out | 6.1 |
| Profile | Record and stats, zero states, editing avatar and name, changing password | 6.2 |
| Account deletion | Self-service deletion, with every consequence for other players decided | 6.3 |
| Question bank | Schema, offline generation, review gate, delivery rules | 6.4 |
| Rounds | Ten questions, delivered one at a time and timed by the server | 6.5 |
| Scoring and trophies | Points, streaks, ties, trophy changes, result screens | 6.6 |
| Ghost opponents | Storing runs, choosing an opponent, pre-match screens | 6.7 |
| Arenas | Six arenas, thresholds, promotion, the home screen per arena | 6.8 |
| Leaderboards | Global and current-arena boards; locked, current and archived arena tiles | 6.9 |
| Onboarding | Landing, new-user home, two-step tutorial | 6.10 |
| Security and integrity | Session checks, server-held results, what the browser may see | 6.11 |

### Out of scope

| Excluded | Why |
|---|---|
| Terms of Service and Privacy pages | No real legal text exists, and the product has no launch. The design's footer links and consent line are omitted entirely rather than pointed at empty pages. |
| Google sign-in | Email and password only. |
| Changing email address | Not designed. |
| Leaderboard Weekly / Monthly / All-time tabs | Present in the design; deferred, not dropped. This build ships the all-time board only. Adding time periods changes every ranking query, and belongs in its own sprint. |
| Skipping the tutorial | The design has no skip control and no copy for one. Leaving is done by not choosing the tutorial at all (see 6.10). |
| Host character animation | The design's character sheet describes ten expressions, but their format and rigging are undecided. |
| Seasons or closing arenas | "Archived" means an arena the player has reached and is not currently in. Nothing closes. |
| Question difficulty by arena | Questions carry an arena tier as data. Nothing selects on it. |
| Skill- or arena-based matchmaking | Opponents are chosen at random (see 6.7). |
| Rate limiting, abuse controls, data export, admin tools | By decision, for a harness with no public users. |

## 4. Inputs supplied

These are carried over from the previous build and are the only things that are. Copy them into the new repository at the same paths.

| Input | Path or location | What it is |
|---|---|---|
| Design | Figma file `pKPcNRMWgms1Y6L80jdGNV`, pages `Game UI`, `_Design System`, `Character sheet` | Every screen. Frame numbers are listed in Appendix A. |
| Design tokens | `docs/design/design-tokens.md` | 17 tokens: colours, radii, shadows, input padding, border width, and the two typefaces. |
| Copy | `docs/copy/screen-copy.md` | The 233-string inventory captured from Figma, the authority markings, the house error pattern, and the GAP process. |
| Sample questions | `docs/design/sample-questions.json` | Ten questions. This is the format of record for the question bank. |
| Assets | Exported from Figma. The previous build's `public/` image files may be copied as files; no code comes with them. | Ten avatars, six arena badges, arena background art. |


### Stack facts

| Item | Value |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, with every design token exposed by name |
| Data and auth | Supabase: Postgres, Row Level Security, Auth with email and password |
| Hosting | Vercel, with production built from `main` |
| Runtime | Node 24.x |
| Tests | Vitest with Testing Library, using jsdom |
| Typefaces | Bebas Neue for display text only; Space Grotesk at weights 400 and 500 for everything else |
| Hosted database | One Supabase project serves production. There is no per-branch database. |
| Credential holder | Chris Hobbs provisions and holds every secret and account credential. |

### Copy authority

Every visible string has exactly one of three sources, marked in `docs/copy/screen-copy.md`:

- **DESIGN**: text captured from Figma, reproduced exactly, including punctuation and letter case.
- **GAP**: a string the design lacks, written by Master Controller in the house pattern and recorded *before* the sprint that needs it is built.
- **CHROME**: page titles and accessible labels, written by Dev Team.

No string is invented anywhere else. The house error pattern is a plain declarative sentence in sentence case, ending with a full stop. Add a second sentence only when the way forward is not already on screen.

These GAP strings are already known to be needed. Record each one before its sprint.

- A generic fallback error for any failure without its own message.
- The account-deletion screen: warning, confirmation and completion text. The design has no deletion frame.
- The draw result (section 6.6). The headline `DEAD HEAT.` and body `Same score. Same speed. Nobody moves.` are decided here; record them.
- Tutorial controls: *Next* and *Continue*, plus the tutorial's save-failure message and retry label.
- Any other string a sprint finds missing. Check it against the inventory first, and route a truly missing *screen* back to the design owner rather than writing copy for it.

## 5. Principles

These apply to every section that follows. Where a requirement seems to conflict with one of them, the principle wins, and Master Controller records the conflict.

> **P1. The server decides every result.** Which questions a round contains, which answer is correct, how long an answer took, the score, the winner, the trophy change and the rank are all established on the server. The browser displays them; it never supplies them.

> **P2. No answer reaches the browser before its question is graded.** That covers the correct option, any index or ordering that reveals it, and the fact text, which often gives the answer away.

> **P3. The signed-in session identifies the player.** On the server, every request that acts for a player takes the player from the verified session, never from anything the request says about itself.

> **P4. Every reward a player sees was actually awarded by what they just did.** No screen shows trophies, promotions or results that the server did not record for that action.

> **P5. Irreversible operations are fully decided in advance.** Account deletion is the only one. Its consequences for other players are decided in section 6.3, not left to the database's defaults.

> **P6. The copy and tokens are the design's.** Strings are reproduced exactly, tokens are used by name, and no literal colour or size appears in a component.

## 6. Requirements

Each requirement has a stable ID for sprint files to reference. Where a requirement records a decision someone had to make, the decision is stated with its reason, so it is not re-litigated mid-build.

### 6.1 Accounts (ACC)

Screens: 1.01–1.05 create account, 2.01 log in, 2.02–2.04 password reset.

- **ACC-1 Sign up** with display name, email, password and avatar.
- **ACC-2 Validation.** All error text comes verbatim from the copy file.
  - Display name: 2–10 characters, and not already taken. Uniqueness ignores letter case: `Doorak` is taken if `doorak` exists.
  - Password: at least 8 characters, and the two entries must match.
  - Email: a valid address that is not already registered.
  - Avatar: required. Message: "Please choose an avatar."
  - Several errors can show at once (screen 1.05).
- **ACC-3 A failed submission keeps everything typed** and the chosen avatar.
- **ACC-4 Avatar picker:** ten avatars, 68×68, with the selection shown as a 2.5px ring in the accent colour. The picker's accessible name is "Choose your avatar."
  - The design shows individual avatars, not a scrolling container. How ten avatars fit at 320px wide is the team's decision, recorded in its sprint file.
- **ACC-5 An account is created completely or not at all.** If the player's profile record cannot be created, no sign-in credential may be left behind. Retrying with the same email must then work, not report the email as already registered.
- **ACC-6 Sign-up sends no confirmation email.** Accounts work immediately. This is decided for a harness; a real launch would revisit it.
- **ACC-7 Log in.**
  - Wrong credentials show a message that does not say which field was wrong: "Incorrect email or password." (GAP).
  - Any other failure, such as being offline, shows the generic fallback, not the credentials message.
- **ACC-8 Request a password reset.** The confirmation screen and its copy are identical whether or not the email is registered.
- **ACC-9 Set a new password from the emailed link.**
  - The new password has the same rules as sign-up.
  - A valid link always shows the form.
  - A used or expired link never shows a working form. It shows "This reset link has expired or has already been used." with a way to request a new link.
  - The link works on the production site.
- **ACC-10 Session.**
  - A signed-in session survives a reload.
  - Log out asks for confirmation (screen 8.14), and after it the session is gone, including after another reload.
  - A signed-out visitor who opens Play, Profile, Leaderboard or Tutorial is sent to log in.

### 6.2 Profile (PRO)

Screens: 8.01 returning player, 8.07 new player, 8.10–8.13 editing.

- **PRO-1 The profile shows:**
  - avatar and display name;
  - trophies and current arena;
  - win rate;
  - current streak and best streak;
  - member-since date, formatted "Showing off since Apr 1, 2026".
- **PRO-2 Every field has a zero state** for a player with no matches. The copy is "Play your first match to start building your record" and "Fresh start. Clean record".
- **PRO-3 Win rate** is a whole percentage.
  - 100% only when every match was won.
  - 0% only when none was.
  - Any other record shows 1–99%, never rounded to the extremes.
  - Win rate is never blank or "NaN".
- **PRO-4 Streaks.**
  - A match's streak is its longest run of consecutive correct answers.
  - The current streak is the most recent match's streak.
  - The best streak is the highest across all matches.
- **PRO-5 New or returning** is decided by whether the player has at least one recorded match, not by their trophy count.
- **PRO-6 Trophies and arena come from the same stored total the leaderboard uses** (LDB-6). The profile and the leaderboard can never disagree about a player's trophies.
- **PRO-7 Editing the avatar and display name** uses the same validation as sign-up.
  - There is one definition of the rules, called from both places.
  - Submitting your own current name unchanged succeeds.
  - A failed edit keeps what was typed and changes nothing that is stored.
- **PRO-8 Changing the password** requires the current password. The new password follows sign-up's rules. On success, show "Your password has been updated." (GAP if absent from the inventory).
- **PRO-9 The only profile fields a player can write** are their own display name, avatar and tutorial completion. Trophies, results and records are written only by the server.

### 6.3 Account deletion (DEL)

A player can permanently delete their own account from the profile. Deletion is the only irreversible operation in the product. Every consequence for other players is decided here.

| What | Decision | Why |
|---|---|---|
| The player's sign-in and profile | Removed. The player can no longer authenticate, and no identifying data survives. | That is what deletion means. |
| Their match records | Removed with the account. | A match record belongs to the player who played it. No other player's history holds a copy. |
| Their ghost runs | **Survive, anonymised**, and stay raceable by other players. | A ghost is a score and a set of timings, not personal content. Removing ghosts shrinks every other player's opponent pool. |
| Their leaderboard presence and best ranks | Removed. Rankings recompute without them. | A deleted player is not a player. |
| In-progress round state | Removed first, before the account. | Deleting the account destroys the only link back to it. |
| Their display name | **Freed.** Anyone may register it afterwards. | Otherwise the pool of names only ever shrinks. |

- **DEL-1 The name is freed, so no surviving record may show it.** An anonymised ghost appears as `Deleted Player` with avatar `avatar-1`. That label is 14 characters, longer than the 10-character limit on display names, so nobody can register it. A new account that takes the freed name must not appear to own the deleted player's ghosts.
- **DEL-2 Confirmation.** A single click, a stray Enter key, or going back and resubmitting must never delete an account.
- **DEL-3 The copy is true.** It says:
  - deletion is permanent and cannot be undone;
  - anonymised runs remain as opponents for other players;
  - the display name becomes available to others.

  It must not claim everything is erased. The design has no deletion frame, so this copy is GAP and must be recorded before the sprint.
- **DEL-4 Deletion is atomic.** It either completes entirely or changes nothing. A partial deletion that leaves a credential without a profile, or a profile without a credential, is a defect.
- **DEL-5 Only the signed-in player can delete their own account.** The server verifies the session and takes the account from it. Removing the sign-in credential requires the service-role credential. That credential is used only by the server route that has already verified the session, and it never reaches the browser.

### 6.4 Question bank (QB)

- **QB-1 Each question has:**
  - an id;
  - an arena tier (a positive integer, recorded but unused);
  - a setup line and the question text;
  - exactly four options, all non-empty with no duplicates;
  - the index of the correct option;
  - a fact.

  The ten samples in `docs/design/sample-questions.json` define the format and must load unchanged.
- **QB-2 The bank is validated when it loads.** A malformed question fails loudly, naming its id. Every failure is reported at once, not only the first. Duplicate ids are rejected.
- **QB-3 The correct option is stored at a fixed position,** and the options are shuffled every time a question is delivered.
- **QB-4 Every question has a review record.**
  - A question that has not been reviewed is never served.
  - A review record states only what is true: who reviewed it, and when or in which review round.
- **QB-5 At least 40 reviewed questions**, produced by an offline generation step followed by review.
  - The model is never called while the game is running.
  - Content rules: a setup never gives away its answer, distractors are plausible, and figures are accurate.
- **QB-6 Question content never reaches the browser outside a live round.**
  - No endpoint lists the bank.
  - A signed-in status endpoint may expose question ids and review state, with no content, if a sprint needs something to verify the review gate against.

### 6.5 Rounds (RND)

Screens: 6.01 question, 6.02 timer warning, 6.03 correct, 6.04 wrong, 6.05 round summary.

- **RND-1 A round is exactly ten questions in a fixed order.** Against a ghost, they are the ghost's ten questions in the ghost's order. Otherwise they are chosen from the reviewed bank.
- **RND-2 Questions arrive one at a time.**
  - The next question's content is released only after the current one is graded.
  - Content for undelivered questions never reaches the browser, in any form.
- **RND-3 The server times every answer.**
  - It records when it delivered each question and when it graded the answer.
  - Elapsed time is grading time minus delivery time for that question alone.
  - It is never calculated from other questions' times, and never taken from the browser.
- **RND-4 Each question allows 15,000 ms.**
  - The warning state (6.02) begins with 5,000 ms left.
  - No answer by the limit makes the question *unanswered*.
- **RND-5 An answer has three possible states:** correct, wrong and unanswered. Unanswered is not the same as wrong, and both break the current streak.
- **RND-6 Each question is graded exactly once.**
  - Resending the same answer returns the same result.
  - A different answer to an already graded question is refused.
  - A question cannot be graded before it has been delivered, or out of order.
- **RND-7 After grading, the player sees the result:** 6.03 correct or 6.04 wrong, with the fact. Time spent on that screen never counts towards the next question. A slow but honest player who waits six seconds on the feedback screen, then answers in twelve, is scored as a twelve-second answer.
- **RND-8 The server holds the round.** Whatever the browser keeps may identify the round, but cannot *be* the round. Sending an old copy back must not rewind progress, restart a clock or re-deliver a question with a fresh timestamp.
- **RND-9 A round expires 60 minutes after its first question is delivered.** A submission after that is refused and awards nothing. A normal round takes three to five minutes.
- **RND-10 A reload resumes the round.**
  - An in-progress round continues at the same question.
  - The countdown shows the time actually left according to the server, so reloading never buys time.
  - A question whose time ran out during the reload counts as unanswered.
- **RND-11 A saved round belongs to one player.**
  - A second account signed in on the same browser never sees or submits another account's round.
  - The browser discards its saved round as soon as the server gives a definitive answer: accepted, already recorded, refused or expired.
  - It keeps the saved round only after a network failure or a server error, so it can retry.
- **RND-12 Submitting a round is all-or-nothing.** The stored ghost run, the match record, the trophy change and the best-rank update are written together or not at all.
- **RND-13 Submitting the same round again changes nothing,** and the response says the round was already recorded. The result screen then shows no newly awarded trophies and no promotion.
- **RND-14 The round summary (6.05) shows the server's count of correct answers,** the same figures the score was calculated from.

### 6.6 Scoring and trophies (SCO)

The constants below were set on purpose from outside the build, so every hand-calculated test has an independent source. The implementer must not adjust them.

| Rule | Value |
|---|---|
| Points for a correct answer | `100 + round(100 × max(0, 15000 − elapsed_ms) / 15000)`, so between 100 and 200 |
| Points for a wrong or unanswered question | 0 |
| Streak bonus | +50 for each correct answer at position 3 or later in a consecutive correct run. Two in a row earn nothing; three earn +50; five earn +150. |
| Highest possible round score | 10 × 200 + 8 × 50 = 2,400 |
| Trophies for a win | `round(score / 10)` |
| Trophies for a loss | `−clamp(200 − round(score / 10), 25, 200)` |
| Trophies for a draw | 0 |
| Running trophy total | Never below 0 |

- **SCO-1 One scoring function** scores both the player and the ghost. It works only from the server's own record of the round.
- **SCO-2 `max(0, …)` in the speed bonus is load-bearing.** An honest timeout can record slightly more than 15,000 ms, and that must earn no bonus, never a negative one.
- **SCO-3 The higher score wins. On equal scores, the lower total answer time wins.**
  - Total time is the sum of the ten server-measured times. An unanswered question counts as 15,000 ms.
  - If the totals are also equal, the match is a **draw**.

  This follows the tutorial's promise, "The faster one wins."
- **SCO-4 Result screens:**
  - 7.00 win;
  - 7.01 win with a streak;
  - 7.03 loss;
  - the draw screen, with headline `DEAD HEAT.`, body `Same score. Same speed. Nobody moves.` and a trophy change of 0. The draw strings are GAP.

  Each screen shows the trophy change the server recorded for that submission.
- **SCO-5 Solo rounds.** When no opponent is available, the round is played alone. It records no match and no trophy change, and its result screen shows the score only. The run is still stored as a ghost for others to race.
- **SCO-6 Sanity checks** from the design: a win scoring about 1,720 earns +172, and a loss scoring about 480 costs −152.

### 6.7 Ghost opponents and matches (GHO)

Screens: 4.00 finding a match, 5.00 opponent found, 5.01 countdown.

- **GHO-1 Every completed round is stored as a ghost run:** the ten question ids in order, and for each question the answer and the server-measured time.
- **GHO-2 The opponent is chosen at random,** with equal chance, from every ghost run that is not the player's own. Anonymised runs of deleted players are included.
  - A ghost that includes a question that is no longer reviewed is passed over.
  - If no ghost remains, the round is solo (SCO-5).
  - Opponents are not matched by arena or skill.
- **GHO-3 The round replays the ghost's exact questions in the same order.** The options are shuffled again for this delivery.
- **GHO-4 A player never races their own run.**
- **GHO-5 Screen 5.00 shows the opponent's avatar and name.** Screen 5.01 counts down with "Starting in 3 seconds..." Every pre-match string comes from the copy file.
- **GHO-6 A ghost run is never changed after it is stored,** and each round records at most one match.

### 6.8 Arenas and promotion (ARN)

Screens: 3.04–3.09 home per arena, 4.01–4.05 arena unlocked.

The trophy thresholds were *specified*, not read off the design. The design's legible figures were judged a misreading. Because arenas are defined as data in one place, changing a threshold is a data edit.

| Tier | Label | Trophies to enter | Promotion line |
|---|---|---|---|
| 1 | Arena 1 · Warm Up | 0 | (starting arena; no promotion screen) |
| 2 | Arena 2 · Contender | 200 | "New arena. Same you. Let's see if that's enough." |
| 3 | Arena 3 · Challenger | 600 | "You're moving up. This is where the real game starts." |
| 4 | Arena 4 · Expert | 1200 | "The guessing stops working here. Just so you know." |
| 5 | Arena 5 · Champion | 2000 | "Five arenas in and you're still here. Respect." |
| 6 | Arena 6 · Legend | 3000 | "Legend. I have nothing sarcastic to say. That's how rare this is." |

- **ARN-1 Arenas are defined once, as data:** tier, name, label, threshold, badge and background. No threshold or label is repeated anywhere else.
- **ARN-2 A player's arena is worked out from their trophy total.** It is never stored separately, where it could drift.
- **ARN-3 A player exactly on a threshold is in the higher arena.** Exactly 200 trophies is Arena 2.
- **ARN-4 Arena 1 is the floor.** Trophies fall on a loss but never below 0, and a player never drops out of Arena 1. There is no state below the ladder and no demotion screen.
- **ARN-5 Promotion.** When a result moves a player up at least one tier, the "ARENA UNLOCKED!" screen for the new arena appears before the result screen, with the line above.
- **ARN-6 The home screen for a returning player** shows their current arena's background, badge and label. Six arenas exist; frame "3.09 - Home - A9" is a layer-name slip, not a seventh arena.
- **ARN-7 Skipping Arena 1 on a first match** is intended behaviour, decided:
  - A player can gain at most 240 trophies in one match. Arena 1 spans 200 trophies and every other arena spans at least 400, so Arena 1 is the only arena that can be skipped.
  - That happens only on a first match scoring 1,995 or more. Such a player has no best-rank record for Arena 1, so its tile shows as locked.
  - Revisit this only if such scores become common, or the design gains a line for it.

### 6.9 Leaderboards (LDB)

Screens: 9.00 current arena, 9.01 global, 9.02 locked arena, 9.03 archived arena.

- **LDB-1 Only signed-in players can see leaderboards.** A signed-out visitor sees none, and the landing page shows no leaderboard preview.
- **LDB-2 Two all-time boards:**
  - global, covering every ranked player;
  - the viewer's current arena, covering ranked players in the same arena.
- **LDB-3 The viewer's own position line.** For example, "You rank #99 in Global Arena".
- **LDB-4 Ranking order.**
  - Stored trophy total, highest first. Ties are broken by a stable id, lowest first, so two players on equal trophies never swap places between loads.
  - Ranks start at 1 and are counted over the whole population.
  - There is no pagination: every ranked player is shown.
- **LDB-5 A player with no matches appears on no board** until they finish their first match. A new player and a heavily demoted one can both sit at 0 in Arena 1, and only match count tells them apart.
- **LDB-6 Each player has a stored trophy total.**
  - It is written in the same transaction, and from the same value, as the match record that changed it.
  - Rankings read that stored total and never recompute it from match history.
  - Any migration that introduces it must backfill existing players.
- **LDB-7 The leaderboard exposes only four things per player:** display name, avatar, trophy total, and whether the row is the viewer's own. It exposes no player ids and no email addresses, and reading it does not widen access to the player table.
- **LDB-8 Arena tiles.** Each of the six arenas is shown in exactly one state:

| State | When | Shows |
|---|---|---|
| Current | The arena the player's trophy total places them in now | The current rank |
| Archived | The player has a best-rank record here, and it is not their current arena, above or below | "You conquered Arena N. Best rank: R." |
| Locked | The player has no best-rank record here | "You haven't made it here yet." |

- **LDB-9 Best rank is recorded on every completed match, not only on promotion.**
  - Rank within the arena the new total places the player in is 1 plus the number of players in that arena ahead of them in LDB-4's order.
  - Keep the lowest (best) value per player per arena.
  - Records are permanent. A demotion never deletes one, so a demoted player sees an arena above them as archived, not locked.
  - Recording happens inside the same all-or-nothing submission (RND-12), and a resubmitted round never records a second time (RND-13).

### 6.10 Onboarding (ONB)

Screens: 1.00 landing, 3.00 new-user home, 3.01 and 3.02 tutorial.

- **ONB-1 The landing page (1.00) is for signed-out visitors.** Its copy is exact: "Think you know stuff? Let's find out.", "Climb arenas", "Earn trophies", "Sign up", "Already have an account? Log in". It leads to sign-up and log-in.
- **ONB-2 Home depends on the player's record.**
  - A signed-in player with no matches sees the new-user home (3.00), with "See how it works" and "Let’s play". Note the curly apostrophe, as in the design.
  - Everyone else sees their arena home (6.8).
  - Which one is decided by match count, not trophies.
- **ONB-3 The tutorial is two steps, with copy verbatim:**
  - Step 1: "10 questions. 1 opponent. The faster you answer correctly, the more you score. Climb the arenas...if you can."
  - Step 2: "You and your opponent can both get it right. The faster one wins. Every second you hesitate costs you points. Your opponent isn't waiting."
- **ONB-4 The tutorial is optional.** The new-user home offers both "See how it works" and "Let’s play". Once completed, the tutorial never reappears. Completion is stored on the server, so it survives a different browser or a cleared local storage.
- **ONB-5 After the tutorial, "Continue" takes the player into a first match.**
- **ONB-6 A signed-in player can always reach Play from home.**

### 6.11 Security and integrity (SEC)

- **SEC-1 Every request that acts for a player verifies the session on the server,** and takes the player from the session. That covers starting a match, receiving a question, answering, submitting, changing the profile, completing the tutorial and deleting the account.
- **SEC-2 Only the server can write results.** Round progress, grading, ghost runs, matches, trophy totals and best ranks can be written by server code only. The browser's database role cannot write them, whether it names a player or not.
- **SEC-3 Database access by row.**
  - A player can read their own profile, their own matches and their own best ranks.
  - A player can write only their own display name, avatar and tutorial completion.
  - Nothing grants a player another player's email.
- **SEC-4 Secrets never reach the browser bundle.** A service-role credential is used only by server code, after the session has been verified.
- **SEC-5 Principle P2 applies everywhere.** No response, rendered page or client bundle contains an answer, or a revealing fact, before its question is graded.
- **SEC-6 No rate limiting, by decision.** This is recorded as an accepted risk for a harness, not an oversight.

## 7. Non-functional requirements

- **NFR-1 Every token reaches the browser.** All 17 design tokens ship as CSS variables and are used by name.
- **NFR-2 Measured values from the design:**
  - inputs 44px tall with an 8px radius;
  - buttons 52px tall with a 10px radius;
  - a focused input's border uses the accent token;
  - error text uses the error-text token.
- **NFR-3 Every screen works from 320px wide** in current Chrome and Safari.
- **NFR-4 Every push runs linting, type checking, the test suite and the production build.** A failure is visible to the team, not silently ignored.
- **NFR-5 Every schema change is a versioned migration committed to the repository.** The repository is the source of truth for the database's shape.
- **NFR-6 Accessibility.** Every control has an accessible name, keyboard focus is always visible, and error messages are associated with their fields.
- **NFR-7 Error handling.** No failure is silent. Any user action that fails shows either its own message or the generic fallback (GAP), and reports the error for diagnosis. No unhandled rejection reaches the console.

## 8. Suggested build order

This is advice for decomposition, not a mandate. Each step depends on the ones before it, except where noted.

1. **Scaffold.** Next.js, Supabase and CI, with every token shipped.
2. **Accounts** (6.1).
3. **Question bank** (6.4). Can run in parallel with step 2.
4. **Rounds** (6.5). Server-held from the start, not added later.
5. **Scoring and result screens** (6.6).
6. **Ghost opponents and matches** (6.7), including ties and draws.
7. **Arenas and promotion** (6.8).
8. **Profile and editing** (6.2). Can run in parallel with step 7 once step 6 is done.
9. **Leaderboards and arena tiles** (6.9).
10. **Onboarding** (6.10). Can run in parallel with step 9.
11. **Account deletion** (6.3). Last, because it has to account for every table the earlier steps create.

## 9. Definition of done

The rebuild is done when:

- every requirement in section 6 is covered by some sprint's acceptance criteria;
- every sprint has passed both QA1's audit and LiveQA's live test, and been closed on the operator's explicit authorisation;
- every account, row, container and other resource created for testing has been removed by its named owner;
- the operator has recorded the comparison against the evaluation key.

## 10. Decisions log

Every decision below is final for this rebuild. "Previous build" means the decision was made while building the original and is carried over as a requirement. "This PRD" means it was made for the rebuild on 11 September 2026.

| Decision | Value | Source |
|---|---|---|
| Arenas | Six, A1–A6; frame "A9" is a layer-name slip | Previous build |
| Thresholds | 0 / 200 / 600 / 1200 / 2000 / 3000, specified | Previous build |
| Exactly on a threshold | Higher arena | Previous build |
| Demotion | Arena 1 is the floor; totals never below 0 | Previous build |
| Scoring constants | Section 6.6, set from outside the build | Previous build |
| "Archived" | Reached and not current, above or below; no seasons | Previous build |
| Locked | No best-rank record | Previous build |
| Best rank | Recorded on every match, lowest kept, permanent | Previous build |
| Arena 1 first-match skip | Shows as locked; accepted | Previous build |
| Stored trophy total | Written with the match, same transaction and value | Previous build |
| Leaderboard visibility | Signed-in only; name, avatar, trophies only | Previous build |
| Leaderboard time periods | All-time only; tabs deferred | Previous build |
| No-match players on boards | Absent until first match | Previous build |
| Deletion consequences | Section 6.3 table | Previous build |
| Freed display name | Available; survivors show `Deleted Player` | Previous build |
| Question difficulty by arena | Dropped | Previous build |
| Server-held rounds | One question at a time; server timing | Previous build |
| Sign-up email confirmation | Off | Previous build |
| Ties | Faster total time wins; otherwise a draw worth 0 | This PRD |
| Session verification | On every player action; server-only result writes | This PRD |
| Round expiry | 60 minutes after first delivery | This PRD |
| Matchmaking | Random from all other ghosts | This PRD |
| Tutorial | Optional | This PRD |
| Display-name uniqueness | Case-insensitive | This PRD |
| Question bank | Generated fresh; at least 40 reviewed | This PRD |
| Draw copy | `DEAD HEAT.` / `Same score. Same speed. Nobody moves.` (GAP) | This PRD |
| Terms and Privacy | Out; links and consent line omitted | This PRD |

## Appendix A. Frame map

| Frames | Screen |
|---|---|
| 1.00 | Landing |
| 1.01–1.05 | Create account: idle, avatar chosen, filled, error, several errors |
| 2.01 | Log in |
| 2.02–2.04 | Password reset: request, sent, set new password |
| 3.00 | New-user home |
| 3.01, 3.02 | Tutorial, steps 1 and 2 |
| 3.04–3.09 | Home, one per arena (A1–A6) |
| 4.00 | Finding a match |
| 4.01–4.05 | Arena unlocked, arenas 2–6 |
| 5.00 | Opponent found |
| 5.01 | Countdown |
| 6.01–6.05 | Question, timer warning, correct, wrong, round summary |
| 7.00, 7.01, 7.03 | Win, win with streak, loss |
| 8.01, 8.07 | Profile: returning player, new player |
| 8.10–8.13 | Edit avatar and name; change password |
| 8.14 | Log out confirmation |
| 9.00–9.03 | Leaderboards: current arena, global, locked arena, archived arena |

## Appendix B. Arena art

Badges are 123×92 for arenas 1–5 and 133×100 for arena 6. The backgrounds, from the design:

| Tier | Background |
|---|---|
| 1 | Radial: `#27E3D4`, `#0D4836`, `#0D2B18` |
| 2 | Radial: `#8C397A`, `#480072`, `#633497` |
| 3 | Radial: `#9AD4FF`, `#0D3F52`, `#0F465D` |
| 4 | Radial: `#FFD000`, `#503606`, `#68471B` |
| 5 | Radial: `#F75152`, `#111312`, `#5F1717` |
| 6 | Linear: `#7337BE`, `#883795`, `#DB8147`, `#3C9DBB`, `#312E65` |
