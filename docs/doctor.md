# Bookself doctor

`doctor.py` is a read-only local health check for a Bookself platform, Desk, or Shelf checkout.

It exists for one reason: a contributor or author should not have to remember every repository invariant before they can answer **“does this checkout look healthy?”**

## Run it

From the repository root:

```bash
python3 scripts/doctor.py
```

For machine-readable output:

```bash
python3 scripts/doctor.py --json
```

To inspect another checkout without changing directories:

```bash
python3 scripts/doctor.py --root ../shelf
```

The command does not modify files, call GitHub, contact a network service, run Actions, or install anything.

## What it checks

The doctor reads `imprint.json` to identify the repository as a Bookself **platform**, **desk**, or **shelf**, then checks the invariants that matter for that role.

Across roles it checks:

- `imprint.json` exists, parses, and has a known role;
- the Reader and Publishing Desk are present;
- the root `README.md` catalog can be read;
- cataloged publication folders and README hubs exist;
- referenced manuscript files exist;
- publication status and author metadata are visible;
- Git worktree / branch / cleanliness when Git is available.

For a **Shelf**, it additionally catches the two sides of the public catalog contract:

- a cataloged book that is not `Status: Published`;
- a publication that says `Status: Published` but is missing from the root catalog.

For a **Desk**, it flags `Status: Published` as an error because Published is a Shelf state. Drafts and next revisions belong on the Desk without pretending to be the released public copy.

For the **platform**, it checks that the publication templates plus local release helpers are present.

The old `binder` role is invalid and is reported as an unknown role rather than silently treated as a Desk.

## Errors, warnings, and information

A doctor **error** means the repository contradicts a Bookself invariant or is missing something required for the detected role. The command exits with status `1` when any errors are present.

A **warning** means the checkout may be perfectly usable but deserves attention. A dirty Git working tree is a warning, for example, because editing is normal; the doctor should not call normal work a failure.

Informational findings do not affect the exit status.

## Hosted automation is not part of the health contract

If `.github/workflows/` contains Actions workflows, the doctor only reports that they exist. It does not require them and does not use their status to decide whether the repository is healthy.

That is intentional. Bookself must remain writable, previewable, releasable, and readable without a mandatory hosted CI/CD path.

## Use it before a release or when debugging

Useful moments to run the doctor include:

- after stamping a new Desk or Shelf;
- before preparing a Desk → Shelf release;
- after moving or renaming manuscript files;
- after restoring an older public edition;
- when the Reader catalog and repository files seem to disagree;
- when an agent needs a quick structured view of repository health.

The doctor complements `scripts/release-book.sh`; it does not replace the release helper's transaction and copy verification.

## Tests

The doctor has stdlib-only fixture tests:

```bash
python3 scripts/test_doctor.py
```

They cover a healthy platform, catalog parsing, Shelf status/catalog mismatches, Desk `Published` state, obsolete-role rejection, and missing manuscript files.

## What it intentionally does not do

The doctor does not:

- fix files automatically;
- publish or unpublish anything;
- push, commit, tag, or merge;
- decide whether prose or research claims are correct;
- fetch private repositories;
- require the GitHub CLI;
- depend on GitHub Actions;
- compile TeX or build the Reader.

A health check should make state legible, not quietly change it.
