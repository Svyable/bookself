# shelf

Your **public shelf** in a [Bookself](https://github.com/Svyable/bookself)
setup. The manuscripts here are meant to be read. Drafts stay in the
private binder.

The reader is the Bookself software. Start your own with that repository —
not this one.

**Workflow:** [Bookself](https://github.com/Svyable/bookself/blob/main/docs/bookself.md)

Reader upgrades are made in Bookself, then copied here with
`scripts/sync-reader.sh`. This repo's `imprint.json` is the only branding
file.

## The books

| Book | Authors |
|------|---------|
| | |

To publish a book: copy it from the binder, set Status to `Published` in
that book's README, and add a row here.

## Local reader

```bash
python3 -m http.server
```

Then open [http://127.0.0.1:8000/reader/](http://127.0.0.1:8000/reader/).

## License

The framework (everything outside `books/`) is MIT. Book manuscripts remain
copyright of their authors. See [LICENSE](LICENSE).
