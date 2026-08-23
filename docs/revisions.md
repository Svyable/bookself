# Revising a published book

The easy rule is:

> **Write the next edition in Binder. Keep the current edition on Shelf until the replacement is ready.**

That keeps readers on a stable published book while the next revision stays private.

## Normal revision workflow

1. Open the private Binder copy under `books/<slug>/`.
2. Edit and preview there. The Binder may say `Drafting`, `Revision in progress`, or another non-published status.
3. Do **not** change the public Shelf copy while the revision is underway.
4. When the revision is ready, prepare the release from Binder:

```bash
scripts/release-book.sh <slug> [path-to-shelf]
```

The command:

- copies the Binder publication into the Shelf checkout
- sets the Shelf copy's `Status` to `Published`
- ensures the root Shelf README catalogs the publication
- stops before commit or push

It then prints the exact `git diff`, `git add`, `git commit`, and `git push` commands to use after review.

## Why Shelf should stay stable

A public Git repository is public even when the Reader hides a publication. Changing a Shelf book from `Published` to `Revision in progress` can remove it from the visible bookshelf, but its raw Markdown and direct Reader proof URL may still be reachable.

So Bookself treats these as different ideas:

| State | Where it belongs | Shelf listing | Raw source public? |
|---|---|---:|---:|
| Private draft / next revision | Binder | No | No |
| Published edition | Shelf | Yes | Yes |
| Intentionally public proof | Shelf, only when you mean it | No | Yes |

An unlisted public proof can be useful, but it should never be mistaken for privacy.

## Lower-level copy command

`scripts/promote-book.sh` remains available when you deliberately want only the file copy. It does not publish or edit the root catalog.

For normal releases, prefer `scripts/release-book.sh`.
