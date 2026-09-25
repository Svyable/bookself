#!/usr/bin/env python3
"""Calculate target-specific paperback geometry from Bookself preset data.

These are source-preflight calculations, not distributor acceptance. The live
platform calculator/template and a physical proof remain authoritative.
"""

from __future__ import annotations

import argparse
import json
import math
from pathlib import Path
from typing import Any


def load_presets(root: Path) -> dict[str, Any]:
    path = root / "publishing" / "edition-presets.json"
    return json.loads(path.read_text(encoding="utf-8"))


def to_inches(value: float, units: str) -> float:
    if units == "in":
        return float(value)
    if units == "mm":
        return float(value) / 25.4
    if units == "cm":
        return float(value) / 2.54
    raise ValueError(f"unsupported trim units: {units}")


def _trim_entry(presets: dict[str, Any], width: float, height: float) -> dict[str, Any] | None:
    entries = presets.get("amazonKdp", {}).get("paperback", {}).get("trimSizes", [])
    for entry in entries or []:
        if abs(float(entry.get("width", -1)) - width) < 0.001 and abs(float(entry.get("height", -1)) - height) < 0.001:
            return entry
    return None


def _page_key(ink: str, paper: str) -> str | None:
    ink_value = ink.lower().replace("_", "-").replace(" ", "-")
    paper_value = paper.lower().replace("_", "-").replace(" ", "-")
    if "premium" in ink_value:
        return "premiumColor"
    if "standard" in ink_value or ("black" not in ink_value and "color" in ink_value):
        return "standardColor"
    if "groundwood" in paper_value:
        return "groundwood"
    if "cream" in paper_value:
        return "blackWhiteCream"
    if "white" in paper_value:
        return "blackWhiteWhite"
    return None


def _round(value: float) -> float:
    return round(float(value), 6)


def paperback_geometry(
    presets: dict[str, Any],
    *,
    width: float,
    height: float,
    units: str = "in",
    ink: str,
    paper: str,
    page_count: int,
    bleed: bool = False,
    minimum_ppi: int | None = None,
) -> dict[str, Any]:
    """Return deterministic source-preflight geometry for a KDP paperback."""

    trim_width = to_inches(width, units)
    trim_height = to_inches(height, units)
    paperback = presets.get("amazonKdp", {}).get("paperback", {})
    entry = _trim_entry(presets, trim_width, trim_height)
    page_key = _page_key(ink, paper)
    spine_multiplier = (paperback.get("spineInchesPerPage", {}) or {}).get(page_key)
    if spine_multiplier is None and page_key == "blackWhiteWhite":
        spine_multiplier = (paperback.get("spineInchesPerPage", {}) or {}).get("black-white-white")
    if spine_multiplier is None and page_key == "blackWhiteCream":
        spine_multiplier = (paperback.get("spineInchesPerPage", {}) or {}).get("black-white-cream")
    if spine_multiplier is None and page_key == "groundwood":
        spine_multiplier = (paperback.get("spineInchesPerPage", {}) or {}).get("black-white-groundwood")
    if spine_multiplier is None and page_key == "premiumColor":
        spine_multiplier = (paperback.get("spineInchesPerPage", {}) or {}).get("premium-color-white")
    if spine_multiplier is None and page_key == "standardColor":
        spine_multiplier = (paperback.get("spineInchesPerPage", {}) or {}).get("standard-color-white")

    cover_bleed = float(paperback.get("coverBleed", 0.125) or 0.125)
    if minimum_ppi is None:
        minimum_ppi = int(paperback.get("minimumImagePpi", 300) or 300)
    spine = float(page_count) * float(spine_multiplier) if spine_multiplier is not None and page_count > 0 else None
    cover_width = 2 * cover_bleed + 2 * trim_width + spine if spine is not None else None
    cover_height = 2 * cover_bleed + trim_height
    raster = [math.ceil(trim_width * minimum_ppi), math.ceil(trim_height * minimum_ppi)]
    if bleed:
        raster = [math.ceil((trim_width + 2 * cover_bleed) * minimum_ppi), math.ceil((trim_height + 2 * cover_bleed) * minimum_ppi)]

    max_pages = entry.get("maxPages", {}).get(page_key) if entry and page_key else None
    minimum_values = paperback.get("minimumPages", {}) or {}
    if page_key and page_key.startswith("blackWhite"):
        minimum = int(minimum_values.get("blackWhite", 0) or 0)
    else:
        minimum = int(minimum_values.get(page_key, 0) or 0) if page_key else 0
    eligibility = "pending" if page_count <= 0 else "eligible"
    reasons: list[str] = []
    if entry is None:
        eligibility = "review"
        reasons.append("trim is not in the recorded trim table")
    if page_key is None:
        eligibility = "review"
        reasons.append("ink/paper combination is not mapped")
    if page_count > 0 and minimum and page_count < minimum:
        eligibility = "ineligible"
        reasons.append(f"page count is below {minimum}")
    if page_count > 0 and max_pages is not None and page_count > int(max_pages):
        eligibility = "ineligible"
        reasons.append(f"page count is above {max_pages}")
    spine_text_minimum = int((paperback.get("spineText", {}) or {}).get("minimumPagesExclusive", 79))
    if page_count > 0 and page_count <= spine_text_minimum:
        reasons.append("spine text is not supported at this page count")

    return {
        "platform": "amazon-kdp",
        "product": "paperback",
        "profileReviewed": presets.get("reviewed"),
        "profileSource": presets.get("amazonKdp", {}).get("source"),
        "trim": {"width": _round(trim_width), "height": _round(trim_height), "units": "in"},
        "interior": {"ink": ink, "paper": paper, "bleed": bool(bleed)},
        "pageCount": page_count,
        "pageCountRange": {"minimum": minimum or None, "maximum": max_pages},
        "spineWidthIn": _round(spine) if spine is not None else None,
        "coverBleedIn": _round(cover_bleed),
        "coverSizeIn": {
            "width": _round(cover_width) if cover_width is not None else None,
            "height": _round(cover_height),
        },
        "trimRasterPxAtMinimumPpi": raster,
        "minimumPpi": minimum_ppi,
        "spineTextMinimumPagesExclusive": spine_text_minimum,
        "eligibility": eligibility,
        "reasons": reasons,
        "calculation": "cover = 2*bleed + 2*trimWidth + spine; coverHeight = 2*bleed + trimHeight; spine = pages * profile multiplier",
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", default=".", help="Bookself repository root")
    parser.add_argument("--width", type=float, required=True)
    parser.add_argument("--height", type=float, required=True)
    parser.add_argument("--units", default="in", choices=("in", "mm", "cm"))
    parser.add_argument("--ink", required=True)
    parser.add_argument("--paper", required=True)
    parser.add_argument("--pages", type=int, required=True)
    parser.add_argument("--bleed", action="store_true")
    parser.add_argument("--json", action="store_true", dest="as_json")
    args = parser.parse_args(argv)
    try:
        result = paperback_geometry(
            load_presets(Path(args.root)),
            width=args.width,
            height=args.height,
            units=args.units,
            ink=args.ink,
            paper=args.paper,
            page_count=args.pages,
            bleed=args.bleed,
        )
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        parser.error(str(exc))
    if args.as_json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(f"Target: {result['platform']} {result['product']}")
        print(f"Eligibility: {result['eligibility']}")
        print(f"Spine: {result['spineWidthIn']} in")
        print(f"Cover: {result['coverSizeIn']['width']} × {result['coverSizeIn']['height']} in")
        print(f"Trim raster at {result['minimumPpi']} PPI: {result['trimRasterPxAtMinimumPpi'][0]} × {result['trimRasterPxAtMinimumPpi'][1]} px")
        for reason in result["reasons"]:
            print(f"- {reason}")
    return 0 if result["eligibility"] != "ineligible" else 1


if __name__ == "__main__":
    raise SystemExit(main())
