from __future__ import annotations
import importlib.util
import json
import sys
import tempfile
import unittest
from pathlib import Path

MODULE = Path(__file__).with_name("rights-check.py")
spec = importlib.util.spec_from_file_location("rights_check", MODULE)
assert spec and spec.loader
rights_check = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = rights_check
spec.loader.exec_module(rights_check)

class RightsCheckTests(unittest.TestCase):
    def make_book(self, root: Path):
        pub = root / "books" / "example"
        pub.mkdir(parents=True)
        (pub / "README.md").write_text("# Example\n", encoding="utf-8")
        (pub / "RIGHTS.md").write_text("# Rights\n", encoding="utf-8")
        data = {
            "schemaVersion": 1, "policy": "bookself-arr-v1",
            "work": {"title": "Example", "author": "Ada Example"},
            "copyright": {"owner": "Ada Example", "year": 2026, "notice": "© 2026 Ada Example. All Rights Reserved."},
            "license": {"id": "ARR", "label": "All Rights Reserved", "file": "RIGHTS.md"},
            "permissions": {"publicReading": True, "conventionalSearch": True, "reproduction": False, "distribution": False, "derivatives": False, "commercialUse": False, "aiTraining": False, "aiGenerativeUse": False, "aiRetrievalGrounding": False, "aiIndexing": False, "syntheticNarration": False, "syntheticTranslation": False},
            "registration": {"jurisdiction": "US", "status": "not-recorded-in-bookself", "number": None, "effectiveDate": None},
        }
        (pub / "rights.json").write_text(json.dumps(data), encoding="utf-8")
        return pub

    def test_valid_arr_manifest(self):
        with tempfile.TemporaryDirectory() as td:
            self.make_book(Path(td))
            self.assertFalse([f for f in rights_check.inspect(Path(td)) if f.level == "error"])

    def test_open_ai_training_is_rejected(self):
        with tempfile.TemporaryDirectory() as td:
            pub = self.make_book(Path(td))
            data = json.loads((pub / "rights.json").read_text())
            data["permissions"]["aiTraining"] = True
            (pub / "rights.json").write_text(json.dumps(data))
            self.assertTrue(any(f.code == "arr_permission_open" for f in rights_check.inspect(Path(td))))

    def test_registered_requires_evidence_fields(self):
        with tempfile.TemporaryDirectory() as td:
            pub = self.make_book(Path(td))
            data = json.loads((pub / "rights.json").read_text())
            data["registration"] = {"jurisdiction": "US", "status": "registered", "number": None, "effectiveDate": None}
            (pub / "rights.json").write_text(json.dumps(data))
            self.assertTrue(any(f.code == "registration_incomplete" for f in rights_check.inspect(Path(td))))

if __name__ == "__main__":
    unittest.main()
