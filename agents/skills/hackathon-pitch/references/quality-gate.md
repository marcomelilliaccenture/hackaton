# Quality gate — before the deck leaves the machine

Three automated scans, one visual pass, two checklists. Nothing here is optional for a deck
a jury will score. Condensed from `ai-documents-audit` (the scripts are that skill's) and
the Accenture per-slide checklist in `brand-rules.md` §9–10.

Run from the repo root, with `PYTHONIOENCODING=utf-8`.

---

## 1. Look at every slide

```powershell
powershell -ExecutionPolicy Bypass -File .claude\skills\hackathon-pitch\scripts\render_qa.ps1 -Pptx outputs\pitch.pptx -OutDir temp\qa -Pdf
```

Read all the PNGs. You are looking for: leftover placeholder text (`Lorem`, `Optional`,
`Section header goes here`, `xxxx`, `120m+`), text outside its box, a headline wrapping into
the subhead, an empty picture frame, a chart with template numbers, a logo on a busy image.

A deck that has not been looked at has not been checked. The scanners below do not see
layout.

## 2. Fit check — does the text still fit?

```bash
PYTHONIOENCODING=utf-8 py .claude/skills/hackathon-pitch/scripts/fit_check.py outputs/pitch.pptx --report
```

Flags shapes whose text exceeds the box, and tells you whether autofit will rescue it
(`normAutofit` = cosmetic shrink; no autofit = it renders outside the shape). Measurement
is approximate when the real font file is unavailable — treat a 2 % overflow as noise and a
30 % overflow as a defect. Cross-check anything it flags against the PNG.

## 3. Slop scan — does it read as generated?

```bash
PYTHONIOENCODING=utf-8 py .claude/skills/hackathon-pitch/scripts/slop_scan.py outputs/pitch.pptx
```

Deterministic measurements, not a verdict: marker hits by category with locations, em-dash
rate, sentence rhythm, segment uniformity, specificity (numbers / dates / proper nouns per
100 words), hedge density, and the "clean slop" tells — aphoristic closes, rule-of-three
reflex, antithesis count.

For a pitch deck, read three things:

- **marker_hits** — every hit is a banned or tired phrase. Fix all of them.
- **specificity** — a pitch with no numbers, no dates and no proper nouns is a pitch with no
  content. Low specificity is the finding, not the wording.
- **clean_slop** — three parallel three-item lists and a closing aphorism on every slide is
  what edited AI looks like. Break the pattern deliberately.

## 4. Provenance and invisible characters

```bash
PYTHONIOENCODING=utf-8 py .claude/skills/hackathon-pitch/scripts/clean_marks.py outputs/pitch.pptx --report
```

Two findings matter here:

- **Invisible characters** — zero-width spaces, bidi marks, exotic spaces, Unicode tag
  characters. `--clean <out>` writes a cleaned copy; the `review` class is left alone unless
  you pass `--include-review`, because stripping those corrupts real text.
- **Document properties.** The FY26 master ships with its original author in
  `dc:creator` and a four-figure `TotalTime`. Those travel with the file. Set them in
  PowerPoint (File → Info → Properties) or accept them deliberately — do not ship without
  looking.

## 5. Content checklist (per slide)

- [ ] One idea. The message is clear in five seconds.
- [ ] The headline states the message, not the topic.
- [ ] ≤ 30 words of body text.
- [ ] Every number carries `(fonte: …)` directly under it — or `[da verificare]`.
- [ ] Any number that could be read as a promise carries a `⚠` line under it.
- [ ] Acronyms expanded on first use: `Change Request (CRQ)`.
- [ ] No banned phrases (`brand-rules.md` §2 + the Italian list in `SKILL.md`).
- [ ] No leftover template placeholder, no `Lorem`, no unfilled date.
- [ ] Speaker notes written: what to say, the timing mark, the transition line.

## 6. Deck checklist

- [ ] Cover first, closer last, backup slides after the closer.
- [ ] The ask is on exactly one slide and is one thing.
- [ ] The demo appears before the impact numbers.
- [ ] What is mocked is stated on a slide, not only in the talk.
- [ ] Mode consistency: dark cover/dividers/statements, light content, ≤ 2 purple slides.
- [ ] One column shape per parallel topic across the deck.
- [ ] Slide count fits the clock: ~2.5 slides per minute maximum, fewer with a demo.
- [ ] Read aloud against a timer, inside the slot, without rushing.
- [ ] PDF exported alongside the .pptx (Graphik will not be installed on the room's laptop).
- [ ] The recorded demo clip is on the same USB stick / folder as the deck.

## 7. Blockers

Ship-stoppers, no exceptions: a fabricated number, an unsourced load-bearing number, a
leftover template placeholder on a slide, a deck that runs over the time slot, a demo that
exists only as a promise on slide 4.
