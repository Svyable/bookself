# Bookself architecture

**Bookself is a Git-native publishing system with a deliberate boundary between working state and released state.**

Its human-facing places are:

- **Desk** — where publications are written, researched, revised, reviewed, and prepared for release.
- **Shelf** — where deliberately released publication snapshots live and where the public release is canonical.
- **Reader** — the reading interface used for Desk proofs and Shelf releases.

The upstream `bookself` repository is the reusable software source of truth. Its technical `platform` role contains framework code, templates, documentation, and neutral examples. It is not a publication repository and it is not a runtime CDN for a Shelf.

## The model

| | Bookself upstream | Desk | Shelf |
|---|---|---|---|
| **Purpose** | Reusable framework/software source | Writing, research, revision | Public release state |
| **Runtime role** | `platform` | `desk` | `shelf` |
| **Typical visibility** | Public | Private by default; may deliberately be public | Public |
| **Publications** | Examples/templates only | Drafts and next editions | Released snapshots |
| **Authoring app** | Framework source | Local `desk/` application | **Not present** |
| **Reader** | Framework source/demo | Local Reader | Local Reader |
| **Identity** | Neutral/demo imprint | Desk imprint | Shelf imprint |
| **Root README** | Product docs/demo catalog | Working inventory | Public release catalog |

Repository visibility is policy, not role semantics. A public Desk is still a Desk, and anything committed to it is public even if it is not promoted. A Shelf is release state whether or not an author also exposes a working Desk preview.

## The ownership rule

Desk, Shelf, and Bookself are separate Git repositories with separate histories and different owners of state.

### Desk owns

- working publications under `books/`;
- research, media, rights, and next-edition changes;
- its root catalog and `imprint.json`;
- its authoring integration and local Publishing Desk UI.

### Shelf owns

- released publication snapshots under `books/`;
- `catalog.json` and the public root catalog;
- `imprint.json` and public identity;
- its public Reader shell, service worker, and instance adapter;
- release provenance and its own Git history.

### Bookself owns

- reusable Reader/Desk framework code;
- instance/bootstrap tooling;
- neutral templates and documentation.

Bookself may be copied **into** an instance through an explicit local sync operation. An instance must not execute Bookself Pages code as a production runtime dependency.

## Repository relationship

The publication flow is one-way:

```text
Desk
  committed working publication
  manuscript + research + media + metadata + rights
       |
       | deliberate verified release
       v
Shelf
  committed released snapshot
  + release provenance
       |
       v
GitHub Pages / local Shelf Reader
```

A release copies files. Shelf does not submodule, symlink, mount, fetch, or otherwise read manuscript files from Desk at runtime. After a release, Desk and Shelf copies are independent until the next deliberate release.

Framework updates are a separate path:

```text
Bookself upstream
       |
       +---- explicit Desk framework sync ----> Desk
       |
       +---- explicit --shelf-safe sync ------> Shelf local Reader core
```

Publication release and framework sync are intentionally different operations. Neither implies the other.

## Shelf is not a Bookself mirror

A public Shelf must **not** contain Bookself's `desk/` authoring application. It also must not import executable Reader code from `https://svyable.github.io/bookself/` or another upstream deployment.

A Shelf has an instance-owned Reader entrypoint at `reader/js/app.js`. Reusable upstream Reader code is materialized locally as `reader/js/app-core.js`. This creates a clean integration seam:

- Shelf may customize startup, catalog presentation, service-worker behavior, or identity in `app.js` and other Shelf-owned files.
- Bookself framework upgrades replace the local core and shared modules.
- Readers remain entirely on the Shelf origin at runtime.

The `--shelf-safe` sync contract preserves Shelf-owned state and refuses unsafe whole-tree Shelf syncs before mutation.

## What framework sync may not overwrite

Instance-owned state is outside the framework sync boundary. At minimum:

- `books/`;
- root `README.md`;
- `catalog.json`;
- `imprint.json`;
- instance-specific collaboration/configuration files;
- Shelf-owned Reader shell, service worker, adapter, and identity styles protected by the safe-sync contract.

On Shelf, Bookself's `desk/` tree is not copied at all.

## Explicit sync commands

Framework sync requires explicit destinations. There is no "sync whatever sibling repositories happen to exist" mode.

For a Desk:

```bash
scripts/sync-ui.sh ../desk
```

For a Shelf:

```bash
scripts/sync-ui.sh --shelf-safe ../shelf
```

The sync tool preflights every destination before mutating any of them. A destination whose imprint has `role: "shelf"` is rejected unless the safe Shelf mode is explicitly selected.

Commit framework updates in each instance separately. Copying software does not create a live relationship between repositories.

## New instance creation

Stamp Desk and Shelf as separate instances:

```bash
scripts/stamp-instance.sh ../desk desk YOUR_GITHUB_OWNER desk
scripts/stamp-instance.sh ../shelf shelf YOUR_GITHUB_OWNER shelf
```

The generated roles intentionally differ.

### New Desk

A Desk starts with:

- Reader framework;
- local `desk/` authoring application;
- local publishing/release tooling;
- blank underscore-prefixed publication starters under `books/`;
- Desk identity.

### New Shelf

A Shelf starts with:

- Reader framework only;
- a local Shelf Reader boundary (`app.js` + local `app-core.js`);
- local verification/release-support tooling where applicable;
- **no `desk/` authoring application**;
- **no platform examples or blank publication folders**;
- Shelf identity.

The first deliberate release creates `books/<slug>/` on Shelf.

A generic new Shelf cannot infer the external URL of its separate Desk, so its imprint does not fabricate a local `/shelf/desk/` link. An instance may explicitly configure a real external Desk link later.

## Local-first publishing contract

The complete publishing lifecycle must work without GitHub Actions or hosted CI.

The normal path is:

```text
Markdown + research + media
       |
       v
local Git commit on Desk
       |
       v
local Reader / authoring checks
       |
       | scripts/release-book.sh <slug> ../shelf
       v
local Shelf checkout
       |
       v
verified reviewable Git diff
       |
       v
commit / push
       |
       v
GitHub Pages serves committed Shelf files
```

Release helpers use local Git and Python's standard library. CI may independently verify the result, but it is not allowed to become the mechanism that writes or releases publication state.

For a public Shelf, custom CI should be read-only verification. Scheduled bots must not silently rewrite released books.

## Release transaction

Before releasing, commit the intended Desk publication. Then run:

```bash
scripts/release-book.sh your-title ../shelf
```

The release transaction:

1. verifies Desk and Shelf roles;
2. refuses dirty release paths;
3. pins the exact Desk `HEAD` commit;
4. stages the complete publication tree;
5. transforms the Shelf README status to `Published`;
6. updates Shelf catalog state;
7. byte-compares the authored payload against the committed Desk source;
8. atomically replaces the Shelf publication;
9. writes `books/<slug>/release.json` with source repository, full Desk commit, destination identity, and deterministic payload digest;
10. refreshes configured public/generated release surfaces;
11. verifies the result and rolls back on failure;
12. stops before commit or push.

The manifest schema is deliberately simple. It identifies **where this release came from** and provides an integrity digest for the non-README authored payload. The Shelf README is excluded from that digest because publication status/link presentation is intentionally transformed during release.

Existing historical releases from before the provenance cutover are not assigned invented source commits. New releases and substantive payload revisions should carry valid release provenance.

## Why release provenance matters

`research/` is evidence provenance for the work. `release.json` is transaction provenance for the edition. They solve different problems.

A release review may document readiness, caveats, or a previously reviewed commit. It is not automatically the authoritative identity of the final publication snapshot. The release manifest records the actual source commit used by the transaction.

Shelf CI can recompute the local payload digest and detect later manuscript/research/media/rights drift without needing network access to Desk.

## Research and rights

A real publication lives at `books/<slug>/`. Typical components include:

- `README.md` — metadata and reading order;
- `manuscript/` — reader-facing content;
- `research/` — evidence, provenance, claim checks, calculations, counterevidence, and release review notes;
- `media/` — cover art and figures;
- optional `reader.json` — presentation recommendation;
- `RIGHTS.md` / `rights.json` — publication rights posture.

Research files are durable edition artifacts, not disposable agent scratchpads. They travel with a release and remain frozen on Shelf while Desk research can move ahead toward the next edition.

A public repository does not make publication content open source. Preserve publication-specific rights and third-party source/license boundaries.

## Publish semantics differ by role

- On **Desk**, root **The books** is a working inventory. Drafting publications may appear there.
- On **Shelf**, root **The books** is release state. Cataloged releases are `Published`.

Do not mark the Desk copy `Published` merely because a Shelf edition exists. Desk remains working state.

## Revision model

The normal revision path is:

1. leave the current Shelf edition unchanged;
2. revise and research on Desk;
3. commit the Desk revision;
4. run the verified release transaction;
5. review and land the replacement Shelf snapshot.

Do not change a public Shelf publication to `Drafting` merely to revise it. That may hide it from the visible catalog while leaving files public.

A direct public hotfix is exceptional. If one is explicitly required, reconcile the same correction into Desk, commit the source, and refresh Shelf through the release/provenance path rather than bypassing integrity checks.

See [revisions.md](revisions.md) for revision and rollback details.

## Imprint configuration

`imprint.json` is the instance identity/config boundary. Useful fields include:

- `role`: `platform`, `desk`, or `shelf`;
- `name`, `shortName`, `description`, `kicker`, `lede`;
- `storagePrefix`;
- `github.owner`, `github.repo`, optional `github.branch`;
- optional Reader links/labels.

A Shelf may explicitly point its "working manuscripts" link to a real external Desk URL. A generic Shelf should not invent a same-repository `desk/` route.

## GitHub Pages and plans

Bookself itself has no paid tier. Local writing, research, preview, release preparation, recovery, and reading do not require GitHub Actions.

A public Shelf can use GitHub Pages directly from committed repository files. Private-repository Pages availability depends on GitHub plan and organization policy; a public Pages site is not made private merely because its backing repository has restricted visibility.

GitHub Pages is a delivery surface, not a publication authority. Git history and the release transaction define the released state.

## What not to expect

- Shelf does not need runtime access to Desk or Bookself.
- Shelf does not contain the Publishing Desk application.
- Desk authoring and release do not require Actions minutes.
- Blank publication templates belong on Desk, not Shelf.
- The browser Reader does not password-gate public repository content.
- `research/` is publication evidence provenance; `release.json` is release-transaction provenance.
- Removing a publication from the current public branch does not erase public Git history, clones, forks, or caches.

## Next

- Publication research: [research.md](research.md)
- Revisions and releases: [revisions.md](revisions.md)
- Agents: [skills/bookself/SKILL.md](../skills/bookself/SKILL.md)
- Authors: [author-guide.md](author-guide.md)
- Editors: [editor-guide.md](editor-guide.md)
- Anatomy of a book folder: [book-anatomy.md](book-anatomy.md)
