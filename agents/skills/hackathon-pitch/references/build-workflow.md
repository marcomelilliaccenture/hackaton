# Build workflow — from slide map to finished .pptx

Environment: Windows, PowerPoint installed, Python 3 as `py`, `python-pptx` installed
(`py -m pip install python-pptx`). Prefix Python commands with `PYTHONIOENCODING=utf-8`
(bash) or set `$env:PYTHONIOENCODING="utf-8"` (PowerShell) — the reports print `→`, `·`
and `⚠`, and the Windows console defaults to a codepage that cannot encode them.

Paths below assume the repo root as working directory and the skill at
`.claude/skills/hackathon-pitch/`. Working files go in `temp/`, deliverables in `outputs/`.

---

## 1. Build the skeleton

```bash
powershell -ExecutionPolicy Bypass -File .claude/skills/hackathon-pitch/scripts/deck_build.ps1 \
  -Slides "30,60,69,93,158,71,42" -Out "outputs/working.pptx"
```

- `-Slides`: 1-based template positions, in deck order. Repeats are allowed and produce
  real duplicate slides (`"67,67"` gives you the 3-column layout twice).
- `-Template`: defaults to `assets/accenture_template.pptx`; the file is copied, never
  modified.
- `-KeepNotes`: keep the template's own speaker notes. Default is to clear them.
- Takes 30–60 seconds: it drives PowerPoint. Expect a `POWERPNT.EXE` process during the run.

**Why it goes through PowerPoint and not the XML.** The master's slide ids already sit at
the legal maximum (2147483647) and it carries 29 PowerPoint sections that reference slides
by id. A hand-assembled subset opens as *"The file or directory is corrupted and
unreadable"*. Both failures were reproduced; do not rebuild this in Python.

If a run leaves PowerPoint hung (a later call fails with *"PowerPoint could not open the
file"* on a file that was fine before):

```powershell
Get-Process POWERPNT -ErrorAction SilentlyContinue | Stop-Process -Force
```

## 2. Read the shapes

```bash
PYTHONIOENCODING=utf-8 py .claude/skills/hackathon-pitch/scripts/deck_text.py dump outputs/working.pptx
```

Output, per slide: `shape id | kind | position | current text`, plus table cells as
`id.row.col`, plus existing notes. `--slides 1,2` narrows it; `--empty` also lists empty
frames (that is how you find picture placeholders).

**Shape ids are per-build.** PowerPoint renumbers when it writes the file, so always dump
the deck you are about to edit. Never reuse ids from an earlier build or from the template.

## 3. Write the content

Build an edits file (`templates/edits.example.json` is a starting point):

```json
[
  {"slide": 1, "shape": 3, "text": "Il triage dei CRQ costa 40 minuti a richiesta"},
  {"slide": 1, "shape": 5, "text": "Team Relax · track Automazione"},
  {"slide": 1, "shape": 7, "delete": true},
  {"slide": 2, "shape": 15, "text": ["Tre tool, due persone, quaranta minuti.",
                                      "Nessuno dei due decide."]},
  {"slide": 4, "shape": 3, "row": 0, "col": 0, "text": "Oggi"},
  {"slide": 5, "shape": 13, "text": ["40 min", "tempo medio di triage (fonte: estrazione ITSM 2026-09)"]},
  {"slide": 1, "notes": "Apri sul numero. Nomi dopo. 20 secondi."}
]
```

```bash
PYTHONIOENCODING=utf-8 py .claude/skills/hackathon-pitch/scripts/deck_text.py apply \
  outputs/working.pptx --edits temp/edits.json --out outputs/pitch.pptx
```

Rules the script follows, and what they mean for you:

- **A list of strings = one line per template line**, and line *i* keeps template line *i*'s
  formatting. On a stat shape whose first line is 60 pt and second 14 pt, `["40 min",
  "tempo medio…"]` comes out correctly sized. Extra lines clone the last template line.
- **A single string with `\n`** behaves the same way.
- **`"delete": true`** removes a shape. Use it for placeholders you do not need — an unused
  "Optional date goes here" on the cover is the most common leak.
- **Table cells** need `row` and `col` alongside the table's shape id.
- **`"notes"`** sets the speaker notes for that slide; no `shape` needed.
- The input file is never modified when `--out` is given.

Missing shapes are reported as `MISS slide N shape X` and do not abort the run — check that
line of output every time.

## 4. Place images

```bash
PYTHONIOENCODING=utf-8 py .claude/skills/hackathon-pitch/scripts/deck_image.py \
  outputs/pitch.pptx --slide 4 --shape 10 --image temp/demo.png
```

The shape's box becomes the frame: the image is scaled to fit, centred, and the placeholder
is removed. `--cover` fills the frame and crops instead. `--keep-shape` leaves the
placeholder underneath. Without `--out` it edits the file in place.

Screenshots: capture at the same aspect ratio as the frame when you can; 16:9 crops cleanly
into most template image areas. PNG for UI, no drop shadows — the template provides the
framing.

## 5. Render and look

```powershell
powershell -ExecutionPolicy Bypass -File .claude\skills\hackathon-pitch\scripts\render_qa.ps1 `
  -Pptx outputs\pitch.pptx -OutDir temp\qa -Pdf
```

Writes `Slide1.PNG … SlideN.PNG` (and the PDF with `-Pdf`). Read every PNG. The renderer
opening the file is itself the validation that the deck is not corrupt.

What only the render shows: text overflowing its box, a headline wrapping to four lines, a
chart still carrying template data, a leftover `Lorem ipsum`, a logo sitting on a busy part
of an image.

## 6. Gate it

See `quality-gate.md`. Minimum before shipping:

```bash
PYTHONIOENCODING=utf-8 py .claude/skills/hackathon-pitch/scripts/fit_check.py outputs/pitch.pptx --report
PYTHONIOENCODING=utf-8 py .claude/skills/hackathon-pitch/scripts/slop_scan.py outputs/pitch.pptx
PYTHONIOENCODING=utf-8 py .claude/skills/hackathon-pitch/scripts/clean_marks.py outputs/pitch.pptx --report
```

## Gotchas

| Symptom | Cause | Fix |
|---|---|---|
| `MISS slide N shape X` | ids from a previous build | re-run `dump` on the current file |
| Second line of a stat comes out huge | you passed one string where the template had two styled lines | pass a list, one entry per template line |
| "Optional date goes here" on the cover | unfilled placeholder | `"delete": true` |
| Text renders outside its box | no autofit on that placeholder | shorten the line; `fit_check.py` flags it |
| `UnicodeEncodeError` in a report | Windows console codepage | `PYTHONIOENCODING=utf-8` |
| Build fails, file "corrupted" | someone edited the package XML by hand | rebuild with `deck_build.ps1` |
| Chart still shows template numbers | charts hold their own embedded data | edit the chart in PowerPoint, or replace it with an image via `deck_image.py` |
| Font looks wrong on another machine | Graphik not installed there | deliver the PDF alongside the .pptx |
