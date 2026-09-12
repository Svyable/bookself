from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
SCRIPTS = REPO / "scripts"
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

import doctor  # noqa: E402
import doctor_pair  # noqa: E402


class DoctorRoleBoundaryTests(unittest.TestCase):
    def init_git(self, root: Path) -> None:
        subprocess.run(["git", "init", "-q", str(root)], check=True)

    def make_instance(self, root: Path, role: str, repo: str) -> None:
        root.mkdir(parents=True)
        (root / "reader" / "js").mkdir(parents=True)
        (root / "reader" / "index.html").write_text("reader\n", encoding="utf-8")
        (root / "reader" / "js" / "app.js").write_text("// local adapter\n", encoding="utf-8")
        (root / "books").mkdir()
        (root / "README.md").write_text(
            f"# {role}\n\n## The books\n\n| Book | Status |\n|---|---|\n",
            encoding="utf-8",
        )
        (root / "imprint.json").write_text(
            json.dumps({
                "role": role,
                "storagePrefix": f"{role}-{repo}",
                "github": {"owner": "Example", "repo": repo},
            }),
            encoding="utf-8",
        )

        if role == "desk":
            (root / "desk").mkdir()
            (root / "desk" / "index.html").write_text("desk app\n", encoding="utf-8")
            (root / "scripts").mkdir()
            (root / "scripts" / "release-book.py").write_text("# release\n", encoding="utf-8")
            (root / "scripts" / "release-book.sh").write_text("# release\n", encoding="utf-8")
            for template in doctor.PUBLICATION_TEMPLATES:
                (root / "books" / template).mkdir()
                (root / "books" / template / "README.md").write_text("template\n", encoding="utf-8")
        elif role == "shelf":
            (root / "reader" / "js" / "app-core.js").write_text("// local core\n", encoding="utf-8")

        self.init_git(root)

    def test_release_only_shelf_is_healthy(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            base = Path(temp)
            desk = base / "desk"
            shelf = base / "shelf"
            self.make_instance(desk, "desk", "desk")
            self.make_instance(shelf, "shelf", "shelf")

            shelf_findings = doctor.inspect_root(shelf)
            self.assertFalse([item for item in shelf_findings if item.level == "error"])
            self.assertIn("shelf_no_desk", {item.code for item in shelf_findings})
            self.assertIn("shelf_reader_boundary", {item.code for item in shelf_findings})

            result = doctor_pair.inspect_pair(desk, shelf)
            self.assertTrue(result["setupReady"], result)
            pair_codes = {item["code"] for item in result["pair"]["findings"]}
            self.assertIn("shelf_release_only", pair_codes)
            self.assertIn("shelf_local_core", pair_codes)

    def test_shelf_authoring_tree_is_an_error(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            base = Path(temp)
            desk = base / "desk"
            shelf = base / "shelf"
            self.make_instance(desk, "desk", "desk")
            self.make_instance(shelf, "shelf", "shelf")
            (shelf / "desk").mkdir()
            (shelf / "desk" / "index.html").write_text("bad authoring copy\n", encoding="utf-8")

            shelf_findings = doctor.inspect_root(shelf)
            self.assertIn("shelf_desk_present", {item.code for item in shelf_findings if item.level == "error"})
            result = doctor_pair.inspect_pair(desk, shelf)
            self.assertFalse(result["setupReady"])
            self.assertIn(
                "shelf_authoring_present",
                {item["code"] for item in result["pair"]["findings"] if item["level"] == "error"},
            )


if __name__ == "__main__":
    unittest.main()
