# Shelf

Your public **Shelf** in a [Bookself](docs/bookself.md) setup. The publications
here are deliberately released snapshots. Drafts and next editions stay on the
separate Desk.

A Shelf is not a copy of the authoring application. It contains a local Reader,
release state, public identity, and verification tooling. It does **not** contain
a `desk/` authoring tree and it does not execute the upstream Bookself Pages site
as a runtime dependency.

A fresh Shelf starts with no publication folders. Bookself platform examples and
blank authoring templates remain upstream or on Desk. The first deliberate
release creates `books/<slug>/` here.

## The books

| Book | Authors |
|------|---------|
| | |

For a normal release, run the verified release helper from the Desk checkout:

```bash
scripts/release-book.sh <slug> ../shelf
```

It prepares the public copy, sets its status to `Published`, updates Shelf
catalog state, byte-verifies the authored payload against the committed Desk
snapshot, writes `books/<slug>/release.json` with source commit and payload
integrity, refreshes configured public surfaces, and stops before commit or push.

## Local Reader

```bash
python3 -m http.server
```

Then open `http://127.0.0.1:8000/reader/`.

Authoring and next-edition work belongs on the separate Desk. If you want the
Shelf Reader to link to a hosted Desk, configure that real external URL in this
instance's `imprint.json`; do not create a local `/desk/` application route.

## Updating Bookself Reader software

From the upstream Bookself working tree, use an explicit safe Shelf sync:

```bash
scripts/sync-ui.sh --shelf-safe /path/to/your/shelf
```

The safe sync updates reusable Reader engine files locally while preserving the
Shelf-owned shell, service worker, adapter, identity, catalog, publications, and
release history. It must never copy Bookself's Publishing Desk application into
Shelf.

## License

Bookself framework software is MIT licensed. Publication content keeps the
rights declared by its author/rightsholder. See [LICENSE](LICENSE) and the
applicable publication rights files.
