# Brand Rules — Accenture FY26 Deck Author Checklist

Consolidated checklist of BRAND + VOICE + VISUAL rules as they apply to **a slide in an Accenture .pptx**. Generic to all Accenture decks; project-specific rules layer on top.

Embedded canon (read in this order, then come back here):

1. [`brand/BRAND.md`](./brand/BRAND.md) — audience layers, brand posture, anti-audiences, platforms
2. [`brand/VOICE.md`](./brand/VOICE.md) — register, banned phrases, citation patterns, acronym discipline, warning callouts, em-dash budget
3. [`brand/VISUAL.md`](./brand/VISUAL.md) — color tokens, typography, layout grid, logo discipline, gradient rule, imagery

These three files are embedded snapshots — the skill is self-contained and does not depend on any external `brand/*` directory in a host project. This file does not supersede them; if a rule below diverges from the embedded canon, **canon wins**.

---

## 1. Audience register

The host project chooses the audience layer (client executive / client technical / internal practitioner / partner — see [`brand/BRAND.md`](./brand/BRAND.md)). Once chosen, this is the default deck register:

| Don't | Why | Do |
|---|---|---|
| Tutorial scaffolding ("What is X?", "Let's level-set on Y") | Senior audiences already know; junior audiences need a different deck entirely | Open on the operational claim |
| Marketing hype ("game-changer", "unlock potential") | Detected instantly, costs trust | Specific numbers + named sources |
| Single-point projections ("X will reduce cost 30%") | Reads as overconfident | Ranges or scenarios with named assumptions |
| Anonymous "we" without context | Sounds like a sales pitch | Third person; "we" only in client-facing executive summaries |
| Marketing CTAs ("Let's transform together") | Wrong register for Accenture | Operational close: what they should do, when, with which gate or owner |

When the host project picks a non-default audience (e.g., a deck genuinely aimed at a junior practitioner audience), this checklist's posture flexes — but the host project is responsible for documenting the override.

---

## 2. Voice rules per slide

### Sentence rhythm

House pattern: **claim → qualifier → action**.

- Open with the bottom line, not the setup.
- One claim per sentence; chain claims with periods, not "and / but / however".
- Most sentences 12–22 words. Short fragments OK in bullets, callouts, statement slides.
- Vary paragraph length deliberately — single-line emphasis paragraphs are encouraged.

### Punctuation discipline

| Symbol | Use for | Don't |
|---|---|---|
| `·` (U+00B7) | Parallel items where commas would be ambiguous | Generic separator |
| `→` | Sequences (`Discover → Design → Deliver`) | Implication / "therefore" |
| `:` | Introduce a definition, qualifier, or example | List separator |
| `—` (em-dash) | True parentheticals, **≤ 2 per 500 words** | Generic separator (most common voice failure) |
| `⚠` | Warning callouts under benchmarks | Decoration; emphasis on non-warnings |

### Universally banned phrases

Hard ban — grep before audit. Full list with replacements in [`brand/VOICE.md`](./brand/VOICE.md). Highlights:

```
leverage              unlock potential     game-changer      paradigm shift
cutting-edge          state-of-the-art     seamless          robust
streamline            empower              holistic          synergy
delve into            delve deeper         fast-evolving landscape
in today's            in conclusion        to sum up         It is worth noting
Needless to say       When it comes to     The future is bright
AI-driven transformation                   best-in-class     world-class
deep dive             moving the needle    at the end of the day
```

If you catch yourself writing one of these on a slide, stop and replace it with the **specific** thing. Project-specific banned-phrase lists may extend this list; they may not soften it.

### Forbidden constructions

- **"Not X but Y" rhetorical reflex** → replace with a specific positive claim
- **Three-point reflex** — not every section needs three points; use what the content demands
- **All paragraphs same length** — vary deliberately
- **Closing on generic restatement** — end on the most actionable or surprising sentence

---

## 3. Citation patterns (mandatory)

Every load-bearing number on a slide carries its source **inline, immediately below or beside the number**. Patterns from [`brand/VOICE.md`](./brand/VOICE.md):

| Pattern | Example slide text |
|---|---|
| `(source: filename)` | *"Adoption reached 64% across the pilot population (source: pilot-Q3-report)"* |
| `(Vendor YEAR)` | *"Cloud spend grew 19% year-on-year industry-wide (Gartner 2025)"* |
| `[Vendor]: claim` | *"Anthropic: agent reliability improves by 3× with structured tool use"* |
| `[Client]: claim` (anonymised) | *"[Bank A]: deployment frequency rose from weekly to daily within two quarters"* |

Numbers without a source carry `[needs verification]` until grounded. **Never** relegate citations to a "sources" slide — the audience must see them at the moment they read the claim.

---

## 4. Warning callouts (`⚠`)

Every benchmark that could be misread as a promise pairs with a `⚠` callout, immediately under the number, in pink accent (`#FF50A0`).

Patterns:

```
64% adoption
⚠ Pilot result, n = 12. Do not extrapolate without re-measurement at scale.

3× reliability improvement
⚠ Vendor-reported. Independent measurement pending.

19% YoY growth
⚠ Industry average; result depends on starting maturity.
```

Warning rules:

- Bare text + `⚠` + pink accent (`#FF50A0`) for the warning text only
- No background fill, no badge, no icon other than `⚠`
- Lives directly under the number it qualifies — never at slide end as "caveats"
- Only use them when the claim has misread-as-promise risk. Over-warning trains the reader to ignore them.

---

## 5. Acronym discipline

**Expand every acronym on first use inside the deck** in `Full Expansion (ACRONYM)` format. Subsequent uses can be the acronym alone.

Examples (any deck):

```
Total Cost of Ownership (TCO)
Application Programming Interface (API)
Service-Level Agreement (SLA)
Key Performance Indicator (KPI)
```

Project-specific acronyms (industry jargon, internal methodologies, named frameworks) follow the same pattern. The host project maintains its own list. Over-expansion costs five characters; under-expansion costs the reader's attention.

When in doubt: expand.

---

## 6. Visual identity (Accenture FY26)

Full identity card in [`brand/VISUAL.md`](./brand/VISUAL.md). Quick reference:

### Color tokens (only these — no off-token colors)

| Token | Hex | Role |
|---|---|---|
| `bg/dark` | `#0A0011` | Dark mode background |
| `bg/light` | `#FFFFFF` | Light mode background |
| `accent1` | `#460073` | Darkest purple |
| `accent2` | `#7500C0` | Dark purple |
| `accent3` | `#A100FF` | Core Accenture purple |
| `accent4` | `#C2A3FF` | Light purple |
| `accent5` | `#E6DCFF` | Lightest purple |
| `accent6` | `#FF50A0` | Pink — **reserved for `⚠` warnings and rare emphasis** |
| `text/dark` | `#0A0011` | Body on light slides |
| `text/light` | `#FFFFFF` | Body on dark slides |

### Usage ratios (per slide composition)

- 60–70% neutrals (`#FFFFFF` / `#0A0011`)
- 30–40% purples (`accent1`–`accent5`)
- < 5% pink (`accent6`, warnings only)

### Deck-level mode mix (typical)

- ~45% light slides (content body)
- ~35% dark slides (cover, dividers, statements, closer)
- ~20% purple-accented (chart fills, callouts, ≤ 2 vivid purple dividers)

### Typography

| Role | Font | Weight |
|---|---|---|
| Headlines (H1) | Graphik | Semibold |
| Subheads (H2–H3) | Graphik | Medium |
| Body | Graphik | Regular |
| Eyebrow label | Graphik | Regular, all-caps, tracked |

Fallback if Graphik unavailable: **Inter**. Never substitute Arial / Calibri / Helvetica Neue.

### Type ramp (PPTX, 16:9 1920×1080)

| Element | Size |
|---|---|
| H1 | 80 pt |
| H2 | 60 pt |
| H3 | 42 pt |
| H4 | 26 pt |
| Subhead 1 | 20 pt |
| Subhead 2 | 16 pt |
| Body | 14–18 pt depending on density |
| Caption / source | 10–12 pt |

(From template slide 29.)

### Logo

- Chevron `>` + wordmark, always together
- Clear space: 100 % of chevron height on every side
- Never rotate, stretch, recolor, crop, or add effects
- Over photography: requires `#0A0011` at 40 % opacity scrim under the logo position

### Layout grid

- 16:9 slide (1920 × 1080)
- 12-column grid, 24 px gutters
- Margins: 80 px top / bottom, 96 px left / right

### Gradient rule

Only the FY26 approved gradient (template slide 18 shows old vs new). **Old purple gradients are deprecated** — do not introduce.

---

## 7. Eyebrow label discipline

Every content slide carries `0X · Section Name` at the top — provided by the template as a placeholder; you fill it.

```
01 · Context
02 · Approach
03 · Evidence
04 · Roadmap
```

Numeric section code; descriptive section title; middle-dot separator. If the template's eyebrow placeholder is deleted, the deck loses its visual rhythm — re-add it.

Section dividers (template slides 34–41) carry the section number prominently; the content slides that follow re-state it small at the top.

---

## 8. Number-as-hero pattern

Stat slides (template slides 158–164, 105, 135) follow this structure:

```
[ oversized numeric, 60–72 pt, semibold ]
[ short descriptor, 14–18 pt, 1–2 lines ]
[ (source: X) directly under, 10–12 pt ]
[ ⚠ warning if relevant, immediately under that, in #FF50A0 ]
```

Don't decorate the number. The number is the slide. Whitespace around it is intentional — resist the urge to fill it.

---

## 9. Per-slide audit checklist

Before pack, walk every slide through this. Any "no" gets fixed before audit.

- [ ] Eyebrow label filled (no literal `0X · Section Name` remaining)
- [ ] H1 title is specific (no "Our approach" / "Overview" — name what it is)
- [ ] Every number has `(source: X)` directly under it (or `[needs verification]`)
- [ ] Every benchmark with misread-as-promise risk has `⚠` callout in `#FF50A0`
- [ ] First-use acronyms are expanded
- [ ] No banned phrases (cross-grep section 2 list)
- [ ] Em-dash count ≤ 2 per 500 words of body text on the slide
- [ ] No off-token colors (only the ten tokens above)
- [ ] Footer chevron + Accenture wordmark intact (template provides; do not delete)
- [ ] Mode matches the sub-section (light content in a light sub-section, dark in a dark one)
- [ ] No leftover placeholders (`xxxx`, `Lorem`, `Optional`, `Sample`, `$$`, `###`)
- [ ] Closing line (last sentence on this slide) is actionable or surprising — never a restatement

---

## 10. Deck-level audit checklist

Before invoking a final audit, verify deck-level integrity:

- [ ] Cover (template slides 30–33) opens the deck — never a content slide as first slide
- [ ] Section dividers (34–41) precede each major section
- [ ] Closer (42–45) precedes the Q&A pause (46–49), in that order
- [ ] Mode consistency within each sub-section (no light → dark → light flicker)
- [ ] Purple divider (template slide 36) used ≤ 2 times
- [ ] Same column shape used for parallel topics across the deck
- [ ] Speaker notes present on every content slide (not optional)
- [ ] Citations on every load-bearing number across all slides
- [ ] Logo present on every content slide (footer chevron + wordmark)
- [ ] No more than one full-bleed image (slide 90, 92) per 10 content slides — they punctuate, they do not pace

---

## 11. Quality gate

If the host project has `content-audit` available: composite ≥ 80 to ship. Sub-dimensions to expect attention on:

| Dimension | Common failure |
|---|---|
| Voice | Banned phrase slipped in (most common cause); em-dash overuse |
| Anti-slop | Tutorial framing; "agenda" slide as filler; closing on "thank you" |
| Visual consistency | Off-token color in a chart; mode drift inside a sub-section |
| Citations | Number without `(source: X)`; warning missing on misread-as-promise number |
| Acronyms | First-use expansion missed |

If `content-audit` is not installed, fall back to walking sections 9 and 10 manually and surfacing pass / fail to the user. **Do not silently ship.**

---

## 12. Hard don'ts (universally)

- **Don't bypass the quality gate.** Audit composite ≥ 80 (or manual checklist pass) is non-negotiable for a client deck.
- **Don't invent numbers.** Mark unknown numbers `[needs verification]`; never paraphrase from training data.
- **Don't reformat the embedded `brand/VOICE.md` / `brand/VISUAL.md` / `brand/BRAND.md` while drafting other content.** They are canon for this skill. Surgical edits only.
- **Don't ship a deliverable with banned phrases.** Grep the section 2 list before audit.
- **Don't add emoji** beyond `⚠` (warning), `→` (sequence), `·` (separator). No `🚀 ✨ 💡 🎯`.
- **Don't use stock people-at-laptops photography.** Diagrams or no image at all.
- **Don't use decorative AI imagery.** Diagrams over photography for anything technical.
- **Don't recolor the logo.** If a background doesn't allow the natural logo variant, change the background, not the logo.
- **Don't use the old purple gradient.** Template slide 18 shows old vs new — old is deprecated.
- **Don't decorate the warning callout.** Bare text + `⚠` + `#FF50A0`. No badge, no fill, no icon besides `⚠`.

---

## 13. When in doubt

Read [`brand/BRAND.md`](./brand/BRAND.md), [`brand/VOICE.md`](./brand/VOICE.md), [`brand/VISUAL.md`](./brand/VISUAL.md) in that order. They are canon for this skill. This file is a working summary; it can drift. If a rule here contradicts canon, canon wins.

For project-specific rules (industry acronyms, named methodologies, named clients, content territories), the host project layers those on top — not in this file.

---

## 14. Addendum — decks in Italian (hackathon-pitch)

The voice rules above are written for English decks. On an Italian deck they hold as
stated, plus:

### Banned in Italian (same hard ban as §2)

```
rivoluzionario        all'avanguardia      soluzione innovativa    a 360 gradi
chiavi in mano        sinergia             valore aggiunto (as filler)
efficientamento       nell'era digitale    in un mondo sempre piu' ...
cambio di paradigma   best practice (unqualified)   abilitare (as "enable")
sfruttare (as "leverage")                  ottimizzare (without a metric)
in conclusione        per concludere       ultimo ma non meno importante
```

Replace each with the specific thing: *"riduce il triage da 40 a 6 minuti"*, not
*"efficienta il processo"*.

### Italian-specific mechanics

- **Second person plural ("voi") only when addressing the jury directly.** The deck speaks
  in third person about the problem and first person plural about what the team built.
- **No English filler where Italian exists** — *"deliverable", "asset", "committment"* on a
  slide read as consultant-speak. Technical terms that have no Italian equivalent (API,
  prompt, agent, pipeline) stay in English and are expanded on first use.
- **Numbers**: Italian decimal comma (`6,5 minuti`), thousands with a dot (`1.200
  richieste`), `%` attached (`40%`).
- **Citation label**: `(fonte: …)` instead of `(source: …)`; `[da verificare]` instead of
  `[needs verification]`.
- **Accents matter on slides**: *perché, così, più, è* — a headline with `e'` instead of `è`
  is the fastest way to look unfinished.
