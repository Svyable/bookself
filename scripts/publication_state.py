#!/usr/bin/env python3
"""Report publication-scoped Bookself state for agents and automation."""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Any

SAFE_SLUG = re.compile(r"^[a-z0-9][a-z0-9-]*$")
INFO_CELL = r"\|\s*\*\*{label}\*\*\s*\|\s*([^|\n]+)\|"
CONTENT_LINK = re.compile(
    r"^- \[[ xX]\] \[([^\]]+)\]\((manuscript\/[^)\s]+)\)",
    re.M,
)


def git_output(root: Path, *args: str) -> str | None:
    try:
        proc = subprocess.run(
            ["git", "-C", str(root), *args],
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            text=True,
            check=False,
        )
    except OSError:
        return None
    if proc.returncode != 0:
        return None
    return proc.stdout.strip()


def info_cell(markdown: str, label: str) -> str:
    match = re.search(INFO_CELL.format(label=re.escape(label)), markdown, re.I)
    return match.group(1).strip() if match else ""


def title_from_markdown(markdown: str, fallback: str) -> str:
    match = re.search(r"^#\s+(.+?)\s*$", markdown, re.M)
    return match.group(1).strip() if match else fallback


def publication_contents(markdown: str) -> list[tuple[str, str]]:
    return [(title.strip(), path.strip()) for title, path in CONTENT_LINK.findall(markdown)]


def read_role(root: Path) -> str:
    try:
        data = json.loads((root / "imprint.json").read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return ""
    return str(data.get("role") or "").strip().lower()


def catalog_slugs(root: Path) -> set[str]:
    path = root / "catalog.json"
    if path.is_file():
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            pass
        else:
            books = data.get("books")
            if isinstance(books, list):
                return {
                    item.strip()
                    for item in books
                    if isinstance(item, str) and SAFE_SLUG.fullmatch(item.strip())
                }

    readme = root / "README.md"
    try:
        text = readme.read_text(encoding="utf-8")
    except OSError:
        return set()
    return set(
        match.group(1).lower()
        for match in re.finditer(
            r"\]\((?:\./)?books/([a-z0-9][a-z0-9-]*)/?\)", text, re.I
        )
    )


def release_record(path: Path) -> dict[str, Any] | None:
    if not path.is_file():
        return None
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        return {"invalid": True, "error": str(exc)}
    if isinstance(data, dict):
        return data
    return {"invalid": True, "error": "release.json must contain an object"}


def publication_state(root: Path, slug: str) -> dict[str, Any]:
    root = root.resolve()
    if not SAFE_SLUG.fullmatch(slug) or slug.startswith("_"):
        raise ValueError("slug must use lowercase letters, numbers, and hyphens only")

    publication = root / "books" / slug
    readme = publication / "README.md"
    errors: list[dict[str, str]] = []
    warnings: list[dict[str, str]] = []

    if not publication.is_dir():
        errors.append(
            {
                "code": "publication_missing",
                "message": f"books/{slug}/ does not exist.",
            }
        )
        markdown = ""
    elif not readme.is_file():
        errors.append(
            {
                "code": "publication_readme_missing",
                "message": f"books/{slug}/README.md is missing.",
            }
        )
        markdown = ""
    else:
        try:
            markdown = readme.read_text(encoding="utf-8")
        except OSError as exc:
            errors.append(
                {"code": "publication_readme_unreadable", "message": str(exc)}
            )
            markdown = ""

    title = title_from_markdown(markdown, slug)
    status = info_cell(markdown, "Status")
    authors = info_cell(markdown, "Authors") or info_cell(markdown, "Author")
    format_label = info_cell(markdown, "Format")
    edition = info_cell(markdown, "Edition")
    language = info_cell(markdown, "Language")

    if markdown and not status:
        errors.append(
            {"code": "status_missing", "message": "Publication Status is missing."}
        )
    if markdown and not authors:
        warnings.append(
            {
                "code": "authors_missing",
                "message": "Publication Author/Authors is missing.",
            }
        )

    contents = publication_contents(markdown)
    missing_contents: list[str] = []
    for _, rel in contents:
        if not (publication / rel).is_file():
            missing_contents.append(rel)
    if markdown and not contents:
        warnings.append(
            {
                "code": "contents_missing",
                "message": "Publication README has no manuscript contents.",
            }
        )
    if missing_contents:
        errors.append(
            {
                "code": "manuscript_files_missing",
                "message": "Missing manuscript files: " + ", ".join(missing_contents),
            }
        )

    research_index = publication / "research" / "README.md"
    if publication.is_dir() and not research_index.is_file():
        warnings.append(
            {
                "code": "research_index_missing",
                "message": "research/README.md is missing; agent handoff provenance may be incomplete.",
            }
        )

    role = read_role(root)
    cataloged = slug in catalog_slugs(root)
    if role == "shelf" and status == "Published" and not cataloged:
        errors.append(
            {
                "code": "published_not_cataloged",
                "message": "Published Shelf publication is not present in the catalog.",
            }
        )
    if role == "desk" and status == "Published":
        errors.append(
            {
                "code": "desk_marked_published",
                "message": "Desk working state must not use Published as its release state.",
            }
        )

    head = git_output(root, "rev-parse", "HEAD")
    dirty_output = git_output(root, "status", "--porcelain", "--", f"books/{slug}")
    git_dirty = None if dirty_output is None else bool(dirty_output)

    release = release_record(publication / "release.json")
    if release and release.get("invalid"):
        warnings.append(
            {
                "code": "release_provenance_invalid",
                "message": str(release.get("error") or "Invalid release.json"),
            }
        )

    return {
        "schemaVersion": 1,
        "publicationId": slug,
        "identityScope": "bookself-instance",
        "slug": slug,
        "path": f"books/{slug}",
        "title": title,
        "authors": authors or None,
        "format": format_label or None,
        "edition": edition or None,
        "language": language or None,
        "publicationStatus": status or None,
        "repositoryRole": role or None,
        "cataloged": cataloged,
        "git": {
            "head": head,
            "publicationDirty": git_dirty,
        },
        "release": release,
        "checks": {
            "errors": errors,
            "warnings": warnings,
            "errorCount": len(errors),
            "warningCount": len(warnings),
            "structurallyReady": not errors,
        },
    }


def print_human(state: dict[str, Any]) -> None:
    print(f"{state['publicationId']} — {state['title']}")
    print(f"Path: {state['path']}")
    print(f"Role: {state['repositoryRole'] or 'unknown'}")
    print(f"Status: {state['publicationStatus'] or 'unknown'}")
    print(f"Cataloged: {'yes' if state['cataloged'] else 'no'}")
    dirty = state["git"]["publicationDirty"]
    print(f"Dirty: {'unknown' if dirty is None else ('yes' if dirty else 'no')}")
    checks = state["checks"]
    print(
        f"Checks: {checks['errorCount']} error(s), "
        f"{checks['warningCount']} warning(s)"
    )
    for item in checks["errors"]:
        print(f"✗ {item['message']}")
    for item in checks["warnings"]:
        print(f"! {item['message']}")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Report machine-readable state for one Bookself publication."
    )
    parser.add_argument("slug", help="Publication ID/slug under books/.")
    parser.add_argument("--root", default=".", help="Bookself repository root.")
    parser.add_argument("--json", action="store_true", help="Emit JSON.")
    args = parser.parse_args(argv)

    try:
        state = publication_state(Path(args.root), args.slug.strip())
    except ValueError as exc:
        print(f"publication_state: {exc}", file=sys.stderr)
        return 2

    if args.json:
        print(json.dumps(state, indent=2, ensure_ascii=False))
    else:
        print_human(state)
    return 1 if state["checks"]["errors"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
