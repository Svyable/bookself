# openbookbinder Scaffold Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the openbookbinder repository as a complete, author-friendly multi-book framework on GitHub — every file polished, no placeholders — then publish it as the public repo `Svyable/openbookbinder`.

**Architecture:** One public GitHub monorepo. Each book is a folder of plain Markdown under `books/<slug>/`. Collaboration uses GitHub's own tools (web editor, pull requests, issues, line comments). No build step, no YAML machinery authors must learn, no CODEOWNERS, no Pages, no rendering pipeline. The design spec is already committed at `docs/superpowers/specs/2026-08-22-openbookbinder-design.md`. Git is already initialized on `main` with that spec. This plan adds the product files and publishes the remote.

**Tech Stack:** Git, GitHub (`gh`), plain Markdown, GitHub Issue Forms (YAML). Ruby's stdlib YAML parser for local form validation. No application runtime.

**Worktree note:** This is a greenfield repo whose design explicitly lands the scaffold on `main` and pushes it. Do not create a feature branch or worktree. Work in `/Users/svenbenson/GitHub/openbookbinder` on `main`.

**Testing note:** There is no executable code, so TDD does not apply. Every write is followed by a file-exists + content grep. YAML forms are parsed with Ruby. After push, verify the live GitHub tree, README render, manuscript sort, and issue templates.

---

## File Structure

| Path | Responsibility |
|---|---|
| `.gitignore` | Ignore macOS and editor droppings |
| `LICENSE` | Dual notice: MIT outside `books/`; all-rights-reserved inside `books/` |
| `README.md` | Portal: what this place is, catalog, links into the guides |
| `CONTRIBUTING.md` | Human contribution rules (PR vs issue, one chapter, lead-author-to-main) |
| `AGENTS.md` | Rules for AI agents working in this repo |
| `docs/author-guide.md` | Never-used-GitHub walkthrough via the web editor |
| `docs/editor-guide.md` | Branch → edit → PR; book-list upkeep; review/merge etiquette |
| `docs/book-anatomy.md` | Folder layout, naming, media, hub format, one-sentence rule |
| `books/_TEMPLATE/README.md` | Copy-me book hub (info table + checkbox TOC) |
| `books/_TEMPLATE/manuscript/front-matter.md` | Title page, copyright line, dedication |
| `books/_TEMPLATE/manuscript/ch01-example.md` | Example chapter prose (heading + paragraphs only) |
| `books/_TEMPLATE/manuscript/ch02-example.md` | Second example chapter |
| `books/_TEMPLATE/manuscript/back-matter.md` | Epilogue / acknowledgments / about-the-author stubs |
| `books/_TEMPLATE/media/.gitkeep` | Keep the empty media folder in git |
| `.github/PULL_REQUEST_TEMPLATE.md` | One-chapter PR checklist |
| `.github/ISSUE_TEMPLATE/chapter-feedback.yml` | Issue form: book dropdown, free-text location, kind, details |
| `.github/ISSUE_TEMPLATE/new-book-proposal.md` | Pitch a book before scaffolding it |

Do not add PDF/ePub tooling, GitHub Pages, branch protection, CODEOWNERS, per-book license files, YAML front matter on books, or a cover image in `media/` (an image reference would render broken; document images in `book-anatomy.md` instead).

Chapters stay pure prose. Do not embed images in the example chapters.

---

## Chunk 1: Local scaffold — framework files

### Task 1: Repo hygiene — `.gitignore` and `LICENSE`

**Files:**
- Create: `.gitignore`
- Create: `LICENSE`

- [ ] **Step 0: Create directories**

Run:

```bash
mkdir -p docs books/_TEMPLATE/manuscript books/_TEMPLATE/media .github/ISSUE_TEMPLATE
```

Expected: command exits 0. Later writes can then create files without missing-parent failures.

- [ ] **Step 1: Write `.gitignore`**

Write `.gitignore` with exactly this content (trailing newline, no extra lines):

```
.DS_Store
*.swp
*~
```

- [ ] **Step 2: Verify `.gitignore`**

Run:

```bash
test -f .gitignore
grep -n '^\.DS_Store$' .gitignore
grep -n '^\*\.swp$' .gitignore
grep -n '^\*~$' .gitignore
wc -l .gitignore
```

Expected: file exists; three matching lines; `3` (or `3` plus a blank line if the file ends with a newline-only last line — `wc -l` may print `3`). Fail if any other pattern is present.

- [ ] **Step 3: Write `LICENSE`**

Write `LICENSE` with exactly this content:

```
# License

This repository uses two notices.

## Framework (everything outside `books/`)

The scaffolding, documentation, GitHub configuration, and everything else
outside the `books/` directory are licensed under the MIT License:

MIT License

Copyright (c) 2026 Svyable

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Books (everything inside `books/`)

All rights reserved.

Manuscripts, media, and other files under `books/` remain copyright of their
respective authors, as named in each book's `manuscript/front-matter.md`. They
are not licensed under the MIT License. Do not copy, publish, or reuse book
contents without the author's permission.

The `books/_TEMPLATE/` folder is example material for starting a new book.
Replace its copyright line with your own when you copy it.
```

- [ ] **Step 4: Verify `LICENSE`**

Run:

```bash
test -f LICENSE
grep -n 'Copyright (c) 2026 Svyable' LICENSE
grep -n 'All rights reserved.' LICENSE
grep -n 'everything outside `books/`' LICENSE
grep -n 'everything inside `books/`' LICENSE
grep -n 'THE SOFTWARE IS PROVIDED "AS IS"' LICENSE
```

Expected: file exists; each pattern matches once (or more for "All rights reserved." which appears in the books section). MIT body and both dual-notice headings present.

---

### Task 2: Portal `README.md`

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write `README.md`**

Write `README.md` with exactly this content:

````markdown
# openbookbinder

**Write and edit books with colleagues — natively on GitHub.**

openbookbinder treats GitHub as the home for books. Every book is a folder of
plain Markdown that anyone can read, edit, and discuss in the browser. No
special software. No build step. No lock-in.

## Why

Word processors hide history, lose drafts, and turn collaboration into a
mailing-list problem. Git gives every sentence a memory: who changed what,
when, and why — plus a way to try an edit without overwriting the original.

## How it works

- **One book, one folder.** Everything a book needs lives in `books/<slug>/`.
- **Plain Markdown only.** If you can type, you can write here.
- **GitHub is the app.** Writing, editing, reviewing, and discussing all happen
  with the tools on this site.

## The books

No books yet. To start one, copy [`books/_TEMPLATE/`](books/_TEMPLATE/) to
`books/<your-slug>/` and fill in that book's README.

## How to take part

| If you are… | Start here |
|---|---|
| New to GitHub | [Author guide](docs/author-guide.md) — write in the browser |
| Comfortable with pull requests | [Editor guide](docs/editor-guide.md) and [Contributing](CONTRIBUTING.md) |
| Starting a new book | [Book anatomy](docs/book-anatomy.md) |
| An AI agent | [AGENTS.md](AGENTS.md) |

## License

The framework (everything outside `books/`) is MIT. Book manuscripts remain
copyright of their authors. See [LICENSE](LICENSE).
````

- [ ] **Step 2: Verify `README.md`**

Run:

```bash
test -f README.md
grep -n '^# openbookbinder$' README.md
grep -n 'No books yet' README.md
grep -n 'docs/author-guide.md' README.md
grep -n 'AGENTS.md' README.md
grep -nE 'TODO|TBD|FIXME|placeholder' README.md && echo 'FAIL: placeholder found' || echo 'OK: no placeholders'
```

Expected: heading, catalog empty-state, guide links present; last command prints `OK: no placeholders`.

---

### Task 3: `CONTRIBUTING.md` and `AGENTS.md`

**Files:**
- Create: `CONTRIBUTING.md`
- Create: `AGENTS.md`

- [ ] **Step 1: Write `CONTRIBUTING.md`**

Write `CONTRIBUTING.md` with exactly this content:

````markdown
# Contributing

Thank you for helping. There are two ways in. Pick the one that matches how
you like to work.

## Two ways to contribute

### 1. Propose an edit (pull request)

Change the Markdown, then open a pull request. This is the path for editors
and co-authors. See [the editor guide](docs/editor-guide.md) for the
branch → edit → PR walkthrough.

If you have never used GitHub, you can still propose an edit from the
browser. See [the author guide](docs/author-guide.md).

### 2. File an issue

If you spotted something and do not want to touch the text yourself, open an
issue. Use **Chapter feedback** for a specific passage, or **New book
proposal** to pitch a book before anyone scaffolds it.

## One chapter per pull request

A pull request should touch one chapter file (or front/back matter), plus the
book README only when the table of contents or status needs to match.

Do not bundle unrelated chapters, repo-wide reformats, or tooling changes
into a chapter PR.

## Direct-to-main for lead authors

The people named as authors on a book's README may commit directly to `main`
for that book — small fixes should not need ceremony. Everyone else uses a
pull request.

If you are a lead author editing someone else's book, still open a PR.

## Review expectations

- Reviews happen as line comments on the manuscript, not as a separate essay.
- Preserve the author's voice. Fix what was asked; do not rewrite the page.
- The lead author of that book merges.
- Check that the book README's contents list and status still match reality
  before merging.

## Keeping the issue dropdown current

`.github/ISSUE_TEMPLATE/chapter-feedback.yml` has a **Book** dropdown. When
you add a book, add its slug as a new option on that list in the same PR that
introduces `books/<slug>/`. Details are in [the editor guide](docs/editor-guide.md).
````

- [ ] **Step 2: Verify `CONTRIBUTING.md`**

Run:

```bash
test -f CONTRIBUTING.md
grep -n 'Two ways to contribute' CONTRIBUTING.md
grep -n 'One chapter per pull request' CONTRIBUTING.md
grep -n 'Direct-to-main for lead authors' CONTRIBUTING.md
grep -n 'chapter-feedback.yml' CONTRIBUTING.md
```

Expected: all five markers present.

- [ ] **Step 3: Write `AGENTS.md`**

Write `AGENTS.md` with exactly this content:

````markdown
# AGENTS.md

Rules for AI agents working in this repository.

## Scope

- Do only what was asked. Do not rewrite neighboring chapters, "clean up"
  prose, or reformat files you were not told to touch.
- One chapter per pull request. If a task spans books or chapters, stop and
  split the work.
- When you add, rename, or remove a chapter, update that book's README
  table of contents and the Chapters count in the same change.
- When you add a book, add its slug to the Book dropdown in
  `.github/ISSUE_TEMPLATE/chapter-feedback.yml` in the same change.

## Voice

- Preserve the author's voice, tense, and rhythm. Match the surrounding
  sentences, not a house style you brought with you.
- Do not substitute synonyms "for clarity" unless the author asked for that.
- Do not add headings, lists, or emphasis the surrounding chapter does not
  already use.

## Markdown

- Chapters are a single `# Title` heading, then paragraphs. No YAML front
  matter. No HTML comments in chapter files.
- Book READMEs are an info table plus a checkbox table of contents. No YAML
  front matter.
- Follow existing naming: `books/<slug>/`, `chNN-slug.md`, `front-matter.md`,
  `back-matter.md`.
- Images live in that book's `media/` folder and are referenced with
  relative links (`![alt](../media/figure-1.png)`).

## Do not

- Do not touch `LICENSE` or change licensing without the repository owner's
  explicit approval.
- Do not reformat a file wholesale (line wrapping, heading levels, quote
  style) as a drive-by.
- Do not add a build step, GitHub Pages, CODEOWNERS, or branch protection
  unless a human asked for that by name.
- Do not commit secrets, credentials, or unpublished manuscripts copied from
  outside this repository.
````

- [ ] **Step 4: Verify `AGENTS.md`**

Run:

```bash
test -f AGENTS.md
grep -n 'One chapter per pull request' AGENTS.md
grep -n 'Preserve the author' AGENTS.md
grep -n 'Do not touch `LICENSE`' AGENTS.md
grep -n 'chapter-feedback.yml' AGENTS.md
```

Expected: all four patterns present.

---

### Task 4: Author guide

**Files:**
- Create: `docs/author-guide.md`

- [ ] **Step 1: Write `docs/author-guide.md`**

Write `docs/author-guide.md` with exactly this content:

````markdown
# Author guide

You do not need to know git. This place is a binder: each book is a folder,
each chapter is a page, and GitHub keeps every version.

This walkthrough uses the GitHub website on a computer.

## 1. What this place is

The repository is a stack of books. Open [`books/`](../books/). The folder
named `_TEMPLATE` is a blank book you can copy, not a real title. Every other
folder is a book.

Inside a book:

- `README.md` — the cover and table of contents
- `manuscript/` — the pages
- `media/` — pictures, when a book has them

## 2. Reading a book

1. Open the book folder.
2. Open `README.md`. The **Contents** list is the reading order. Click a
   chapter name.
3. Read the page. GitHub turns Markdown into readable text automatically.

The file list inside `manuscript/` is alphabetical, so `back-matter.md` will
not sit at the end. Trust the README, not the file list.

## 3. Making your first edit

1. Open the chapter you want to change.
2. Click the pencil icon in the top-right of the file view. GitHub labels
   it **Edit this file**.
3. The page becomes a text editor. Change the words. Leave the single `#`
   title at the top unless you are renaming the chapter.
4. Do not paste in Word formatting, extra headings, or comments.

If GitHub asks you to fork the repository, say yes — that is how GitHub lets
people without write access propose an edit.

## 4. Committing (saving a version)

Scroll to the bottom of the edit page, to **Commit changes**.

1. In the first box, write a short note in plain language:
   `Fix the river image caption in chapter 2`.
2. Choose how to save:
   - **Commit directly to the `main` branch** — use this only if you are a
     named author of this book (see the book's README).
   - **Create a new branch for this commit and start a pull request** — use
     this otherwise. It is the "propose changes" path.
3. Click **Commit changes** (or **Propose changes**).

A commit is a saved version with a note. It is not publishing to a printer.
It is putting a dated page in the binder.

## 5. Ticking checkboxes in the table of contents

The book's README has a contents list like this:

    - [ ] [Ch 1 — Opening the Binder](manuscript/ch01-example.md)

The boxes do not toggle by clicking them on the page. To mark a chapter
done:

1. Open the book `README.md`.
2. Click the pencil.
3. Change `[ ]` to `[x]` on that line.
4. Update the **Chapters** count in the info table if it has drifted.
5. Commit as in step 4.

## 6. Suggesting a change on someone else's line

Two similar tools, for two situations.

**You are reading a file and want to propose a better sentence.** Use the
pencil as in step 3, change only that passage, and open a pull request
(step 4, "propose changes"). In the PR description, say which lines you
touched and why.

**You are reviewing a pull request.** On the **Files changed** tab, hover a
line, click the blue **+**, and choose to add a comment. GitHub can insert a
suggested replacement the author accepts with one click. Prefer that over a
vague "please rephrase."

## 7. Filing feedback without editing

If you would rather not touch the text:

1. Open the **Issues** tab.
2. Click **New issue**.
3. Choose **Chapter feedback**.
4. Pick the book, say where in the book, pick the kind of feedback, and
   write what you would change.

Use **New book proposal** only when you are pitching a title that does not
exist yet.
````

- [ ] **Step 2: Verify `docs/author-guide.md`**

Run:

```bash
test -f docs/author-guide.md
grep -n '^## 1. What this place is$' docs/author-guide.md
grep -n '^## 2. Reading a book$' docs/author-guide.md
grep -n '^## 3. Making your first edit$' docs/author-guide.md
grep -n '^## 4. Committing' docs/author-guide.md
grep -n '^## 5. Ticking checkboxes' docs/author-guide.md
grep -n '^## 6. Suggesting a change' docs/author-guide.md
grep -n '^## 7. Filing feedback' docs/author-guide.md
grep -n 'Edit this file' docs/author-guide.md
grep -n 'Chapter feedback' docs/author-guide.md
```

Expected: seven numbered sections present (1–7); pencil-edit and issue-form names present.

---

### Task 5: Editor guide

**Files:**
- Create: `docs/editor-guide.md`

- [ ] **Step 1: Write `docs/editor-guide.md`**

Write `docs/editor-guide.md` with exactly this content:

````markdown
# Editor guide

This is the path if you are comfortable with branches and pull requests.
Lead authors of a book may still commit directly to `main` for that book;
everyone else uses this flow.

If you have never used GitHub, start with the [author guide](author-guide.md)
instead.

## Branch → edit → pull request

1. Create a branch named after the chapter, for example
   `fix/example-book-ch02-typos`.
2. Edit one chapter file. If the table of contents must change to match
   (added, renamed, or removed chapter), edit that book's `README.md` in
   the same branch.
3. Open a pull request against `main`. The PR template asks for the book,
   the chapter, what changed, and why.
4. Wait for the book's lead author to review.

Keep the pull request to one chapter. A second chapter is a second PR.

## Keeping the chapter-feedback book list current

`.github/ISSUE_TEMPLATE/chapter-feedback.yml` has a dropdown of books.
GitHub will not update it for you.

When you add a book:

1. Copy `books/_TEMPLATE/` to `books/<slug>/`.
2. In the same PR, add a new option under the `book` dropdown in
   `chapter-feedback.yml`. The option text is the slug, for example
   `leveraging-luck`.
3. Put `_TEMPLATE` last, so real books sit above the example.

When you retire a book, remove its option in the same PR that removes the
folder.

## Line-comment reviews

Review the manuscript, not the idea of the book, unless the PR is a new-book
proposal.

- Comment on the line that needs to change.
- Use GitHub's suggested-change feature when you have replacement text.
- Do not demand a voice that is not already on the page.
- If the TOC or chapter count in the book README is stale, say so and block
  merge until it is fixed.

## Merge etiquette

- The lead author named on the book's README merges that book's PRs.
- Do not squash away a carefully written chapter history unless the author
  asks. A regular merge (or squash of a messy fixup branch, if the author
  agrees) is fine.
- After merge, confirm the live README contents list still matches the
  files in `manuscript/`.
- Do not enable branch protection or CODEOWNERS as part of ordinary editing.
````

- [ ] **Step 2: Verify `docs/editor-guide.md`**

Run:

```bash
test -f docs/editor-guide.md
grep -n 'Branch → edit → pull request' docs/editor-guide.md
grep -n 'chapter-feedback.yml' docs/editor-guide.md
grep -n 'Line-comment reviews' docs/editor-guide.md
grep -n 'Merge etiquette' docs/editor-guide.md
grep -n 'Put `_TEMPLATE` last' docs/editor-guide.md
```

Expected: all patterns present.

---

### Task 6: Book anatomy

**Files:**
- Create: `docs/book-anatomy.md`

- [ ] **Step 1: Write `docs/book-anatomy.md`**

Write `docs/book-anatomy.md` with exactly this content:

````markdown
# Book anatomy

What every book folder contains, and the naming rules that keep GitHub's
file list readable.

## Folder layout

Each book lives at `books/<slug>/`:

    books/<slug>/
    ├── README.md          # Hub: info table + checkbox table of contents
    ├── manuscript/
    │   ├── front-matter.md
    │   ├── ch01-<short-slug>.md
    │   ├── ch02-<short-slug>.md
    │   └── back-matter.md
    └── media/             # Cover art and figures (optional files)

Start a book by copying `books/_TEMPLATE/` and renaming the copy.

## Naming rules

**Book slug.** The folder name is lowercase letters, digits, and hyphens.
No spaces, no underscores, no punctuation. Example: `leveraging-luck`.

**Chapters.** `chNN-short-slug.md` — two-digit zero-padded number, hyphen,
short slug. The number is the reading order. GitHub lists files
alphabetically, so `ch01` … `ch09` … `ch10` stay in order.

**After 99 chapters.** `ch100-slug.md` continues to sort after the
zero-padded files (`ch99-…` then `ch100-…`). Do not switch schemes.

**Front and back matter.** Always named `front-matter.md` and
`back-matter.md`. Do not number them. They will not sort into reading order
in the file list; the README table of contents is the reading order.

## The book README (hub)

Plain Markdown. No YAML front matter. An info table and a checkbox contents
list:

    # Title

    | | |
    |---|---|
    | **Authors**   | @username |
    | **Status**    | Drafting |
    | **Chapters**  | 1 of 12 drafted |

    ## Contents

    - [ ] [Front Matter](manuscript/front-matter.md)
    - [ ] [Ch 1 — Getting Started](manuscript/ch01-getting-started.md)
    - [ ] [Back Matter](manuscript/back-matter.md)

Tick boxes by editing `[ ]` to `[x]` (see the author guide). Update the
Chapters count when it drifts.

## Manuscript

- One file per chapter.
- A chapter is a single `# Title` heading, then paragraphs. No metadata,
  no HTML comments, nothing an author has to understand beyond Markdown.
- Front matter holds the title page, a copyright line (`©` year author),
  and an optional dedication.
- Back matter holds epilogue, acknowledgments, and about-the-author —
  use `##` headings for those sections.

## Media and relative links

Put images in that book's `media/` folder. From a chapter, link relatively:

    ![A river in late light](../media/river.png)

Do not use absolute GitHub URLs. Relative links survive a rename of the
book folder.

There is no sample image in `_TEMPLATE/media/` on purpose. An image
reference without a file would render broken. Add files when a real book
needs them.

## Guiding rule

If you cannot explain a convention to a first-time author in one sentence,
it does not belong in the book folder. Put extra process in `docs/` or
`.github/`, not next to the prose.
````

- [ ] **Step 2: Verify `docs/book-anatomy.md`**

Run:

```bash
test -f docs/book-anatomy.md
grep -n 'chNN-short-slug.md' docs/book-anatomy.md
grep -n 'ch100' docs/book-anatomy.md
grep -n 'front-matter.md' docs/book-anatomy.md
grep -n '\.\./media/' docs/book-anatomy.md
grep -n 'one sentence' docs/book-anatomy.md
```

Expected: naming rules, ch100 note, media relative link, one-sentence rule all present.

---

## Chunk 2: Local scaffold — template, GitHub forms, commit

### Task 7: Template book

**Files:**
- Create: `books/_TEMPLATE/README.md`
- Create: `books/_TEMPLATE/manuscript/front-matter.md`
- Create: `books/_TEMPLATE/manuscript/ch01-example.md`
- Create: `books/_TEMPLATE/manuscript/ch02-example.md`
- Create: `books/_TEMPLATE/manuscript/back-matter.md`
- Create: `books/_TEMPLATE/media/.gitkeep`

- [ ] **Step 1: Write `books/_TEMPLATE/README.md`**

Write `books/_TEMPLATE/README.md` with exactly this content:

````markdown
<!--
  Start a book: copy this folder to books/<slug>/ (lowercase, hyphens).
  Fill in the table, replace the title, and tick boxes as chapters land.
  The manuscript files are example prose — overwrite them.
  Front matter uses a worked title ("The Example Book"); the hub title
  below this comment is the fill-in-the-blank you replace first.
  Delete this comment when you are ready.
-->

# Your Book Title

| | |
|---|---|
| **Authors**   | @your-github-username |
| **Status**    | Drafting |
| **Chapters**  | 0 of N drafted |

## Contents

- [ ] [Front Matter](manuscript/front-matter.md)
- [ ] [Ch 1 — Opening the Binder](manuscript/ch01-example.md)
- [ ] [Ch 2 — Leaving a Trace](manuscript/ch02-example.md)
- [ ] [Back Matter](manuscript/back-matter.md)
````

- [ ] **Step 2: Write `books/_TEMPLATE/manuscript/front-matter.md`**

Write `books/_TEMPLATE/manuscript/front-matter.md` with exactly this content:

````markdown
# The Example Book

A demonstration of how a book lives in openbookbinder.

© 2026 Your Name. All rights reserved.

## Dedication

For the person who copies this folder and starts writing.
````

- [ ] **Step 3: Write `books/_TEMPLATE/manuscript/ch01-example.md`**

Write `books/_TEMPLATE/manuscript/ch01-example.md` with exactly this content:

````markdown
# Opening the Binder

This is a real chapter, short on purpose. Copy this folder, rename it, and
overwrite these pages with your own.

A chapter is one file. The title is the only heading. Everything after that
is the writing — paragraphs, the way you'd speak them if you were sitting
across a table.

When you want a new chapter, add another file named like this one:
`ch03-something-short.md`. Then add a line for it in the book's README.
````

- [ ] **Step 4: Write `books/_TEMPLATE/manuscript/ch02-example.md`**

Write `books/_TEMPLATE/manuscript/ch02-example.md` with exactly this content:

````markdown
# Leaving a Trace

Every change here has a memory. GitHub keeps who wrote what, when they wrote
it, and the note they left. That is the whole point of using this place
instead of a document that overwrites itself.

If you are new, you do not need to learn git. Open a file, change a sentence,
and save. If you are an editor, you will make a pull request so the author
can accept your change line by line.
````

- [ ] **Step 5: Write `books/_TEMPLATE/manuscript/back-matter.md`**

Write `books/_TEMPLATE/manuscript/back-matter.md` with exactly this content:

````markdown
# Back Matter

## Epilogue

The book ends here. Say what you want the reader to take with them.

## Acknowledgments

Thank the people who read drafts, caught errors, and kept you writing.

## About the Author

A short paragraph about who wrote the book.
````

- [ ] **Step 6: Write `books/_TEMPLATE/media/.gitkeep`**

Create an empty file at `books/_TEMPLATE/media/.gitkeep` (zero bytes, or a
single trailing newline). No image files.

- [ ] **Step 7: Verify the template book**

Run:

```bash
test -f books/_TEMPLATE/README.md
test -f books/_TEMPLATE/manuscript/front-matter.md
test -f books/_TEMPLATE/manuscript/ch01-example.md
test -f books/_TEMPLATE/manuscript/ch02-example.md
test -f books/_TEMPLATE/manuscript/back-matter.md
test -f books/_TEMPLATE/media/.gitkeep
grep -n 'manuscript/ch01-example.md' books/_TEMPLATE/README.md
grep -n 'manuscript/ch02-example.md' books/_TEMPLATE/README.md
grep -n '© 2026 Your Name' books/_TEMPLATE/manuscript/front-matter.md
grep -n '^# Opening the Binder$' books/_TEMPLATE/manuscript/ch01-example.md
grep -n '^# Leaving a Trace$' books/_TEMPLATE/manuscript/ch02-example.md
grep -n '^## About the Author$' books/_TEMPLATE/manuscript/back-matter.md
# Chapters must not contain a second markdown H1 or an image embed.
# FNR (not NR): NR does not reset at file boundaries on macOS awk.
awk 'FNR>1 && /^# /{print FILENAME": extra H1 on line "FNR}' books/_TEMPLATE/manuscript/ch01-example.md books/_TEMPLATE/manuscript/ch02-example.md
grep -n '!\[.*\](' books/_TEMPLATE/manuscript/*.md && echo 'FAIL: image embed in chapter' || echo 'OK: no image embeds'
ls books/_TEMPLATE/manuscript/
ls -A books/_TEMPLATE/media/
```

Expected:

- All six paths exist.
- README links to both example chapters (`ch01-example.md` and `ch02-example.md`).
- Copyright line present in front matter.
- Chapter titles match.
- `awk` prints nothing (only one H1 per example chapter).
- `OK: no image embeds`.
- `ls books/_TEMPLATE/manuscript/` prints, in some order:
  `back-matter.md`, `ch01-example.md`, `ch02-example.md`, `front-matter.md`.
  Zero-padded chapter names sort between `back-matter.md` and `front-matter.md`.
  That is accepted; the README TOC is the reading order.
- `ls -A books/_TEMPLATE/media/` prints only `.gitkeep` (no sample image).
  Plain `ls` hides dotfiles on macOS.

---

### Task 8: GitHub PR and issue templates

**Files:**
- Create: `.github/PULL_REQUEST_TEMPLATE.md`
- Create: `.github/ISSUE_TEMPLATE/chapter-feedback.yml`
- Create: `.github/ISSUE_TEMPLATE/new-book-proposal.md`

- [ ] **Step 1: Write `.github/PULL_REQUEST_TEMPLATE.md`**

Write `.github/PULL_REQUEST_TEMPLATE.md` with exactly this content:

````markdown
## Chapter

- **Book:**
- **Chapter:** (`chNN-slug` or front/back matter)

## What changed

## Why

## Checklist

- [ ] This PR touches one chapter (or the book README's TOC to match)
- [ ] Author voice is preserved — no wholesale rewrites
- [ ] If chapters were added or renamed, the book README TOC is updated
````

- [ ] **Step 2: Write `.github/ISSUE_TEMPLATE/chapter-feedback.yml`**

Write `.github/ISSUE_TEMPLATE/chapter-feedback.yml` with exactly this content:

```yaml
name: Chapter feedback
description: Suggest an improvement to a chapter — no git knowledge needed
title: "[Feedback]: "
labels: ["feedback"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for reading. Tell us which part and what you would change.
        If you know the exact line, you can also open a pull request and
        propose the new sentence there.
  - type: dropdown
    id: book
    attributes:
      label: Book
      description: Which book is this about?
      options:
        - _TEMPLATE
    validations:
      required: true
  - type: input
    id: location
    attributes:
      label: Where in the book?
      description: Chapter name, or a few words from the passage.
      placeholder: e.g. Chapter 2, the paragraph starting with…
    validations:
      required: true
  - type: dropdown
    id: kind
    attributes:
      label: What kind of feedback?
      options:
        - Typo
        - Clarity
        - Structure
        - Bigger idea
    validations:
      required: true
  - type: textarea
    id: details
    attributes:
      label: Details
      description: What would you change, and why?
    validations:
      required: true
```

- [ ] **Step 3: Write `.github/ISSUE_TEMPLATE/new-book-proposal.md`**

Write `.github/ISSUE_TEMPLATE/new-book-proposal.md` with exactly this content:

````markdown
---
name: New book proposal
about: Pitch a new book before scaffolding it
title: "[Proposal]: "
labels: proposal
---

## Working title

## Premise

One paragraph: what is this book about, and why now?

## Audience

Who is it for? What do they already know?

## Why you

Who writes it, and why them?

## Chapter sketch

A rough list of chapters — names only is fine.

## Notes

Anything else (collaborators, related books, constraints).
````

- [ ] **Step 4: Verify GitHub templates**

Run:

```bash
test -f .github/PULL_REQUEST_TEMPLATE.md
test -f .github/ISSUE_TEMPLATE/chapter-feedback.yml
test -f .github/ISSUE_TEMPLATE/new-book-proposal.md
grep -n 'one chapter' .github/PULL_REQUEST_TEMPLATE.md
grep -n 'Author voice is preserved' .github/PULL_REQUEST_TEMPLATE.md
grep -n 'Working title' .github/ISSUE_TEMPLATE/new-book-proposal.md
ruby -ryaml -e '
  doc = YAML.load_file(".github/ISSUE_TEMPLATE/chapter-feedback.yml")
  abort("missing name") unless doc["name"] == "Chapter feedback"
  ids = doc["body"].map { |x| x["id"] }.compact
  abort("ids=#{ids}") unless ids == ["book", "location", "kind", "details"]
  book = doc["body"].find { |x| x["id"] == "book" }
  abort("book not dropdown") unless book["type"] == "dropdown"
  abort("book options") unless book["attributes"]["options"] == ["_TEMPLATE"]
  kind = doc["body"].find { |x| x["id"] == "kind" }
  want = ["Typo", "Clarity", "Structure", "Bigger idea"]
  abort("kind options") unless kind["attributes"]["options"] == want
  %w[book location kind details].each do |id|
    field = doc["body"].find { |x| x["id"] == id }
    abort("#{id} not required") unless field.dig("validations", "required") == true
  end
  puts "YAML OK"
'
```

Expected: files exist; PR checklist phrases present; Ruby prints `YAML OK` and exits 0.

---

### Task 9: Local verification pass and commit

**Files:** none new — verify the tree, then one scaffold commit on `main`.

- [ ] **Step 1: Tree matches the spec**

Run:

```bash
find . -path ./.git -prune -o -path './docs/superpowers' -prune -o -type f -print | sed 's|^\./||' | sort
```

Expected (at least these paths; `docs/superpowers/...` is pruned here and already exists from the design phase):

```
.github/ISSUE_TEMPLATE/chapter-feedback.yml
.github/ISSUE_TEMPLATE/new-book-proposal.md
.github/PULL_REQUEST_TEMPLATE.md
.gitignore
AGENTS.md
CONTRIBUTING.md
LICENSE
README.md
books/_TEMPLATE/README.md
books/_TEMPLATE/media/.gitkeep
books/_TEMPLATE/manuscript/back-matter.md
books/_TEMPLATE/manuscript/ch01-example.md
books/_TEMPLATE/manuscript/ch02-example.md
books/_TEMPLATE/manuscript/front-matter.md
docs/author-guide.md
docs/book-anatomy.md
docs/editor-guide.md
```

Also confirm the plan and spec still exist:

```bash
test -f docs/superpowers/specs/2026-08-22-openbookbinder-design.md
test -f docs/superpowers/plans/2026-08-22-openbookbinder-scaffold.md
```

- [ ] **Step 2: No placeholders in product files**

Run:

```bash
if grep -RniE 'TODO|TBD|FIXME|\[placeholder\]' \
  --include='*.md' --include='*.yml' --include='.gitignore' --include='LICENSE' \
  --exclude-dir=superpowers --exclude-dir=.git .; then
  echo 'FAIL: placeholder found'
  exit 1
else
  echo 'OK: no placeholders'
fi
```

Expected: prints `OK: no placeholders` and exits 0. Any match is a failed task.

- [ ] **Step 3: Copy-a-folder dry run**

Run:

```bash
rm -rf /tmp/openbookbinder-copy-test
cp -R books/_TEMPLATE /tmp/openbookbinder-copy-test
test -f /tmp/openbookbinder-copy-test/README.md
test -f /tmp/openbookbinder-copy-test/manuscript/ch01-example.md
test -f /tmp/openbookbinder-copy-test/media/.gitkeep
rm -rf /tmp/openbookbinder-copy-test
echo "copy-ok"
```

Expected: `copy-ok`.

- [ ] **Step 4: Commit the scaffold**

```bash
test "$(git branch --show-current)" = "main"
git add .gitignore LICENSE README.md CONTRIBUTING.md AGENTS.md \
  docs/author-guide.md docs/editor-guide.md docs/book-anatomy.md \
  docs/superpowers/plans/2026-08-22-openbookbinder-scaffold.md \
  books/_TEMPLATE \
  .github/PULL_REQUEST_TEMPLATE.md \
  .github/ISSUE_TEMPLATE/chapter-feedback.yml \
  .github/ISSUE_TEMPLATE/new-book-proposal.md
git status
git commit -m "$(cat <<'EOF'
Scaffold the openbookbinder framework

Add the portal, guides, dual-notice LICENSE, book template, and GitHub
issue/PR forms so authors can write in the browser with no build step.
EOF
)"
git log --oneline -5
git status
```

Expected: current branch is `main`; one new commit on `main`; working tree clean (or only unrelated untracked files). Do not commit `.DS_Store`. Do not amend, rebase, or force-push.

---

## Chunk 3: Publish to Svyable and verify live

This chunk does not create product files. It publishes the `main` history
already committed in Task 9 (design spec + scaffold). Do not `git init`,
amend, rebase, or force-push. Do not invent a second "initial" commit.

### Task 10: Create the public GitHub repo and push

**Files:** none — git remotes and GitHub metadata only.

- [ ] **Step 1: Confirm auth, local scaffold, and that the remote does not already exist**

Run:

```bash
test "$(git branch --show-current)" = "main"
test -f README.md
test -f .github/ISSUE_TEMPLATE/chapter-feedback.yml
test -z "$(git status --porcelain)"
git log --oneline -5
git remote -v
gh auth status
gh api user --jq .login
gh repo view Svyable/openbookbinder 2>&1 | head -20
```

Expected:

- Current branch is `main`; `README.md` and the issue form exist; working
  tree is clean; `HEAD` has commits (design spec + scaffold). If porcelain
  is dirty only because of plan-review markdown under
  `docs/superpowers/plans/review-chunk-*.md`, delete or leave those files
  untracked — do not `git add -A`.
- `gh auth status` succeeds (any login that can create
  `Svyable/openbookbinder` is fine — do **not** require the login string to
  equal `Svyable`).
- `gh repo view` fails with "Could not resolve to a Repository" (the public
  repo must not exist yet). If it *does* exist, stop and ask a human.
- No `origin` remote yet.

- [ ] **Step 2: Create the public repo, push `main`, set topics**

Run:

```bash
gh repo create Svyable/openbookbinder \
  --public \
  --source=. \
  --remote=origin \
  --push \
  --description "Write and edit books with colleagues, natively on GitHub"

gh repo edit Svyable/openbookbinder \
  --add-topic books \
  --add-topic writing \
  --add-topic markdown \
  --add-topic collaboration \
  --default-branch main

git remote -v
gh repo view Svyable/openbookbinder --json name,description,url,isPrivate,repositoryTopics,defaultBranchRef \
  --jq '{name,description,url,isPrivate,defaultBranch:.defaultBranchRef.name,topics:((.repositoryTopics // []) | map(.name))}'
```

If `gh repo create` succeeds but `--push` fails, recover with
`git push -u origin main` only. Never `--force`.

Expected:

- Command succeeds.
- `origin` points at `https://github.com/Svyable/openbookbinder.git` (or the
  SSH equivalent).
- JSON shows `isPrivate: false`, `defaultBranch` is `main`, the description
  above, and topics including `books`, `writing`, `markdown`,
  `collaboration`.
- URL is `https://github.com/Svyable/openbookbinder`.

---

### Task 11: Live verification on github.com

**Files:** none.

- [ ] **Step 1: API checks for tree, manuscript listing, and issue templates**

Run:

```bash
gh api repos/Svyable/openbookbinder/contents/README.md --jq .type
gh api -H "Accept: application/vnd.github.raw" repos/Svyable/openbookbinder/contents/README.md | head -5
gh api repos/Svyable/openbookbinder/contents/books/_TEMPLATE/manuscript --jq '.[].name'
gh api repos/Svyable/openbookbinder/contents/.github/ISSUE_TEMPLATE --jq '.[].name'
gh api repos/Svyable/openbookbinder --jq '{has_issues,default_branch}'
gh repo view Svyable/openbookbinder --json issueTemplates --jq '((.issueTemplates // []) | map({name,title}))'
```

Expected:

- README `type` is `file`.
- Raw README starts with `# openbookbinder`.
- Manuscript names, in GitHub's listing order, are exactly:
  `back-matter.md`, `ch01-example.md`, `ch02-example.md`, `front-matter.md`.
  That is alphabetical (`ch01` before `ch02`; front/back not in reading
  order). The README TOC remains the reading order.
- Issue template file names include `chapter-feedback.yml` and
  `new-book-proposal.md`.
- `issueTemplates` JSON includes both form names (GitHub parsed them).
- `has_issues` is true; `default_branch` is `main`.

- [ ] **Step 2: Confirm pages render as Markdown (signed-in browser)**

These URLs need a **signed-in github.com session** (separate from `gh auth`).
Logged-out `/issues/new/choose` often redirects to login — that is not
"forms missing." Use `gh repo view Svyable/openbookbinder --web` if helpful.

Open in a browser:

- `https://github.com/Svyable/openbookbinder` — portal README renders; "No books yet" is visible; guide links work.
- `https://github.com/Svyable/openbookbinder/tree/main/books/_TEMPLATE/manuscript` — four files listed **in this order**:
  `back-matter.md`, `ch01-example.md`, `ch02-example.md`, `front-matter.md`.
  Confirm `ch01-example.md` appears above `ch02-example.md`.
- `https://github.com/Svyable/openbookbinder/issues/new/choose` — **Chapter feedback** and **New book proposal** both appear.
- Open **Chapter feedback**. Book dropdown shows only `_TEMPLATE`. Location,
  kind (Typo / Clarity / Structure / Bigger idea), and details are present.
  Click **Submit new issue** with the form empty — GitHub must refuse
  (required fields). Do not actually file an issue.
- Open **New book proposal** from the chooser and confirm the pitch headings
  (Working title, Premise, Audience, Why you, Chapter sketch) render. Do not
  file it.

- [ ] **Step 3: Author-guide walkthrough vs live UI**

Read `docs/author-guide.md` against the live file view of
`books/_TEMPLATE/manuscript/ch01-example.md` while signed in:

- Pencil / **Edit this file** is present.
- The commit dialog still offers direct-to-`main` vs "create a new branch
  and start a pull request".
- Issue form names match the guide.

The fork prompt in the author guide is for people **without** write access.
The repo owner will not see it; do not invent a second-user test.

If the GitHub UI labels have changed, update **only** `docs/author-guide.md`
in a new commit on `main`:

```bash
git add docs/author-guide.md
git commit -m "docs: match author-guide labels to live GitHub UI"
git push origin main
```

Do not amend Task 9. Do not `git add -A`. Do not touch the design spec.
Do not add Pages, CODEOWNERS, or rendering.

---

## Execution notes

- Working directory: `/Users/svenbenson/GitHub/openbookbinder`.
- Branch: `main` (explicit; the design lands the scaffold here).
- Chunk 3 only creates the GitHub remote and verifies it. The scaffold
  commit already happened in Task 9.
- Do not add files that are not in the File Structure table, except this
  plan (already listed in Task 9's `git add`).
- Do not `git init`, amend, rebase, or force-push.
- If `gh repo create` reports the name is taken, stop and ask a human.
- After Task 11, the repo is live. Further books are out of scope.
