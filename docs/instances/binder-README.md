# binder

Your **private binder** in a [Bookself](docs/bookself.md) setup. Write here.
When a book is meant to be read publicly, promote it to your public **shelf**.

The same Bookself `reader/` and `desk/` live in both binder and shelf. They
are shared software; your manuscripts and `imprint.json` are instance-owned.

Do not enable public GitHub Pages on a binder that contains unpublished work.
For local reader/desk access:

```bash
python3 -m http.server
```

Then open `http://127.0.0.1:8000/desk/` or `/reader/`.

## The books

| Book | Authors | Status |
|---|---|---|
| | | |

Keep every private manuscript listed here so the local Publishing Desk can
load it without needing GitHub credentials.

## How to take part

| If you are… | Start here |
|---|---|
| New to GitHub | [Author guide](docs/author-guide.md) |
| Running binder + shelf | [Bookself](docs/bookself.md) |
| Comfortable with pull requests | [Editor guide](docs/editor-guide.md) |
| Starting a new book | [Book anatomy](docs/book-anatomy.md) |
| An AI agent | [AGENTS.md](AGENTS.md) |

## License

The framework (everything outside `books/`) is MIT. Book manuscripts remain
copyright of their authors. See [LICENSE](LICENSE).
