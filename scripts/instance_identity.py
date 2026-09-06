#!/usr/bin/env python3
"""Stamp instance-owned Reader identity after shared Bookself UI is copied."""

from __future__ import annotations

import html
import json
import re
from pathlib import Path


def _replace_meta(content: str, name: str, value: str) -> str:
    escaped = html.escape(value, quote=True)
    pattern = re.compile(
        rf'(<meta\s+name=["\']{re.escape(name)}["\']\s+content=["\'])[^"\']*(["\'])',
        re.IGNORECASE,
    )
    return pattern.sub(rf'\1{escaped}\2', content, count=1)


def stamp_reader_identity(destination: Path) -> None:
    """Apply destination imprint identity to identity-bearing Reader files.

    Shared Reader/Desk behavior is copied from Bookself. The destination's
    imprint remains the source of truth for public-facing identity, so this
    function re-stamps native install metadata and first-paint fallback text
    after every upgrade.
    """

    imprint_path = destination / "imprint.json"
    if not imprint_path.is_file():
        raise SystemExit(f"instance imprint missing: {imprint_path}")

    imprint = json.loads(imprint_path.read_text(encoding="utf-8"))
    name = str(imprint.get("name") or "Bookself").strip()
    short_name = str(imprint.get("shortName") or name).strip()
    description = str(imprint.get("description") or "").strip()
    home_label = str(imprint.get("homeLabel") or short_name).strip()
    kicker = str(imprint.get("kicker") or "").strip()
    lede = str(imprint.get("lede") or "").strip()

    manifest_path = destination / "reader" / "manifest.webmanifest"
    if manifest_path.is_file():
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        manifest["name"] = name
        manifest["short_name"] = short_name
        if description:
            manifest["description"] = description
        manifest_path.write_text(
            json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )

    icon_path = destination / "reader" / "app-icon.svg"
    if icon_path.is_file():
        icon = icon_path.read_text(encoding="utf-8")
        escaped_name = html.escape(name)
        if re.search(r"<title(?:\s+[^>]*)?>.*?</title>", icon, flags=re.IGNORECASE | re.DOTALL):
            icon = re.sub(
                r"<title(?:\s+([^>]*))?>.*?</title>",
                lambda m: f"<title{(' ' + m.group(1)) if m.group(1) else ''}>{escaped_name}</title>",
                icon,
                count=1,
                flags=re.IGNORECASE | re.DOTALL,
            )
        icon_path.write_text(icon, encoding="utf-8")

    index_path = destination / "reader" / "index.html"
    if index_path.is_file():
        page = index_path.read_text(encoding="utf-8")
        escaped_name = html.escape(name)
        escaped_home = html.escape(home_label)
        page = re.sub(r"<title>.*?</title>", f"<title>{escaped_name}</title>", page, count=1, flags=re.DOTALL)
        page = _replace_meta(page, "apple-mobile-web-app-title", short_name)
        if description:
            page = _replace_meta(page, "description", description)
        page = re.sub(
            r'(<button\s+class="logo"\s+id="logoBtn"[^>]*title=")[^"]*("[^>]*aria-label=")[^"]*(")',
            rf'\1{html.escape(name, quote=True)}\2{html.escape(name, quote=True)}\3',
            page,
            count=1,
        )
        if kicker:
            page = re.sub(
                r'(<p\s+class="library-kicker">).*?(</p>)',
                rf'\1{html.escape(kicker)}\2',
                page,
                count=1,
                flags=re.DOTALL,
            )
        page = re.sub(
            r'(<div\s+class="library-hero">.*?<h1>).*?(</h1>)',
            rf'\1{escaped_name}\2',
            page,
            count=1,
            flags=re.DOTALL,
        )
        if lede:
            page = re.sub(
                r'(<p\s+class="library-lede">).*?(</p>)',
                rf'\1{html.escape(lede)}\2',
                page,
                count=1,
                flags=re.DOTALL,
            )
        page = re.sub(
            r'(<button\s+class="cover-text-btn"\s+id="homeFromEnd"[^>]*>).*?(</button>)',
            rf'\1{escaped_home}\2',
            page,
            count=1,
            flags=re.DOTALL,
        )
        index_path.write_text(page, encoding="utf-8")
