# Bookself

**Write like a repo. Publish like a book.**

Bookself is the publishing structure underneath a **Desk**, a **Shelf**, and the **Reader** used by both roles. It is infrastructure, not an author's catalog.

> **See Bookself in action:** [Open the embedded demo Shelf →](https://svyable.github.io/bookself/shelf/reader/)
>
> The demo is self-contained inside the upstream Bookself repository and uses neutral platform specimens. It is not an author's production Shelf.

- **Desk** owns working manuscripts, drafts, research, revisions, and the next edition. It contains the Publishing Desk authoring application.
- **Shelf** owns deliberately released publication snapshots and canonical public release history. It contains a local Reader and **does not contain the Publishing Desk application**.
- **Bookself upstream** owns reusable framework code, templates, release/validation tools, documentation, neutral specimens, and the upgrade path.

**[Start with Bookself](START-HERE.md)** · **[Architecture](docs/bookself.md)** · **[Author workflow](docs/author-guide.md)** · **[Research trail](docs/research.md)** · **[Revisions](docs/revisions.md)**

## The contract

| Layer | Owns | Does not own |
|---|---|---|
| **Bookself** | reusable Reader/Desk framework, scripts, templates, schemas, docs, neutral demos | an author's live catalog or released library |
| **Desk** | working `books/`, root inventory, identity, authoring UI, draft/revision state | public release state merely because it is newest |
| **Shelf** | released `books/`, public catalog, identity, local Reader boundary, release provenance/history | `desk/` authoring UI or unreleased Desk work |
| **Reader** | presentation, navigation, search, notes, citation, accessibility | manuscript truth or publication state |

A normal publication release is **Desk → Shelf**. Shelf never reaches back into Desk at runtime. A released snapshot remains independently readable/versioned until a later deliberate release replaces it.

A framework update is a different operation. Bookself software is copied locally into the target instance; Shelf never executes `https://svyable.github.io/bookself/` as a production runtime dependency.

## The upstream demo is not an author Shelf

The `shelf/` directory in this upstream repository is a small embedded **platform demo surface**. It reuses the neutral fixture corpus so the open-source project can demonstrate Shelf behavior without depending on somebody else's deployment.

Real author Shelves are separate repositories with their own identity, content, history, and release provenance.

## Research is publication content

Every Bookself publication has a canonical `research/` component alongside `manuscript/` and `media/`. Its entry point is `books/<slug>/research/README.md`.

The manuscript is reader-facing work. The research trail is inspectable evidence/provenance: source ledgers, claim checks, calculations, counterevidence, methodological boundaries, dated updates, and release fact-checks. Agents should read existing research before repeating searches and leave durable source context when evidence materially informs a change.

On Desk, research may move ahead of the released edition. On Shelf, it is frozen with the released snapshot. The release transaction copies and verifies the complete publication tree.

Research is provenance, not permission to redistribute sources. Prefer links, bibliographic metadata, lawful short quotations, hashes, and original notes over copied third-party files unless redistribution rights are clear. See **[Publication research](docs/research.md)**.

## Start a Desk and Shelf

Create complementary working/release instances from upstream:

```bash
python3 scripts/stamp-instance.py ../desk desk YOUR_GITHUB_OWNER desk
python3 scripts/stamp-instance.py ../shelf shelf YOUR_GITHUB_OWNER shelf
```

Or bootstrap the pair and validate it in one operation:

```bash
python3 scripts/bootstrap-workspace.py ../my-bookself-workspace --owner YOUR_GITHUB_OWNER --json
```

A new **Desk** receives:

- local Reader;
- local `desk/` Publishing Desk application;
- blank publication starters;
- authoring/release tooling.

A new **Shelf** receives:

- local Reader;
- an instance-owned Reader entrypoint plus local `app-core.js` framework core;
- no `desk/` authoring application;
- no platform examples or blank starters;
- no publication content until the first deliberate release.

Pair validation should return `setupReady: true` when these complementary roles, separate Git histories, identity, and release boundaries are healthy.

## Upgrade Desk and Shelf safely

Framework sync requires explicit targets.

Update a Desk:

```bash
python3 scripts/sync-ui.py ../desk
```

Update a Shelf:

```bash
python3 scripts/sync-ui.py --shelf-safe ../shelf
```

The Shelf-safe operation:

- refuses a non-Shelf target;
- preserves Shelf-owned publications/catalog/identity;
- preserves Shelf-owned Reader shell, service worker, adapter, and instance styles;
- updates reusable Reader modules locally;
- materializes upstream `reader/js/app.js` as local `reader/js/app-core.js`;
- does **not** copy Bookself's `desk/` tree.

Whole-tree sync into a `role=shelf` destination is rejected before mutation. Multi-target operations are preflighted before any target is changed.

The shell wrapper delegates to the same role-aware Python implementation:

```bash
scripts/sync-ui.sh ../desk
scripts/sync-ui.sh --shelf-safe ../shelf
```

Commit framework updates in each instance separately. Sync is a copy operation, not a live runtime relationship.

## Write and release

Write on Desk in plain Markdown, keep research/provenance with the publication, commit meaningful revisions, and preview locally or through an intentionally exposed Desk Reader.

When an edition is deliberately ready:

```bash
scripts/release-book.sh your-title ../shelf
```

The canonical release transaction:

1. verifies Desk/Shelf roles and clean release paths;
2. pins the exact committed Desk source;
3. prepares the complete publication snapshot including research, media, rights, and presentation files;
4. sets Shelf publication state to `Published` and updates catalog/public release surfaces;
5. byte-verifies the authored payload against the committed Desk snapshot;
6. writes `books/<slug>/release.json` with exact Desk source commit and deterministic payload integrity;
7. rolls back the prepared release if a later verification step fails;
8. stops before commit or push.

Review and land the resulting Shelf diff through normal Git. CI can independently verify invariants, but CI is not the publishing mechanism.

`scripts/promote-book.sh` and lower-level release helpers are implementation/copy primitives. They do not replace the canonical provenance-producing transaction above.

## What belongs where

| Bookself upstream | Desk instance | Shelf instance |
|---|---|---|
| `reader/` framework source | local Reader | local Reader adapter + core |
| `desk/` framework source | local Publishing Desk app | **absent** |
| scripts/templates/docs | authoring/release tooling + blank starters | verification/release-support tooling as applicable |
| neutral demo specimens | working author publications | deliberate released publication snapshots |
| platform identity | Desk identity | Shelf identity |

Instance-owned publication state includes `books/`, root `README.md`, `catalog.json`, `imprint.json`, rights metadata, and release history. Shelf additionally owns the Reader integration boundary that keeps its runtime local and independent.

Bookself must remain portable: reusable framework code must not hard-code a person's identity, Desk URL, or unrelated Shelf branding.

## Reader and Publishing Desk

The **Reader** renders plain Markdown as a designed publication while preserving the repository as source of truth. It supports paged/continuous reading, typography controls, search, notes, bookmarks, citations, history/source links, accessibility surfaces, and publication-specific presentation recommendations.

The **Publishing Desk** surfaces authoring/readiness state. It lives on Desk (and in upstream framework development), not on a production Shelf.

Publication presentation can be recommended with `reader.json`; browser-local reader preferences remain authoritative.

## Local-first invariant

Writing, researching, previewing, validating, releasing, and reading must work without GitHub Actions or a hosted build pipeline. The required path is deliberately small: Git, Markdown, a browser, and Python's standard library for Bookself helpers.

GitHub Pages can deliver a public Shelf or an intentionally public Desk preview, but Pages is a delivery surface, not the publishing engine.

Custom Shelf automation should verify rather than silently rewrite publication state.

## Rights

Bookself framework software, documentation, scripts, and blank starters are MIT licensed. Real publications are **All Rights Reserved by default** unless their own rights files deliberately grant another license.

Public visibility is not the same as an open license. Publication-specific `RIGHTS.md` and `rights.json` travel with releases and remain author-controlled. Research notes/source metadata can travel with the publication without changing rights in underlying third-party works. See [Rights, copyright, and AI](docs/rights-and-ai.md).

## The books

Bookself upstream keeps a deliberately published **neutral demo catalog** so Reader/media/publication-format behavior can be exercised without using an author's personal library. The catalog is defined in [`catalog.json`](catalog.json) and shown through the embedded [`shelf/reader/`](shelf/reader/) demo surface.

Blank underscore-prefixed starters remain authoring templates. Real working manuscripts belong on an author's Desk; deliberate author releases belong in that author's separate Shelf.

## Documentation

| Need | Go here |
|---|---|
| Live neutral demo | [Embedded demo Shelf](https://svyable.github.io/bookself/shelf/reader/) |
| Start a workspace | [START HERE](START-HERE.md) |
| Architecture | [Bookself architecture](docs/bookself.md) |
| Agent orchestration | [Agent-first Bookself](docs/agent-first.md) |
| Author workflow | [Author guide](docs/author-guide.md) |
| Research and provenance | [Publication research](docs/research.md) |
| Revisions and releases | [Revisions and releases](docs/revisions.md) |
| Publication formats | [Publication formats](docs/publication-formats.md) |
| Reader presentation | [Reader design](docs/reader-presentation.md) |
| Rights and AI | [Rights guide](docs/rights-and-ai.md) |
| Agent-readable contract | [bookself.json](bookself.json) |
| Contributor / agent rules | [AGENTS.md](AGENTS.md) |

## Local upstream development

```bash
python3 -m http.server
```

Upstream Reader and Publishing Desk framework surfaces remain available at `reader/` and `desk/` for software development. The neutral catalog is exposed as the embedded demo Shelf at `shelf/reader/`.

## Citation and license

For citation metadata, see [CITATION.cff](CITATION.cff). Framework code is MIT licensed; author publication content keeps its own authorship and publication-specific rights.
