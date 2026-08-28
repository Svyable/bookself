#!/usr/bin/env python3
"""Read-only health check for a Bookself platform, Desk, or Shelf checkout."""

from __future__ import annotations

import argparse
import json
import re
import subprocess
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable

from reader_presentation import validate_presentation

SAFE_SLUG = re.compile(r"^[a-z0-9][a-z0-9-]*$")
BOOK_LINK = re.compile(r"\]\((?:\.\/)?books\/([a-z0-9][a-z0-9-]*)\/?\)", re.I)
CONTENT_LINK = re.compile(
    r"^- \[[ xX]\] \[([^\]]+)\]\((manuscript\/[^)\s]+)\)",
    re.M,
)
INFO_CELL = r"\|\s*\*\*{label}\*\*\s*\|\s*([^|\n]+)\|"
PUBLICATION_TEMPLATES = (
    "_TEMPLATE",
    "_PAPER_TEMPLATE",
    "_MAGAZINE_TEMPLATE",
    "_NEWSPAPER_TEMPLATE",
    "_JOURNAL_TEMPLATE",
    "_NEWSLETTER_TEMPLATE",
    "_ANTHOLOGY_TEMPLATE",
    "_REPORT_TEMPLATE",
    "_MANUAL_TEMPLATE",
    "_COMIC_TEMPLATE",
)


@dataclass(frozen=True)
class Finding:
    level: str
    code: str
    message: str


def finding(level: str, code: str, message: str) -> Finding:
    return Finding(level=level, code=code, message=message)


def extract_section(markdown: str, heading: str) -> str:
    match = re.search(rf"^##\s+{re.escape(heading)}\s*$", markdown, re.I | re.M)
    if not match:
        return ""
    rest = markdown[match.end():]
    next_heading = re.search(r"^##\s+", rest, re.M)
    return (rest[: next_heading.start()] if next_heading else rest).strip()


def portal_slugs(markdown: str) -> list[str]:
    section = extract_section(markdown, "The books")
    if not section:
        return []
    seen: set[str] = set()
    slugs: list[str] = []
    for slug in BOOK_LINK.findall(section):
        slug = slug.lower()
        if slug == "_template":
            continue
        if slug not in seen:
            seen.add(slug)
            slugs.append(slug)
    return slugs


def info_cell(markdown: str, label: str) -> str:
    match = re.search(INFO_CELL.format(label=re.escape(label)), markdown, re.I)
    return match.group(1).strip() if match else ""


def publication_contents(markdown: str) -> list[tuple[str, str]]:
    return [(title.strip(), path.strip()) for title, path in CONTENT_LINK.findall(markdown)]


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


def iter_publication_dirs(root: Path) -> Iterable[Path]:
    books = root / "books"
    if not books.is_dir():
        return []
    return sorted(
        path
        for path in books.iterdir()
        if path.is_dir() and not path.name.startswith("_") and SAFE_SLUG.fullmatch(path.name)
    )


def read_text(path: Path, out: list[Finding], code: str) -> str | None:
    try:
        return path.read_text(encoding="utf-8")
    except OSError as exc:
        out.append(finding("error", code, f"Could not read {path}: {exc}"))
        return None


def inspect_reader_presentations(root: Path, out: list[Finding]) -> None:
    books = root / "books"
    if not books.is_dir():
        return
    for path in sorted(books.glob("*/reader.json")):
        rel = path.relative_to(root)
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            out.append(
                finding(
                    "error",
                    "invalid_reader_presentation_json",
                    f"{rel}: reader presentation is not readable JSON: {exc}",
                )
            )
            continue
        for item in validate_presentation(data):
            out.append(
                finding(
                    item.level,
                    item.code,
                    f"{rel}: {item.message}",
                )
            )


def inspect_root(root: Path) -> list[Finding]:
    root = root.resolve()
    out: list[Finding] = []

    imprint_path = root / "imprint.json"
    role = ""
    if not imprint_path.is_file():
        out.append(finding("error", "missing_imprint", "imprint.json is missing."))
    else:
        try:
            imprint = json.loads(imprint_path.read_text(encoding="utf-8"))
            role = str(imprint.get("role", "")).strip().lower()
        except (OSError, json.JSONDecodeError) as exc:
            out.append(finding("error", "invalid_imprint", f"imprint.json is not readable JSON: {exc}"))
        else:
            if role not in {"platform", "desk", "shelf"}:
                out.append(
                    finding(
                        "error",
                        "invalid_role",
                        f"imprint.json role must be platform, desk, or shelf; found {role or 'blank'}.",
                    )
                )
            else:
                out.append(finding("ok", "role", f"Repository role: {role}."))

    git_root = git_output(root, "rev-parse", "--show-toplevel")
    if git_root is None:
        out.append(finding("warning", "not_git", "This directory is not a readable Git worktree."))
    else:
        branch = git_output(root, "branch", "--show-current") or "(detached HEAD)"
        out.append(finding("ok", "git", f"Git worktree detected on {branch}."))
        dirty = git_output(root, "status", "--porcelain")
        if dirty:
            count = len([line for line in dirty.splitlines() if line.strip()])
            out.append(
                finding(
                    "warning",
                    "dirty_worktree",
                    f"Working tree has {count} uncommitted path{'s' if count != 1 else ''}.",
                )
            )
        else:
            out.append(finding("ok", "clean_worktree", "Working tree is clean."))

    for label, path in (
        ("Reader", root / "reader" / "index.html"),
        ("Publishing Desk", root / "desk" / "index.html"),
    ):
        code = label.lower().replace(" ", "_")
        if path.is_file():
            out.append(finding("ok", f"{code}_present", f"{label} is present."))
        else:
            out.append(
                finding(
                    "error" if role in {"platform", "desk", "shelf"} else "warning",
                    f"{code}_missing",
                    f"{label} is missing ({path.relative_to(root)}).",
                )
            )

    readme_path = root / "README.md"
    portal = ""
    slugs: list[str] = []
    if not readme_path.is_file():
        out.append(finding("error", "missing_readme", "Root README.md is missing."))
    else:
        loaded = read_text(readme_path, out, "unreadable_readme")
        if loaded is not None:
            portal = loaded
            slugs = portal_slugs(portal)
            if extract_section(portal, "The books"):
                out.append(
                    finding(
                        "ok",
                        "catalog",
                        f"Root catalog contains {len(slugs)} publication entr{'y' if len(slugs) == 1 else 'ies'}.",
                    )
                )
            else:
                out.append(finding("warning", "missing_books_section", "README.md has no '## The books' section."))

    catalog_set = set(slugs)
    for slug in slugs:
        if not SAFE_SLUG.fullmatch(slug):
            out.append(finding("error", "unsafe_slug", f"Catalog slug is not safe: {slug!r}."))
            continue
        hub_path = root / "books" / slug / "README.md"
        if not hub_path.is_file():
            out.append(
                finding(
                    "error",
                    "missing_publication_hub",
                    f"Catalog entry {slug!r} has no books/{slug}/README.md.",
                )
            )
            continue
        hub = read_text(hub_path, out, "unreadable_publication_hub")
        if hub is None:
            continue
        status = info_cell(hub, "Status")
        authors = info_cell(hub, "Authors") or info_cell(hub, "Author")
        if not status:
            out.append(finding("error", "missing_status", f"{slug}: publication Status is missing."))
        if not authors:
            out.append(finding("warning", "missing_authors", f"{slug}: Author/Authors is missing."))
        if role in {"platform", "shelf"} and status != "Published":
            out.append(
                finding(
                    "error",
                    "catalog_not_published",
                    f"{slug}: released catalog entry has Status {status or 'blank'} instead of Published.",
                )
            )
        if role == "desk" and status == "Published":
            out.append(
                finding(
                    "error",
                    "desk_published",
                    f"{slug}: Desk working copy says Published; Published is a Shelf state.",
                )
            )

        contents = publication_contents(hub)
        if not contents:
            out.append(finding("warning", "no_contents", f"{slug}: publication README has no manuscript contents."))
        for title, rel in contents:
            path = root / "books" / slug / rel
            if not path.is_file():
                out.append(
                    finding(
                        "error",
                        "missing_manuscript_file",
                        f"{slug}: {title!r} points to missing {rel}.",
                    )
                )

    if role == "shelf":
        for pub_dir in iter_publication_dirs(root):
            hub_path = pub_dir / "README.md"
            if not hub_path.is_file():
                continue
            hub = read_text(hub_path, out, "unreadable_publication_hub")
            if hub is None:
                continue
            if info_cell(hub, "Status") == "Published" and pub_dir.name not in catalog_set:
                out.append(
                    finding(
                        "error",
                        "published_not_cataloged",
                        f"{pub_dir.name}: Status is Published but the root Shelf catalog does not list it.",
                    )
                )

    if role == "desk":
        for pub_dir in iter_publication_dirs(root):
            if pub_dir.name in catalog_set:
                continue
            hub_path = pub_dir / "README.md"
            if not hub_path.is_file():
                continue
            hub = read_text(hub_path, out, "unreadable_publication_hub")
            if hub is None:
                continue
            if info_cell(hub, "Status") == "Published":
                out.append(
                    finding(
                        "error",
                        "desk_published",
                        f"{pub_dir.name}: Desk working copy says Published; Published is a Shelf state.",
                    )
                )

    if role == "platform":
        for template in PUBLICATION_TEMPLATES:
            if (root / "books" / template / "README.md").is_file():
                out.append(finding("ok", f"{template.lower()}_present", f"books/{template}/ is present."))
            else:
                out.append(finding("error", f"{template.lower()}_missing", f"books/{template}/README.md is missing."))

    if role in {"platform", "desk"}:
        for rel in ("scripts/release-book.py", "scripts/release-book.sh"):
            if (root / rel).is_file():
                out.append(finding("ok", f"{Path(rel).name}_present", f"{rel} is present."))
            else:
                out.append(finding("error", f"{Path(rel).name}_missing", f"{rel} is missing."))

    inspect_reader_presentations(root, out)

    workflows = root / ".github" / "workflows"
    if workflows.is_dir() and any(
        path.is_file() and path.suffix in {".yml", ".yaml"} for path in workflows.iterdir()
    ):
        out.append(
            finding(
                "info",
                "hosted_workflows_present",
                "GitHub Actions workflows are present; Bookself doctor does not rely on them.",
            )
        )
    else:
        out.append(finding("ok", "no_required_workflows", "No GitHub Actions workflow is needed for this health check."))

    return out


def summary(findings: list[Finding]) -> dict[str, int]:
    return {
        level: sum(item.level == level for item in findings)
        for level in ("error", "warning", "info", "ok")
    }


def print_human(root: Path, findings: list[Finding]) -> None:
    marks = {"ok": "✓", "warning": "!", "error": "✗", "info": "·"}
    print(f"Bookself doctor — {root.resolve()}")
    for item in findings:
        print(f"{marks[item.level]} {item.message}")
    counts = summary(findings)
    print(
        f"\nHealth: {counts['error']} error{'s' if counts['error'] != 1 else ''}, "
        f"{counts['warning']} warning{'s' if counts['warning'] != 1 else ''}."
    )


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Read-only health check for a Bookself platform, Desk, or Shelf checkout."
    )
    parser.add_argument(
        "--root",
        default=".",
        help="Repository root to inspect (default: current directory).",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        dest="as_json",
        help="Emit machine-readable JSON.",
    )
    args = parser.parse_args(argv)
    root = Path(args.root)
    findings = inspect_root(root)
    counts = summary(findings)
    if args.as_json:
        print(
            json.dumps(
                {
                    "root": str(root.resolve()),
                    "healthy": counts["error"] == 0,
                    "summary": counts,
                    "findings": [asdict(item) for item in findings],
                },
                indent=2,
            )
        )
    else:
        print_human(root, findings)
    return 1 if counts["error"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
