from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

import publication_state


class PublicationStateTests(unittest.TestCase):
    def make_root(self, role: str = "desk") -> tuple[tempfile.TemporaryDirectory[str], Path]:
        temp = tempfile.TemporaryDirectory()
        root = Path(temp.name)
        (root / "books" / "example" / "manuscript").mkdir(parents=True)
        (root / "books" / "example" / "research").mkdir()
        (root / "books" / "example" / "manuscript" / "one.md").write_text(
            "# One\n", encoding="utf-8"
        )
        (root / "books" / "example" / "research" / "README.md").write_text(
            "# Research\n", encoding="utf-8"
        )
        (root / "books" / "example" / "README.md").write_text(
            "# Example\n\n"
            "| | |\n|---|---|\n"
            "| **Authors** | Ada Example |\n"
            "| **Status** | Drafting |\n"
            "| **Format** | Book |\n"
            "| **Edition** | 1 |\n"
            "| **Language** | en |\n\n"
            "## Contents\n\n"
            "- [x] [One](manuscript/one.md)\n",
            encoding="utf-8",
        )
        (root / "catalog.json").write_text(
            json.dumps({"version": 1, "books": ["example"]}), encoding="utf-8"
        )
        (root / "imprint.json").write_text(
            json.dumps({"role": role}), encoding="utf-8"
        )
        return temp, root

    def test_slug_is_stable_instance_publication_id(self):
        temp, root = self.make_root()
        self.addCleanup(temp.cleanup)
        state = publication_state.publication_state(root, "example")
        self.assertEqual(state["publicationId"], "example")
        self.assertEqual(state["identityScope"], "bookself-instance")
        self.assertEqual(state["publicationStatus"], "Drafting")
        self.assertTrue(state["checks"]["structurallyReady"])

    def test_missing_manuscript_file_blocks_structural_readiness(self):
        temp, root = self.make_root()
        self.addCleanup(temp.cleanup)
        (root / "books" / "example" / "manuscript" / "one.md").unlink()
        state = publication_state.publication_state(root, "example")
        self.assertFalse(state["checks"]["structurallyReady"])
        self.assertTrue(
            any(
                item["code"] == "manuscript_files_missing"
                for item in state["checks"]["errors"]
            )
        )

    def test_published_shelf_work_must_be_cataloged(self):
        temp, root = self.make_root(role="shelf")
        self.addCleanup(temp.cleanup)
        hub = root / "books" / "example" / "README.md"
        hub.write_text(
            hub.read_text(encoding="utf-8").replace("Drafting", "Published"),
            encoding="utf-8",
        )
        (root / "catalog.json").write_text(
            json.dumps({"version": 1, "books": []}), encoding="utf-8"
        )
        state = publication_state.publication_state(root, "example")
        self.assertTrue(
            any(
                item["code"] == "published_not_cataloged"
                for item in state["checks"]["errors"]
            )
        )


if __name__ == "__main__":
    unittest.main()
