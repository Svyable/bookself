# Bookself local tools

Bookself's canonical local tools are Python so the same commands work on macOS, Windows, and Linux.

```text
python3 scripts/bootstrap-workspace.py <workspace> --owner <owner> --json
python3 scripts/doctor.py --root .
python3 scripts/doctor-pair.py <desk-path> <shelf-path>
python3 scripts/check-catalog.py
python3 scripts/sync-ui.py
python3 scripts/release-book.py <slug> [path-to-shelf]
python3 scripts/promote-book.py <slug> [path-to-shelf]
python3 scripts/stamp-instance.py <destination> <desk|shelf> <owner> <repository>
```

`bootstrap-workspace.py` is the outcome-oriented starting point for a new local Bookself setup. It creates sibling Desk and Shelf instances named `desk` and `shelf` by default, stamps their roles, initializes separate Git repositories, and immediately runs the pair doctor. Its JSON result includes `pairValidation.setupReady` so an agent has a concrete setup completion signal. Use `--no-git` only when another tool will initialize the repositories; pair validation is deferred until then.

`doctor.py` validates one Bookself repository. `doctor-pair.py` validates the installation as a pair: exact Desk/Shelf roles, separate Git worktrees, byte-for-byte shared `reader/` and `desk/` software, the Desk starter library, no starters on Shelf, distinct instance identities, and the rule that every Shelf publication is an actual `Published` cataloged release.

`stamp-instance.py` remains the lower-level single-instance primitive. New Desks include all blank publication starters; new Shelves begin with an empty `books/` directory so only deliberate releases become public content.

`check-catalog.py` is a focused, read-only check for the Reader's root `## The books` catalog. On a public Shelf it verifies that cataloged publications are actually `Published` and that every published publication is listed. On the Bookself platform it also catches published example specimens that exist under `books/` but are invisible because their catalog row was forgotten.

`release-book.py` is the normal Desk → Shelf release transaction. `promote-book.py` is only a lower-level copy primitive and does not publish or verify a release.

On Windows, `py` may be used instead of `python3` when that is how Python is installed.

The `.sh` files are convenience wrappers for Unix-like shells. They are not required by Bookself's portability contract.

No `pip install` step is required.
