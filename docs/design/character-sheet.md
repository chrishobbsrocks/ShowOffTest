# Character sheet — the host

**Source:** Figma file `pKPcNRMWgms1Y6L80jdGNV`, page **Character sheet** (node `52-13`).
Transcribed from the Figma page. **The Figma page is the authority; this file is a transcription.** If
the two disagree, the design wins and this file is wrong.

## What it is

A presenter/host character rendered in ten expressions, each a named frame:
`Expression-01-Neutral` through `Expression-10-Greetings`.

**Build note, verbatim from the page:** *head, eyes, eyebrows, mouth, body, arms
in separate layers.* That is a rigging instruction — the character is intended to
be composed, not shipped as ten flat images. Whether this project takes that up
is a design/engineering decision nobody has made yet; it is recorded here because
the design says it, not because a sprint requires it.

## The expression table, verbatim

| Expression | When it plays |
|---|---|
| Neutral/Idle | Default state, waiting for player input |
| Talking | Mouth open variations for lip sync |
| Excited/Celebrating | Player gets a correct answer, streak |
| Laughing | Player does something impressive |
| Disappointed/Cringe | Player gets it wrong |
| Thinking/Pondering | While question is being read |
| Sarcastic/Smirk | Dry commentary moments |
| Intense/Serious | Final round, close scores |
| Shocked/Surprised | Unexpected comeback, everyone got it wrong |
| Waving/Greeting | Welcome screen, game start |

## What this does and does not settle

**Settles:** the expression set exists, is named, and each has a stated trigger.
Any sprint that needs to know *which* expression plays *when* can cite this table
and the Figma page behind it.

**Does not settle:** the asset format, whether expressions are composed from
layers or exported flat, transition behaviour between them, or timing. None of
those are on the page. **A sprint needing any of them has a genuine open input
and should say so rather than inferring from this file.**
