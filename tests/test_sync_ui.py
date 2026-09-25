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
        for name in ("demo-catalog-contract.test.mjs", "fireside-aesthetic.test.mjs", "offline-shell-contract.test.mjs"):
            (bookself / "reader" / "js" / name).write_text(
                "// Bookself repository-only contract\n", encoding="utf-8"
            )
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
            for name in ("demo-catalog-contract.test.mjs", "fireside-aesthetic.test.mjs"):
                self.assertFalse(
                    (shelf / "reader/js" / name).exists(),
                    f"Shelf-safe sync must not copy Bookself repository-only test: {name}",
                )
            self.assertFalse((shelf / "desk").exists(), "Shelf-safe sync must not copy Bookself Desk")

    def test_unsafe_sync_refuses_shelf_before_mutation(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            bookself, shelf = self.make_fixture(Path(temp))
            adapter_before = (shelf / "reader/js/app.js").read_bytes()
            catalog_before = (shelf / "catalog.json").read_bytes()

            with self.assertRaisesRegex(SystemExit, "refusing whole-tree sync into role=shelf"):
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


class DeskSafeSyncTests(unittest.TestCase):
    def make_fixture(self, base: Path) -> tuple[Path, Path]:
        bookself = base / "bookself"
        desk = base / "desk"
        source_reader = bookself / "reader"
        desk_reader = desk / "reader"

        (source_reader / "js").mkdir(parents=True)
        (source_reader / "css").mkdir(parents=True)
        (source_reader / "vendor").mkdir(parents=True)
        (bookself / "desk").mkdir()
        (bookself / "desk" / "index.html").write_text("bookself desk runtime\n", encoding="utf-8")
        (bookself / "desk" / "private-draft.md").write_text("instance prose\n", encoding="utf-8")
        (source_reader / "js" / "app.js").write_text("export const core = true;\n", encoding="utf-8")
        (source_reader / "js" / "reading-surface.js").write_text("export const surface = true;\n", encoding="utf-8")
        (source_reader / "js" / "spread-state.js").write_text("export const spread = true;\n", encoding="utf-8")
        (source_reader / "css" / "navigation.css").write_text(".pages-wrapper{}\n", encoding="utf-8")
        (source_reader / "vendor" / "marked.min.js").write_text("// marked\n", encoding="utf-8")
        (source_reader / "sw.js").write_text(
            "const CACHE = 'test-shell-v1';\n"
            "const SHELL = [\n"
            "  './',\n"
            "  './index.html',\n"
            "  './manifest.webmanifest',\n"
            "  './css/navigation.css',\n"
            "  './vendor/marked.min.js',\n"
            "  './js/app.js',\n"
            "  './js/reading-surface.js',\n"
            "  './js/spread-state.js',\n"
            "];\n",
            encoding="utf-8",
        )

        (desk_reader / "js").mkdir(parents=True)
        (desk_reader / "css").mkdir(parents=True)
        (desk / "desk").mkdir()
        (desk / "desk" / "private.md").write_text("instance-owned prose\n", encoding="utf-8")
        (desk / "imprint.json").write_text(
            json.dumps({"role": "desk", "name": "Test Desk", "shortName": "Desk"}),
            encoding="utf-8",
        )
        (desk_reader / "manifest.webmanifest").write_text("{}\n", encoding="utf-8")
        (desk_reader / "index.html").write_text(
            "<!doctype html><html><head><title>Desk</title>"
            '<link rel="stylesheet" href="https://svyable.github.io/bookself/reader/css/navigation.css?v=old">'
            "</head><body>"
            '<script type="module" src="https://svyable.github.io/bookself/reader/js/navigation.js?v=old"></script>'
            "</body></html>\n",
            encoding="utf-8",
        )
        (desk_reader / "js" / "app-loader.js").write_text(
            "const canonicalAppUrl = 'https://svyable.github.io/bookself/reader/js/app.js?v=old';\n"
            "const canonicalReadingSurfaceUrl = new URL('./reading-surface.js', canonicalAppUrl).href;\n"
            "const canonicalNavigationCssUrl = 'https://svyable.github.io/bookself/reader/css/navigation.css?v=old';\n",
            encoding="utf-8",
        )
        (desk_reader / "js" / "desk-only.js").write_text("export const deskOnly = true;\n", encoding="utf-8")
        (desk_reader / "js" / "old.js").write_text("export const stale = true;\n", encoding="utf-8")
        (desk_reader / ".bookself-runtime-files").write_text("js/old.js\nsw.js\n", encoding="utf-8")
        return bookself, desk

    def test_safe_sync_localizes_runtime_and_preserves_desk_state(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            bookself, desk = self.make_fixture(Path(temp))

            sync_ui.sync_one(bookself, desk, desk_safe=True)

            reader = desk / "reader"
            self.assertEqual((desk / "desk/index.html").read_text(encoding="utf-8"), "bookself desk runtime\n")
            self.assertTrue((desk / "desk/private.md").is_file())
            self.assertEqual((reader / "js/app.js").read_text(encoding="utf-8"), "export const core = true;\n")
            self.assertTrue((reader / "js/reading-surface.js").is_file())
            self.assertTrue((reader / "js/spread-state.js").is_file())
            self.assertTrue((reader / "js/desk-only.js").is_file())
            self.assertFalse((reader / "js/old.js").exists())

            index = (reader / "index.html").read_text(encoding="utf-8")
            self.assertNotIn(sync_ui.BOOKSELF_READER_PREFIX, index)
            self.assertIn('href="css/navigation.css?v=old"', index)
            self.assertIn('src="js/navigation.js?v=old"', index)

            loader = (reader / "js/app-loader.js").read_text(encoding="utf-8")
            self.assertIn("const canonicalAppUrl = new URL('./app.js', import.meta.url).href;", loader)
            self.assertIn("const canonicalNavigationCssUrl = new URL('../css/navigation.css', import.meta.url).href;", loader)
            self.assertNotIn(sync_ui.BOOKSELF_READER_PREFIX, loader)

            manifest = (reader / ".bookself-runtime-files").read_text(encoding="utf-8").splitlines()
            self.assertIn("js/app.js", manifest)
            self.assertIn("js/reading-surface.js", manifest)
            self.assertIn("css/navigation.css", manifest)
            self.assertEqual(manifest[-1], "sw.js")

            offline = (reader / ".bookself-offline-version").read_text(encoding="utf-8")
            self.assertIn("cache=test-shell-v1", offline)
            self.assertIn("shell_entries=8", offline)

    def test_failed_candidate_leaves_live_reader_untouched(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            bookself, desk = self.make_fixture(Path(temp))
            reader = desk / "reader"
            old_runtime = (reader / "js/old.js").read_bytes()
            loader_before = (reader / "js/app-loader.js").read_bytes()
            (reader / "js/desk-only.js").write_text(
                "export const remote = 'https://svyable.github.io/bookself/reader/js/remote.js';\n",
                encoding="utf-8",
            )

            with self.assertRaisesRegex(SystemExit, "Bookself Pages runtime dependencies"):
                sync_ui.sync_one(bookself, desk, desk_safe=True)

            self.assertEqual((reader / "js/old.js").read_bytes(), old_runtime)
            self.assertEqual((reader / "js/app-loader.js").read_bytes(), loader_before)
            self.assertFalse((reader / "js/app.js").exists())

    def test_unsafe_sync_refuses_desk_before_mutation(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            bookself, desk = self.make_fixture(Path(temp))
            loader_before = (desk / "reader/js/app-loader.js").read_bytes()

            with self.assertRaisesRegex(SystemExit, "refusing whole-tree sync into role=desk"):
                sync_ui.sync_one(bookself, desk)

            self.assertEqual((desk / "reader/js/app-loader.js").read_bytes(), loader_before)
            self.assertFalse((desk / "reader/js/app.js").exists())

    def test_desk_safe_flag_rejects_non_desk_destination(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            bookself, desk = self.make_fixture(Path(temp))
            imprint = json.loads((desk / "imprint.json").read_text(encoding="utf-8"))
            imprint["role"] = "shelf"
            (desk / "imprint.json").write_text(json.dumps(imprint), encoding="utf-8")

            with self.assertRaisesRegex(SystemExit, "requires imprint role=desk"):
                sync_ui.sync_one(bookself, desk, desk_safe=True)

    def test_previous_runtime_manifest_cannot_escape_reader(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            desk = Path(temp)
            reader = desk / "reader"
            reader.mkdir(parents=True)
            (reader / ".bookself-runtime-files").write_text("../outside.txt\n", encoding="utf-8")

            with self.assertRaisesRegex(SystemExit, "unsafe Desk runtime manifest entry"):
                sync_ui.remove_previous_desk_runtime(desk)


if __name__ == "__main__":
    unittest.main()
