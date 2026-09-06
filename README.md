# Bookself

**Write like a repo. Publish like a book.**

Bookself is the publishing structure underneath a **Desk**, a **Shelf**, and the shared **Reader** used by both. It is infrastructure, not an author catalog.

> **See Bookself in action:** [Open the live example Shelf →](https://svyable.github.io/shelf/reader/)
>
> This is a real public Bookself instance using the shared Reader and release model, so you can experience the product before setting up your own Desk and Shelf.

- **Desk** owns working manuscripts, drafts, research, revisions, and the next edition. It is private by default, but may deliberately be public or lower-profile.
- **Shelf** owns deliberately released publication snapshots and is the canonical promoted public release surface.
- **Bookself** owns the reusable Reader, Publishing Desk, templates, release tools, validation, documentation, and the upgrade path that keeps Desk and Shelf current.

**[Start with Bookself](START-HERE.md)** · **[Architecture](docs/bookself.md)** · **[Author workflow](docs/author-guide.md)** · **[Research trail](docs/research.md)** · **[Upgrade shared UI](#upgrade-desk-and-shelf)**

## The contract

| Layer | Owns | Does not own |
|---|---|---|
| **Bookself** | `reader/`, `desk/`, reusable scripts, templates, schemas, docs | An author's live catalog or released library |
| **Desk** | Working `books/`, root catalog, instance identity, draft/revision state | A released edition merely because it is newest |
| **Shelf** | Released `books/`, public catalog, instance identity, release history | Unreleased Desk work |
| **Reader** | Presentation, navigation, search, notes, citation, accessibility | Manuscript truth or publication state |

A normal release is **Desk → Shelf**. Shelf never reaches back into Desk at runtime. A released snapshot remains independently readable and versioned until a later deliberate release replaces it.

## Research is publication content

Every Bookself publication has a canonical `research/` component alongside `manuscript/` and `media/`. Its entry point is `books/<slug>/research/README.md`.

The manuscript is the reader-facing work. The research trail is the inspectable evidence and provenance behind it: source ledgers, claim checks, calculations, counterevidence, methodological boundaries, dated update notes, and release fact-checks. Agents should read existing research before repeating searches and leave durable source context behind when research materially informs a change.

Reader-facing evidence still belongs in the manuscript when it helps the reading experience—citations, footnotes, references, figures, and necessary methodology. `research/` carries the deeper apparatus without making the narrative table of contents a research notebook.

On Desk, the research trail may move ahead of the current edition. On Shelf, it is frozen with the released edition. The release helper copies and verifies the complete publication tree, so committed research travels with the manuscript automatically.

Research is provenance, not permission to redistribute sources. Prefer links, bibliographic metadata, lawful short quotations, hashes, and author/agent notes over copied third-party files unless redistribution rights are clear. See **[Publication research](docs/research.md)**.

## Upgrade Desk and Shelf

Bookself upgrades flow outward without copying author content inward or outward.

```bash
python3 scripts/sync-ui.py
```

The sync operation replaces only the shared Reader and Publishing Desk implementation. It does **not** replace `books/`, the root `README.md`, or `imprint.json`. After shared UI is copied, Bookself re-stamps the Reader's native/install identity from the destination's own `imprint.json`, so a Shelf keeps being that Shelf and a Desk keeps being that Desk.

You can target explicit instances:

```bash
python3 scripts/sync-ui.py ../desk ../shelf
```

The shell wrapper delegates to the same Python implementation:

```bash
scripts/sync-ui.sh ../desk ../shelf
```

## Start a Desk and Shelf

Create a working Desk and a release Shelf from the portable platform:

```bash
python3 scripts/stamp-instance.py ../desk desk YOUR_GITHUB_OWNER desk
python3 scripts/stamp-instance.py ../shelf shelf YOUR_GITHUB_OWNER shelf
```

A new Desk receives blank publication starters. A new Shelf starts without manuscript content. Instance identity is stamped from each instance's `imprint.json` rather than inherited as Bookself branding.

The standard bootstrap keeps Desk private by default, but visibility is an authoring-policy choice rather than the definition of the `desk` role. A deliberately public Desk is still a Desk; it is simply public working history and should be treated as such. Shelf remains the canonical promoted release surface.

## Write and release

Write on Desk in plain Markdown, keep research and provenance with the publication, commit meaningful revisions, and preview through the shared Reader. When an edition is deliberately ready for release:

```bash
python3 scripts/release-book.py your-title ../shelf
```

The release helper copies a committed publication snapshot from Desk to Shelf—including `manuscript/`, `research/`, `media/`, rights, and presentation files—updates Shelf publication state/catalog data, verifies the prepared copy, and stops before commit or push.

## What belongs where

| Shared Bookself platform | Instance-owned state |
|---|---|
| `reader/` — reading interface | `books/` — manuscripts, research trails, media, and publication metadata |
| `desk/` — publishing/readiness interface | root `README.md` — catalog and human-facing instance context |
| `scripts/` — bootstrap, release, validation, synchronization | `imprint.json` — instance name, role, links, Reader identity |
| `docs/` — architecture and workflow | publication-specific rights/presentation metadata |
| blank `_..._TEMPLATE` starters | real author content and evidence trails |

Bookself should remain portable: shared code must not hard-code a person's identity, Desk URL, or unrelated Shelf branding.

## Reader and Publishing Desk

The Reader renders plain Markdown as a designed publication while preserving the repository as source of truth. It supports paged and continuous reading, typography controls, search, notes, bookmarks, citations, history/source links, accessibility surfaces, and publication-specific presentation recommendations.

The Publishing Desk surfaces publication readiness, metadata, state, release mismatches, and next actions without turning Bookself into a CMS.

Publication presentation can be recommended with `reader.json`; the reader's own browser-local preferences remain authoritative.

## Local-first invariant

Writing, researching, previewing, validating, releasing, and reading must work without GitHub Actions or a hosted build pipeline. The required path is deliberately small: Git, Markdown, a browser, and Python's standard library for Bookself helpers.

GitHub Pages can deliver a public Shelf or an intentionally public Desk preview, but Pages is a delivery surface, not the publishing engine.

## Rights

Bookself's framework software, documentation, shared UI, scripts, and blank starters are MIT licensed. Real publications are **All Rights Reserved by default** unless their own rights files deliberately grant another license.

Public visibility is not the same as an open license. Publication-specific `RIGHTS.md` and `rights.json` travel with a release and remain author-controlled. Research notes and source metadata can travel with the publication without changing the rights of underlying third-party works. See [Rights, copyright, and AI](docs/rights-and-ai.md).

## The books

Bookself does not publish or promote an author library here. The `books/` directory contains blank starters and compatibility/test fixtures used to exercise publication formats and Reader behavior. Real working manuscripts belong in an author's Desk; deliberate releases belong in that author's Shelf.

## Documentation

| Need | Go here |
|---|---|
| See the live product | [Example Shelf](https://svyable.github.io/shelf/reader/) |
| Start a workspace | [START HERE](START-HERE.md) |
| Architecture | [Bookself architecture](docs/bookself.md) |
| Author workflow | [Author guide](docs/author-guide.md) |
| Research and provenance | [Publication research](docs/research.md) |
| Publication formats | [Publication formats](docs/publication-formats.md) |
| Writing lifecycle | [Writing lifecycle](docs/writing-lifecycle.md) |
| Revisions and releases | [Revisions and releases](docs/revisions.md) |
| Reader presentation | [Reader design](docs/reader-presentation.md) |
| Rights and AI | [Rights guide](docs/rights-and-ai.md) |
| Agent-readable project map | [llms.txt](llms.txt) |
| Contributor / agent rules | [AGENTS.md](AGENTS.md) |

## Local platform development

```bash
python3 -m http.server
```

The platform Reader and Publishing Desk remain available for software development at `reader/` and `desk/`, but the Bookself platform itself does not expose its fixture publications as a promoted catalog.

## Citation and license

For citation metadata, see [CITATION.cff](CITATION.cff). Framework code is MIT licensed; author publication content keeps its own authorship and publication-specific rights.
