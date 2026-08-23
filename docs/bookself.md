# Bookself

**Bookself gives you a binder and a shelf.**

This repository is the software: Markdown books and a Kindle-style reader.
An agent running the [Bookself skill](../skills/bookself/SKILL.md) stamps
that software onto two GitHub repositories:

| | Binder | Shelf |
|---|---|---|
| **What it is** | Where you write | Where the public reads |
| **GitHub** | Private repo, default name `binder` | Public repo, default name `shelf` |
| **Pages** | Off | On, from the repo root — the reader URL |
| **Status** | `Drafting` until you promote | `Published` + a row in the root README |
| **Who sees the files** | You and people you invite | Anyone |

Visibility is per repository. Unlisted drafts on a **public** repo are not
private. Anyone with the files — or `reader/#/b/your-slug/` — can open them.

Do not write your manuscripts in *this* repository. It is the product, plus
one example book so the software demo has something to show.

## A live Bookself

| Role | Where |
|---|---|
| Software | [Svyable/bookself](https://github.com/Svyable/bookself) |
| Software demo | [svyable.github.io/bookself/reader](https://svyable.github.io/bookself/reader/) |
| Binder (private) | `Svyable/binder` |
| Shelf (public) | [Svyable/shelf](https://github.com/Svyable/shelf) |
| Books demo | [svyable.github.io/shelf/reader](https://svyable.github.io/shelf/reader/) |

## Start

Give this repository to an agent and say **set up Bookself**. The skill
always creates both repos. If `binder` or `shelf` is taken on that
account, it asks for a name.

Without an agent:

1. Copy this tree twice (`scripts/stamp-instance.sh`).
2. Name them `binder` and `shelf`.
3. Make the binder **private**. Invite co-authors there.
4. Keep the shelf **public**. Enable GitHub Pages from the repo root
   (not `/docs`) so `/reader/` works.
5. In each repo, set `imprint.json` (the name on the reader, the GitHub
   URL, a storage prefix so prefs do not collide).

The reader GUI stays identical. Pull upgrades from this product repo with
`scripts/sync-reader.sh`.

## Write (binder)

Same as the [author guide](author-guide.md), on the private repo:

1. Copy `books/_TEMPLATE/` to `books/your-title/`.
2. Pencil, write, commit. One chapter at a time.
3. Preview locally (`python3 -m http.server` →
   `/reader/#/b/your-title/`). Do not turn on Pages for the binder.

Do **not** put unpublished manuscripts in the public shelf repo.

## Promote (binder → shelf)

When a book is meant to be read:

1. Say out loud that the destination is public, then copy the folder:

   ```bash
   scripts/promote-book.sh your-title ../shelf
   ```

2. In the shelf copy, set **Status** to exactly `Published`.
3. Add a row under **The books** in the shelf’s root `README.md`
   linking `books/your-title/`.
4. Commit and push the shelf. After Pages builds, the volume is on
   the public shelf.

Leave the binder copy in place. That is still your working draft
history if you want it.

To take a book down, unpublish on the **shelf** (Status not
`Published`, remove the README row). Deleting the folder is optional.

## Revise

- **Quiet draft:** keep writing in the binder. Promote again when the
  new text should replace the public folder.
- **Live edition:** edit the shelf copy and push. The reader fetches
  Markdown on the next refresh. No version stamp required.

Pick one per book so the two folders do not silently drift. The lead
author owns that choice.

## Publishers

A house can run one binder (many authors, private) and one shelf
(the imprint’s public catalog). Optional **Publisher** and **Series** rows
on each book README group volumes on the reader. The software does not
need a second config file.

Invite editors to the binder. The shelf can stay “open to read,
invite to write,” or accept public pull requests — your call.

## What not to expect

- The reader will not password-gate a public repo.
- GitHub Pages on a public repo publishes whatever is in that repo.
- `_TEMPLATE` is never a catalog entry.
- Do not edit `reader/` JavaScript to “add a book.” Add Markdown.
- This product repo is not a place to keep real manuscripts.

## Next

- Agents: [skills/bookself/SKILL.md](../skills/bookself/SKILL.md)
- Authors: [author-guide.md](author-guide.md)
- Editors: [editor-guide.md](editor-guide.md)
- Anatomy of a book folder: [book-anatomy.md](book-anatomy.md)
