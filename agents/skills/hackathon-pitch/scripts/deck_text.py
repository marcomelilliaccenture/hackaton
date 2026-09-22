#!/usr/bin/env python3
"""Inspect and rewrite the text of a .pptx without touching its formatting.

Requires python-pptx (`py -m pip install python-pptx`).

Dump every editable text frame, with the address you use to edit it:

  py deck_text.py dump working.pptx
  py deck_text.py dump working.pptx --slides 1,2 --empty     # include empty frames

Apply edits (original untouched unless --out is omitted):

  py deck_text.py apply working.pptx --edits edits.json --out outputs/deck.pptx

edits.json — a list of {slide, shape, text}; `shape` is the shape id from `dump`.
Use "\n" for a line break, and a list of strings for several paragraphs:

  [
    {"slide": 1, "shape": 4,  "text": "Il triage dei CRQ costa 40 min per richiesta"},
    {"slide": 4, "shape": 12, "text": ["Oggi: 3 tool", "Domani: 1 agente"]},
    {"slide": 5, "shape": 7,  "text": "", "delete": true}
  ]

Formatting is preserved by keeping the first run of each paragraph and reusing it:
the template's fonts, sizes and colours survive. `delete: true` removes the shape
(use it for placeholders the deck does not need).
"""

from __future__ import annotations

import argparse
import copy
import json
import shutil
import sys
from pathlib import Path

try:
    from pptx import Presentation
    from pptx.util import Emu
except ImportError:  # pragma: no cover
    sys.exit("python-pptx is missing:  py -m pip install python-pptx")


def iter_shapes(container, prefix=""):
    for shape in container.shapes:
        label = f"{prefix}{shape.shape_id}"
        if shape.shape_type == 6:  # GROUP
            yield from iter_shapes(shape, prefix=f"{label}/")
        else:
            yield label, shape


def describe(shape) -> str:
    kind = str(shape.shape_type).split(" (")[0]
    if shape.is_placeholder:
        kind = f"placeholder:{str(shape.placeholder_format.type).split(' (')[0]}"
    return kind


def cm(v) -> str:
    return f"{Emu(v).cm:.1f}" if v is not None else "?"


def dump(path: Path, slides: list[int] | None, include_empty: bool) -> None:
    prs = Presentation(str(path))
    for n, slide in enumerate(prs.slides, 1):
        if slides and n not in slides:
            continue
        print(f"\n=== slide {n} (layout: {slide.slide_layout.name})")
        for label, shape in iter_shapes(slide):
            if shape.has_table:
                for r, row in enumerate(shape.table.rows):
                    for c, cell in enumerate(row.cells):
                        print(f"  {label}.{r}.{c} | table cell | {cell.text!r}")
                continue
            if not shape.has_text_frame:
                print(f"  {label} | {describe(shape)} | (no text) | {shape.name}")
                continue
            text = shape.text_frame.text
            if not text.strip() and not include_empty:
                continue
            pos = f"x={cm(shape.left)} y={cm(shape.top)} w={cm(shape.width)}cm"
            print(f"  {label} | {describe(shape)} | {pos} | {text!r}")
        if slide.has_notes_slide and slide.notes_slide.notes_text_frame.text.strip():
            print(f"  notes | {slide.notes_slide.notes_text_frame.text!r}")


def find_shape(slide, shape_id: str):
    for label, shape in iter_shapes(slide):
        if label == str(shape_id):
            return shape
    return None


A_NS = "{http://schemas.openxmlformats.org/drawingml/2006/main}"


def set_text(shape, value) -> None:
    """Replace the text line by line, keeping each line's own formatting.

    Line i reuses paragraph i of the template shape — so a stat shape whose
    first line is 60pt and second is 12pt keeps that contrast. Extra lines
    clone the last template paragraph; unused paragraphs are removed.
    """
    lines = value if isinstance(value, list) else str(value).split("\n")
    tf = shape.text_frame
    body = tf._txBody
    paras = body.findall(A_NS + "p")

    while len(paras) < len(lines):
        clone = copy.deepcopy(paras[-1])
        body.append(clone)
        paras.append(clone)
    for extra in paras[len(lines):]:
        body.remove(extra)
    paras = paras[: len(lines)]

    for para, line in zip(paras, lines):
        runs = para.findall(A_NS + "r")
        for dead in runs[1:]:
            para.remove(dead)
        for br in para.findall(A_NS + "br"):
            para.remove(br)
        if runs:
            t = runs[0].find(A_NS + "t")
            if t is None:
                t = runs[0].makeelement(A_NS + "t", {})
                runs[0].append(t)
            t.text = line
        else:
            from pptx.text.text import _Paragraph

            _Paragraph(para, tf).text = line


def apply(path: Path, edits_file: Path, out: Path | None) -> None:
    target = path
    if out:
        out.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(path, out)
        target = out

    edits = json.loads(edits_file.read_text(encoding="utf-8"))
    prs = Presentation(str(target))
    slides = list(prs.slides)
    applied, missing = 0, []

    for edit in edits:
        n = int(edit["slide"])
        if not 1 <= n <= len(slides):
            missing.append(f"slide {n} out of range")
            continue
        slide = slides[n - 1]
        if edit.get("notes") is not None:
            slide.notes_slide.notes_text_frame.text = edit["notes"]
            applied += 1
            continue
        shape = find_shape(slide, edit["shape"])
        if shape is None:
            missing.append(f"slide {n} shape {edit['shape']}")
            continue
        if edit.get("delete"):
            shape._element.getparent().remove(shape._element)
        elif shape.has_table:
            r, c = int(edit["row"]), int(edit["col"])
            cell = shape.table.cell(r, c)
            cell.text_frame.paragraphs[0].runs[0].text = edit["text"] if (
                cell.text_frame.paragraphs[0].runs
            ) else None
            if not cell.text_frame.paragraphs[0].runs:
                cell.text = edit["text"]
        else:
            set_text(shape, edit["text"])
        applied += 1

    prs.save(str(target))
    print(f"{target}  applied={applied}  failed={len(missing)}")
    for m in missing:
        print(f"  MISS {m}")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)

    d = sub.add_parser("dump")
    d.add_argument("pptx", type=Path)
    d.add_argument("--slides")
    d.add_argument("--empty", action="store_true")

    a = sub.add_parser("apply")
    a.add_argument("pptx", type=Path)
    a.add_argument("--edits", required=True, type=Path)
    a.add_argument("--out", type=Path)

    args = ap.parse_args()
    if args.cmd == "dump":
        sel = [int(s) for s in args.slides.split(",")] if args.slides else None
        dump(args.pptx, sel, args.empty)
    else:
        apply(args.pptx, args.edits, args.out)


if __name__ == "__main__":
    main()
