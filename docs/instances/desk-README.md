# Desk

Your private **Desk** in a [Bookself](docs/bookself.md) setup. Write and revise here.
When a book is meant to be read publicly, release a committed snapshot to your
public **Shelf**.

The same Bookself `reader/` and `desk/` software lives in both Desk and Shelf.
Those directories are shared product software; your manuscripts and
`imprint.json` are instance-owned.

A fresh Desk contains only the blank publication starters under `books/`.
Bookself's platform examples are not copied into your private writing repository.

Do not enable public GitHub Pages on a Desk that contains unpublished work.
For local Reader/Desk access:

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
| Running Desk + Shelf | [Bookself](docs/bookself.md) |
| Comfortable with pull requests | [Editor guide](docs/editor-guide.md) |
| Starting a new book | [Book anatomy](docs/book-anatomy.md) |
| An AI agent | [AGENTS.md](AGENTS.md) |

## License

The framework (everything outside `books/`) is MIT. Book manuscripts remain
copyright of their authors. See [LICENSE](LICENSE).
