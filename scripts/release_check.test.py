from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

import release_check


class ReleaseCheckTests(unittest.TestCase):
    def make_root(self) -> tuple[tempfile.TemporaryDirectory[str], Path]:
        temp = tempfile.TemporaryDirectory()
        root = Path(temp.name)
        publication = root / "books" / "example"
        publication.mkdir(parents=True)
        (publication / "README.md").write_text("# Example\n", encoding="utf-8")
        (publication / "manuscript.md").write_text("# Chapter\n", encoding="utf-8")
        files = release_check.payload_manifest(publication)
        record = {
            "schemaVersion": 1,
            "kind": "bookself-release",
            "publicationId": "example",
            "sourceCommit": "a" * 40,
            "payload": {
                "algorithm": "sha256",
                "digest": release_check.payload_digest(files),
                "fileCount": len(files),
                "files": files,
                "excludedFiles": ["README.md", "release.json"],
            },
            "tool": {"name": "scripts/release-book.py", "version": 1},
        }
        (publication / "release.json").write_text(json.dumps(record), encoding="utf-8")
        return temp, root

    def test_matching_release_is_healthy(self) -> None:
        temp, root = self.make_root()
        self.addCleanup(temp.cleanup)
        result = release_check.inspect_release(root, "example")
        self.assertTrue(result["healthy"], result)
        self.assertEqual(result["metrics"]["fileCount"], 1)

    def test_changed_payload_is_rejected(self) -> None:
        temp, root = self.make_root()
        self.addCleanup(temp.cleanup)
        (root / "books" / "example" / "manuscript.md").write_text("# Changed\n", encoding="utf-8")
        result = release_check.inspect_release(root, "example")
        self.assertFalse(result["healthy"])
        codes = {item["code"] for item in result["findings"]}
        self.assertIn("release_payload_digest_mismatch", codes)
        self.assertIn("release_file_manifest_mismatch", codes)

    def test_schema_required_tool_and_exclusions_are_checked(self) -> None:
        temp, root = self.make_root()
        self.addCleanup(temp.cleanup)
        record_path = root / "books" / "example" / "release.json"
        record = json.loads(record_path.read_text(encoding="utf-8"))
        record.pop("tool")
        record["payload"].pop("excludedFiles")
        record_path.write_text(json.dumps(record), encoding="utf-8")
        result = release_check.inspect_release(root, "example")
        codes = {item["code"] for item in result["findings"]}
        self.assertIn("release_field_missing", codes)
        self.assertIn("release_exclusions_invalid", codes)

    def test_missing_record_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            (root / "books" / "example").mkdir(parents=True)
            result = release_check.inspect_release(root, "example")
            self.assertIn("missing_release_provenance", {item["code"] for item in result["findings"]})


if __name__ == "__main__":
    unittest.main()
