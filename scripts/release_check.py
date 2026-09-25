#!/usr/bin/env python3
"""Verify Bookself release.json provenance against a Shelf publication snapshot."""

from __future__ import annotations

import argparse
from hashlib import sha256
import json
from pathlib import Path
import re
from typing import Any

SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")
LEVELS = ("error", "warning", "info", "ok")


def is_int(value: object) -> bool:
    return isinstance(value, int) and not isinstance(value, bool)


def digest_file(path: Path) -> str:
    digest = sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def payload_manifest(publication: Path) -> dict[str, str]:
    files: dict[str, str] = {}
    if not publication.is_dir():
        return files
    for path in sorted(item for item in publication.rglob("*") if item.is_file()):
        rel = path.relative_to(publication).as_posix()
        if rel in {"README.md", "release.json", ".DS_Store"}:
            continue
        files[rel] = digest_file(path)
    return files


def payload_digest(files: dict[str, str]) -> str:
    encoded = json.dumps(files, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return sha256(encoded).hexdigest()


def finding(level: str, code: str, message: str, path: str | None = None) -> dict[str, str | None]:
    return {"level": level, "code": code, "message": message, "path": path}


def inspect_release(root: Path, slug: str) -> dict[str, Any]:
    root = root.resolve()
    findings: list[dict[str, str | None]] = []
    publication = root / "books" / slug
    record_path = publication / "release.json"
    if not SLUG_RE.fullmatch(slug):
        findings.append(finding("error", "invalid_publication_id", "Publication id must use lowercase letters, numbers, and hyphens.", str(record_path)))
        return result(root, slug, findings, {})
    if not record_path.is_file():
        findings.append(finding("error", "missing_release_provenance", "release.json is missing.", str(record_path)))
        return result(root, slug, findings, {})
    try:
        record = json.loads(record_path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        findings.append(finding("error", "invalid_release_json", f"Could not read release.json: {exc}", str(record_path)))
        return result(root, slug, findings, {})
    if not isinstance(record, dict):
        findings.append(finding("error", "invalid_release_json", "release.json must contain an object.", str(record_path)))
        return result(root, slug, findings, {})
    for field in ("schemaVersion", "kind", "publicationId", "sourceCommit", "payload", "tool"):
        if field not in record:
            findings.append(finding("error", "release_field_missing", f"release.json is missing {field}.", str(record_path)))
    if record.get("schemaVersion") != 1:
        findings.append(finding("error", "release_schema_unsupported", "release.json schemaVersion must be 1.", str(record_path)))
    if record.get("kind") != "bookself-release":
        findings.append(finding("error", "release_kind_invalid", "release.json kind must be bookself-release.", str(record_path)))
    if record.get("publicationId") != slug:
        findings.append(finding("error", "release_publication_mismatch", "release.json publicationId does not match the folder slug.", str(record_path)))
    source_commit = record.get("sourceCommit")
    if not isinstance(source_commit, str) or not re.fullmatch(r"[0-9a-f]{40}", source_commit):
        findings.append(finding("error", "release_source_commit_invalid", "sourceCommit must be a full 40-character Git object id.", str(record_path)))
    tool = record.get("tool")
    if not isinstance(tool, dict) or not isinstance(tool.get("name"), str) or not tool.get("name", "").strip() or not is_int(tool.get("version")) or tool.get("version", 0) < 1:
        findings.append(finding("error", "release_tool_invalid", "tool must identify a name and positive integer version.", str(record_path)))
    payload = record.get("payload")
    if not isinstance(payload, dict):
        findings.append(finding("error", "release_payload_invalid", "release.json payload must be an object.", str(record_path)))
        return result(root, slug, findings, {})
    stored_files = payload.get("files")
    if not isinstance(stored_files, dict) or not all(isinstance(key, str) and isinstance(value, str) for key, value in stored_files.items()):
        findings.append(finding("error", "release_file_manifest_invalid", "release.json payload.files must map paths to SHA-256 strings.", str(record_path)))
        return result(root, slug, findings, {})
    if not is_int(payload.get("fileCount")) or payload.get("fileCount", -1) < 0:
        findings.append(finding("error", "release_file_count_invalid", "payload.fileCount must be a non-negative integer.", str(record_path)))
    excluded_files = payload.get("excludedFiles")
    if not isinstance(excluded_files, list) or not all(isinstance(value, str) for value in excluded_files):
        findings.append(finding("error", "release_exclusions_invalid", "payload.excludedFiles must be an array of paths.", str(record_path)))
    elif not {"README.md", "release.json"}.issubset(set(excluded_files)):
        findings.append(finding("error", "release_exclusions_incomplete", "payload.excludedFiles must record README.md and release.json.", str(record_path)))
    current_files = payload_manifest(publication)
    current_digest = payload_digest(current_files)
    if payload.get("algorithm") != "sha256":
        findings.append(finding("error", "release_algorithm_invalid", "release.json payload algorithm must be sha256.", str(record_path)))
    if payload.get("digest") != current_digest:
        findings.append(finding("error", "release_payload_digest_mismatch", f"Stored payload digest {payload.get('digest')!r} does not match current payload {current_digest}.", str(record_path)))
    if payload.get("files") != current_files:
        findings.append(finding("error", "release_file_manifest_mismatch", "Stored payload file hashes do not match the current publication payload.", str(record_path)))
    if payload.get("fileCount") != len(current_files):
        findings.append(finding("error", "release_file_count_mismatch", f"Stored file count {payload.get('fileCount')!r} does not match current count {len(current_files)}.", str(record_path)))
    if not findings:
        findings.append(finding("ok", "release_provenance_valid", "release.json matches the current Shelf publication payload.", str(record_path)))
    return result(root, slug, findings, {"fileCount": len(current_files), "payloadDigest": current_digest, "sourceCommit": source_commit})


def result(root: Path, slug: str, findings: list[dict[str, str | None]], metrics: dict[str, Any]) -> dict[str, Any]:
    summary = {level: sum(item.get("level") == level for item in findings) for level in LEVELS}
    return {
        "root": str(root),
        "publicationId": slug,
        "healthy": summary["error"] == 0,
        "summary": summary,
        "metrics": metrics,
        "findings": findings,
    }


def inspect_all(root: Path) -> dict[str, Any]:
    root = root.resolve()
    books = root / "books"
    publications: list[dict[str, Any]] = []
    if books.is_dir():
        for path in sorted(books.iterdir()):
            if path.is_dir() and not path.name.startswith("_") and (path / "release.json").is_file():
                publications.append(inspect_release(root, path.name))
    return {"root": str(root), "healthy": all(item["healthy"] for item in publications), "publicationCount": len(publications), "publications": publications}


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("slug", nargs="?")
    parser.add_argument("--root", default=".")
    parser.add_argument("--json", action="store_true", dest="as_json")
    args = parser.parse_args(argv)
    payload = inspect_release(Path(args.root), args.slug) if args.slug else inspect_all(Path(args.root))
    if args.as_json:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
    elif "publications" in payload:
        print(f"Release provenance: {payload['publicationCount']} record(s); healthy={payload['healthy']}")
        for item in payload["publications"]:
            print(f"- {item['publicationId']}: {item['summary']}")
    else:
        for item in payload["findings"]:
            print(f"{str(item['level']).upper():7} {item['code']}: {item['message']}")
    findings = payload.get("findings", []) if "publications" not in payload else [entry for item in payload["publications"] for entry in item["findings"]]
    return 1 if not payload["healthy"] or any(item["level"] == "error" for item in findings) else 0


if __name__ == "__main__":
    raise SystemExit(main())
