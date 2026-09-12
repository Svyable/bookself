#!/usr/bin/env python3
"""Sync Bookself UI into Desk/Shelf instances with explicit ownership boundaries."""

from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path

from instance_identity import stamp_reader_identity


def replace_tree(source: Path, destination: Path) -> None:
    if destination.exists():
        shutil.rmtree(destination)
    shutil.copytree(source, destination, ignore=shutil.ignore_patterns(".DS_Store"))


def read_imprint(destination: Path) -> dict:
    path = destination / "imprint.json"
    if not path.is_file():
        raise SystemExit(f"instance imprint missing: {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def shelf_owned_reader_paths(destination: Path, imprint: dict) -> set[Path]:
    owned = {
        Path("reader/index.html"),
        Path("reader/manifest.webmanifest"),
        Path("reader/app-icon.svg"),
        Path("reader/sw.js"),
        Path("reader/js/app.js"),
        Path("reader/js/shelf-gui.js"),
        Path("reader/css/shelf-gui.css"),
    }

    for raw in imprint.get("readerStyles") or []:
        value = str(raw).split("?", 1)[0].strip().lstrip("./")
        if value.startswith("reader/") and ".." not in Path(value).parts:
            owned.add(Path(value))

    reader = destination / "reader"
    if reader.is_dir():
        for path in reader.rglob("*"):
            if path.is_file() and path.name.startswith("shelf-"):
                owned.add(path.relative_to(destination))
    return owned


def snapshot_files(destination: Path, paths: set[Path]) -> dict[Path, bytes]:
    snapshot: dict[Path, bytes] = {}
    for relative in paths:
        path = destination / relative
        if path.is_file():
            snapshot[relative] = path.read_bytes()
    return snapshot


def restore_files(destination: Path, snapshot: dict[Path, bytes]) -> None:
    for relative, payload in snapshot.items():
        path = destination / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(payload)


def sync_shelf_safe(root: Path, destination: Path) -> None:
    """Update shared Reader engine files without replacing Shelf-owned state.

    Shelf owns its publication corpus, public shell, service worker, integration
    adapter, and identity-specific styles. Bookself supplies the reusable Reader
    modules. Its canonical app.js is materialized locally as app-core.js; Shelf
    never imports the Bookself deployment at runtime.
    """
    imprint = read_imprint(destination)
    if str(imprint.get("role") or "").lower() != "shelf":
        raise SystemExit(f"--shelf-safe requires imprint role=shelf: {destination}")

    preserved = snapshot_files(destination, shelf_owned_reader_paths(destination, imprint))
    replace_tree(root / "reader", destination / "reader")
    restore_files(destination, preserved)

    upstream_app = root / "reader" / "js" / "app.js"
    local_core = destination / "reader" / "js" / "app-core.js"
    local_core.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(upstream_app, local_core)

    stamp_reader_identity(destination)
    print(
        f"Safely synced Reader engine -> {destination} "
        "(Shelf shell/content preserved; Bookself app materialized as reader/js/app-core.js)"
    )


def sync_one(root: Path, destination: Path, *, shelf_safe: bool = False) -> None:
    if not destination.is_dir():
        raise SystemExit(f"instance not found: {destination}")

    imprint = read_imprint(destination)
    role = str(imprint.get("role") or "").strip().lower()
    if role == "shelf" and not shelf_safe:
        raise SystemExit(
            f"refusing whole-tree sync into Shelf instance {destination}; "
            "rerun with --shelf-safe so publication state and Shelf-owned integration files are preserved"
        )
    if shelf_safe:
        sync_shelf_safe(root, destination)
        return

    replace_tree(root / "reader", destination / "reader")
    replace_tree(root / "desk", destination / "desk")
    stamp_reader_identity(destination)
    print(f"Synced shared UI -> {destination} (reader/ + desk/; identity re-stamped from imprint.json)")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Sync Bookself UI into one or more explicit instances. Use --shelf-safe for public Shelf repositories."
    )
    parser.add_argument(
        "--shelf-safe",
        action="store_true",
        help="sync Reader engine into a Shelf while preserving Shelf-owned shell, identity, and publication state",
    )
    parser.add_argument("destinations", nargs="+", help="explicit instance directories to update")
    args = parser.parse_args()

    root = Path(__file__).resolve().parent.parent
    destinations = [Path(item).expanduser().resolve() for item in args.destinations]

    # Preflight every destination before mutating any of them. This prevents a
    # multi-target invocation from partially updating one instance before a
    # later destination is rejected by the ownership boundary.
    for destination in destinations:
        if not destination.is_dir():
            parser.error(f"instance not found: {destination}")
        role = str(read_imprint(destination).get("role") or "").strip().lower()
        if role == "shelf" and not args.shelf_safe:
            parser.error(
                f"refusing whole-tree sync into Shelf instance {destination}; "
                "use --shelf-safe with an explicit Shelf destination"
            )
        if args.shelf_safe and role != "shelf":
            parser.error(
                f"--shelf-safe may only target role=shelf instances: {destination}"
            )

    for destination in destinations:
        sync_one(root, destination, shelf_safe=args.shelf_safe)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
