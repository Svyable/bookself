#!/usr/bin/env python3
"""Read basic raster dimensions without third-party imaging dependencies.

This is intentionally a header probe, not a decoder. It never trusts embedded
DPI metadata. Unsupported vector/PDF/layered formats return ``None`` and must
remain explicit manual production workflows.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import struct
from typing import BinaryIO


@dataclass(frozen=True)
class ImageDimensions:
    width: int
    height: int
    format: str


def _png(stream: BinaryIO) -> ImageDimensions | None:
    signature = stream.read(8)
    if signature != b"\x89PNG\r\n\x1a\n":
        return None
    length = stream.read(4)
    chunk = stream.read(4)
    if len(length) != 4 or chunk != b"IHDR" or len(stream.read(4)) < 4:
        return None
    # The first chunk of a valid PNG must be IHDR with a 13-byte payload.
    stream.seek(-4, 1)
    payload = stream.read(13)
    if len(payload) != 13:
        return None
    width, height = struct.unpack(">II", payload[:8])
    return ImageDimensions(width, height, "png") if width > 0 and height > 0 else None


def _gif(stream: BinaryIO) -> ImageDimensions | None:
    header = stream.read(10)
    if len(header) != 10 or header[:6] not in {b"GIF87a", b"GIF89a"}:
        return None
    width, height = struct.unpack("<HH", header[6:10])
    return ImageDimensions(width, height, "gif") if width > 0 and height > 0 else None


def _jpeg(stream: BinaryIO) -> ImageDimensions | None:
    if stream.read(2) != b"\xff\xd8":
        return None
    while True:
        prefix = stream.read(1)
        if not prefix:
            return None
        if prefix != b"\xff":
            continue
        marker = stream.read(1)
        while marker == b"\xff":
            marker = stream.read(1)
        if not marker:
            return None
        code = marker[0]
        if code in {0xD8, 0xD9}:
            continue
        length_bytes = stream.read(2)
        if len(length_bytes) != 2:
            return None
        length = struct.unpack(">H", length_bytes)[0]
        if length < 2:
            return None
        if code in set(range(0xC0, 0xC4)) | set(range(0xC5, 0xC8)) | set(range(0xC9, 0xCC)) | set(range(0xCD, 0xD0)):
            payload = stream.read(5)
            if len(payload) != 5:
                return None
            height, width = struct.unpack(">HH", payload[1:5])
            return ImageDimensions(width, height, "jpeg") if width > 0 and height > 0 else None
        stream.seek(length - 2, 1)


def _webp(stream: BinaryIO) -> ImageDimensions | None:
    header = stream.read(12)
    if len(header) != 12 or header[:4] != b"RIFF" or header[8:12] != b"WEBP":
        return None
    chunk = stream.read(8)
    if len(chunk) != 8:
        return None
    kind = chunk[:4]
    if kind == b"VP8X":
        payload = stream.read(10)
        if len(payload) != 10:
            return None
        # VP8X stores 24-bit canvas dimensions minus one.
        width = 1 + int.from_bytes(payload[4:7], "little")
        height = 1 + int.from_bytes(payload[7:10], "little")
        return ImageDimensions(width, height, "webp")
    if kind == b"VP8 ":
        payload = stream.read(10)
        if len(payload) == 10:
            width = int.from_bytes(payload[6:8], "little") & 0x3FFF
            height = int.from_bytes(payload[8:10], "little") & 0x3FFF
            return ImageDimensions(width, height, "webp")
        return None
    if kind == b"VP8L":
        payload = stream.read(5)
        if len(payload) == 5:
            bits = int.from_bytes(payload[1:5], "little")
            width = (bits & 0x3FFF) + 1
            height = ((bits >> 14) & 0x3FFF) + 1
            return ImageDimensions(width, height, "webp")
    return None


def probe_dimensions(path: Path) -> ImageDimensions | None:
    """Return measured raster dimensions, or ``None`` for unsupported formats."""

    try:
        with path.open("rb") as stream:
            header = stream.read(12)
            stream.seek(0)
            if header.startswith(b"\x89PNG\r\n\x1a\n"):
                return _png(stream)
            if header.startswith((b"GIF87a", b"GIF89a")):
                return _gif(stream)
            if header.startswith(b"\xff\xd8"):
                return _jpeg(stream)
            if header.startswith(b"RIFF") and header[8:12] == b"WEBP":
                return _webp(stream)
    except OSError:
        return None
    return None
