# Classroom Release Handbook

## Purpose and scope

This handbook is for an instructor, teaching assistant, or department maintainer who wants students to read a stable public course publication while the next revision remains private.

The central rule is simple: **draft in Binder; release to Shelf**. The Binder is the private working repository. The Shelf is the public repository students read. A release copies a committed publication snapshot from Binder to Shelf; it does not create a live connection between them.

This handbook covers the ordinary local-first path. It does not require GitHub Actions, a hosted build service, or a public Binder.

## Before the semester begins

Decide which publication students will read and which edition the course is assigning. Keep the working copy in the private Binder with `Status: Drafting` while you revise it.

Before release, verify four things:

1. The manuscript files and media you intend to publish are committed in Binder.
2. The publication README names the right title, authors, edition, and format.
3. The Reader proof looks right when served locally.
4. Nothing in the publication folder contains notes, answer keys, private feedback, or next-semester material that should remain private.

A public Shelf is not an access-control system. Anything committed and pushed there should be treated as intentionally public.

## Proof the course edition

From the private Binder, serve the repository locally:

```bash
python3 -m http.server
```

Then open the publication in the Reader at:

```text
reader/#/b/<slug>/
```

Read it as a student would. Check navigation, figures, citations, tables, links, and any instructions that depend on sequence. If the publication has a Reader presentation recommendation, also check that the content still works after changing the Reader's personal display settings.

Proofing is a reading task, not just a file check. A chapter that looks fine in an editor can still reveal bad pacing, broken media, or unclear headings when it becomes a publication.

## Release the assigned edition

Commit the Binder publication before releasing it. Then prepare the Shelf snapshot with:

```bash
scripts/release-book.sh <slug> ../shelf
```

The release helper verifies the Binder and Shelf roles, copies the committed publication snapshot, marks the Shelf copy `Published`, updates the Shelf catalog entry, and stops before commit or push.

Review the prepared Shelf diff. When it is correct, commit and publish that Shelf change through the repository's normal Git workflow.

Do not continue editing the next edition in the public Shelf. Return to the private Binder for the next revision.

## Give students a stable reference

For a normal class, give students the public Shelf Reader link. If the exact assigned edition matters for grading, reproducibility, or archival reference, also record the public Shelf commit SHA used for the assignment.

That pairing gives students a friendly reading URL and gives the teaching team an exact public revision to refer back to later.

Do not use the private Binder commit as the student-facing edition reference. The Binder may contain work students should not see, and it is not the released artifact.

## Revise while the course is running

A typo does not require turning the Shelf back into a drafting space.

Make the correction in Binder first. Review it there, commit it, and prepare a replacement Shelf release when the change is ready to become public. This keeps the normal boundary intact and leaves an understandable history on both sides.

For a genuinely urgent public hotfix, use explicit human judgment. The default workflow remains Binder first, then deliberate release.

## Prepare next semester without exposing it

Keep the current Shelf edition stable while you revise the next semester's material in Binder. This matters most when the new edition contains changed assignments, answer material, unpublished readings, or structural experiments.

Students should not have to guess whether a public page is this semester's assigned edition or next semester's draft. The separate repositories make that distinction concrete.

When the new edition is ready, release the committed Binder snapshot and update the student-facing edition record.

## Troubleshooting

| What you observe | Likely cause | Safest next check |
|---|---|---|
| The book does not appear on the public Shelf | The Shelf copy is not `Published`, or its root catalog row is missing | Inspect the prepared release diff before committing |
| A figure is missing in the Reader | The manuscript path or publication-relative media path is wrong | Open the figure path from the publication folder and proof locally again |
| Students can see material meant for next term | Work was placed in the public Shelf instead of remaining in Binder | Stop adding draft material to Shelf; move future revision work back to the private Binder |
| The released text differs from the intended Binder revision | The release source was not the committed snapshot you expected | Check the Binder commit, then rerun the normal release preparation |
| A public correction is needed | The released edition has an error | Fix and review in Binder, then prepare a replacement Shelf release |

## Semester handoff checklist

Before publishing a new course edition:

- [ ] The assigned manuscript is committed in the private Binder.
- [ ] The publication metadata identifies the intended edition.
- [ ] The local Reader proof has been read, not merely opened.
- [ ] Private notes, answer material, and future-edition work are absent from the release folder.
- [ ] The release helper has prepared the Shelf snapshot from the committed Binder state.
- [ ] The Shelf diff has been reviewed before commit or push.
- [ ] Students receive the public Shelf Reader link.
- [ ] The teaching team records the public Shelf commit SHA when exact-edition reproducibility matters.
- [ ] Further revisions return to Binder rather than continuing in Shelf.

The useful habit is not complicated: one private working copy, one deliberate public snapshot, and a clear record of which public revision the class was actually assigned.
