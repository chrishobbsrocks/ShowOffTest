# Frame spec — 3.00 Home, new user

**Source:** Figma file `pKPcNRMWgms1Y6L80jdGNV`, page `Game UI`, frame `3.00 - Home - New User`
(node `81:1633`), 375 × 667. Read layer by layer from the Properties panel in view mode on
2026-09-14 by Master Controller (D-64). Values marked *measured* come from the frame's own
2× export (`docs/design/frames/frame-3.00-new-user-home@2x.png`), divided by 2.

**Build from this file.** Where this file and the reference image disagree, this file wins
and the difference is a spec defect to raise with Master Controller. Copy is authoritative
in `docs/copy/screen-copy.md` (New-user home); this file only places it.

All coordinates are CSS px inside a 375-wide design, origin top-left of the frame.

---

## 1. Background

| Property | Value |
|---|---|
| Fill | Radial gradient, Figma default ellipse: centred on the frame, radii = half width × half height |
| Stops | 0% `--color-bg-home-glow` (`#1D4D49`) → 100% `--color-bg-home-edge` (`#082530`) (new tokens, §7) |
| CSS equivalent | `radial-gradient(50% 50% at 50% 50%, var(--color-bg-home-glow) 0%, var(--color-bg-home-edge) 100%)` |
| Extent | Covers the whole viewport, behind everything |

*Measured check points:* frame corners `#082530`; (75, 75) ≈ `#092631`.

Omitted: the iOS status bar (`Group 2`).

## 2. Layers, back to front

| # | Layer | Content / asset | Left | Top | Width | Height |
|---|---|---|---|---|---|---|
| 1 | Card | — | 37 | 165 | 302 | 329 |
| 2 | Heading | 2 lines, §3.1 | 61.27 | 73 | 253 | 84 |
| 3 | Arena label | from the arena definition, §3.2 | 142 | 183 | 93 | 14 |
| 4 | Trophy | 🏆, §3.3 | 159 | 215 | 58 | 58 |
| 5 | Body | §3.4 | 61 | 287 | 254 | 66 |
| 6 | `Let’s play` button | §3.5 | 61 | 374 | 254 | 52 |
| 7 | `See how it works` | §3.6 | 138 | 449 | 98 | 15 |
| 8 | Host bust | `public/host/host-bust-neutral.svg` | 48 | 475 | 99 | 99 |
| 9 | Speech tag 1 box | — | 156 | 504 | 131 | 28 |
| 10 | Speech tag 1 text | `Fresh meat. I like it.` | 165 | 511 | 114 | 13 |
| 11 | Speech tag 2 box | — | 156 | 535 | 144 | 28 |
| 12 | Speech tag 2 text | `Welcome to the Arena.` | 165 | 542 | 127 | 13 |
| 13 | Tab bar | component, §4 | 37 | 585 | 302 | 62 |

The host bust overlaps the bottom edge of the card (card ends at y 494; bust starts at 475)
and is drawn in front of it.

## 3. Elements

### 3.1 Heading — `YOUR KNOWLEDGE + YOUR SPEED = YOUR TROPHIES`

Two lines, centred, both Bebas Neue 400, colour `--color-text-emphasis` (`#FFFFFF`),
letter spacing 3% of the font size.

| Line | Text | Size | Line height | *Measured* ink |
|---|---|---|---|---|
| 1 | `YOUR KNOWLEDGE + YOUR SPEED` | 24 px | 44 px | x 62–313, y 85–102 |
| 2 | `= YOUR TROPHIES` | **40 px** | 44 px | x 71.5–305, y 118–146 |

Figma reports the second line as a separate text span; its size was not readable in view
mode and is derived from the measured cap height (28 px ÷ Bebas Neue's 0.7 cap ratio =
40 px). Text shadow: x 2.56, y 2.56, blur 5.13, `--color-bg-base` at 75%.
The line break falls after `SPEED`; the source string stays one string in the copy file.

### 3.2 Arena label — `Arena 1 · Warm Up`

Space Grotesk 400, 11 px, line height 100%, centred. Colour `--color-arena-1-label`
(`#4DFAF7`, new token, §7). The text comes from the arena definition for the player's arena
(always Arena 1 on this screen).

### 3.3 Trophy

A 58 × 58 image of the 🏆 emoji. Figma's view-only export returns this image fill as blank,
so there is no asset. **Decision:** render the Unicode character `🏆` as text, `aria-hidden`,
sized so the glyph fills the 58 × 58 box (font-size 52 px, line height 58 px, centred).
Appearance follows the device's emoji font; on Apple devices it matches the design exactly.

### 3.4 Body

`10 questions. 1 opponent. The faster you answer correctly, the more you score. Climb the arenas...if you can.`
Space Grotesk 400, 14 px, line height 22 px, colour `--color-text-emphasis`, **left-aligned**
in a 254 px box (wraps to 3 lines). *Measured* ink x 62–305.5, y 293–349.5.

### 3.5 `Let’s play` button

The existing primary button at 254 × 52: `--color-accent` fill, radius 10, `--shadow-sm`,
label `type-button` (Space Grotesk 500, 16 px) in `--color-bg-base`, horizontal padding 16.
Note the curly apostrophe in `Let’s`. Goes to `/play`.

### 3.6 `See how it works`

Text link, not a button. Space Grotesk 400, 12 px, line height 100%, centred,
`--color-accent`. No underline. Goes to `/tutorial`.

### 3.7 Card

Radius 10. Fill `--color-bg-base` at **30.6%** opacity (Figma: fill 36% inside a layer at
85%). No border, no shadow.

### 3.8 Host bust and speech tags

- **Bust:** `public/host/host-bust-neutral.svg`, 99 × 99, natural size. It already contains the
  dark circle (`#030900`) and the portrait; do not add a circular crop or border.
- **Speech tag boxes:** `--color-bg-base` at 70%, no radius.
- **Speech tag text:** Figma uses **Verdana** (design slip, as on 1.00). **Decision:** Space
  Grotesk 400, 11 px, line height 100%, `--color-text-emphasis`, left-aligned 9 px from the
  box's left edge, vertically centred in the 28 px box.

## 4. Tab bar (shared component)

This is the `tab bar` component. The same spec applies on every screen that shows it; only
the active tab changes. On 3.00 the active tab is **Home**.

| Part | Value |
|---|---|
| Container | 302 × 62, fully rounded (radius 31 px, Figma `296` clamps to a pill) |
| Fill | `--color-bg-base` at 50% |
| Border | 1 px `--color-tab-bar-border` (`#888888`, new token, §7). Figma also lists a "Glass Effect" layer whose parameters are not readable in view mode: **decision** — add `backdrop-filter: blur(12px)`; treat it as visual, not checked to the pixel |
| Shadow | x 0, y 8, blur 40, `--color-bg-base` at 12% |
| Items | Three equal columns, left to right: Home, Leaderboard, Profile |
| Label boxes | 86 × 12 at x 14, 108, 202 (from the container's left), top 39 |
| Labels | `Home`, `Leaderboard`, `Profile`; Space Grotesk **500**, 10 px, line height 12 px, centred |
| Icons | 24 × 24, top 11; left 45, 139, 233 (centred over each label) |
| Icon assets | `public/icons/tab-home.svg` (lucide home), `public/icons/tab-trophy.svg` (lucide trophy), `public/icons/tab-user-circle-02.svg` (hugeicons user-circle-02). Strokes are `currentColor`, stroke width 2. Inline them (or use them as masks) so the colour follows the text colour. |
| Active item | Icon and label `--color-accent` |
| Inactive items | Icon and label `--color-text-subtle` (`#A3A3A3`) |
| Position | Horizontally centred; bottom edge 20 px above the viewport bottom (frame top 585 + 62 = 647; 667 − 647 = 20). Fixed to the viewport, above page content; the page reserves space so nothing scrolls under it unreachably. |
| Semantics | `nav` with the three links; the active link has `aria-current="page"` |

## 5. Widths and heights other than 375 × 667

- **Column:** content column max width 375, centred; the gradient background covers the full
  viewport.
- **Card, button and tab bar width:** `min(302 px, viewport width − 32 px)` for the card and
  tab bar; the button and body keep 24 px inset from the card's sides (254 = 302 − 48), so at
  320 wide the card is 288 and the button and body are 240. Horizontal centring is kept.
- **Vertical:** the heading, card and host row keep the Figma top offsets at every height.
  The tab bar stays fixed 20 px above the bottom. On viewports shorter than 667 the page
  scrolls; content never sits behind the tab bar without being scrollable into view.
- No horizontal scroll at any width.

## 6. Accessibility

- Host bust and trophy are decorative (`aria-hidden` / empty `alt`); speech tags are real text.
- Focus order: `Let’s play`, `See how it works`, then the tab bar links.

## 7. New tokens this frame introduces

Added to `docs/design/design-tokens.md` → "Rebuild additions".

| Token | Value | Used for |
|---|---|---|
| `--color-bg-home-glow` | `#1D4D49` | Background gradient centre |
| `--color-bg-home-edge` | `#082530` | Background gradient edge |
| `--color-arena-1-label` | `#4DFAF7` | Arena 1 label text |
| `--color-tab-bar-border` | `#888888` | Tab bar border |

Translucent blacks (card, speech tags, tab bar fill, shadows) use `--color-bg-base` with
opacity, not new tokens.

## 8. Checks (LiveQA and QA1)

At a 375 × 667 viewport, signed in as a player with no matches, unless stated. Tolerance
±2 px unless stated.

1. Background is the radial gradient: centre close to `#1D4D49`, corners `#082530`; not black.
2. Heading is two centred lines in Bebas Neue: line 1 ink y 85–102 at 24 px, line 2 ink
   y 118–146 at 40 px, both white with a dark shadow.
3. Card box: left 37, top 165, 302 × 329, radius 10, translucent black.
4. Arena label centred at top 183, 11 px, `#4DFAF7`, reading `Arena 1 · Warm Up`.
5. Trophy glyph centred in the box left 159, top 215, 58 × 58.
6. Body: left-aligned, 14 px / 22 px, three lines, box left 61, top 287, width 254.
7. `Let’s play`: 254 × 52 at left 61, top 374, accent fill; `See how it works`: accent text
   link centred at top 449, not a filled or outlined button.
8. Host bust: 99 × 99 circle at left 48, top 475, overlapping the card's bottom edge;
   head-and-shoulders portrait, not a full-body image.
9. Speech tags: boxes 131 × 28 at (156, 504) and 144 × 28 at (156, 535), black 70%, white
   11 px Space Grotesk text.
10. Tab bar: 302 × 62 pill at left 37, top 585 (bottom 20 px above the viewport bottom), icons
    above labels, Home in accent and the other two in `#A3A3A3`, labels 10 px weight 500.
11. At 320 wide: card and tab bar 288 wide, centred, no horizontal scroll.
12. Visual comparison with `docs/design/frames/frame-3.00-new-user-home@2x.png` at 375 shows
    the same composition (status bar excepted; trophy glyph may differ by platform).
