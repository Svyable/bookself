# Revising a published work

The easy rule is:

> **Write and research the next edition on the Desk. Keep the current manuscript and evidence trail on the Shelf until the replacement is ready.**

This workflow applies to books, papers, journals, magazines, newsletters, reports, course texts, and other Bookself publication formats.

Desk and Shelf are separate Git repositories. A release copies a committed publication snapshot from Desk into Shelf; it does not create a live reference, submodule, symlink, shared branch, or shared history. After release, the copies are independent until the next deliberate release.

## The repositories

```text
Bookself upstream
  reusable Reader/Desk framework
       |
       +---- explicit Desk sync --------> Desk
       |
       +---- explicit --shelf-safe -----> Shelf local Reader core

Desk
  Reader + Publishing Desk application
  committed working publication
  manuscript + research + media + metadata + rights
       |
       | verified release transaction
       v
Shelf
  local Reader only (no desk/ authoring tree)
  committed public edition
  manuscript + research + media + metadata + rights
  + release.json source/integrity provenance
       |
       v
GitHub Pages / Reader
```

Framework sync and publication release are separate operations. Shelf must not execute Bookself upstream as a runtime dependency, and it must not contain the Publishing Desk authoring application.

Git may assign the same blob SHA to byte-identical files on Desk and Shelf. That proves equal bytes, not a live relationship. Either repository can later change independently.

A Desk is private by default in the standard setup, but may deliberately be public or lower-profile. Visibility does not change revision semantics: Shelf is canonical promoted release state, and anything committed to a public Desk is public working history even before release.

## Research is edition-bound

`books/<slug>/research/` is part of the publication snapshot. It is the durable evidence/provenance package behind factual work: ledgers, claim checks, calculations, counterevidence, methodological boundaries, dated update notes, and release reviews.

After release, Shelf research should describe **that released edition**, not the newest thing learned later. New sources and corrections belong on Desk while the next edition is being prepared. The next release replaces manuscript and research together.

That gives a reviewer a stable question to ask of a Shelf commit: *what evidence trail accompanied this exact edition?*

Before release, recheck material fast-aging claims and unresolved `recheck before release` notes. Reader-facing evidence belongs in manuscript citations, footnotes, references, figures, methodology, or back matter when useful; the fuller trail remains in `research/`.

See [Publication research](research.md) for the complete convention and third-party source-material rights boundary.

## Release provenance is separate from research provenance

A research release review can record readiness, caveats, or commits considered during review. It is not necessarily the authoritative identity of the final release transaction.

For releases prepared after the provenance cutover, Shelf carries:

```text
books/<slug>/release.json
```

That manifest records:

- the Desk source repository;
- the exact full Desk commit used by the release transaction;
- the Shelf destination identity/path;
- a deterministic digest of the authored publication payload;
- the payload file count.

The publication README is intentionally excluded from the payload digest because Shelf release preparation changes publication status/presentation metadata there. `release.json` itself is also excluded because it is destination-owned transaction metadata.

Existing historical releases are not assigned invented source commits. They acquire provenance naturally when a later deliberate release/revision is prepared through the current transaction.

## No CI/CD dependency

The release transaction is local. `scripts/release-book.sh` calls Python standard-library helpers and local Git. It does not need the GitHub API, GitHub Actions, hosted build artifacts, or a runner.

That is an architectural requirement. A Desk must remain writable, researchable, previewable, and releasable with zero Actions minutes. CI may provide read-only verification around the process; disabling it must not prevent release preparation.

## Normal revision workflow

1. Edit and research the Desk copy under `books/<slug>/`.
2. Preview/review there. Keep a working status such as `Drafting` or `Revision in progress`.
3. Keep `research/README.md` and relevant claim/source notes current as factual work changes.
4. Recheck material time-sensitive claims for the intended release.
5. Commit the revision on Desk. The release transaction refuses uncommitted publication changes so every release has a real Git snapshot behind it.
6. Leave the current Shelf edition unchanged while drafting/researching.
7. When ready, prepare the release from Desk:

```bash
scripts/release-book.sh <slug> [path-to-shelf]
```

The transaction checks that:

- source is a Desk and destination is a Shelf;
- the Desk publication is committed and clean;
- Shelf release paths are clean;
- the publication slug is safe.

It then:

- pins the exact Desk `HEAD` commit;
- stages the complete publication tree, including `research/`, media, presentation, and rights;
- changes only Shelf-specific publication metadata needed for release state (including `Status: Published`);
- adds or updates Shelf catalog state;
- byte-verifies authored payload against the committed Desk snapshot;
- atomically replaces the prior Shelf publication;
- writes `books/<slug>/release.json` with exact source commit and deterministic payload integrity;
- refreshes configured public/generated release surfaces;
- verifies the result and rolls back the prepared release paths if a later step fails;
- stops before commit or push.

Review the resulting Shelf diff, including research, rights, and `release.json`. Commit/push it through the Shelf's normal Git workflow when correct. A pull request is useful but not required by Bookself itself.

## Why Shelf should stay stable

A public Git repository remains public even when Reader navigation hides something. Changing a Shelf publication from `Published` to a drafting state may remove it from the visible catalog while leaving raw files/history public.

So Bookself treats these as different states:

| State | Where it belongs | Visible on Shelf | Raw source public? |
|---|---|---:|---:|
| Private working draft / next revision | private Desk | No | No |
| Public/lower-profile working draft | public Desk | No | Yes |
| Published edition | Shelf | Yes | Yes |
| Intentionally public proof | explicitly public proof location | Not necessarily | Yes |

An unlisted public proof can be useful, but it is not a privacy boundary and is not canonical Shelf release state.

## Direct public hotfixes

A direct Shelf manuscript edit is exceptional because it breaks the normal Desk-source transaction unless reconciled.

If a human explicitly requires an immediate public correction:

1. make/reconcile the same correction on Desk;
2. commit the Desk source of truth;
3. run the release transaction to refresh Shelf from that committed source;
4. require `release.json` to match the hotfixed payload;
5. land the Shelf change normally.

Do not delete or bypass provenance checks merely to make a direct manuscript edit pass CI.

## Course texts and semester editions

For a course text, treat the public Shelf copy as the edition students were actually assigned—including its research trail and release provenance. Keep next-term rewrites/evidence on Desk and release the replacement only when the new semester edition is ready.

For a worked teaching example—including semester stability, hotfixes, rollback, and exact-version citation—see [Bookself 101: Semester Editions and Release](../books/bookself-101/manuscript/ch04-semester-editions.md).

A syllabus/LMS can record both:

- **Read:** the convenient current Shelf Reader URL.
- **Released version:** the public Shelf commit defining the assigned edition.

The Shelf commit identifies the exact public tree. `release.json` additionally records which Desk commit produced the edition. These serve different audiences and do not require tags, GitHub Releases, DOI, or CI.

## Recovery and rollback

Shelf Git history is the public release history. A previous edition can be restored from its historical Shelf tree/blobs without reconstructing it from current Desk state. That restoration includes the edition's research trail and any release provenance present in that historical snapshot.

Rollback does not require CI: restore historical Shelf files into a branch/working tree, review, and commit the public recovery. If a rollback becomes a new forward release rather than a pure historical restoration, prepare it from a committed Desk source so provenance remains explicit.

## Lower-level copy command

`scripts/promote-book.sh` remains available when you deliberately want only a file copy. It does **not** publish, verify the full release transaction, create release provenance, or update all public release surfaces.

For normal publication and revisions, use `scripts/release-book.sh`.
