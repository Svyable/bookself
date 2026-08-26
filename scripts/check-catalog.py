#!/usr/bin/env python3
"""Check that visible Bookself publications match the root catalog."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

SAFE_SLUG = re.compile(r"^[a-z0-9][a-z0-9-]*$")
BOOK_LINK = re.compile(r"\]\((?:\./)?books/([a-z0-9][a-z0-9-]*)/?\)", re.I)
INFO_CELL = r"\|\s*\*\*{label}\*\*\s*\|\s*([^|\n]+)\|"


def extract_section(markdown: str, heading: str) -> str:
    match = re.search(rf"^##\s+{re.escape(heading)}\s*$", markdown, re.I | re.M)
    if not match:
        return ""
    rest = markdown[match.end():]
    next_heading = re.search(r"^##\s+", rest, re.M)
    return (rest[: next_heading.start()] if next_heading else rest).strip()


def portal_slugs(markdown: str) -> set[str]:
    section = extract_section(markdown, "The books")
    return {slug.lower() for slug in BOOK_LINK.findall(section)}


def info_cell(markdown: str, label: str) -> str:
    match = re.search(INFO_CELL.format(label=re.escape(label)), markdown, re.I)
    return match.group(1).strip() if match else ""


def publication_statuses(root: Path) -> dict[str, str]:
    result: dict[str, str] = {}
    books = root / "books"
    if not books.is_dir():
        return result
    for path in sorted(books.iterdir()):
        if not path.is_dir() or path.name.startswith("_") or not SAFE_SLUG.fullmatch(path.name):
            continue
        hub = path / "README.md"
        if not hub.is_file():
            continue
        result[path.name] = info_cell(hub.read_text(encoding="utf-8"), "Status")
    return result


def check(root: Path) -> list[str]:
    root = root.resolve()
    imprint = json.loads((root / "imprint.json").read_text(encoding="utf-8"))
    role = str(imprint.get("role", "")).strip().lower()
    catalog = portal_slugs((root / "README.md").read_text(encoding="utf-8"))
    statuses = publication_statuses(root)
    errors: list[str] = []

    for slug in sorted(catalog):
        if slug not in statuses:
            errors.append(f"{slug}: catalog entry has no readable books/{slug}/README.md")
            continue
        if role == "shelf" and statuses[slug] != "Published":
            errors.append(f"{slug}: Shelf catalog entry is {statuses[slug] or 'blank'}, not Published")

    if role in {"platform", "shelf"}:
        for slug, status in sorted(statuses.items()):
            if status == "Published" and slug not in catalog:
                errors.append(f"{slug}: Published publication is missing from root ## The books catalog")

    return errors


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Check Bookself publication/catalog consistency.")
    parser.add_argument("--root", default=".", help="Repository root (default: current directory).")
    args = parser.parse_args(argv)
    root = Path(args.root)
    try:
        errors = check(root)
    except (OSError, json.JSONDecodeError) as exc:
        print(f"catalog check failed: {exc}")
        return 1
    if errors:
        for error in errors:
            print(f"✗ {error}")
        return 1
    print("✓ Publication catalog is consistent.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())