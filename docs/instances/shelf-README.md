# shelf

Your **public shelf** in a [Bookself](docs/bookself.md) setup. The manuscripts
here are meant to be read. Drafts stay in the private binder.

The same Bookself `reader/` and `desk/` live in both binder and shelf. They
are shared software; your manuscripts and `imprint.json` are instance-owned.

A fresh Shelf starts with no publication folders. Bookself's platform examples
and blank authoring templates stay upstream or in the private Binder. The first
deliberate release creates `books/<slug>/` here.

## The books

| Book | Authors |
|------|---------|
| | |

For a normal release, run the verified release helper from the Binder checkout:

```bash
scripts/release-book.sh <slug> ../shelf
```

It prepares the public copy, sets its status to `Published`, updates this
catalog, verifies the copied files, and stops before commit or push.

## Publishing desk

Open `desk/` to see publication readiness, chapter completion, and repository
consistency. The desk reads this shelf directly when hosted here.

## Local reader and desk

```bash
python3 -m http.server
```

Then open `http://127.0.0.1:8000/reader/` or `/desk/`.

## Updating Bookself UI

From the upstream Bookself working tree, run:

```bash
scripts/sync-ui.sh /path/to/your/binder /path/to/your/shelf
```

Only `reader/` and `desk/` are replaced. This shelf's books, README, and
`imprint.json` remain untouched.

## License

The framework (everything outside `books/`) is MIT. Book manuscripts remain
copyright of their authors. See [LICENSE](LICENSE).
