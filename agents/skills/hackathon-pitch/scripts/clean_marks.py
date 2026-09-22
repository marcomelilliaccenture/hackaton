#!/usr/bin/env python3
"""Invisible-character and provenance-metadata hygiene for text and Office files.

Why this runs on every audit. A document can pass every writing check and still carry
content the reader cannot see: zero-width characters, bidirectional overrides, Unicode tag
characters, exotic spaces, and — in Office files — document properties naming the author,
the company, and the tool that last touched the file. In a client deliverable these are
defects on their own terms, whatever put them there. They break search and find-replace,
they corrupt diffs, they survive copy-paste into systems that then mangle them, screen
readers announce them or trip over them, and a bidi override can make a line render in an
order the source does not have. Hidden text is the whole point of the Unicode tag block.

Scope: text (`.md`, `.txt`, `.html`, `.rst`, `.tex`, `.srt`, stdin) and Office
(`.docx`, `.pptx`, `.xlsx`). Nothing here touches images, audio, video, or PDF.

Scanning is the default and it never writes. `--clean` writes a **copy**; the original is
never modified, which is the same contract the rest of this skill works under.

Usage:
    python3 clean_marks.py <file>                    # scan, JSON out
    python3 clean_marks.py <file> --report           # scan, human-readable
    cat draft.md | python3 clean_marks.py -          # scan text on stdin
    python3 clean_marks.py <file> --clean <out>      # write a cleaned copy
    python3 clean_marks.py <file> --clean <out> --include-review   # also act on review-class hits

Three verdict classes, because a blanket strip damages real documents:

  strip      invisible formatting with no function in this context — remove
  normalize  an exotic space standing in for U+0020 — replace with a plain space
  review     load-bearing or plausibly deliberate — a human decides, and `--clean`
             leaves it alone unless --include-review is passed

The review class is the part that matters. U+200D joins emoji sequences and is grammatical
in Indic and Arabic scripts; U+200C is grammatical in Persian; bidi marks are required for
correct display of mixed right-to-left text; U+FE0F is what makes an emoji render as an
emoji; U+00A0 is ordinary typography in "10 km" or "Fig. 3". Stripping those is not
cleaning, it is corruption.
"""
import json
import os
import re
import shutil
import sys
import unicodedata
import zipfile

# --------------------------------------------------------------------------- tables
# Invisible format controls and steganography carriers. Ported from the Layer A inventory
# in guillaumemeyer/watermarks-remover, plus the Unicode tag block, which is the classic
# hidden-text vector and is what "tag chars" means in that project's README.
STRIP_CODEPOINTS = {
    0x00AD: "soft hyphen",
    0x034F: "combining grapheme joiner",
    0x061C: "Arabic letter mark",
    0x115F: "Hangul choseong filler",
    0x1160: "Hangul jungseong filler",
    0x17B4: "Khmer vowel inherent AQ",
    0x17B5: "Khmer vowel inherent AA",
    0x180B: "Mongolian free variation selector-1",
    0x180C: "Mongolian free variation selector-2",
    0x180D: "Mongolian free variation selector-3",
    0x180E: "Mongolian vowel separator",
    0x180F: "Mongolian free variation selector-4",
    0x200B: "zero width space",
    0x2060: "word joiner",
    0x2061: "function application",
    0x2062: "invisible times",
    0x2063: "invisible separator",
    0x2064: "invisible plus",
    0x206A: "inhibit symmetric swapping",
    0x206B: "activate symmetric swapping",
    0x206C: "inhibit Arabic form shaping",
    0x206D: "activate Arabic form shaping",
    0x206E: "national digit shapes",
    0x206F: "nominal digit shapes",
    0x3164: "Hangul filler",
    0xFEFF: "zero width no-break space / BOM",
    0xFFA0: "halfwidth Hangul filler",
    0xFFF9: "interlinear annotation anchor",
    0xFFFA: "interlinear annotation separator",
    0xFFFB: "interlinear annotation terminator",
}

# Bidirectional controls. Legitimate in mixed RTL/LTR text, dangerous otherwise: an
# override can make a line render in an order the source does not have.
BIDI_CODEPOINTS = {
    0x200E: "left-to-right mark",
    0x200F: "right-to-left mark",
    0x202A: "left-to-right embedding",
    0x202B: "right-to-left embedding",
    0x202C: "pop directional formatting",
    0x202D: "left-to-right override",
    0x202E: "right-to-left override",
    0x2066: "left-to-right isolate",
    0x2067: "right-to-left isolate",
    0x2068: "first strong isolate",
    0x2069: "pop directional isolate",
}

# The two overrides force character order; the embeddings, isolates and marks only
# hint at it. Only the overrides can change what a reader sees when removed.
BIDI_OVERRIDES = {0x202D, 0x202E}

# Grammatical in some scripts, decorative in emoji, meaningless anywhere else.
JOINERS = {0x200C: "zero width non-joiner", 0x200D: "zero width joiner"}
VARIATION_SELECTORS = {cp: "variation selector" for cp in range(0xFE00, 0xFE10)}
TAG_BLOCK = (0xE0000, 0xE007F)  # hidden-text carrier; no legitimate use in prose

SPACE_HOMOGLYPHS = {
    0x00A0: "no-break space", 0x1680: "Ogham space mark", 0x2000: "en quad",
    0x2001: "em quad", 0x2002: "en space", 0x2003: "em space",
    0x2004: "three-per-em space", 0x2005: "four-per-em space",
    0x2006: "six-per-em space", 0x2007: "figure space", 0x2008: "punctuation space",
    0x2009: "thin space", 0x200A: "hair space", 0x202F: "narrow no-break space",
    0x205F: "medium mathematical space", 0x3000: "ideographic space",
}

# Latin-looking characters that are not Latin. Ported from the STRIP/confusable tables in
# guillaumemeyer/watermarks-remover (MIT), which has the more complete inventory; the
# three-way verdict below is this skill's, because that project strips and this one has to
# decide whether a character is load-bearing first.
#
# A Cyrillic "о" inside an otherwise Latin word is invisible to a reader and obvious to a
# machine, which is exactly the shape of the other findings in this file. The same character
# in a Russian sentence is just the letter, so the test is the word it sits in, not the
# codepoint.
CYRILLIC_CONFUSABLES = {
    0x0410: "A", 0x0412: "B", 0x0415: "E", 0x041A: "K", 0x041C: "M", 0x041D: "H",
    0x041E: "O", 0x0420: "P", 0x0421: "C", 0x0422: "T", 0x0425: "X",
    0x0430: "a", 0x0435: "e", 0x043E: "o", 0x0440: "p", 0x0441: "c", 0x0443: "y",
    0x0445: "x", 0x0456: "i",
}
GREEK_CONFUSABLES = {0x0391: "A", 0x0392: "B", 0x0395: "E", 0x039F: "O", 0x03A1: "P",
                     0x03A4: "T", 0x03A5: "Y", 0x0399: "I", 0x039A: "K", 0x039C: "M"}
CONFUSABLES = {**CYRILLIC_CONFUSABLES, **GREEK_CONFUSABLES}
FULLWIDTH = {cp: chr(cp - 0xFEE0) for cp in list(range(0xFF21, 0xFF3B)) + list(range(0xFF41, 0xFF5B))}

# Ranges that carry nothing a reader sees and have no use in a business document.
IGNORABLE_RANGES = [
    (0xE0100, 0xE01EF),   # variation selectors supplement
    (0xFDD0, 0xFDEF),     # noncharacters
    (0xE0080, 0xE00FF),   # reserved, adjacent to the tag block
    (0xE01F0, 0xE0FFF),   # reserved
    (0xFFF0, 0xFFF8),     # reserved ignorables
]


def _latin_context(text, index):
    """True when the character sits inside an otherwise Latin word."""
    start = index
    while start > 0 and (text[start - 1].isalnum() or text[start - 1] in "'-"):
        start -= 1
    end = index + 1
    while end < len(text) and (text[end].isalnum() or text[end] in "'-"):
        end += 1
    word = text[start:end]
    latin = sum(1 for c in word if "a" <= c.lower() <= "z")
    return latin >= 1 and latin >= len(word) - 2


# Office document properties that name a person, an organisation, or a tool.
PROVENANCE_FIELDS = [
    "dc:creator", "cp:lastModifiedBy", "cp:lastPrinted", "cp:revision",
    "cp:category", "cp:contentStatus", "cp:keywords", "dc:description",
    "Company", "Manager", "Application", "AppVersion", "Template",
    # A creation date far older than the document says it came from someone else's template.
    "dcterms:created", "dcterms:modified",
    "TotalTime", "HyperlinkBase",
]

OFFICE_EXTENSIONS = (".docx", ".pptx", ".xlsx")
TEXT_EXTENSIONS = (".txt", ".md", ".markdown", ".rst", ".html", ".htm", ".tex", ".srt", ".csv")
# Arabic presentation forms stop at U+FEFC. Including U+FEFF would make a BOM
# look like right-to-left script, flipping every bidi control to "review".
def _ranges(*pairs):
    """Build a character class from explicit codepoints. Written this way because a
    backslash-u escape inside a source string is one careless rewrite away from becoming a
    literal character, and a range whose upper bound silently became U+FEFF classifies every
    byte-order mark as right-to-left script."""
    return re.compile("[" + "".join(f"{chr(lo)}-{chr(hi)}" for lo, hi in pairs) + "]")


# Arabic presentation forms stop at U+FEFC; U+FEFF is the BOM and must stay out of this set.
RTL_RANGE = _ranges((0x0590, 0x08FF), (0xFB1D, 0xFDFF), (0xFE70, 0xFEFC))
EMOJI_RANGE = _ranges((0x1F000, 0x1FAFF), (0x2600, 0x27BF), (0x2190, 0x21FF))
INDIC_ARABIC = _ranges((0x0600, 0x06FF), (0x0900, 0x0DFF))


def _fail(msg, code=1):
    print(f"error: {msg}", file=sys.stderr)
    sys.exit(code)


# --------------------------------------------------------------------------- classify
def classify(codepoint, text, index):
    """Return (verdict, kind, why) for one occurrence.

    Context decides. The same joiner is grammar in Persian, decoration in an emoji
    sequence, and a steganography carrier in an English paragraph, so the surrounding
    characters are the evidence and a codepoint alone is not.
    """
    around = text[max(0, index - 2):index + 3]
    if TAG_BLOCK[0] <= codepoint <= TAG_BLOCK[1]:
        return "strip", "tag character", "Unicode tag block carries hidden text and has no use in prose"
    if any(lo <= codepoint <= hi for lo, hi in IGNORABLE_RANGES):
        return "strip", "reserved ignorable", "carries nothing a reader sees and has no use in a document"
    if codepoint in CONFUSABLES:
        if _latin_context(text, index):
            return ("normalize", f"{unicodedata.name(chr(codepoint), 'confusable')} "
                    f"impersonating {CONFUSABLES[codepoint]!r}",
                    "a non-Latin letter inside a Latin word: invisible to a reader, obvious to a "
                    "machine, and it breaks search and spell-check")
        return ("review", "non-Latin letter",
                "the surrounding word is not Latin, so this is probably just the language")
    if codepoint in FULLWIDTH:
        return ("normalize", f"fullwidth {FULLWIDTH[codepoint]!r}",
                "a fullwidth Latin letter renders wide and does not match its ASCII form in search")
    if codepoint in STRIP_CODEPOINTS:
        return "strip", STRIP_CODEPOINTS[codepoint], "invisible formatting with no function here"
    if codepoint in BIDI_CODEPOINTS:
        if RTL_RANGE.search(text):
            return "review", BIDI_CODEPOINTS[codepoint], "document contains right-to-left script: this may be required for correct display"
        if codepoint in BIDI_OVERRIDES:
            # "No RTL text, so nothing needs reordering" is the wrong inference for an
            # override: the override *is* the reordering. One document stored DRAWKCAB and
            # displayed BACKWARD, so removing the pair silently rewrote what the page said.
            # Removal is usually still right -- text that needs an override to read correctly
            # is hiding something -- but it changes the rendering, so a person decides.
            return ("review", BIDI_CODEPOINTS[codepoint],
                    "an override reorders the characters after it: removing it CHANGES WHAT "
                    "THE PAGE SHOWS. Compare the rendered text before and after, and fix the "
                    "stored text rather than deleting the control on its own")
        return "strip", BIDI_CODEPOINTS[codepoint], "no right-to-left text in this document, so nothing needs reordering"
    if codepoint in JOINERS:
        if EMOJI_RANGE.search(around):
            return "review", JOINERS[codepoint], "joins an emoji sequence"
        if INDIC_ARABIC.search(around):
            return "review", JOINERS[codepoint], "grammatical in Arabic, Persian and Indic scripts"
        return "strip", JOINERS[codepoint], "not adjacent to emoji or a script that uses it"
    if codepoint in VARIATION_SELECTORS:
        if EMOJI_RANGE.search(around):
            return "review", "variation selector", "selects the emoji presentation of the preceding character"
        return "strip", "variation selector", "no emoji base to apply to"
    if codepoint in SPACE_HOMOGLYPHS:
        name = SPACE_HOMOGLYPHS[codepoint]
        if codepoint in (0x00A0, 0x202F) and re.search(r"[\d.,]\s?$|^\s?[\d(]", around):
            return "review", name, "sits between a number and its unit or reference: probably deliberate typography"
        return "normalize", name, "stands in for an ordinary space and breaks search and diff"
    return None


def scan_text(text, loc="text"):
    """Every actionable codepoint in one string, with its context and verdict."""
    findings = []
    for i, ch in enumerate(text):
        result = classify(ord(ch), text, i)
        if not result:
            continue
        verdict, kind, why = result
        findings.append({
            "loc": loc,
            "codepoint": f"U+{ord(ch):04X}",
            "name": kind,
            "unicode_name": unicodedata.name(ch, "unspecified"),
            "verdict": verdict,
            "why": why,
            "context": repr(text[max(0, i - 25):i + 25]),
        })
    return findings


def escape_invisible(text):
    """Render invisible characters as codepoint notation so a report can quote evidence.

    This exists because of a failure that is obvious in hindsight: the artifact is told to
    quote the offending text verbatim, so an audit warning a client about thirteen hidden
    characters shipped with fifty hidden characters inside it. The report about the payload
    became a carrier of the payload.

    Any tool that surfaces hidden content will reproduce it unless something converts it
    first. Quote evidence through this function, always -- in the artifact, in the report,
    and in anything pasted into a chat reply.
    """
    out = []
    for ch in text:
        cp = ord(ch)
        if ch in "\n\t" or cp == 0x20:
            out.append(ch)
        elif (cp in STRIP_CODEPOINTS or cp in BIDI_CODEPOINTS or cp in JOINERS
              or cp in VARIATION_SELECTORS or cp in SPACE_HOMOGLYPHS
              or TAG_BLOCK[0] <= cp <= TAG_BLOCK[1] or not ch.isprintable()):
            out.append(f"<U+{cp:04X}>")
        else:
            out.append(ch)
    return "".join(out)


def decode_tag_payload(text):
    """Recover the text hidden in Unicode tag-block runs.

    The tag block mirrors printable ASCII: U+E0041 is "A". So a run of tag characters is a
    string somebody wrote, and reporting it as "13 tag characters at offset 402" throws away
    the only part a reader can act on. One fixture's payload decoded to `internal-only` -- the
    difference between a curiosity and "this document is marked internal and you are about to
    send it to a client".

    Returns a list of (start, decoded) for each run of two or more tag characters. Single
    strays are noise, not a message.
    """
    payloads, run_start, buffer = [], None, []
    for index, char in enumerate(text + "\0"):
        codepoint = ord(char)
        if TAG_BLOCK[0] <= codepoint <= TAG_BLOCK[1]:
            if run_start is None:
                run_start = index
            buffer.append(chr(codepoint - TAG_BLOCK[0]))
            continue
        if run_start is not None:
            if len(buffer) >= 2:
                decoded = "".join(buffer)
                printable = "".join(c for c in decoded if c.isprintable())
                payloads.append((run_start, printable or decoded))
            run_start, buffer = None, []
    return payloads


def summarize(findings):
    by_cp, by_verdict = {}, {"strip": 0, "normalize": 0, "review": 0}
    for f in findings:
        key = f"{f['codepoint']} {f['name']}"
        entry = by_cp.setdefault(key, {"count": 0, "verdict": f["verdict"], "why": f["why"]})
        entry["count"] += 1
        by_verdict[f["verdict"]] += 1
    return {"by_codepoint": by_cp, "by_verdict": by_verdict, "total": len(findings)}


def payloads_in(data):
    """Decoded hidden strings, gathered from wherever the scan read text."""
    found = []
    for source, text in data.get("texts", {}).items():
        for offset, decoded in decode_tag_payload(text):
            found.append({"where": source, "offset": offset, "decoded": decoded})
    return found


def clean_string(text, include_review=False):
    """Apply the verdicts. Returns (cleaned, changes)."""
    out, changes = [], 0
    for i, ch in enumerate(text):
        result = classify(ord(ch), text, i)
        if not result:
            out.append(ch)
            continue
        verdict = result[0]
        if verdict == "review" and not include_review:
            out.append(ch)
            continue
        if verdict == "normalize" or (verdict == "review" and ord(ch) in SPACE_HOMOGLYPHS):
            out.append(" ")
        changes += 1
    return "".join(out), changes


# --------------------------------------------------------------------------- office
TEXT_PARTS = re.compile(r"^(word/|ppt/slides/|ppt/notesSlides/|xl/)(.*\.xml)$")
PROPS_PARTS = ("docProps/core.xml", "docProps/app.xml", "docProps/custom.xml")


def _xml_text_nodes(xml):
    """Yield (start, end, text) for character data between tags. Cleaning only ever
    touches these spans, so markup cannot be damaged by a replacement."""
    for m in re.finditer(r">([^<]+)<", xml):
        yield m.start(1), m.end(1), m.group(1)


def scan_office(path):
    findings, props, texts = [], {}, {}
    with zipfile.ZipFile(path) as z:
        names = z.namelist()
        for name in names:
            if not (TEXT_PARTS.match(name) or name in PROPS_PARTS):
                continue
            try:
                xml = z.read(name).decode("utf-8", errors="replace")
            except KeyError:
                continue
            if name in PROPS_PARTS:
                for field in PROVENANCE_FIELDS:
                    for m in re.finditer(rf"<{re.escape(field)}[^>]*>([^<]*)</{re.escape(field)}>", xml):
                        value = m.group(1).strip()
                        if value:
                            props[field] = value
            for start, _end, chunk in _xml_text_nodes(xml):
                for f in scan_text(chunk, loc=f"{name}@{start}"):
                    findings.append(f)
                if chunk:
                    texts[f"{name}@{start}"] = chunk
    return findings, props, texts


def clean_office(src, dst, include_review=False):
    changes = 0
    with zipfile.ZipFile(src) as zin, zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if TEXT_PARTS.match(item.filename):
                xml = data.decode("utf-8", errors="replace")
                pieces, last = [], 0
                for start, end, chunk in _xml_text_nodes(xml):
                    cleaned, n = clean_string(chunk, include_review)
                    if n:
                        pieces.append(xml[last:start])
                        pieces.append(cleaned)
                        last = end
                        changes += n
                if pieces:
                    pieces.append(xml[last:])
                    data = "".join(pieces).encode("utf-8")
            zout.writestr(item, data)
    return changes


# --------------------------------------------------------------------------- driver
def _reject_opaque(path):
    """Refuse to read a file as text when its bytes say it is not.

    The dispatch below routes on extension, and everything that is not a known Office
    extension falls through to the text reader. That is right for `.md`, `.html`, and the
    long tail of text extensions we cannot enumerate -- but a `.docx` copied to
    `report.tmp` also lands there, gets decoded with errors="replace", and reports
    invisible-character hits that are really compressed zip bytes. A run that trusts that
    output can block a delivery on a finding that does not exist, so fail loudly instead.
    """
    with open(path, "rb") as fh:
        head = fh.read(8192)
    if head[:4] == b"PK\x03\x04":
        ext = os.path.splitext(path)[1].lower() or "(none)"
        _fail(f"{path} is a zip container but its extension is {ext}. "
              f"Office files must keep their real extension ({', '.join(OFFICE_EXTENSIONS)}) "
              f"or they are scanned as plain text and report phantom findings. "
              f"Rename the copy and run again.")
    if b"\x00" in head:
        _fail(f"{path} contains NUL bytes, so it is not text. "
              f"This scanner handles text files and {', '.join(OFFICE_EXTENSIONS)}.")


def scan(path, is_stdin=False):
    if is_stdin:
        body = sys.stdin.read()
        return {"source": "stdin", "type": "text", "findings": scan_text(body, "stdin"),
                "document_properties": {}, "texts": {"stdin": body}}
    if not os.path.isfile(path):
        _fail(f"file not found: {path}")
    ext = os.path.splitext(path)[1].lower()
    if ext in OFFICE_EXTENSIONS:
        findings, props, texts = scan_office(path)
        return {"source": path, "type": ext.lstrip("."), "findings": findings,
                "document_properties": props, "texts": texts}
    _reject_opaque(path)
    with open(path, encoding="utf-8", errors="replace") as fh:
        body = fh.read()
    return {"source": path, "type": "text",
            "findings": scan_text(body, os.path.basename(path)),
            "document_properties": {}, "texts": {os.path.basename(path): body}}


def clean(path, out, include_review=False):
    if os.path.abspath(path) == os.path.abspath(out):
        _fail("refusing to overwrite the original; give a different output path")
    ext = os.path.splitext(path)[1].lower()
    if ext in OFFICE_EXTENSIONS:
        return clean_office(path, out, include_review)
    _reject_opaque(path)
    with open(path, encoding="utf-8", errors="replace") as fh:
        body = fh.read()
    cleaned, changes = clean_string(body, include_review)
    with open(out, "w", encoding="utf-8") as fh:
        fh.write(cleaned)
    return changes


def with_payloads(data):
    """Attach decoded hidden text to the JSON output under its own key."""
    enriched = dict(data)
    enriched["hidden_text"] = payloads_in(data)
    enriched.pop("texts", None)      # the raw parts are working material, not output
    return enriched


def print_report(data):
    summary = summarize(data["findings"])
    hidden = payloads_in(data)
    if hidden:
        # First, before the codepoint tally. The tally says somebody hid something; this
        # says what. Only one of those is a finding a reader can act on.
        print("\nHIDDEN TEXT RECOVERED from the Unicode tag block:")
        for item in hidden:
            print(f"  {escape_invisible(item['decoded'])!r}")
            print(f"      at {item['where']} offset {item['offset']}")
        print("  → read this before deciding anything else. It is content the document")
        print("    carries and no reader can see. --clean removes the characters; only you")
        print("    can judge what the message means for sending this file.")
    print(f"{data['type']} · {data['source']}")
    print(f"\n{summary['total']} actionable characters "
          f"(strip {summary['by_verdict']['strip']} · "
          f"normalize {summary['by_verdict']['normalize']} · "
          f"review {summary['by_verdict']['review']})")
    if summary["by_codepoint"]:
        print()
        for key, entry in sorted(summary["by_codepoint"].items(),
                                 key=lambda kv: -kv[1]["count"]):
            print(f"  {entry['count']:4}x  {key:42} [{entry['verdict']}] {entry['why']}")
    else:
        print("  no invisible characters or exotic spaces found")
    props = data["document_properties"]
    if props:
        print("\ndocument properties carrying provenance:")
        for field, value in props.items():
            print(f"  {field:22} {value}")
        print("  → these travel with the file to the client. Decide each one deliberately;")
        print("    this script reports them and does not strip them.")
    elif data["type"] != "text":
        print("\ndocument properties: none carrying an author, company, or tool name")
    if summary["by_verdict"]["review"]:
        print("\nreview-class hits are load-bearing or plausibly deliberate. --clean leaves")
        print("them alone unless you pass --include-review, and that needs a reason.")


def parse_args(argv):
    opts = {"path": None, "clean": None, "report": False, "include_review": False}
    i = 0
    while i < len(argv):
        arg = argv[i]
        if arg in ("-h", "--help"):
            print(__doc__)
            sys.exit(0)
        if arg == "--report":
            opts["report"] = True
        elif arg == "--include-review":
            opts["include_review"] = True
        elif arg == "--clean":
            i += 1
            if i >= len(argv):
                _fail("--clean needs an output path")
            opts["clean"] = argv[i]
        elif arg.startswith("-") and arg != "-":
            _fail(f"unknown option {arg}")
        elif opts["path"] is None:
            opts["path"] = arg
        else:
            _fail("expected exactly one input path")
        i += 1
    if not opts["path"]:
        _fail(__doc__.split("Usage:")[1].split("Three verdict")[0].strip())
    return opts


def main():
    opts = parse_args(sys.argv[1:])
    is_stdin = opts["path"] == "-"
    if opts["clean"]:
        if is_stdin:
            _fail("--clean needs a real input file, not stdin")
        before = scan(opts["path"])
        changes = clean(opts["path"], opts["clean"], opts["include_review"])
        after = scan(opts["clean"])
        print(json.dumps({
            "source": opts["path"], "output": opts["clean"],
            "characters_changed": changes,
            "before": summarize(before["findings"]),
            "after": summarize(after["findings"]),
            "document_properties": before["document_properties"],
            "note": ("document properties are reported, never stripped: removing an author "
                     "or a template name can breach a records or audit obligation, so it is "
                     "a decision for the user and not a default"),
        }, indent=2, ensure_ascii=False))
        return
    data = scan(opts["path"], is_stdin)
    if opts["report"]:
        print_report(data)
    else:
        print(json.dumps({**with_payloads(data), "summary": summarize(data["findings"])},
                         indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
