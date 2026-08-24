#!/usr/bin/env python3
"""Stamp a Bookself checkout as a Binder or Shelf instance."""

from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Copy the Bookself platform into a new Binder or Shelf instance and stamp its identity."
    )
    parser.add_argument("destination", help="directory to create or update")
    parser.add_argument("role", choices=("binder", "shelf"), help="instance role")
    parser.add_argument("owner", help="GitHub owner or organization")
    parser.add_argument("repository", help="GitHub repository name")
    args = parser.parse_args()

    root = Path(__file__).resolve().parent.parent
    destination = Path(args.destination).expanduser().resolve()
    destination.mkdir(parents=True, exist_ok=True)

    for directory in ("reader", "desk"):
        source = root / directory
        target = destination / directory
        if target.exists():
            shutil.rmtree(target)
        shutil.copytree(source, target, ignore=shutil.ignore_patterns(".DS_Store"))

    for directory in ("books",):
        source = root / directory
        target = destination / directory
        if not target.exists():
            shutil.copytree(source, target, ignore=shutil.ignore_patterns(".DS_Store"))

    for filename in ("AGENTS.md", ".nojekyll"):
        source = root / filename
        target = destination / filename
        if source.exists() and not target.exists():
            shutil.copy2(source, target)

    imprint_source = root / "imprint.json"
    imprint = json.loads(imprint_source.read_text(encoding="utf-8"))
    imprint["role"] = args.role
    imprint["repository"] = f"{args.owner}/{args.repository}"
    imprint["repositoryUrl"] = f"https://github.com/{args.owner}/{args.repository}"
    (destination / "imprint.json").write_text(
        json.dumps(imprint, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    print(f"Stamped {destination} as Bookself {args.role}: {args.owner}/{args.repository}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
