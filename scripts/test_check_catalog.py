#!/usr/bin/env python3

import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("check-catalog.py")
SPEC = importlib.util.spec_from_file_location("check_catalog", MODULE_PATH)
check_catalog = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(check_catalog)


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def fixture(root: Path, role: str, *, status: str = "Published", catalog: bool = True) -> None:
    write(root / "imprint.json", json.dumps({"role": role}))
    row = "- [Demo](books/demo/)" if catalog else "Nothing listed."
    write(root / "README.md", f"# Test\n\n## The books\n\n{row}\n")
    write(
        root / "books" / "demo" / "README.md",
        "# Demo\n\n| | |\n|---|---|\n"
        f"| **Status** | {status} |\n",
    )


class CatalogCheckTests(unittest.TestCase):
    def test_platform_published_specimen_must_be_cataloged(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            fixture(root, "platform", catalog=False)
            self.assertIn("missing from root", "\n".join(check_catalog.check(root)))

    def test_platform_draft_may_be_uncataloged(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            fixture(root, "platform", status="Drafting", catalog=False)
            self.assertEqual(check_catalog.check(root), [])

    def test_shelf_catalog_entry_must_be_published(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            fixture(root, "shelf", status="Drafting", catalog=True)
            self.assertIn("not Published", "\n".join(check_catalog.check(root)))

    def test_catalog_entry_must_have_publication_hub(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            fixture(root, "platform")
            (root / "books" / "demo" / "README.md").unlink()
            self.assertIn("no readable", "\n".join(check_catalog.check(root)))


if __name__ == "__main__":
    unittest.main()