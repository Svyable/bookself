#!/usr/bin/env python3
"""Copy Bookself into an empty destination and stamp Binder/Shelf identity."""

from __future__ import annotations

import argparse
import json
import re
import shutil
from pathlib import Path


def storage_prefix(role: str, repo: str) -> str:
    value = f"{role}-{repo}".lower().replace("_", " ")
    value = value.replace(" ", "-")
    return re.sub(r"[^a-z0-9-]", "", value)


def is_publication_template(name: str) -> bool:
    return name == "_TEMPLATE" or (name.startswith("_") and name.endswith("_TEMPLATE"))


def copy_platform(root: Path, destination: Path, role: str) -> None:
    def ignore(directory: str, names: list[str]) -> set[str]:
        current = Path(directory).resolve()
        rel = current.relative_to(root)
        skipped = {".DS_Store"}
        if rel == Path("."):
            skipped.update({".git", "imprint.json", "README.md"})
        elif rel == Path(".github"):
            skipped.add("workflows")
        elif rel == Path("books"):
            allowed = {name for name in names if is_publication_template(name)} if role == "binder" else set()
            skipped.update(name for name in names if name not in allowed)
        elif rel == Path("docs"):
            skipped.update({"superpowers", "instances"})
        return skipped.intersection(names)

    shutil.copytree(root, destination, dirs_exist_ok=True, ignore=ignore)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Copy this Bookself tree into an empty destination and stamp instance identity."
    )
    parser.add_argument("destination", help="empty directory to create or populate")
    parser.add_argument("role", choices=("binder", "shelf"))
    parser.add_argument("owner", nargs="?", default="auto", help="GitHub owner; defaults to auto")
    parser.add_argument("repository", nargs="?", help="repository name; defaults to destination name")
    args = parser.parse_args()

    root = Path(__file__).resolve().parent.parent
    destination = Path(args.destination).expanduser().resolve()

    if destination == root or root in destination.parents:
        parser.error("destination must be outside the Bookself platform checkout")
    if destination.exists() and any(destination.iterdir()):
        parser.error(f"destination is not empty: {destination}")

    repository = args.repository or destination.name
    destination.mkdir(parents=True, exist_ok=True)
    copy_platform(root, destination, args.role)

    shutil.copy2(root / "docs" / "instances" / f"{args.role}-README.md", destination / "README.md")

    if args.role == "binder":
        values = {
            "name": "Private Binder",
            "shortName": "Binder",
            "description": "Private Bookself workspace for drafts and manuscripts.",
            "kicker": "Private manuscripts · Git-native writing",
            "lede": "Draft and revise here. The same reader and publishing desk are shared with your public shelf.",
            "homeLabel": "Binder",
        }
    else:
        values = {
            "name": "Public Shelf",
            "shortName": "Shelf",
            "description": "Public Bookself shelf for published Markdown books.",
            "kicker": "Published on Git · Read like a book",
            "lede": "Published books live here. Drafts stay in the private binder.",
            "homeLabel": "Shelf",
        }

    imprint = {
        "role": args.role,
        **values,
        "credit": "",
        "creditHref": "",
        "writeHref": "../desk/",
        "writeLabel": "Publishing desk",
        "forkHref": "",
        "forkLabel": "",
        "storagePrefix": storage_prefix(args.role, repository),
        "steps": [],
        "github": {
            "owner": args.owner,
            "repo": repository,
            "branch": "main",
        },
    }
    (destination / "imprint.json").write_text(
        json.dumps(imprint, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    print(f"Stamped {args.role} -> {destination}")
    print("Shared UI included: reader/ + desk/")
    print("Instance-owned files: books/, README.md, imprint.json")
    if args.role == "shelf":
        print("Publication content starts empty; the first release creates books/<slug>/.")
        print("Enable GitHub Pages for the public shelf.")
    else:
        print("Blank publication starters included from books/_*TEMPLATE.")
        print("Keep the binder private. Do not enable public Pages for unpublished manuscripts.")
    if args.owner == "auto":
        print("Optional: edit imprint.json and set github.owner for repository edit/history links.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
