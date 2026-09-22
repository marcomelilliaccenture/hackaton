# Accenture FY26 — Visual Identity Canon

> **Embedded snapshot inside the `accenture-design-pptx` skill.** This file is the visual contract for every deck built from the Accenture FY26 PPTX template. Companion canon: [`BRAND.md`](./BRAND.md), [`VOICE.md`](./VOICE.md). All rules below are derived from the template's own brand guideline slides (template slides 7–19 and 29) and are corporate-Accenture canon, not project-specific.

---

## Source of truth

The visual canon below is what the template itself documents:

| Template slide | Owns |
|---|---|
| 8 | Brand ethos |
| 9 | Color — intro and core purple |
| 10 | Color — purple spectrum (`#460073` → `#E6DCFF`) |
| 11 | Neutral & secondary colors |
| 12 | Color usage ratios (light / dark mode breakdowns) |
| 13 | Deck color composition (35% dark / 20% purple / 45% white) |
| 14 | Typography (Graphik Semibold / Medium / Regular) |
| 15 | Accenture logo lockups (on-black / on-white) |
| 16 | Logo breathing room (100% chevron-height clear space) |
| 17 | Logomark don'ts |
| 18 | Note on gradients (new approved gradient; old gradients deprecated) |
| 19 | Brand guidelines link |
| 24 | What imagery can be used (Brand Space / Stock / Client) |
| 25 | "Be bold with creative work" — full-bleed vs content layout |
| 26 | Partner lockup guide |
| 29 | Type ramp reference (sizes per role) |

If a rule in this file ever conflicts with what those template slides actually show, the template slides win — they are the original canon.

---

## Color tokens

| Token | Hex | Role |
|---|---|---|
| `bg/dark` | `#0A0011` | Near-black background (dark mode) — covers, dividers, statement slides, emphasis |
| `bg/light` | `#FFFFFF` | White background (light mode) — default for content slides |
| `accent1` | `#460073` | Darkest purple — used on charts, deep accents |
| `accent2` | `#7500C0` | Dark purple — purple section dividers, vivid emphasis |
| `accent3` | `#A100FF` | **Core Accenture purple** — primary brand accent |
| `accent4` | `#C2A3FF` | Light purple — secondary accents, chart fills |
| `accent5` | `#E6DCFF` | Lightest purple — tertiary fills, light accents |
| `accent6` | `#FF50A0` | Pink — secondary, reserved for emphasis / warning patterns |
| `text/dark` | `#0A0011` | Body text on light slides |
| `text/light` | `#FFFFFF` | Body text on dark slides |

**Rule:** any color used in a deck must come from this list. No off-token colors. If a chart needs more than five fills, ramp through the purple spectrum (`#460073` → `#7500C0` → `#A100FF` → `#C2A3FF` → `#E6DCFF`); do not introduce a new hue.

---

## Usage ratios

Per the template's own slide 12 and slide 13:

### Per slide composition

- **60–70% neutrals** (`#FFFFFF` or `#0A0011` depending on mode)
- **30–40% purples** (`accent1` through `accent5`)
- **< 5% secondary** (`accent6` pink — emphasis only, never decorative)

### Per deck composition (recommended)

- **~45% white slides** (light mode content)
- **~35% dark slides** (cover, section dividers, statements, closer)
- **~20% purple-accented slides** (chart fills, callouts, occasional vivid dividers)

Avoid all-dark or all-light decks — the template is designed around the contrast between the two modes.

---

## Modes

The template ships three modes. Most layouts have parallel light / dark variants; purple is reserved for emphasis.

| Mode | Background | Body text | Default use |
|---|---|---|---|
| **Light** | `#FFFFFF` | `#0A0011` | Default for content slides |
| **Dark** | `#0A0011` | `#FFFFFF` | Covers, section dividers, statement slides, closer, Q&A |
| **Purple** | `#7500C0` or `#460073` | `#FFFFFF` | Vivid section dividers, occasional emphasis. Use sparingly — ≤ 2 purple slides per deck |

**Within a sub-section, do not mix modes.** A light-mode content block stays light; the divider that precedes it can be dark or purple. Drifting light → dark → light inside the same topic reads as inconsistency, not variety.

---

## Typography

### Type stack

| Role | Font | Weight |
|---|---|---|
| Headlines (H1) | **Graphik** | Semibold |
| Subheads (H2 / H3) | **Graphik** | Medium |
| Body, table cells, bullets | **Graphik** | Regular |
| Eyebrow label | **Graphik** | Regular, all-caps, tracked |

**Fallback if Graphik is unavailable:** Inter (same weights). Never substitute Arial, Calibri, or Helvetica Neue — they break the template's measured rhythm.

### Type ramp (16:9, 1920 × 1080)

From the template's own type ramp reference (slide 29):

| Element | Size |
|---|---|
| H1 | 80 pt |
| H2 | 60 pt |
| H3 | 42 pt |
| H4 | 26 pt |
| Subhead 1 | 20 pt |
| Subhead 2 | 16 pt |
| Body (default) | 14–18 pt depending on density |
| Caption / source attribution | 10–12 pt |

Headlines and subheads use the template's exact sizes. Body text can flex within the 14–18 pt range to fit the slide's content density.

---

## Layout grid

- Slide ratio: **16:9** (1920 × 1080 PowerPoint default)
- **12-column grid** with **24 px gutters**
- **Margins:** 80 px top / bottom, 96 px left / right
- Base spacing unit: 0.25" (≈ 8 px)
- Spacing scale: 8 / 16 / 24 / 32 / 48 / 64 / 96 px

The 194 template layouts are pre-built on this grid. Stay within them — do not re-cut a slide to a custom grid.

---

## Logo

### Lockup

The Accenture lockup is **always the chevron mark (`>`) + wordmark together**, never separated. Two approved variants:

- **On black** (use over dark backgrounds, photography with dark scrim)
- **On white** (use over light backgrounds)

### Clear space

Maintain **100% of the chevron's height** as clear space on every side of the logo. The template's slide 16 illustrates this.

### Logo don'ts (per template slide 17)

- **Do not rotate** the logo at any angle
- **Do not stretch** or distort the proportions
- **Do not recolor** the logo (no custom purple, no white-on-purple variants, no gradient fills)
- **Do not place over photography** without first applying a `#0A0011` 40 % scrim under the logo position to guarantee contrast
- **Do not crop** the logo or remove the chevron from the lockup
- **Do not add effects** (drop shadows, outer glow, embossing, outlines)

### Footer placement

Most content slides carry the logo bottom-left in the footer. The template provides this placeholder; do not delete it when editing slides. If you build a slide that needs maximum visual real estate (full-bleed image, statement slide), the logo can move to the cover and closer instead — but the deck overall must still carry Accenture branding.

---

## Gradient rule

The template's slide 18 documents this explicitly:

- **One approved gradient.** It is the new FY26 gradient shown approved (with a ✓) on slide 18.
- **All older purple gradients are deprecated.** Never introduce a custom gradient.
- **Default to flat fills** before reaching for the gradient — gradients are for hero / cover treatments, not body slides.

---

## Imagery (per template slides 24 and 25)

The template names three imagery sources:

1. **Brand Space imagery** — first preference. Accenture-curated, on-brand photography and abstract assets.
2. **Stock imagery** — acceptable when Brand Space does not cover the need. Choose context-appropriate, non-generic shots.
3. **Client imagery** — when the deliverable is for a specific client and they have provided their own assets.

### Imagery rules

- **Avoid generic "people in meetings" stock.** It signals lack of intent.
- **Avoid decorative AI imagery** (glowing brains, abstract neural visualizations, robotic hands holding light bulbs). When the content is about AI / data / technology, use diagrams or data visualizations instead.
- **Be bold with creative work.** The template prefers full-bleed images (template slide 25) over small inset photographs when imagery is used at all.
- **Photography always pairs with sufficient contrast** for any text or logo overlay (use the `#0A0011` 40% scrim if needed).

When in doubt, **omit the image and let the typography breathe**. Whitespace is part of the visual identity.

---

## Density principle

Per the template's own layout philosophy:

- **One idea per slide.** If a slide has two arguments, it should be two slides.
- **3–7 supporting elements** per slide. If you need eight or more bullets, split the slide.
- **Whitespace is a feature**, not empty space to fill.

Test: can you describe the slide's purpose in one sentence without using "and"? If not, the slide is doing too much.

---

## Partner / co-branded slides (per template slide 26)

When a deck includes a partner or client logo alongside Accenture:

- Both logos sit on the **same baseline** with equal optical weight
- **Clear space rule applies to both logos**, using each brand's own clear space rule (typically 100% of the smallest height)
- A vertical divider at 50 % opacity may separate the two — template slide 26 illustrates approved separator styles
- Never place the partner logo over Accenture's wordmark or vice versa
- Logo wall slides (template 88 / 89) follow their own grid; partners sit on a uniform baseline and are sized equally regardless of relative brand size

---

## Cross-template principles (non-negotiable across every Accenture deck)

These hold regardless of which sub-template variant is in use:

1. **Charts over screenshots.** Never screenshot an Excel chart. Generate the chart in the slide using the template's chart components.
2. **Numbers are the hero.** Large stat callouts (60–72 pt) with short descriptors. Citations sit directly under the number, never in a separate sources slide.
3. **Section indicator on every content slide.** The template provides the eyebrow placeholder (`0X · Section Name`). Fill it. Never delete it.
4. **One accent color per slide.** Use accent for emphasis, not decoration.
5. **No three-or-more font sizes on one slide.** Hierarchy needs only Title / Subtitle / Body.

---

## What this file does **not** contain

- Project-specific content rules (audience, pillars, voice) → those live in [`BRAND.md`](./BRAND.md) and [`VOICE.md`](./VOICE.md), or are added by the host project on top of this canon.
- Slide-by-slide layout descriptions → see [`../slide-index.md`](../slide-index.md) (full catalog) and [`../slide-selection.md`](../slide-selection.md) (picker).
- Editing mechanics (unpack, edit, pack) → see [`../edit-workflow.md`](../edit-workflow.md).

This file is the **visual contract** for the Accenture FY26 template. Layer project-specific brand content on top of it; never override it.
