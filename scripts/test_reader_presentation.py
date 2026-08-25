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
            }
        )
        self.assertEqual([(item.level, item.code) for item in findings], [("ok", "reader_presentation")])

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
