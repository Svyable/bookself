---
name: bookself
description: >-
  Bootstrap and maintain Bookself — a private binder and a public shelf for
  authors. Use when the user wants to set up Bookself, create binder and
  shelf GitHub repos, promote a book from binder to shelf, unpublish, sync
  shared UI, configure imprint.json, start a bookshelf, or runs /bookself.
---

# Bookself

Product docs: `docs/bookself.md` in this repository. Writing loop:
`docs/author-guide.md`. Do not invent a second metadata system.

Bookself has three roles:

- **platform** — the portable upstream software checkout
- **binder** — private authoring instance, Pages off
- **shelf** — public publishing instance, Pages on

The shared product UI is `reader/` + `desk/`. Those directories should be
identical in platform, binder, and shelf after a sync. Instance identity and
content are not shared: `books/`, root `README.md`, and `imprint.json` belong
to each binder/shelf.

GitHub visibility is per repository. Unlisted on a public repo is not private.
Never enable public Pages on a binder containing unpublished work.

## bootstrap

Always create both repos. Default names: `binder` and `shelf`. If either name
exists on the owner, choose another name with the user.

1. Clone or open the Bookself checkout the user intends to use as upstream.
   Do not assume its GitHub owner is `Svyable`; forks are valid upstreams.
2. Pick local siblings, e.g. `../binder` and `../shelf`.
3. Stamp both instances and pass the actual GitHub owner when known:

   ```bash
   scripts/stamp-instance.sh ../binder binder OWNER binder
   scripts/stamp-instance.sh ../shelf shelf OWNER shelf
   ```

   The stamp includes both `reader/` and `desk/` and creates a role-aware
   `imprint.json`. The Binder keeps only the blank book and paper templates;
   the Shelf starts with no publication folders at all. Platform example
   manuscripts and platform GitHub Actions workflows stay upstream. If
   owner/repo is not known yet, omit those arguments and edit the generated
   imprint later.
4. In each stamped tree: `git init -b main`, first commit, then create repos:

   ```bash
   gh repo create OWNER/binder --private --source ../binder --remote origin --push
   gh repo create OWNER/shelf --public --source ../shelf --remote origin --push
   ```

5. Enable Pages on **shelf** only, repo root (not `/docs`).
6. Hand back the three surfaces:
   - private writing repo: `github.com/OWNER/binder`
   - public reader: `https://OWNER.github.io/shelf/reader/`
   - author desk: local binder `/desk/`, public shelf `/desk/`

Do not copy platform teaching/example manuscripts or upstream Actions workflows
into either user instance.

## write

On binder, use the same verbs as `AGENTS.md`: start a book from `_TEMPLATE`,
one chapter per change, and keep every private manuscript listed under the
binder root **The books** table so the local Desk can discover it.

Preview locally:

```bash
python3 -m http.server
```

Then use `/reader/#/b/<slug>/` and `/desk/`. The local Desk reads the private
instance directly and does not require a GitHub token.

## promote

Copy one book from binder to shelf, then publish on the shelf.

1. Require a slug. Refuse `_TEMPLATE`.
2. State clearly that the shelf is public and the promoted files will be
   world-readable; require user approval before copying.
3. From the binder clone:

   ```bash
   scripts/promote-book.sh <slug> ../shelf
   ```

4. On the shelf copy, set book README Status to exactly `Published` and add
   one row under **The books** in the shelf root README. Both are required.
5. Commit and push the shelf. Leave the binder copy in place.

Do not edit `reader/` or `desk/` to add a book.

## unpublish

On the shelf: set Status to anything except `Published`, remove the root
catalog row, commit, push. Deleting the shelf folder is optional and separate.
Do not delete the binder copy unless asked.

## sync-ui

The platform checkout is source of truth for both shared UI directories:

```bash
scripts/sync-ui.sh
```

With no arguments, sibling `../binder` and `../shelf` are synced when they
exist. Explicit paths are also supported:

```bash
scripts/sync-ui.sh /path/to/binder /path/to/shelf
```

This replaces **only** `reader/` and `desk/`. Never overwrite an instance’s
`books/`, root `README.md`, or `imprint.json`. Commit each updated instance
separately. `scripts/sync-reader.sh` is a backward-compatible alias.

## imprint

All instance identity belongs in that repo’s `imprint.json`: role, name,
lede, GitHub owner/repo, storage prefix, and optional links. Shared
`reader/` or `desk/` code must not contain a person’s account, shelf URL, or
private/public instance name.

Use `github.owner: "auto"` / `github.repo: "auto"` only when Pages location
can infer the repository. Private binders should normally store their real
owner/repo so GitHub edit/history links work while local content remains
same-origin.
