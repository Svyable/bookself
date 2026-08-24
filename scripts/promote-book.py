#!/usr/bin/env python3
"""Copy one Binder publication into a Shelf checkout without publishing it."""

from __future__ import annotations

import argparse
import re
import shutil
from pathlib import Path

SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Copy a Binder publication into a Shelf checkout."
    )
    parser.add_argument("slug", help="book slug, for example leveraging-luck")
    parser.add_argument("shelf", nargs="?", help="Shelf checkout; defaults to ../shelf")
    args = parser.parse_args()

    if args.slug == "_TEMPLATE" or not SLUG_RE.fullmatch(args.slug):
        parser.error("slug must use lowercase letters, numbers, and hyphens")

    root = Path(__file__).resolve().parent.parent
    source = root / "books" / args.slug
    shelf = Path(args.shelf).expanduser().resolve() if args.shelf else root.parent / "shelf"

    if not source.is_dir():
        parser.error(f"book not found: {source}")
    if not shelf.is_dir():
        parser.error(f"shelf not found: {shelf}")

    destination = shelf / "books" / args.slug
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists():
        shutil.rmtree(destination)
    shutil.copytree(source, destination, ignore=shutil.ignore_patterns(".DS_Store"))

    print(f"Copied {args.slug} -> {destination}")
    print("This is only a file copy; it does not publish or link Binder to Shelf.")
    print("For normal releases, use scripts/release-book.py instead.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
