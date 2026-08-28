from __future__ import annotations

import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "scripts" / "bootstrap-workspace.py"
TEMPLATES = {
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


class BootstrapWorkspaceTests(unittest.TestCase):
    def run_bootstrap(self, workspace: Path, *extra: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [sys.executable, str(SCRIPT), str(workspace), "--owner", "example", *extra],
            check=True,
            text=True,
            capture_output=True,
        )

    def test_json_bootstrap_creates_role_separated_instances(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            workspace = Path(tmp) / "book-workspace"
            result = self.run_bootstrap(workspace, "--no-git", "--json")
            data = json.loads(result.stdout)

            desk = workspace / "desk"
            shelf = workspace / "shelf"
            self.assertEqual(data["desk"]["role"], "desk")
            self.assertEqual(data["shelf"]["role"], "shelf")
            self.assertFalse(data["desk"]["gitInitialized"])

            desk_imprint = json.loads((desk / "imprint.json").read_text(encoding="utf-8"))
            shelf_imprint = json.loads((shelf / "imprint.json").read_text(encoding="utf-8"))
            self.assertEqual(desk_imprint["role"], "desk")
            self.assertEqual(shelf_imprint["role"], "shelf")
            self.assertEqual(desk_imprint["github"]["owner"], "example")

            desk_templates = {path.name for path in (desk / "books").iterdir() if path.is_dir()}
            self.assertEqual(desk_templates, TEMPLATES)
            self.assertEqual(list((shelf / "books").iterdir()), [])

            self.assertTrue((desk / "reader").is_dir())
            self.assertTrue((desk / "desk").is_dir())
            self.assertTrue((shelf / "reader").is_dir())
            self.assertTrue((shelf / "desk").is_dir())
            self.assertNotEqual((desk / "README.md").read_text(), (shelf / "README.md").read_text())

    @unittest.skipUnless(shutil.which("git"), "git is not installed")
    def test_default_bootstrap_initializes_main_git_repositories(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            workspace = Path(tmp) / "book-workspace"
            result = self.run_bootstrap(workspace, "--json")
            data = json.loads(result.stdout)
            for role in ("desk", "shelf"):
                path = workspace / role
                self.assertTrue((path / ".git").is_dir())
                branch = subprocess.run(
                    ["git", "branch", "--show-current"],
                    cwd=path,
                    check=True,
                    text=True,
                    capture_output=True,
                ).stdout.strip()
                self.assertEqual(branch, "main")
                self.assertTrue(data[role]["gitInitialized"])

    def test_refuses_nonempty_workspace(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            workspace = Path(tmp) / "book-workspace"
            workspace.mkdir()
            (workspace / "keep.txt").write_text("do not overwrite", encoding="utf-8")
            result = subprocess.run(
                [sys.executable, str(SCRIPT), str(workspace), "--no-git"],
                text=True,
                capture_output=True,
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("workspace is not empty", result.stderr)
            self.assertEqual((workspace / "keep.txt").read_text(encoding="utf-8"), "do not overwrite")


if __name__ == "__main__":
    unittest.main()
