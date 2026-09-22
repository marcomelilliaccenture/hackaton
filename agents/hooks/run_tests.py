#!/usr/bin/env python3
"""PostToolUse hook: run the unit tests after a source edit under app/ or agents/.

Silent while the tests pass. On failure it hands the output back to Claude as
additional context, so a broken change is caught at the edit that caused it
instead of three edits later.

No-ops before the app is scaffolded (no app/package.json, no test script).
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
APP = ROOT / "app"
WATCHED_SUFFIXES = {".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"}
WATCHED_DIRS = ("app", "agents")
TIMEOUT_S = 120


def emit(context: str) -> None:
    json.dump(
        {
            "hookSpecificOutput": {
                "hookEventName": "PostToolUse",
                "additionalContext": context,
            },
            "systemMessage": "unit test falliti dopo l'ultima modifica",
        },
        sys.stdout,
    )


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except Exception:
        return 0

    raw = (payload.get("tool_input") or {}).get("file_path", "")
    if not raw:
        return 0
    path = Path(raw)
    if path.suffix not in WATCHED_SUFFIXES:
        return 0
    try:
        rel = path.resolve().relative_to(ROOT).as_posix()
    except Exception:
        return 0
    if not rel.startswith(WATCHED_DIRS):
        return 0
    if ".test." in path.name or ".spec." in path.name:
        pass  # test files are worth re-running too

    pkg = APP / "package.json"
    if not pkg.exists():
        return 0
    try:
        scripts = json.loads(pkg.read_text(encoding="utf-8")).get("scripts", {})
    except Exception:
        return 0
    if "test" not in scripts:
        return 0

    try:
        run = subprocess.run(
            ["npm", "test", "--silent"],
            cwd=APP,
            capture_output=True,
            text=True,
            timeout=TIMEOUT_S,
            shell=True,  # npm is a .cmd shim on Windows
        )
    except subprocess.TimeoutExpired:
        emit(f"I unit test non sono terminati entro {TIMEOUT_S}s dopo la modifica a {rel}.")
        return 0
    except FileNotFoundError:
        return 0

    if run.returncode != 0:
        tail = (run.stdout + run.stderr).strip()[-3000:]
        emit(f"`npm test` è fallito dopo la modifica a {rel}:\n\n```\n{tail}\n```")
    return 0


if __name__ == "__main__":
    sys.exit(main())
