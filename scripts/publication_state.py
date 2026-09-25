#!/usr/bin/env python3
"""Report repository- or publication-scoped Bookself state for agents and automation."""

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


def publication_ids(root: Path) -> list[str]:
    books = root / "books"
    if not books.is_dir():
        return []
    return sorted(
        child.name
        for child in books.iterdir()
        if child.is_dir()
        and not child.name.startswith("_")
        and SAFE_SLUG.fullmatch(child.name)
    )


def repository_state(root: Path) -> dict[str, Any]:
    """Return cheap repository orientation without opening every publication."""
    root = root.resolve()
    errors: list[dict[str, str]] = []
    warnings: list[dict[str, str]] = []

    books = root / "books"
    if not books.is_dir():
        errors.append(
            {
                "code": "books_root_missing",
                "message": "books/ does not exist; this does not look like a complete Bookself repository.",
            }
        )

    present = publication_ids(root)
    present_set = set(present)
    production_ids = [
        slug for slug in present
        if (root / "books" / slug / "production" / "manifest.json").is_file()
    ]
    cataloged = sorted(catalog_slugs(root))
    cataloged_set = set(cataloged)
    uncataloged = sorted(present_set - cataloged_set)
    missing = sorted(cataloged_set - present_set)

    if missing:
        errors.append(
            {
                "code": "catalog_publications_missing",
                "message": "Catalog entries have no matching publication directory: "
                + ", ".join(missing),
            }
        )
    head = git_output(root, "rev-parse", "HEAD")
    dirty_output = git_output(root, "status", "--porcelain")
    dirty = None if dirty_output is None else bool(dirty_output)
    role = read_role(root)

    next_actions: list[str] = []
    if errors:
        next_actions.append("Repair the reported repository inventory errors before publication work.")
    if not present:
        next_actions.append("Create or locate the publication required by the user's outcome.")
    elif len(present) == 1:
        next_actions.append(
            f"Inspect the publication with: python3 scripts/publication_state.py {present[0]} --root . --json"
        )
    else:
        next_actions.append(
            "Choose only the publication IDs relevant to the requested outcome, then inspect each with publication_state.py <slug> --root . --json."
        )
    next_actions.append(
        "Before mutation, read AGENTS.md plus the applicable publication rights/research files and the bounded skill for the work."
    )

    return {
        "schemaVersion": 1,
        "scope": "repository",
        "repositoryRole": role or None,
        "git": {
            "head": head,
            "dirty": dirty,
        },
        "publications": {
            "count": len(present),
            "ids": present,
            "productionIds": production_ids,
            "catalogedIds": cataloged,
            "uncatalogedIds": uncataloged,
            "missingCatalogIds": missing,
        },
        "checks": {
            "errors": errors,
            "warnings": warnings,
            "errorCount": len(errors),
            "warningCount": len(warnings),
            "structurallyReady": not errors,
        },
        "nextActions": next_actions,
    }


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


def production_state(root: Path, slug: str) -> tuple[dict[str, Any] | None, list[dict[str, str]]]:
    """Return bounded production evidence for one opt-in publication."""

    manifest = root / "books" / slug / "production" / "manifest.json"
    if not manifest.is_file():
        return None, []
    try:
        from production_check import inspect_publication
    except ImportError as exc:
        return {"status": "unavailable", "error": str(exc)}, [{
            "code": "production_checker_unavailable",
            "message": "Production manifest exists, but production_check.py could not be imported.",
        }]
    try:
        result = inspect_publication(root, slug)
    except Exception as exc:
        return {"status": "error", "error": str(exc)}, [{
            "level": "error",
            "code": "production_check_failed",
            "message": f"Production checker failed safely: {exc}",
        }]
    bounded = {
        "status": result.get("productionStatus"),
        "healthy": result.get("healthy"),
        "metrics": result.get("metrics", {}),
        "findings": result.get("findings", []),
    }
    messages: list[dict[str, str]] = []
    for item in result.get("findings", []):
        if item.get("level") in {"error", "warning"}:
            messages.append({
                "level": item.get("level", "warning"),
                "code": f"production_{item.get('code', 'finding')}",
                "message": item.get("message", "Production contract finding."),
            })
    return bounded, messages


def release_state(root: Path, slug: str) -> tuple[dict[str, Any] | None, list[dict[str, str]]]:
    manifest = root / "books" / slug / "release.json"
    if not manifest.is_file():
        return None, []
    try:
        from release_check import inspect_release
    except ImportError as exc:
        return {"status": "unavailable", "error": str(exc)}, [{
            "level": "warning",
            "code": "release_checker_unavailable",
            "message": "release.json exists, but release_check.py could not be imported.",
        }]
    try:
        result = inspect_release(root, slug)
    except Exception as exc:
        return {"status": "error", "error": str(exc)}, [{
            "level": "error",
            "code": "release_check_failed",
            "message": f"Release checker failed safely: {exc}",
        }]
    bounded = {
        "status": "valid" if result.get("healthy") else "invalid",
        "healthy": result.get("healthy"),
        "metrics": result.get("metrics", {}),
        "findings": result.get("findings", []),
    }
    messages = [
        {
            "level": item.get("level", "warning"),
            "code": f"release_{item.get('code', 'finding')}",
            "message": item.get("message", "Release provenance finding."),
        }
        for item in result.get("findings", [])
        if item.get("level") in {"error", "warning"}
    ]
    return bounded, messages


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
    production, production_messages = production_state(root, slug)
    for message in production_messages:
        target = errors if message.get("level") == "error" else warnings
        target.append({key: value for key, value in message.items() if key != "level"})
    release_provenance, release_messages = release_state(root, slug)
    for message in release_messages:
        target = errors if message.get("level") == "error" else warnings
        target.append({key: value for key, value in message.items() if key != "level"})
    if role == "shelf" and status == "Published" and release_provenance is None:
        errors.append({
            "code": "missing_release_provenance",
            "message": "Published Shelf publication is missing release.json.",
        })

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
        "releaseVerification": release_provenance,
        "production": production,
        "checks": {
            "errors": errors,
            "warnings": warnings,
            "errorCount": len(errors),
            "warningCount": len(warnings),
            "structurallyReady": not errors,
        },
    }


def print_repository_human(state: dict[str, Any]) -> None:
    print("Bookself repository")
    print(f"Role: {state['repositoryRole'] or 'unknown'}")
    dirty = state["git"]["dirty"]
    print(f"Dirty: {'unknown' if dirty is None else ('yes' if dirty else 'no')}")
    pubs = state["publications"]
    print(f"Publications: {pubs['count']}")
    if pubs["ids"]:
        print("IDs: " + ", ".join(pubs["ids"]))
    if pubs.get("productionIds"):
        print("Production contracts: " + ", ".join(pubs["productionIds"]))
    checks = state["checks"]
    print(
        f"Checks: {checks['errorCount']} error(s), "
        f"{checks['warningCount']} warning(s)"
    )
    for item in checks["errors"]:
        print(f"✗ {item['message']}")
    for item in checks["warnings"]:
        print(f"! {item['message']}")
    for action in state["nextActions"]:
        print(f"→ {action}")


def print_human(state: dict[str, Any]) -> None:
    print(f"{state['publicationId']} — {state['title']}")
    print(f"Path: {state['path']}")
    print(f"Role: {state['repositoryRole'] or 'unknown'}")
    print(f"Status: {state['publicationStatus'] or 'unknown'}")
    print(f"Cataloged: {'yes' if state['cataloged'] else 'no'}")
    production = state.get("production")
    if production:
        print(f"Production: {production.get('status') or 'unknown'}")
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
        description="Report machine-readable state for a Bookself repository or one publication."
    )
    parser.add_argument(
        "slug",
        nargs="?",
        help="Optional publication ID/slug under books/. Omit for repository orientation.",
    )
    parser.add_argument("--root", default=".", help="Bookself repository root.")
    parser.add_argument("--json", action="store_true", help="Emit JSON.")
    args = parser.parse_args(argv)

    try:
        state = (
            publication_state(Path(args.root), args.slug.strip())
            if args.slug
            else repository_state(Path(args.root))
        )
    except ValueError as exc:
        print(f"publication_state: {exc}", file=sys.stderr)
        return 2

    if args.json:
        print(json.dumps(state, indent=2, ensure_ascii=False))
    elif state.get("scope") == "repository":
        print_repository_human(state)
    else:
        print_human(state)
    return 1 if state["checks"]["errors"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
