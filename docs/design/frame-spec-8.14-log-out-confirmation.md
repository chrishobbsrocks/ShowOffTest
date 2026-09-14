# Frame spec — 8.14 Log out confirmation

**Source:** Figma file `pKPcNRMWgms1Y6L80jdGNV`, page `Game UI`, frame
`8.14 - Profile - Log out confirmation` (node `180:2698`), 375 × 666. Read layer by layer from
the Properties panel in view mode on 2026-09-14 by Master Controller (D-64). Reference image:
`docs/design/frames/frame-8.14-log-out-confirmation@2x.png`.

**Build from this file.** Where this file and the reference image disagree, this file wins
and the difference is a spec defect to raise with Master Controller. Copy is authoritative
in `docs/copy/screen-copy.md` (Log out confirmation).

This frame is the **profile screen** with a confirmation dialog over it. Only the overlay and
the dialog are specified here; the profile underneath is whatever the profile screen renders
in this sprint. All coordinates are CSS px inside the 375-wide design.

---

## 1. Layers, back to front

| # | Layer | Left | Top | Width | Height | Style |
|---|---|---|---|---|---|---|
| 1 | Profile screen (existing) | — | — | — | — | Unchanged, including its tab bar |
| 2 | Overlay | 0 | 0 | full viewport | full viewport | `--color-bg-base` at **70%** |
| 3 | Dialog box | 45 | 158 | 285 | 351 | §2 |
| 4 | Heading | 82 | 197.89 | 215 | 75.78 | §3 |
| 5 | Body | 82 | 288.63 | 210 | 37.89 | §3 |
| 6 | `Log out` button | 83 | 366.41 | 210 | 52 | §3 |
| 7 | `Cancel` | 166 | 450.17 | 46 | 17.95 | §3 |

The dialog is centred in the frame: its centre is (187.5, 333.5), the frame's centre.

## 2. Dialog box

| Property | Value |
|---|---|
| Size | 285 × 351 |
| Fill | `--color-bg-base` (`#000000`, opaque) |
| Border | 1 px inside, `--color-text-emphasis` (`#FFFFFF`) |
| Radius | 10 |
| Shadow | none |
| Content inset | 37 px from the box's left edge (82 − 45) |

## 3. Contents

| Element | Text | Style |
|---|---|---|
| Heading | `Leaving already?` | Bebas Neue 400, 38 px, line height 38 px, letter spacing 1 px, `--color-text-emphasis`, left-aligned, wraps to two lines in its 215 px box (`LEAVING` / `ALREADY?` — Bebas Neue has capitals only; the source string keeps its case) |
| Body | `Your trophies will be here when you get back.` | Space Grotesk 400, 15 px, line height 100%, `--color-text-emphasis`, left-aligned, wraps to two lines in 210 px |
| `Log out` | `Log out` | Button 210 × 52, radius 10, fill **`--color-error`** (`#FF6467`), `--shadow-sm` (x 0, y 1, blur 3, black 12%), horizontal padding 16; label Space Grotesk **500**, 16 px, `--color-text-emphasis` (white), centred. It is not the accent-green primary button. |
| `Cancel` | `Cancel` | **Plain text button** — no fill, no border, no radius. Space Grotesk 400, 14 px, line height 100%, `--color-text-emphasis`, centred horizontally in the dialog. Its hit area is at least 44 px tall (padding, not visible chrome). |

Vertical rhythm, from the dialog's top (y 158): heading +39.89, body +130.63, `Log out`
+208.41, `Cancel` +292.17.

## 4. Behaviour

- Opens from the profile's `Log out` link; focus moves into the dialog (first focusable:
  `Log out`) and is trapped there while open.
- `Cancel`, Escape, and a click on the overlay close it without logging out, returning focus
  to the `Log out` link.
- `Log out` ends the session as sprint 2 requirement 12 already defines.
- The dialog is centred in the **viewport** at every size (horizontally and vertically), not
  pinned to a corner. If the platform `<dialog>` element is used, its default margins and inset
  must not push it to the top-left.

## 5. Widths other than 375

- Dialog width `min(285 px, viewport width − 32 px)`; height grows with content if the width
  shrinks. At 320 wide the dialog stays 285 (320 − 32 = 288).
- Always centred in the viewport; the overlay always covers the whole viewport.

## 6. New tokens

None. Every colour here is an existing token.

## 7. Checks (LiveQA and QA1)

At 375 × 667, signed in, after pressing `Log out` on the profile. Tolerance ±2 px.

1. A full-viewport overlay dims the profile: black at 70% (a sampled background pixel is
   30% of its undimmed value).
2. Dialog box: 285 × 351, centred in the viewport (at 375 × 667: left 45, top 158), black
   fill, 1 px white border, radius 10.
3. Heading `Leaving already?` in Bebas Neue 38 px, two lines, left edge at x 82.
4. Body in Space Grotesk 15 px, white, left edge at x 82.
5. `Log out` is a 210 × 52 button in `#FF6467` with white 16 px medium text, top at y 366.
6. `Cancel` is plain white 14 px text with no fill or border, centred, top at y 450.
7. The dialog is centred at 320 wide and on desktop, never pinned top-left.
8. Escape, overlay click and `Cancel` close without logging out; focus returns to the
   profile's `Log out` link.
9. Visual comparison with `docs/design/frames/frame-8.14-log-out-confirmation@2x.png` at 375
   shows the same dialog (the profile underneath may differ, since its full design is a later
   sprint).
