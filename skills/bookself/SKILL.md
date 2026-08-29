---
name: bookself
description: >-
  Bootstrap and maintain Bookself — a private Desk, a public Shelf, and a Reader
  for authors. Use when the user wants to set up Bookself, create Desk and Shelf
  GitHub repos, release a book from Desk to Shelf, unpublish, sync shared UI,
  configure imprint.json, start a Bookself workspace, or runs /bookself.
---

# Bookself

Product docs: `docs/bookself.md` in this repository. Writing loop:
`docs/author-guide.md`. Do not invent a second metadata system.

Bookself is the whole product/ecosystem. Its runtime repository roles are:

- **platform** — the portable upstream software checkout
- **desk** — private authoring instance, Pages off by default
- **shelf** — public publishing instance, Pages on

The **Reader** is the reading interface shared by Desk proofs and Shelf releases.
The shared product UI is `reader/` + `desk/`. Those directories should be
identical in platform, Desk, and Shelf after a sync. Instance identity and
content are not shared: `books/`, root `README.md`, and `imprint.json` belong
to each Desk/Shelf instance.

GitHub visibility is per repository. Unlisted on a public repo is not private.
Never enable public Pages on a Desk containing unpublished work unless the user
explicitly chose a public working-proof mode.

## bootstrap

Always create both repos. Default names: `desk` and `shelf`. If either name
exists on the owner, choose another name with the user.

1. Clone or open the Bookself checkout the user intends to use as upstream.
   Do not assume its GitHub owner is `Svyable`; forks are valid upstreams.
2. Pick local siblings, e.g. `../desk` and `../shelf`.
3. Stamp both instances and pass the actual GitHub owner when known:

   ```bash
   scripts/stamp-instance.sh ../desk desk OWNER desk
   scripts/stamp-instance.sh ../shelf shelf OWNER shelf
   ```

   The stamp includes both `reader/` and `desk/` and creates a role-aware
   `imprint.json`. The Desk keeps the blank publication templates; the Shelf
   starts with no publication folders at all. Platform example manuscripts and
   platform GitHub Actions workflows stay upstream. If owner/repo is not known
   yet, omit those arguments and edit the generated imprint later.
4. In each stamped tree: `git init -b main`, first commit, then create repos:

   ```bash
   gh repo create OWNER/desk --private --source ../desk --remote origin --push
   gh repo create OWNER/shelf --public --source ../shelf --remote origin --push
   ```

5. Enable Pages on **Shelf** only, repo root (not `/docs`).
6. Hand back the surfaces:
   - private writing repo: `github.com/OWNER/desk`
   - public Reader: `https://OWNER.github.io/shelf/reader/`
   - Publishing Desk UI: local Desk `/desk/`; Shelf `/desk/` for release inspection

Do not copy platform teaching/example manuscripts or upstream Actions workflows
into either user instance.

## write

On the Desk, use the same verbs as `AGENTS.md`: start a publication from the
nearest blank starter, make bounded manuscript changes, and keep every private
manuscript listed under the Desk root **The books** table so the local Publishing
Desk can discover it.

Preview locally:

```bash
python3 -m http.server
```

Then use `/reader/#/b/<slug>/` and `/desk/`. The local Publishing Desk reads the
private instance directly and does not require a GitHub token.

## release

A release is a deliberate Desk → Shelf snapshot operation.

1. Require a publication slug. Refuse underscore-prefixed starters.
2. Confirm that making the release public is within the user's expressed intent.
3. Commit the Desk publication first.
4. From the Desk clone:

   ```bash
   scripts/release-book.sh <slug> ../shelf
   ```

5. The release helper verifies `desk` and `shelf` roles, refuses dirty release
   paths, prepares an exact Shelf snapshot, sets the Shelf copy to `Published`,
   updates the Shelf catalog, verifies the copy, and stops before commit/push.
6. Review the Shelf diff. Commit and push only when public release is intended.
7. Leave the Desk copy in place; it becomes the working copy for the next
   revision.

`scripts/promote-book.sh` is only a lower-level file-copy primitive. It is not
the normal publication verb and does not constitute a release by itself.

Do not edit `reader/` or `desk/` to add a publication.

## unpublish

On the Shelf: set Status to anything except `Published`, remove the root catalog
row, commit, push. Deleting the Shelf folder is optional and separate. Do not
delete the Desk copy unless asked.

## sync-ui

The platform checkout is source of truth for both shared UI directories:

```bash
scripts/sync-ui.sh
```

With no arguments, sibling `../desk` and `../shelf` are synced when they exist.
Explicit paths are also supported:

```bash
scripts/sync-ui.sh /path/to/desk /path/to/shelf
```

This replaces **only** `reader/` and `desk/`. Never overwrite an instance's
`books/`, root `README.md`, or `imprint.json`. Commit each updated instance
separately. `scripts/sync-reader.sh` is a compatibility alias for UI sync.

## imprint

All instance identity belongs in that repo's `imprint.json`: role, name, lede,
GitHub owner/repo, storage prefix, and optional links. Shared `reader/` or
`desk/` code must not contain a person's account, Shelf URL, or private/public
instance name.

Use `github.owner: "auto"` / `github.repo: "auto"` only when Pages location can
infer the repository. Private Desks should normally store their real owner/repo
so GitHub edit/history links work while local content remains same-origin.
