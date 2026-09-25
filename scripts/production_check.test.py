from __future__ import annotations

import importlib.util
import json
from pathlib import Path
import shutil
import sys
import tempfile
import unittest

MODULE_PATH = Path(__file__).with_name("production_check.py")
SPEC = importlib.util.spec_from_file_location("production_check", MODULE_PATH)
assert SPEC and SPEC.loader
production_check = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = production_check
SPEC.loader.exec_module(production_check)

REPO_ROOT = Path(__file__).resolve().parents[1]


class ProductionCheckTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        (self.root / "publishing").mkdir()
        shutil.copy2(REPO_ROOT / "publishing" / "edition-presets.json", self.root / "publishing" / "edition-presets.json")
        self.slug = "quiet-stars"
        self.publication = self.root / "books" / self.slug
        (self.publication / "production").mkdir(parents=True)
        (self.publication / "media").mkdir()
        self.manifest = {
            "schemaVersion": 1,
            "publicationId": self.slug,
            "editionId": "paperback-letter",
            "kind": "activity/coloring",
            "status": "ready-for-production",
            "target": {
                "platform": "amazon-kdp",
                "product": "paperback",
                "profileReviewed": "2026-09-24",
                "profileSource": "https://kdp.amazon.com/en_US/help/topic/G201857950",
            },
            "format": {
                "medium": "print/paperback",
                "trim": {"width": 8.5, "height": 11, "units": "in"},
                "interior": {"ink": "black-white", "paper": "white"},
                "pageCount": 24,
                "bleed": False,
                "spineText": False,
                "margins": {"inside": 0.5, "outside": 0.375},
            },
            "layout": {
                "readingDirection": "ltr",
                "sceneTypes": ["coloring"],
                "sceneSide": "right",
                "sceneParity": "odd",
                "blankReverse": True,
                "blankReversePolicy": "intentional-marker-bleed",
            },
            "requires": {
                "pageMap": True,
                "scenePlan": True,
                "assetInventory": True,
                "qaChecklist": True,
            },
            "canonicalPaths": {
                "edition": "editions/paperback-letter.json",
                "pageMap": "production/page-map.json",
                "scenePlan": "production/scene-plan.json",
                "assetInventory": "production/asset-inventory.json",
                "qaChecklist": "production/qa-checklist.md",
                "printArtSpec": "production/print-art-spec.md",
            },
            "qualityGates": {
                "physicalProofRequired": True,
                "physicalProofStatus": "approved",
                "intentionalBlankPagesReviewed": True,
                "minimumEffectiveImagePpi": 300,
                "minimumLineWeightPt": 0.75,
            },
        }
        pages = []
        for page in range(1, 25):
            if page == 5:
                page_type = "coloring"
                content = "Scene 1 — The quiet stars"
            elif page == 6:
                page_type = "reverse"
                content = "Mostly blank reverse"
            else:
                page_type = "front-matter" if page < 5 else "activity"
                content = f"Page {page}"
            pages.append({
                "page": page,
                "side": "right" if page % 2 else "left",
                "type": page_type,
                "content": content,
                **({"sceneId": "scene-01"} if page == 5 else {}),
            })
        self.write_json("production/page-map.json", {
            "schemaVersion": 1,
            "publicationId": self.slug,
            "pageCount": 24,
            "trim": {"width": 8.5, "height": 11, "units": "in"},
            "bleed": False,
            "pages": pages,
        })
        self.write_json("production/scene-plan.json", {
            "schemaVersion": 1,
            "publicationId": self.slug,
            "status": "approved",
            "scenes": [{
                "id": "scene-01",
                "page": 5,
                "title": "The quiet stars",
                "brief": "A child follows a trail of stars.",
                "composition": "Large open shapes with a clear focal path.",
                "artStatus": "print",
                "approval": "approved",
                "assetIds": ["scene-01-art"],
            }],
        })
        (self.publication / "media" / "scene-01.png").write_bytes(
            b"\x89PNG\r\n\x1a\n"
            + b"\x00\x00\x00\rIHDR"
            + bytes.fromhex("000009f600000ce4")
            + b"\x08\x06\x00\x00\x00"
        )
        self.write_json("editions/paperback-letter.json", {
            "schemaVersion": 1,
            "id": "paperback-letter",
            "medium": "print",
            "target": "amazon-kdp",
            "trim": {"width": 8.5, "height": 11, "units": "in"},
            "interior": {"ink": "black-white", "paper": "white", "bleed": False, "pageCount": None},
        })
        self.write_json("production/asset-inventory.json", {
            "schemaVersion": 1,
            "publicationId": self.slug,
            "status": "approved",
            "assets": [{
                "id": "scene-01-art",
                "originalFilename": "scene-01.png",
                "repositoryPath": "media/scene-01.png",
                "dimensionsPx": [2550, 3300],
                "placement": {"width": 8.5, "height": 11, "units": "in"},
                "classification": "print",
                "binaryState": "imported",
                "approval": "approved",
                "sceneIds": ["scene-01"],
                "provenance": {
                    "source": "author workspace",
                    "creator": "Sven Hardy Benson",
                    "rights": "owned by the rightsholder",
                },
            }],
        })
        (self.publication / "production" / "qa-checklist.md").write_text(
            "- [x] Interior page count checked\n- [x] Physical proof approved\n", encoding="utf-8"
        )
        (self.publication / "production" / "print-art-spec.md").write_text(
            "# Print-art specification\n\nRecord actual dimensions and approval.\n", encoding="utf-8"
        )
        self.write_json("production/manifest.json", self.manifest)

    def tearDown(self) -> None:
        self.temp.cleanup()

    def write_json(self, relative: str, value: object) -> None:
        path = self.publication / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(value, indent=2) + "\n", encoding="utf-8")

    def codes(self) -> set[str]:
        return {item["code"] for item in production_check.inspect_publication(self.root, self.slug)["findings"]}

    def test_kind_and_status_names_are_extensible(self) -> None:
        self.manifest["kind"] = "studio/experimental-print"
        self.manifest["status"] = "house/qa"
        self.write_json("production/manifest.json", self.manifest)
        result = production_check.inspect_publication(self.root, self.slug)
        codes = {item["code"] for item in result["findings"]}
        self.assertNotIn("invalid_production_kind", codes)
        self.assertNotIn("invalid_production_status", codes)
        self.assertEqual(result["productionStatus"], "in-progress")

    def test_valid_coloring_contract_is_ready(self) -> None:
        result = production_check.inspect_publication(self.root, self.slug)
        self.assertTrue(result["healthy"], result)
        self.assertEqual(result["productionStatus"], "ready", result)
        self.assertEqual(result["metrics"]["pageCount"], 24)
        self.assertEqual(result["metrics"]["sceneCount"], 1)
        self.assertEqual(result["metrics"]["printAssetCount"], 1)

    def test_millimeter_target_contract_is_normalized_for_kdp_checks(self) -> None:
        self.manifest["format"]["trim"] = {"width": 215.9, "height": 279.4, "units": "mm"}
        self.manifest["format"]["margins"] = {"inside": 12.7, "outside": 9.525}
        self.write_json("production/manifest.json", self.manifest)
        page_map = json.loads((self.publication / "production" / "page-map.json").read_text(encoding="utf-8"))
        page_map["trim"] = self.manifest["format"]["trim"]
        self.write_json("production/page-map.json", page_map)
        edition = json.loads((self.publication / "editions" / "paperback-letter.json").read_text(encoding="utf-8"))
        edition["trim"] = self.manifest["format"]["trim"]
        self.write_json("editions/paperback-letter.json", edition)
        inventory = json.loads((self.publication / "production" / "asset-inventory.json").read_text(encoding="utf-8"))
        inventory["assets"][0]["placement"] = {"width": 215.9, "height": 279.4, "units": "mm"}
        self.write_json("production/asset-inventory.json", inventory)
        result = production_check.inspect_publication(self.root, self.slug)
        self.assertTrue(result["healthy"], result)
        self.assertNotIn("kdp_trim_out_of_range", {item["code"] for item in result["findings"]})

    def test_equivalent_trim_units_are_accepted(self) -> None:
        page_map = json.loads((self.publication / "production" / "page-map.json").read_text(encoding="utf-8"))
        page_map["trim"] = {"width": 215.9, "height": 279.4, "units": "mm"}
        self.write_json("production/page-map.json", page_map)
        self.assertNotIn("page_map_trim_mismatch", self.codes())

    def test_page_map_mismatch_is_blocking(self) -> None:
        page_map = json.loads((self.publication / "production" / "page-map.json").read_text(encoding="utf-8"))
        page_map["pages"][3]["page"] = 99
        self.write_json("production/page-map.json", page_map)
        self.assertIn("page_map_not_contiguous", self.codes())

    def test_missing_print_binary_is_blocking(self) -> None:
        (self.publication / "media" / "scene-01.png").unlink()
        self.assertIn("imported_asset_missing", self.codes())

    def test_low_resolution_print_asset_is_blocking(self) -> None:
        (self.publication / "media" / "scene-01.png").write_bytes(
            b"\x89PNG\r\n\x1a\n"
            + b"\x00\x00\x00\rIHDR"
            + bytes.fromhex("0000045000000591")
            + b"\x08\x06\x00\x00\x00"
        )
        inventory = json.loads((self.publication / "production" / "asset-inventory.json").read_text(encoding="utf-8"))
        inventory["assets"][0]["dimensionsPx"] = [1104, 1425]
        self.write_json("production/asset-inventory.json", inventory)
        self.assertIn("asset_effective_ppi_low", self.codes())

    def test_declared_dimensions_cannot_override_binary_dimensions(self) -> None:
        inventory = json.loads((self.publication / "production" / "asset-inventory.json").read_text(encoding="utf-8"))
        inventory["assets"][0]["dimensionsPx"] = [1104, 1425]
        self.write_json("production/asset-inventory.json", inventory)
        self.assertIn("asset_dimensions_mismatch", self.codes())

    def test_linked_edition_can_supply_format_contract(self) -> None:
        self.manifest.pop("format")
        self.write_json("production/manifest.json", self.manifest)
        result = production_check.inspect_publication(self.root, self.slug)
        self.assertTrue(result["healthy"], result)
        self.assertEqual(result["metrics"]["editionId"], "paperback-letter")
        self.assertEqual(result["metrics"]["geometry"]["trim"], {"width": 8.5, "height": 11.0, "units": "in"})

    def test_unknown_asset_classification_cannot_silently_pass_as_print(self) -> None:
        inventory = json.loads((self.publication / "production" / "asset-inventory.json").read_text(encoding="utf-8"))
        inventory["assets"][0]["classification"] = "prnt"
        self.write_json("production/asset-inventory.json", inventory)
        codes = self.codes()
        self.assertIn("unknown_asset_classification", codes)
        result = production_check.inspect_publication(self.root, self.slug)
        self.assertEqual(result["productionStatus"], "in-progress")

    def test_print_asset_requires_explicit_placement(self) -> None:
        inventory = json.loads((self.publication / "production" / "asset-inventory.json").read_text(encoding="utf-8"))
        inventory["assets"][0].pop("placement")
        self.write_json("production/asset-inventory.json", inventory)
        self.assertIn("print_asset_placement_missing", self.codes())

    def test_linked_artifact_cannot_be_a_directory(self) -> None:
        self.manifest["canonicalPaths"]["assetInventory"] = "media"
        self.write_json("production/manifest.json", self.manifest)
        self.assertIn("linked_path_not_file", self.codes())

    def test_invalid_quality_value_reports_error_without_crashing(self) -> None:
        self.manifest["qualityGates"]["minimumEffectiveImagePpi"] = "not-a-number"
        self.write_json("production/manifest.json", self.manifest)
        result = production_check.inspect_publication(self.root, self.slug)
        self.assertIn("invalid_ppi_gate", {item["code"] for item in result["findings"]})

    def test_production_path_cannot_escape_publication(self) -> None:
        self.manifest["canonicalPaths"]["assetInventory"] = "../outside.json"
        self.write_json("production/manifest.json", self.manifest)
        self.assertIn("unsafe_production_path", self.codes())

    def test_cli_output_is_machine_readable(self) -> None:
        payload = production_check.main([self.slug, "--root", str(self.root), "--json"])
        self.assertEqual(payload, 0)


if __name__ == "__main__":
    unittest.main()
