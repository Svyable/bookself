#!/usr/bin/env python3

import json
import tempfile
import unittest
from pathlib import Path

from doctor import PUBLICATION_TEMPLATES, inspect_root, portal_slugs, summary


def write(path: Path, content: str = "") -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def fixture(root: Path, role: str, *, status: str | None = None, catalog: bool = True) -> None:
    status = status or ("Published" if role in {"platform", "shelf"} else "Drafting")
    write(root / "imprint.json", json.dumps({"role": role, "name": "Test"}))
    write(root / "reader" / "index.html", "<!doctype html><title>Reader</title>")
    write(root / "desk" / "index.html", "<!doctype html><title>Desk</title>")

    books_section = "- [Demo](books/demo/)" if catalog else "Nothing listed."
    write(root / "README.md", f"# Test\n\n## The books\n\n{books_section}\n")
    write(
        root / "books" / "demo" / "README.md",
        "# Demo\n\n"
        "| | |\n|---|---|\n"
        "| **Authors** | @ada |\n"
        f"| **Status** | {status} |\n\n"
        "## Contents\n\n"
        "- [x] [Chapter 1](manuscript/ch01.md)\n",
    )
    write(root / "books" / "demo" / "manuscript" / "ch01.md", "# Chapter 1\n\nHello.\n")

    if role == "platform":
        for template in PUBLICATION_TEMPLATES:
            write(root / "books" / template / "README.md", f"# {template}\n")

    if role in {"platform", "binder"}:
        write(root / "scripts" / "release-book.py", "# release helper\n")
        write(root / "scripts" / "release-book.sh", "# release wrapper\n")


class DoctorTests(unittest.TestCase):
    def test_portal_slugs_only_reads_books_section(self):
        markdown = """# X

## The books

- [One](books/one/)
- [Again](./books/one/)

## The web shelf

- [Not a local book](https://example.com/)
"""
        self.assertEqual(portal_slugs(markdown), ["one"])

    def test_healthy_platform_has_no_errors(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            fixture(root, "platform")
            findings = inspect_root(root)
            self.assertEqual(summary(findings)["error"], 0)
            self.assertIn("role", {item.code for item in findings})
            self.assertIn("catalog", {item.code for item in findings})

    def test_shelf_catalog_requires_published_status(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            fixture(root, "shelf", status="Revision in progress")
            codes = {item.code for item in inspect_root(root)}
            self.assertIn("catalog_not_published", codes)

    def test_shelf_published_book_must_be_cataloged(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            fixture(root, "shelf", catalog=False)
            codes = {item.code for item in inspect_root(root)}
            self.assertIn("published_not_cataloged", codes)

    def test_binder_rejects_published_working_copy(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            fixture(root, "binder", status="Published")
            codes = {item.code for item in inspect_root(root)}
            self.assertIn("binder_published", codes)

    def test_missing_manuscript_file_is_an_error(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            fixture(root, "platform")
            (root / "books" / "demo" / "manuscript" / "ch01.md").unlink()
            codes = {item.code for item in inspect_root(root)}
            self.assertIn("missing_manuscript_file", codes)

    def test_invalid_reader_presentation_is_an_error(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            fixture(root, "platform")
            write(
                root / "books" / "demo" / "reader.json",
                json.dumps({"version": 1, "typography": {"font": "handwriting"}}),
            )
            codes = {item.code for item in inspect_root(root)}
            self.assertIn("reader_typography_font", codes)

    def test_valid_reader_presentation_is_reported(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            fixture(root, "platform")
            write(
                root / "books" / "demo" / "reader.json",
                json.dumps({"version": 1, "appearance": {"theme": "ivory"}}),
            )
            findings = inspect_root(root)
            self.assertEqual(summary(findings)["error"], 0)
            self.assertIn("reader_presentation", {item.code for item in findings})


if __name__ == "__main__":
    unittest.main()
