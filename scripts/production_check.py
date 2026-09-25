#!/usr/bin/env python3
"""Validate Bookself's optional publication-local production contract.

The contract is deliberately small and file-based. It records production intent,
page/scene/asset relationships, provenance, and target gates without turning a
publication into a second CMS or making a hosted printer the source of truth.
The command uses only Python's standard library so it remains available inside
an offline Desk checkout.
"""

from __future__ import annotations

import argparse
from dataclasses import asdict, dataclass
import json
from pathlib import Path
import re
import sys
from typing import Any

try:
    from image_dimensions import probe_dimensions
except ImportError:  # pragma: no cover - supports unusual import contexts
    probe_dimensions = None

try:
    from print_geometry import paperback_geometry
except ImportError:  # pragma: no cover - supports unusual import contexts
    paperback_geometry = None

SCHEMA_VERSION = 1
SAFE_ID = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
KNOWN_ASSET_STATES = {"missing", "imported", "unavailable"}
KNOWN_ASSET_CLASSIFICATIONS = {
    "candidate",
    "reject",
    "reference-only",
    "keeper-source",
    "print",
    "released",
}
KIND_RE = re.compile(r"^[a-z][a-z0-9._-]*(?:/[a-z][a-z0-9._-]*)*$")
STATUS_RE = re.compile(r"^[a-z][a-z0-9._-]*(?:/[a-z][a-z0-9._-]*)*$")
# These names are conveniences for built-in Bookself warnings, not a closed
# workflow vocabulary. A publication may use a project-specific state.
KNOWN_FINAL_STATUSES = {"ready-for-production", "proof", "published"}
KNOWN_CAPABILITIES = {"pageMap", "scenePlan", "assetInventory", "qaChecklist", "printArtSpec"}


@dataclass(frozen=True)
class Finding:
    level: str
    code: str
    message: str
    path: str | None = None

    def as_dict(self) -> dict[str, str | None]:
        return asdict(self)


def finding(level: str, code: str, message: str, path: str | None = None) -> Finding:
    return Finding(level, code, message, path)


def relative_label(root: Path, path: Path) -> str:
    try:
        return str(path.resolve().relative_to(root.resolve()))
    except ValueError:
        return str(path)


def add(
    findings: list[Finding],
    level: str,
    code: str,
    message: str,
    root: Path,
    path: Path | None = None,
) -> None:
    findings.append(finding(level, code, message, relative_label(root, path) if path else None))


def read_json(
    path: Path,
    findings: list[Finding],
    root: Path,
    *,
    required: bool = True,
) -> Any:
    if not path.is_file():
        if required:
            add(findings, "error", "missing_json", "Required production file is missing.", root, path)
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        add(findings, "error", "invalid_json", f"File is not readable JSON: {exc}", root, path)
        return None


def read_text(
    path: Path,
    findings: list[Finding],
    root: Path,
    *,
    required: bool = True,
) -> str | None:
    if not path.is_file():
        if required:
            add(findings, "error", "missing_file", "Required production file is missing.", root, path)
        return None
    try:
        return path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as exc:
        add(findings, "error", "unreadable_file", f"File is not readable UTF-8 text: {exc}", root, path)
        return None


def resolve_inside(base: Path, raw: Any) -> Path | None:
    if not isinstance(raw, str) or not raw.strip():
        return None
    value = raw.strip().replace("\\", "/")
    relative = Path(value)
    if relative.is_absolute() or ".." in relative.parts:
        return None
    candidate = (base / relative).resolve()
    try:
        candidate.relative_to(base.resolve())
    except ValueError:
        return None
    return candidate


def first(mapping: dict[str, Any], *keys: str, default: Any = None) -> Any:
    for key in keys:
        if key in mapping:
            return mapping[key]
    return default


def is_int(value: Any) -> bool:
    return isinstance(value, int) and not isinstance(value, bool)


def positive_number(value: Any) -> bool:
    return isinstance(value, (int, float)) and not isinstance(value, bool) and value > 0


def inches(value: Any, units: Any) -> float | None:
    if not positive_number(value) or units not in {"in", "mm", "cm"}:
        return None
    divisor = {"in": 1.0, "mm": 25.4, "cm": 2.54}[units]
    return float(value) / divisor


def validate_relative_link(
    findings: list[Finding],
    root: Path,
    publication: Path,
    raw: Any,
    label: str,
    *,
    required: bool = False,
) -> Path | None:
    if raw is None and not required:
        return None
    path = resolve_inside(publication, raw)
    if path is None:
        add(
            findings,
            "error",
            "unsafe_production_path",
            f"{label} must be a publication-local relative path.",
            root,
        )
        return None
    if not path.exists():
        add(findings, "error", "missing_linked_file", f"{label} points to a missing file.", root, path)
    elif not path.is_file():
        add(findings, "error", "linked_path_not_file", f"{label} must point to a file, not a directory.", root, path)
    return path


def load_presets(root: Path, findings: list[Finding]) -> dict[str, Any]:
    path = root / "publishing" / "edition-presets.json"
    data = read_json(path, findings, root, required=False)
    return data if isinstance(data, dict) else {}


def expected_side(page: int, reading_direction: str) -> str:
    odd_is_right = reading_direction != "rtl"
    return ("right" if page % 2 else "left") if odd_is_right else ("left" if page % 2 else "right")


def kdp_page_key(ink: Any, paper: Any) -> str | None:
    ink_value = str(ink or "").lower().replace("_", "-").replace(" ", "-")
    paper_value = str(paper or "").lower().replace("_", "-").replace(" ", "-")
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


def kdp_trim_entry(trim: dict[str, Any], presets: dict[str, Any]) -> dict[str, Any] | None:
    paperback = presets.get("amazonKdp", {}).get("paperback", {})
    width = trim.get("width")
    height = trim.get("height")
    for entry in paperback.get("trimSizes", []) or []:
        if not isinstance(entry, dict):
            continue
        if abs(float(entry.get("width", -1)) - float(width)) < 0.001 and abs(float(entry.get("height", -1)) - float(height)) < 0.001:
            return entry
    return None


def validate_target(
    findings: list[Finding],
    root: Path,
    manifest: dict[str, Any],
    format_data: dict[str, Any],
    trim: dict[str, Any],
    page_count: int,
    presets: dict[str, Any],
) -> None:
    target = manifest.get("target")
    if not isinstance(target, dict):
        return
    platform = str(target.get("platform") or "").strip().lower()
    product = str(target.get("product") or "").strip().lower()
    quality = manifest.get("qualityGates") if isinstance(manifest.get("qualityGates"), dict) else {}
    paperback = presets.get("amazonKdp", {}).get("paperback", {}) if isinstance(presets, dict) else {}

    if not target.get("profileReviewed"):
        add(findings, "warning", "target_review_missing", "Target profile has no reviewed date; recheck the live distributor specification before export.", root)
    elif not target.get("profileSource"):
        add(findings, "info", "target_source_missing", "Target profile has a reviewed date but no source URL recorded.", root)

    if platform not in {"amazon-kdp", "kdp", "amazon"} or product not in {"paperback", "perfect-bound"}:
        return
    if not positive_number(trim.get("width")) or not positive_number(trim.get("height")) or not isinstance(format_data.get("interior"), dict):
        add(findings, "info", "target_geometry_not_applicable", "This target has no print trim/interior contract; print-specific geometry was not checked.", root)
        return
    if not isinstance(paperback, dict) or not paperback:
        add(findings, "warning", "target_profile_unavailable", "Amazon KDP preset data is unavailable; target geometry was not checked.", root)
        return

    add(findings, "info", "kdp_profile_checked", "Checked the manifest against the local Amazon KDP paperback preset profile.", root)
    normalized_trim = {
        "width": inches(trim.get("width"), trim.get("units", "in")),
        "height": inches(trim.get("height"), trim.get("units", "in")),
        "units": "in",
    }
    trim_entry = kdp_trim_entry(normalized_trim, presets)
    if trim_entry is None:
        custom = paperback.get("customTrim", {})
        width = float(normalized_trim.get("width") or 0)
        height = float(normalized_trim.get("height") or 0)
        if custom and not (
            float(custom.get("minWidth", 0)) <= width <= float(custom.get("maxWidth", 0))
            and float(custom.get("minHeight", 0)) <= height <= float(custom.get("maxHeight", 0))
        ):
            add(findings, "error", "kdp_trim_out_of_range", "Trim is outside the recorded Amazon KDP custom paperback range.", root)
        else:
            add(findings, "warning", "kdp_trim_not_in_table", "Trim is not in the recorded Amazon KDP trim table; verify the current calculator/template.", root)
    else:
        interior = format_data.get("interior") if isinstance(format_data.get("interior"), dict) else {}
        page_key = kdp_page_key(interior.get("ink"), interior.get("paper"))
        max_pages = trim_entry.get("maxPages", {}) if isinstance(trim_entry.get("maxPages"), dict) else {}
        if page_key is None:
            add(findings, "warning", "kdp_ink_paper_unresolved", "Could not map the interior ink/paper choice to a recorded KDP page-count profile.", root)
        elif page_count > 0:
            maximum = max_pages.get(page_key)
            minimum_values = paperback.get("minimumPages", {}) or {}
            minimum = int(minimum_values.get("blackWhite", 0) or 0) if page_key.startswith("blackWhite") else int(minimum_values.get(page_key, 0) or 0)
            if minimum and page_count < minimum:
                add(findings, "error", "kdp_page_count_below_minimum", f"Page count {page_count} is below the recorded KDP minimum of {minimum}.", root)
            if maximum is not None and page_count > int(maximum):
                add(findings, "error", "kdp_page_count_above_maximum", f"Page count {page_count} exceeds the recorded KDP maximum of {maximum} for this trim and interior.", root)

    spine_text_minimum = int((paperback.get("spineText", {}) or {}).get("minimumPagesExclusive", 79))
    if page_count > 0 and format_data.get("spineText") is True and page_count <= spine_text_minimum:
        add(findings, "error", "kdp_spine_text_too_short", f"KDP spine text requires more than {spine_text_minimum} pages.", root)

    if page_count > 0:
        inside = next(
            (
                float(item.get("margin"))
                for item in paperback.get("minimumInsideMargins", []) or []
                if isinstance(item, dict)
                and int(item.get("minPages", 0)) <= page_count <= int(item.get("maxPages", 10**9))
            ),
            None,
        )
        outside = float(paperback.get("minimumOutsideMarginWithBleed" if format_data.get("bleed") else "minimumOutsideMarginNoBleed", 0) or 0)
        margins = format_data.get("margins") if isinstance(format_data.get("margins"), dict) else {}
        margin_units = trim.get("units", "in")
        inside_value = inches(margins.get("inside"), margin_units) if "inside" in margins else None
        outside_value = inches(margins.get("outside"), margin_units) if "outside" in margins else None
        if inside is not None and inside_value is not None and inside_value < inside:
            add(findings, "error", "kdp_inside_margin_too_small", f"Inside margin {margins['inside']} is below the recorded KDP minimum of {inside} for {page_count} pages.", root)
        if outside and outside_value is not None and outside_value < outside:
            add(findings, "error", "kdp_outside_margin_too_small", f"Outside margin {margins['outside']} is below the recorded KDP minimum of {outside}.", root)

    minimum_ppi = float(paperback.get("minimumImagePpi", 300) or 300)
    minimum_line_weight = float(paperback.get("minimumLineWeightPt", 0.75) or 0.75)
    if positive_number(quality.get("minimumEffectiveImagePpi")) and float(quality["minimumEffectiveImagePpi"]) < minimum_ppi:
        add(findings, "warning", "image_ppi_target_too_low", f"The manifest permits less than {minimum_ppi:g} effective PPI; the recorded KDP baseline is {minimum_ppi:g} PPI.", root)
    if positive_number(quality.get("minimumLineWeightPt")) and float(quality["minimumLineWeightPt"]) < minimum_line_weight:
        add(findings, "warning", "line_weight_target_too_low", f"The manifest permits lines below the recorded {minimum_line_weight:g} pt KDP baseline.", root)


def validate_page_map(
    findings: list[Finding],
    root: Path,
    publication: Path,
    page_map: Any,
    manifest: dict[str, Any],
    format_data: dict[str, Any],
    metrics: dict[str, Any],
) -> tuple[list[dict[str, Any]], int]:
    if not isinstance(page_map, dict):
        add(findings, "error", "invalid_page_map", "Page map must be a JSON object.", root)
        return [], 0
    if page_map.get("editionId") and manifest.get("editionId") and page_map.get("editionId") != manifest.get("editionId"):
        add(findings, "error", "page_map_edition_mismatch", "Page map editionId differs from the production manifest editionId.", root)
    if page_map.get("publicationId") and page_map.get("publicationId") != manifest.get("publicationId"):
        add(findings, "error", "page_map_publication_mismatch", "Page map publicationId differs from the production manifest.", root)
    pages = page_map.get("pages")
    if not isinstance(pages, list):
        add(findings, "error", "invalid_page_map_pages", "Page map pages must be an array.", root)
        return [], 0
    map_count = page_map.get("pageCount")
    if not is_int(map_count) or map_count < 0:
        add(findings, "error", "invalid_page_map_count", "Page map pageCount must be a non-negative integer.", root)
        map_count = len(pages)
    manifest_count = format_data.get("pageCount")
    if is_int(manifest_count) and manifest_count != map_count:
        add(findings, "error", "page_count_mismatch", f"Manifest pageCount {manifest_count} does not match page map pageCount {map_count}.", root)
    if map_count != len(pages):
        add(findings, "error", "page_map_length_mismatch", f"Page map has {len(pages)} entries but declares {map_count} pages.", root)
    if map_count == 0:
        add(findings, "warning", "page_count_pending", "Interior pagination is not finalized; page-dependent cover geometry and proofing remain blocked.", root)
    metrics["pageCount"] = map_count
    page_trim = page_map.get("trim") if isinstance(page_map.get("trim"), dict) else {}
    manifest_trim = format_data.get("trim") if isinstance(format_data.get("trim"), dict) else {}
    if page_trim and manifest_trim:
        for axis in ("width", "height"):
            page_value = page_trim.get(axis)
            manifest_value = manifest_trim.get(axis)
            page_inches = inches(page_value, page_trim.get("units", "in"))
            manifest_inches = inches(manifest_value, manifest_trim.get("units", "in"))
            if page_inches is None or manifest_inches is None or abs(page_inches - manifest_inches) > 0.001:
                add(findings, "error", "page_map_trim_mismatch", f"Page map trim {axis} differs from the edition format.", root)
    if "bleed" in page_map and "bleed" in format_data and page_map.get("bleed") != format_data.get("bleed"):
        add(findings, "error", "page_map_bleed_mismatch", "Page map bleed differs from the edition format.", root)

    layout = manifest.get("layout") if isinstance(manifest.get("layout"), dict) else {}
    reading_direction = str(layout.get("readingDirection") or "ltr").lower()
    valid_pages: list[dict[str, Any]] = []
    seen: set[int] = set()
    for index, page in enumerate(pages):
        if not isinstance(page, dict):
            add(findings, "error", "invalid_page_entry", f"Page entry {index + 1} must be an object.", root)
            continue
        number = page.get("page")
        if not is_int(number) or number < 1:
            add(findings, "error", "invalid_page_number", f"Page entry {index + 1} has an invalid page number.", root)
            continue
        if number in seen:
            add(findings, "error", "duplicate_page_number", f"Page {number} appears more than once.", root)
        seen.add(number)
        side = page.get("side")
        if side not in {"left", "right"}:
            add(findings, "error", "invalid_page_side", f"Page {number} must declare side left or right.", root)
        else:
            expected = expected_side(number, reading_direction)
            if side != expected:
                add(findings, "error", "page_side_mismatch", f"Page {number} is marked {side}; {reading_direction.upper()} pagination expects {expected}.", root)
        page_type = page.get("type")
        if not isinstance(page_type, str) or not page_type.strip():
            add(findings, "error", "invalid_page_type", f"Page {number} needs a non-empty type.", root)
        if not isinstance(page.get("content"), str) or not page["content"].strip():
            add(findings, "warning", "page_content_missing", f"Page {number} has no human-readable content description.", root)
        source = first(page, "source", "sourcePath")
        if source is not None:
            source_path = validate_relative_link(findings, root, publication, source, f"Page {number} source", required=True)
            if source_path is not None and not source_path.is_file():
                add(findings, "error", "missing_page_source", f"Page {number} source is not a file.", root, source_path)
        valid_pages.append(page)

    if map_count > 0 and seen != set(range(1, map_count + 1)):
        add(findings, "error", "page_map_not_contiguous", "Page map must cover every page from 1 through pageCount exactly once.", root)
    return valid_pages, map_count


def validate_scene_plan(
    findings: list[Finding],
    root: Path,
    publication: Path,
    scene_plan: Any,
    manifest: dict[str, Any],
    pages: list[dict[str, Any]],
    page_count: int,
    metrics: dict[str, Any],
) -> set[str]:
    if not isinstance(scene_plan, dict):
        add(findings, "error", "invalid_scene_plan", "Scene plan must be a JSON object.", root)
        return set()
    scenes = scene_plan.get("scenes")
    if not isinstance(scenes, list):
        add(findings, "error", "invalid_scene_list", "Scene plan scenes must be an array.", root)
        return set()
    layout = manifest.get("layout") if isinstance(manifest.get("layout"), dict) else {}
    scene_types = {str(item).lower() for item in layout.get("sceneTypes", []) or []}
    page_by_number = {page.get("page"): page for page in pages if is_int(page.get("page"))}
    scene_ids: set[str] = set()
    seen_pages: set[int] = set()
    for index, scene in enumerate(scenes):
        if not isinstance(scene, dict):
            add(findings, "error", "invalid_scene_entry", f"Scene entry {index + 1} must be an object.", root)
            continue
        scene_id = scene.get("id")
        if not isinstance(scene_id, str) or not SAFE_ID.fullmatch(scene_id):
            add(findings, "error", "invalid_scene_id", f"Scene entry {index + 1} needs a safe non-empty id.", root)
            continue
        if scene_id in scene_ids:
            add(findings, "error", "duplicate_scene_id", f"Scene id {scene_id} appears more than once.", root)
        scene_ids.add(scene_id)
        for field in ("title", "brief", "composition", "artStatus", "approval"):
            if not isinstance(scene.get(field), str) or not scene[field].strip():
                add(findings, "error", "incomplete_scene", f"Scene {scene_id} is missing {field}.", root)
        page = scene.get("page")
        if not is_int(page) or page < 1 or (page_count and page > page_count):
            add(findings, "error", "invalid_scene_page", f"Scene {scene_id} points outside the page map.", root)
            continue
        if page in seen_pages:
            add(findings, "error", "duplicate_scene_page", f"Page {page} is assigned to more than one scene.", root)
        seen_pages.add(page)
        page_entry = page_by_number.get(page)
        if page_entry is None:
            add(findings, "error", "scene_page_not_mapped", f"Scene {scene_id} points to a page absent from the page map.", root)
            continue
        mapped_scene = page_entry.get("sceneId")
        if mapped_scene is not None and mapped_scene != scene_id:
            add(findings, "error", "scene_page_mapping_mismatch", f"Page {page} maps to {mapped_scene}, not {scene_id}.", root)
        if scene_types and str(page_entry.get("type", "")).lower() not in scene_types:
            add(findings, "error", "scene_page_type_mismatch", f"Scene {scene_id} is on page type {page_entry.get('type')!r}, outside the declared scene types.", root)
        side = layout.get("sceneSide")
        parity = layout.get("sceneParity")
        if side and page_entry.get("side") != side:
            add(findings, "error", "scene_side_mismatch", f"Scene {scene_id} must be on the declared {side} side.", root)
        if parity == "odd" and page % 2 == 0:
            add(findings, "error", "scene_parity_mismatch", f"Scene {scene_id} must be on an odd page.", root)
        if parity == "even" and page % 2:
            add(findings, "error", "scene_parity_mismatch", f"Scene {scene_id} must be on an even page.", root)
        if layout.get("blankReverse") is True:
            reverse = page_by_number.get(page + 1)
            if reverse is None or str(reverse.get("type", "")).lower() != "reverse":
                add(findings, "error", "blank_reverse_missing", f"Scene {scene_id} must be followed by a reverse page.", root)
        if scene.get("approval") != "approved" and str(manifest.get("status")) in KNOWN_FINAL_STATUSES:
            add(findings, "warning", "scene_not_approved", f"Scene {scene_id} is not approved while the production manifest is {manifest.get('status')}.", root)
    if page_count > 0 and not scenes:
        add(findings, "warning", "scene_plan_empty", "The interior is paginated but the scene plan has no scenes.", root)
    metrics["sceneCount"] = len(scene_ids)
    return scene_ids


def validate_scene_asset_references(
    findings: list[Finding],
    root: Path,
    scene_plan: Any,
    inventory: Any,
) -> None:
    if not isinstance(scene_plan, dict) or not isinstance(inventory, dict):
        return
    scenes = scene_plan.get("scenes") if isinstance(scene_plan.get("scenes"), list) else []
    assets = inventory.get("assets") if isinstance(inventory.get("assets"), list) else []
    asset_ids = {asset.get("id") for asset in assets if isinstance(asset, dict) and isinstance(asset.get("id"), str)}
    for scene in scenes:
        if not isinstance(scene, dict):
            continue
        references = first(scene, "assetIds", "asset_ids", default=[])
        if not isinstance(references, list):
            add(findings, "error", "invalid_scene_asset_references", f"Scene {scene.get('id', '<unknown>')} assetIds must be an array.", root)
            continue
        for reference in references:
            if not isinstance(reference, str) or reference not in asset_ids:
                add(findings, "error", "unknown_scene_asset_reference", f"Scene {scene.get('id', '<unknown>')} references unknown asset {reference!r}.", root)


def validate_asset_inventory(
    findings: list[Finding],
    root: Path,
    publication: Path,
    inventory: Any,
    page_count: int,
    trim: dict[str, Any],
    quality: dict[str, Any],
    scene_ids: set[str],
    metrics: dict[str, Any],
) -> None:
    if not isinstance(inventory, dict):
        add(findings, "error", "invalid_asset_inventory", "Asset inventory must be a JSON object.", root)
        return
    assets = inventory.get("assets")
    if not isinstance(assets, list):
        add(findings, "error", "invalid_asset_list", "Asset inventory assets must be an array.", root)
        return
    try:
        minimum_ppi = float(quality.get("minimumEffectiveImagePpi"))
    except (TypeError, ValueError):
        minimum_ppi = 300.0
    if not positive_number(minimum_ppi) or minimum_ppi <= 0:
        minimum_ppi = 300.0
    seen: set[str] = set()
    imported = 0
    print_assets = 0
    observed_ppi: list[float] = []
    for index, asset in enumerate(assets):
        if not isinstance(asset, dict):
            add(findings, "error", "invalid_asset_entry", f"Asset entry {index + 1} must be an object.", root)
            continue
        asset_id = asset.get("id")
        if not isinstance(asset_id, str) or not SAFE_ID.fullmatch(asset_id):
            add(findings, "error", "invalid_asset_id", f"Asset entry {index + 1} needs a safe non-empty id.", root)
            continue
        if asset_id in seen:
            add(findings, "error", "duplicate_asset_id", f"Asset id {asset_id} appears more than once.", root)
        seen.add(asset_id)
        if not isinstance(first(asset, "originalFilename", "original_filename"), str) or not first(asset, "originalFilename", "original_filename").strip():
            add(findings, "error", "missing_asset_filename", f"Asset {asset_id} is missing originalFilename.", root)
        state = first(asset, "binaryState", "binary_state")
        classification = asset.get("classification")
        if not isinstance(state, str) or not state.strip():
            add(findings, "error", "invalid_asset_binary_state", f"Asset {asset_id} needs a non-empty binaryState.", root)
        elif state not in KNOWN_ASSET_STATES:
            add(findings, "warning", "unknown_asset_binary_state", f"Asset {asset_id} uses extension binaryState {state!r}; built-in checks cannot infer its safety.", root)
        if not isinstance(classification, str) or not classification.strip():
            add(findings, "error", "invalid_asset_classification", f"Asset {asset_id} needs a non-empty classification.", root)
        elif classification not in KNOWN_ASSET_CLASSIFICATIONS:
            add(findings, "warning", "unknown_asset_classification", f"Asset {asset_id} uses extension classification {classification!r}; it is not treated as print-ready.", root)
        repository_path = first(asset, "repositoryPath", "repository_path")
        asset_path = resolve_inside(publication, repository_path) if repository_path is not None else None
        if state == "imported":
            imported += 1
            if asset_path is None:
                add(findings, "error", "imported_asset_path_missing", f"Imported asset {asset_id} needs a publication-local repositoryPath.", root)
            elif not asset_path.is_file():
                add(findings, "error", "imported_asset_missing", f"Imported asset {asset_id} points to a missing file.", root, asset_path)
        elif repository_path is not None:
            add(findings, "error", "unimported_asset_claims_path", f"Asset {asset_id} is not imported but claims a repositoryPath.", root)
        dimensions = first(asset, "dimensionsPx", "measuredDimensionsPx", "known_dimensions_px")
        placement = asset.get("placement") if isinstance(asset.get("placement"), dict) else {}
        placement_units = placement.get("units", trim.get("units", "in"))
        placement_width = inches(placement.get("width"), placement_units) if "width" in placement else None
        placement_height = inches(placement.get("height"), placement_units) if "height" in placement else None
        if placement and (placement_width is None or placement_height is None):
            add(findings, "error", "invalid_asset_placement", f"Asset {asset_id} placement needs positive width/height and known units.", root)
        if classification in {"print", "released"} and (placement_width is None or placement_height is None):
            add(findings, "error", "print_asset_placement_missing", f"Print asset {asset_id} needs explicit placed width and height; do not infer them from the trim.", root)
        declared_dimensions = None
        if dimensions is not None:
            dimensions_valid = (
                isinstance(dimensions, list)
                and len(dimensions) == 2
                and all(is_int(value) and value > 0 for value in dimensions)
            )
            if dimensions_valid:
                declared_dimensions = (int(dimensions[0]), int(dimensions[1]))
            else:
                add(findings, "error", "invalid_asset_dimensions", f"Asset {asset_id} dimensionsPx must be two positive integers.", root)

        measured = None
        if asset_path is not None and asset_path.is_file() and probe_dimensions is not None:
            measured = probe_dimensions(asset_path)
        actual_dimensions = (measured.width, measured.height) if measured is not None else None
        if declared_dimensions is not None and actual_dimensions is not None and declared_dimensions != actual_dimensions:
            level = "error" if classification in {"print", "released"} else "warning"
            add(findings, level, "asset_dimensions_mismatch", f"Asset {asset_id} declares {declared_dimensions[0]}×{declared_dimensions[1]} but the binary measures {actual_dimensions[0]}×{actual_dimensions[1]}.", root, asset_path)
        dimensions_for_ppi = actual_dimensions or declared_dimensions
        if dimensions_for_ppi is not None and positive_number(placement_width) and positive_number(placement_height):
            effective = min(float(dimensions_for_ppi[0]) / float(placement_width), float(dimensions_for_ppi[1]) / float(placement_height))
            observed_ppi.append(effective)
            if effective < minimum_ppi:
                level = "error" if classification in {"print", "released"} else "warning"
                add(findings, level, "asset_effective_ppi_low", f"Asset {asset_id} resolves to {effective:.1f} effective PPI; the manifest requires {minimum_ppi:g}.", root)
        elif classification in {"print", "released"}:
            source_format_value = asset.get("sourceFormat")
            if not source_format_value and asset_path is not None:
                source_format_value = asset_path.suffix.lstrip(".")
            source_format = str(source_format_value or "").lower()
            vector_asset = asset.get("vectorGeometry") is True or source_format in {"svg", "pdf", "ai", "eps"}
            if vector_asset:
                add(findings, "warning", "vector_asset_manual_review", f"Print asset {asset_id} is a vector or layered format; verify placed geometry, line weight, flattening, and export profile explicitly.", root)
            else:
                add(findings, "error", "print_asset_dimensions_unverifiable", f"Print asset {asset_id} has no measurable raster dimensions; record an explicit vector workflow or provide a readable raster binary.", root)
        if classification in {"print", "released"}:
            print_assets += 1
            if state != "imported":
                add(findings, "error", "print_asset_not_imported", f"Print asset {asset_id} must reference an imported binary.", root)
            if asset.get("approval") != "approved":
                add(findings, "error", "print_asset_not_approved", f"Print asset {asset_id} needs approval before print status.", root)
            provenance = asset.get("provenance")
            if not isinstance(provenance, dict) or not any(str(value).strip() for value in provenance.values()):
                add(findings, "error", "print_asset_provenance_missing", f"Print asset {asset_id} needs a provenance record.", root)
        references = first(asset, "sceneIds", "scene_affinity", default=[])
        if references is not None:
            if not isinstance(references, list):
                add(findings, "error", "invalid_asset_scene_references", f"Asset {asset_id} scene references must be an array.", root)
            else:
                for reference in references:
                    if not isinstance(reference, str) or (scene_ids and reference not in scene_ids):
                        add(findings, "error", "unknown_asset_scene_reference", f"Asset {asset_id} references unknown scene {reference!r}.", root)
    if page_count > 0 and not assets:
        add(findings, "warning", "asset_inventory_empty", "The interior is paginated but no asset evidence is recorded.", root)
    metrics.update({
        "assetCount": len(seen),
        "importedAssetCount": imported,
        "printAssetCount": print_assets,
        "minimumObservedEffectivePpi": round(min(observed_ppi), 1) if observed_ppi else None,
    })


def inspect_publication(root: Path, slug: str) -> dict[str, Any]:
    root = root.resolve()
    findings: list[Finding] = []
    metrics: dict[str, Any] = {
        "pageCount": 0,
        "editionId": None,
        "sceneCount": 0,
        "assetCount": 0,
        "importedAssetCount": 0,
        "printAssetCount": 0,
        "minimumObservedEffectivePpi": None,
    }
    if not SAFE_ID.fullmatch(slug):
        add(findings, "error", "invalid_publication_id", "Publication id must contain lowercase letters, numbers, and hyphens.", root)
        return result(root, slug, findings, metrics, False)
    publication = root / "books" / slug
    if not publication.is_dir():
        add(findings, "error", "publication_missing", f"Publication directory books/{slug} is missing.", root)
        return result(root, slug, findings, metrics, False)
    manifest_path = publication / "production" / "manifest.json"
    manifest = read_json(manifest_path, findings, root)
    if not isinstance(manifest, dict):
        return result(root, slug, findings, metrics, False)

    if manifest.get("schemaVersion") != SCHEMA_VERSION:
        add(findings, "error", "unsupported_schema_version", f"Production manifest must use schemaVersion {SCHEMA_VERSION}.", root, manifest_path)
    if manifest.get("publicationId") != slug:
        add(findings, "error", "publication_id_mismatch", f"Manifest publicationId must match the folder slug {slug!r}.", root, manifest_path)
    kind = manifest.get("kind")
    if kind is not None and (not isinstance(kind, str) or not KIND_RE.fullmatch(kind)):
        add(findings, "error", "invalid_production_kind", "kind must be an open, namespaced lowercase identifier when present.", root, manifest_path)
    status = manifest.get("status")
    if not isinstance(status, str) or not STATUS_RE.fullmatch(status):
        add(findings, "error", "invalid_production_status", "status must be an open, namespaced lowercase identifier.", root, manifest_path)

    target = manifest.get("target")
    if not isinstance(target, dict) or not str(target.get("platform") or "").strip() or not str(target.get("product") or "").strip():
        add(findings, "error", "invalid_production_target", "Target must identify platform and product.", root, manifest_path)
    format_value = manifest.get("format")
    format_present = format_value is not None
    if format_value is None:
        format_data = {}
    elif isinstance(format_value, dict):
        format_data = format_value
    else:
        add(findings, "error", "invalid_format_contract", "Format must be an object when present.", root, manifest_path)
        format_data = {}
    if format_data:
        medium = format_data.get("medium")
        if not isinstance(medium, str) or not re.fullmatch(r"^[a-z][a-z0-9._-]*(?:/[a-z][a-z0-9._-]*)*$", medium):
            add(findings, "error", "invalid_format_medium", "Format needs a namespaced medium identifier such as print/paperback or digital/epub.", root, manifest_path)
    trim = format_data.get("trim") if isinstance(format_data.get("trim"), dict) else {}
    if "trim" in format_data and (not positive_number(trim.get("width")) or not positive_number(trim.get("height")) or trim.get("units") not in {"in", "mm", "cm"}):
        add(findings, "error", "invalid_trim", "Trim needs positive width/height and units in, mm, or cm.", root, manifest_path)
    interior = format_data.get("interior")
    if "interior" in format_data and (not isinstance(interior, dict) or not str(interior.get("ink") or "").strip() or not str(interior.get("paper") or "").strip()):
        add(findings, "error", "invalid_interior", "Interior, when present, must identify ink and paper.", root, manifest_path)
    if "pageCount" in format_data and (format_data.get("pageCount") is not None and (not is_int(format_data.get("pageCount")) or format_data.get("pageCount") < 0)):
        add(findings, "error", "invalid_page_count", "Format pageCount must be null or a non-negative integer.", root, manifest_path)
    if "bleed" in format_data and not isinstance(format_data.get("bleed"), bool):
        add(findings, "error", "invalid_bleed", "Format bleed must be boolean when present.", root, manifest_path)
    if "spineText" in format_data and not isinstance(format_data.get("spineText"), bool):
        add(findings, "error", "invalid_spine_text", "Format spineText must be boolean when present.", root, manifest_path)

    requirements = manifest.get("requires")
    if requirements is None:
        requirements = {}
    if not isinstance(requirements, dict):
        add(findings, "error", "invalid_requirements", "requires must be an object when present.", root, manifest_path)
        requirements = {}
    for requirement, value in requirements.items():
        if not isinstance(value, bool):
            add(findings, "error", "invalid_requirement", f"requires.{requirement} must be boolean when present.", root, manifest_path)
        elif requirement not in KNOWN_CAPABILITIES:
            add(findings, "warning", "production_capability_unvalidated", f"Capability {requirement!r} is preserved but has no built-in validator in this release.", root, manifest_path)

    def required_capability(name: str) -> bool:
        return requirements.get(name) is True

    canonical = manifest.get("canonicalPaths")
    if canonical is None:
        canonical = {}
    if not isinstance(canonical, dict):
        add(findings, "error", "invalid_canonical_paths", "canonicalPaths must be an object when present.", root, manifest_path)
        canonical = {}
    edition_id = manifest.get("editionId")
    if edition_id is not None and (not isinstance(edition_id, str) or not SAFE_ID.fullmatch(edition_id)):
        add(findings, "error", "invalid_edition_id", "editionId must be a safe lowercase identifier when present.", root, manifest_path)
    edition_path = validate_relative_link(findings, root, publication, canonical.get("edition"), "edition", required=False)
    edition = read_json(edition_path, findings, root, required=False) if edition_path else None
    if isinstance(edition, dict):
        if edition_id and edition.get("id") and edition.get("id") != edition_id:
            add(findings, "error", "edition_id_mismatch", f"Manifest editionId {edition_id!r} does not match linked edition id {edition.get('id')!r}.", root, edition_path)
        edition_trim = edition.get("trim") if isinstance(edition.get("trim"), dict) else {}
        if edition_trim and trim:
            for axis in ("width", "height"):
                edition_value = edition_trim.get(axis)
                manifest_value = trim.get(axis)
                edition_inches = inches(edition_value, edition_trim.get("units", "in"))
                manifest_inches = inches(manifest_value, trim.get("units", "in"))
                if edition_inches is None or manifest_inches is None:
                    add(findings, "error", "invalid_edition_trim", f"Linked edition trim {axis} is not a positive number with known units.", root, edition_path)
                elif abs(edition_inches - manifest_inches) > 0.001:
                    add(findings, "error", "edition_trim_mismatch", "Linked edition trim differs from the production manifest format.", root, edition_path)
        edition_interior = edition.get("interior") if isinstance(edition.get("interior"), dict) else {}
        if edition_interior and isinstance(format_data.get("interior"), dict):
            for field in ("ink", "paper"):
                if field in edition_interior and field in format_data["interior"] and edition_interior[field] != format_data["interior"][field]:
                    add(findings, "error", "edition_interior_mismatch", f"Linked edition {field} differs from the production manifest format.", root, edition_path)
            if "bleed" in edition_interior and "bleed" in format_data and edition_interior["bleed"] != format_data["bleed"]:
                add(findings, "error", "edition_interior_mismatch", "Linked edition bleed differs from the production manifest format.", root, edition_path)
        edition_page_count = edition_interior.get("pageCount") if edition_interior else None
        manifest_page_count = format_data.get("pageCount")
        if edition_page_count is not None and manifest_page_count is not None and edition_page_count != manifest_page_count:
            add(findings, "error", "edition_page_count_mismatch", "Linked edition page count differs from the production manifest format.", root, edition_path)
        edition_target = edition.get("target")
        if edition_target and isinstance(target, dict):
            target_platform = str(edition_target).lower() if isinstance(edition_target, str) else str(edition_target.get("platform") or "").lower()
            if target_platform and target_platform != str(target.get("platform") or "").lower():
                add(findings, "error", "edition_target_mismatch", "Linked edition target differs from the production manifest target.", root, edition_path)
        if not format_data:
            edition_interior = edition.get("interior") if isinstance(edition.get("interior"), dict) else {}
            raw_medium = str(edition.get("medium") or "print").lower()
            medium = {
                "print": "print/paperback",
                "ebook": "digital/ebook",
                "epub": "digital/ebook",
                "audio": "digital/audio",
            }.get(raw_medium, edition.get("medium") or "print/paperback")
            format_data = {
                "medium": medium,
            }
            if isinstance(edition.get("trim"), dict):
                format_data["trim"] = edition["trim"]
            if edition_interior:
                format_data["interior"] = {key: edition_interior.get(key) for key in ("ink", "paper") if key in edition_interior}
                if "pageCount" in edition_interior:
                    format_data["pageCount"] = edition_interior.get("pageCount")
                if "bleed" in edition_interior:
                    format_data["bleed"] = edition_interior.get("bleed")
    if not format_present and format_data:
        medium = format_data.get("medium")
        if not isinstance(medium, str) or not re.fullmatch(r"^[a-z][a-z0-9._-]*(?:/[a-z][a-z0-9._-]*)*$", medium):
            add(findings, "error", "invalid_format_medium", "Linked edition needs a namespaced format medium.", root, edition_path)
        if "trim" in format_data:
            linked_trim = format_data.get("trim") if isinstance(format_data.get("trim"), dict) else {}
            if not positive_number(linked_trim.get("width")) or not positive_number(linked_trim.get("height")) or linked_trim.get("units") not in {"in", "mm", "cm"}:
                add(findings, "error", "invalid_trim", "Linked edition trim needs positive width/height and units in, mm, or cm.", root, edition_path)
        if "interior" in format_data:
            linked_interior = format_data.get("interior")
            if not isinstance(linked_interior, dict) or not str(linked_interior.get("ink") or "").strip() or not str(linked_interior.get("paper") or "").strip():
                add(findings, "error", "invalid_interior", "Linked edition interior must identify ink and paper.", root, edition_path)
    trim = format_data.get("trim") if isinstance(format_data.get("trim"), dict) else {}
    if edition_id:
        metrics["editionId"] = edition_id
    page_map_path = validate_relative_link(
        findings,
        root,
        publication,
        canonical.get("pageMap"),
        "pageMap",
        required=required_capability("pageMap"),
    )
    page_map = read_json(page_map_path, findings, root, required=False) if page_map_path else None
    if page_map is not None:
        pages, page_count = validate_page_map(findings, root, publication, page_map, manifest, format_data, metrics)
    else:
        pages = []
        page_count = format_data.get("pageCount") if is_int(format_data.get("pageCount")) else 0
        metrics["pageCount"] = page_count
        if page_count > 0 and not required_capability("pageMap"):
            add(findings, "info", "page_map_not_declared", "This contract records a page count but does not require a page map.", root, manifest_path)

    scene_plan_path = validate_relative_link(
        findings,
        root,
        publication,
        canonical.get("scenePlan"),
        "scenePlan",
        required=required_capability("scenePlan"),
    )
    scene_plan = read_json(scene_plan_path, findings, root, required=False) if scene_plan_path else None
    scene_ids = validate_scene_plan(findings, root, publication, scene_plan, manifest, pages, page_count, metrics) if scene_plan is not None else set()

    asset_path = validate_relative_link(
        findings,
        root,
        publication,
        canonical.get("assetInventory"),
        "assetInventory",
        required=required_capability("assetInventory"),
    )
    inventory = read_json(asset_path, findings, root, required=False) if asset_path else None
    quality_value = manifest.get("qualityGates")
    quality = quality_value if isinstance(quality_value, dict) else {}
    if quality_value is not None and not isinstance(quality_value, dict):
        add(findings, "error", "invalid_quality_gates", "qualityGates must be an object when present.", root, manifest_path)
    if "physicalProofRequired" in quality and not isinstance(quality.get("physicalProofRequired"), bool):
        add(findings, "error", "invalid_proof_gate", "qualityGates.physicalProofRequired must be boolean when present.", root, manifest_path)
    if "minimumEffectiveImagePpi" in quality and not positive_number(quality.get("minimumEffectiveImagePpi")):
        add(findings, "error", "invalid_ppi_gate", "qualityGates.minimumEffectiveImagePpi must be a positive number when present.", root, manifest_path)
    layout_contract = manifest.get("layout") if isinstance(manifest.get("layout"), dict) else {}
    if layout_contract.get("blankReverse") is True and not str(layout_contract.get("blankReversePolicy") or "").strip():
        add(findings, "warning", "blank_reverse_policy_missing", "Intentional blank reverses need a stated reason for target review.", root, manifest_path)
    if layout_contract.get("blankReverse") is True and str(status) in KNOWN_FINAL_STATUSES and quality.get("intentionalBlankPagesReviewed") is not True:
        add(findings, "warning", "intentional_blank_pages_unreviewed", "Intentional blank/reverse pages must be reviewed in the target platform preview before final readiness.", root, manifest_path)
    validate_asset_inventory(findings, root, publication, inventory, page_count, trim, quality, scene_ids, metrics) if inventory is not None else None
    validate_scene_asset_references(findings, root, scene_plan, inventory)

    presets = load_presets(root, findings)
    validate_target(findings, root, manifest, format_data, trim, page_count, presets)
    if (
        paperback_geometry is not None
        and isinstance(target, dict)
        and str(target.get("platform") or "").lower() in {"amazon-kdp", "kdp", "amazon"}
        and str(target.get("product") or "").lower() in {"paperback", "perfect-bound"}
        and trim
        and isinstance(format_data.get("interior"), dict)
    ):
        try:
            metrics["geometry"] = paperback_geometry(
                presets,
                width=float(trim["width"]),
                height=float(trim["height"]),
                units=str(trim.get("units") or "in"),
                ink=str(format_data["interior"].get("ink") or ""),
                paper=str(format_data["interior"].get("paper") or ""),
                page_count=page_count,
                bleed=bool(format_data.get("bleed", False)),
            )
        except (KeyError, TypeError, ValueError) as exc:
            add(findings, "warning", "geometry_calculation_failed", f"Could not calculate source-preflight geometry: {exc}", root)

    print_spec_path = validate_relative_link(
        findings,
        root,
        publication,
        canonical.get("printArtSpec"),
        "printArtSpec",
        required=required_capability("printArtSpec"),
    )
    if print_spec_path and print_spec_path.is_file():
        read_text(print_spec_path, findings, root, required=False)
    checklist_path = validate_relative_link(
        findings,
        root,
        publication,
        canonical.get("qaChecklist"),
        "qaChecklist",
        required=required_capability("qaChecklist"),
    )
    if checklist_path and checklist_path.is_file():
        checklist = read_text(checklist_path, findings, root, required=False) or ""
        unchecked = len(re.findall(r"^- \[ \]", checklist, re.MULTILINE))
        if unchecked and str(status) in KNOWN_FINAL_STATUSES:
            add(findings, "warning", "qa_checklist_incomplete", f"QA checklist still has {unchecked} unchecked item{'s' if unchecked != 1 else ''}.", root, checklist_path)
    proof_required = quality.get("physicalProofRequired") is True
    proof_status = quality.get("physicalProofStatus", "pending")
    if proof_required and str(status) in KNOWN_FINAL_STATUSES and proof_status not in {"approved", "waived", "not-applicable"}:
        add(findings, "warning", "physical_proof_pending", "Physical proof is required but not recorded as approved or waived.", root, manifest_path)

    if status == "published" and proof_required and proof_status == "pending":
        add(findings, "error", "published_without_proof", "A published print production manifest cannot retain a pending physical-proof gate.", root, manifest_path)
    metrics["manifestStatus"] = status
    return result(root, slug, findings, metrics, True)


def result(
    root: Path,
    slug: str,
    findings: list[Finding],
    metrics: dict[str, Any],
    manifest_loaded: bool,
) -> dict[str, Any]:
    summary = {level: sum(item.level == level for item in findings) for level in ("error", "warning", "info", "ok")}
    healthy = summary["error"] == 0
    status = "blocked" if not healthy else "ready" if summary["warning"] == 0 and metrics.get("pageCount", 0) > 0 and metrics.get("manifestStatus") in KNOWN_FINAL_STATUSES else "in-progress"
    return {
        "root": str(root),
        "publicationId": slug,
        "manifestLoaded": manifest_loaded,
        "healthy": healthy,
        "productionStatus": status,
        "summary": summary,
        "metrics": metrics,
        "findings": [item.as_dict() for item in findings],
    }


def inspect_all(root: Path) -> dict[str, Any]:
    root = root.resolve()
    publications: list[dict[str, Any]] = []
    books = root / "books"
    if books.is_dir():
        for publication in sorted(books.iterdir()):
            if not publication.is_dir() or publication.name.startswith("_") or not SAFE_ID.fullmatch(publication.name):
                continue
            if (publication / "production" / "manifest.json").is_file():
                publications.append(inspect_publication(root, publication.name))
    return {
        "root": str(root),
        "healthy": all(item["healthy"] for item in publications),
        "publicationCount": len(publications),
        "publications": publications,
    }


def print_result(payload: dict[str, Any]) -> None:
    if "publications" not in payload:
        print(f"Production contract: {payload['publicationId']}")
        for item in payload["findings"]:
            location = f" ({item['path']})" if item.get("path") else ""
            print(f"{item['level'].upper():7} {item['code']}: {item['message']}{location}")
        print(f"Production status: {payload['productionStatus']} · {payload['summary']['error']} error(s), {payload['summary']['warning']} warning(s)")
        return
    print(f"Production contracts: {payload['publicationCount']} manifest(s) under {payload['root']}")
    for publication in payload["publications"]:
        print(f"- {publication['publicationId']}: {publication['productionStatus']} ({publication['summary']['error']} error(s), {publication['summary']['warning']} warning(s))")
    print(f"Overall: {'healthy' if payload['healthy'] else 'blocked'}")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("slug", nargs="?", help="Publication slug; omit to check every publication manifest")
    parser.add_argument("--root", default=".", help="Bookself repository root (default: current directory)")
    parser.add_argument("--json", action="store_true", dest="as_json", help="Emit machine-readable JSON")
    parser.add_argument("--strict", action="store_true", help="Treat warnings as blocking failures")
    args = parser.parse_args(argv)
    root = Path(args.root)
    payload = inspect_publication(root, args.slug) if args.slug else inspect_all(root)
    if args.as_json:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
    else:
        print_result(payload)
    findings = payload.get("findings", []) if "publications" not in payload else [item for publication in payload["publications"] for item in publication["findings"]]
    failed = not payload["healthy"] or (args.strict and any(item["level"] == "warning" for item in findings))
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
