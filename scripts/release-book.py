#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import uuid
from hashlib import sha256
from pathlib import Path

SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")


class ReleaseError(RuntimeError):
    pass


def fail(message: str) -> None:
    raise ReleaseError(message)


def run_git(root: Path, *args: str) -> str:
    proc = subprocess.run(
        ["git", "-C", str(root), *args],
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if proc.returncode:
        detail = proc.stderr.strip() or proc.stdout.strip() or "git command failed"
        fail(f"{root}: {detail}")
    return proc.stdout.strip()


def require_git_worktree(root: Path, label: str) -> None:
    if not root.is_dir():
        fail(f"{label} not found: {root}")
    if run_git(root, "rev-parse", "--is-inside-work-tree") != "true":
        fail(f"{label} is not a Git working tree: {root}")


def read_role(root: Path) -> str:
    path = root / "imprint.json"
    if not path.is_file():
        fail(f"missing imprint.json: {path}")
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"could not read {path}: {exc}")
    return str(data.get("role") or "").strip().lower()


def require_clean_paths(root: Path, label: str, paths: list[str]) -> None:
    status = run_git(root, "status", "--porcelain", "--", *paths)
    if status:
        shown = "\n".join(f"  {line}" for line in status.splitlines())
        fail(
            f"{label} has uncommitted changes in release paths:\n"
            f"{shown}\nCommit or restore them before releasing."
        )


def cell(markdown: str, label: str) -> str:
    pattern = re.compile(rf"\|\s*\*\*{re.escape(label)}\*\*\s*\|\s*([^|\n]+)\|", re.I)
    match = pattern.search(markdown)
    return match.group(1).strip() if match else ""


def set_status_published(markdown: str) -> str:
    pattern = re.compile(r"(\|\s*\*\*Status\*\*\s*\|\s*)([^|\n]+)(\|)", re.I)
    match = pattern.search(markdown)
    if not match:
        fail("book README has no **Status** row; add one before releasing")
    return (
        markdown[: match.start()]
        + f"{match.group(1)}Published {match.group(3)}"
        + markdown[match.end() :]
    )


def book_title(markdown: str, slug: str) -> str:
    match = re.search(r"^#\s+(.+?)\s*$", markdown, re.M)
    return match.group(1).strip() if match else slug


def section_bounds(markdown: str, heading: str) -> tuple[int, int]:
    pattern = re.compile(rf"^##\s+{re.escape(heading)}\s*$", re.I | re.M)
    match = pattern.search(markdown)
    if not match:
        fail(f"root README has no `## {heading}` section")
    start = match.end()
    next_heading = re.search(r"^##\s+", markdown[start:], re.M)
    end = start + next_heading.start() if next_heading else len(markdown)
    return start, end


def table_cells(line: str) -> list[str]:
    stripped = line.strip()
    if not (stripped.startswith("|") and stripped.endswith("|")):
        return []
    return [part.strip() for part in stripped[1:-1].split("|")]


def is_divider(cells: list[str]) -> bool:
    return bool(cells) and all(
        re.fullmatch(r":?-{3,}:?", item.replace(" ", "")) for item in cells
    )


def catalog_row(
    headers: list[str],
    existing: list[str] | None,
    slug: str,
    title: str,
    authors: str,
    format_label: str,
) -> list[str]:
    row = list(existing or [""] * len(headers))
    if len(row) < len(headers):
        row.extend([""] * (len(headers) - len(row)))
    row = row[: len(headers)]
    for index, header in enumerate(headers):
        key = header.lower()
        if index == 0:
            row[index] = f"[{title}](books/{slug}/)"
        elif "author" in key:
            row[index] = authors
        elif "format" in key or "type" in key:
            row[index] = format_label or "Book"
        elif "status" in key:
            row[index] = "Published"
    return row


def upsert_catalog_row(
    root_markdown: str,
    slug: str,
    title: str,
    authors: str,
    format_label: str,
) -> tuple[str, str]:
    start, end = section_bounds(root_markdown, "The books")
    section = root_markdown[start:end]
    lines = section.splitlines(keepends=True)

    header_idx = divider_idx = None
    headers: list[str] = []
    for index, line in enumerate(lines[:-1]):
        candidate = table_cells(line)
        divider = table_cells(lines[index + 1])
        if candidate and is_divider(divider) and len(candidate) == len(divider):
            header_idx, divider_idx, headers = index, index + 1, candidate
            break
    if header_idx is None or divider_idx is None:
        fail(
            "`## The books` needs a Markdown table before release-book "
            "can catalog automatically"
        )

    link_re = re.compile(rf"\]\((?:\./)?books/{re.escape(slug)}/?\)", re.I)
    found_idx = None
    for index in range(divider_idx + 1, len(lines)):
        cells = table_cells(lines[index])
        if not cells:
            break
        if link_re.search(lines[index]):
            found_idx = index
            break

    if found_idx is None:
        row = catalog_row(headers, None, slug, title, authors, format_label)
        insert_idx = divider_idx + 1
        while insert_idx < len(lines) and table_cells(lines[insert_idx]):
            insert_idx += 1
        lines.insert(insert_idx, "| " + " | ".join(row) + " |\n")
        action = "added"
    else:
        existing = table_cells(lines[found_idx])
        row = catalog_row(headers, existing, slug, title, authors, format_label)
        replacement = "| " + " | ".join(row) + " |\n"
        if lines[found_idx] == replacement:
            action = "unchanged"
        else:
            lines[found_idx] = replacement
            action = "updated"

    return root_markdown[:start] + "".join(lines) + root_markdown[end:], action


def file_manifest(root: Path, *, exclude_readme: bool = False) -> dict[str, str]:
    manifest: dict[str, str] = {}
    if not root.exists():
        return manifest
    for path in sorted(p for p in root.rglob("*") if p.is_file()):
        rel = path.relative_to(root).as_posix()
        if rel == ".DS_Store":
            continue
        if exclude_readme and rel == "README.md":
            continue
        manifest[rel] = sha256(path.read_bytes()).hexdigest()
    return manifest


def atomic_write(path: Path, text: str) -> None:
    fd, temp_name = tempfile.mkstemp(prefix=f".{path.name}.", dir=path.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8", newline="") as handle:
            handle.write(text)
        os.replace(temp_name, path)
    except Exception:
        try:
            os.unlink(temp_name)
        except FileNotFoundError:
            pass
        raise


def prepare_release(desk: Path, shelf: Path, slug: str) -> dict[str, str]:
    if not SLUG_RE.fullmatch(slug) or slug == "_TEMPLATE":
        fail("slug must use lowercase letters, numbers, and hyphens only")

    desk = desk.resolve()
    shelf = shelf.resolve()
    require_git_worktree(desk, "Desk")
    require_git_worktree(shelf, "Shelf")

    if read_role(desk) != "desk":
        fail(f"source is not a Desk instance: {desk}")
    if read_role(shelf) != "shelf":
        fail(f"destination is not a Shelf instance: {shelf}")

    source_book = desk / "books" / slug
    source_readme = source_book / "README.md"
    shelf_books = shelf / "books"
    shelf_book = shelf_books / slug
    shelf_root = shelf / "README.md"
    if not source_readme.is_file():
        fail(f"book README not found: {source_readme}")
    if not shelf_root.is_file():
        fail(f"Shelf README not found: {shelf_root}")

    require_clean_paths(desk, "Desk", [f"books/{slug}"])
    require_clean_paths(shelf, "Shelf", ["README.md", f"books/{slug}"])

    leftovers = sorted(shelf_books.glob(f".{slug}.bookself-*")) if shelf_books.exists() else []
    if leftovers:
        names = ", ".join(path.name for path in leftovers)
        fail(
            "Shelf contains leftover Bookself release transaction paths: "
            f"{names}. Inspect and remove them before retrying."
        )

    book_md = source_readme.read_text(encoding="utf-8")
    source_status = cell(book_md, "Status")
    if not source_status:
        fail("book README has no readable Status value")
    if source_status.lower() == "published":
        fail(
            "Desk copy is already marked Published; keep Desk as the working "
            "edition and release a non-published status"
        )

    title = book_title(book_md, slug)
    authors = cell(book_md, "Authors") or cell(book_md, "Author")
    if not authors:
        fail("book README has no Author or Authors value")
    format_label = cell(book_md, "Format") or "Book"

    root_md = shelf_root.read_text(encoding="utf-8")
    next_root, catalog_action = upsert_catalog_row(
        root_md, slug, title, authors, format_label
    )
    next_book_md = set_status_published(book_md)

    source_manifest = file_manifest(source_book, exclude_readme=True)
    source_commit = run_git(desk, "rev-parse", "HEAD")
    shelf_branch = run_git(shelf, "branch", "--show-current") or "(detached HEAD)"

    shelf_books.mkdir(parents=True, exist_ok=True)
    token = uuid.uuid4().hex[:10]
    stage_book = shelf_books / f".{slug}.bookself-stage-{token}"
    backup_book = shelf_books / f".{slug}.bookself-backup-{token}"

    try:
        shutil.copytree(
            source_book, stage_book, ignore=shutil.ignore_patterns(".DS_Store")
        )
        (stage_book / "README.md").write_text(next_book_md, encoding="utf-8")
        if file_manifest(stage_book, exclude_readme=True) != source_manifest:
            fail("staged publication does not byte-match the committed Desk content")
        if (stage_book / "README.md").read_text(encoding="utf-8") != next_book_md:
            fail("staged publication README does not match the expected published form")
    except Exception:
        shutil.rmtree(stage_book, ignore_errors=True)
        raise

    original_root = root_md
    moved_old = False
    installed_new = False
    try:
        if shelf_book.exists():
            os.replace(shelf_book, backup_book)
            moved_old = True
        os.replace(stage_book, shelf_book)
        installed_new = True
        atomic_write(shelf_root, next_root)

        if file_manifest(shelf_book, exclude_readme=True) != source_manifest:
            fail("post-copy verification failed: Shelf content differs from Desk content")
        shelf_book_md = (shelf_book / "README.md").read_text(encoding="utf-8")
        if shelf_book_md != next_book_md:
            fail("post-copy verification failed: Shelf book README differs from the prepared release")
        if shelf_root.read_text(encoding="utf-8") != next_root:
            fail("post-copy verification failed: Shelf catalog differs from the prepared release")
    except Exception:
        try:
            if installed_new and shelf_book.exists():
                shutil.rmtree(shelf_book)
            if moved_old and backup_book.exists():
                os.replace(backup_book, shelf_book)
            atomic_write(shelf_root, original_root)
        finally:
            shutil.rmtree(stage_book, ignore_errors=True)
        raise
    else:
        shutil.rmtree(backup_book, ignore_errors=True)
        shutil.rmtree(stage_book, ignore_errors=True)

    return {
        "title": title,
        "source_commit": source_commit,
        "shelf_branch": shelf_branch,
        "catalog_action": catalog_action,
    }


def main(argv: list[str]) -> int:
    if len(argv) not in {2, 3} or argv[1] in {"-h", "--help"}:
        print("usage: release-book.py <slug> [path-to-shelf]", file=sys.stderr)
        return 2

    desk = Path(__file__).resolve().parent.parent
    slug = argv[1].strip()
    shelf = (
        Path(argv[2]).expanduser()
        if len(argv) == 3
        else desk.parent / "shelf"
    )

    try:
        result = prepare_release(desk, shelf, slug)
    except ReleaseError as exc:
        print(f"release-book: {exc}", file=sys.stderr)
        return 1

    print(f"Prepared release: {result['title']}")
    print(f"Desk snapshot: {result['source_commit']}")
    print(f"Shelf branch: {result['shelf_branch']}")
    print(f"Catalog: {result['catalog_action']}")
    print(
        "Verified: Shelf content matches the committed Desk snapshot, with "
        "only the prepared Published README/catalog transformation."
    )
    print("Nothing was committed or pushed.")
    print()
    print("Review:")
    print(f'  git -C "{shelf.resolve()}" diff -- README.md books/{slug}')
    print()
    print(
        "When it looks right, commit the release on a branch/PR or push it "
        "according to your normal workflow."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
