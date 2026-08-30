#!/usr/bin/env python3
"""Pair-level health checks for a Bookself Desk and Shelf."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import doctor


SHARED_DIRS = ("reader", "desk")


def load_imprint(root: Path) -> dict[str, object] | None:
    try:
        data = json.loads((root / "imprint.json").read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None
    return data if isinstance(data, dict) else None


def tree_digest(root: Path, relative: str) -> dict[str, str] | None:
    base = root / relative
    if not base.is_dir():
        return None
    result: dict[str, str] = {}
    for path in sorted(item for item in base.rglob("*") if item.is_file()):
        rel = path.relative_to(base).as_posix()
        try:
            digest = hashlib.sha256(path.read_bytes()).hexdigest()
        except OSError:
            return None
        result[rel] = digest
    return result


def publication_status(path: Path) -> str:
    try:
        markdown = (path / "README.md").read_text(encoding="utf-8")
    except OSError:
        return ""
    return doctor.info_cell(markdown, "Status")


def catalog_slugs(root: Path) -> set[str]:
    try:
        markdown = (root / "README.md").read_text(encoding="utf-8")
    except OSError:
        return set()
    return set(doctor.portal_slugs(markdown))


def pair_findings(desk_root: Path, shelf_root: Path) -> list[doctor.Finding]:
    desk_root = desk_root.resolve()
    shelf_root = shelf_root.resolve()
    out: list[doctor.Finding] = []

    if desk_root == shelf_root:
        out.append(doctor.finding("error", "same_root", "Desk and Shelf resolve to the same directory."))
        return out

    desk_imprint = load_imprint(desk_root)
    shelf_imprint = load_imprint(shelf_root)

    if desk_imprint is not None and str(desk_imprint.get("role", "")).lower() == "desk":
        out.append(doctor.finding("ok", "desk_role", "Desk role is valid."))
    else:
        out.append(doctor.finding("error", "desk_role", "Desk imprint must declare role 'desk'."))

    if shelf_imprint is not None and str(shelf_imprint.get("role", "")).lower() == "shelf":
        out.append(doctor.finding("ok", "shelf_role", "Shelf role is valid."))
    else:
        out.append(doctor.finding("error", "shelf_role", "Shelf imprint must declare role 'shelf'."))

    desk_git = doctor.git_output(desk_root, "rev-parse", "--show-toplevel")
    shelf_git = doctor.git_output(shelf_root, "rev-parse", "--show-toplevel")
    if desk_git is None:
        out.append(doctor.finding("error", "desk_not_git", "Desk is not a readable Git worktree."))
    if shelf_git is None:
        out.append(doctor.finding("error", "shelf_not_git", "Shelf is not a readable Git worktree."))
    if desk_git is not None and shelf_git is not None:
        if Path(desk_git).resolve() == Path(shelf_git).resolve():
            out.append(doctor.finding("error", "shared_git_history", "Desk and Shelf are the same Git worktree; they must have independent histories."))
        else:
            out.append(doctor.finding("ok", "separate_git_histories", "Desk and Shelf use separate Git worktrees."))

    for relative in SHARED_DIRS:
        desk_tree = tree_digest(desk_root, relative)
        shelf_tree = tree_digest(shelf_root, relative)
        if desk_tree is None or shelf_tree is None:
            out.append(doctor.finding("error", "shared_ui_missing", f"Shared UI directory {relative}/ must exist in both Desk and Shelf."))
            continue
        if desk_tree != shelf_tree:
            paths = sorted(set(desk_tree) | set(shelf_tree))
            drift = [path for path in paths if desk_tree.get(path) != shelf_tree.get(path)]
            preview = ", ".join(drift[:5])
            suffix = "" if len(drift) <= 5 else f" (+{len(drift) - 5} more)"
            out.append(doctor.finding("error", "shared_ui_drift", f"Shared UI differs in {relative}/: {preview}{suffix}."))
        else:
            out.append(doctor.finding("ok", f"{relative}_aligned", f"Shared {relative}/ files match byte-for-byte."))

    missing_templates = [
        name
        for name in doctor.PUBLICATION_TEMPLATES
        if not (desk_root / "books" / name / "README.md").is_file()
    ]
    if missing_templates:
        out.append(doctor.finding("error", "desk_templates_missing", "Desk is missing blank publication starters: " + ", ".join(missing_templates) + "."))
    else:
        out.append(doctor.finding("ok", "desk_templates", "Desk contains the complete blank publication starter library."))

    shelf_templates = [
        name
        for name in doctor.PUBLICATION_TEMPLATES
        if (shelf_root / "books" / name).exists()
    ]
    if shelf_templates:
        out.append(doctor.finding("error", "shelf_templates_present", "Shelf contains blank starters that belong only on Desk: " + ", ".join(shelf_templates) + "."))
    else:
        out.append(doctor.finding("ok", "shelf_no_templates", "Shelf contains no blank publication starters."))

    shelf_catalog = catalog_slugs(shelf_root)
    for publication in doctor.iter_publication_dirs(shelf_root):
        status = publication_status(publication)
        if status != "Published":
            out.append(doctor.finding("error", "shelf_unpublished_publication", f"{publication.name}: Shelf contains Status {status or 'blank'}; Shelf publications must be Published releases."))
        if publication.name not in shelf_catalog:
            out.append(doctor.finding("error", "shelf_publication_not_cataloged", f"{publication.name}: Shelf publication exists but is not listed under root '## The books'."))

    if desk_imprint is not None and shelf_imprint is not None:
        desk_github = desk_imprint.get("github") if isinstance(desk_imprint.get("github"), dict) else {}
        shelf_github = shelf_imprint.get("github") if isinstance(shelf_imprint.get("github"), dict) else {}
        desk_repo = str(desk_github.get("repo", "")).strip()
        shelf_repo = str(shelf_github.get("repo", "")).strip()
        if desk_repo and shelf_repo and desk_repo == shelf_repo:
            out.append(doctor.finding("error", "same_repo_identity", f"Desk and Shelf both claim repository name {desk_repo!r}."))
        elif desk_repo and shelf_repo:
            out.append(doctor.finding("ok", "repo_identity", f"Repository identities are distinct: {desk_repo} / {shelf_repo}."))

        owners = {
            str(desk_github.get("owner", "")).strip().lower(),
            str(shelf_github.get("owner", "")).strip().lower(),
        }
        if "auto" in owners or "" in owners:
            out.append(doctor.finding("warning", "owner_unresolved", "GitHub owner is unresolved in at least one imprint; edit imprint.json when repository links should resolve."))

        desk_prefix = str(desk_imprint.get("storagePrefix", "")).strip()
        shelf_prefix = str(shelf_imprint.get("storagePrefix", "")).strip()
        if desk_prefix and shelf_prefix and desk_prefix == shelf_prefix:
            out.append(doctor.finding("error", "shared_storage_prefix", "Desk and Shelf use the same browser storagePrefix; reader state could collide."))
        elif desk_prefix and shelf_prefix:
            out.append(doctor.finding("ok", "storage_prefixes", "Desk and Shelf browser storage prefixes are distinct."))

    return out


def inspect_pair(desk_root: Path, shelf_root: Path) -> dict[str, object]:
    desk_root = desk_root.resolve()
    shelf_root = shelf_root.resolve()
    desk_findings = doctor.inspect_root(desk_root)
    shelf_findings = doctor.inspect_root(shelf_root)
    pair = pair_findings(desk_root, shelf_root)
    desk_summary = doctor.summary(desk_findings)
    shelf_summary = doctor.summary(shelf_findings)
    pair_summary = doctor.summary(pair)
    ready = not (desk_summary["error"] or shelf_summary["error"] or pair_summary["error"])
    return {
        "desk": {
            "root": str(desk_root),
            "healthy": desk_summary["error"] == 0,
            "summary": desk_summary,
        },
        "shelf": {
            "root": str(shelf_root),
            "healthy": shelf_summary["error"] == 0,
            "summary": shelf_summary,
        },
        "pair": {
            "healthy": pair_summary["error"] == 0,
            "summary": pair_summary,
            "findings": [doctor.asdict(item) for item in pair],
        },
        "setupReady": ready,
    }


def print_human(result: dict[str, object]) -> None:
    desk = result["desk"]
    shelf = result["shelf"]
    pair = result["pair"]
    print("Bookself pair doctor")
    print(f"Desk:  {desk['root']}")
    print(f"Shelf: {shelf['root']}")
    print(f"Desk health:  {desk['summary']['error']} errors, {desk['summary']['warning']} warnings")
    print(f"Shelf health: {shelf['summary']['error']} errors, {shelf['summary']['warning']} warnings")
    marks = {"ok": "✓", "warning": "!", "error": "✗", "info": "·"}
    for item in pair["findings"]:
        print(f"{marks[item['level']]} {item['message']}")
    print("\nSetup: READY" if result["setupReady"] else "\nSetup: NOT READY")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate a Bookself Desk + Shelf pair as one installation.")
    parser.add_argument("desk", help="path to the private Desk repository")
    parser.add_argument("shelf", help="path to the public Shelf repository")
    parser.add_argument("--json", action="store_true", dest="as_json", help="emit machine-readable JSON")
    args = parser.parse_args(argv)
    result = inspect_pair(Path(args.desk), Path(args.shelf))
    if args.as_json:
        print(json.dumps(result, indent=2))
    else:
        print_human(result)
    return 0 if result["setupReady"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
