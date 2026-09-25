from __future__ import annotations

import struct
import tempfile
import unittest
from pathlib import Path

from image_dimensions import probe_dimensions


class ImageDimensionsTests(unittest.TestCase):
    def test_png_header_is_measured(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "sample.png"
            path.write_bytes(
                b"\x89PNG\r\n\x1a\n"
                + struct.pack(">I", 13)
                + b"IHDR"
                + struct.pack(">IIBBBBB", 2550, 3300, 8, 6, 0, 0, 0)
            )
            measured = probe_dimensions(path)
            self.assertIsNotNone(measured)
            self.assertEqual((measured.width, measured.height, measured.format), (2550, 3300, "png"))

    def test_gif_header_is_measured(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "sample.gif"
            path.write_bytes(b"GIF89a" + struct.pack("<HH", 640, 480) + b"\x00\x00\x00")
            measured = probe_dimensions(path)
            self.assertIsNotNone(measured)
            self.assertEqual((measured.width, measured.height, measured.format), (640, 480, "gif"))

    def test_vector_and_unknown_files_are_not_guessed(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "scene.svg"
            path.write_text('<svg width="2550" height="3300"></svg>', encoding="utf-8")
            self.assertIsNone(probe_dimensions(path))
            unknown = Path(directory) / "scene.bin"
            unknown.write_bytes(b"not-an-image")
            self.assertIsNone(probe_dimensions(unknown))


if __name__ == "__main__":
    unittest.main()
