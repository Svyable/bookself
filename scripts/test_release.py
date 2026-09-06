import importlib.util
import json
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest import mock

MODULE_PATH = Path(__file__).with_name("release.py")
spec = importlib.util.spec_from_file_location("release", MODULE_PATH)
release = importlib.util.module_from_spec(spec)
spec.loader.exec_module(release)


def git(root: Path, *args: str) -> None:
    subprocess.run(
        ["git", "-C", str(root), *args],
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )


def init_repo(root: Path, imprint: dict) -> None:
    root.mkdir(parents=True)
    git(root, "init", "-q")
    git(root, "config", "user.email", "test@example.com")
    git(root, "config", "user.name", "Test")
    (root / "imprint.json").write_text(json.dumps(imprint), encoding="utf-8")


def commit_all(root: Path, message: str = "init") -> None:
    git(root, "add", ".")
    git(root, "commit", "-q", "-m", message)


class AtomicReleaseTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        base = Path(self.tmp.name)
        self.desk = base / "desk"
        self.shelf = base / "shelf"
        init_repo(self.desk, {"role": "desk"})
        init_repo(
            self.shelf,
            {
                "role": "shelf",
                "name": "Test Shelf",
                "github": {"owner": "Example", "repo": "shelf"},
            },
        )

        desk_book = self.desk / "books" / "my-book"
        (desk_book / "manuscript").mkdir(parents=True)
        (desk_book / "README.md").write_text(
            "# My Book\n\n"
            "*A useful subtitle*\n\n"
            "| | |\n|---|---|\n"
            "| **Author** | A Writer |\n"
            "| **Status** | Revision in progress |\n"
            "| **Format** | Book |\n\n"
            "A newly revised description for readers.\n\n"
            "## Contents\n\n"
            "- [x] [Chapter 1](manuscript/ch01.md)\n",
            encoding="utf-8",
        )
        (desk_book / "manuscript" / "ch01.md").write_text(
            "# Chapter 1\n\nnew edition\n", encoding="utf-8"
        )
        (self.desk / "README.md").write_text("# Desk\n", encoding="utf-8")
        commit_all(self.desk)

        shelf_book = self.shelf / "books" / "my-book"
        (shelf_book / "manuscript").mkdir(parents=True)
        (shelf_book / "README.md").write_text(
            "# My Book\n\n"
            "| | |\n|---|---|\n"
            "| **Author** | A Writer |\n"
            "| **Status** | Published |\n\n"
            "Old public description.\n\n"
            "## Contents\n",
            encoding="utf-8",
        )
        (shelf_book / "manuscript" / "ch01.md").write_text(
            "# Chapter 1\n\nold edition\n", encoding="utf-8"
        )
        (self.shelf / "README.md").write_text(
            "# Shelf\n\n"
            "## The books\n\n"
            "| Book | Authors | Status |\n|---|---|---|\n"
            "| [My Book](books/my-book/) | A Writer | Published |\n\n"
            "## The stand\n",
            encoding="utf-8",
        )
        (self.shelf / "catalog.json").write_text(
            json.dumps({"version": 1, "books": ["my-book"]}) + "\n",
            encoding="utf-8",
        )
        commit_all(self.shelf)

    def tearDown(self):
        self.tmp.cleanup()

    def test_release_refreshes_canonical_web_surface_in_same_transaction(self):
        result = release.prepare_release(self.desk, self.shelf, "my-book")
        page = self.shelf / "publication" / "my-book" / "index.html"
        sitemap = self.shelf / "sitemap.xml"
        self.assertTrue(page.is_file())
        self.assertTrue(sitemap.is_file())
        html = page.read_text(encoding="utf-8")
        self.assertIn("My Book — A Writer", html)
        self.assertIn("A newly revised description for readers.", html)
        self.assertIn(
            'rel="canonical" href="https://Example.github.io/shelf/publication/my-book/"',
            html,
        )
        self.assertIn("reader/#/b/my-book/", html)
        self.assertIn(
            "https://Example.github.io/shelf/publication/my-book/",
            sitemap.read_text(encoding="utf-8"),
        )
        self.assertGreaterEqual(result["publication_files"], 3)
        self.assertGreater(result["publication_changed"], 0)
        self.assertEqual(
            result["canonical_url"],
            "https://Example.github.io/shelf/publication/my-book/",
        )

    def test_dirty_generated_surface_is_refused_before_release(self):
        publication = self.shelf / "publication"
        publication.mkdir()
        (publication / "scratch.txt").write_text("uncommitted", encoding="utf-8")
        with self.assertRaisesRegex(
            release.ReleaseError, "Shelf has uncommitted changes in release paths"
        ):
            release.prepare_release(self.desk, self.shelf, "my-book")
        self.assertIn(
            "old edition",
            (self.shelf / "books" / "my-book" / "manuscript" / "ch01.md").read_text(),
        )

    def test_generator_failure_rolls_back_book_catalog_and_web_surface(self):
        before_book = (self.shelf / "books" / "my-book" / "README.md").read_text()
        before_root = (self.shelf / "README.md").read_text()
        before_catalog = (self.shelf / "catalog.json").read_text()
        with mock.patch.object(
            release.publication_pages,
            "build",
            side_effect=RuntimeError("synthetic generator failure"),
        ):
            with self.assertRaisesRegex(
                release.ReleaseError, "publication web generation failed"
            ):
                release.prepare_release(self.desk, self.shelf, "my-book")
        self.assertEqual(
            (self.shelf / "books" / "my-book" / "README.md").read_text(),
            before_book,
        )
        self.assertEqual((self.shelf / "README.md").read_text(), before_root)
        self.assertEqual((self.shelf / "catalog.json").read_text(), before_catalog)
        self.assertFalse((self.shelf / "publication").exists())
        self.assertFalse((self.shelf / "sitemap.xml").exists())
        self.assertEqual(
            subprocess.run(
                ["git", "-C", str(self.shelf), "status", "--porcelain"],
                check=True,
                stdout=subprocess.PIPE,
                text=True,
            ).stdout,
            "",
        )


if __name__ == "__main__":
    unittest.main()
