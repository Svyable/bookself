#!/usr/bin/env python3
from __future__ import annotations

import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

with tempfile.TemporaryDirectory() as tmp:
    destination = Path(tmp) / "shelf"
    subprocess.run(
        [
            sys.executable,
            str(ROOT / "scripts" / "stamp-instance.py"),
            str(destination),
            "shelf",
            "example-owner",
            "shelf",
        ],
        check=True,
        cwd=ROOT,
        capture_output=True,
        text=True,
    )

    assert (destination / "reader").is_dir()
    assert not (destination / "desk").exists(), "a Shelf must not receive the Desk authoring tree"
    assert (destination / "books").is_dir()
    assert not any((destination / "books").iterdir()), "new Shelf must start without publication fixtures"
    assert (destination / "catalog.json").is_file(), "a new Shelf needs an empty machine-readable catalog"
    assert (destination / "index.html").is_file()
    assert (destination / "llms.txt").is_file()
    assert (destination / "robots.txt").is_file()
    assert not (destination / "agentic-authorship.html").exists()
    assert "svyable.github.io/bookself" not in (destination / "llms.txt").read_text()
    assert not (destination / "shelf").exists(), "embedded upstream demo Shelf must not be copied into an author instance"

print("stamp platform boundary tests ok")
