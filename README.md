# openbookbinder

**Open-source software for a Git-native bookshelf.**

Fork this repository, add books as plain Markdown, and GitHub Pages serves a
Kindle-style reader. No build step. No WordPress. No lock-in.

Writing happens on GitHub. Reading happens in the [reader](reader/).

## A live shelf

This repo is the software. A real imprint running it:

| | |
|---|---|
| **Read** | [svyable.github.io/shelf/reader](https://svyable.github.io/shelf/reader/) |
| **Books** | [github.com/Svyable/shelf](https://github.com/Svyable/shelf) |

Start your own the same way: fork Open Book Binder, copy `books/_TEMPLATE/`,
set Status to `Published`, add a row under **The books**.

Reader upgrades land here first, then copy to a shelf with
`scripts/sync-reader.sh`.

## Why

Word processors hide history, lose drafts, and turn collaboration into a
mailing-list problem. Git gives every sentence a memory: who changed what,
when, and why — plus a way to try an edit without overwriting the original.

## How it works

- **One book, one folder.** Everything a book needs lives in `books/<slug>/`.
- **Plain Markdown only.** If you can type, you can write here.
- **GitHub is the writing desk.** Reviewing and discussing happen with the
  tools on this site.
- **The reader is the published book.** Open [the demo binder](reader/). Only
  books whose Status is `Published` appear on the shelf.

## Demo books in this repo

| Book | Authors |
|------|---------|
| [The Example Book](books/the-example-book/) | @svyable |

To start one, copy [`books/_TEMPLATE/`](books/_TEMPLATE/) to `books/<your-slug>/`
and fill in that book's README. Keep Status as `Drafting` until you mean to
publish. Publishing is two edits: set Status to `Published`, and add a row
here. Details are in the [author guide](docs/author-guide.md).

## How to take part

| If you are… | Start here |
|---|---|
| Here to read a real shelf | [Svyable Shelf](https://svyable.github.io/shelf/reader/) |
| Here to try the software | [The demo binder](reader/) |
| New to GitHub | [Author guide](docs/author-guide.md) — write in the browser |
| Comfortable with pull requests | [Editor guide](docs/editor-guide.md) and [Contributing](CONTRIBUTING.md) |
| Starting a new book | [Book anatomy](docs/book-anatomy.md) |
| An AI agent | [AGENTS.md](AGENTS.md) |

## Local reader

From this folder:

```bash
python3 -m http.server
```

Then open [http://127.0.0.1:8000/reader/](http://127.0.0.1:8000/reader/). GitHub
Pages should serve the same thing from the repository root (not `/docs`).
`file://` will not work — the reader fetches Markdown.

## License

The framework (everything outside `books/`) is MIT. Book manuscripts remain
copyright of their authors. See [LICENSE](LICENSE).
