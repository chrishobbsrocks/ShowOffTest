# Frame spec — 1.00 Landing

**Source:** Figma file `pKPcNRMWgms1Y6L80jdGNV`, page `Game UI`, frame `1.00 - Landing`
(node `71:5054`), 375 × 667. Read layer by layer from the Properties panel in view mode
on 2026-09-14 by Master Controller (D-64). Pixel positions marked *measured* come from
the frame's own 2× export (`docs/design/frames/frame-1.00-landing@2x.png`), divided by 2.

**Build from this file.** Dev Team has no Figma access; where this file and the reference
image disagree, this file wins and the difference is a spec defect to raise with Master
Controller. Copy is authoritative in `docs/copy/screen-copy.md` (Landing section); this
file only places it.

All coordinates are CSS px inside a 375-wide design, origin top-left of the frame.

---

## 1. Structure

The screen is two stacked regions in a single centred column:

| Region | Frame y | Height | Background |
|---|---|---|---|
| **Hero stage** | 0–454 | 454 | `--color-bg-landing-hero` (`#251F1F`, new token, §6) |
| **Action panel** | 454–667 | 213 at 375 × 667; grows to fill the viewport below the stage | `--color-bg-base` (`#000000`) |

Omitted from the build (not product content): the iOS status bar (`Group 2`), the
Terms line and `v1.0` (PRD scope, D-13).

## 2. Hero stage (375 × 454)

Everything in the stage is positioned absolutely within it. The stage clips its content
(`overflow: hidden`). Layers are listed **back to front** (first = furthest back).

| # | Layer | Asset / content | Left | Top | Width | Height | Notes |
|---|---|---|---|---|---|---|---|
| 1 | Stage background | — | 0 | 0 | 375 | 454 | `--color-bg-landing-hero` |
| 2 | Spotlight glow | `public/landing/spotlight.svg` | 0 | 0 | 375 | 667 | The SVG is exported in frame coordinates (viewBox `0 0 375 667`): place it at the stage origin at natural size and let the stage clip it. It carries its own gradient, 34 px blur, 72% opacity and `mix-blend-mode: plus-lighter`. Do not recreate it in CSS. |
| 3 | Logo | `public/brand/show-off-logo.svg` | 0 | 46 | 375 | 333 | Natural size, no scaling. Its lettering (ink) then spans x 24–354.5, y 81–327 (*measured*). |
| 4 | Tagline | text, see §2.1 | — | — | — | — | Above the logo in stacking order. |
| 5 | Host | `public/host/host-07-sarcastic.png` | 82 | 195 | 210.94 | 258.75 | Full image, not cropped; aspect ratio of the PNG (750 × 920) is exact at this size. In front of the logo (it overlaps the logo's lower-left letters). |
| 6 | Caption box | — | 82 | 404 | 211 | 28 | `--color-bg-base` at 70% opacity. No radius. |
| 7 | Caption text | `Think you know stuff? Let's find out.` | 87 | 411 | 202 | 13 | See §2.2. Centred in the box. |

### 2.1 Tagline — `Earn trophies` ★ `Climb arenas`

One visual line of three pieces, rotated together.

| Property | Value |
|---|---|
| Font | Space Grotesk 400, 15 px, line height 100%, letter spacing 0 |
| Case | Uppercase via `text-transform: uppercase` (source strings stay as in the copy file) |
| Colour | `--color-text-secondary` (`#9A9590`) |
| Rotation | **6.78° counter-clockwise** (Figma `6.78°`; in CSS `rotate(-6.78deg)`) — the line rises to the right |
| Separator | ★ glyph, 8.79 × 8.14, same colour, same rotation |
| Order | `EARN TROPHIES` ★ `CLIMB ARENAS`, single spaces either side of the star |

*Measured* ink bounds of the whole rotated line: left edge ≈ x 23.5 (start of `E`), right
edge ≈ x 255.5 (end of `S`); the left end sits lower (≈ y 76–100) than the right end
(≈ y 61–85). Figma's own boxes for reference: `Earn trophies` box left 21.77, top 54.93,
247 × 19; `Climb arenas` box left 151.04, top 38.96, 247 × 19; star left 136.91, top 74.67.
Those boxes are wider than the text and are Figma rotated-origin values — use the
measured ink bounds for checking, not the boxes.

### 2.2 Caption text

Figma sets this in **Verdana**. That is a design slip: the project uses two typefaces only
(`CLAUDE.md` stack facts, `design-tokens.md`). **Decision: Space Grotesk 400, 11 px, line
height 100%**, colour `--color-text-emphasis` (`#FFFFFF`), centred horizontally in the
caption box and vertically centred on its 28 px height. *Measured* Verdana ink: x 87.5–287.5,
y 414–424; Space Grotesk will differ slightly in width — that is expected.

## 3. Action panel

Content is positioned from the panel's top edge (frame y 454).

| Element | Content | Offset from panel top | Size | Style |
|---|---|---|---|---|
| Primary button | `Get started` → `/signup` | 20 (frame y 474) | 286 × 52, horizontally centred (frame x 45) | Existing primary button: `--color-accent` fill, radius `--radius-button` (10), `--shadow-sm`, label `type-button` (Space Grotesk 500, 16 px) in `--color-bg-base` |
| Log-in prompt | `Already have an account?` then `Log in` → `/login` | 96 (frame y 550) | one line, 18 px tall | Space Grotesk 400, 14 px, line height 100%. `Already have an account?` in `--color-text-emphasis`; `Log in` in `--color-accent`; one space between them. |

**Decision — prompt alignment:** in Figma the line sits 11 px left of centre (*measured* ink
x 67–285.5). Build it **horizontally centred**; that offset is not reproduced.

## 4. Widths other than 375

Figma draws only 375 × 667. Decisions:

- **Column.** The screen is a single column, max width 375, horizontally centred. Outside
  the column the page background is `--color-bg-base`.
- **Below 375 wide** (e.g. 320): the hero stage keeps its 375 × 454 internal layout and is
  scaled uniformly to the column width (scale = viewport width ÷ 375; at 320 that is
  0.8533, stage height ≈ 387.4). Every hero value in §2 scales with it. The action panel
  does **not** scale: the button stays 286 × 52 and centred (it fits at 320 with 17 px each
  side).
- **Above 375 wide:** the stage stays 375 × 454 at 1:1, centred.
- **Taller than 667:** the action panel grows to fill the remaining height; its content stays
  anchored to the panel's top at the offsets in §3.
- No horizontal scroll at any width.

## 5. Accessibility

- The logo image has `alt="Show Off"`. The host image, spotlight and caption box are
  decorative (`alt=""` / `aria-hidden`); the caption and tagline are real text.
- The star separator is `aria-hidden`.
- Focus order: `Get started`, then `Log in`.

## 6. New tokens this frame introduces

Added to `docs/design/design-tokens.md` → "Rebuild additions". Dev Team adds them to the
token stylesheet by name; components use the token, never the hex.

| Token | Value | Used for |
|---|---|---|
| `--color-bg-landing-hero` | `#251F1F` | Hero stage background |

Translucent blacks (caption box 70%) use `--color-bg-base` with opacity, not a new token.

## 7. Checks (LiveQA and QA1)

At a 375 × 667 viewport unless stated. Tolerance ±2 px unless stated.

1. Hero stage occupies y 0–454; below it the background is `#000000` to the bottom of the
   viewport.
2. Logo lettering ink spans x 24–354.5 and y 81–327 (±3 px, the asset's shadow blurs edges).
3. Host image box: left 82, top 195, 210.94 × 258.75 (±1 px); it is drawn in front of the
   logo and behind the caption box.
4. Caption box: left 82, top 404, 211 × 28, black at 70%; caption text centred in it, Space
   Grotesk 11 px, white.
5. Tagline: uppercase, 15 px Space Grotesk, `#9A9590`, rotated so its right end is higher;
   ink left edge x 23.5 ±4, right edge x 255.5 ±4.
6. Spotlight glow is visible behind the logo and host (compare with the reference image);
   it does not appear below y 454.
7. `Get started` button: 286 × 52, top 474, centred, accent fill, radius 10.
8. Log-in prompt: top 550, centred as one line, white text plus accent `Log in`.
9. At 320 wide: stage scaled to 320 × ≈387, no horizontal scroll, button still 286 wide
   and centred.
10. Visual comparison with `docs/design/frames/frame-1.00-landing@2x.png` at 375 shows the
    same composition (status bar, Terms line and `v1.0` excepted).
