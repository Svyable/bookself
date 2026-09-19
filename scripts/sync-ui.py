#!/usr/bin/env python3
"""Sync Bookself UI into Desk/Shelf instances with explicit ownership boundaries."""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import tempfile
from pathlib import Path

from instance_identity import stamp_reader_identity

BOOKSELF_READER_PREFIX = "https://svyable.github.io/bookself/reader/"
RUNTIME_DIRS = {"js", "css", "vendor"}
RUNTIME_TEXT_SUFFIXES = {".html", ".js", ".mjs", ".css", ".json", ".webmanifest"}
SHELF_EXCLUDED_READER_PATHS = {
    Path("js/demo-catalog-contract.test.mjs"),
    Path("js/fireside-aesthetic.test.mjs"),
    Path("js/offline-shell-contract.test.mjs"),
}


def replace_tree(source: Path, destination: Path) -> None:
    if destination.exists():
        shutil.rmtree(destination)
    shutil.copytree(source, destination, ignore=shutil.ignore_patterns(".DS_Store"))


def read_imprint(destination: Path) -> dict:
    path = destination / "imprint.json"
    if not path.is_file():
        raise SystemExit(f"instance imprint missing: {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def reader_shell_entries(root: Path) -> list[str]:
    """Return the service-worker shell as the deployable Reader contract."""
    worker = root / "reader" / "sw.js"
    if not worker.is_file():
        raise SystemExit(f"Bookself Reader service worker not found: {worker}")

    entries: list[str] = []
    in_shell = False
    for raw in worker.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if line == "const SHELL = [":
            in_shell = True
            continue
        if in_shell and line == "];":
            break
        if not in_shell or not line.startswith("'./"):
            continue
        entry = line.rstrip(",")
        if len(entry) >= 2 and entry[0] == entry[-1] == "'":
            entries.append(entry[1:-1])

    if not entries:
        raise SystemExit("Bookself Reader service-worker SHELL is empty or unreadable")
    if len(entries) != len(set(entries)):
        raise SystemExit("Bookself Reader service-worker SHELL contains duplicate entries")
    return entries


def reader_runtime_paths(root: Path) -> list[Path]:
    """Return Bookself-owned runtime files, excluding instance-owned shell files."""
    runtime: list[Path] = []
    for entry in reader_shell_entries(root):
        relative = entry.removeprefix("./")
        path = Path(relative)
        if path.parts and path.parts[0] in RUNTIME_DIRS:
            runtime.append(path)

    if Path("js/app.js") not in runtime:
        raise SystemExit("Bookself Reader runtime contract does not declare js/app.js")
    return runtime


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


def remove_previous_desk_runtime(destination: Path) -> None:
    """Remove only files previously declared Bookself-owned by a Desk sync."""
    reader = destination / "reader"
    manifest = reader / ".bookself-runtime-files"
    if not manifest.is_file():
        return

    for raw in manifest.read_text(encoding="utf-8").splitlines():
        value = raw.strip()
        if not value:
            continue
        relative = Path(value)
        allowed = value == "sw.js" or (relative.parts and relative.parts[0] in RUNTIME_DIRS)
        if not allowed or ".." in relative.parts or relative.is_absolute():
            raise SystemExit(f"Refusing unsafe Desk runtime manifest entry: {value}")
        target = reader / relative
        if target.is_file() or target.is_symlink():
            target.unlink()


def copy_desk_runtime(root: Path, destination: Path) -> tuple[list[Path], list[str]]:
    """Copy only Bookself-owned Reader runtime into a Desk instance."""
    source_reader = root / "reader"
    target_reader = destination / "reader"
    target_reader.mkdir(parents=True, exist_ok=True)
    remove_previous_desk_runtime(destination)

    runtime = reader_runtime_paths(root)
    for relative in runtime:
        source = source_reader / relative
        if not source.is_file():
            raise SystemExit(f"Bookself Reader runtime path not found: {source}")
        target = target_reader / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)

    worker = source_reader / "sw.js"
    shutil.copy2(worker, target_reader / "sw.js")

    manifest = target_reader / ".bookself-runtime-files"
    manifest.write_text(
        "\n".join([*(str(path) for path in sorted(runtime)), "sw.js"]) + "\n",
        encoding="utf-8",
    )
    return runtime, reader_shell_entries(root)


def rewrite_desk_runtime_links(destination: Path) -> None:
    """Cut the Desk-owned shell over from Bookself Pages to its local runtime."""
    reader = destination / "reader"
    index = reader / "index.html"
    if index.is_file():
        source = index.read_text(encoding="utf-8")
        for attribute in ('href="', 'src="'):
            source = source.replace(attribute + BOOKSELF_READER_PREFIX, attribute)
        index.write_text(source, encoding="utf-8")

    loader = reader / "js" / "app-loader.js"
    if not loader.is_file():
        return

    source = loader.read_text(encoding="utf-8")
    lines = source.splitlines()
    for i, line in enumerate(lines):
        if line.startswith("const canonicalAppUrl = "):
            lines[i] = "const canonicalAppUrl = new URL('./app.js', import.meta.url).href;"
        elif line.startswith("const canonicalNavigationCssUrl = "):
            lines[i] = "const canonicalNavigationCssUrl = new URL('../css/navigation.css', import.meta.url).href;"
    loader.write_text("\n".join(lines) + ("\n" if source.endswith("\n") else ""), encoding="utf-8")


def verify_reader_shell(destination: Path, shell_entries: list[str]) -> None:
    reader = destination / "reader"
    missing: list[str] = []
    for entry in shell_entries:
        relative = entry.removeprefix("./")
        target = reader if not relative else reader / relative
        if not target.exists():
            missing.append(entry)
    if missing:
        raise SystemExit(
            "Desk Reader offline shell is incomplete after sync: " + ", ".join(missing)
        )


def verify_local_bookself_runtime(destination: Path) -> None:
    """Reject production runtime links back to the Bookself Pages deployment."""
    reader = destination / "reader"
    failures: list[str] = []
    for path in sorted(reader.rglob("*")):
        if not path.is_file() or path.suffix not in RUNTIME_TEXT_SUFFIXES:
            continue
        try:
            source = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        if BOOKSELF_READER_PREFIX in source:
            failures.append(str(path.relative_to(destination)))
    if failures:
        raise SystemExit(
            "Desk Reader still contains Bookself Pages runtime dependencies: "
            + ", ".join(failures)
        )


def write_desk_offline_version(destination: Path, shell_entries: list[str]) -> None:
    reader = destination / "reader"
    worker = reader / "sw.js"
    source = worker.read_text(encoding="utf-8")
    cache = None
    for raw in source.splitlines():
        line = raw.strip()
        if line.startswith("const CACHE = '") and line.endswith("';"):
            cache = line[len("const CACHE = '"):-2]
            break
    if not cache:
        raise SystemExit("Desk Reader offline verification failed: service worker cache generation not found")

    (reader / ".bookself-offline-version").write_text(
        f"cache={cache}\n"
        f"sw_sha256={hashlib.sha256(worker.read_bytes()).hexdigest()}\n"
        f"shell_entries={len(shell_entries)}\n",
        encoding="utf-8",
    )


def build_desk_candidate(root: Path, destination: Path, stage: Path) -> Path:
    """Build and verify the next Desk Reader without mutating the live instance."""
    candidate = stage / "desk"
    candidate.mkdir(parents=True)
    shutil.copy2(destination / "imprint.json", candidate / "imprint.json")
    source_reader = destination / "reader"
    if source_reader.is_dir():
        shutil.copytree(source_reader, candidate / "reader")
    else:
        (candidate / "reader").mkdir()

    _, shell_entries = copy_desk_runtime(root, candidate)
    rewrite_desk_runtime_links(candidate)
    verify_reader_shell(candidate, shell_entries)
    verify_local_bookself_runtime(candidate)
    write_desk_offline_version(candidate, shell_entries)
    stamp_reader_identity(candidate)
    return candidate


def sync_desk_safe(root: Path, destination: Path) -> None:
    """Update Bookself-owned Reader runtime without replacing Desk-owned state."""
    imprint = read_imprint(destination)
    if str(imprint.get("role") or "").strip().lower() != "desk":
        raise SystemExit(f"--desk-safe requires imprint role=desk: {destination}")

    with tempfile.TemporaryDirectory(prefix="bookself-desk-sync-") as tmp:
        candidate = build_desk_candidate(root, destination, Path(tmp))
        replace_tree(candidate / "reader", destination / "reader")

    print(
        f"Safely synced Reader runtime -> {destination} "
        "(Desk shell/content preserved; Bookself runtime is local)"
    )


def sync_shelf_safe(root: Path, destination: Path) -> None:
    """Update shared Reader engine files without replacing Shelf-owned state.

    Shelf owns its publication corpus, public shell, service worker, integration
    adapter, and identity-specific styles. Bookself supplies the reusable Reader
    modules. Its canonical app.js is materialized locally as app-core.js; Shelf
    never imports the Bookself deployment at runtime.
    """
    imprint = read_imprint(destination)
    if str(imprint.get("role") or "").strip().lower() != "shelf":
        raise SystemExit(f"--shelf-safe requires imprint role=shelf: {destination}")

    preserved = snapshot_files(destination, shelf_owned_reader_paths(destination, imprint))
    replace_tree(root / "reader", destination / "reader")
    for relative in SHELF_EXCLUDED_READER_PATHS:
        target = destination / "reader" / relative
        if target.is_file() or target.is_symlink():
            target.unlink()
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


def sync_one(
    root: Path,
    destination: Path,
    *,
    desk_safe: bool = False,
    shelf_safe: bool = False,
) -> None:
    if not destination.is_dir():
        raise SystemExit(f"instance not found: {destination}")

    imprint = read_imprint(destination)
    role = str(imprint.get("role") or "").strip().lower()
    if desk_safe:
        sync_desk_safe(root, destination)
        return
    if shelf_safe:
        sync_shelf_safe(root, destination)
        return
    if role in {"desk", "shelf"}:
        raise SystemExit(
            f"refusing whole-tree sync into role={role} instance {destination}; "
            f"use --{role}-safe so instance-owned state is preserved"
        )

    replace_tree(root / "reader", destination / "reader")
    replace_tree(root / "desk", destination / "desk")
    stamp_reader_identity(destination)
    print(f"Synced shared UI -> {destination} (reader/ + desk/; identity re-stamped from imprint.json)")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Sync Bookself UI into explicit instances without crossing role ownership boundaries."
    )
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument(
        "--desk-safe",
        action="store_true",
        help="sync Bookself-owned Reader runtime into a Desk while preserving Desk-owned shell and content",
    )
    mode.add_argument(
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
        if args.desk_safe and role != "desk":
            parser.error(f"--desk-safe may only target role=desk instances: {destination}")
        if args.shelf_safe and role != "shelf":
            parser.error(f"--shelf-safe may only target role=shelf instances: {destination}")
        if not args.desk_safe and not args.shelf_safe and role in {"desk", "shelf"}:
            parser.error(
                f"refusing whole-tree sync into role={role} instance {destination}; "
                f"use --{role}-safe"
            )

    for destination in destinations:
        sync_one(root, destination, desk_safe=args.desk_safe, shelf_safe=args.shelf_safe)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
