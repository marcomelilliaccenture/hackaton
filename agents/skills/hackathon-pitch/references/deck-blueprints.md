# Deck blueprints — slide sequences by time slot

Ready sequences mapping the narrative spine (`pitch-playbook.md` §3) onto template slide
numbers. Adapt; do not treat as law. Every blueprint obeys: dark cover → dark dividers and
statements, light content, purple divider at most twice, closer before the Q&A screen.

The `-Slides` string in each blueprint is ready to paste into `deck_build.ps1`.

---

## A. 3 minutes — 7 slides (default for an idea pitch)

`-Slides "30,60,69,93,158,71,42"`

| # | Template | Beat | Message on the slide | Budget |
|---|---|---|---|---|
| 1 | **30** cover (dark) | Hook | The claim, as a headline. Not the project name — the claim. Subhead: team + challenge. | 12 words · 0:20 |
| 2 | **60** statement (dark) | Problem | The cost of today, in one sentence with a number. | 15 words · 0:25 |
| 3 | **69** from → to | Idea | Left: how it works today. Right: how it works with your idea. | 2×20 words · 0:25 |
| 4 | **93** text + image | Demo | Screenshot or the recorded clip's key frame. Caption = what to notice. | 15 words · 0:45 |
| 5 | **158** 3 stats | Impact | Three numbers: baseline, delta, reach. Source under each. | 3×10 words · 0:30 |
| 6 | **71** 3 columns | Feasibility | Reale oggi / Simulato / Cosa serve per la produzione. | 3×15 words · 0:20 |
| 7 | **42** closer (dark) | Ask | One sentence: what you want from the jury. Hook restated above it. | 10 words · 0:15 |

Swap 93 → **179** (MacBook mockup) when the demo is a web app and the screenshot is clean.
Swap 158 → **161** when your impact numbers are percentages.

## B. 5 minutes — 11 slides

`-Slides "30,60,61,69,34,93,179,158,151,71,42"`

| # | Template | Beat | Note |
|---|---|---|---|
| 1 | 30 | Hook | as above |
| 2 | 60 | Problem | the number |
| 3 | 61 | Why now | what changed this year that makes it solvable — the innovation score |
| 4 | 69 | Idea | from → to |
| 5 | 34 | Divider "02 · La demo" | the only divider in a 5-minute deck |
| 6 | 93 | Demo, part 1 | the user's task |
| 7 | 179 | Demo, part 2 | the result on screen |
| 8 | 158 | Impact | baseline → delta → reach, sourced |
| 9 | 151 | Roadmap | 6-month hierarchical Gantt; or **145** for a 5-week post-hackathon strip |
| 10 | 71 | Feasibility + risks | what is real, what is mocked, what could kill it |
| 11 | 42 | Ask | one ask |

Backup slides go **after** 42: architecture (**91**), the data (**117** or **124**),
competitive positioning (**144**, only with defensible rows), team (**184**).

## C. 10 minutes — 15–18 slides

Sections become explicit. Structure:

```
30  cover
60  hook statement
34  divider 01 · Il problema
67  three faces of the problem (one column per stakeholder)
135 the trend that makes it urgent (YoY) — or 61 statement
34  divider 02 · L'idea
69  from → to
67  how it works in three moves
91  architecture diagram (one, readable, 4/10 density)
34  divider 03 · La prova
93  demo part 1
179 demo part 2
158 impact numbers
174 case-style problem → solution → 3 results (if you ran it with real users)
34  divider 04 · Dopo l'hackathon
151 roadmap
71  feasibility, risks, what we need
42  ask
```

## D. Demo-first variant (when the demo is strong and the problem is obvious to the jury)

`-Slides "30,93,179,60,69,158,71,42"`

Open on the working thing at 0:15, then explain what you just showed. Only use this when
the jury already lives the problem — otherwise the demo lands without stakes.

---

## Filling rules per slide type

**Cover (30–33).** Headline = the claim, ≤ 12 words, no colon-subtitle constructions.
Subhead = team · challenge track. Date optional; delete the placeholder if unused (leaving
"Optional date goes here" on screen is the most common failure of this template).

**Statement (60, 61).** One sentence. It is the slide. No bullets, no source line unless the
sentence contains a number — then the source goes underneath in caption size.

**From → to (69, 70).** Same grammar on both sides, same number of lines. The contrast must
be visible without reading: "3 tool, 2 persone, 40 minuti" → "1 agente, 1 approvazione,
6 minuti".

**3 columns (67, 71, 72, 74).** One short paragraph per column, or 1–2 bullets. Never four
bullets. Column titles are parallel in form (all nouns, or all verbs).

**Stats (158, 160–164).** Number, one descriptor line, `(fonte: …)` underneath, `⚠` warning
if the number could be misread as a promise. Do not decorate the number.

**Text + image (91, 93, 94).** The caption states what to notice, not what it is. Insert the
image with `deck_image.py` into the picture placeholder's shape id.

**Device mockup (177–180).** Only with a real screenshot. An empty mockup frame reads as
vapour.

**Timeline (143, 145, 147, 151).** Only phases you can defend. Three or four phases beat
twelve. Mark where the hackathon prototype ends and new work starts.

**Closer (42).** The ask, and nothing else. Q&A pause slides (46–49) are optional and come
after it.

## Template slides never to use in a pitch

Slides 1–29 are the template's own documentation (brand guidelines, how-to-use). Slides 40,
41 are unfilled divider scaffolding. Slides 55–59 are agenda layouts — a pitch has no
agenda.
