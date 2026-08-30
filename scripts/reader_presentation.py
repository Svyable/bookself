#!/usr/bin/env python3
"""Validate Bookself publication reader.json presentation recommendations."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

PRESENTATION_VERSION = 1
PRESETS = {
    "book", "literary", "modern-essay", "editorial", "poetry", "night-story",
    "accessible", "quiet-study", "screenplay",
}
THEMES = {
    "light", "linen", "porcelain", "sage", "lavender", "ivory", "sepia", "rose", "sand",
    "dark", "slate", "midnight", "forest", "ember", "deep-sea", "aubergine",
    "contrast", "contrast-dark",
}
WARMTHS = {"off", "soft", "golden"}
FONTS = {"book", "literary", "warm", "classic", "modern", "clear", "humanist", "system", "script"}
WEIGHTS = {400, 500, 600}
MEASURES = {"narrow", "balanced", "wide"}
ALIGNS = {"left", "justify"}
PARAGRAPHS = {"compact", "normal", "airy"}
INDENTS = {"none", "gentle", "classic"}
MODES = {"paged", "scroll"}
HYPHENS = {"auto", "off"}
COVER_LAYOUTS = {"classic", "centered", "lower-third"}
COVER_ALIGNS = {"left", "center"}
COVER_FITS = {"cover", "contain"}
COVER_TONES = {"light", "dark"}


@dataclass(frozen=True)
class PresentationIssue:
    level: str
    code: str
    message: str


def issue(level: str, code: str, message: str) -> PresentationIssue:
    return PresentationIssue(level=level, code=code, message=message)


def _is_number(value: Any) -> bool:
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def _enum(out: list[PresentationIssue], obj: dict[str, Any], key: str, allowed: set[Any], prefix: str) -> None:
    if key not in obj:
        return
    value = obj[key]
    if value not in allowed:
        options = ", ".join(str(item) for item in sorted(allowed, key=str))
        out.append(issue("error", f"reader_{prefix}_{key}", f"{prefix}.{key} must be one of: {options}."))


def _number(
    out: list[PresentationIssue],
    obj: dict[str, Any],
    key: str,
    minimum: float,
    maximum: float,
    prefix: str,
) -> None:
    if key not in obj:
        return
    value = obj[key]
    if not _is_number(value):
        out.append(issue("error", f"reader_{prefix}_{key}", f"{prefix}.{key} must be a number."))
        return
    if value < minimum or value > maximum:
        out.append(
            issue(
                "warning",
                f"reader_{prefix}_{key}_clamped",
                f"{prefix}.{key} is {value}; Reader will clamp it to {minimum}–{maximum}.",
            )
        )


def _object_section(
    out: list[PresentationIssue], data: dict[str, Any], key: str, allowed_keys: set[str]
) -> dict[str, Any] | None:
    if key not in data:
        return None
    value = data[key]
    if not isinstance(value, dict):
        out.append(issue("error", f"reader_{key}_shape", f"{key} must be a JSON object."))
        return None
    unknown = sorted(set(value) - allowed_keys)
    for name in unknown:
        out.append(issue("error", f"reader_{key}_unknown", f"Unknown {key} setting: {name}."))
    return value


def validate_presentation(data: Any) -> list[PresentationIssue]:
    """Return validation findings for one decoded reader.json object."""
    out: list[PresentationIssue] = []
    if not isinstance(data, dict):
        return [issue("error", "reader_shape", "reader.json must contain a JSON object.")]

    unknown_top = sorted(set(data) - {"version", "preset", "appearance", "typography", "cover"})
    for name in unknown_top:
        out.append(issue("error", "reader_unknown_setting", f"Unknown reader.json setting: {name}."))

    if "version" not in data:
        out.append(issue("warning", "reader_version_missing", "reader.json has no version; add \"version\": 1."))
    elif data["version"] != PRESENTATION_VERSION:
        out.append(
            issue(
                "error",
                "reader_version_unsupported",
                f"reader.json version must be {PRESENTATION_VERSION}; found {data['version']!r}.",
            )
        )

    if "preset" in data:
        preset = data["preset"]
        if not isinstance(preset, str) or preset not in PRESETS:
            options = ", ".join(sorted(PRESETS))
            out.append(issue("error", "reader_preset", f"preset must be one of: {options}."))

    appearance = _object_section(out, data, "appearance", {"theme", "warmth"})
    if appearance is not None:
        _enum(out, appearance, "theme", THEMES, "appearance")
        _enum(out, appearance, "warmth", WARMTHS, "appearance")

    typography = _object_section(
        out,
        data,
        "typography",
        {
            "font", "fontSize", "fontWeight", "tracking", "leading", "measure", "align",
            "paragraph", "indent", "mode", "hyphens",
        },
    )
    if typography is not None:
        _enum(out, typography, "font", FONTS, "typography")
        _enum(out, typography, "fontWeight", WEIGHTS, "typography")
        _enum(out, typography, "measure", MEASURES, "typography")
        _enum(out, typography, "align", ALIGNS, "typography")
        _enum(out, typography, "paragraph", PARAGRAPHS, "typography")
        _enum(out, typography, "indent", INDENTS, "typography")
        _enum(out, typography, "mode", MODES, "typography")
        _enum(out, typography, "hyphens", HYPHENS, "typography")
        _number(out, typography, "fontSize", 14, 32, "typography")
        _number(out, typography, "tracking", -0.02, 0.08, "typography")
        _number(out, typography, "leading", 1.3, 2.0, "typography")

    cover = _object_section(
        out,
        data,
        "cover",
        {"layout", "align", "fit", "positionX", "positionY", "shade", "titleScale", "tone"},
    )
    if cover is not None:
        _enum(out, cover, "layout", COVER_LAYOUTS, "cover")
        _enum(out, cover, "align", COVER_ALIGNS, "cover")
        _enum(out, cover, "fit", COVER_FITS, "cover")
        _enum(out, cover, "tone", COVER_TONES, "cover")
        _number(out, cover, "positionX", 0, 100, "cover")
        _number(out, cover, "positionY", 0, 100, "cover")
        _number(out, cover, "shade", 0, 0.75, "cover")
        _number(out, cover, "titleScale", 0.8, 1.4, "cover")

    if not out:
        out.append(issue("ok", "reader_presentation", "reader.json presentation settings are valid."))
    return out
