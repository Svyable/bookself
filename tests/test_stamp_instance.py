from __future__ import annotations

import importlib.util
import sys
import tempfile
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
SCRIPTS = REPO / "scripts"
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

SPEC = importlib.util.spec_from_file_location("bookself_stamp_instance", SCRIPTS / "stamp-instance.py")
assert SPEC and SPEC.loader
stamp = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(stamp)


class StampShelfBoundaryTests(unittest.TestCase):
    def make_platform(self, root: Path) -> Path:
        platform = root / "bookself"
        (platform / "reader" / "js").mkdir(parents=True)
        (platform / "reader" / "js" / "app.js").write_text("// upstream reader\n", encoding="utf-8")
        (platform / "reader" / "index.html").write_text("reader\n", encoding="utf-8")
        (platform / "desk").mkdir()
        (platform / "desk" / "index.html").write_text("authoring app\n", encoding="utf-8")
        (platform / "books" / "_TEMPLATE").mkdir(parents=True)
        (platform / "books" / "_TEMPLATE" / "README.md").write_text("template\n", encoding="utf-8")
        (platform / "books" / "example").mkdir()
        (platform / "books" / "example" / "README.md").write_text("example\n", encoding="utf-8")
        (platform / ".github" / "workflows").mkdir(parents=True)
        (platform / ".github" / "workflows" / "platform.yml").write_text("name: platform\n", encoding="utf-8")
        (platform / "README.md").write_text("platform\n", encoding="utf-8")
        (platform / "catalog.json").write_text('{"version":1,"books":[]}\n', encoding="utf-8")
        (platform / "imprint.json").write_text("{}\n", encoding="utf-8")
        return platform

    def test_shelf_copy_omits_authoring_app_and_publications(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            platform = self.make_platform(root)
            shelf = root / "shelf"
            stamp.copy_platform(platform, shelf, "shelf")

            self.assertTrue((shelf / "reader/js/app.js").is_file())
            self.assertFalse((shelf / "desk").exists())
            self.assertFalse((shelf / "books/_TEMPLATE").exists())
            self.assertFalse((shelf / "books/example").exists())
            self.assertFalse((shelf / ".github/workflows").exists())

    def test_shelf_reader_boundary_materializes_local_core(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            platform = self.make_platform(root)
            shelf = root / "shelf"
            stamp.copy_platform(platform, shelf, "shelf")
            stamp.install_shelf_reader_boundary(shelf)

            self.assertEqual(
                (shelf / "reader/js/app-core.js").read_text(encoding="utf-8"),
                "// upstream reader\n",
            )
            adapter = (shelf / "reader/js/app.js").read_text(encoding="utf-8")
            self.assertIn("import './app-core.js';", adapter)
            self.assertNotIn("svyable.github.io/bookself", adapter)
            self.assertFalse((shelf / "desk").exists())

    def test_desk_copy_retains_authoring_app_and_templates(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            platform = self.make_platform(root)
            desk = root / "desk-instance"
            stamp.copy_platform(platform, desk, "desk")

            self.assertTrue((desk / "desk/index.html").is_file())
            self.assertTrue((desk / "books/_TEMPLATE/README.md").is_file())
            self.assertFalse((desk / "books/example").exists())


if __name__ == "__main__":
    unittest.main()
