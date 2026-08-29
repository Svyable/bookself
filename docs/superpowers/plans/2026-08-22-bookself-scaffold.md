# Bookself scaffold — historical implementation summary

**Date:** 2026-08-22  
**Status:** Historical implementation record; current scripts and architecture docs are canonical.

This document preserves the useful implementation intent from the earliest Bookself scaffold plan using current product vocabulary. The detailed verbatim plan remains recoverable from Git history.

## Original implementation goal

Build a minimal, inspectable Git-native publishing scaffold that could be cloned, opened in a browser, edited as plain files, and deployed as static content without introducing a package manager, application server, or database.

## Durable scaffold decisions

1. Establish the root repository contract: product docs, agent rules, instance identity, publication folders, shared Reader, shared Publishing Desk, scripts, and documentation.
2. Keep a small set of blank publication starters under `books/` so a Desk can create new work without a generator dependency.
3. Make `imprint.json` the instance identity/configuration surface and distinguish `platform`, `desk`, and `shelf` roles explicitly.
4. Make the Reader consume repository Markdown and publication metadata directly.
5. Provide local Python/shell helpers for stamping instances, checking structure, syncing shared UI, and preparing Desk → Shelf releases.
6. Ensure a stamped Desk contains authoring tools and blank starters while a fresh Shelf contains no unreleased publication folders.
7. Keep release preparation reviewable and stop before public commit/push so the Shelf diff is visible.
8. Keep all core paths usable without hosted CI/CD.

## Current implementation map

```text
bookself/
├── AGENTS.md
├── bookself.json
├── imprint.json
├── books/
├── reader/
├── desk/
├── scripts/
│   ├── bootstrap-workspace.py
│   ├── doctor.py
│   ├── release-book.py
│   ├── stamp-instance.py
│   └── sync-ui.py
└── docs/
```

The maintained scaffold now supports multiple publication formats, rights metadata, Reader presentation recommendations, local validation, instance stamping, and verified Desk → Shelf snapshot releases.

## Current canonical references

- `scripts/README.md` — current local tooling map.
- `scripts/stamp-instance.py` — role-aware instance stamping.
- `scripts/bootstrap-workspace.py` — sibling Desk/Shelf workspace creation.
- `scripts/doctor.py` — structural health check.
- `scripts/release-book.py` — verified release preparation.
- `docs/bookself.md` — current architecture.
- `bookself.json` — machine-readable product contract.

This historical summary is intentionally descriptive, not normative. Current implementation and maintained documentation take precedence.
