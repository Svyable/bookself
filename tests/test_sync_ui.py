from __future__ import annotations

import importlib.util
import json
import sys
import tempfile
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
SCRIPTS = REPO / "scripts"
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

SPEC = importlib.util.spec_from_file_location("bookself_sync_ui", SCRIPTS / "sync-ui.py")
assert SPEC and SPEC.loader
sync_ui = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(sync_ui)


class ShelfSafeSyncTests(unittest.TestCase):
    def make_fixture(self, base: Path) -> tuple[Path, Path]:
        bookself = base / "bookself"
        shelf = base / "shelf"

        (bookself / "reader" / "js").mkdir(parents=True)
        (bookself / "reader" / "js" / "app.js").write_text("// upstream core\n", encoding="utf-8")
        (bookself / "reader" / "js" / "shared.js").write_text("// shared module\n", encoding="utf-8")
        (bookself / "reader" / "index.html").write_text("<html>bookself</html>\n", encoding="utf-8")
        (bookself / "desk").mkdir()
        (bookself / "desk" / "index.html").write_text("bookself desk\n", encoding="utf-8")

        (shelf / "reader" / "js").mkdir(parents=True)
        (shelf / "reader" / "css").mkdir(parents=True)
        (shelf / "books" / "released-book").mkdir(parents=True)
        imprint = {
            "role": "shelf",
            "name": "Sven Hardy Benson’s Shelf",
            "shortName": "Shelf",
            "description": "Released books.",
            "homeLabel": "Shelf",
            "readerStyles": ["reader/css/instance.css?v=1"],
            "github": {"owner": "Svyable", "repo": "shelf"},
        }
        (shelf / "imprint.json").write_text(json.dumps(imprint), encoding="utf-8")
        (shelf / "catalog.json").write_text('{"version":1,"books":["released-book"]}\n', encoding="utf-8")
        (shelf / "README.md").write_text("# Released Shelf\n", encoding="utf-8")
        (shelf / "books" / "released-book" / "README.md").write_text("# Released Book\n", encoding="utf-8")
        (shelf / "reader" / "index.html").write_text("<html>shelf shell</html>\n", encoding="utf-8")
        (shelf / "reader" / "js" / "app.js").write_text("// shelf adapter\n", encoding="utf-8")
        (shelf / "reader" / "js" / "shelf-custom.js").write_text("// shelf custom\n", encoding="utf-8")
        (shelf / "reader" / "css" / "instance.css").write_text("/* instance */\n", encoding="utf-8")
        (shelf / "reader" / "sw.js").write_text("// shelf worker\n", encoding="utf-8")
        return bookself, shelf

    def test_safe_sync_preserves_publication_and_instance_owned_state(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            bookself, shelf = self.make_fixture(Path(temp))
            protected = {
                path: (shelf / path).read_bytes()
                for path in (
                    Path("catalog.json"),
                    Path("README.md"),
                    Path("books/released-book/README.md"),
                    Path("imprint.json"),
                    Path("reader/index.html"),
                    Path("reader/js/app.js"),
                    Path("reader/js/shelf-custom.js"),
                    Path("reader/css/instance.css"),
                    Path("reader/sw.js"),
                )
            }

            sync_ui.sync_one(bookself, shelf, shelf_safe=True)

            for path, before in protected.items():
                self.assertEqual((shelf / path).read_bytes(), before, path.as_posix())
            self.assertEqual((shelf / "reader/js/app-core.js").read_text(encoding="utf-8"), "// upstream core\n")
            self.assertEqual((shelf / "reader/js/shared.js").read_text(encoding="utf-8"), "// shared module\n")
            self.assertFalse((shelf / "desk").exists(), "Shelf-safe sync must not copy Bookself Desk")

    def test_unsafe_sync_refuses_shelf_before_mutation(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            bookself, shelf = self.make_fixture(Path(temp))
            adapter_before = (shelf / "reader/js/app.js").read_bytes()
            catalog_before = (shelf / "catalog.json").read_bytes()

            with self.assertRaisesRegex(SystemExit, "refusing whole-tree sync into Shelf"):
                sync_ui.sync_one(bookself, shelf, shelf_safe=False)

            self.assertEqual((shelf / "reader/js/app.js").read_bytes(), adapter_before)
            self.assertEqual((shelf / "catalog.json").read_bytes(), catalog_before)
            self.assertFalse((shelf / "desk").exists())

    def test_shelf_safe_flag_rejects_non_shelf_destination(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            bookself, shelf = self.make_fixture(Path(temp))
            imprint = json.loads((shelf / "imprint.json").read_text(encoding="utf-8"))
            imprint["role"] = "desk"
            (shelf / "imprint.json").write_text(json.dumps(imprint), encoding="utf-8")

            with self.assertRaisesRegex(SystemExit, "requires imprint role=shelf"):
                sync_ui.sync_one(bookself, shelf, shelf_safe=True)


if __name__ == "__main__":
    unittest.main()
