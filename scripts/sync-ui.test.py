#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
import json
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

spec = importlib.util.spec_from_file_location("bookself_sync_ui", SCRIPT_DIR / "sync-ui.py")
assert spec and spec.loader
sync_ui = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync_ui)


class DeskSafeSyncTests(unittest.TestCase):
    def make_source(self, root: Path) -> None:
        reader = root / "reader"
        (reader / "js").mkdir(parents=True)
        (reader / "css").mkdir(parents=True)
        (reader / "vendor").mkdir(parents=True)
        (root / "desk").mkdir()
        (reader / "js" / "app.js").write_text("export const core = true;\n", encoding="utf-8")
        (reader / "js" / "reading-surface.js").write_text("export const surface = true;\n", encoding="utf-8")
        (reader / "js" / "spread-state.js").write_text("export const spread = true;\n", encoding="utf-8")
        (reader / "css" / "navigation.css").write_text(".pages-wrapper{}\n", encoding="utf-8")
        (reader / "vendor" / "marked.min.js").write_text("// marked\n", encoding="utf-8")
        (reader / "sw.js").write_text(
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

    def make_desk(self, root: Path) -> None:
        reader = root / "reader"
        (reader / "js").mkdir(parents=True)
        (reader / "css").mkdir(parents=True)
        (root / "imprint.json").write_text(
            json.dumps({"role": "desk", "name": "Test Desk", "shortName": "Desk"}),
            encoding="utf-8",
        )
        (reader / "manifest.webmanifest").write_text("{}\n", encoding="utf-8")
        (reader / "index.html").write_text(
            "<!doctype html><html><head><title>Desk</title>"
            '<link rel="stylesheet" href="https://svyable.github.io/bookself/reader/css/navigation.css?v=old">'
            "</head><body>"
            '<script type="module" src="https://svyable.github.io/bookself/reader/js/navigation.js?v=old"></script>'
            "</body></html>\n",
            encoding="utf-8",
        )
        (reader / "js" / "app-loader.js").write_text(
            "const canonicalAppUrl = 'https://svyable.github.io/bookself/reader/js/app.js?v=old';\n"
            "const canonicalReadingSurfaceUrl = new URL('./reading-surface.js', canonicalAppUrl).href;\n"
            "const canonicalNavigationCssUrl = 'https://svyable.github.io/bookself/reader/css/navigation.css?v=old';\n",
            encoding="utf-8",
        )
        (reader / "js" / "desk-only.js").write_text("export const deskOnly = true;\n", encoding="utf-8")
        (reader / "js" / "old.js").write_text("export const stale = true;\n", encoding="utf-8")
        (reader / ".bookself-runtime-files").write_text("js/old.js\nsw.js\n", encoding="utf-8")

    def test_desk_safe_sync_localizes_runtime_and_preserves_desk_files(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            base = Path(tmp)
            source = base / "bookself"
            desk = base / "desk"
            source.mkdir()
            desk.mkdir()
            self.make_source(source)
            self.make_desk(desk)

            sync_ui.sync_desk_safe(source, desk)

            reader = desk / "reader"
            self.assertEqual((reader / "js" / "app.js").read_text(encoding="utf-8"), "export const core = true;\n")
            self.assertTrue((reader / "js" / "reading-surface.js").is_file())
            self.assertTrue((reader / "js" / "spread-state.js").is_file())
            self.assertTrue((reader / "js" / "desk-only.js").is_file())
            self.assertFalse((reader / "js" / "old.js").exists())

            index = (reader / "index.html").read_text(encoding="utf-8")
            self.assertNotIn(sync_ui.BOOKSELF_READER_PREFIX, index)
            self.assertIn('href="css/navigation.css?v=old"', index)
            self.assertIn('src="js/navigation.js?v=old"', index)

            loader = (reader / "js" / "app-loader.js").read_text(encoding="utf-8")
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

    def test_desk_safe_rejects_wrong_role(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            base = Path(tmp)
            source = base / "bookself"
            shelf = base / "shelf"
            source.mkdir()
            shelf.mkdir()
            self.make_source(source)
            self.make_desk(shelf)
            imprint = json.loads((shelf / "imprint.json").read_text(encoding="utf-8"))
            imprint["role"] = "shelf"
            (shelf / "imprint.json").write_text(json.dumps(imprint), encoding="utf-8")

            with self.assertRaises(SystemExit):
                sync_ui.sync_desk_safe(source, shelf)

    def test_previous_runtime_manifest_cannot_escape_reader(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            desk = Path(tmp)
            reader = desk / "reader"
            reader.mkdir(parents=True)
            (reader / ".bookself-runtime-files").write_text("../outside.txt\n", encoding="utf-8")
            with self.assertRaises(SystemExit):
                sync_ui.remove_previous_desk_runtime(desk)


if __name__ == "__main__":
    unittest.main()
