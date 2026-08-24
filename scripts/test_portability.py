#!/usr/bin/env python3
"""Smoke tests for Bookself's dependency-light, cross-platform helpers."""

from __future__ import annotations

import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent


class PortabilityTests(unittest.TestCase):
    def test_python_helpers_avoid_common_third_party_imports(self) -> None:
        helpers = (
            ROOT / "scripts" / "doctor.py",
            ROOT / "scripts" / "release-book.py",
            ROOT / "scripts" / "sync-ui.py",
            ROOT / "scripts" / "promote-book.py",
            ROOT / "scripts" / "stamp-instance.py",
        )
        for helper in helpers:
            self.assertTrue(helper.is_file(), helper)
            source = helper.read_text(encoding="utf-8")
            self.assertNotIn("import requests", source)
            self.assertNotIn("import click", source)
            self.assertNotIn("import rich", source)

    def test_static_surfaces_exist(self) -> None:
        self.assertTrue((ROOT / "reader" / "index.html").is_file())
        self.assertTrue((ROOT / "desk" / "index.html").is_file())

    def test_requirements_document_states_minimal_contract(self) -> None:
        text = (ROOT / "REQUIREMENTS.md").read_text(encoding="utf-8")
        self.assertIn("Git + Python 3", text)
        self.assertIn("macOS, Windows, and Linux", text)
        self.assertIn("no application dependencies", text.lower())

    def test_stamp_instance_keeps_only_blank_publication_templates(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            destination = Path(tmp) / "binder"
            subprocess.run(
                [
                    sys.executable,
                    str(ROOT / "scripts" / "stamp-instance.py"),
                    str(destination),
                    "binder",
                    "example-owner",
                    "binder",
                ],
                check=True,
                capture_output=True,
                text=True,
            )
            book_entries = {path.name for path in (destination / "books").iterdir()}
            self.assertEqual(book_entries, {"_TEMPLATE", "_PAPER_TEMPLATE"})


if __name__ == "__main__":
    unittest.main()
