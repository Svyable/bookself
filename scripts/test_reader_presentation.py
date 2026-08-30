#!/usr/bin/env python3

import unittest

from reader_presentation import validate_presentation


class ReaderPresentationTests(unittest.TestCase):
    def codes(self, value):
        return {item.code for item in validate_presentation(value)}

    def test_valid_presentation(self):
        findings = validate_presentation(
            {
                "version": 1,
                "appearance": {"theme": "ivory", "warmth": "soft"},
                "typography": {
                    "font": "literary",
                    "fontSize": 19,
                    "fontWeight": 400,
                    "tracking": 0,
                    "leading": 1.6,
                    "measure": "balanced",
                    "align": "justify",
                    "paragraph": "normal",
                    "indent": "gentle",
                    "mode": "paged",
                    "hyphens": "auto",
                },
                "cover": {
                    "layout": "lower-third",
                    "align": "left",
                    "fit": "cover",
                    "positionX": 42,
                    "positionY": 68,
                    "shade": 0.5,
                    "titleScale": 1.15,
                    "tone": "light",
                },
            }
        )
        self.assertEqual([(item.level, item.code) for item in findings], [("ok", "reader_presentation")])

    def test_screenplay_preset_and_script_font_are_valid(self):
        findings = validate_presentation(
            {
                "version": 1,
                "preset": "screenplay",
                "typography": {"font": "script", "mode": "paged", "hyphens": "off"},
            }
        )
        self.assertEqual([(item.level, item.code) for item in findings], [("ok", "reader_presentation")])

    def test_invalid_preset_is_error(self):
        codes = self.codes({"version": 1, "preset": "studio-locked-pages"})
        self.assertIn("reader_preset", codes)

    def test_invalid_enum_is_error(self):
        codes = self.codes({"version": 1, "appearance": {"theme": "brand-blue"}})
        self.assertIn("reader_appearance_theme", codes)

    def test_unknown_setting_is_error(self):
        codes = self.codes({"version": 1, "typography": {"fontFamly": "literary"}})
        self.assertIn("reader_typography_unknown", codes)

    def test_wrong_numeric_shape_is_error(self):
        codes = self.codes({"version": 1, "typography": {"fontSize": "large"}})
        self.assertIn("reader_typography_fontSize", codes)

    def test_out_of_range_numeric_value_is_warning(self):
        findings = validate_presentation({"version": 1, "typography": {"leading": 4}})
        self.assertIn("reader_typography_leading_clamped", {item.code for item in findings})
        self.assertIn("warning", {item.level for item in findings})

    def test_cover_invalid_enum_is_error(self):
        codes = self.codes({"version": 1, "cover": {"layout": "diagonal"}})
        self.assertIn("reader_cover_layout", codes)

    def test_cover_wrong_numeric_shape_is_error(self):
        codes = self.codes({"version": 1, "cover": {"shade": "heavy"}})
        self.assertIn("reader_cover_shade", codes)

    def test_cover_out_of_range_is_warning(self):
        codes = self.codes({"version": 1, "cover": {"positionY": 140, "titleScale": 2}})
        self.assertIn("reader_cover_positionY_clamped", codes)
        self.assertIn("reader_cover_titleScale_clamped", codes)

    def test_cover_unknown_setting_is_error(self):
        codes = self.codes({"version": 1, "cover": {"logoSize": 2}})
        self.assertIn("reader_cover_unknown", codes)

    def test_missing_version_is_warning(self):
        codes = self.codes({"appearance": {"theme": "light"}})
        self.assertIn("reader_version_missing", codes)

    def test_unsupported_version_is_error(self):
        codes = self.codes({"version": 2})
        self.assertIn("reader_version_unsupported", codes)

    def test_non_object_is_error(self):
        self.assertIn("reader_shape", self.codes([]))


if __name__ == "__main__":
    unittest.main()
