# openbookbinder

**Write and edit books with colleagues — natively on GitHub.**

openbookbinder treats GitHub as the home for books. Every book is a folder of
plain Markdown that anyone can read, edit, and discuss in the browser. No
special software. No build step. No lock-in.

The public face is a [reader](reader/) — a Git-native bookshelf, not a
wiki CMS. Search the library, open a volume, read a spread, export
Markdown or HTML. Authors still write on GitHub (or with a GitHub-authed
agent). No WordPress, no database, no lock-in.

A live imprint: [Svyable Shelf](https://svyable.github.io/shelf/), the
author's own shelf running this reader. Reader upgrades land here first,
then copy to the shelf with `scripts/sync-reader.sh`.

## Why

Word processors hide history, lose drafts, and turn collaboration into a
mailing-list problem. Git gives every sentence a memory: who changed what,
when, and why — plus a way to try an edit without overwriting the original.

## How it works

- **One book, one folder.** Everything a book needs lives in `books/<slug>/`.
- **Plain Markdown only.** If you can type, you can write here.
- **GitHub is the writing desk.** Reviewing and discussing happen with the
  tools on this site.
- **The reader is the published book.** Open [the binder](reader/). Only books
  whose Status is `Published` appear on the shelf.

## The books

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
| Here to read | [The public binder](reader/) |
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
