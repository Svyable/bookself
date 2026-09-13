# Contributor map

Bookself is easier to work on when one question is answered first: **who owns the thing you are changing?**

The system has three repository roles and one shared reading surface:

- **Bookself (`platform`)** owns reusable software, templates, tooling, and documentation.
- **Desk (`desk`)** owns working manuscripts, research, authoring state, and the next edition.
- **Shelf (`shelf`)** owns deliberately released publication snapshots and public publishing state.
- **Reader** is reusable Bookself software copied into Desk and Shelf. It is not a fourth source of publication truth.

Desk and Shelf are separate repositories with separate histories. A release copies a committed Desk publication into Shelf. A framework update copies Bookself-owned software into an instance. Those are different operations.

## Where a change belongs

| Change | Canonical home |
|---|---|
| Reader behavior, pagination, accessibility, search, media, citations, typesetting | Bookself `reader/` |
| Shared publishing/authoring UI | Bookself `desk/` |
| Framework sync, bootstrap, doctor, release mechanics | Bookself `scripts/` |
| Reusable templates and conventions | Bookself template folders and `docs/` |
| Draft or next-edition prose | the author's Desk `books/<slug>/` |
| Released prose or publication state | Shelf, normally only through the Desk → Shelf release transaction |
| Instance identity, local adapters, local policy | that Desk or Shelf instance |

Do not fix shared Reader behavior independently in Desk and Shelf. Fix it in Bookself, then synchronize it outward. Do not put unpublished prose in Bookself or Shelf merely because their Readers can display it.

## Dependency direction

Keep the graph boring:

```text
Bookself software  ──sync──▶  Desk
        │
        └──────────sync──▶  Shelf

Desk publication  ─release▶  Shelf publication
```

Production Desk and Shelf Readers execute **local committed files**. Neither instance should import executable Reader code from another instance, and Bookself Pages is not a production CDN for them.

This means:

- Bookself must not depend on a personal Desk or Shelf.
- Desk must not execute Reader code from Shelf.
- Shelf must not execute Reader code from Desk or Bookself Pages.
- Shelf must never receive Bookself's authoring `desk/` application tree.
- Instance-owned books, identity, catalog/release state, and adapters are not framework-sync payloads.

## Updating an instance from Bookself

Use the role-specific safe boundary. The flags are intentional: they make destructive whole-tree copying harder to do accidentally.

```bash
scripts/sync-ui.sh --desk-safe /path/to/desk
scripts/sync-ui.sh --shelf-safe /path/to/shelf
```

A Desk normally exposes the friendlier instance-side wrapper:

```bash
scripts/sync-bookself.sh /path/to/bookself
```

That wrapper delegates to Bookself's `--desk-safe` implementation; it should not grow a second synchronization engine.

`--desk-safe` copies the Bookself-owned Reader runtime declared by Bookself's service-worker shell, verifies the next Reader away from the live instance, localizes its runtime references, and only then promotes it. Desk-owned shell/integration files and manuscripts remain Desk state.

`--shelf-safe` updates reusable Reader engine code while preserving the Shelf-owned public shell, service worker, adapter, identity styles, books, catalog, and release state. Bookself's core app is materialized locally for the Shelf adapter.

If either role needs special behavior, prefer a small instance adapter over a fork of shared Reader logic.

## Working locally

Bookself remains no-build and local-first. Start with the checks closest to the change rather than installing a large toolchain.

```bash
python3 scripts/doctor.py
python3 -m unittest discover -s tests -p 'test_*.py'
python3 -m http.server
```

Then open `/reader/` or `/desk/` from the local server. Reader modules also have focused zero-install Node tests where appropriate.

GitHub Actions may repeat these checks, but hosted CI is verification, not part of the authoring or publishing mechanism.

## A small-change rule

Prefer one owner and one reason per PR. A good change usually answers four questions without a diagram:

1. What user or maintainer problem does this solve?
2. Which repository owns the behavior?
3. Which instance-owned state must remain untouched?
4. What focused check proves the boundary still holds?

If the answer requires copying the same implementation into Bookself, Desk, and Shelf, the boundary is probably wrong. If the answer requires a new configuration system for one bug, the design is probably too large.

The goal is not abstraction for its own sake. The goal is that a human or agent can change one thing confidently without learning the entire publishing system first.
