---
name: bookself
description: >-
  Bootstrap and maintain Bookself — a private binder and a public shelf for
  authors. Use when the user wants to set up Bookself, create binder and
  shelf GitHub repos, promote a book from binder to shelf, unpublish, sync
  the reader, configure imprint.json, start a bookshelf, or runs /bookself.
---

# Bookself

Product docs: `docs/bookself.md` in this repository. Writing loop:
`docs/author-guide.md`. Do not invent a third config format.

Bookself is one software tree. GitHub visibility is per repository, so
authors get two repos: **binder** (private, Pages off) and **shelf**
(public, Pages on). Unlisted on a public repo is not private.

This product repository is the stamp source. Never copy real manuscripts
out of it. Never copy `books/_TEMPLATE` as a published title. Never
enable Pages on binder.

## bootstrap

Always create both repos. Default names: `binder` and `shelf`. If either
name exists on the owner, ask. Confirm `gh auth status` can create
private repos.

1. Clone or open `https://github.com/Svyable/bookself` (this tree).
2. Pick local siblings, e.g. `../binder` and `../shelf`.
3. Stamp the software (no `.git`, no example book):

   ```bash
   scripts/stamp-instance.sh ../binder binder
   scripts/stamp-instance.sh ../shelf shelf
   ```

4. Write each `imprint.json`: `name`, `github.owner`, `github.repo`,
   distinct `storagePrefix` (`bnd` / `slf` unless taken). Binder
   `writeHref` is the binder GitHub URL. Shelf `writeHref` is the shelf
   GitHub URL. Shelf `forkHref` may point at this product.
5. In each stamped tree: `git init -b main`, first commit, then:

   ```bash
   gh repo create OWNER/binder --private --source ../binder --remote origin --push
   gh repo create OWNER/shelf --public --source ../shelf --remote origin --push
   ```

6. Enable Pages on **shelf** only, repo root (not `/docs`):

   ```bash
   gh api -X POST repos/OWNER/shelf/pages \
     -f build_type=legacy \
     -F source[branch]=main \
     -F source[path]=/
   ```

7. Hand back: write at `github.com/OWNER/binder`, read at
   `https://OWNER.github.io/shelf/reader/` (org pages:
   `https://ORG.github.io/shelf/reader/`).

Do not stamp `books/the-example-book`. Do not copy anyone’s manuscripts.
Do not turn on Pages for binder.

## promote

Copy one book from binder to shelf, then publish on the shelf.

1. Require a slug. Refuse `_TEMPLATE`.
2. Say that `OWNER/shelf` is public and the files will be world-readable.
   Wait for a yes.
3. From the binder clone:

   ```bash
   scripts/promote-book.sh <slug> ../shelf
   ```

4. On the **shelf** copy: set the book README Status to exactly
   `Published`. Add one row under **The books** in the shelf root
   README linking `books/<slug>/`. Both are required.
5. Commit and push the shelf. Confirm Pages will list it after the
   build. Leave the binder copy in place.

Do not edit `reader/` to add a book.

## unpublish

On the shelf: set Status to anything except `Published`, remove the
portal README row, commit, push. Deleting the folder is optional and
separate. Do not delete the binder copy unless asked.

## sync-reader

This product’s `reader/` is the source of truth.

```bash
scripts/sync-reader.sh
```

Default: shelf, plus binder if `../binder/reader` exists. Then commit
each updated repo. Do not overwrite `imprint.json`. Do not edit
`../shelf/reader` directly unless asked for a shelf-only customization.

## imprint

Edit that repo’s `imprint.json` only: name, lede, GitHub URL, storage
prefix, steps. Never put imprint strings into `reader/` JavaScript.

## write

On binder, same verbs as `AGENTS.md`: start a book from `_TEMPLATE`,
one chapter per change, preview at `reader/#/b/<slug>/`. Do not add the
book to a catalog until promote.
