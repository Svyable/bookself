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
    assert (destination / "desk").is_dir()
    assert (destination / "books").is_dir()
    assert not any((destination / "books").iterdir()), "new Shelf must start without publication fixtures"
    assert not (destination / "catalog.json").exists(), "platform demo catalog must not leak into a new Shelf"
    assert not (destination / "shelf").exists(), "embedded upstream demo Shelf must not be copied into an author instance"

print("stamp platform boundary tests ok")
