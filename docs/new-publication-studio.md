# New Publication Studio

Bookself's Publishing Desk includes a **New Publication Studio** for authors who want to begin without copying template folders by hand or opening a terminal.

The studio asks only for the choices that matter at the beginning:

- publication format
- working title
- author name or handle
- first piece/chapter/script title
- Reader starting style

From those answers it generates an ordinary Bookself publication folder. There is no private project database and no second authoring format.

## What it creates

A new starter contains:

```text
my-publication/
  README.md
  RIGHTS.md
  rights.json
  reader.json
  manuscript/
    chapter-01.md
```

The exact manuscript filename and starter structure vary by format. A paper begins with an abstract/question/evidence/conclusion shape; a report begins with an executive summary/findings/evidence/recommendations; a manual begins with an outcome, prerequisites, steps, and a result check; a screenplay uses `manuscript/script.md` with Bookself's Fountain-compatible screenplay core.

The generated files remain plain text. You can immediately edit them in GitHub, a local editor, another Markdown/plain-text tool, or an AI-assisted coding/writing environment.

## Eleven starting formats

The studio supports the same broad publication families as Bookself's blank starters:

- Book
- Screenplay / teleplay
- Paper / whitepaper
- Magazine / zine
- Newspaper
- Journal / proceedings
- Newsletter
- Anthology / collection
- Report
- Manual / handbook
- Comic / graphic narrative

The starter is intentionally small. It does not try to predict a finished work's full structure before the author has written it.

### Screenplay behavior

Choosing **Screenplay / teleplay** creates `Format: Screenplay`, `manuscript/script.md`, and recommends the `screenplay` Reader preset unless the author deliberately chooses another style.

The script starter demonstrates scene headings, action, character cues, dialogue, a parenthetical, a transition, and centered text. The Reader then supplies screenplay typesetting and actor rehearsal tools without changing the source. See [Screenwriting with Bookself](screenwriting.md).

## Reader design at creation time

The studio can start the publication with any named Bookself Reader presentation preset:

- `book`
- `literary`
- `modern-essay`
- `editorial`
- `poetry`
- `night-story`
- `accessible`
- `quiet-study`
- `screenplay`

That choice becomes a normal `reader.json` recommendation. Readers can still override it locally; the publication does not lock their typeface, size, spacing, colors, or reading mode.

When an author changes the format selector to Screenplay / teleplay, the Studio selects the screenplay preset automatically unless the author already made an explicit Reader-style choice.

## Saving the starter

### Save starter folder

On browsers that expose the File System Access API, **Save starter folder** asks you to choose the repository's `books/` directory and writes the generated publication folder there.

Bookself does not receive or upload those files. The browser writes them locally only after you choose a directory.

### ZIP fallback

When direct folder writing is unavailable, the studio produces the same starter as a dependency-free ZIP file. Put the generated folder under `books/` on the Desk.

The ZIP writer is implemented in Bookself itself with no package dependency, build step, or network service.

## Making the publication discoverable

The studio also generates an inventory line such as:

```md
- [My Publication](books/my-publication/) — Book
```

Paste that link somewhere under the Desk root README's `## The books` section. The Publishing Desk and Reader discover publication folders from those normal Markdown links; there is no hidden catalog database.

For a screenplay the same line simply uses `— Screenplay`.

## What the studio does not do

The studio does **not** automatically commit, push, release, or make a manuscript public. It creates files only.

That is deliberate: Bookself keeps the boundary between creating a draft and deliberately entering it into Git history visible to the author.

On a private Desk, keep the new publication in `Drafting` while writing. Release a committed snapshot to the public Shelf only when it is meant to be read publicly.
