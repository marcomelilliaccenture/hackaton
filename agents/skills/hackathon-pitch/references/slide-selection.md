# Slide Selection — Compressed Picker

This file is the fast-lookup picker for the Accenture FY26 PPTX template. Use it during step 4 of `SKILL.md` (deck planning) when you need to map a content intent → a template slide number.

If you need the **full layout description, mode, and "use when" notes**, read [`slide-index.md`](./slide-index.md) — same data, fully detailed across 194 rows.

---

## Decision flow

```
What kind of slide do I need?
│
├── Opening / Cover ──────────→ §1
├── Section break ────────────→ §2
├── Closing / Pause ──────────→ §3
├── Agenda / TOC ─────────────→ §4
├── Statement / quote ────────→ §5
├── Content with N columns ───→ §6
├── Numbered points list ─────→ §7
├── Text + image(s) ──────────→ §8
├── Data viz (chart) ─────────→ §9
├── Timeline / Gantt ─────────→ §10
├── Org chart / map ──────────→ §11
├── Comparison / matrix ──────→ §12
├── Venn diagram ─────────────→ §13
├── Stats / KPI row ──────────→ §14
├── Case study ───────────────→ §15
├── Mockup / device ──────────→ §16
└── Team / CV ────────────────→ §17
```

---

## §1. Cover

| Need | Slide | Mode |
|---|---|---|
| Default opener | **30** | Dark, no logo |
| Light mode opener (printed leave-behind) | 31 | Light |
| Visual opener (with image right) | 32 | Light + image |
| Branded opener with "Accenture" eyebrow | 33 | Dark + eyebrow |
| Client cover letter (text only) | 50 | Light |
| Client cover letter (dark) | 51 | Dark |
| Client cover letter + 2 signatories | 52 | Light |
| Client cover letter + 1 signatory (dark) | 53 | Dark |
| Client cover letter + 2 signatories (dark) | 54 | Dark |

**Default: 30.** Switch to 32 when the cover needs a hero image.

---

## §2. Section divider

| Need | Slide | Mode |
|---|---|---|
| Standard dark divider with number | **34** | Dark |
| Same, duplicate variant | 35 | Dark |
| Vivid purple divider with number | 36 | Purple (max 2 per deck) |
| Light mode divider with number | 37 | Light |
| Same, duplicate variant | 38 | Light |
| Dark divider, no number | 39 | Dark |
| Dark placeholder ("Section divider") | 40 | Dark |
| Light placeholder ("Section divider") | 41 | Light |

**Default: 34.** Use 36 sparingly (loses impact instantly when repeated). Mirror the cover mode (dark cover → dark dividers; light cover → light dividers).

---

## §3. Closing / Pause

| Need | Slide | Mode |
|---|---|---|
| Default closer | **42** | Dark |
| Branded closer with "Accenture" eyebrow | 43 | Dark |
| Light closer (printed handout) | 44 | Light |
| Vivid purple closer | 45 | Purple |
| Q&A pause (light, inherited) | 46 | Light |
| Q&A pause (dark) | 47 | Dark |
| Discussion pause (light) | 48 | Light |
| Discussion pause (dark) | 49 | Dark |

**Default: 42.** The CTA / insight slide comes before this — 42 is what stays on screen during Q&A.

---

## §4. Agenda / Table of Contents

| Need | Slide | Notes |
|---|---|---|
| 3-section agenda with sub-items | **55** | Most common for short decks |
| Up to 8 sections in 2×4 grid | 56 | With description per section |
| Long deck (2-col list) | 57 | Compact, page numbers |
| Very dense ToC | 58 | 2-col wide list |
| Exactly 5 sections | 59 | Compact horizontal strip |

**Default: 56 for client decks (always show descriptions), 55 for internal kickoffs.**

---

## §5. Statement / Quote

| Need | Slide | Mode |
|---|---|---|
| Short, bold statement (1–2 lines) | **60** | Dark |
| Longer statement (3–4 lines) | 61 | Dark |
| Statement over full-bleed image | 92 | Dark + image |

**Default: 60.** Use after a section divider to open the section's argument.

---

## §6. Content with N columns

| Columns | Light | Dark | Purple | Notes |
|---|---|---|---|---|
| 2 (table) | **62** | — | — | Equal cells |
| 2 (stacked) | 63 | — | — | Title above body |
| 2 (bulleted, open) | 68 | — | — | Less formal |
| 2 (From→To prose) | 69 | — | — | Before/after |
| 2 (From→To bullets) | 70 | — | — | Enumerated change points |
| 3 (table) | **67** | 75 | 76 | Most common 3-pillar |
| 3 (open prose) | 71 | — | — | Lighter look |
| 3 (taller boxes) | 72 | — | — | More text per column |
| 3 (with titles, tighter) | 74 | — | — | Compact variant |
| 3 (list — desc + table) | 83 | — | — | Categorized lists |
| 4 (table) | **73, 78** | 80 | — | Default 4-pillar |
| 4 (open, bulleted) | 79 | — | — | Lighter look |
| 4 (sequential / process) | 81 | — | — | Purple gradient sequence accent |
| 5 (table) | **82** | — | — | 5-pillar |
| 5 (list — categorized) | 84 | — | — | Headers + multiple rows |

**Rule:** pick ONE column shape per parallel topic across the deck. Mixing 3-col on slide A and 4-col on slide B for related content is inconsistent.

---

## §7. Numbered point lists

| Need | Slide |
|---|---|
| 6 numbered points (2×3 grid) | **85** |
| 9 numbered points (3×3 grid) | 86 |
| 3-tier hierarchical content | 87 |

---

## §8. Text + Image(s)

| Image count | Slide | Notes |
|---|---|---|
| 0 (text only with body block) | 64, 65 | 65 for disclaimers / long text |
| Full-bleed (no text) | 90 | Visual moment |
| Full-bleed + statement overlay | 92 | Powerful quote |
| 1 image, right | **91** | Default text + image |
| 1 image, right (2 paragraphs) | 93 | Two-part narrative |
| 1 image, left + footnote | 94 | Body-led variant |
| 1 image, left + Accenture eyebrow | 95 | Branded variant |
| 2 images | 96 | Side-by-side with captions |
| 3 images | 97 | Row of 3 with captions |
| 4 images (2×2 grid) | 98 | Capabilities / services |
| 10 images (2×5 grid) | 99 | Gallery |

**Default for content + image: 91.**

---

## §9. Data viz — Charts

### Pie / Donut

| Need | Slide |
|---|---|
| 5 concentric donuts (5 percentages) | 106 |
| Deconstructed pie (5 segments) | 107 |
| Standard pie (6 slices) | 108 |
| 6-category circle (equal segments) | 109 |
| 6-category with titles per segment | 110 |
| 6-category with central KPI stat | **111** |
| 3-category circle | 112 |
| 3-category with titles | 113 |

### Bar charts

| Need | Slide |
|---|---|
| 5-cat (no spacing) | 114 |
| 4-cat (no spacing) | 115 |
| 8-cat thin bars, 2 series | 116 |
| 8-cat standard, 2 series | **117** |
| 8-cat dark accent | 118 |
| 6-cat, 2 series | 119 |
| 4-cat stacked, 5 series | 120 |
| 4-cat stacked, dark mode | 121 |
| 5-cat stacked | 122 |
| 6-month (Cat 1–6) | 123 |
| 6-month (Jan–Jun, 2 series) | **124** |
| 6-month Jan–Jun variant | 125 |
| 6-month, 3 series | 126 |
| 4-cat horizontal, 3 series | 127 |
| 12-month, 3 series | 128 |
| 8-cat horizontal, 3 series | 129 |

### Line graph

| Need | Slide |
|---|---|
| 3 series, 4 categories | 136 |
| Full-width emphasis | 137 |

### Radar

| Axes | Slide |
|---|---|
| 5 | 130 |
| 6 | **131** |
| 7 | 132 |
| 8 | 133 |

### Special

| Need | Slide |
|---|---|
| Treemap | 134 |
| YoY growth (3 bars + callout) | 135 |

---

## §10. Timelines / Gantt / Roadmap

| Need | Slide |
|---|---|
| 4-phase approach (one highlighted) | 142 |
| 12-week detailed Gantt | **143** |
| 5-week roadmap strip | 145 |
| Circular timeline (6 steps, cyclical) | 146 |
| 5-year linear roadmap | 147 |
| 12-month, 3 legend categories | 148 |
| 12-month, 4 legend categories | 149 |
| 12-month, compact header | 150 |
| 6-month hierarchical Gantt (3 phases × 4 steps) | **151** |
| Prioritization matrix (effort vs value) | 152 |

**Default for project plans: 151 (6-month) or 148 (12-month).**

---

## §11. Org chart / Geographic

| Need | Slide |
|---|---|
| Top-down hierarchy | **138** |
| Left-to-right hierarchy | 139 |
| 3 functional teams | 140 |
| World map with regions | 141 |

---

## §12. Comparison / matrix

| Need | Slide |
|---|---|
| 3×4 matrix (label col + 3 content cols, 3 rows) | 77 |
| Large 5-col × 9-row list | 100 |
| Simple 4-col × 2-row table | 101 |
| Complex 5×5 matrix | 102 |
| 5-section timeline table | 103 |
| Table with highlighted column | **104** |
| Competitive analysis (Accenture vs 4 others, 5 criteria) | **144** |

**Default for competitor compare: 144.** For feature parity: 102.

---

## §13. Venn

| Need | Slide |
|---|---|
| 2-way (text only) | 156 |
| 2-way (with images inside circles) | 155 |
| 3-way (text only) | **154** |
| 3-way (with background image) | 153 |
| Central + 4 quadrant circles (with images) | 157 |

---

## §14. Stats / KPI row

| Need | Slide | Mode |
|---|---|---|
| 3 large numbers (e.g. "120m+") | **158** | Light |
| 2 groups × 3 stats | 159 | Light |
| 3% callouts (dark) | 160 | Dark |
| 3% callouts (light) | 161 | Light |
| 3% callouts (dark, variant) | 162 | Dark |
| 4% callouts (light) | 163 | Light |
| 4% callouts (dark) | 164 | Dark |

**Default: 158 for absolute numbers, 161 for percentages in body, 160 for percentages as section emphasis.**

---

## §15. Case study

| Need | Slide |
|---|---|
| Portfolio of 3 case studies | 165 |
| Portfolio of 5 case studies | 166 |
| Full-bleed cover (single case study) | **167** |
| Blank full-bleed image transition | 168 |
| Goal / Challenge / Strategy setup | **169** |
| Intro with image left | 170 |
| Intro with image + annotation | 171 |
| Content + 1 stat result | 172 |
| Content + 3 stat results | **173** |
| Problem + Solution + 3 stats | **174** |
| Problem + Solution + image evidence + 3 stats | 175 |
| Large image + problem/solution | 176 |

**Default case study arc: 167 (cover) → 169 (goal/challenge/strategy) → 174 (problem/solution/results).**

---

## §16. Device mockups

| Device | Slide |
|---|---|
| iPhone 16 | 177 |
| iPhone 12 | 178 |
| MacBook Pro | 179 |
| iPad Pro | 180 |

---

## §17. Team / CV

| Need | Slide |
|---|---|
| 5 people, photos + name + title | 181 |
| 6 people, photos + name + title | 182 |
| 4 people with bios | 183 |
| 5 people with bios | **184** |
| 6 people with bios | 185 |
| 8 people in 2 rows (functional split) | 186 |
| 18 people across 3 tiers | 187 |
| 24 people across 3 tiers | 188 |
| 30 people across 3 tiers | 189 |
| Individual CV — compact | 190 |
| Individual CV — wide, background + 6 experience | 191 |
| Individual CV — 6+6 experience entries | 192 |
| Individual CV — landscape with expertise sidebar | 193 |
| Individual CV — vertical table + expertise sidebar | 194 |

**Default for team intro: 184 (5 people with bios). For senior leadership-only: 183.**

---

## Mode mirroring rule

The Accenture template ships parallel light / dark / purple variants for the most-used layouts. **Within one sub-section, do not mix modes.**

| Layout type | Light | Dark | Purple |
|---|---|---|---|
| Cover | 31, 32 | 30, 33 | — |
| Section divider | 37, 38, 41 | 34, 35, 39, 40 | 36 |
| Thank you | 44 | 42, 43 | 45 |
| 3-column content | 74 | 75 | 76 |
| 4-column content | 79 | 80 | — |
| 3 stat callouts (%) | 161 | 160, 162 | — |
| 4 stat callouts (%) | 163 | 164 | — |
| Bar chart | 114–120, 122–129 | 121 | — |

---

## Anti-patterns when picking slides

- **Don't pick "Section divider — placeholder" (40, 41).** Those are template scaffolding, not real dividers. Use 34–39 with a real number + title.
- **Don't use "Brand guidelines" slides (7–19) or "How to use this template" slides (20–29) in a client deck.** They are template documentation. Quick check: any slide < 30 is internal-template scaffolding.
- **Don't use slide 36 (purple divider) more than twice per deck.** Vivid by design; loses meaning the third time.
- **Don't use slide 144 (competitive matrix) unless you have a defensible row for "Accenture vs each competitor"** — never invent advantages.
- **Don't use slide 99 (10-image gallery) as a logo wall.** Use 88 / 89, which are designed for logos.
