import importlib.util
import json
import subprocess
import tempfile
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("release-book.py")
spec = importlib.util.spec_from_file_location("release_book", MODULE_PATH)
release_book = importlib.util.module_from_spec(spec)
spec.loader.exec_module(release_book)


def git(root, *args):
    subprocess.run(
        ["git", "-C", str(root), *args],
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )


def init_repo(root: Path, role: str):
    root.mkdir(parents=True)
    git(root, "init", "-q")
    git(root, "config", "user.email", "test@example.com")
    git(root, "config", "user.name", "Test")
    (root / "imprint.json").write_text(
        json.dumps({"role": role}), encoding="utf-8"
    )


def commit_all(root: Path, message="init"):
    git(root, "add", ".")
    git(root, "commit", "-q", "-m", message)


class ReleaseTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        base = Path(self.tmp.name)
        self.desk = base / "desk"
        self.shelf = base / "shelf"
        init_repo(self.desk, "desk")
        init_repo(self.shelf, "shelf")

        desk_book = self.desk / "books" / "my-book"
        (desk_book / "manuscript").mkdir(parents=True)
        (desk_book / "README.md").write_text(
            "# My Book\n\n"
            "| | |\n|---|---|\n"
            "| **Author** | A Writer |\n"
            "| **Status** | Revision in progress |\n"
            "| **Chapters** | 1 of 1 drafted |\n\n"
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
            "## Contents\n\n"
            "- [x] [Chapter 1](manuscript/ch01.md)\n",
            encoding="utf-8",
        )
        (shelf_book / "manuscript" / "ch01.md").write_text(
            "# Chapter 1\n\nold edition\n", encoding="utf-8"
        )
        (shelf_book / "old-only.txt").write_text("remove me", encoding="utf-8")
        (self.shelf / "README.md").write_text(
            "# Shelf\n\n"
            "## The books\n\n"
            "| Book | Authors |\n|---|---|\n"
            "| [My Book](books/my-book/) | A Writer |\n\n"
            "## The stand\n",
            encoding="utf-8",
        )
        commit_all(self.shelf)

    def tearDown(self):
        self.tmp.cleanup()

    def test_release_replaces_snapshot_and_preserves_desk(self):
        source_before = (self.desk / "books" / "my-book" / "README.md").read_text()
        expected_shelf_readme = release_book.set_status_published(source_before)
        result = release_book.prepare_release(self.desk, self.shelf, "my-book")
        self.assertEqual(result["catalog_action"], "unchanged")
        self.assertEqual(
            (self.desk / "books" / "my-book" / "README.md").read_text(),
            source_before,
        )
        self.assertEqual(
            (self.shelf / "books" / "my-book" / "README.md").read_text(),
            expected_shelf_readme,
        )
        self.assertEqual(
            (self.shelf / "books" / "my-book" / "manuscript" / "ch01.md").read_text(),
            "# Chapter 1\n\nnew edition\n",
        )
        self.assertFalse((self.shelf / "books" / "my-book" / "old-only.txt").exists())
        self.assertFalse(list((self.shelf / "books").glob(".my-book.bookself-*")))

    def test_dirty_desk_refused(self):
        path = self.desk / "books" / "my-book" / "manuscript" / "ch01.md"
        path.write_text(path.read_text() + "dirty\n")
        with self.assertRaisesRegex(
            release_book.ReleaseError, "Desk has uncommitted changes"
        ):
            release_book.prepare_release(self.desk, self.shelf, "my-book")

    def test_dirty_shelf_refused(self):
        path = self.shelf / "README.md"
        path.write_text(path.read_text() + "\ndirty\n")
        with self.assertRaisesRegex(
            release_book.ReleaseError, "Shelf has uncommitted changes"
        ):
            release_book.prepare_release(self.desk, self.shelf, "my-book")

    def test_wrong_role_refused(self):
        (self.shelf / "imprint.json").write_text(json.dumps({"role": "desk"}))
        commit_all(self.shelf, "wrong role")
        with self.assertRaisesRegex(
            release_book.ReleaseError, "destination is not a Shelf"
        ):
            release_book.prepare_release(self.desk, self.shelf, "my-book")

    def test_old_binder_role_is_not_accepted(self):
        (self.desk / "imprint.json").write_text(json.dumps({"role": "binder"}))
        commit_all(self.desk, "obsolete role")
        with self.assertRaisesRegex(
            release_book.ReleaseError, "source is not a Desk"
        ):
            release_book.prepare_release(self.desk, self.shelf, "my-book")

    def test_bad_slug_refused(self):
        with self.assertRaisesRegex(
            release_book.ReleaseError, "slug must use lowercase"
        ):
            release_book.prepare_release(self.desk, self.shelf, "../my-book")

    def test_published_desk_refused(self):
        path = self.desk / "books" / "my-book" / "README.md"
        path.write_text(path.read_text().replace("Revision in progress", "Published"))
        commit_all(self.desk, "published desk state")
        with self.assertRaisesRegex(
            release_book.ReleaseError, "Desk copy is already marked Published"
        ):
            release_book.prepare_release(self.desk, self.shelf, "my-book")

    def test_leftover_transaction_refused(self):
        leftover = self.shelf / "books" / ".my-book.bookself-stage-interrupted"
        leftover.mkdir()
        (leftover / "README.md").write_text("partial")
        with self.assertRaisesRegex(
            release_book.ReleaseError, "leftover Bookself release transaction paths"
        ):
            release_book.prepare_release(self.desk, self.shelf, "my-book")

    def test_catalog_row_added(self):
        (self.shelf / "README.md").write_text(
            "# Shelf\n\n"
            "## The books\n\n"
            "| Book | Authors |\n|---|---|\n\n"
            "## The stand\n",
            encoding="utf-8",
        )
        commit_all(self.shelf, "empty catalog")
        result = release_book.prepare_release(self.desk, self.shelf, "my-book")
        self.assertEqual(result["catalog_action"], "added")
        self.assertIn(
            "| [My Book](books/my-book/) | A Writer |",
            (self.shelf / "README.md").read_text(),
        )

    def test_catalog_row_updated_when_title_changes(self):
        path = self.desk / "books" / "my-book" / "README.md"
        path.write_text(path.read_text().replace("# My Book", "# My Book Revised"))
        commit_all(self.desk, "title")
        result = release_book.prepare_release(self.desk, self.shelf, "my-book")
        self.assertEqual(result["catalog_action"], "updated")
        self.assertIn(
            "| [My Book Revised](books/my-book/) | A Writer |",
            (self.shelf / "README.md").read_text(),
        )


if __name__ == "__main__":
    unittest.main()
