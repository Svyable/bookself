#!/usr/bin/env python3
"""Sync Bookself's shared Reader and Desk into Desk/Shelf instances."""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path


def replace_tree(source: Path, destination: Path) -> None:
    if destination.exists():
        shutil.rmtree(destination)
    shutil.copytree(source, destination, ignore=shutil.ignore_patterns(".DS_Store"))


def sync_one(root: Path, destination: Path) -> None:
    if not destination.is_dir():
        raise SystemExit(f"instance not found: {destination}")
    replace_tree(root / "reader", destination / "reader")
    replace_tree(root / "desk", destination / "desk")
    print(f"Synced shared UI -> {destination} (reader/ + desk/)")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Sync Bookself's shared Reader and Desk into Desk/Shelf instances."
    )
    parser.add_argument("destinations", nargs="*", help="instance directories to update")
    args = parser.parse_args()

    root = Path(__file__).resolve().parent.parent
    destinations = [Path(item).expanduser().resolve() for item in args.destinations]
    if not destinations:
        destinations = [path for path in (root.parent / "desk", root.parent / "shelf") if path.is_dir()]

    if not destinations:
        parser.error("no sibling desk or shelf found; pass one or more instance paths")

    for destination in destinations:
        sync_one(root, destination)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
