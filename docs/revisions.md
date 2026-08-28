# Revising a published work

The easy rule is:

> **Write the next edition on the Desk. Keep the current edition on the Shelf until the replacement is ready.**

This same workflow applies to books, papers, journals, magazines, newsletters, reports, course texts, and other Bookself publication formats.

Desk and Shelf are separate Git repositories. A release copies a publication snapshot from Desk into Shelf; it does not create a live reference, submodule, symlink, or shared history between the two repositories. After release, the copies are independent until the next release.

## The repositories

```text
Bookself upstream
  shared Reader / Publishing Desk UI
       | sync copies
       +-------------> Desk  (private working edition)
       +-------------> Shelf (public released edition)

Desk
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

Git may assign the same blob SHA to byte-identical files on Desk and Shelf. That proves those file contents match; it does not link the repositories. Either copy can change later without changing the other.

## No CI/CD dependency

The release transaction is local. `scripts/release-book.sh` calls the Python standard-library release helper and local Git; it does not call the GitHub API, start GitHub Actions, upload a build artifact, or require a hosted runner.

Despite the historical `release-book` command name, the release helper accepts any Bookself publication slug; it is not limited to book-format publications.

That is an architectural requirement, not merely the current implementation. A private Desk must remain fully writable, previewable, and releasable with zero GitHub Actions minutes. CI and pull-request checks may be useful optional review tools, but exhausting or disabling them must not block publication.

## Normal revision workflow

1. Edit the private Desk copy under `books/<slug>/`.
2. Preview and review there. Keep a non-published status such as `Drafting` or `Revision in progress`.
3. Commit the revision on the Desk. The release command refuses uncommitted publication changes so every release has a real Git snapshot behind it.
4. Leave the current Shelf edition alone while drafting.
5. When the revision is ready, prepare the release from Desk:

```bash
scripts/release-book.sh <slug> [path-to-shelf]
```

The command checks that:

- it is running from a Desk instance and targeting a Shelf instance
- the Desk publication is committed and clean
- the Shelf catalog and destination publication have no uncommitted changes
- the publication slug is safe

It then:

- stages an exact replacement copy of the Desk publication
- changes only the Shelf copy's `Status` to `Published`
- adds or updates the root Shelf catalog row
- replaces the old Shelf publication snapshot
- verifies that every publication file except the intentionally different publication README byte-matches the committed Desk snapshot
- prints the Desk commit SHA used for the release
- stops before commit or push

Review the resulting Shelf diff. Commit and push it with the Shelf's normal Git workflow when it is correct. A pull request is a useful review boundary but is not required by Bookself itself.

## Course texts and semester editions

For a course text, treat the public Shelf copy as the edition students were actually assigned. Keep next-term rewrites on the private Desk, and release the replacement only when the new semester edition is ready. An intentional public hotfix can correct the current edition without turning the Shelf into the normal drafting workspace.

For a worked teaching example—including semester stability, hotfixes, rollback, and exact-version citation—see [Bookself 101: Semester Editions and Release](../books/bookself-101/manuscript/ch04-semester-editions.md).

### Record the assigned edition

A syllabus or LMS can keep the convenient current Reader link for students and also record the public Shelf commit that defined the assigned edition. That gives the class a simple two-part reference:

- **Read:** the Shelf Reader URL students normally open.
- **Provenance:** the public Shelf commit SHA (and optionally its date) for the edition assigned at the start of the course or after an intentional hotfix.

Record the **Shelf** commit after the release has been reviewed, committed, and pushed. Do not use the private Desk commit as a student-facing provenance link: the release helper prints that SHA to verify the source snapshot, but a real Desk is private and should stay that way.

This does not require tags, GitHub Releases, a DOI, or CI. Those can be added when a course or institution already uses them, but an ordinary public Shelf commit is enough to identify the exact files students were assigned.

## Why Shelf should stay stable

A public Git repository is public even when the Reader hides a publication. Changing a Shelf publication from `Published` to `Revision in progress` can remove it from the visible bookshelf, but its raw Markdown and Git history remain public.

So Bookself treats these as different states:

| State | Where it belongs | Visible on Shelf | Raw source public? |
|---|---|---:|---:|
| Private draft / next revision | Desk | No | No |
| Published edition | Shelf | Yes | Yes |
| Intentionally public proof | Desk or another explicitly public proof location | No | Yes |

An unlisted public proof can be useful, but it is not a privacy boundary.

## Recovery and rollback

Shelf Git history is the release history. A previous published edition can be restored from its historical Shelf tree and blobs without reconstructing it from Desk. This keeps rollback deterministic even after Desk has moved on to a newer draft.

Rollback also does not require a CI pipeline: restore the historical Shelf files into a branch or working tree, review the diff, and commit the public recovery.

## Lower-level copy command

`scripts/promote-book.sh` remains available when you deliberately want only the file copy. It does not publish, verify the release transaction, or edit the root catalog.

For normal publication and revision releases, use `scripts/release-book.sh`.
