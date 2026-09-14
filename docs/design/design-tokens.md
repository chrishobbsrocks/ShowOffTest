# Showoff design tokens — verbatim from Figma

Source: file `pKPcNRMWgms1Y6L80jdGNV`, page `_Design System`.
Captured by Master Controller from the `CSS variables`, `Tailwind config`,
`Typography` and `Google Fonts import` sections **as literal text node
content**, not transcribed from a rendered image.

Figma's MCP is rate-limited on this seat, so this file is the source of record
until access returns. **Copy from here. Do not retype.**

---

## Colour — CSS variables (verbatim)

```css
:root {
  --color-bg-base: #000000;
  --color-bg-surface: #0A0A0A;
  --color-border-default: #404040;
  --color-accent: #B4FF00;
  --color-text-default: #FAFAFA;
  --color-text-emphasis: #FFFFFF;
  --color-text-subtle: #A3A3A3;
  --color-text-secondary: #9A9590;
  --color-error: #FF6467;
  --color-error-text: #FDBDBE;
}
```

## Colour — Tailwind config (verbatim)

```js
colors: {
  'bg-base': '#000000',
  'bg-surface': '#0A0A0A',
  'border-default': '#404040',
  'accent': '#B4FF00',
  'text-default': '#FAFAFA',
  'text-emphasis': '#FFFFFF',
  'text-subtle': '#A3A3A3',
  'text-secondary': '#9A9590',
  'error': '#FF6467',
  'error-text': '#FDBDBE',
}
```

## Spacing and shape (verbatim from the tokens table)

| Token | Value | Usage |
|---|---|---|
| `radius-input` | `8px` | Input fields |
| `radius-button` | `10px` | All buttons |
| `padding-input-x` | `12px` | Input horizontal padding |
| `padding-input-y` | `4px` | Input vertical padding |
| `shadow-xs` | `0px 1px 2px rgba(0,0,0,0.10)` | Input fields |
| `shadow-sm` | `0px 1px 3px rgba(0,0,0,0.12)` | Buttons |
| `border-width` | `1px` | All bordered elements |

## Fonts (verbatim)

```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@400;500&display=swap');
```

The design system's own note, verbatim:

> Two typefaces. Bebas Neue is display-only — above the fold, titles only.
> Space Grotesk handles everything else.

## Type tokens seen in the component specs

These appear by name in the component definitions. Sizes are as written there.

| Token | Value |
|---|---|
| `type-input` | Space Grotesk 400, 14px / 24px |
| `type-button` | Space Grotesk 500, 16px |
| `type-body` | Space Grotesk 400, 15px |
| `type-link` | Space Grotesk 400, 14px |
| `type-caption` | Space Grotesk 400, 12px |
| `type-legal` | Space Grotesk 400, 10px |
| `type-error` | Space Grotesk 400, 11px / 100% |

**`type-error` resolved 2026-09-12.** The Typography table on `_Design System`
renders its last three rows illegibly, so the value was read from the live error
text node `Need at least 2 characters.` on frame 1.05 (Figma Properties panel):
Space Grotesk, weight 400, 11px, line height 100%, colour `#FDBDBE`
(`--color-error-text`).

---

## Component values, for the sprints that need them

Captured from the same source. Not needed for sprint 0, but recorded here so
sprint 1 does not need Figma either.

**Input** — 44×286, bg `--color-bg-surface`, 1px border, radius 8px,
padding 12/4, `shadow-xs`, `type-input`, overflow hidden with text-ellipsis.

| State | Border | Text |
|---|---|---|
| Default | `--color-border-default` | `--color-text-subtle` (placeholder) |
| Filled | `--color-border-default` | `--color-text-default` |
| Focused | `--color-accent` | `--color-text-emphasis` |
| Error | `--color-error` | `--color-text-emphasis` |

Error message renders inline below the field at `type-error`,
`--color-error-text`, 6px gap.

**Button, primary** — 52×286, bg `--color-accent`, text `--color-bg-base`,
radius 10px, `shadow-sm`, `type-button`.

**Button, secondary** — 52×284, transparent, 1px `--color-accent` border,
text `--color-accent`, radius 10px, `shadow-sm`, `type-button`.

**Avatar picker** — horizontal scroll, `scroll-snap-type: x mandatory`,
`scroll-snap-align: center`, avatars 68×68, gap ~15px (83px centre to centre),
left padding 45px, 10 items, selection `box-shadow: 0 0 0 2.5px` accent,
scrollbar hidden.

---

## Rebuild additions (Master Controller, from the live Figma frames)

Recorded 2026-09-14 while writing the frame specs in `docs/design/frame-spec-*.md` (D-64).
These colours appear on design frames but not in the original 17-token set above. Each
becomes a named token in the token stylesheet; components use the name, never the hex. The
verbatim sections above, and the sprint 1 drift test that reads them, are unchanged.

| Token | Value | Figma source | Used for |
|---|---|---|---|
| `--color-bg-landing-hero` | `#251F1F` | frame `1.00 - Landing` fill | Landing hero stage background |
| `--color-bg-home-glow` | `#1D4D49` | frame `3.00 - Home - New User` radial gradient, centre stop | New-user home background centre |
| `--color-bg-home-edge` | `#082530` | same gradient, outer stop | New-user home background edge |
| `--color-arena-1-label` | `#4DFAF7` | text `Arena 1 · Warm Up` on 3.00 | Arena 1 label text |
| `--color-tab-bar-border` | `#888888` | `tab bar` component, `Fill + Shadow` layer | Tab bar border |

Translucent blacks on these frames (overlays, cards, speech tags, shadows, tab bar fill) are
`--color-bg-base` with an opacity, not separate tokens. Colours inside exported SVG assets
under `public/` (spotlight, host bust) are part of those assets and are not tokens.
