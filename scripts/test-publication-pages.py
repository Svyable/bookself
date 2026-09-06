#!/usr/bin/env python3
import importlib.util
import json
import tempfile
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("generate-publication-pages.py")
spec = importlib.util.spec_from_file_location("publication_pages", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec.loader
spec.loader.exec_module(module)

with tempfile.TemporaryDirectory() as raw:
    root = Path(raw)
    (root / "books" / "published-book").mkdir(parents=True)
    (root / "books" / "draft-book").mkdir(parents=True)
    (root / "imprint.json").write_text(
        json.dumps(
            {
                "role": "shelf",
                "name": "Example Shelf",
                "siteUrl": "https://example.test/shelf/",
                "github": {"owner": "example", "repo": "shelf"},
            }
        ),
        encoding="utf-8",
    )
    (root / "catalog.json").write_text(
        json.dumps({"version": 1, "books": ["published-book", "draft-book"]}),
        encoding="utf-8",
    )
    (root / "books" / "published-book" / "README.md").write_text(
        """# Published Book

*The useful subtitle*

| | |
|---|---|
| **Author** | Ada Example |
| **Status** | Published |
| **Format** | Book |
| **Language** | en |

This is the authored publication description.

## Contents
""",
        encoding="utf-8",
    )
    (root / "books" / "draft-book" / "README.md").write_text(
        """# Draft Book

| | |
|---|---|
| **Author** | Ada Example |
| **Status** | Drafting |

This draft must not become a public landing page.
""",
        encoding="utf-8",
    )

    outputs = module.build(root)
    page = outputs["publication/published-book/index.html"]
    assert "https://example.test/shelf/publication/published-book/" in page
    assert '<meta property="og:title" content="Published Book">' in page
    assert '<meta name="author" content="Ada Example">' in page
    assert "This is the authored publication description." in page
    assert "application/ld+json" in page and "schema.org" in page
    assert "twitter:card" in page and "summary_large_image" in page
    assert "publication/published-book/cover.svg" in page
    assert "publication/published-book/cover.svg" in outputs
    assert "publication/draft-book/index.html" not in outputs
    assert "draft-book" not in outputs["sitemap.xml"]
    assert "publication/published-book/" in outputs["sitemap.xml"]

    changed, stale = module.write_outputs(root, outputs)
    assert changed == len(outputs) and stale == 0
    changed, stale = module.write_outputs(root, outputs, check=True)
    assert changed == 0 and stale == 0

print("publication page generator: 14 assertions passed")
