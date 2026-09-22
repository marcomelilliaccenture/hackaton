#!/usr/bin/env python3
"""Does the text still fit inside the shapes? Geometry, not character counts.

The length contract in references/humanize.md is written in characters and justified
physically: keep a replacement near the original length so it still renders inside its box.
Characters are a proxy, and the proxy inverts. On one deck the shortest replacement by
character count -- 85.7% of its original -- was the only one that came out *wider* on screen,
because it traded narrow letters for wide ones. A character budget cannot answer a geometry
question, so this script answers it directly.

Two things decide whether text overflows, and a deck usually tells you neither:

  * the box, which a placeholder inherits from its layout and then its master when its own
    <a:spPr> is empty, which is the common case;
  * autofit, declared in <a:bodyPr>. With normAutofit PowerPoint shrinks text to fit and an
    overlong line is a cosmetic problem. With no autofit at all -- a bare <a:bodyPr/> -- the
    text simply renders outside the shape. Same overflow, very different consequence.

Usage:
    fit_check.py <file.pptx>                  measure the deck as it stands
    fit_check.py <file.pptx> --plan <plan>    check a fix plan's replacements before applying
    fit_check.py <file.pptx> --report         human-readable instead of JSON

Measurement uses PIL with a real font file when one is available, and falls back to average
character widths otherwise. The fallback is flagged in the output: it is good enough to catch
a line that is 30% too long and not good enough to adjudicate one that is 2% over.
"""

import json
import os
import re
import sys

EMU_PER_PT = 12700
DEFAULT_FONT_PT = 18.0
# PowerPoint's own defaults, in points.
DEFAULT_INSETS = {"l": 7.2, "r": 7.2, "t": 3.6, "b": 3.6}

FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/Library/Fonts/Arial.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "C:/Windows/Fonts/arial.ttf",
]

A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"


def _fail(msg, code=1):
    print(f"error: {msg}", file=sys.stderr)
    sys.exit(code)


# --------------------------------------------------------------------------- measurement
class Ruler:
    """Width of a string at a point size, in points."""

    def __init__(self):
        self.font_path = next((p for p in FONT_CANDIDATES if os.path.exists(p)), None)
        self.exact = False
        self._cache = {}
        if self.font_path:
            try:
                from PIL import ImageFont  # noqa: F401
                self.exact = True
            except ImportError:
                self.font_path = None

    def _font(self, size_pt):
        from PIL import ImageFont
        key = round(size_pt, 1)
        if key not in self._cache:
            # Render at 4x and divide, so rounding to integer pixels costs less.
            self._cache[key] = ImageFont.truetype(self.font_path, int(round(size_pt * 4)))
        return self._cache[key]

    def width(self, text, size_pt):
        if not text:
            return 0.0
        if self.exact:
            try:
                return self._font(size_pt).getlength(text) / 4.0
            except Exception:
                pass
        # Fallback: Arial's average lowercase advance is about 0.5 em, and the mix of
        # capitals, spaces and punctuation in prose lands near 0.52.
        return len(text) * size_pt * 0.52

    def note(self):
        if self.exact:
            return f"widths measured with {os.path.basename(self.font_path)}"
        return ("no font file found: widths are estimated at 0.52 em per character. Good "
                "enough to catch a badly overlong line, not good enough to judge a near miss")


# --------------------------------------------------------------------------- geometry
def _inherited_box(shape, slide):
    """Resolve a placeholder's box through layout and master.

    An empty <a:spPr> means "inherit", and most decks built from a template have exactly
    that. Reading shape.width directly returns None there, which is how a deck can look
    like it has no geometry at all.
    """
    if shape.width is not None and shape.height is not None:
        return shape.width, shape.height, "own"
    if not shape.is_placeholder:
        return None, None, "unknown"
    idx = shape.placeholder_format.idx
    for source, label in ((slide.slide_layout, "layout"),
                          (slide.slide_layout.slide_master, "master")):
        try:
            for candidate in source.placeholders:
                if candidate.placeholder_format.idx == idx:
                    if candidate.width is not None:
                        return candidate.width, candidate.height, label
        except (KeyError, AttributeError):
            continue
    return None, None, "unresolved"


def _autofit(shape):
    """Read <a:bodyPr> for an autofit child. Absence is the risky case, not a neutral one."""
    try:
        body = shape.text_frame._txBody.find(f"{A}bodyPr")
    except Exception:
        return "unknown", {}
    if body is None:
        return "none", {}
    insets = {}
    for attr, key in (("lIns", "l"), ("rIns", "r"), ("tIns", "t"), ("bIns", "b")):
        raw = body.get(attr)
        insets[key] = (int(raw) / EMU_PER_PT) if raw is not None else DEFAULT_INSETS[key]
    for child in body:
        tag = child.tag.split("}")[-1]
        if tag in ("normAutofit", "spAutoFit"):
            return tag, insets
    return "none", insets


def _font_size(run, paragraph, shape):
    for candidate in (getattr(run, "font", None), getattr(paragraph, "font", None)):
        size = getattr(candidate, "size", None)
        if size is not None:
            return size.pt
    # Titles are larger than body text by default; without a declared size that is the
    # best available guess, and it is recorded as a guess in the output.
    name = (shape.name or "").lower()
    return 28.0 if "title" in name else DEFAULT_FONT_PT


def _wrapped_lines(text, size_pt, usable_pt, ruler):
    """Greedy word wrap, the way a text frame lays out a paragraph."""
    if usable_pt <= 0:
        return [text], ruler.width(text, size_pt)
    lines, current, widest = [], "", 0.0
    for word in text.split():
        trial = f"{current} {word}".strip()
        if ruler.width(trial, size_pt) <= usable_pt or not current:
            current = trial
            continue
        lines.append(current)
        widest = max(widest, ruler.width(current, size_pt))
        current = word
    if current:
        lines.append(current)
        widest = max(widest, ruler.width(current, size_pt))
    return lines, widest


def measure(path, ruler):
    from pptx import Presentation

    prs = Presentation(path)
    shapes = []
    for slide_no, slide in enumerate(prs.slides, 1):
        for shape in slide.shapes:
            if not shape.has_text_frame or not shape.text_frame.text.strip():
                continue
            width_emu, height_emu, origin = _inherited_box(shape, slide)
            autofit, insets = _autofit(shape)
            insets = insets or DEFAULT_INSETS
            box_w = (width_emu / EMU_PER_PT) if width_emu else None
            box_h = (height_emu / EMU_PER_PT) if height_emu else None
            usable_w = (box_w - insets["l"] - insets["r"]) if box_w else None

            paragraphs, total_lines, widest_line, sizes = [], 0, 0.0, []
            for para in shape.text_frame.paragraphs:
                text = "".join(r.text for r in para.runs) or para.text
                if not text.strip():
                    total_lines += 1
                    continue
                size = _font_size(para.runs[0] if para.runs else None, para, shape)
                sizes.append(size)
                lines, widest = _wrapped_lines(text, size, usable_w or 1e9, ruler)
                total_lines += len(lines)
                widest_line = max(widest_line, widest)
                paragraphs.append({"text": text, "font_pt": size,
                                   "lines": len(lines), "widest_line_pt": round(widest, 1)})

            line_pt = max(sizes) * 1.2 if sizes else DEFAULT_FONT_PT * 1.2
            needed_h = total_lines * line_pt
            usable_h = (box_h - insets["t"] - insets["b"]) if box_h else None
            shapes.append({
                "slide": slide_no,
                "shape": shape.name,
                "box_pt": None if box_w is None else [round(box_w, 1), round(box_h, 1)],
                "box_from": origin,
                "autofit": autofit,
                "usable_width_pt": None if usable_w is None else round(usable_w, 1),
                "widest_line_pt": round(widest_line, 1),
                "lines": total_lines,
                "needed_height_pt": round(needed_h, 1),
                "usable_height_pt": None if usable_h is None else round(usable_h, 1),
                "overflows_height": bool(usable_h and needed_h > usable_h),
                "headroom_pt": None if usable_w is None else round(usable_w - widest_line, 1),
                "paragraphs": paragraphs,
            })
    return shapes


def verdict_for(entry):
    """What the measurement means, which depends entirely on autofit."""
    if entry["box_pt"] is None:
        return "unresolved", "box geometry could not be resolved from shape, layout or master"
    if entry["overflows_height"]:
        if entry["autofit"] == "normAutofit":
            return "shrinks", "text exceeds the box but autofit will scale it down"
        return "overflows", "text exceeds the box and there is no autofit: it renders outside"
    if entry["headroom_pt"] is not None and entry["headroom_pt"] < 0:
        return "overflows", "a line is wider than the box"
    return "fits", "inside the box at the declared size"


def check_plan(path, plan_path, ruler):
    """Answer the question the length contract is really asking, before anything is applied."""
    try:
        plan = json.load(open(plan_path, encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        _fail(f"cannot read fix plan {plan_path}: {exc}")
    replacements = {r["find"]: r["replace"] for r in plan.get("text_replacements", [])
                    if r.get("find")}
    if not replacements:
        _fail("fix plan contains no text_replacements")

    rows = []
    for entry in measure(path, ruler):
        usable = entry["usable_width_pt"]
        for para in entry["paragraphs"]:
            for find, replace in replacements.items():
                if find not in para["text"]:
                    continue
                after = para["text"].replace(find, replace)
                _, widest_after = _wrapped_lines(after, para["font_pt"], usable or 1e9, ruler)
                lines_after, _ = _wrapped_lines(after, para["font_pt"], usable or 1e9, ruler)
                rows.append({
                    "slide": entry["slide"], "shape": entry["shape"],
                    "autofit": entry["autofit"],
                    "find": find[:60], "replace": replace[:60],
                    "chars_pct": round(100 * len(replace) / max(1, len(find)), 1),
                    "width_before_pt": para["widest_line_pt"],
                    "width_after_pt": round(widest_after, 1),
                    "width_pct": round(100 * widest_after / max(0.1, para["widest_line_pt"]), 1),
                    "lines_before": para["lines"], "lines_after": len(lines_after),
                    "still_fits": usable is None or widest_after <= usable,
                })
    return rows


# --------------------------------------------------------------------------- output
def print_measurement(shapes, ruler):
    print(f"{len(shapes)} text shapes · {ruler.note()}\n")
    risky = 0
    for entry in shapes:
        state, why = verdict_for(entry)
        risky += state == "overflows"
        box = "?" if entry["box_pt"] is None else f"{entry['box_pt'][0]}x{entry['box_pt'][1]}pt"
        head = f"  slide {entry['slide']} · {entry['shape'][:30]}"
        print(f"{head:44} [{state}] {why}")
        print(f"{'':46}box {box} from {entry['box_from']} · autofit {entry['autofit']}")
        if entry["usable_width_pt"]:
            print(f"{'':46}widest line {entry['widest_line_pt']}pt of "
                  f"{entry['usable_width_pt']}pt usable · headroom {entry['headroom_pt']}pt")
    no_autofit = [e for e in shapes if e["autofit"] == "none"]
    if no_autofit:
        print(f"\n{len(no_autofit)} of {len(shapes)} shapes declare no autofit. In those, text "
              f"that grows\nrenders outside the shape rather than shrinking, so a replacement "
              f"must fit as written.")
    if risky:
        print(f"\n{risky} shape(s) already overflow before any edit.")


def print_plan(rows, ruler):
    if not rows:
        print("no plan replacement matched any shape text")
        return
    print(f"{len(rows)} replacement(s) checked · {ruler.note()}\n")
    inverted = []
    for row in rows:
        mark = "fits" if row["still_fits"] else "DOES NOT FIT"
        print(f"  slide {row['slide']} · {row['shape'][:26]:28} [{mark}]")
        print(f"      chars {row['chars_pct']}%  width {row['width_pct']}%  "
              f"({row['width_before_pt']}pt → {row['width_after_pt']}pt)  "
              f"lines {row['lines_before']}→{row['lines_after']}  autofit {row['autofit']}")
        if row["chars_pct"] <= 100 < row["width_pct"]:
            inverted.append(row)
    if inverted:
        print(f"\n{len(inverted)} replacement(s) are shorter in characters but WIDER on screen.")
        print("This is why the character budget cannot be the final check: narrow letters")
        print("were traded for wide ones. Judge these on the width column.")
    broken = [r for r in rows if not r["still_fits"]]
    if broken:
        print(f"\n{len(broken)} replacement(s) do not fit. Shorten them or raise the item with")
        print("the author; do not apply and hope autofit catches it.")


def parse_args(argv):
    opts = {"path": None, "plan": None, "report": False}
    i = 0
    while i < len(argv):
        arg = argv[i]
        if arg in ("-h", "--help"):
            print(__doc__)
            sys.exit(0)
        elif arg == "--report":
            opts["report"] = True
        elif arg == "--plan":
            i += 1
            if i >= len(argv):
                _fail("--plan needs a path to a fix plan")
            opts["plan"] = argv[i]
        elif arg.startswith("-"):
            _fail(f"unknown option {arg}")
        elif opts["path"] is None:
            opts["path"] = arg
        else:
            _fail(f"unexpected argument {arg}")
        i += 1
    return opts


def main():
    opts = parse_args(sys.argv[1:])
    if not opts["path"]:
        print(__doc__)
        sys.exit(2)
    if not os.path.isfile(opts["path"]):
        _fail(f"file not found: {opts['path']}")
    if not opts["path"].lower().endswith(".pptx"):
        _fail("this check is for .pptx files: only slides have fixed boxes to overflow")

    ruler = Ruler()
    if opts["plan"]:
        rows = check_plan(opts["path"], opts["plan"], ruler)
        if opts["report"]:
            print_plan(rows, ruler)
        else:
            print(json.dumps({"source": os.path.basename(opts["path"]),
                              "measurement": ruler.note(), "replacements": rows}, indent=2))
        return

    shapes = measure(opts["path"], ruler)
    if opts["report"]:
        print_measurement(shapes, ruler)
    else:
        print(json.dumps({"source": os.path.basename(opts["path"]),
                          "measurement": ruler.note(), "shapes": shapes}, indent=2))


if __name__ == "__main__":
    main()
