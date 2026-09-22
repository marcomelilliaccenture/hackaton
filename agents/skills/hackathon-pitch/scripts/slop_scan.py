#!/usr/bin/env python3
"""Deterministic slop measurements for any text, and for Office documents.

This script measures; it does not score and it does not judge. It gives the audit
reproducible numbers and exact locations so findings cite evidence instead of impressions,
and so every run computes the same statistics the same way.

What it reports:
  - marker_hits        lexical/rhetorical pattern hits by category, with loc and matched text
  - dashes             em/en dash counts and rate per 1,000 words
  - sentences          count, mean, stdev, short-sentence count, and per-5-sentence-window
                       rhythm (a document-wide stdev hides local metronomic passages)
  - segment_uniformity share of paragraphs/slides within 15% of the mean length
  - clean_slop         aphoristic-close candidates, clipped fragment pairs, rule-of-three,
                       antithesis and hook counts (the post-cleanup house style)
  - outline            first sentence per paragraph / slide titles in order, for the outline test
  - specificity        numbers, dates, money, percentages, proper nouns per 100 words
  - confidence         hedge density and distribution (absent hedging is a tell too)
  - passive            regex estimate, English and Italian
  - norms_without_baseline   normative words with no number or baseline term nearby

Usage:
    python3 slop_scan.py <file.docx|.pptx|.xlsx>     # Office: extracts, then scans
    python3 slop_scan.py <file.md|.txt|.html|...>    # any text file
    cat draft.md | python3 slop_scan.py -            # text on stdin
    python3 slop_scan.py <extraction.json>           # an existing extraction
    python3 extract_office.py doc.docx | python3 slop_scan.py -

Options:
    --lang en|it|auto   marker set and passive heuristic (default: auto)
    --text              force plain-text handling (only needed for an odd extension)
    --outline           print only the outline material, one line per unit
    --report            human-readable summary instead of JSON
    --max-hits N        cap hits kept per category (default 12)

Every number here is an estimate produced by regular expressions. Sentence splitting,
passive voice, and proper-noun detection have no parser behind them. Treat a hit as a
pointer to a location worth reading, never as a finding on its own, and never report a
measurement this script could not make (see the coverage rules in audit-artifact.md).
"""
import json
import os
import re
import statistics
import sys

MAX_HITS_DEFAULT = 12
SHORT_SENTENCE_WORDS = 6
WINDOW = 5
UNIFORM_BAND = 0.15
METRONOME_CV = 0.30

from slop_patterns import (
    EN_MARKERS, IT_MARKERS, NORM_WORDS_EN, NORM_WORDS_IT, BASELINE_WORDS,
    HEDGES_EN, HEDGES_IT, MONTHS, IT_STOPWORDS, EN_STOPWORDS,
)


def _fail(msg, code=1):
    print(f"error: {msg}", file=sys.stderr)
    sys.exit(code)


# --------------------------------------------------------------------------- input
TEXT_EXTENSIONS = (".txt", ".md", ".markdown", ".rst", ".html", ".htm", ".tex", ".csv", ".srt")
OFFICE_EXTENSIONS = (".docx", ".pptx", ".xlsx")


def load_extraction(arg, text_mode=False):
    """Return (meta, segments, headings).

    Accepts an Office file, an extraction JSON, a text file, or text on stdin. Plain text is
    the common case — any prose the user pastes or points at — so it needs no flag unless the
    extension is unknown.
    """
    if arg == "-":
        raw = sys.stdin.read()
        if not text_mode:
            try:
                return _from_json(json.loads(raw))
            except ValueError:
                pass  # not an extraction: treat stdin as prose
        return _from_text(raw)
    ext = os.path.splitext(arg)[1].lower()
    if ext == ".json" and not text_mode:
        with open(arg, encoding="utf-8") as fh:
            return _from_json(json.load(fh))
    if ext in OFFICE_EXTENSIONS and not text_mode:
        return _from_office(arg)
    if not os.path.isfile(arg):
        _fail(f"file not found: {arg}")
    with open(arg, encoding="utf-8", errors="replace") as fh:
        return _from_text(fh.read())


def _from_text(body):
    """Split prose into located blocks. Markdown headings keep their own loc and are
    reported as headings so the outline test has something structural to read."""
    segments, headings = [], []
    for i, block in enumerate(re.split(r"\n\s*\n", body)):
        text = block.strip()
        if not text:
            continue
        loc = f"block {i + 1}"
        heading = re.match(r"^(#{1,6})\s+(.*)$", text)
        if heading:
            headings.append({"loc": loc, "level": str(len(heading.group(1))),
                             "text": heading.group(2).strip()})
        segments.append({"loc": loc, "text": re.sub(r"^#{1,6}\s+", "", text)})
    return {"type": "text", "words": len(body.split())}, segments, headings


def _from_json(data):
    return data.get("meta", {}), data.get("segments", []), data.get("headings", [])


def _from_office(path):
    if not os.path.isfile(path):
        _fail(f"file not found: {path}")
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    try:
        import extract_office
    except ImportError:
        _fail("extract_office.py must sit next to slop_scan.py")
    ext = os.path.splitext(path)[1].lower()
    extractor = extract_office.EXTRACTORS.get(ext)
    if not extractor:
        _fail(f"unsupported extension {ext}; expected .docx, .pptx or .xlsx")
    meta, _full, segments, _f, _c, headings = extractor(path, include_visual=False)
    return meta, segments, headings


# --------------------------------------------------------------------------- text units
def split_sentences(text):
    parts = re.split(r"(?<=[.!?…])\s+(?=[\"'(\[]?[A-ZÀ-Ý0-9])", text.strip())
    return [p.strip() for p in parts if p.strip()]


def prose_only(segments, headings):
    """Segments minus headings.

    A three-word heading is not a sentence and not a paragraph, but it lands in both
    distributions and drags the mean down, so rhythm and uniformity — which feed Dimension 3 —
    end up measuring the document's heading density. Headings stay in marker scanning and in
    the outline test, where they are exactly what should be read.
    """
    titles = {h.get("text", "").strip() for h in headings if h.get("text")}
    return [s for s in segments if s.get("text", "").strip() not in titles]


def sentence_index(segments):
    """Flatten segments into ordered (loc, sentence) pairs."""
    out = []
    for seg in segments:
        for sent in split_sentences(seg.get("text", "")):
            out.append((seg.get("loc", "?"), sent))
    return out


def detect_language(segments):
    body = " ".join(s.get("text", "") for s in segments).lower()
    if not body.strip():
        return "en"
    it = sum(body.count(w) for w in IT_STOPWORDS)
    en = sum(body.count(w) for w in EN_STOPWORDS)
    return "it" if it > en else "en"


def word_count(segments):
    return sum(len(s.get("text", "").split()) for s in segments)


# --------------------------------------------------------------------------- measures
def scan_markers(segments, lang, max_hits):
    """Regex hits by category, with location and the matched text."""
    tables = [EN_MARKERS] if lang == "en" else [EN_MARKERS, IT_MARKERS]
    results = {}
    for table in tables:
        for category, patterns in table.items():
            bucket = results.setdefault(category, {"hits": [], "total": 0})
            for pattern in patterns:
                rx = re.compile(pattern, re.IGNORECASE | re.MULTILINE)
                for seg in segments:
                    for m in rx.finditer(seg.get("text", "")):
                        bucket["total"] += 1
                        if len(bucket["hits"]) < max_hits:
                            bucket["hits"].append({
                                "loc": seg.get("loc", "?"),
                                "match": m.group(0).strip(),
                                "pattern": pattern,
                            })
    for category, bucket in results.items():
        bucket["truncated"] = max(0, bucket["total"] - len(bucket["hits"]))
    return {k: v for k, v in results.items() if v["total"]}


def dash_stats(segments, words):
    body = " ".join(s.get("text", "") for s in segments)
    em, en = body.count("—"), body.count("–")
    double_hyphen = len(re.findall(r"\s--\s", body))
    total = em + en + double_hyphen
    return {
        "em_dash": em, "en_dash": en, "double_hyphen": double_hyphen,
        "per_1000_words": round(total / words * 1000, 2) if words else 0.0,
        "note": "one dash is not evidence; a rate above 1 per 500 words matters only in a cluster",
    }


def sentence_stats(pairs):
    lengths = [len(s.split()) for _loc, s in pairs]
    if len(lengths) < 2:
        return {"count": len(lengths), "note": "sample too small to judge rhythm"}
    windows = []
    for i in range(0, max(1, len(lengths) - WINDOW + 1)):
        chunk = lengths[i:i + WINDOW]
        if len(chunk) < WINDOW:
            break
        mean = statistics.mean(chunk)
        cv = (statistics.pstdev(chunk) / mean) if mean else 0.0
        if cv < METRONOME_CV:
            windows.append({"start_loc": pairs[i][0], "lengths": chunk, "cv": round(cv, 3)})
    return {
        "count": len(lengths),
        "mean_words": round(statistics.mean(lengths), 1),
        "stdev_words": round(statistics.pstdev(lengths), 1),
        "min_words": min(lengths), "max_words": max(lengths),
        "under_6_words": sum(1 for n in lengths if n < SHORT_SENTENCE_WORDS),
        "metronomic_windows": windows[:MAX_HITS_DEFAULT],
        "metronomic_window_count": len(windows),
        "note": (f"a window of {WINDOW} consecutive sentences with cv < {METRONOME_CV} is "
                 "locally machine-regular even when the document-wide stdev looks healthy"),
    }


def segment_uniformity(segments):
    lengths = [len(s.get("text", "").split()) for s in segments if s.get("text")]
    if len(lengths) < 4:
        return {"units": len(lengths), "note": "sample too small to judge uniformity"}
    mean = statistics.mean(lengths)
    band = sum(1 for n in lengths if abs(n - mean) <= mean * UNIFORM_BAND)
    return {
        "units": len(lengths),
        "mean_words": round(mean, 1),
        "within_15pct_of_mean": band,
        "share_within_band": round(band / len(lengths), 2),
        "note": "above 0.60 supports a single-track finding; rigid formats are exempt",
    }


# An aphoristic close is not "a short last sentence". That test has no textual criterion, so
# it scores the slack sentence Part A8 explicitly asks for -- "We will see", "Non lo sappiamo
# ancora" -- exactly like "In conclusion, the future is bright". Four runs hit this, and on
# one correct fix the count rose 1 to 5 purely because shortening the units left more short
# closes behind, which then read as a regression under the Part B re-audit rule. Following one
# rule was manufacturing a violation of another.
#
# What actually distinguishes the two is not length. An aphorism delivers a verdict: it asserts
# something general, about an abstract subject, with no hedge and nothing named. A slack
# sentence does the opposite -- it leaves something open. So require the assertion and let
# anything hedged, questioning or concrete through.
HEDGED_CLOSE = re.compile(
    r"\b(we (do not|don't|cannot|can't) know|not yet|we will see|remains? to be seen|"
    r"too early|unclear|hard to say|may|might|could|perhaps|maybe|probably|likely|"
    r"vedremo|non lo sappiamo|non è chiaro|non e chiaro|resta da vedere|troppo presto|"
    r"forse|potrebbe|potrebbero|probabilmente|difficile dire|ancora)\b", re.I)

def aphoristic_close(sentence):
    """Return (is_candidate, reason).

    Four filters, each standing for a distinction the references actually draw. Length only
    narrows the field; what decides is whether the sentence closes something down. A hedge or
    an open question is A8 slack and is left alone. A digit or a name means the close is
    doing concrete work, which is the opposite of the failure.

    No test for a verdict verb. One was tried and it missed `That's a sequencing problem.`
    and `It will not stay open forever.` -- both textbook closes -- because contractions and
    modals do not look like copulas. The output is a candidate list the reader is told to open,
    so a shape this loose is honest where a clever regex would be confidently wrong.
    """
    if len(sentence.split()) > 12 or sentence.rstrip().endswith("?"):
        return False, ""
    if re.search(r"\d", sentence):
        return False, ""
    if HEDGED_CLOSE.search(sentence):
        return False, "hedged or unresolved: A8 slack, not a finding"
    if proper_nouns([{"text": sentence}]):
        return False, "names something concrete"
    return True, "short abstract close, no hedge, nothing named - read it before scoring it"


def clean_slop(segments, marker_hits):
    """The post-cleanup house style: see Part B of references/structure-epistemics.md."""
    aphorisms, fragment_pairs = [], []
    for seg in segments:
        sents = split_sentences(seg.get("text", ""))
        if len(sents) >= 2:
            last = sents[-1]
            verdict, why = aphoristic_close(last)
            if verdict:
                aphorisms.append({"loc": seg.get("loc", "?"), "text": last, "why": why})
        for a, b in zip(sents, sents[1:]):
            if len(a.split()) <= 4 and len(b.split()) <= 4:
                fragment_pairs.append({"loc": seg.get("loc", "?"), "text": f"{a} {b}"})
    body = " ".join(s.get("text", "") for s in segments)
    triads = re.findall(r"\b([\w'À-ÿ]+), ([\w'À-ÿ]+),? (?:and|e|ed) ([\w'À-ÿ]+)\b", body)
    units = max(1, len([s for s in segments if s.get("text")]))
    return {
        "aphoristic_close_candidates": aphorisms[:MAX_HITS_DEFAULT],
        "aphoristic_close_count": len(aphorisms),
        "aphoristic_close_share_of_units": round(len(aphorisms) / units, 2),
        "clipped_fragment_pairs": fragment_pairs[:MAX_HITS_DEFAULT],
        "clipped_fragment_pair_count": len(fragment_pairs),
        "rule_of_three_count": len(triads),
        "rule_of_three_examples": [" ".join(t) for t in triads[:MAX_HITS_DEFAULT]],
        "hook_count": marker_hits.get("authority_hook", {}).get("total", 0),
        "verdict_verb_count": marker_hits.get("verdict_verb", {}).get("total", 0),
        "antithesis_count": marker_hits.get("negative_parallelism", {}).get("total", 0),
        "note": ("budget is one aphoristic close per document; a share above 0.30 is a texture "
                 "finding, not a phrase finding"),
    }


def outline(segments, headings, meta):
    """Material for the outline test (A3). Titles in order for a deck, first sentences otherwise."""
    if meta.get("type") == "pptx" and headings:
        lines = [{"loc": h.get("loc", "?"), "text": h.get("text", "")} for h in headings]
        basis = "slide titles in order"
    else:
        lines = []
        for seg in segments:
            sents = split_sentences(seg.get("text", ""))
            if sents:
                lines.append({"loc": seg.get("loc", "?"), "text": sents[0]})
        basis = "first sentence of each unit, in order"
    return {
        "basis": basis,
        "lines": lines[:60],
        "truncated": max(0, len(lines) - 60),
        "note": ("read these in sequence and nothing else. If they form a clean, complete "
                 "summary, the document-level structure is machine-shaped. Rigid formats, "
                 "agendas and executive summaries are exempt"),
    }


# A word is not a named thing just because it is capitalised. It may simply start a sentence,
# a bullet, a slide title or a spreadsheet cell -- and the old lookbehind only skipped a
# capital that followed ". ", which a pptx or xlsx segment rarely provides. Three runs across
# two iterations reported specificity inflated by The, This, Our and Your, and
# references/scoring.md makes this field the evidence for the A5 deduction, so the error was
# scored rather than merely displayed.
#
# Capitalised function words never count. Everything else counts only where it appears away
# from the first position, which means a real name still registers from any later mention.
NEVER_PROPER = {
    "the", "this", "that", "these", "those", "there", "their", "they", "our", "your", "his",
    "her", "its", "and", "but", "for", "with", "from", "into", "when", "while", "where",
    "what", "which", "who", "how", "why", "all", "any", "each", "every", "some", "most",
    "one", "two", "three", "not", "now", "then", "also", "after", "before", "because",
    "however", "although", "since", "until", "both", "either", "neither", "you", "was",
    "were", "are", "has", "have", "had", "will", "would", "can", "could", "should", "may",
    "might", "must", "does", "did", "such", "more", "less", "many", "much", "over", "under",
    "il", "lo", "la", "gli", "le", "un", "uno", "una", "questo", "questa", "questi", "queste",
    "quello", "quella", "nostro", "nostra", "nostri", "nostre", "vostro", "vostra", "loro",
    "che", "chi", "cui", "con", "per", "tra", "fra", "dal", "del", "della", "delle", "degli",
    "nel", "nella", "nelle", "negli", "sul", "sulla", "come", "quando", "mentre", "dove",
    "perche", "perché", "anche", "ancora", "dopo", "prima", "poi", "tutti", "tutte", "ogni",
    "alcuni", "molti", "sono", "essere", "avere", "sara", "sarà", "puo", "può", "deve",
}


def proper_nouns(segments):
    """Capitalised tokens that are plausibly names.

    Two passes. The first collects capitals away from the first position, where the
    capitalisation can only be the writer naming something. The second counts every
    occurrence of those tokens, so a name that also opens a sentence still registers there.

    A capital at the first position that is never seen elsewhere stays uncounted. That misses
    a name mentioned exactly once, at the start of its only sentence -- but the alternative
    counts `Delivery is on schedule.` as a named thing, which is the inflation this function
    exists to remove. references/scoring.md reads this field as evidence for the A5 deduction,
    and a deduction wrongly lifted is worse than one wrongly kept.
    """
    def candidates(sentence):
        return re.findall(r"\b[\w'À-ÿ]+\b", sentence)

    def nameable(token):
        return (re.match(r"^[A-ZÀ-Ý][a-zà-ÿ]{2,}$", token)
                and token.lower() not in NEVER_PROPER)

    def title_cased(sentence):
        """A heading in Title Case is not a list of names.

        `Proposta di Trasformazione Digitale` counted two named things. Worse, the skill's own
        fix is to drop the heading to sentence case, which then *lowers* the measured
        specificity and makes a correct fix look like a regression. Function words stay
        lowercase in title case, so judge on the content words only.
        """
        words = re.findall(r"\b[\w'À-ÿ]+\b", sentence)
        content = [w for w in words if len(w) > 3 and w.lower() not in NEVER_PROPER]
        if len(content) < 2:
            return False
        capped = sum(1 for w in content if re.match(r"^[A-ZÀ-Ý]", w))
        return capped >= 2 and capped >= len(content) - 1

    sentences = [sent for seg in segments
                 for sent in split_sentences(seg.get("text", ""))
                 if not title_cased(sent)]

    known = {token for sent in sentences
             for index, token in enumerate(candidates(sent))
             if index > 0 and nameable(token)}

    found = []
    for sent in sentences:
        for index, token in enumerate(candidates(sent)):
            if not nameable(token):
                continue
            if index == 0 and token not in known:
                continue
            found.append(token)
    return found


def specificity(segments, words):
    body = " ".join(s.get("text", "") for s in segments)
    numbers = len(re.findall(r"\b\d[\d.,]*\b", body))
    money = len(re.findall(r"[€$£¥]|\b(EUR|USD|GBP|CHF)\b", body))
    percents = len(re.findall(r"\d\s?%|\bpercent\b|\bper cento\b", body, re.IGNORECASE))
    dates = len(re.findall(r"\b(19|20)\d\d\b|\b(" + MONTHS + r")\b", body, re.IGNORECASE))
    propers = len(proper_nouns(segments))
    per100 = (lambda n: round(n / words * 100, 2) if words else 0.0)
    return {
        "words": words,
        "numbers": numbers, "money": money, "percentages": percents,
        "dates": dates, "proper_nouns_estimate": propers,
        "absolute_named_things": numbers + money + dates + propers,
        "named_things_per_100_words": per100(numbers + money + dates + propers),
        "note": ("low density beside high confidence is the signature. Read the absolute "
                 "count first: the density is a ratio over a shrinking denominator, so it "
                 "rises when a fix pass deletes words even though nothing new was named. "
                 "Raise it only from the source or the user — inventing specifics is worse "
                 "than a cliché"),
    }


def confidence(pairs, lang):
    """Hedges are matched as whole words: a substring test fires on "about the migration"
    and on "May 2026", and an overcounted hedge ratio reads as smeared insurance while an
    undercounted one reads as uniform confidence — errors in opposite directions."""
    patterns = HEDGES_EN if lang == "en" else HEDGES_EN + HEDGES_IT
    hedges = [re.compile(p, re.IGNORECASE) for p in patterns]
    hedged, examples = 0, []
    for loc, sent in pairs:
        m = next((rx.search(sent) for rx in hedges if rx.search(sent)), None)
        hit = m.group(0) if m else None
        if hit:
            hedged += 1
            if len(examples) < MAX_HITS_DEFAULT:
                examples.append({"loc": loc, "hedge": hit.strip()})
    total = len(pairs)
    ratio = round(hedged / total, 2) if total else 0.0
    # The 25-sentence floor governs whether B7 can be *charged*, not what is true. Below it,
    # zero hedges is still zero hedges -- describing that as "mixed" reported a distribution
    # the document did not have, on exactly the short artifacts this skill audits most.
    if hedged == 0:
        verdict = (f"uniform_confidence: no sentence in the document is unsure of itself"
                   f"{'' if total >= 25 else f' (only {total} sentences: below the 25-sentence floor, so report it, do not charge B7 for it)'}")
    elif ratio > 0.5:
        verdict = "smeared_hedging: qualifiers are insurance rather than epistemics"
    else:
        verdict = "mixed: check that each hedge sits on a genuinely soft claim"
    return {
        "sentences": total, "hedged_sentences": hedged, "hedged_ratio": ratio,
        "examples": examples, "verdict": verdict,
        "note": "confidence should be uneven because knowledge is uneven",
    }


def passive_estimate(pairs, lang):
    en = re.compile(r"\b(is|are|was|were|be|been|being|gets|got)\s+(\w+ed|\w+en)\b", re.IGNORECASE)
    it = re.compile(r"\b(è|sono|viene|vengono|era|erano|stato|stata|essere|venire)\s+"
                    r"\w+(ato|ata|ati|ate|uto|uta|ito|ita)\b", re.IGNORECASE)
    rx = en if lang == "en" else it
    hits = [{"loc": loc, "text": s[:140]} for loc, s in pairs if rx.search(s)]
    total = len(pairs)
    return {
        "sentences": total,
        "passive_sentences_estimate": len(hits),
        "share": round(len(hits) / total, 2) if total else 0.0,
        "examples": hits[:MAX_HITS_DEFAULT],
        "note": ("regex estimate, no parser. Keep the passive where the actor is unknown, "
                 "irrelevant or conventionally omitted, and never invent an actor"),
    }


def norms_without_baseline(segments, lang):
    """A normative claim is checked per sentence: a baseline elsewhere in the paragraph is
    not a baseline for this claim."""
    norms = NORM_WORDS_EN if lang == "en" else NORM_WORDS_EN + NORM_WORDS_IT
    norm_rx = [re.compile(p, re.IGNORECASE) for p in norms]
    base_rx = [re.compile(p, re.IGNORECASE) for p in BASELINE_WORDS]
    flagged = []
    for seg in segments:
        for sent in split_sentences(seg.get("text", "")):
            found = [rx.search(sent).group(0) for rx in norm_rx if rx.search(sent)]
            if not found:
                continue
            if any(rx.search(sent) for rx in base_rx):
                continue
            flagged.append({"loc": seg.get("loc", "?"), "norms": found, "text": sent[:180]})
    return {
        "flagged_sentences": len(flagged),
        # references/scoring.md deducts per *assertion*, not per sentence, and one cell or
        # sentence routinely carries several ("Healthy" plus "well within range"). Reporting
        # only the sentence count made a workbook of fifteen unsupported ratings arrive at the
        # scoring table as six.
        "flagged_assertions": sum(len(f["norms"]) for f in flagged),
        "examples": flagged[:MAX_HITS_DEFAULT],
        "note": ("a normative word with no named baseline (plan, target, prior period, "
                 "contract, published reference) in the same sentence is an invented "
                 "threshold. Epistemics rule C2 in references/structure-epistemics.md; the "
                 "fix is the baseline or an author-input item, never a softer adjective"),
    }


# --------------------------------------------------------------------------- assembly
def scan(meta, segments, headings, lang, max_hits):
    words = word_count(segments)
    prose = prose_only(segments, headings)
    pairs = sentence_index(prose)
    hits = scan_markers(segments, lang, max_hits)
    return {
        "meta": {**meta, "language": lang, "scanned_units": len(segments),
                 "prose_units": len(prose), "words": words,
                 "words_note": ("counted from segments; the extractor's own meta.words "
                                "includes its structure markers and runs a few percent high")},
        "marker_hits": hits,
        "marker_totals": {k: v["total"] for k, v in sorted(hits.items())},
        "dashes": dash_stats(segments, words),
        "sentences": sentence_stats(pairs),
        "segment_uniformity": segment_uniformity(prose),
        "clean_slop": clean_slop(prose, hits),
        "outline": outline(segments, headings, meta),
        "specificity": specificity(segments, words),
        "confidence": confidence(pairs, lang),
        "passive": passive_estimate(pairs, lang),
        "norms_without_baseline": norms_without_baseline(segments, lang),
        "disclaimer": ("measurements only, produced by regular expressions. No score is "
                       "computed here and no hit is a finding on its own: read the cited "
                       "location before reporting it, and apply the false-positive rules in "
                       "references/humanize.md and references/structure-epistemics.md"),
    }


def print_report(data):
    m = data["meta"]
    print(f"{m.get('type', '?')} · {m.get('words', 0)} words · {m.get('scanned_units')} units "
          f"({m.get('prose_units')} prose) · language {m.get('language')}")
    # Locations, not just totals. SKILL.md tells you to read the cited location before
    # reporting anything, and for four iterations this printed counts only -- so every run
    # had to re-invoke the script in JSON mode to obey the instruction above it.
    print("\nmarker hits (read each location before reporting it)")
    for cat, entry in data["marker_hits"].items():
        print(f"  {cat} — {entry['total']}")
        for hit in entry["hits"]:
            print(f"      {hit['loc']:16} {hit['match']!r}")
        if entry.get("truncated"):
            print(f"      … {entry['truncated']} more not shown; use JSON output for all")
    if not data["marker_hits"]:
        print("  none")
    s, cs = data["sentences"], data["clean_slop"]
    print(f"\nrhythm     mean {s.get('mean_words')} · stdev {s.get('stdev_words')} · "
          f"under 6 words {s.get('under_6_words')} · metronomic windows "
          f"{s.get('metronomic_window_count')}")
    print(f"uniformity {data['segment_uniformity'].get('share_within_band')} of units within "
          f"15% of mean length")
    print(f"clean slop aphoristic closes {cs['aphoristic_close_count']} "
          f"(share {cs['aphoristic_close_share_of_units']}) · fragment pairs "
          f"{cs['clipped_fragment_pair_count']} · rule of three {cs['rule_of_three_count']} · "
          f"hooks {cs['hook_count']}")
    print(f"dashes     em {data['dashes']['em_dash']} · en {data['dashes']['en_dash']} · "
          f"{data['dashes']['per_1000_words']} per 1000 words")
    print(f"specifics  {data['specificity']['absolute_named_things']} named things "
          f"({data['specificity']['named_things_per_100_words']} per 100 words)")
    conf = data["confidence"]
    if conf.get("hedged_ratio") == 0 and conf.get("sentences", 1) > 0:
        print(f"confidence no hedges at all in {conf.get('sentences', '?')} sentences "
              f"(uniform, not mixed)")
    else:
        print(f"confidence {data['confidence']['verdict']} (hedged ratio "
          f"{data['confidence']['hedged_ratio']})")
    print(f"passive    {data['passive']['share']} of sentences (estimate)")
    nb = data["norms_without_baseline"]
    print(f"norms      {nb['flagged_assertions']} assertions in {nb['flagged_sentences']} "
          "sentences assert a norm with no baseline")
    # SKILL.md calls this the most common real defect in business documents and tells you to
    # read the cited location. Printing a bare count meant the location existed only in JSON.
    for hit in nb.get("examples", []):
        print(f"      {hit['loc']:16} {', '.join(hit['norms'])}")
    print(f"\noutline test ({data['outline']['basis']}) — read these in sequence:")
    for line in data["outline"]["lines"]:
        print(f"  [{line['loc']}] {line['text'][:110]}")


def print_outline(data):
    print(f"# outline test — {data['outline']['basis']}")
    for line in data["outline"]["lines"]:
        print(f"[{line['loc']}] {line['text']}")
    if data["outline"]["truncated"]:
        print(f"... {data['outline']['truncated']} more units")


def parse_args(argv):
    opts = {"path": None, "lang": "auto", "text": False, "outline": False,
            "report": False, "max_hits": MAX_HITS_DEFAULT}
    i = 0
    while i < len(argv):
        arg = argv[i]
        if arg in ("-h", "--help"):
            print(__doc__)
            sys.exit(0)
        if arg == "--text":
            opts["text"] = True
        elif arg == "--outline":
            opts["outline"] = True
        elif arg == "--report":
            opts["report"] = True
        elif arg == "--lang":
            i += 1
            opts["lang"] = argv[i] if i < len(argv) else "auto"
        elif arg == "--max-hits":
            i += 1
            opts["max_hits"] = int(argv[i]) if i < len(argv) else MAX_HITS_DEFAULT
        elif arg.startswith("-") and arg != "-":
            _fail(f"unknown option {arg}")
        elif opts["path"] is None:
            opts["path"] = arg
        else:
            _fail("expected exactly one input path")
        i += 1
    if opts["lang"] not in ("auto", "en", "it"):
        _fail("--lang must be auto, en or it")
    if not opts["path"]:
        _fail(__doc__.split("Usage:")[1].split("Options:")[0].strip())
    return opts


def main():
    opts = parse_args(sys.argv[1:])
    meta, segments, headings = load_extraction(opts["path"], text_mode=opts["text"])
    if not segments:
        _fail("no readable text found; check the extraction or the source file")
    lang = detect_language(segments) if opts["lang"] == "auto" else opts["lang"]
    data = scan(meta, segments, headings, lang, opts["max_hits"])
    if opts["outline"]:
        print_outline(data)
    elif opts["report"]:
        print_report(data)
    else:
        print(json.dumps(data, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
