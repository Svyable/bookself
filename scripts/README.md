# Bookself local tools

Bookself's canonical local tools are Python so the same commands work on macOS, Windows, and Linux.

```text
python scripts/bootstrap-workspace.py <workspace> --owner <owner> --json
python scripts/doctor.py
python scripts/check-catalog.py
python scripts/sync-ui.py
python scripts/release-book.py <slug> [path-to-shelf]
python scripts/promote-book.py <slug> [path-to-shelf]
python scripts/stamp-instance.py <destination> <desk|shelf> <owner> <repository>
```

`bootstrap-workspace.py` is the outcome-oriented starting point for a new local Bookself setup. It creates sibling Desk and Shelf instances, stamps their roles, initializes Git repositories by default, and can emit machine-readable JSON for coding agents. Use `--no-git` only when another tool will initialize the repositories.

`stamp-instance.py` remains the lower-level single-instance primitive. New Desks include all blank publication starters; new Shelves begin with an empty `books/` directory so only deliberate releases become public content.

`check-catalog.py` is a focused, read-only check for the Reader's root `## The books` catalog. On a public Shelf it verifies that cataloged publications are actually `Published` and that every published publication is listed. On the Bookself platform it also catches published example specimens that exist under `books/` but are invisible because their catalog row was forgotten.

`release-book.py` is the normal Desk → Shelf release transaction. `promote-book.py` is only a lower-level copy primitive and does not publish or verify a release.

On Windows, `py` may be used instead of `python` when that is how Python is installed.

The `.sh` files are convenience wrappers for Unix-like shells. They are not required by Bookself's portability contract.

No `pip install` step is required.
