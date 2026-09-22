#!/usr/bin/env python3
"""PreToolUse hook: refuse writes to the official challenge brief.

`docs/challenge-brief.md` is the text the jury judges against. Anything that
rewrites, summarises or "improves" it silently moves the target. Our own notes
go in other files.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

PROTECTED = {"docs/challenge-brief.md"}
ROOT = Path(__file__).resolve().parents[2]


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except Exception:
        return 0

    raw = (payload.get("tool_input") or {}).get("file_path", "")
    if not raw:
        return 0
    try:
        rel = Path(raw).resolve().relative_to(ROOT).as_posix()
    except Exception:
        return 0
    if rel not in PROTECTED:
        return 0

    json.dump(
        {
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": (
                    f"{rel} è il brief ufficiale: fonte di verità, non si modifica. "
                    "Annota altrove (docs/decision-log.md) e cita il brief."
                ),
            }
        },
        sys.stdout,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
