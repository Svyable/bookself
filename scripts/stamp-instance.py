#!/usr/bin/env python3
"""Copy Bookself into an empty destination and stamp Desk/Shelf identity."""

from __future__ import annotations

import argparse
import json
import re
import shutil
from pathlib import Path

from instance_identity import stamp_reader_identity

SHELF_ADAPTER = """// Shelf-owned Reader boundary.
// Bookself framework code is copied locally into app-core.js; a Shelf never
// executes the Bookself Pages deployment as a runtime dependency.
import './app-core.js';
"""


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
            skipped.update({".git", "imprint.json", "README.md", "catalog.json", "shelf"})
            if role == "shelf":
                # The Publishing Desk is an authoring application. A public
                # release-only Shelf must never contain a copied Desk tree.
                skipped.add("desk")
        elif rel == Path(".github"):
            skipped.add("workflows")
        elif rel == Path("books"):
            allowed = {name for name in names if role == "desk" and is_publication_template(name)}
            skipped.update(name for name in names if name not in allowed)
        elif rel == Path("docs"):
            skipped.update({"superpowers", "instances"})
        return skipped.intersection(names)

    shutil.copytree(root, destination, dirs_exist_ok=True, ignore=ignore)


def install_shelf_reader_boundary(destination: Path) -> None:
    """Turn the copied upstream Reader entrypoint into a local Shelf boundary.

    The initial framework app is materialized as ``app-core.js``. ``app.js`` is
    then instance-owned and remains stable across ``--shelf-safe`` upgrades,
    which replace the local core without making Shelf import Bookself at runtime.
    """

    app = destination / "reader" / "js" / "app.js"
    core = destination / "reader" / "js" / "app-core.js"
    if not app.is_file():
        raise SystemExit(f"copied Reader entrypoint missing: {app}")
    core.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(app, core)
    app.write_text(SHELF_ADAPTER, encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Copy this Bookself tree into an empty destination and stamp instance identity."
    )
    parser.add_argument("destination", help="empty directory to create or populate")
    parser.add_argument("role", choices=("desk", "shelf"))
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
    if args.role == "shelf":
        install_shelf_reader_boundary(destination)

    shutil.copy2(root / "docs" / "instances" / f"{args.role}-README.md", destination / "README.md")

    if args.role == "desk":
        values = {
            "name": "Private Desk",
            "shortName": "Desk",
            "description": "Private Bookself workspace for drafts and manuscripts.",
            "kicker": "Private manuscripts · Git-native writing",
            "lede": "Draft and revise here. The Reader and publishing Desk are local to this authoring repository.",
            "homeLabel": "Desk",
            "writeHref": "../desk/",
            "writeLabel": "Publishing Desk",
        }
    else:
        values = {
            "name": "Public Shelf",
            "shortName": "Shelf",
            "description": "Public Bookself shelf for published Markdown books.",
            "kicker": "Published on Git · Read like a book",
            "lede": "Published books live here. Drafts and authoring tools stay on the separate Desk.",
            "homeLabel": "Shelf",
            # A generic Shelf cannot infer the URL of its separate Desk. An
            # instance may explicitly configure that external link later.
            "writeHref": "",
            "writeLabel": "",
        }

    imprint = {
        "role": args.role,
        **values,
        "credit": "",
        "creditHref": "",
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
    stamp_reader_identity(destination)

    print(f"Stamped {args.role} -> {destination}")
    if args.role == "shelf":
        print("Shared software included: local Reader engine only; no Publishing Desk tree")
        print("Shelf Reader boundary: reader/js/app.js -> local reader/js/app-core.js")
    else:
        print("Shared software included: reader/ + desk/")
    print("Instance-owned files: books/, README.md, imprint.json")
    print("Reader install identity: stamped from imprint.json")
    if args.role == "shelf":
        print("Publication content starts empty; the first release creates books/<slug>/.")
        print("Enable GitHub Pages for the public Shelf.")
    else:
        templates = sorted(path.name for path in (destination / "books").iterdir() if path.is_dir())
        print(f"Blank starters included: {', '.join(templates)}")
        print("Keep the Desk private. Do not enable public Pages for unpublished manuscripts unless that exposure is deliberate.")
    if args.owner == "auto":
        print("Optional: edit imprint.json and set github.owner for repository edit/history links.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
