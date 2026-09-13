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
- `Don't have an account?`
- `Sign up`
- `Sign in`
- `Enter your email and we'll send a reset link.`
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

## Result screens

**GAP: the draw result was never drawn** (decided in PRD section 6.6):

- Headline: `DEAD HEAT.`
- Body: `Same score. Same speed. Nobody moves.`

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
