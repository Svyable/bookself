# Bookself local tools

Bookself's canonical local tools are Python so the same commands work on macOS, Windows, and Linux.

```text
python3 scripts/bootstrap-workspace.py <workspace> --owner <owner> --json
python3 scripts/doctor.py --root .
python3 scripts/doctor-pair.py <desk-path> <shelf-path>
python3 scripts/publication_state.py <slug> --root . --json
python3 scripts/changed_publications.py <base> [head] --root . --json
python3 scripts/check-catalog.py
python3 scripts/sync-ui.py --desk-safe <desk-path>
python3 scripts/sync-ui.py --shelf-safe <shelf-path>
python3 scripts/release.py <slug> [path-to-shelf]
python3 scripts/promote-book.py <slug> [path-to-shelf]
python3 scripts/stamp-instance.py <destination> <desk|shelf> <owner> <repository>
```

`bootstrap-workspace.py` is the outcome-oriented starting point for a new local Bookself setup. It creates sibling Desk and Shelf instances named `desk` and `shelf` by default, stamps their roles, initializes separate Git repositories, and immediately runs the pair doctor. Its JSON result includes `pairValidation.setupReady` so an agent has a concrete setup completion signal. Use `--no-git` only when another tool will initialize the repositories; pair validation is deferred until then.

`doctor.py` validates one Bookself repository. `doctor-pair.py` validates an installation as a pair: exact Desk/Shelf roles, separate Git worktrees, instance identities, Reader/Desk presence, and release-state invariants.

`publication_state.py` reports bounded state for one publication rather than asking an agent to reason over the entire library. Its JSON result includes the publication ID/path, human metadata, repository role, catalog membership, publication-scoped Git dirtiness, available release provenance, and structural errors/warnings. The canonical publication ID is currently the publication slug under `books/`, scoped to one Bookself installation. Treat that slug as durable after creation; changing it is a publication-identity migration, not a cosmetic rename.

`changed_publications.py` converts a Git diff into the publication IDs that actually changed. It uses merge-base diff semantics (`base...head`), excludes underscore-prefixed starter/template directories from concrete publication work, and reports non-publication changes separately as `globalPaths` / `globalChange`. A supervisor can deeply process the returned publications while deciding independently whether a framework/template/global change should fan out more broadly.

`sync-ui.py` owns framework-update policy. Use the role-specific safe mode for real instances: `--desk-safe` updates Bookself-owned Reader runtime while preserving Desk-owned authoring state; `--shelf-safe` updates reusable Shelf Reader code while preserving the Shelf shell, adapter, service worker, identity, books, catalog, and release state. Whole-tree sync into a Desk or Shelf is intentionally rejected. Instance-side wrapper scripts should delegate here rather than reimplement synchronization.

`stamp-instance.py` remains the lower-level single-instance primitive. New Desks include blank publication starters; new Shelves begin with an empty `books/` directory so only deliberate releases become public content.

`check-catalog.py` is a focused, read-only check for the Reader's root `## The books` catalog. On a public Shelf it verifies that cataloged publications are actually `Published` and that every published publication is listed. On the Bookself platform it also catches published example specimens that exist under `books/` but are invisible because their catalog row was forgotten.

`release.py` is the normal Desk → Shelf release transaction. It calls the proven release snapshot core and, in the same transaction, regenerates the released Shelf's canonical publication pages, publication index, and sitemap. If web generation fails, it restores the affected Shelf paths rather than leaving a half-prepared release. `promote-book.py` is only a lower-level copy primitive and does not publish or verify a release.

On Windows, `py` may be used instead of `python3` when that is how Python is installed. The `.sh` files are convenience wrappers for Unix-like shells; they are not required by Bookself's portability contract.

No `pip install` step is required.
