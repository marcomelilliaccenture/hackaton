---
name: hackathon-pitch
description: Build the pitch deck for a hackathon or innovation-challenge idea as an Accenture-branded .pptx — narrative first, then slides picked from the FY26 194-slide master, filled, rendered and quality-gated. Use whenever the user is preparing a hackathon pitch, an idea presentation, a demo-day deck, a 3/5/10-minute pitch, or asks for "la ppt dell'hackathon", "presentazione dell'idea", an Accenture deck, or a .pptx for a jury. Also use to review or rework an existing pitch deck against judging criteria. Covers timing, judging criteria, slide selection, speaker notes, demo strategy and the pre-ship audit.
---

# Hackathon pitch deck

One job: turn an idea into a deck a jury scores well, in Accenture FY26 brand, inside a
hackathon's time budget. The deck is a visual aid for a spoken pitch that lasts 3 to 10
minutes — not a document, not a proposal, not a technical spec.

Merged from: `content-presentation` (narrative), `ads-pptx` (Accenture FY26 master +
brand canon), `content-infographic` / `content-diagramming` / `diagram-design` (visuals),
`ai-documents-audit` (quality gate + the four scanner scripts).

## The three things that decide the score

1. **The judges' criteria are the outline.** Impact, feasibility, innovation and fit to the
   challenge theme carry most of the weight in corporate hackathons. Every slide earns its
   place by feeding one of them. If the organiser published a rubric, the deck follows the
   rubric's order and vocabulary.
2. **The demo is the evidence.** An idea pitch without proof is a wish. Show the working
   thing — recorded, with a live fallback, never the reverse.
3. **One idea per slide, readable in five seconds.** A judge who has to read is not
   listening.

## Operating order

Do not skip to slide generation. A deck built before the narrative is settled gets rebuilt.

### 1. Fill the brief

Copy `templates/pitch-brief.md` and fill it with the user. Ask only what the conversation
has not already answered — typically: pitch length, jury composition, judging criteria,
what exists as a demo, and which numbers are real. Numbers that are not real are marked
`[da verificare]` and stay marked on the slide. Never invent a figure, a benchmark or a
client name.

Language: write the deck in the language the pitch is delivered in. For an Italian
hackathon that means Italian slides — the brand's banned-phrase discipline still applies
(`references/brand-rules.md`, section 2, plus the Italian equivalents listed there).

### 2. Choose the narrative

Read `references/pitch-playbook.md`. Pick the blueprint that matches the time slot from
`references/deck-blueprints.md` (3 min / 5 min / 10 min + the demo-first variant). Output
the narrative as a numbered list — one line per slide, stating the *message*, not the
title:

```
1  Hook          il triage di un CRQ costa 40 minuti e nessuno decide nulla
2  Chi soffre    3 team, 120 richieste/settimana
3  L'idea        un agente che propone la classificazione, l'umano approva
...
```

Get explicit approval on this list before touching PowerPoint. Re-planning is cheap.

### 3. Map slides to the template

For each narrative line pick a template slide number from
`references/slide-selection.md` (fast picker) or `references/slide-index.md` (full
194-slide catalog). Output the map and confirm it:

```
deck 1 | template 31 | Cover light                 | headline = the hook
deck 2 | template 60 | Dark statement              | the cost of today
deck 3 | template 67 | 3-column                    | idea in three moves
deck 4 | template 93 | Text + image                | demo screenshot
deck 5 | template 158| 3 stats                     | impact, with sources
deck 6 | template 143| 12-week timeline            | what happens after the hackathon
deck 7 | template 42 | Dark closer                 | the ask
```

Mode discipline: dark cover / dividers / statements, light content, purple divider at most
twice. Details in `references/brand-rules.md`.

### 4. Build, fill, illustrate

Mechanics, commands and pitfalls: `references/build-workflow.md`. In short:

```bash
powershell -ExecutionPolicy Bypass -File .claude/skills/hackathon-pitch/scripts/deck_build.ps1 -Slides "31,60,67,93,158,143,42" -Out "outputs/working.pptx"
py .claude/skills/hackathon-pitch/scripts/deck_text.py dump outputs/working.pptx
py .claude/skills/hackathon-pitch/scripts/deck_text.py apply outputs/working.pptx --edits temp/edits.json --out outputs/pitch.pptx
```

Shape ids come from `dump` on the built deck — they are not stable across builds. Write
speaker notes in the same edits file (`{"slide": 1, "notes": "..."}`); notes are part of
the deliverable, not an afterthought.

Visuals — screenshot, architecture sketch, chart: `references/visuals.md`. Diagrams beat
photography; a real screenshot beats a diagram.

### 5. Quality gate (mandatory)

`references/quality-gate.md`. Render every slide to PNG and look at it, run the three
scanners, walk the checklist. Two failures block shipping: a leftover template placeholder,
and a number without a source. The template also carries its original author in the file
properties — clean it before the deck leaves the machine.

### 6. Rehearse against the clock

Read the speaker notes aloud with a timer. Over time means cut a slide, not talk faster.
Prepare the three questions the jury will ask (`references/pitch-playbook.md`, last
section) and keep the backup slides after the closer.

## Hard rules

- **Never invent numbers.** `[da verificare]` is allowed on a slide; a fabricated benchmark
  is not.
- **Every load-bearing number carries its source inline**, under the number.
- **No banned phrases** (`references/brand-rules.md` §2). This includes the Italian
  equivalents: *rivoluzionario, all'avanguardia, soluzione innovativa, a 360 gradi,
  chiavi in mano, sinergia*.
- **No "Agenda", no "Grazie", no "Domande?" as content slides.** Close on the ask.
- **No stock photography.** Diagram, screenshot, chart, or nothing.
- **Max 30 words on a content slide.** The talk carries the rest.
- **The original template is never modified** — `assets/accenture_template.pptx` is copied
  by every script.

## Files

| Path | Read it when |
|---|---|
| `references/pitch-playbook.md` | Always, before writing the narrative — judging criteria, timing, demo strategy, anti-patterns, Q&A |
| `references/deck-blueprints.md` | Choosing the slide sequence for a 3 / 5 / 10-minute slot |
| `references/slide-selection.md` | Mapping a need to a template slide number (fast) |
| `references/slide-index.md` | The full 194-slide catalog (when the fast picker has no match) |
| `references/brand-rules.md` | Writing any slide text — voice, colour tokens, citations, per-slide checklist |
| `references/brand/BRAND.md` · `VOICE.md` · `VISUAL.md` | Canon behind the checklist; read when a rule is ambiguous |
| `references/build-workflow.md` | Running the scripts, editing text, inserting images, gotchas |
| `references/visuals.md` | Any diagram, chart, screenshot or stat on a slide |
| `references/quality-gate.md` | Before delivering, every time |
| `templates/pitch-brief.md` | Step 1 |
| `templates/edits.example.json` | Step 4 |

Scripts (`scripts/`): `deck_build.ps1` (build via PowerPoint COM), `deck_text.py` (dump /
apply text + notes), `deck_image.py` (place an image in a shape's box), `render_qa.ps1`
(PNG + PDF export), `clean_marks.py` · `slop_scan.py` · `fit_check.py` · `extract_office.py`
(quality gate, from `ai-documents-audit`).

Requirements: Windows with PowerPoint installed, Python 3 (`py`), `python-pptx`
(`py -m pip install python-pptx`). Prefix Python calls with `PYTHONIOENCODING=utf-8` in
bash, or `$env:PYTHONIOENCODING="utf-8"` in PowerShell, or the reports crash on Unicode.

## When not to use this skill

- The deliverable is an HTML / web deck, a document or an infographic — different output,
  different skill.
- Surgical text edits to a deck someone else built — use `deck_text.py` directly, skip the
  narrative ceremony.
- A client proposal or an executive readout: the Accenture template still applies, but the
  narrative here is tuned for a jury and a clock.
