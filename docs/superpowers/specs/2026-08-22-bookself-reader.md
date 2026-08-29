# Bookself Reader — historical design summary

**Date:** 2026-08-22  
**Status:** Historical design record; current Reader code and docs are canonical.

This document preserves the durable intent of the earliest Reader specification using current Bookself vocabulary. The verbatim original remains available in Git history.

## Reader purpose

The Reader makes Markdown publications feel deliberately published while preserving the repository as the source of truth. It runs as static browser software and can present either a private Desk proof or a released Shelf publication.

## Durable Reader decisions

- Load publication metadata and chapter Markdown directly from the repository.
- Keep navigation URL-addressable so books and chapters can be linked without a server application.
- Separate repository-owned presentation recommendations from reader-owned browser preferences.
- Store progress, bookmarks, notes, and personalization locally in the reader's browser unless a future feature explicitly introduces another storage contract.
- Keep instance identity in `imprint.json` rather than hard-coding an author, organization, repository, or deployment URL into shared Reader code.
- Support both library/Shelf browsing and focused publication reading from the same static application.
- Treat accessibility, responsive layout, readable typography, and keyboard navigation as product requirements rather than optional polish.
- Keep the Reader usable without npm, a framework build, a database, or hosted application runtime.

## Current route and data model

Current Reader routes use `#/b/<slug>/...` for publication views while the library view represents the instance home. Publication content lives under `books/<slug>/`; instance identity comes from `imprint.json`; optional author recommendations live in each publication's `reader.json`.

Browser-local storage uses the configured `imprint.json` `storagePrefix`, with `bookself` as the shared software fallback.

## Current canonical references

- `reader/` — maintained Reader implementation.
- `docs/reader-presentation.md` — author recommendation and reader personalization contract.
- `docs/bookself.md` — Desk/Shelf/Reader architecture.
- `imprint.json` — instance identity and storage namespace.
- `reader/js/router.js` — current route model.
- `reader/js/storage.js` — current local reading-state storage.

This historical summary is intentionally descriptive, not normative. Current code and maintained documentation take precedence.
