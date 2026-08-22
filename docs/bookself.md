# Bookself

**A full workflow for authors and publishers: a private workshop and a
public library, both running [Open Book Binder](https://github.com/Svyable/openbookbinder).**

Open Book Binder is the software (Markdown books + a Kindle-style reader).
Bookself is how you *use* it when some work is secret and some work is
for the street.

Unlisted drafts on a **public** repo are not private. Anyone with the
files — or `reader/#/b/your-slug/` — can open them. Real privacy is a
**private GitHub repository**.

## The two shelves

| | Workshop | Library |
|---|---|---|
| **What it is** | Where you write | Where the public reads |
| **GitHub** | Private repo | Public repo |
| **Pages** | Off, or only for invited people | On — the reader URL |
| **Status** | `Drafting` until you promote | `Published` + a row in the root README |
| **Who sees the files** | You and people you invite | Anyone |

You can run only a workshop (closed studio), only a library (write in
public), or **both** — that is Bookself.

Svyable’s pair:

| Role | Repo | Reader |
|---|---|---|
| Software | [openbookbinder](https://github.com/Svyable/openbookbinder) | demo only |
| Workshop | [binder](https://github.com/Svyable/binder) (private) | none required |
| Library | [shelf](https://github.com/Svyable/shelf) | [svyable.github.io/shelf/reader](https://svyable.github.io/shelf/reader/) |

## Start

1. Fork or copy [Open Book Binder](https://github.com/Svyable/openbookbinder) **twice** (or once, if you only need one mode).
2. Name them however you like. The idea is *workshop* and *library*.
3. Make the workshop **private**. Invite co-authors there.
4. Keep the library **public**. Enable GitHub Pages from the repo root
   (not `/docs`) so `/reader/` works.
5. In each repo, set `imprint.json` (the name on the reader, the GitHub
   URL, a storage prefix so prefs do not collide).

The reader GUI stays identical. Pull upgrades from Open Book Binder with
`scripts/sync-reader.sh` into each shelf you maintain.

## Write (workshop)

Same as the [author guide](author-guide.md), on the private repo:

1. Copy `books/_TEMPLATE/` to `books/your-title/`.
2. Pencil, write, commit. One chapter at a time.
3. Optional: turn on Pages later, or preview locally
   (`python3 -m http.server` → `/reader/#/b/your-title/`).

Do **not** put unpublished manuscripts in the public library repo.

## Promote (workshop → library)

When a book is meant to be read:

1. Copy the book folder into the library:

   ```bash
   scripts/promote-book.sh your-title ../library
   # or: cp -R books/your-title ../library/books/your-title
   ```

2. In the library copy, set **Status** to exactly `Published`.
3. Add a row under **The books** in the library’s root `README.md`
   linking `books/your-title/`.
4. Commit and push the library. After Pages builds, the volume is on
   the public shelf.

Leave the workshop copy in place. That is still your working draft
history if you want it.

To take a book down, unpublish on the **library** (Status not
`Published`, remove the README row). Deleting the folder is optional.

## Revise

- **Quiet draft:** keep writing in the workshop. Promote again when the
  new text should replace the public folder.
- **Live edition:** edit the library copy and push. The reader fetches
  Markdown on the next refresh. No version stamp required.

Pick one per book so the two folders do not silently drift. The lead
author owns that choice.

## Publishers

A house can run one workshop (many authors, private) and one library
(the imprint’s public shelf). Optional **Publisher** and **Series** rows
on each book README group volumes on the reader. The software does not
need a second config file.

Invite editors to the workshop. The library can stay “open to read,
invite to write,” or accept public pull requests — your call.

## What not to expect

- The reader will not password-gate a public repo.
- GitHub Pages on a public repo publishes whatever is in that repo.
- `_TEMPLATE` is never a catalog entry.
- Do not edit `reader/` JavaScript to “add a book.” Add Markdown.

## Next

- Authors: [author-guide.md](author-guide.md)
- Editors: [editor-guide.md](editor-guide.md)
- Anatomy of a book folder: [book-anatomy.md](book-anatomy.md)
