# Bookself

**Bookself is one portable platform with two kinds of user instance: a private binder and a public shelf.**

The separation is intentional:

| | Platform | Binder | Shelf |
|---|---|---|---|
| **Purpose** | Software source of truth | Private writing | Public publishing |
| **Visibility** | Public upstream/fork | Private | Public |
| **Pages** | Optional demo | Off for unpublished work | On from repo root |
| **Shared UI** | `reader/` + `desk/` | synced copy | synced copy |
| **Books** | examples/templates only | drafts and working manuscripts | released manuscripts |
| **Identity** | neutral/demo `imprint.json` | binder `imprint.json` | shelf `imprint.json` |
| **Root README** | product docs | private manuscript inventory | public catalog |

Visibility is per repository. Unlisted drafts on a public repository are not private. A private binder should never be made public merely to obtain a preview URL.

## Repository relationship

Binder and Shelf are **separate Git repositories with separate histories**. Shelf does not mount, reference, submodule, symlink, or fetch manuscript files from Binder at runtime.

The normal data flow is one-way:

```text
Bookself platform
  reader/ + desk/
       | sync copies
       +-------------> Binder
       +-------------> Shelf

Binder
  private committed working edition
       |
       | release = verified file snapshot
       v
Shelf
  public committed released edition
       |
       v
GitHub Pages / Reader
```

A release copies files. After that copy, Binder and Shelf are independent until the next release. If a byte-identical file exists in both repositories Git may give it the same blob SHA; that proves equal content, not a live relationship between the repositories.

The easy lifecycle rule is:

> **Write the next edition in Binder. Keep the current edition on Shelf until the replacement is ready.**

See [revisions.md](revisions.md) for the release and rollback model.

## What is shared and what is not

Bookself has one shared browser UI:

- `reader/` — reader, shelf, notes, navigation, reading preferences
- `desk/` — author/editor readiness and publishing workspace

After an upgrade, these two directories should be identical in the platform, binder, and shelf.

Everything else is instance-owned unless explicitly documented otherwise. Most importantly, UI sync must never overwrite:

- `books/`
- root `README.md`
- `imprint.json`

That boundary is what allows one open-source platform to serve many independent authors and publishers without carrying the upstream developer's identity into their shelves.

## Reference implementation

The upstream project currently has a first real implementation used while the platform is being developed. It is an **example deployment, not a runtime default**:

| Role | Reference |
|---|---|
| Platform upstream | `Svyable/bookself` |
| Private binder | `Svyable/binder` |
| Public shelf | `Svyable/shelf` |

Personal names, repository URLs, and branding for that implementation belong in those instance repositories and their `imprint.json` files. Shared `reader/` and `desk/` code must remain instance-neutral.

## Start

Without an agent:

1. Clone or fork the Bookself platform repository you want to use as upstream.
2. Stamp two sibling instances:

   ```bash
   scripts/stamp-instance.sh ../binder binder YOUR_GITHUB_OWNER binder
   scripts/stamp-instance.sh ../shelf shelf YOUR_GITHUB_OWNER shelf
   ```

3. Create the binder repository as **private**.
4. Create the shelf repository as **public** and enable GitHub Pages from the repository root.
5. Customize each generated `imprint.json`. The stamp already supplies role, safe defaults, and GitHub repo identity when owner/repo arguments are given.

A stamped instance already includes both the Reader and Publishing Desk.

## Shared UI upgrades

Make shared product changes in the platform checkout, never independently in an instance unless the change is intentionally instance-only.

Then sync both instances:

```bash
scripts/sync-ui.sh
```

With the conventional sibling layout, this updates `../binder` and `../shelf` when they exist. Explicit paths also work:

```bash
scripts/sync-ui.sh /path/to/my-private-books /path/to/my-public-books
```

Only `reader/` and `desk/` are replaced. `scripts/sync-reader.sh` remains as a backward-compatible alias but now performs the same complete UI sync.

Commit the binder and shelf updates separately so each instance has its own clear history. UI sync is also a copy operation; the instances do not import shared UI from the platform at runtime.

## Write (binder)

1. Copy `books/_TEMPLATE/` to `books/your-title/`.
2. Fill in the book README and write one chapter at a time.
3. Add the private manuscript to the binder root **The books** table. In a binder, that table is an inventory, not a publication declaration.
4. Preview locally:

   ```bash
   python3 -m http.server
   ```

5. Open:
   - `/reader/#/b/your-title/` for reading
   - `/desk/` for readiness and chapter structure

The Desk reads the local binder directly. It does not need a GitHub token to inspect private manuscripts when served from the binder checkout.

## Release (binder → shelf)

When a manuscript is meant to become public, commit the Binder publication first, then run:

```bash
scripts/release-book.sh your-title ../shelf
```

The release command refuses to proceed if the publication has uncommitted Binder changes, if the destination Shelf release paths are dirty, or if the source/destination roles are wrong.

It prepares a replacement Shelf snapshot, sets the Shelf copy to `Status: Published`, adds or updates the root **The books** row, verifies the copied publication files against the committed Binder snapshot, and stops before commit or push.

Review the Shelf diff and land it through the normal Shelf branch / pull-request workflow. Until that Shelf change lands, readers keep seeing the previous released edition.

`scripts/promote-book.sh` remains a lower-level copy-only command. It does not publish, verify a release transaction, or create a live relationship between Binder and Shelf.

Leave the Binder copy in place. Binder remains the private working history and becomes the home of the next revision.

## Publish semantics differ by role

This distinction matters to the Desk and to agents:

- In a **binder**, root **The books** means “manuscripts in this private workspace.” A Drafting book may and should appear there.
- In a **shelf**, root **The books** means “books released to this public catalog.” A listed book must have `Status: Published`.

The same Desk understands both roles from `imprint.json`.

## Revise

The normal revision path is:

1. Keep the current Shelf edition unchanged.
2. Revise the Binder copy privately.
3. Commit the Binder revision.
4. Run `scripts/release-book.sh <slug> ../shelf` when the replacement is ready.
5. Review and land the resulting Shelf release change.

Do not change a public Shelf book to a drafting status merely to work on its next edition. That can make it disappear from the visible shelf without making its files private.

An intentionally public proof is a separate, explicit publishing choice. A public repository is never a privacy boundary, even when a Reader route is unlisted.

## Imprint configuration

`imprint.json` is the only runtime identity/config file shared UI should need. Useful fields include:

- `role`: `platform`, `binder`, or `shelf`
- `name`, `shortName`, `description`, `kicker`, `lede`
- `storagePrefix`
- `github.owner`, `github.repo`, optional `github.branch`
- optional reader links/labels

GitHub Pages instances may use `"auto"` owner/repo values and let the browser infer them from the Pages URL. Private/local binders should usually record their actual GitHub owner/repo if edit/history links are desired.

## What not to expect

- The public Shelf does not need access to the private Binder.
- The reader does not password-gate public repositories.
- The browser Desk never asks for a GitHub token.
- Remote Desk inspection works for public repositories; private binders use same-origin local instance mode.
- `_TEMPLATE` is never a published catalog entry.
- Do not edit shared UI to add a book. Add Markdown.
- Do not store real unpublished manuscripts in the platform repository.
- Removing a manuscript from the current public Shelf branch does not erase copies already present in public Git history, clones, forks, or caches.

## Next

- Revisions and releases: [revisions.md](revisions.md)
- Agents: [skills/bookself/SKILL.md](../skills/bookself/SKILL.md)
- Authors: [author-guide.md](author-guide.md)
- Editors: [editor-guide.md](editor-guide.md)
- Anatomy of a book folder: [book-anatomy.md](book-anatomy.md)
