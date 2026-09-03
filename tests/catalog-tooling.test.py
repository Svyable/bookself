#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
import json
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


check_catalog = load_module("check_catalog", ROOT / "scripts" / "check-catalog.py")
release_book = load_module("release_book", ROOT / "scripts" / "release-book.py")

with tempfile.TemporaryDirectory() as tmp:
    root = Path(tmp)
    (root / "imprint.json").write_text('{"role":"shelf"}\n', encoding="utf-8")
    (root / "README.md").write_text("# Human-facing Shelf\n", encoding="utf-8")
    (root / "catalog.json").write_text(
        json.dumps({"version": 1, "books": ["released", "public-proof"]}) + "\n",
        encoding="utf-8",
    )
    for slug, status in [("released", "Published"), ("public-proof", "Revised")]:
        book = root / "books" / slug
        book.mkdir(parents=True)
        (book / "README.md").write_text(
            f"# {slug}\n\n| | |\n|---|---|\n| **Status** | {status} |\n",
            encoding="utf-8",
        )

    assert check_catalog.check(root) == []

    missing = root / "books" / "missing-release"
    missing.mkdir(parents=True)
    (missing / "README.md").write_text(
        "# Missing\n\n| | |\n|---|---|\n| **Status** | Published |\n",
        encoding="utf-8",
    )
    errors = check_catalog.check(root)
    assert errors == ["missing-release: Published publication is missing from catalog.json"]

    (root / "catalog.json").write_text(
        '{"version":1,"books":["released","released"]}\n', encoding="utf-8"
    )
    try:
        check_catalog.check(root)
    except ValueError as exc:
        assert "repeats book slug" in str(exc)
    else:
        raise AssertionError("duplicate manifest slug should fail validation")

manifest = '{"version":1,"books":["alpha"]}\n'
updated, action = release_book.upsert_catalog_manifest(manifest, "beta")
assert action == "added"
assert json.loads(updated)["books"] == ["alpha", "beta"]
unchanged, action = release_book.upsert_catalog_manifest(updated, "beta")
assert action == "unchanged"
assert json.loads(unchanged)["books"] == ["alpha", "beta"]

print("catalog tooling tests ok")
