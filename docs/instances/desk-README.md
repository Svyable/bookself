# Desk

Your **Desk** in a [Bookself](docs/bookself.md) setup. Write, research, and revise
here. When a publication is meant to become public release state, release a
committed snapshot to the separate **Shelf**.

A Desk contains the local Reader and Publishing Desk authoring application.
A Shelf does not mirror that authoring tree. Reusable Bookself framework code
may be copied into each instance through role-aware local sync, while
manuscripts, identity, catalog state, and release history remain instance-owned.

A fresh Desk contains only the blank publication starters under `books/`.
Bookself's platform examples are not copied into your writing repository.

Repository visibility is an authoring policy. Do not put secrets or material
that must remain confidential in a Desk that is publicly exposed. For local
Reader/Desk access:

```bash
python3 -m http.server
```

Then open `http://127.0.0.1:8000/desk/` or `/reader/`.

## The books

| Book | Authors | Status |
|---|---|---|
| | | |

Keep working manuscripts listed here so the local Publishing Desk can discover
them without needing Shelf as a data source.

## Release to Shelf

Commit the intended Desk publication, then prepare the release locally:

```bash
scripts/release-book.sh <slug> ../shelf
```

The release transaction copies and verifies the publication snapshot, records
the exact Desk source commit in Shelf release provenance, and stops before
commit or push. Desk remains the source of the next edition after release.

## Framework updates

Use the Desk's documented local Bookself sync command, or from upstream target
the Desk explicitly. Do not use Shelf as a runtime or framework source for Desk.

Shelf framework updates use a different, `--shelf-safe` contract because Shelf
does not contain the Publishing Desk application.

## How to take part

| If you are… | Start here |
|---|---|
| New to GitHub | [Author guide](docs/author-guide.md) |
| Running Desk + Shelf | [Bookself](docs/bookself.md) |
| Comfortable with pull requests | [Editor guide](docs/editor-guide.md) |
| Starting a new book | [Book anatomy](docs/book-anatomy.md) |
| An AI agent | [AGENTS.md](AGENTS.md) |

## License

Bookself framework software is MIT licensed. Publication content keeps the
rights declared by its author/rightsholder. See [LICENSE](LICENSE) and the
applicable publication rights files.
