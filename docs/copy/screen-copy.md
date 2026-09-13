# Show Off screen copy (source of record)

Carried over as a PRD section 4 input and cleaned for the rebuild on
2026-09-12: previous-build history was removed, and the authority table,
house pattern, GAP process and full inventory were kept. Audit copy against
this file.

## Authority: who owns which string

| Marking | Origin | Who may change it |
|---|---|---|
| **DESIGN** | Literal text-node content from Figma file `pKPcNRMWgms1Y6L80jdGNV`, page `Game UI` | The design owner only |
| **GAP** | Written by Master Controller because the design never covered this state | Master Controller |
| **CHROME** | Page titles, `aria-label`s, and other non-visible text with no design surface | Dev Team |

Reproduce DESIGN strings exactly, including a missing full stop or an odd
capital. Those are the design owner's to fix, never Dev Team's to silently
correct.

**If a string you need is missing, it is a GAP to raise, not a licence to
write one.** The house voice is distinctive, and inventing in it produces
something that reads almost right, which is worse than an obvious hole.

**Inventory versus live Figma (rebuild decision, 2026-09-12).** The
inventory below was captured before the design was last edited, and it does
not include input placeholder text. Where a string appears on a live Figma
frame but not in the inventory (for example `Get started` on 1.00, or the
input placeholders), the live Figma frame is the DESIGN authority. Master
Controller records each such string in the section for its screen before
the sprint that needs it.

## The house pattern for error copy

Derived from the DESIGN strings below, not invented:

> Plain declarative, sentence case, full stop. The wry voice
> (`Let's ruin that immediately.`) lives in the game, never in the errors.
> A second sentence names the way forward, but only when the way forward
> is not already on screen.

`This display name is already taken. Try a different name.` and
`This email is already registered. Log in instead.` set the two-sentence
pattern. `Need at least 8 characters.` shows the one-sentence case.

Any new GAP string must satisfy this rule.

---

## Create account (screens 1.01–1.05)

**Validation messages (DESIGN, verbatim):**

| Rule | Message |
|---|---|
| Display name too short | `Need at least 2 characters.` |
| Display name too long | `Exceeds 10 character limit.` |
| Display name taken | `This display name is already taken. Try a different name.` |
| Password too short | `Need at least 8 characters.` |
| Email already registered | `This email is already registered. Log in instead.` |
| No avatar selected | `Please choose an avatar.` |
| Email blank or malformed | `Invalid email address.` |

There is **one** email message, not a separate "required" and "invalid"
pair. `Invalid email address.` covers both blank and malformed.

Sign-up has a single password field (rebuild decision, following the
design), so `Passwords need to match` is not used on this screen.

## Log in and password reset (screens 2.01–2.04)

**DESIGN:**

- `Sign in to pick up where you left off.`
- `Forgot Password?`
- `Don’t have an account?` (curly apostrophe, as in the inventory)
- `Sign up`
- `Sign in`
- `Enter your email and we’ll send a reset link.` (curly apostrophe, as in the inventory)
- `Send password reset link`
- `Go back to Log in`
- `A password reset link was sent to your email. Check your inbox (or spam folder) to reset your new password.`

**GAP: the login screen has no error string in the design.**

| State | String | Reasoning |
|---|---|---|
| Wrong email or password | `Incorrect email or password.` | One sentence with no way-forward clause, because `Forgot Password?` is already on screen. Deliberately non-disclosing: the same string for an unregistered email and a wrong password, so the form cannot be used to enumerate accounts. This is a security property, not a wording preference. Do not split it into field-specific errors. (PRD ACC-7) |

**GAP: the expired or used reset link state was never drawn.**

| State | String |
|---|---|
| Link expired or already used | `This reset link has expired or has already been used.` (PRD ACC-9) |

**CHROME** (no design surface, Dev Team owns):
`Log in — Showoff`, `Reset your password — Showoff`, `Set a new password — Showoff`

## Profile and change password

**DESIGN:**

- `Showing off since Apr 1, 2026` (the date is fixture data; the format is the spec)
- `Play your first match to start building your record.`
- `Fresh start. Clean record.`
- `Current winning streak`
- `You rank #99 in Global Arena` (the number is fixture data)
- `Current password`
- `New password`
- `Confirm New password`
- `Update password`
- `Invalid password`
- `Passwords need to match` (no full stop, as captured; reproduce it)

**`Invalid password` is the correct string for a wrong *current* password on
the change-password screen.** Do not carry the log-in screen's non-disclosure
reasoning over here by reflex: inside an authenticated account there is
nothing to enumerate, and this string is design-sourced.

## Rebuild copy by screen (recorded 2026-09-12, before sprints 2–12)

Every string below is one of: **DESIGN** (in the inventory, verbatim), **DESIGN-LIVE**
(on a live Figma frame but not in the inventory; D-02), or **GAP** (written by Master
Controller). Punctuation, apostrophes and double spaces are exactly as shown. Letter
case shown for headings is how they display; the design sets many headings in
uppercase with CSS, so the source string may be in another case. Numbers, names and
scores in the design are fixture data, and only their *format* is specified here.

### Global

| Use | String | Source |
|---|---|---|
| Generic fallback error, any failure without its own message (NFR-7) | `Something went wrong. Try again.` | GAP |
| Tab bar | `Home` · `Leaderboard` · `Profile` | DESIGN / DESIGN-LIVE |
| Back link | `Back` | DESIGN |

### Landing (1.00)

| Use | String | Source |
|---|---|---|
| Tagline above logo | `Earn trophies` · `Climb arenas` (separated by the star glyph) | DESIGN |
| Host caption | `Think you know stuff? Let's find out.` | DESIGN |
| Primary button | `Get started` | DESIGN-LIVE (D-13) |
| Log-in prompt | `Already have an account?` then link `Log in` | DESIGN |

The Terms line and `v1.0` are not shown (PRD scope).

### Create account (1.01–1.05)

| Use | String | Source |
|---|---|---|
| Heading | `CREATE ACCOUNT` | DESIGN-LIVE |
| Avatar picker label | `Choose your avatar` | DESIGN |
| Placeholders | `Display name [2-10 characters]` · `Email` · `Password (min 8 characters)` | DESIGN-LIVE (D-11) |
| Button | `Create account` | DESIGN |
| Log-in prompt | `Already have an account?` then link `Sign in` | DESIGN |
| Reserved name (D-31) | `This display name is already taken. Try a different name.` | DESIGN (same message as a taken name, deliberately) |

`Or`, `Continue with Google` and both Terms lines are not shown (PRD scope).

### Log in (2.01)

| Use | String | Source |
|---|---|---|
| Heading | `WELCOME BACK` | DESIGN-LIVE |
| Placeholders | `Email` · `Password (min 8 characters)` | DESIGN-LIVE (D-11) |
| Button | `Log in` | DESIGN |
| Sign-up prompt | `Don’t have an account?` then link `Sign up` | DESIGN |

### Password reset request (2.02–2.04)

| Use | String | Source |
|---|---|---|
| Heading | `RESET PASSWORD` | DESIGN-LIVE |
| Sent heading | `CHECK YOUR INBOX` | DESIGN-LIVE |

### Set a new password (no frame; D-12, layout from 8.12)

| Use | String | Source |
|---|---|---|
| Heading | `SET NEW PASSWORD` | GAP |
| Field labels | `New password` · `Confirm New password` | DESIGN |
| Placeholders | `Password (min 8 characters)` · `Confirm new password` | DESIGN-LIVE |
| Button | `Save changes` | DESIGN |
| Mismatch | `Passwords need to match` | DESIGN |
| Expired or used link | `This reset link has expired or has already been used.` | GAP (ACC-9) |
| Link under the expired message | `Request a new reset link` | GAP |
| After success, shown on the log-in screen | `Your password has been updated.` | GAP (PRO-8) |

### Log out confirmation (8.14)

| Use | String | Source |
|---|---|---|
| Heading | `Leaving already?` | DESIGN |
| Body | `Your trophies will be here when you get back.` | DESIGN |
| Buttons | `Log out` · `Cancel` | DESIGN |

### New-user home (3.00)

| Use | String | Source |
|---|---|---|
| Heading | `YOUR KNOWLEDGE + YOUR SPEED = YOUR TROPHIES` | DESIGN |
| Arena label | from arena data (`Arena 1 · Warm Up`) | DESIGN |
| Body | `10 questions. 1 opponent. The faster you answer correctly, the more you score. Climb the arenas...if you can.` | DESIGN |
| Buttons | `Let’s play` · `See how it works` | DESIGN |
| Host lines | `Fresh meat. I like it.` · `Welcome to the Arena.` | DESIGN |

### Tutorial (3.01–3.02; D-41)

| Use | String | Source |
|---|---|---|
| Card 1 heading | `TROPHIES DON'T LIE` | DESIGN |
| Card 1 body | `Win and you climb.  Lose and you drop. 6 Arenas stand between you and Legend. Can you reach the top?` (two spaces after the first full stop) | DESIGN |
| Card 2 heading | `KNOWING ISN'T ENOUGH` | DESIGN |
| Card 2 body | `You and your opponent can both get it right. The faster one wins. Every second you hesitate costs you points. Your opponent isn't waiting.` | DESIGN |
| Button on both cards | `Got it` | DESIGN |
| Completion could not be saved | `We couldn't save your progress. Try again.` | GAP |
| Retry button | `Try again` | GAP |

### Profile (8.01, 8.07–8.09; D-23)

| Use | String | Source |
|---|---|---|
| Member since | `Showing off since Apr 1, 2026` (format: `Showing off since` + `MMM D, YYYY`) | DESIGN |
| Trophies card label | `TROPHIES` | GAP (D-23: current total, so "HIGHEST" would be untrue) |
| Win rate card label | `WIN RATE` | DESIGN |
| Best streak card label | `BEST STREAK` | DESIGN |
| Current streak card label (replaces Perfect games) | `CURRENT STREAK` | GAP |
| Locked stat, no matches or no wins yet | `Win to unlock` | DESIGN |
| No-matches card | `Play your first match to start building your record.` with button `Let’s play` | DESIGN |
| Log out link | `Log out` | DESIGN |
| Edit menu (8.15) | `Edit profile` · `Update password` · `Delete account` · `Cancel` | DESIGN, `Delete account` GAP |

### Edit profile and update password (8.10–8.13)

| Use | String | Source |
|---|---|---|
| Headings | `EDIT PROFILE` · `UPDATE PASSWORD` | DESIGN-LIVE |
| Labels | `Choose your avatar` · `Display name` · `Current password` · `New password` · `Confirm New password` | DESIGN |
| Placeholders | `Current password` · `Password (min 8 characters)` · `Confirm new password` | DESIGN-LIVE |
| Buttons | `Cancel` · `Save changes` | DESIGN |
| Wrong current password | `Invalid password` | DESIGN |
| Password updated | `Your password has been updated.` | GAP (PRO-8) |

### Finding a match and pre-match (4.00, 5.00, 5.01; D-32, D-33)

| Use | String | Source |
|---|---|---|
| Searching | `Finding your opponent...` | DESIGN |
| Heading | `Opponent Found` (displays uppercase) | DESIGN |
| Divider | `VS` | DESIGN |
| Countdown | `Starting in 3 seconds...` (the number counts 3, 2, 1: `Starting in 2 seconds...`, `Starting in 1 second...`) | DESIGN, singular form GAP |
| Final beat | `GO!` | DESIGN |
| Host lines, player has no matches | `Fresh start. Clean record.` · `Let's ruin that immediately.` | DESIGN |
| Host lines, player's displayed streak ≥3 | `On a roll! Can ANYONE` · `stop this machine?!` | DESIGN |
| Host lines, every other player | `Another round.` · `Try not to blink.` | GAP |
| No usable opponent | `No opponents are available right now. Try again in a minute.` | GAP (D-32) |

### Question and answer (6.01–6.05; D-34, D-35)

| Use | String | Source |
|---|---|---|
| Progress label | `Q 1/10` (format `Q n/10`), followed by the question's setup line in the category slot | DESIGN (D-35) |
| Scores | `YOU:` `340 pts` · `THEY:` `290 pts` (format `n pts`) | DESIGN |
| Speed points still available | `+ 60 pts` (format `+ n pts`) | DESIGN |
| Player result | `YOU GOT IT RIGHT` · `YOU GOT IT WRONG` · `YOU DIDN'T ANSWER` | DESIGN, last GAP |
| Opponent result | `THEY GOT IT RIGHT` · `THEY GOT IT WRONG` · `THEY DIDN'T ANSWER` | DESIGN, last GAP |
| Correct | `CORRECT!` · host `Not bad, not bad at all.` | DESIGN |
| Wrong | `WRONG!` · host `You had four options. Four.` | DESIGN |
| Unanswered (RND-5) | `TIME'S UP!` · host `The clock doesn't wait. Neither do I.` | GAP |
| Fact prefix | `💡 ` then the fact | DESIGN |
| Buttons | `Next question` · `See result` (after question 10) | DESIGN |
| Round expired (RND-9) | `This round has expired. Start a new match from home.` | GAP |

### Results (7.00, 7.01, 7.03, draw)

| Use | String | Source |
|---|---|---|
| Win | `You win!` (displays uppercase) · `THAT’S HOW IT’S DONE.` · host `Crushed it! Your opponent just got SCHOOLED!` | DESIGN |
| Loss | `You LOSE.` (displays uppercase) · `THEY GOT YOU.` · host `Bad luck! Shake it off and let’s get back in there!` | DESIGN |
| Draw | headline `DEAD HEAT.` · host `Same score. Same speed. Nobody moves.` (no sub-heading) | GAP (PRD 6.6) |
| Trophy change | `+ 19 TROPHIES` · `- 26 TROPHIES` · draw `0 TROPHIES` | DESIGN, draw GAP |
| Total | `TOTAL` | DESIGN |
| Streak line, displayed streak ≥3 and a new best | `6 win streak! New best!` (format `n win streak! New best!`) | DESIGN |
| Streak line, displayed streak ≥3, not a new best | `6 win streak!` | GAP |
| Per player | `2/10 CORRECT` (format `n/10 CORRECT`) · `259 pts` | DESIGN |
| Buttons | `Home` · `Play again` | DESIGN |

The streak line is not shown when the displayed streak is below 3 (D-21).

### Arena home and promotion (3.04–3.09, 4.01–4.05; D-24, D-37)

| Use | String | Source |
|---|---|---|
| Stats | `Current winning streak` · `Total wins` · `Total losses` · `Win rates` | DESIGN |
| Button | `Let’s play` | DESIGN |
| Host lines | `I believe in you...` · `...most of the time.` | DESIGN |
| Promotion heading | `ARENA UNLOCKED!` | DESIGN |
| Promotion lines, arenas 2–6 | `New arena. Same you.  Let’s see if that’s enough.` · `You're moving up. This is where the real game starts.` · `The guessing stops working here. Just so you know.` · `Five arenas in and you're still here. Respect.` · `Legend. I have nothing sarcastic to say. That's how rare this is.` | DESIGN (inventory wins over the PRD's quotation where they differ in apostrophes or spacing) |
| Promotion dismiss | `Continue` | GAP (D-37) |

### Leaderboards (9.00–9.03; D-40)

| Use | String | Source |
|---|---|---|
| Heading | `LEADERBOARD` | DESIGN |
| Viewer's rank, global | `You rank #99 in Global Arena` (format `You rank #n in Global Arena`) | DESIGN |
| Viewer's rank, an arena | `You rank #1 in Arena 2` (format `You rank #n in Arena N`) | DESIGN |
| Viewer has no matches yet (LDB-5) | `Play your first match to get ranked.` | GAP |
| Locked arena | `You haven't made it here yet.` | DESIGN |
| Archived arena | `You conquered Arena 1. Best rank: 6.` (format `You conquered Arena N. Best rank: R.`) | DESIGN |
| Podium places | `1ST` · `2ND` · `3RD` | DESIGN |
| Board with no ranked players | `Nobody's ranked here yet.` | GAP |

`Weekly` and `Monthly` are not shown; the board is all-time only (PRD scope).

### Account deletion (no frame; DEL-3, D-44)

| Use | String | Source |
|---|---|---|
| Heading | `DELETE ACCOUNT` | GAP |
| Body, paragraph 1 | `Deleting your account is permanent and cannot be undone.` | GAP |
| Body, paragraph 2 | `Your profile, match history, trophies and rankings will be removed. Your past runs stay in the game as opponents for other players, shown as Deleted Player.` | GAP |
| Body, paragraph 3 | `Your display name will become available for anyone to register.` | GAP |
| Confirmation label | `Type your display name to confirm` | GAP |
| Buttons | `Delete my account` · `Cancel` | GAP |
| Typed name does not match | `That doesn't match your display name.` | GAP |
| Completion, shown on the landing page | `Your account has been deleted.` | GAP |

### Starter opponents (D-31)

Display names, reserved from registration (case-insensitive):
`Buddy` · `CodeLord` · `VegasCat` · `iMonster` · `Ken` · `CoolGal` · `ABC01` · `Trivianna` ·
`FactCheck` · `BrainFog` · `Lucky7` · `NightOwl` · `Smartypant` · `KnowItAll` · `Guesswork` ·
`SlowPoke` · `Zippy` · `Hotshot` · `QuizKid` · `MissTake`

Anonymised ghosts of deleted players show `Deleted Player` (DEL-1).

---

## Adding a GAP string

1. Confirm the string is genuinely absent from the full inventory below and
   from the live Figma frame.
2. Check whether the gap is a *screen* rather than a string. If a layout or
   route is being invented too, that goes to the design owner regardless.
3. Write it against the house pattern above.
4. Master Controller records it here, with its reasoning, before it is built.

---

## Full inventory: 233 distinct strings, verbatim

Literal text-node content from Figma. Not transcribed from a rendered image,
not retyped. An absent string here is evidence the design did not contain it
when this was captured (see "Inventory versus live Figma" above).

```
# Showoff — complete text-node inventory from Figma page `Game UI`
# 233 distinct strings, verbatim, in capture order. This is the whole set,
# not a selection. Where a string looks like sample data (names, scores),
# it is fixture content in the design, not copy to reproduce.

Climb arenas
Earn trophies
Think you know stuff? Let's find out.
By continuing, you agree to our Terms & Conditions & Privacy Policy
Already have an account?
Log in
v1.0
See how it works
10 questions. 1 opponent. The faster you answer correctly, the more you score. Climb the arenas...if you can.
Let’s play
Welcome to the Arena.
Fresh meat. I like it.
YOUR KNOWLEDGE + YOUR SPEED = YOUR TROPHIES
Arena 1 · Warm Up
Got it
Win and you climb.  Lose and you drop. 6 Arenas stand between you and Legend. Can you reach the top?
TROPHIES DON'T LIE
You and your opponent can both get it right. The faster one wins. Every second you hesitate costs you points. Your opponent isn't waiting.
KNOWING ISN'T ENOUGH
0
299
172
Current winning streak
Total wins
6
Total losses
Win rates
100%
...most of the time.
I believe in you...
600
999
666
Finding your opponent...
ARENA UNLOCKED!
New arena. Same you.  Let’s see if that’s enough.
You're moving up. This is where the real game starts.
The guessing stops working here. Just so you know.
Five arenas in and you're still here. Respect.
Legend. I have nothing sarcastic to say. That's how rare this is.
1500
1999
1892
10
30
5
86%
2001
A6
Arena 6 · Legend
300
599
485
1000
1499
1789
Or
Everyone says Sydney. Everyone is wrong. What's ac
Continue with Google
Forgot Password?
Don’t have an account?
Sign up
Sign in to pick up where you left off.
Back
Sign in
Choose your avatar
By signing up, you agree to our Terms & Conditions & Privacy Policy
Create account
This display name is already taken. Try a different name.
This email is already registered. Log in instead.
Need at least 8 characters.
Exceeds 10 character limit.
Need at least 2 characters.
Please choose an avatar.
Invalid email address.
Send password reset link
Enter your email and we’ll send a reset link.
Go back to Log in
A password reset link was sent to your email. Check your inbox (or spam folder) to reset your new password.
Starting in 3 seconds...
Let's ruin that immediately.
Fresh start. Clean record.
Mojito
0% win rates
0 streak
Buddy
82% win rates
12 streak
238
VS
Opponent Found
A1
Warm Up
259 pts
2/10 CORRECT
0 pts
0/10 CORRECT
Crushed it! Your opponent just got SCHOOLED!
Play again
Home
You win!
+ 19 TROPHIES
TOTAL
THAT’S HOW IT’S DONE.
826 pts
6/10 CORRECT
1089 pts
7/10 CORRECT
Bad luck! Shake it off and let’s get back in there!
You LOSE.
152
- 26 TROPHIES
THEY GOT YOU.
6 win streak! New best!
A
Robert Pattinson
B
Kristen Stewart
C
Taylor Lautner
D
Ann Kendrick
Q 1/10
POP CULTURE
+ 60 pts
YOU:
340 pts
THEY:
290 pts
+ 10 pts
+60 pts
+100 pts Speed Bonus
YOU GOT IT RIGHT
500 pts
THEY GOT IT WRONG
Next question
Not bad, not bad at all.
💡 While filming in Spain, Robert Pattinson was stalked by a fan for weeks. Bored, he invited her to dinner and complained about his life for two hours, after which she never returned.
CORRECT!
Q 10/10
THEY GOT IT RIGHT
See result
YOU GOT IT WRONG
You had four options. Four.
WRONG!
stop this machine?!
On a roll! Can ANYONE
100% win rates
5 streak
153
HHHHHHHHHHHH
76% win rates
23 streak
673
GO!
A5
Arena 5 · Champion
HIGHEST
TROPHIES
Showing off since Apr 1, 2026
WIN RATE
2%
75%
BEST STREAK
9
+ 75
- 60
+ 100
+ 80
+ 65
- 90
- 54
TROPHY HISTORY
Last 7 matches
PERFECT GAMES
12
Log out
WIN
RATE
20
1
Get 10/10 to unlock
Win to unlock
Edit profile
Cancel
Update password
Your trophies will be here when you get back.
Leaving already?
Play your first match to start building your record.
HIGHEST TROPHIES
10000
9999
123
1%
25%
No Change
0%
1st
3RD
2ND
8736
Ken
6352
iMonster
7777
LEADERBOARD
You rank #1 in Arena 2
Weekly
🌎
A2
A3
A4
Monthly
All time
CoolGal
Legend
You rank #99 in Global Arena
Champion
CodeLord
ABC01
You haven't made it here yet.
VegasCat
You conquered Arena 1. Best rank: 6.
Save changes
Display name
Current password
New password
Confirm New password
Invalid password
Expert
Terms and Conditions ("Terms") Our Terms and Conditions were last updated on [DATE]. Please read these terms and conditions carefully before using Our Service. Interpretation and Definitions Interpretation The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural. Definitions For the purposes of these Terms and Conditions: “Application” means the software program provided by the Company downloaded by You on any electronic device, named [APP_NAME] “Application Store” means the digital distribution service operated and developed by Apple Inc. (Apple App Store) or Google Inc. (Google Play Store) in which the Application has been downloaded. “Affiliate” means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.
Privacy Policy Our Privacy Policy was last updated on [DATE]. This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You. We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy. This Privacy Policy was generated by TermsFeed App Privacy Policy Generator. Interpretation and Definitions Interpretation The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural. Definitions For the purposes of this Privacy Policy: “Account" means a unique account created for You to access our Service or parts of our Service. “Application" means the software program provided by the Company downloaded by You on any electronic device, named [APP_NAME] “Company" (referred to as either “the Company", “We", “Us" or “Our" in this Agreement) refers to [COMPANY INFORMATION] “Country" refers to [COMPANY_COUNTRY]
Passwords need to match
```
