# Bookself — historical design summary

**Date:** 2026-08-22  
**Status:** Historical design record; current architecture docs are canonical.

This document preserves the durable design decisions from the earliest Bookself specification using the product's current vocabulary. The detailed original proposal remains recoverable from Git history.

## Core idea

Bookself is a Git-native publishing system for long-form work. Manuscripts remain ordinary Markdown files, Git provides revision history and review, and static browser software turns repository content into a reading and publishing experience without requiring a build pipeline.

The current product model is:

- **Bookself** — the whole ecosystem and reusable upstream software.
- **Desk** — the private authoring repository for drafts, experiments, review, and the next edition.
- **Shelf** — the public repository for deliberately released snapshots.
- **Reader** — the shared reading interface for Desk proofs and Shelf releases.
- **Publishing Desk** — the shared author/editor readiness interface.

## Durable architecture decisions

1. **Plain files are the source of truth.** Publications live under `books/<slug>/` and remain portable outside Bookself.
2. **No required build step.** Reader and Publishing Desk are static browser software; normal authoring and release must work with Git, Markdown, a browser, and Python's standard library.
3. **Private work and public releases are separate repository states.** Release copies a committed publication snapshot from Desk to Shelf rather than creating a live link.
4. **Shared software is instance-neutral.** `reader/` and `desk/` are reusable Bookself UI. `books/`, root `README.md`, and `imprint.json` belong to each instance.
5. **Repository history is part of the product.** Git commits, diffs, review, and rollback are first-class publishing mechanics rather than hidden implementation details.
6. **Reading should feel like publishing, not source browsing.** The Reader supplies navigation, typography, progress, notes, and book-like presentation while keeping Markdown authoritative.
7. **Authoring remains human-inspectable.** An agent may operate the workflow, but the durable protocol is ordinary files, Git, and explicit repository roles.

## Repository shape

The design converged on a small portable structure:

```text
bookself/
├── README.md
├── AGENTS.md
├── bookself.json
├── imprint.json
├── books/
├── reader/
├── desk/
├── scripts/
└── docs/
```

Publication folders carry their own metadata, manuscript files, media, rights metadata, and optional Reader presentation data. Shared UI reads those artifacts directly.

## Current canonical references

For the maintained contracts, use:

- `AGENTS.md` — repository invariants and editing rules.
- `bookself.json` — machine-readable roles, capabilities, commands, and completion states.
- `docs/bookself.md` — current architecture and Desk → Shelf release model.
- `docs/agent-first.md` — end-to-end agent operation.
- `docs/author-guide.md` — human author workflow.
- `docs/reader-presentation.md` — Reader presentation contract.

This historical summary is intentionally descriptive, not normative. Where it differs from current documentation or code, current documentation and code win.
