# Bookself architecture

**Bookself is the whole product and publishing ecosystem.** It has three human-facing places:

- **Desk** — where publications are written, researched, revised, reviewed, and prepared for release.
- **Shelf** — where deliberately released publication snapshots live and where Bookself treats the public release as canonical.
- **Reader** — the reading interface for a Desk proof or a released Shelf publication.

The upstream `bookself` repository is the reusable software source of truth. Its technical `platform` role is an implementation detail for shared software, templates, documentation, and neutral demos; it is not a fourth place authors need to learn.

## The model

| | Bookself upstream | Desk | Shelf |
|---|---|---|---|
| **Purpose** | Reusable product/software source | Writing, research, and revision | Public publishing |
| **Runtime role** | `platform` | `desk` | `shelf` |
| **Visibility** | Public upstream/fork | Private by default; may deliberately be public/lower-profile | Public |
| **Promotion** | Product/project docs | Working authoring surface, not canonical release | Canonical promoted release surface |
| **Pages** | Optional neutral demo | Local by default; optional public Pages proof when desired/eligible | On from repo root, no build required |
| **Shared UI** | `reader/` + `desk/` | synced copy | synced copy |
| **Publications** | examples/templates only | drafts, research, and working editions | released editions with edition-bound research |
| **Identity** | neutral/demo `imprint.json` | Desk `imprint.json` | Shelf `imprint.json` |
| **Root README** | product docs / demo catalog | working publication inventory | public release catalog |

Visibility is per repository and is not the definition of the `desk` role. Unlisted drafts or research in a public Desk repository are public even if the Desk is lower-profile and only Shelf is advertised. The standard setup keeps Desk private by default because that is a useful authoring posture, not because Bookself requires secrecy for a repository to be a Desk.

## GitHub plans and hosting modes

Bookself itself is open source. There is no paid Bookself tier required to write, research, preview, release, or publish. The GitHub plan question only affects which repository can serve GitHub Pages.

| Author setup | GitHub plan | Privacy / publication behavior |
|---|---|---|
| **Private Desk + local Reader/Desk** | GitHub Free is enough | The Desk repository stays private. Preview from the local checkout. No Pages, Actions, or hosted build is required. |
| **Public/lower-profile Desk** | GitHub Free is enough | Working manuscripts and research are public Git content immediately, but the repository may remain outside the promoted Shelf experience. |
| **Public Shelf + public Pages Reader** | GitHub Free is enough | The released Shelf lives in a public repository and can be served with GitHub Pages. This is Bookself's canonical promoted release path. |
| **Private Desk + public Pages working proof** | GitHub Pro for a personal repository, or an eligible Team/Enterprise plan | The Git repository stays private, but the Pages site is deliberately public. This is an optional working-proof mode. |

GitHub Pages is available for public repositories on GitHub Free and for private repositories on eligible paid plans. A public Pages site backed by a private repository is still **public on the web by default**. Repository privacy does not make the website author-only. True private Pages access control is a separate GitHub Enterprise capability and is not part of Bookself's core architecture.

The product boundary is simple:

> **Shelf is the canonical public release surface. Desk visibility is an authoring choice. Whatever is committed to a public Desk is public even when it is not promoted.**

## Repository relationship

Desk and Shelf are **separate Git repositories with separate histories**. Shelf does not mount, reference, submodule, symlink, or fetch manuscript or research files from Desk at runtime.

The normal data flow is one-way:

```text
Bookself upstream
  reader/ + desk/ + starters
       | sync / stamp copies
       +-------------> Desk
       +-------------> Shelf shared UI

Desk
  committed working publication
  manuscript/ + research/ + media/ + metadata + rights
       |
       | release = verified publication snapshot
       v
Shelf
  public committed released edition
  manuscript/ + research/ + media/ + metadata + rights
       |
       v
GitHub Pages / Reader
```

A release copies files. After that copy, Desk and Shelf are independent until the next release. If a byte-identical file exists in both repositories Git may give it the same blob SHA; that proves equal content, not a live relationship between the repositories.

The lifecycle rule is:

> **Write, research, and revise the next edition on the Desk. Keep the current manuscript and evidence trail on the Shelf until the replacement is ready.**

See [revisions.md](revisions.md) for the release and rollback model and [research.md](research.md) for publication provenance.

## Publication anatomy

A real publication is a directory at `books/<slug>/`. Its canonical components are:

- `README.md` — publication metadata and reading order;
- `manuscript/` — reader-facing prose / paper / issue content;
- `research/` — evidence, provenance, claim checks, calculations, counterevidence, and release fact-check notes;
- `media/` — cover art and figures when present;
- `reader.json` — optional presentation recommendation;
- `RIGHTS.md` and `rights.json` — publication rights posture.

Every blank starter includes `research/README.md` as the research entry point. The full trail may remain one file or grow into chapter notes, methods, ledgers, calculations, or release reviews.

`research/` is publication content without automatically being Reader narrative. Evidence a reader needs in context should be promoted into manuscript citations, footnotes, references, figures, methodology, or back matter. The deeper trail stays inspectable in the repository and travels with the edition.

A research trail is provenance, not permission to redistribute third-party works. Prefer links, bibliographic metadata, lawful short quotations, hashes, and original notes. Include third-party source files only when redistribution is clearly authorized and preserve their source/license metadata.

## Local-first publishing contract

Bookself's complete authoring and publishing lifecycle must work **without CI/CD**. In particular, a Desk must remain fully usable with zero GitHub Actions minutes.

The required path is intentionally ordinary:

```text
Markdown + research + media
      |
      v
local Git commits
      |
      v
local Reader / Desk
      |
      | python3 scripts/release-book.py
      v
local Shelf checkout
      |
      v
reviewable Git diff / commit / push
      |
      v
GitHub Pages serves the public Shelf files directly
```

The release helper uses Python's standard library and local Git. It does not call the GitHub API, start a hosted runner, produce a build artifact, or require a GitHub Actions workflow.

Pull requests, CI checks, hosted automation, and Actions can still be useful around the platform project or an individual publisher's process. They are **optional conveniences**, not part of Bookself's publishing contract. A publication must still be writable, researchable, previewable, releasable, recoverable, and readable when those services are absent or their budget is exhausted.

GitHub Pages is the public static delivery surface for a Shelf. Bookself should keep that path no-build by default rather than introducing an Actions-based Pages build merely to deploy Markdown and the shared Reader.

## What is shared and what is not

Bookself has two shared browser surfaces:

- `reader/` — the **Reader**: reading, Shelf browsing, notes, navigation, and reading preferences.
- `desk/` — the **Publishing Desk UI**: author/editor readiness, manuscript inspection, and release preparation.

After an upgrade, these two directories should be identical in the upstream repository, Desk, and Shelf.

Everything else is instance-owned unless explicitly documented otherwise. Most importantly, UI sync must never overwrite:

- `books/`, including each publication's manuscript, research, media, rights, and presentation files;
- root `README.md`;
- `imprint.json`.

That boundary lets one open-source Bookself installation serve many independent authors and publishers without carrying an upstream developer's identity into their work.

## Reference implementation

The upstream project has a first real implementation used while Bookself is being developed. It is an **example deployment, not a runtime default**:

| Role | Reference |
|---|---|
| Bookself upstream | `Svyable/bookself` |
| Desk | the Svyable authoring repository; visibility may be public while remaining lower-profile than Shelf |
| Public Shelf | `Svyable/shelf` |

The repository name and visibility of an individual implementation are instance identity/policy, not product vocabulary. Shared `reader/` and `desk/` code must not hard-code a personal owner, repository name, Desk URL, or public Shelf identity.

## Start

Without an agent:

1. Clone or fork the Bookself upstream repository you want to use.
2. Stamp two sibling instances:

   ```bash
   scripts/stamp-instance.sh ../desk desk YOUR_GITHUB_OWNER desk
   scripts/stamp-instance.sh ../shelf shelf YOUR_GITHUB_OWNER shelf
   ```

3. Create the Desk repository. **Private is the standard default**; deliberately public/lower-profile is also a valid authoring mode.
4. Create the Shelf repository as **public** and enable GitHub Pages from the repository root.
5. Customize each generated `imprint.json`. The stamp already supplies role, safe defaults, and GitHub repo identity when owner/repo arguments are given.

On GitHub Free, the privacy-preserving default is private Desk + local preview + public Shelf. A public Desk also works on GitHub Free but makes its committed manuscripts and research public immediately. If you explicitly want a private Desk repository itself to have a public Pages Reader URL, enable that only on an eligible paid GitHub plan.

The generated starting state is role-specific:

- **Desk:** Reader + Publishing Desk UI, local publishing tooling, and all blank underscore-prefixed publication starters under `books/` (book, paper, magazine, newspaper, journal, newsletter, anthology, report, manual/handbook, and comic). Every starter includes canonical `research/README.md`. No platform example manuscripts are copied.
- **Shelf:** Reader + Publishing Desk UI and local publishing tooling, but no publication folders at all. The first deliberate release creates `books/<slug>/` with the complete release snapshot.
- **Both:** no platform GitHub Actions workflows are copied into the user-owned repositories.

A stamped instance already includes both the Reader and Publishing Desk UI. No CI workflow is required to make either one work.

## Shared UI upgrades

Make shared product changes in the Bookself upstream checkout, never independently in an instance unless the change is intentionally instance-only.

Then sync both instances:

```bash
scripts/sync-ui.sh
```

With the conventional sibling layout, this updates `../desk` and `../shelf` when they exist. Explicit paths also work:

```bash
scripts/sync-ui.sh /path/to/my-desk /path/to/my-public-shelf
```

Only `reader/` and `desk/` are replaced. `scripts/sync-reader.sh` remains a compatibility alias for the complete UI sync command.

Commit the Desk and Shelf updates separately so each instance has its own clear history. UI sync is a copy operation; the instances do not import shared UI from the upstream repository at runtime.

## Write and research on the Desk

1. Copy `books/_TEMPLATE/` to `books/your-title/`.
2. Fill in the publication README and write one chapter at a time.
3. Preserve `research/README.md`. Before repeating research, read the existing trail; add material source provenance, claim linkage, caveats, counterevidence, calculations, and recheck notes as the work evolves.
4. Add the manuscript to the Desk root **The books** table. On a Desk, that table is an inventory, not a Shelf publication declaration.
5. Preview locally when appropriate:

   ```bash
   python3 -m http.server
   ```

6. Open:
   - `/reader/#/b/your-title/` to read/proof the manuscript.
   - `/desk/` for readiness and chapter structure.

The Publishing Desk UI reads the local Desk repository directly. It does not need a GitHub token for same-origin inspection. A deliberately public Desk may also be remotely inspectable, but that does not change its publication statuses to `Published` and does not create a Shelf release.

## Release from Desk to Shelf

When a manuscript is meant to become a Shelf release, recheck material time-sensitive research for the intended edition, commit the Desk publication, then run:

```bash
scripts/release-book.sh your-title ../shelf
```

The release command runs locally. It refuses to proceed if the publication has uncommitted Desk changes, if the destination Shelf release paths are dirty, or if the source/destination roles are wrong.

It prepares a replacement Shelf snapshot of the complete publication tree, sets the Shelf copy to `Status: Published`, adds or updates the root **The books** row, verifies the copied files—including research—against the committed Desk snapshot, and stops before commit or push.

Review the Shelf diff and commit/push it with your normal Git workflow. A pull request is a useful review boundary, but Bookself itself does not require one. Until the Shelf change lands on the deployed branch, readers keep seeing the previous released edition and its previous research trail.

`scripts/promote-book.sh` remains a lower-level copy-only command. It does not publish, verify a release transaction, or create a live relationship between Desk and Shelf.

Leave the Desk copy in place. The Desk remains the working history and becomes the home of the next revision and the next round of research.

## Publish semantics differ by role

This distinction matters to the Publishing Desk UI and to agents:

- On a **Desk**, root **The books** means “publications in this working authoring repository.” A Drafting book may and should appear there. If the Desk repository is public, those files are public working content, not a Shelf release.
- On a **Shelf**, root **The books** means “publications released to this public catalog.” A listed book must have `Status: Published`.

The same Publishing Desk UI understands both roles from `imprint.json`.

## Revise

The normal revision path is:

1. Keep the current Shelf edition and its research trail unchanged.
2. Revise and research the Desk copy; the Desk may be private or deliberately public depending on the author's working mode.
3. Commit the Desk revision.
4. Run `scripts/release-book.sh <slug> ../shelf` when the replacement manuscript + research package is ready.
5. Review and land the resulting Shelf release change.

Do not change a public Shelf book to a drafting status merely to work on its next edition. That can make it disappear from the visible Shelf without making its files private.

A public website or public repository is never a privacy boundary merely because it is lower-profile or unlisted.

## Imprint configuration

`imprint.json` is the only runtime identity/config file shared UI should need. Useful fields include:

- `role`: `platform`, `desk`, or `shelf`
- `name`, `shortName`, `description`, `kicker`, `lede`
- `storagePrefix`
- `github.owner`, `github.repo`, optional `github.branch`
- optional Reader links/labels

GitHub Pages instances may use `"auto"` owner/repo values and let the browser infer them from the Pages URL. Desks should usually record their actual GitHub owner/repo if edit/history links are desired.

Current authoring repositories use `role: "desk"`; release and doctor tooling accept only `platform`, `desk`, or `shelf`.

## What not to expect

- The public Shelf does not need access to the Desk.
- Desk authoring, research, and release do not require GitHub Pro, GitHub Actions, or CI minutes.
- A public Pages preview from a private Desk does require an eligible paid GitHub plan.
- A public Desk repository is public even if its Reader is not promoted.
- A Pages site sourced from a private repository is public by default; private-repository visibility does not make the website private.
- The Reader does not password-gate public repositories or public Pages sites.
- The browser Publishing Desk never asks for a GitHub token.
- Remote Publishing Desk inspection works for public repositories; private Desks use same-origin local instance mode.
- Blank publication templates belong on the Desk; a freshly stamped Shelf has no publication folders until the first release.
- `research/` is canonical publication provenance, not automatically Reader chapter navigation.
- Do not edit shared UI to add a book. Add publication files.
- Do not store real unpublished manuscripts in the Bookself upstream repository.
- Removing a publication from the current public Shelf branch does not erase copies already present in public Git history, clones, forks, or caches.

## Next

- Publication research: [research.md](research.md)
- Revisions and releases: [revisions.md](revisions.md)
- Agents: [skills/bookself/SKILL.md](../skills/bookself/SKILL.md)
- Authors: [author-guide.md](author-guide.md)
- Editors: [editor-guide.md](editor-guide.md)
- Anatomy of a book folder: [book-anatomy.md](book-anatomy.md)
