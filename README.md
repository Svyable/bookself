# bookself

**Open-source software for a Git-native bookshelf.**

Bookself separates the platform from each author's actual books:

- **platform** — this repository or a fork; source of truth for shared UI and setup tooling
- **binder** — private repository where drafts and working manuscripts live
- **shelf** — public repository where published manuscripts live

Books stay plain Markdown. The shared browser UI is a Kindle-style
[Reader](reader/) plus an author/editor [Publishing Desk](desk/). No build step,
no WordPress, no proprietary manuscript database.

See **[Bookself](docs/bookself.md)** for the complete workflow and architecture.

## The important boundary

`reader/` and `desk/` are portable platform software. They are synced into both
binder and shelf instances.

Each instance owns its own:

- `books/`
- root `README.md`
- `imprint.json`

Shared UI must not contain an author's account name, repository name, private
binder URL, or public shelf URL. Those belong in `imprint.json` or the
instance's own README.

## Start a binder + shelf

```bash
scripts/stamp-instance.sh ../binder binder YOUR_GITHUB_OWNER binder
scripts/stamp-instance.sh ../shelf shelf YOUR_GITHUB_OWNER shelf
```

The binder should be private. The shelf should be public with GitHub Pages
served from the repository root.

After changing shared UI in Bookself, update both instances with:

```bash
scripts/sync-ui.sh
```

With the conventional sibling layout, that syncs `../binder` and `../shelf`.
You can also pass explicit instance paths. Only `reader/` and `desk/` are
replaced.

## Reference implementation

While Bookself is being built, the upstream repository also maintains a first
real deployment for validation:

| Role | Reference |
|---|---|
| Platform | this repository (`Svyable/bookself`) |
| Private binder | `Svyable/binder` |
| Public shelf | [Svyable/shelf](https://github.com/Svyable/shelf) |
| Public reader | [Svyable Shelf](https://svyable.github.io/shelf/reader/) |

Those are examples of the platform, not defaults baked into shared code.

## Why

Word processors hide history, lose drafts, and turn collaboration into a
mailing-list problem. Git gives every sentence a memory: who changed what,
when, and why — plus a way to try an edit without overwriting the original.

## How it works

- **One book, one folder.** Everything a book needs lives in `books/<slug>/`.
- **Plain Markdown only.** If you can type, you can write here.
- **GitHub is the durable history.** Reviewing and discussing happen with normal Git tools.
- **The Reader is the book.** Public shelves show books whose Status is `Published`.
- **The Desk is the workflow view.** In a private binder it reads the local manuscript inventory; in a public shelf it checks publication consistency.

## Demo book in this platform repo

| Book | Authors |
|------|---------|
| [The Example Book](books/the-example-book/) | @svyable |

The example exists only so the platform Reader and Desk have realistic data to
exercise. Real unpublished manuscripts belong in a private binder.

## How to take part

| If you are… | Start here |
|---|---|
| Setting up private + public Bookself repos | [Bookself architecture and workflow](docs/bookself.md) |
| Managing manuscripts | [Publishing Desk](desk/) |
| Trying the reader | [Reader demo](reader/) |
| New to GitHub | [Author guide](docs/author-guide.md) |
| Comfortable with pull requests | [Editor guide](docs/editor-guide.md) and [Contributing](CONTRIBUTING.md) |
| Starting a new book | [Book anatomy](docs/book-anatomy.md) |
| An AI agent | [AGENTS.md](AGENTS.md) |

## Local platform demo

From this folder:

```bash
python3 -m http.server
```

Then open:

- `http://127.0.0.1:8000/reader/`
- `http://127.0.0.1:8000/desk/`

`file://` will not work because the UI fetches Markdown and instance config.

## License

The framework (everything outside `books/`) is MIT. Book manuscripts remain
copyright of their authors. See [LICENSE](LICENSE).
