#!/usr/bin/env python3
"""Smoke tests for Bookself's dependency-light, cross-platform helpers."""

from __future__ import annotations

import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
PUBLICATION_TEMPLATES = {
    "_TEMPLATE",
    "_PAPER_TEMPLATE",
    "_MAGAZINE_TEMPLATE",
    "_NEWSPAPER_TEMPLATE",
    "_JOURNAL_TEMPLATE",
    "_NEWSLETTER_TEMPLATE",
    "_ANTHOLOGY_TEMPLATE",
    "_REPORT_TEMPLATE",
    "_MANUAL_TEMPLATE",
    "_COMIC_TEMPLATE",
}


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

    def stamp_instance(self, root: Path, role: str) -> Path:
        destination = root / role
        subprocess.run(
            [
                sys.executable,
                str(ROOT / "scripts" / "stamp-instance.py"),
                str(destination),
                role,
                "example-owner",
                role,
            ],
            check=True,
            capture_output=True,
            text=True,
        )
        return destination

    def test_stamp_instance_keeps_role_specific_publication_content(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            desk = self.stamp_instance(root, "desk")
            shelf = self.stamp_instance(root, "shelf")

            desk_books = {path.name for path in (desk / "books").iterdir()}
            shelf_books = {path.name for path in (shelf / "books").iterdir()}

            self.assertEqual(desk_books, PUBLICATION_TEMPLATES)
            self.assertEqual(shelf_books, set())
            self.assertFalse((desk / ".github" / "workflows").exists())
            self.assertFalse((shelf / ".github" / "workflows").exists())

    def test_obsolete_binder_role_is_rejected_by_stamper(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            result = subprocess.run(
                [
                    sys.executable,
                    str(ROOT / "scripts" / "stamp-instance.py"),
                    str(Path(tmp) / "old-role"),
                    "binder",
                ],
                capture_output=True,
                text=True,
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("invalid choice", result.stderr)

    def test_promote_book_handles_shelf_without_books_directory(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            shelf = Path(tmp) / "shelf"
            shelf.mkdir()
            subprocess.run(
                [
                    sys.executable,
                    str(ROOT / "scripts" / "promote-book.py"),
                    "how-to-bookself",
                    str(shelf),
                ],
                check=True,
                capture_output=True,
                text=True,
            )
            self.assertTrue((shelf / "books" / "how-to-bookself" / "README.md").is_file())


if __name__ == "__main__":
    unittest.main()
