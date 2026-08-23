#!/usr/bin/env python3
from __future__ import annotations

import re
import sys
from pathlib import Path


def fail(message: str):
    raise SystemExit(message)


def cell(markdown: str, label: str) -> str:
    pattern = re.compile(rf"\|\s*\*\*{re.escape(label)}\*\*\s*\|\s*([^|\n]+)\|", re.I)
    match = pattern.search(markdown)
    return match.group(1).strip() if match else ""


def set_status_published(markdown: str) -> str:
    pattern = re.compile(r"(\|\s*\*\*Status\*\*\s*\|\s*)([^|\n]+)(\|)", re.I)
    if not pattern.search(markdown):
        fail("book README has no **Status** row; add one before releasing")
    return pattern.sub(r"\1Published \3", markdown, count=1)


def book_title(markdown: str, slug: str) -> str:
    match = re.search(r"^#\s+(.+?)\s*$", markdown, re.M)
    return match.group(1).strip() if match else slug


def section_bounds(markdown: str, heading: str):
    pattern = re.compile(rf"^##\s+{re.escape(heading)}\s*$", re.I | re.M)
    match = pattern.search(markdown)
    if not match:
        fail(f"root README has no `## {heading}` section")
    start = match.end()
    next_heading = re.search(r"^##\s+", markdown[start:], re.M)
    end = start + next_heading.start() if next_heading else len(markdown)
    return start, end


def table_cells(line: str):
    stripped = line.strip()
    if not (stripped.startswith("|") and stripped.endswith("|")):
        return []
    return [part.strip() for part in stripped[1:-1].split("|")]


def ensure_catalog_row(root_markdown: str, slug: str, title: str, authors: str, format_label: str) -> str:
    start, end = section_bounds(root_markdown, "The books")
    section = root_markdown[start:end]
    if re.search(rf"\]\((?:\./)?books/{re.escape(slug)}/?\)", section, re.I):
        return root_markdown

    lines = section.splitlines(keepends=True)
    header_idx = divider_idx = None
    for index, line in enumerate(lines):
        if table_cells(line) and index + 1 < len(lines):
            divider = table_cells(lines[index + 1])
            if divider and all(re.fullmatch(r":?-{3,}:?", item.replace(" ", "")) for item in divider):
                header_idx = index
                divider_idx = index + 1
                break
    if header_idx is None:
        fail("`## The books` needs a Markdown table before release-book can catalog automatically")

    headers = table_cells(lines[header_idx])
    row = []
    for index, header in enumerate(headers):
        key = header.lower()
        if index == 0:
            row.append(f"[{title}](books/{slug}/)")
        elif "author" in key:
            row.append(authors)
        elif "format" in key or "type" in key:
            row.append(format_label or "Book")
        elif "status" in key:
            row.append("Published")
        else:
            row.append("")

    insert_idx = divider_idx + 1
    while insert_idx < len(lines) and table_cells(lines[insert_idx]):
        insert_idx += 1
    lines.insert(insert_idx, "| " + " | ".join(row) + " |\n")
    return root_markdown[:start] + "".join(lines) + root_markdown[end:]


def main(argv):
    if len(argv) != 3 or argv[1] in {"-h", "--help"}:
        print("usage: release-book.py <slug> <path-to-shelf>", file=sys.stderr)
        return 2

    slug = argv[1].strip()
    shelf = Path(argv[2]).expanduser().resolve()
    book_readme = shelf / "books" / slug / "README.md"
    root_readme = shelf / "README.md"

    if not book_readme.is_file():
        fail(f"book README not found: {book_readme}")
    if not root_readme.is_file():
        fail(f"shelf README not found: {root_readme}")

    book_md = book_readme.read_text(encoding="utf-8")
    root_md = root_readme.read_text(encoding="utf-8")
    title = book_title(book_md, slug)
    authors = cell(book_md, "Authors") or cell(book_md, "Author")
    format_label = cell(book_md, "Format") or "Book"

    next_book = set_status_published(book_md)
    next_root = ensure_catalog_row(root_md, slug, title, authors, format_label)

    book_readme.write_text(next_book, encoding="utf-8")
    root_readme.write_text(next_root, encoding="utf-8")

    print(f"Prepared release: {title}")
    print("  Status: Published")
    print(f"  Catalog: {'already present' if next_root == root_md else 'row added'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
