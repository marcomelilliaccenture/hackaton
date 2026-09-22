# Accenture FY26 — Voice Canon

> **Embedded snapshot inside the `accenture-design-pptx` skill.** Generic Accenture professional-consulting voice guidance for any deck built from the Accenture FY26 template. Companion canon: [`BRAND.md`](./BRAND.md), [`VISUAL.md`](./VISUAL.md). Project-specific voice (industry-specific acronyms, named methodologies, banned phrases tied to a single practice) should be layered on top of this canon by the host project — not introduced here.

---

## Scope

Accenture decks ship to senior client executives, business and technology decision-makers, internal practitioners, and partner audiences. The voice that lands across all of those readers shares a core register: **clear, professional, grounded in evidence, respectful of the reader's time**.

This file documents that core. Anything more specific (industry jargon, methodology vocabulary, a project's banned-phrase list) belongs in a project-layer voice file, not here.

---

## Identity in one sentence

**Clear, evidence-grounded, action-oriented.** Specificity is the currency; vagueness reads as either lack of preparation or sales pitch.

---

## Formality level

**Professional, not corporate.** One step below academic writing, one step above conversational.

| Indicator | Target |
|---|---|
| Contractions | Avoid in body text. Acceptable in short qualifiers (`don't`, `won't`) when they aid flow. |
| Person | Third person preferred. Second person ("you") in process / how-to instructions only. First person plural ("we") in client-facing executive summaries only. |
| Sentence length | Most sentences 12–22 words. Short fragments allowed in bullets, callouts, and statement slides. |
| Vocabulary | Precise and technical when the content demands it — but expand every acronym on first use. |
| Tone | Confident without overselling. Skeptical of unverified claims rather than enthusiastic about them. |

---

## Personality traits (in priority order)

1. **Direct** — short sentences, no hedging, no throat-clearing.
2. **Evidence-bound** — every load-bearing claim either cites a source or is flagged as needing verification.
3. **Specific** — name the thing. "Productivity gains" is filler; "12 % effort reduction on greenfield work, measured over two sprints" is the version that earns its place on the slide.
4. **Action-oriented** — what the reader should do, when, and with which gate or owner. Not abstract strategy.
5. **Respectful of expertise** — assume the reader is senior, fluent in their field, and short on time.

---

## Sentence rhythm

House pattern: **claim → qualifier → action**.

> *"Cloud migration reduced run-time costs by 28 %. The saving holds only when right-sizing is enforced. Audit instance sizes quarterly."*

Rhythm rules:

- Open with the bottom line, not the setup.
- One claim per sentence; chain claims with periods, not "and / but / however".
- Use `·` (middle dot, U+00B7) as a separator between parallel items where commas would be ambiguous.
- Use `→` for sequences (`Discover → Design → Deliver`).
- Use `:` to introduce a definition, qualifier, or short example.
- **Em-dashes `—` are reserved for genuine parentheticals; ≤ 2 per 500 words; never as a generic separator.**
- Bullets that introduce a category start with a bold inline label: **Discover** — interview business stakeholders, document constraints, agree on success metrics.

Vary paragraph length deliberately. Single-line emphasis paragraphs land harder than dense blocks; consecutive same-length paragraphs read as filler.

---

## Universally banned phrases

These are consulting-speak filler that the audience reads as lack of substance. **Hard ban.** When the urge to use one appears, replace with the specific thing.

| Banned | Why | Replace with |
|---|---|---|
| **leverage** (as verb) | Generic; says nothing | use, apply, draw on, build on |
| **unlock potential** | Marketing-hype | describe the specific benefit with a number |
| **game-changer** | Empty superlative | describe the specific impact |
| **paradigm shift** | Hollow buzzword | name the specific change |
| **cutting-edge** / **state-of-the-art** | Lazy superlatives | name the capability and the date it became available |
| **seamless** | Implies it just works (rarely true) | describe the actual experience |
| **robust** | Empty positive adjective | name what makes it robust |
| **streamline** | Vague | name what it actually simplifies |
| **empower** | Corporate-speak | name the specific capability granted |
| **holistic** | Hand-wave | name what is covered |
| **synergy** | Always wrong | name the specific benefit of combining the two things |
| **delve into** / **delve deeper** | AI-tell | examine, look at, study |
| **fast-evolving landscape** | Filler | "tools change in months; re-evaluate quarterly" or similar specifics |
| **in today's [X] world** | Throat-clearing | start with the claim |
| **in conclusion** / **to sum up** | Throat-clearing close | deliver the conclusion without announcing it |
| **It is worth noting that…** | Filler | cut and state the thing |
| **Needless to say…** | Filler | cut |
| **When it comes to…** | Filler | start with what you want to say |
| **The future is bright** | Empty optimism | make a specific prediction with a timeframe |
| **AI-driven transformation** (and similar X-driven Y formations) | Generic | name what specifically is changing |
| **best-in-class** / **world-class** | Unverifiable | cite a benchmark or ranking |
| **deep dive** | Filler | "an examination of", "a closer look at" |
| **moving the needle** | Empty | name the metric and the change |
| **at the end of the day** | Filler | cut |

Project-specific banned-phrase lists may **extend** this list. They may not soften it.

---

## Forbidden constructions

- **"Not X but Y" rhetorical reflex** (*"Not about technology, about people…"*) — replace with a specific positive claim.
- **Three-point pattern habit.** Not every section needs exactly three points. Use what the content demands — two, four, five — and vary.
- **All paragraphs same length** — vary deliberately. Single-line emphasis paragraphs land harder than uniform blocks.
- **Closing on a generic restatement.** End on the most actionable, most surprising, or most specific sentence — never a summary of what was said.

---

## Required citation patterns

Every load-bearing number must carry its source inline. The audience must see the citation at the moment they read the claim — never relegated to a sources slide at the end.

| Pattern | Example |
|---|---|
| `(source: filename)` | *"Adoption reached 64% across the pilot population (source: pilot-Q3-report)"* |
| `(Vendor YEAR)` | *"Cloud spend grew 19% year-on-year industry-wide (Gartner 2025)"* |
| `[Vendor]: claim` | *"Anthropic: agent reliability improves by 3× with structured tool use"* |
| `[Client]: claim` (anonymised) | *"[Bank A]: deployment frequency rose from weekly to daily within two quarters"* |

Numbers without a source receive `[needs verification]` until grounded. Numbers without either a source or that flag do not ship.

---

## Acronym discipline

**Expand every acronym on first use inside the deck**, not just in supporting documents. The audience cannot consult an appendix while reading a slide.

Format on first use: `Full Expansion (ACRONYM)`. Example: *"Total Cost of Ownership (TCO)"*. Subsequent uses can be the acronym alone.

When in doubt about whether an acronym is universally understood, expand it. Over-expansion costs five characters; under-expansion costs the reader's attention.

Project-specific acronyms (industry jargon, methodology names, internal frameworks) should be expanded once per deck in the same format. Maintain a project-side list if the practice has more than a handful.

---

## Warning callouts

When a deck includes a benchmark, projection, or measurement that the reader could read as a promise or guarantee, pair it with an inline `⚠` warning **immediately under** the number.

> *"⚠ Pilot result, n = 12. Do not extrapolate without re-measurement at scale."*

> *"⚠ Vendor-reported. Independent measurement pending."*

> *"⚠ Result depends on baseline maturity; lower-maturity environments saw smaller gains."*

Warning rules:

- The warning sits **directly under** the number it qualifies, in the template's pink accent (`#FF50A0`). Never in a separate "caveats" section at slide-deck end.
- **Bare text + `⚠` + accent color.** No background fill, no badge, no icon other than `⚠`.
- Use them **only** when the claim has a misread-as-promise risk. Over-warning trains the reader to ignore them.

---

## Closing-line discipline

The last sentence on every slide — and every section — is the one the reader remembers. Treat it as the unit of work.

- Close on the most actionable or most surprising sentence.
- Never start with "In conclusion", "To sum up", "Finally", "Lastly", or equivalent.
- Avoid restating what was just said. The reader read it.
- For deck-level closing slides: lead with the action the audience should take, the decision required, or the single number that matters.

---

## Citation hygiene (when sources are listed at the back)

Most decks should not have a separate sources slide — citations belong inline. If a deck must include a back-page sources list (compliance requirement, long report):

- Use a consistent citation style throughout (Vendor YEAR, or `(source: …)`, not both)
- Link inline citations to the back-page entries by short reference
- The back-page list is **never** a substitute for inline citation, only a supplement

---

## Self-audit checklist

Before any deck ships, the author runs:

- [ ] Every load-bearing number carries an inline citation
- [ ] Every acronym is expanded on first use (Full Expansion + Acronym in parens)
- [ ] No universally banned phrases (grep the section above)
- [ ] Em-dash count ≤ 2 per 500 words of body text
- [ ] Every benchmark with misread-as-promise risk has a `⚠` callout in pink (`#FF50A0`)
- [ ] No slide closes with "In conclusion" or equivalent
- [ ] No sentence runs longer than 25 words (cap, not target) without a punctuation break
- [ ] Speaker notes present on every content slide

---

## What this file does **not** contain

- Visual rules (colors, type, layout, logo) → [`VISUAL.md`](./VISUAL.md)
- Brand identity, audience, content pillars → [`BRAND.md`](./BRAND.md)
- Project-specific acronym lists, methodology vocabulary, named-client casing → host project adds these on top, never inside this skill

This file is **generic Accenture deck voice canon**. Layer project specifics on top; never override.
