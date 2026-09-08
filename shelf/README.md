# Bookself demo Shelf

This directory is the **embedded example Shelf for Bookself itself**.

It exists so the upstream open-source repository can demonstrate the public Shelf experience without sending visitors to any author's personal Shelf.

- **Reader:** [`shelf/reader/`](reader/)
- **Publication fixtures:** the neutral, deliberately published specimens under root [`books/`](../books/)
- **Catalog:** root [`catalog.json`](../catalog.json)
- **Shared Reader implementation:** root [`reader/`](../reader/)

The embedded demo deliberately reuses Bookself's shared Reader and platform fixture corpus instead of copying those files into a second tree. This keeps the upstream repository self-contained and keeps the demo materials as a single source of truth.

A real Bookself Shelf created for an author is different: it is a separate repository with its own `books/`, catalog, identity, and release history. It receives deliberate snapshots from that author's Desk and does not depend on the Desk at runtime.

No author-specific Shelf URL belongs in this embedded demo surface.
