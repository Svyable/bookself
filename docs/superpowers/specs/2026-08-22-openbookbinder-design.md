# openbookbinder — Design Document

**Date:** 2026-08-22
**Status:** Approved
**Remote:** `github.com/Svyable/openbookbinder` (public)

## Purpose

openbookbinder is a multi-book framework that treats GitHub as a native place to
write and edit books with colleagues and authors. One public repository holds many
books as plain Markdown; collaboration happens through GitHub's own tools — the web
editor, pull requests, issues, and line comments — with no build step anywhere.

## Goals

- Authors write plain Markdown that renders natively on GitHub.
- Non-technical authors can contribute without knowing git.
- Adding a book means copying a folder — no tooling, no config files to learn.
- Day-one setup stays minimal; rendering and previews come later, when a real book needs them.

## Non-Goals (Deferred)

Recorded so they are easy to find later. Each is added when a real book requires it:

- PDF/ePub rendering pipeline
- GitHub Pages preview site
- Branch protection rules
- CODEOWNERS

## Approach

Monorepo: one repository, one folder per book. Chosen over per-book repos linked by
submodules (which break the GitHub web editor experience for non-technical authors)
and over a heavier manifest-driven system (unnecessary until real tooling exists).

All books share one history; acceptable for a small team, and it keeps forking,
search, and PRs working repo-wide.

## Repository Layout

```
openbookbinder/
├── README.md                     # Portal: what openbookbinder is + catalog of books
├── CONTRIBUTING.md               # How editors propose changes (PR workflow)
├── AGENTS.md                     # Rules for AI agents working in this repo
├── LICENSE                       # Framework MIT; book content © its authors
├── .gitignore                    # .DS_Store, editor droppings
├── docs/
│   ├── author-guide.md           # "Never used GitHub?" — writing via the web editor
│   ├── editor-guide.md           # Branch → edit → pull request → review
│   └── book-anatomy.md           # What every book folder must contain
├── books/
│   └── _TEMPLATE/                # Copy this folder to start a new book
│       ├── README.md             # Book hub: info table + clickable TOC with status
│       ├── manuscript/
│       │   ├── front-matter.md   # Title page, copyright, dedication
│       │   ├── ch01-example.md   # Zero-padded: sorts in reading order on GitHub
│       │   ├── ch02-example.md
│       │   └── back-matter.md    # Epilogue, acknowledgments, about-the-author
│       └── media/                # Cover art, figures (per-book)
└── .github/
    ├── PULL_REQUEST_TEMPLATE.md  # Checklist for chapter edits
    └── ISSUE_TEMPLATE/
        ├── chapter-feedback.yml  # Form: which chapter, what kind of feedback
        └── new-book-proposal.md  # Pitch a new book before scaffolding it
```

### Key layout decisions

- `books/_TEMPLATE/` — leading underscore pins it to the top of the folder listing
  and signals "not a real book". Copy, rename, start writing.
- Chapter files are `chNN-slug.md` — zero-padding makes the file list read like a
  table of contents with no tooling.
- No build step. Every file is readable and editable in the browser as-is.
- Per-book `media/` keeps images next to their manuscript; relative links
  (`![alt](../media/figure-1.png)`) survive renames within a book.

## Anatomy of a Book

Each book lives at `books/<slug>/` where `<slug>` is lowercase-with-hyphens.

### Book README (the hub)

Plain markdown, no YAML front matter. A small info table plus a clickable checkbox
TOC that doubles as the progress tracker:

```markdown
# Example Book

| | |
|---|---|
| **Authors**   | @svyable |
| **Status**    | Drafting |
| **Chapters**  | 3 of 12 drafted |

## Contents

- [ ] [Front Matter](manuscript/front-matter.md)
- [ ] [Ch 1 — Getting Started](manuscript/ch01-getting-started.md)
- [ ] [Back Matter](manuscript/back-matter.md)
```

Authors tick checkboxes and update statuses directly in the web editor — this is the
project management.

### Manuscript

- One file per chapter: `chNN-short-slug.md`.
- Fixed anchors: `front-matter.md`, `back-matter.md`.
- Chapters are pure prose: a single `# Title` heading, then paragraphs. No metadata,
  no HTML comments, nothing an author must understand beyond Markdown.

### Media

Images live in the book's `media/` folder and are referenced relatively from the
manuscript.

### Guiding rule

Encoded in `docs/book-anatomy.md`: if it can't be explained to a first-time author
in one sentence, it doesn't belong in the book folder.

## Collaboration Model

Three lanes matched to skill level:

| Who | How they work |
|---|---|
| Lead author (book owner) | Commits directly to `main` for their own book; small fixes need no ceremony |
| Editors / co-authors | Branch → edit → Pull Request → owner reviews & merges |
| Suggesters / readers | File an Issue via the feedback form, or use GitHub inline *suggest change* |

- One chapter per PR. The PR template carries a short checklist: which book/chapter,
  what changed, why, voice preserved, TOC updated.
- Reviews happen as line comments in the manuscript.
- Roles stay informal: each book's README names its authors; the lead author reviews
  that book's PRs. No CODEOWNERS until needed.

### Issue templates

- `chapter-feedback.yml` — dropdowns for book, chapter, and type
  (typo / clarity / structure / bigger idea), plus free text. For people who will
  never touch git.
- `new-book-proposal.md` — pitch template (working title, premise, audience, chapter
  sketch) so books are scaffolded deliberately.

### AI agents (`AGENTS.md`)

Rules for agent-assisted editing: never rewrite beyond requested scope; preserve
author voice; match existing markdown conventions; keep PRs single-chapter; always
update the book README's TOC/status when adding chapters.

## Licensing

Framework scaffolding and docs under MIT. Book manuscripts remain © their respective
authors (stated in LICENSE and in each book's front matter). This keeps the framework
reusable while protecting unpublished work.

## Setup Sequence

1. Create local folder `~/GitHub/openbookbinder` (done during design phase).
2. Write every file listed above as complete, polished content — no placeholders.
3. `git init -b main`; single clean initial commit.
4. `gh repo create Svyable/openbookbinder --public --source . --push` with
   description "Write and edit books with colleagues, natively on GitHub" and topics
   (`books`, `writing`, `markdown`, `collaboration`).
5. Verify: rendered portal README, `_TEMPLATE/manuscript/` sorts correctly in the
   browser, issue forms active.

## Testing

Verification is manual and browser-based (no code to unit test):

- All markdown renders correctly on github.com after push.
- Template folder copies cleanly into a hypothetical new book location.
- Issue forms validate required fields.
- A first-time-author walkthrough of `docs/author-guide.md` steps matches what the
  GitHub UI actually shows.
