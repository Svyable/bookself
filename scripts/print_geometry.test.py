from __future__ import annotations

import json
from pathlib import Path
import tempfile
import unittest

from print_geometry import paperback_geometry, to_inches

ROOT = Path(__file__).resolve().parents[1]


class PrintGeometryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.presets = json.loads((ROOT / "publishing" / "edition-presets.json").read_text(encoding="utf-8"))

    def test_lppa_shaped_geometry_is_derived_from_preset(self) -> None:
        result = paperback_geometry(
            self.presets,
            width=8.5,
            height=11,
            ink="black-white",
            paper="white",
            page_count=42,
        )
        self.assertEqual(result["eligibility"], "eligible")
        self.assertAlmostEqual(result["spineWidthIn"], 0.094584)
        self.assertAlmostEqual(result["coverSizeIn"]["width"], 17.344584)
        self.assertAlmostEqual(result["coverSizeIn"]["height"], 11.25)
        self.assertEqual(result["trimRasterPxAtMinimumPpi"], [2550, 3300])
        self.assertIn("spine text is not supported at this page count", result["reasons"])

    def test_premium_color_uses_its_recorded_profile(self) -> None:
        result = paperback_geometry(
            self.presets,
            width=8.5,
            height=11,
            ink="premium-color",
            paper="white",
            page_count=24,
        )
        self.assertEqual(result["eligibility"], "eligible")
        self.assertAlmostEqual(result["spineWidthIn"], 24 * 0.002347)

    def test_units_are_normalized(self) -> None:
        self.assertAlmostEqual(to_inches(215.9, "mm"), 8.5)
        result = paperback_geometry(
            self.presets,
            width=215.9,
            height=279.4,
            units="mm",
            ink="black-white",
            paper="white",
            page_count=24,
        )
        self.assertEqual(result["eligibility"], "eligible")
        self.assertEqual(result["trim"], {"width": 8.5, "height": 11.0, "units": "in"})

    def test_page_count_limits_are_reported(self) -> None:
        result = paperback_geometry(
            self.presets,
            width=8.5,
            height=11,
            ink="black-white",
            paper="white",
            page_count=23,
        )
        self.assertEqual(result["eligibility"], "ineligible")
        self.assertTrue(any("below" in reason for reason in result["reasons"]))

    def test_unknown_trim_requires_review(self) -> None:
        result = paperback_geometry(
            self.presets,
            width=7.25,
            height=9.5,
            ink="black-white",
            paper="white",
            page_count=24,
        )
        self.assertEqual(result["eligibility"], "review")
        self.assertTrue(any("trim" in reason for reason in result["reasons"]))


if __name__ == "__main__":
    unittest.main()
