# Publication web pages

Bookself's Reader uses hash routes because they are simple, portable, and local-first. Hash routes are excellent for an application but poor crawler targets: social link unfurlers and search engines cannot reliably derive publication metadata from `reader/#/b/<slug>/`.

A public Shelf can therefore commit a small static page for every released publication at:

```text
publication/<slug>/
```

The page is the publication's stable web identity. It contains normal HTML metadata before any JavaScript runs:

- publication title and author
- an authored description taken from the publication README
- a canonical URL
- Open Graph and Twitter-card metadata
- Schema.org JSON-LD
- a publication cover/share card, or a conventional `cover.*` asset when the publication supplies one
- a direct link into the Reader

Generate or refresh the public surface from a Shelf checkout with:

```bash
python3 scripts/generate-publication-pages.py
```

The command reads `catalog.json`, includes only publications whose README status is exactly `Published`, writes `publication/<slug>/index.html`, creates a deterministic `cover.svg` when no conventional cover image exists, writes a crawlable `publication/index.html`, and refreshes `sitemap.xml` with the canonical pages.

Use `--check` to verify that committed generated pages match publication metadata without rewriting files:

```bash
python3 scripts/generate-publication-pages.py --check
```

Use `--slug <slug>` for a focused page refresh. A full run is preferable before a public release because it also refreshes the publication index and sitemap.

The site base URL comes from `imprint.json` field `siteUrl` when present. Otherwise the generator derives the normal GitHub Pages project URL from `github.owner` and `github.repo`. Custom domains should set `siteUrl` explicitly.

These pages are generated presentation, not manuscript source. They do not change `books/`, publication rights, reading order, or Reader state. A Reader deep link can still point to a chapter or passage; the canonical publication page intentionally identifies the released work as a whole.
