from __future__ import annotations

import json
import subprocess
import tempfile
import unittest
from pathlib import Path

import doctor
import doctor_pair


class PairDoctorTests(unittest.TestCase):
    def make_instance(self, root: Path, *, role: str, repo: str) -> None:
        (root / "reader").mkdir(parents=True)
        (root / "desk").mkdir(parents=True)
        (root / "books").mkdir(parents=True)
        (root / "reader" / "index.html").write_text("reader\n", encoding="utf-8")
        (root / "desk" / "index.html").write_text("desk\n", encoding="utf-8")
        (root / "README.md").write_text(
            f"# {role.title()}\n\n## The books\n\n| Book | Authors | Status |\n|---|---|---|\n| | | |\n",
            encoding="utf-8",
        )
        (root / "imprint.json").write_text(
            json.dumps(
                {
                    "role": role,
                    "storagePrefix": f"{role}-{repo}",
                    "github": {"owner": "example", "repo": repo, "branch": "main"},
                }
            ),
            encoding="utf-8",
        )
        if role == "desk":
            scripts = root / "scripts"
            scripts.mkdir()
            (scripts / "release-book.py").write_text("# test\n", encoding="utf-8")
            (scripts / "release-book.sh").write_text("# test\n", encoding="utf-8")
            for template in doctor.PUBLICATION_TEMPLATES:
                path = root / "books" / template
                path.mkdir()
                (path / "README.md").write_text(f"# {template}\n", encoding="utf-8")
        subprocess.run(["git", "init", "-q"], cwd=root, check=True)
        subprocess.run(["git", "branch", "-M", "main"], cwd=root, check=True)

    def make_pair(self, parent: Path) -> tuple[Path, Path]:
        desk = parent / "desk"
        shelf = parent / "shelf"
        desk.mkdir()
        shelf.mkdir()
        self.make_instance(desk, role="desk", repo="desk")
        self.make_instance(shelf, role="shelf", repo="shelf")
        return desk, shelf

    def test_fresh_pair_is_setup_ready(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            desk, shelf = self.make_pair(Path(tmp))
            result = doctor_pair.inspect_pair(desk, shelf)
            self.assertTrue(result["setupReady"])
            self.assertEqual(result["pair"]["summary"]["error"], 0)

    def test_shared_ui_drift_blocks_setup(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            desk, shelf = self.make_pair(Path(tmp))
            (shelf / "reader" / "index.html").write_text("drift\n", encoding="utf-8")
            result = doctor_pair.inspect_pair(desk, shelf)
            self.assertFalse(result["setupReady"])
            codes = {item["code"] for item in result["pair"]["findings"]}
            self.assertIn("shared_ui_drift", codes)

    def test_unpublished_shelf_content_blocks_setup(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            desk, shelf = self.make_pair(Path(tmp))
            publication = shelf / "books" / "private-draft"
            publication.mkdir()
            (publication / "README.md").write_text(
                "# Private Draft\n\n| | |\n|---|---|\n| **Author** | Example |\n| **Status** | Drafting |\n",
                encoding="utf-8",
            )
            result = doctor_pair.inspect_pair(desk, shelf)
            self.assertFalse(result["setupReady"])
            codes = {item["code"] for item in result["pair"]["findings"]}
            self.assertIn("shelf_unpublished_publication", codes)
            self.assertIn("shelf_publication_not_cataloged", codes)


if __name__ == "__main__":
    unittest.main()
