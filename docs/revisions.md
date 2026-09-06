# Revising a published work

The easy rule is:

> **Write and research the next edition on the Desk. Keep the current manuscript and evidence trail on the Shelf until the replacement is ready.**

This same workflow applies to books, papers, journals, magazines, newsletters, reports, course texts, and other Bookself publication formats.

Desk and Shelf are separate Git repositories. A release copies a publication snapshot from Desk into Shelf; it does not create a live reference, submodule, symlink, or shared history between the two repositories. After release, the copies are independent until the next release.

## The repositories

```text
Bookself upstream
  shared Reader / Publishing Desk UI + blank starters
       | sync / stamp copies
       +-------------> Desk  (working edition)
       +-------------> Shelf (public released edition)

Desk
  committed working publication
  manuscript/ + research/ + media/ + metadata + rights
       |
       | release = verified copy
       v
Shelf
  committed public edition
  manuscript/ + research/ + media/ + metadata + rights
       |
       v
GitHub Pages / Reader
```

Git may assign the same blob SHA to byte-identical files on Desk and Shelf. That proves those file contents match; it does not link the repositories. Either copy can change later without changing the other.

A Desk is private by default in the standard setup, but it may deliberately be public or lower-profile. That visibility choice does not change revision semantics: Shelf is the canonical promoted release surface, and anything committed to a public Desk is public working history even before release.

## Research is edition-bound

`books/<slug>/research/` is part of the publication snapshot. It is the durable source and provenance package behind factual work: ledgers, claim checks, calculations, counterevidence, methodological boundaries, dated update notes, and release fact-checks.

After a release, the Shelf research trail should describe **that released edition**, not the newest thing the author or an agent has learned. New sources and corrections belong on Desk while the next edition is being prepared. The next deliberate release replaces manuscript and research together.

That gives a reviewer or researcher a stable question to ask of any Shelf commit: *what evidence trail accompanied this exact edition?*

Before release, recheck material fast-aging claims and unresolved `recheck before release` notes. Reader-facing evidence belongs in manuscript citations, footnotes, references, figures, methodology, or back matter when it helps a reader follow the argument; the fuller trail remains in `research/`.

See [Publication research](research.md) for the complete convention and third-party source-material rights boundary.

## No CI/CD dependency

The release transaction is local. `scripts/release-book.sh` calls the Python standard-library release helper and local Git; it does not call the GitHub API, start GitHub Actions, upload a build artifact, or require a hosted runner.

Despite the historical `release-book` command name, the release helper accepts any Bookself publication slug; it is not limited to book-format publications.

That is an architectural requirement, not merely the current implementation. A Desk must remain fully writable, researchable, previewable, and releasable with zero GitHub Actions minutes. CI and pull-request checks may be useful optional review tools, but exhausting or disabling them must not block publication.

## Normal revision workflow

1. Edit and research the Desk copy under `books/<slug>/`.
2. Preview and review there. Keep a non-published status such as `Drafting` or `Revision in progress`.
3. Keep `research/README.md` and relevant claim/source notes current as factual work changes. Preserve counterevidence and uncertainty instead of rewriting history around the newest argument.
4. Recheck material time-sensitive claims for the intended release.
5. Commit the revision on the Desk. The release command refuses uncommitted publication changes so every release has a real Git snapshot behind it.
6. Leave the current Shelf edition alone while drafting and researching.
7. When the revision is ready, prepare the release from Desk:

```bash
scripts/release-book.sh <slug> [path-to-shelf]
```

The command checks that:

- it is running from a Desk instance and targeting a Shelf instance
- the Desk publication is committed and clean
- the Shelf catalog and destination publication have no uncommitted changes
- the publication slug is safe

It then:

- stages an exact replacement copy of the complete Desk publication, including `research/`
- changes only the Shelf copy's `Status` to `Published`
- adds or updates the root Shelf catalog row
- replaces the old Shelf publication snapshot
- verifies that every publication file except the intentionally different publication README byte-matches the committed Desk snapshot
- prints the Desk commit SHA used for the release
- stops before commit or push

Review the resulting Shelf diff, including research and rights files. Commit and push it with the Shelf's normal Git workflow when it is correct. A pull request is a useful review boundary but is not required by Bookself itself.

## Course texts and semester editions

For a course text, treat the public Shelf copy as the edition students were actually assigned—including the research trail that supported that edition. Keep next-term rewrites and new evidence on the Desk, and release the replacement only when the new semester edition is ready. An intentional public hotfix can correct the current edition without turning the Shelf into the normal drafting workspace.

For a worked teaching example—including semester stability, hotfixes, rollback, and exact-version citation—see [Bookself 101: Semester Editions and Release](../books/bookself-101/manuscript/ch04-semester-editions.md).

### Record the assigned edition

A syllabus or LMS can keep the convenient current Reader link for students and also record the public Shelf commit that defined the assigned edition. That gives the class a simple two-part reference:

- **Read:** the Shelf Reader URL students normally open.
- **Provenance:** the public Shelf commit SHA (and optionally its date) for the edition assigned at the start of the course or after an intentional hotfix.

That Shelf commit identifies the exact manuscript and research files together. Record the **Shelf** commit after the release has been reviewed, committed, and pushed. Do not assume the Desk commit is an appropriate student-facing link: a Desk may be private, public, or lower-profile depending on the author's working mode, while the Shelf commit is the canonical released edition reference.

This does not require tags, GitHub Releases, a DOI, or CI. Those can be added when a course or institution already uses them, but an ordinary public Shelf commit is enough to identify the exact files students were assigned.

## Why Shelf should stay stable

A public Git repository is public even when the Reader hides a publication. Changing a Shelf publication from `Published` to `Revision in progress` can remove it from the visible bookshelf, but its raw Markdown, research, and Git history remain public.

So Bookself treats these as different states:

| State | Where it belongs | Visible on Shelf | Raw source public? |
|---|---|---:|---:|
| Private working draft / next revision | Desk | No | No |
| Public/lower-profile working draft | Desk | No | Yes |
| Published edition | Shelf | Yes | Yes |
| Intentionally public proof | Desk or another explicitly public proof location | No | Yes |

An unlisted public proof can be useful, but it is not a privacy boundary and it is not the canonical Shelf release.

## Recovery and rollback

Shelf Git history is the release history. A previous published edition can be restored from its historical Shelf tree and blobs without reconstructing it from Desk. That restoration includes the edition's research trail, which is important when the evidence behind later revisions has changed.

Rollback also does not require a CI pipeline: restore the historical Shelf files into a branch or working tree, review the diff, and commit the public recovery.

## Lower-level copy command

`scripts/promote-book.sh` remains available when you deliberately want only the file copy. It does not publish, verify the release transaction, or edit the root catalog.

For normal publication and revision releases, use `scripts/release-book.sh`.
