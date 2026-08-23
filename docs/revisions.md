# Revising a published book

The easy rule is:

> **Write the next edition in Binder. Keep the current edition on Shelf until the replacement is ready.**

Binder and Shelf are separate Git repositories. A release copies a publication snapshot from Binder into Shelf; it does not create a live reference, submodule, symlink, or shared history between the two repositories. After release, the copies are independent until the next release.

## The three repositories

```text
Bookself platform
  shared Reader / Desk
       | sync copies
       +-------------> Binder (private working edition)
       +-------------> Shelf  (public released edition)

Binder
  committed working snapshot
       |
       | release = verified copy
       v
Shelf
  committed public snapshot
       |
       v
GitHub Pages / Reader
```

Git may assign the same blob SHA to byte-identical files in Binder and Shelf. That proves those file contents match; it does not link the repositories. Either copy can change later without changing the other.

## Normal revision workflow

1. Edit the private Binder copy under `books/<slug>/`.
2. Preview and review there. Keep a non-published status such as `Drafting` or `Revision in progress`.
3. Commit the revision in Binder. The release command refuses uncommitted publication changes so every release has a real Git snapshot behind it.
4. Leave the current Shelf edition alone while drafting.
5. When the revision is ready, prepare the release from Binder:

```bash
scripts/release-book.sh <slug> [path-to-shelf]
```

The command checks that:

- it is running from a Binder instance and targeting a Shelf instance
- the Binder publication is committed and clean
- the Shelf catalog and destination publication have no uncommitted changes
- the publication slug is safe

It then:

- stages an exact replacement copy of the Binder publication
- changes only the Shelf copy's `Status` to `Published`
- adds or updates the root Shelf catalog row
- replaces the old Shelf publication snapshot
- verifies that every publication file except the intentionally different book README byte-matches the committed Binder snapshot
- prints the Binder commit SHA used for the release
- stops before commit or push

Review the resulting Shelf diff. Commit it through the normal Shelf branch / pull-request workflow when it is correct.

## Why Shelf should stay stable

A public Git repository is public even when the Reader hides a publication. Changing a Shelf book from `Published` to `Revision in progress` can remove it from the visible bookshelf, but its raw Markdown and Git history remain public.

So Bookself treats these as different states:

| State | Where it belongs | Visible on Shelf | Raw source public? |
|---|---|---:|---:|
| Private draft / next revision | Binder | No | No |
| Published edition | Shelf | Yes | Yes |
| Intentionally public proof | Shelf, only when explicitly intended | No | Yes |

An unlisted public proof can be useful, but it is not a privacy boundary.

## Recovery and rollback

Shelf Git history is the release history. A previous published edition can be restored from its historical Shelf tree and blobs without reconstructing it from Binder. This keeps rollback deterministic even after Binder has moved on to a newer draft.

## Lower-level copy command

`scripts/promote-book.sh` remains available when you deliberately want only the file copy. It does not publish, verify the release transaction, or edit the root catalog.

For normal publication and revision releases, use `scripts/release-book.sh`.
