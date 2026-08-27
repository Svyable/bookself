#!/usr/bin/env python3
"""Validate Bookself publication rights manifests without making legal conclusions."""
from __future__ import annotations

import argparse
import json
import re
from dataclasses import asdict, dataclass
from pathlib import Path

SAFE_SLUG = re.compile(r"^[a-z0-9][a-z0-9-]*$")
TITLE_RE = re.compile(r"^#\s+(.+?)\s*$", re.M)
ARR_FALSE = (
    "reproduction", "distribution", "derivatives", "commercialUse",
    "aiTraining", "aiGenerativeUse", "aiRetrievalGrounding", "aiIndexing",
    "syntheticNarration", "syntheticTranslation",
)

@dataclass(frozen=True)
class Finding:
    level: str
    code: str
    publication: str
    message: str

def add(out, level, code, slug, message):
    out.append(Finding(level, code, slug, message))

def real_publications(root: Path):
    books = root / "books"
    if not books.is_dir():
        return []
    return sorted(p for p in books.iterdir() if p.is_dir() and not p.name.startswith("_") and SAFE_SLUG.fullmatch(p.name))

def expected_title(readme: Path):
    if not readme.is_file():
        return ""
    match = TITLE_RE.search(readme.read_text(encoding="utf-8"))
    return match.group(1).strip() if match else ""

def inspect_publication(pub: Path):
    out = []
    slug = pub.name
    human = pub / "RIGHTS.md"
    machine = pub / "rights.json"
    if not human.is_file():
        add(out, "error", "missing_rights_file", slug, "RIGHTS.md is missing.")
    if not machine.is_file():
        add(out, "error", "missing_rights_manifest", slug, "rights.json is missing.")
        return out
    try:
        data = json.loads(machine.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        add(out, "error", "invalid_rights_json", slug, f"rights.json is not readable JSON: {exc}")
        return out
    if data.get("schemaVersion") != 1:
        add(out, "error", "rights_schema_version", slug, "schemaVersion must be 1.")
    work = data.get("work") if isinstance(data.get("work"), dict) else {}
    copyright = data.get("copyright") if isinstance(data.get("copyright"), dict) else {}
    license_data = data.get("license") if isinstance(data.get("license"), dict) else {}
    permissions = data.get("permissions") if isinstance(data.get("permissions"), dict) else {}
    registration = data.get("registration") if isinstance(data.get("registration"), dict) else {}
    title = str(work.get("title") or "").strip()
    author = str(work.get("author") or "").strip()
    owner = str(copyright.get("owner") or "").strip()
    notice = str(copyright.get("notice") or "").strip()
    year = copyright.get("year")
    readme_title = expected_title(pub / "README.md")
    if not title:
        add(out, "error", "rights_title_missing", slug, "work.title is missing.")
    elif readme_title and title != readme_title:
        add(out, "error", "rights_title_mismatch", slug, f"rights.json title {title!r} does not match README title {readme_title!r}.")
    if not author:
        add(out, "error", "rights_author_missing", slug, "work.author is missing.")
    if not owner:
        add(out, "error", "rights_owner_missing", slug, "copyright.owner is missing.")
    if not isinstance(year, int) or not (1800 <= year <= 2200):
        add(out, "error", "rights_year_invalid", slug, "copyright.year must be a plausible integer year.")
    if owner and isinstance(year, int) and license_data.get("id") == "ARR":
        expected = f"© {year} {owner}. All Rights Reserved."
        if notice != expected:
            add(out, "error", "rights_notice_mismatch", slug, f"ARR notice must be exactly {expected!r}.")
    if str(license_data.get("file") or "").strip() != "RIGHTS.md":
        add(out, "error", "rights_file_pointer", slug, "license.file must point to RIGHTS.md.")
    if str(data.get("policy") or "").strip() == "bookself-arr-v1":
        if license_data.get("id") != "ARR" or license_data.get("label") != "All Rights Reserved":
            add(out, "error", "arr_license_mismatch", slug, "bookself-arr-v1 requires ARR / All Rights Reserved.")
        if permissions.get("publicReading") is not True or permissions.get("conventionalSearch") is not True:
            add(out, "error", "arr_reading_search", slug, "bookself-arr-v1 requires publicReading=true and conventionalSearch=true.")
        for key in ARR_FALSE:
            if permissions.get(key) is not False:
                add(out, "error", "arr_permission_open", slug, f"bookself-arr-v1 requires permissions.{key}=false.")
    status = str(registration.get("status") or "").strip()
    number = registration.get("number")
    effective = registration.get("effectiveDate")
    if status == "registered":
        if not str(number or "").strip() or not str(effective or "").strip():
            add(out, "error", "registration_incomplete", slug, "registered status requires a deliberately recorded registration number and effectiveDate.")
    elif status == "not-recorded-in-bookself":
        if number is not None or effective is not None:
            add(out, "error", "registration_unasserted_has_data", slug, "not-recorded-in-bookself must keep number and effectiveDate null.")
    elif status not in {"pending", "preregistered", "refused"}:
        add(out, "error", "registration_status_invalid", slug, "registration.status is not recognized.")
    if not out:
        add(out, "ok", "rights_valid", slug, "Rights file and manifest are internally consistent.")
    return out

def inspect(root: Path):
    out = []
    for pub in real_publications(root.resolve()):
        out.extend(inspect_publication(pub))
    return out

def main(argv=None):
    parser = argparse.ArgumentParser(description="Validate Bookself RIGHTS.md and rights.json files.")
    parser.add_argument("--root", default=".")
    parser.add_argument("--json", action="store_true", dest="as_json")
    args = parser.parse_args(argv)
    findings = inspect(Path(args.root))
    errors = [f for f in findings if f.level == "error"]
    if args.as_json:
        print(json.dumps({"healthy": not errors, "findings": [asdict(f) for f in findings]}, indent=2))
    else:
        for f in findings:
            print(f"{'✓' if f.level == 'ok' else '✗'} {f.publication}: {f.message}")
        print(f"\nRights health: {len(errors)} error{'s' if len(errors) != 1 else ''}.")
    return 1 if errors else 0

if __name__ == "__main__":
    raise SystemExit(main())
