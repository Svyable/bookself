#!/usr/bin/env python3
"""Identify publication-scoped changes between two Git refs."""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Any

SAFE_SLUG = re.compile(r"^[a-z0-9][a-z0-9-]*$")


def run_git(root: Path, *args: str) -> subprocess.CompletedProcess[str]:
    try:
        return subprocess.run(
            ["git", "-C", str(root), *args],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=False,
        )
    except OSError as exc:
        raise RuntimeError(f"git is not available: {exc}") from exc


def classify_paths(paths: list[str]) -> tuple[list[str], list[str]]:
    publications: set[str] = set()
    global_paths: list[str] = []
    for raw in paths:
        path = raw.strip().replace("\\", "/")
        if not path:
            continue
        parts = path.split("/")
        if len(parts) >= 2 and parts[0] == "books":
            slug = parts[1]
            if SAFE_SLUG.fullmatch(slug) and not slug.startswith("_"):
                publications.add(slug)
                continue
        global_paths.append(path)
    return sorted(publications), sorted(dict.fromkeys(global_paths))


def changed_paths(root: Path, base: str, head: str) -> list[str]:
    proc = run_git(
        root,
        "diff",
        "--name-only",
        "--diff-filter=ACMRD",
        f"{base}...{head}",
        "--",
    )
    if proc.returncode:
        detail = proc.stderr.strip() or proc.stdout.strip() or "git diff failed"
        raise RuntimeError(detail)
    return [line.strip() for line in proc.stdout.splitlines() if line.strip()]


def build_result(
    root: Path, base: str, head: str, paths: list[str] | None = None
) -> dict[str, Any]:
    root = root.resolve()
    actual_paths = changed_paths(root, base, head) if paths is None else list(paths)
    publications, global_paths = classify_paths(actual_paths)
    return {
        "schemaVersion": 1,
        "base": base,
        "head": head,
        "publications": [
            {
                "publicationId": slug,
                "slug": slug,
                "path": f"books/{slug}",
                "present": (root / "books" / slug).is_dir(),
            }
            for slug in publications
        ],
        "publicationCount": len(publications),
        "globalPaths": global_paths,
        "globalChange": bool(global_paths),
        "changedPaths": actual_paths,
    }


def print_human(result: dict[str, Any]) -> None:
    print(f"Changed publications: {result['publicationCount']}")
    for item in result["publications"]:
        suffix = "" if item["present"] else " (deleted or absent in working tree)"
        print(f"- {item['publicationId']}{suffix}")
    if result["globalPaths"]:
        print("Non-publication paths also changed:")
        for path in result["globalPaths"]:
            print(f"- {path}")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Report Bookself publication IDs affected by a Git diff."
    )
    parser.add_argument("base", help="Base Git ref/commit.")
    parser.add_argument(
        "head", nargs="?", default="HEAD", help="Head Git ref/commit (default: HEAD)."
    )
    parser.add_argument("--root", default=".", help="Bookself repository root.")
    parser.add_argument("--json", action="store_true", help="Emit JSON.")
    args = parser.parse_args(argv)

    try:
        result = build_result(Path(args.root), args.base, args.head)
    except RuntimeError as exc:
        print(f"changed_publications: {exc}", file=sys.stderr)
        return 2

    if args.json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print_human(result)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
