from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

import changed_publications


class ChangedPublicationsTests(unittest.TestCase):
    def test_classifies_concrete_publications_and_global_paths(self):
        publications, global_paths = changed_publications.classify_paths(
            [
                "books/example/manuscript/ch01.md",
                "books/other/README.md",
                "books/example/media/figure.png",
                "books/_TEMPLATE/README.md",
                "reader/js/app.js",
                "README.md",
            ]
        )
        self.assertEqual(publications, ["example", "other"])
        self.assertEqual(
            global_paths,
            ["README.md", "books/_TEMPLATE/README.md", "reader/js/app.js"],
        )

    def test_build_result_uses_slug_as_publication_id(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            (root / "books" / "example").mkdir(parents=True)
            result = changed_publications.build_result(
                root,
                "base",
                "head",
                paths=["books/example/README.md", "scripts/doctor.py"],
            )
        self.assertEqual(result["publicationCount"], 1)
        self.assertEqual(result["publications"][0]["publicationId"], "example")
        self.assertTrue(result["publications"][0]["present"])
        self.assertTrue(result["globalChange"])
        self.assertEqual(result["globalPaths"], ["scripts/doctor.py"])

    def test_deleted_publication_is_still_reported(self):
        with tempfile.TemporaryDirectory() as td:
            result = changed_publications.build_result(
                Path(td),
                "base",
                "head",
                paths=["books/gone/README.md"],
            )
        self.assertEqual(result["publications"][0]["publicationId"], "gone")
        self.assertFalse(result["publications"][0]["present"])


if __name__ == "__main__":
    unittest.main()
