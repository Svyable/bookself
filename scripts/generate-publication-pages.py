#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import sys
import textwrap
from pathlib import Path
from urllib.parse import quote

SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")
META_RE = re.compile(r"^\|\s*\*\*([^*|]+)\*\*\s*\|\s*([^|\n]+)\|\s*$", re.M)
H1_RE = re.compile(r"^#\s+(.+?)\s*$", re.M)
SUBTITLE_RE = re.compile(r"^\*([^*\n][^*\n]*?)\*\s*$", re.M)
LINK_RE = re.compile(r"\[([^\]]+)\]\([^)]+\)")
TAG_RE = re.compile(r"<[^>]+>")
WS_RE = re.compile(r"\s+")
PALETTES = [
    ("#17130f", "#efe5d2", "#9b6b45"),
    ("#10171c", "#e4edf2", "#557d93"),
    ("#17131b", "#eee5f1", "#795c84"),
    ("#111812", "#e5eee4", "#5c7a60"),
    ("#18120f", "#f0e4da", "#a45f43"),
    ("#131416", "#ececea", "#72777e"),
]


class PublicationPageError(RuntimeError):
    pass


def fail(message: str) -> None:
    raise PublicationPageError(message)


def read_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"could not read {path}: {exc}")


def normalize_site_url(value: str) -> str:
    value = str(value or "").strip()
    if not value:
        return ""
    if not re.match(r"^https?://", value, re.I):
        fail("site URL must start with http:// or https://")
    return value.rstrip("/") + "/"


def derived_site_url(imprint: dict) -> str:
    explicit = normalize_site_url(imprint.get("siteUrl") or "")
    if explicit:
        return explicit
    github = imprint.get("github") if isinstance(imprint.get("github"), dict) else {}
    owner = str(github.get("owner") or "").strip()
    repo = str(github.get("repo") or "").strip()
    if not owner or not repo:
        fail("imprint.json needs siteUrl or github.owner/github.repo")
    if repo.lower() == f"{owner.lower()}.github.io":
        return f"https://{owner}.github.io/"
    return f"https://{owner}.github.io/{repo}/"


def clean_inline(markdown: str) -> str:
    text = LINK_RE.sub(r"\1", markdown)
    text = re.sub(r"[*_`~]+", "", text)
    text = TAG_RE.sub("", text)
    return WS_RE.sub(" ", html.unescape(text)).strip()


def metadata(markdown: str) -> dict[str, str]:
    return {label.strip(): clean_inline(value) for label, value in META_RE.findall(markdown)}


def title_from_markdown(markdown: str, slug: str) -> str:
    match = H1_RE.search(markdown)
    return clean_inline(match.group(1)) if match else slug.replace("-", " ").title()


def subtitle_from_markdown(markdown: str) -> str:
    h1 = H1_RE.search(markdown)
    start = h1.end() if h1 else 0
    next_heading = re.search(r"^##\s+", markdown[start:], re.M)
    end = start + next_heading.start() if next_heading else len(markdown)
    match = SUBTITLE_RE.search(markdown[start:end])
    return clean_inline(match.group(1)) if match else ""


def first_description(markdown: str, fallback: str) -> str:
    lines = markdown.splitlines()
    saw_table = False
    paragraph: list[str] = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("## "):
            break
        if stripped.startswith("|"):
            saw_table = True
            continue
        if not saw_table:
            continue
        if not stripped:
            if paragraph:
                break
            continue
        if stripped.startswith(("#", "- ", "* ", "> ", "```")):
            continue
        paragraph.append(stripped)
    text = clean_inline(" ".join(paragraph)) or fallback
    return text if len(text) <= 260 else textwrap.shorten(text, width=257, placeholder="…")


def catalog_slugs(root: Path) -> list[str]:
    catalog = read_json(root / "catalog.json")
    books = catalog.get("books")
    if catalog.get("version") != 1 or not isinstance(books, list):
        fail("catalog.json must be version 1 with a books array")
    result, seen = [], set()
    for raw in books:
        slug = str(raw).strip()
        if not SLUG_RE.fullmatch(slug) or slug.startswith("_"):
            continue
        if slug in seen:
            fail(f"catalog.json repeats publication slug {slug}")
        seen.add(slug)
        result.append(slug)
    return result


def image_candidate(root: Path, slug: str) -> Path | None:
    book = root / "books" / slug
    candidates = [
        book / "cover.png",
        book / "cover.jpg",
        book / "cover.jpeg",
        book / "cover.webp",
        book / "media" / "cover.png",
        book / "media" / "cover.jpg",
        book / "media" / "cover.jpeg",
        book / "media" / "cover.webp",
    ]
    return next((path for path in candidates if path.is_file()), None)


def split_title(value: str, width: int = 22, max_lines: int = 4) -> list[str]:
    lines = textwrap.wrap(
        value,
        width=width,
        break_long_words=False,
        break_on_hyphens=False,
    ) or [value]
    if len(lines) > max_lines:
        lines = lines[:max_lines]
        lines[-1] = textwrap.shorten(
            lines[-1],
            width=max(8, width - 1),
            placeholder="…",
        )
    return lines


def generated_cover_svg(
    title: str,
    subtitle: str,
    author: str,
    slug: str,
    shelf_name: str,
) -> str:
    background, foreground, accent = PALETTES[
        int(hashlib.sha256(slug.encode()).hexdigest()[:8], 16) % len(PALETTES)
    ]
    lines = split_title(title)
    title_svg = "\n".join(
        f'    <text x="575" y="{190 + i * 74}" class="title">{html.escape(line)}</text>'
        for i, line in enumerate(lines)
    )
    subtitle_svg = ""
    if subtitle:
        subtitle_svg = (
            f'    <text x="575" y="{205 + len(lines) * 74}" class="subtitle">'
            f'{html.escape(textwrap.shorten(subtitle, width=72, placeholder="…"))}</text>'
        )
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title desc">
  <title id="title">{html.escape(title)} — {html.escape(author)}</title>
  <desc id="desc">Publication cover card for {html.escape(title)} on {html.escape(shelf_name)}.</desc>
  <style>
    .title {{ font: 700 58px Georgia, "Times New Roman", serif; fill: {foreground}; }}
    .subtitle {{ font: italic 27px Georgia, "Times New Roman", serif; fill: {foreground}; opacity: .78; }}
    .author {{ font: 600 22px system-ui, sans-serif; fill: {foreground}; letter-spacing: 2px; }}
    .shelf {{ font: 600 16px system-ui, sans-serif; fill: {foreground}; opacity: .64; letter-spacing: 2px; }}
  </style>
  <rect width="1200" height="630" fill="{background}"/>
  <circle cx="1090" cy="80" r="230" fill="{accent}" opacity=".16"/>
  <circle cx="1020" cy="610" r="310" fill="{accent}" opacity=".1"/>
  <rect x="90" y="70" width="375" height="490" rx="10" fill="{foreground}" opacity=".97"/>
  <rect x="90" y="70" width="22" height="490" fill="{accent}"/>
  <line x1="134" y1="116" x2="414" y2="116" stroke="{background}" opacity=".32"/>
  <text x="134" y="170" font-family="Georgia, serif" font-size="31" font-weight="700" fill="{background}">{html.escape(title)}</text>
  <text x="134" y="515" font-family="system-ui, sans-serif" font-size="17" font-weight="600" fill="{background}">{html.escape(author)}</text>
  <text x="575" y="112" class="shelf">{html.escape(shelf_name)}</text>
{title_svg}
{subtitle_svg}
  <text x="575" y="535" class="author">{html.escape(author)}</text>
</svg>
'''


def page_html(record: dict[str, str], shelf_name: str, site_url: str) -> str:
    title, author = record["title"], record["author"]
    description = record["description"]
    format_label = record["format"] or "Publication"
    json_ld = {
        "@context": "https://schema.org",
        "@type": "Book" if format_label.lower() == "book" else "CreativeWork",
        "name": title,
        "author": {"@type": "Person", "name": author},
        "description": description,
        "url": record["canonical_url"],
        "image": record["image_url"],
        "isPartOf": {
            "@type": "CollectionPage",
            "name": shelf_name,
            "url": site_url,
        },
    }
    if record["language"]:
        json_ld["inLanguage"] = record["language"]
    ld = json.dumps(json_ld, ensure_ascii=False).replace("</", "<\\/")
    subtitle = (
        f'<p class="subtitle">{html.escape(record["subtitle"])}</p>'
        if record["subtitle"]
        else ""
    )
    esc = html.escape
    return f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{esc(title)} — {esc(author)}</title>
  <meta name="description" content="{esc(description, quote=True)}">
  <meta name="author" content="{esc(author, quote=True)}">
  <link rel="canonical" href="{esc(record['canonical_url'], quote=True)}">
  <meta property="og:type" content="book">
  <meta property="og:site_name" content="{esc(shelf_name, quote=True)}">
  <meta property="og:title" content="{esc(title, quote=True)}">
  <meta property="og:description" content="{esc(description, quote=True)}">
  <meta property="og:url" content="{esc(record['canonical_url'], quote=True)}">
  <meta property="og:image" content="{esc(record['image_url'], quote=True)}">
  <meta property="og:image:type" content="image/svg+xml">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="{esc(f'{title} by {author}', quote=True)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{esc(title, quote=True)}">
  <meta name="twitter:description" content="{esc(description, quote=True)}">
  <meta name="twitter:image" content="{esc(record['image_url'], quote=True)}">
  <script type="application/ld+json">{ld}</script>
  <style>
    :root {{ color-scheme: light dark; font-family: ui-serif, Georgia, Cambria, "Times New Roman", serif; }}
    * {{ box-sizing: border-box; }}
    body {{ margin: 0; background: Canvas; color: CanvasText; }}
    main {{ width: min(68rem, calc(100% - 2rem)); margin: 0 auto; padding: clamp(2rem, 6vw, 5rem) 0; }}
    .crumb {{ margin-bottom: 1.5rem; font: 600 .82rem/1.3 system-ui, sans-serif; }}
    .crumb a {{ color: inherit; }}
    .publication {{ display: grid; grid-template-columns: minmax(16rem, 34rem) minmax(0, 1fr); gap: clamp(1.5rem, 5vw, 4.5rem); align-items: center; }}
    .cover {{ width: 100%; border-radius: 18px; box-shadow: 0 24px 60px rgb(0 0 0 / .18); }}
    .kicker {{ margin: 0 0 .7rem; font: 700 .74rem/1.2 system-ui, sans-serif; letter-spacing: .12em; text-transform: uppercase; opacity: .62; }}
    h1 {{ margin: 0; font-size: clamp(2.5rem, 7vw, 5.7rem); line-height: .96; letter-spacing: -.035em; }}
    .subtitle {{ margin: .8rem 0 0; max-width: 35rem; font-size: clamp(1.05rem, 2vw, 1.35rem); font-style: italic; opacity: .75; }}
    .byline {{ margin: 1.2rem 0 0; font: 650 .9rem/1.4 system-ui, sans-serif; letter-spacing: .03em; }}
    .description {{ max-width: 40rem; margin: 1.6rem 0; font-size: 1.08rem; line-height: 1.62; }}
    .actions {{ display: flex; flex-wrap: wrap; gap: .7rem; }}
    .actions a {{ display: inline-flex; min-height: 44px; align-items: center; padding: .68rem 1rem; border: 1px solid currentColor; border-radius: 999px; color: inherit; font: 700 .88rem/1 system-ui, sans-serif; text-decoration: none; }}
    .actions a:first-child {{ background: CanvasText; color: Canvas; }}
    .note {{ margin-top: 1.25rem; font: .82rem/1.5 system-ui, sans-serif; opacity: .62; }}
    @media (max-width: 760px) {{
      .publication {{ grid-template-columns: 1fr; }}
      .cover {{ max-width: 34rem; margin-inline: auto; }}
    }}
  </style>
</head>
<body>
  <main>
    <nav class="crumb" aria-label="Breadcrumb"><a href="{esc(site_url, quote=True)}">{esc(shelf_name)}</a> / {esc(format_label)}</nav>
    <article class="publication">
      <img class="cover" src="{esc(record['image_url'], quote=True)}" width="1200" height="630" alt="{esc(f'{title} by {author}', quote=True)}">
      <div>
        <p class="kicker">Released {esc(format_label)}</p>
        <h1>{esc(title)}</h1>{subtitle}
        <p class="byline">By {esc(author)}</p>
        <p class="description">{esc(description)}</p>
        <div class="actions"><a href="{esc(record['reader_url'], quote=True)}">Read {esc(format_label.lower())}</a><a href="{esc(site_url, quote=True)}">Browse the Shelf</a></div>
        <p class="note">This is the stable web address for the released edition. The Reader keeps your place, notes, bookmarks, and reading preferences in your browser.</p>
      </div>
    </article>
  </main>
</body>
</html>
'''


def publication_record(
    root: Path,
    slug: str,
    site_url: str,
    shelf_name: str,
) -> dict[str, str] | None:
    readme = root / "books" / slug / "README.md"
    if not readme.is_file():
        return None
    markdown = readme.read_text(encoding="utf-8")
    meta = metadata(markdown)
    if meta.get("Status", "").lower() != "published":
        return None
    title = title_from_markdown(markdown, slug)
    subtitle = subtitle_from_markdown(markdown)
    author = meta.get("Authors") or meta.get("Author") or "Unknown author"
    format_label = meta.get("Format") or "Book"
    fallback = f"{title} by {author}, a released {format_label.lower()} on {shelf_name}."
    description = first_description(markdown, fallback)
    canonical_url = f"{site_url}publication/{quote(slug)}/"
    reader_url = f"{site_url}reader/#/b/{quote(slug)}/"
    custom = image_candidate(root, slug)
    if custom:
        image_url = f"{site_url}{custom.relative_to(root).as_posix()}"
        generated_image = ""
    else:
        image_url = f"{canonical_url}cover.svg"
        generated_image = generated_cover_svg(
            title,
            subtitle,
            author,
            slug,
            shelf_name,
        )
    return {
        "slug": slug,
        "title": title,
        "subtitle": subtitle,
        "author": author,
        "format": format_label,
        "language": meta.get("Language", ""),
        "description": description,
        "canonical_url": canonical_url,
        "reader_url": reader_url,
        "image_url": image_url,
        "generated_image": generated_image,
    }


def publication_index(
    records: list[dict[str, str]],
    shelf_name: str,
    site_url: str,
) -> str:
    items = "\n".join(
        f'      <li><a href="{html.escape(record["canonical_url"], quote=True)}">'
        f'{html.escape(record["title"])}</a><span>{html.escape(record["author"])}</span></li>'
        for record in records
    )
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Publications — {html.escape(shelf_name)}</title><meta name="description" content="Crawlable released-publication pages for {html.escape(shelf_name, quote=True)}."><link rel="canonical" href="{html.escape(site_url + 'publication/', quote=True)}"><style>:root{{color-scheme:light dark;font-family:ui-serif,Georgia,serif}}body{{width:min(58rem,calc(100% - 2rem));margin:0 auto;padding:3rem 0 5rem;line-height:1.5}}h1{{font-size:clamp(2.7rem,8vw,5rem);line-height:1}}ul{{list-style:none;padding:0}}li{{display:flex;justify-content:space-between;gap:1rem;padding:.8rem 0;border-top:1px solid color-mix(in srgb,currentColor 18%,transparent)}}li span{{opacity:.62}}</style></head><body><p><a href="{html.escape(site_url, quote=True)}">{html.escape(shelf_name)}</a></p><h1>Released publications.</h1><ul>
{items}
  </ul></body></html>
'''


def sitemap(records: list[dict[str, str]], site_url: str) -> str:
    urls = [
        site_url,
        f"{site_url}reader/",
        f"{site_url}publication/",
        f"{site_url}llms.txt",
    ] + [record["canonical_url"] for record in records]
    body = "\n".join(
        f"  <url><loc>{html.escape(url)}</loc></url>" for url in urls
    )
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{body}
</urlset>
'''


def build(
    root: Path,
    requested: list[str] | None = None,
    site_url_override: str = "",
) -> dict[str, str]:
    root = root.resolve()
    imprint = read_json(root / "imprint.json")
    site_url = normalize_site_url(site_url_override) or derived_site_url(imprint)
    shelf_name = str(imprint.get("name") or "Bookself Shelf").strip()
    records: list[dict[str, str]] = []
    outputs: dict[str, str] = {}
    for slug in requested or catalog_slugs(root):
        if not SLUG_RE.fullmatch(slug):
            fail(f"invalid publication slug: {slug}")
        record = publication_record(root, slug, site_url, shelf_name)
        if not record:
            continue
        records.append(record)
        outputs[f"publication/{slug}/index.html"] = page_html(
            record,
            shelf_name,
            site_url,
        )
        if record["generated_image"]:
            outputs[f"publication/{slug}/cover.svg"] = record["generated_image"]
    if not requested:
        records.sort(key=lambda item: item["title"].casefold())
        outputs["publication/index.html"] = publication_index(
            records,
            shelf_name,
            site_url,
        )
        outputs["sitemap.xml"] = sitemap(records, site_url)
    return outputs


def write_outputs(
    root: Path,
    outputs: dict[str, str],
    check: bool = False,
) -> tuple[int, int]:
    changed = stale = 0
    for rel, text in outputs.items():
        path = root / rel
        current = path.read_text(encoding="utf-8") if path.is_file() else None
        if current == text:
            continue
        if check:
            stale += 1
            continue
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
        changed += 1
    return changed, stale


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Generate crawlable publication landing pages."
    )
    parser.add_argument(
        "--root",
        type=Path,
        default=Path(__file__).resolve().parent.parent,
    )
    parser.add_argument("--slug", action="append", default=[])
    parser.add_argument("--site-url", default="")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args(argv)
    try:
        outputs = build(args.root, args.slug or None, args.site_url)
        changed, stale = write_outputs(
            args.root.resolve(),
            outputs,
            check=args.check,
        )
    except PublicationPageError as exc:
        print(f"publication-pages: {exc}", file=sys.stderr)
        return 1
    if args.check:
        if stale:
            print(
                f"publication-pages: {stale} generated file(s) are stale",
                file=sys.stderr,
            )
            return 1
        print(f"publication-pages: {len(outputs)} generated file(s) are current")
        return 0
    print(
        f"publication-pages: wrote {changed} changed file(s); "
        f"{len(outputs)} generated file(s) total"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
