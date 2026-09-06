# Publication web pages

Bookself's Reader uses hash routes because they are simple, portable, and local-first. Hash routes are excellent for an application but poor crawler targets: social link unfurlers and search engines cannot reliably derive publication metadata from `reader/#/b/<slug>/`.

A public Shelf therefore commits a small static page for every released publication at:

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

## Release contract

Canonical publication pages are part of the release transaction, not a follow-up publishing pass. Prepare a Desk → Shelf release with:

```bash
python3 scripts/release.py <slug> [path-to-shelf]
```

`release.py` runs the snapshot/catalog release core, regenerates the full released-publication web surface, verifies it is current, and reports the canonical URL. It checks `publication/` and `sitemap.xml` are clean before changing anything. If web generation fails after the snapshot step, the wrapper restores the affected Shelf release paths to their clean pre-release state rather than leaving a half-prepared release.

This means unfinished Desk drafts do not block the web layer. The generator reads the Shelf `catalog.json` and includes only publications whose Shelf README status is exactly `Published`; drafts and public proofs simply remain outside the canonical released-publication surface until they are deliberately released.

## Maintenance and verification

The underlying generator remains useful as a read-only check or an explicit maintenance tool:

```bash
python3 scripts/generate-publication-pages.py --check
python3 scripts/generate-publication-pages.py
```

A full generation writes `publication/<slug>/index.html`, creates a deterministic `cover.svg` when no conventional cover image exists, writes `publication/index.html`, and refreshes `sitemap.xml` with canonical publication URLs. `--slug <slug>` is available for focused debugging, but the normal release transaction performs a full refresh so the publication index and sitemap cannot drift.

The site base URL comes from `imprint.json` field `siteUrl` when present. Otherwise the generator derives the normal GitHub Pages project URL from `github.owner` and `github.repo`. Custom domains should set `siteUrl` explicitly.

These pages are generated presentation, not manuscript source. They do not change `books/`, publication rights, reading order, or Reader state. A Reader deep link can still point to a chapter or passage; the canonical publication page intentionally identifies the released work as a whole.
