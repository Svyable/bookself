# openbookbinder Reader — Design Spec

**Date:** 2026-08-22
**Status:** Approved (brainstorm, hybrid reader phase)
**Depends on:** `2026-08-22-openbookbinder-design.md` (binder, Markdown, GitHub collaboration)

This phase un-defers the original non-goal “GitHub Pages preview site.” Writing still happens on GitHub. The public GUI is a Kindle-style reader. Authors and GitHub-authed agents never edit reader code to publish a book.

## Purpose

openbookbinder is two faces of one repository:

- **github.com** is the binder: write, edit, review, discuss.
- **The reader** (`reader/`, served on GitHub Pages) is how the public reads a finished book.

Markdown in `books/<slug>/` is the only source of truth. The reader fetches it at run time and paginates it. There is no author-facing build.

## Locked decisions

| Decision | Status |
|---|---|
| Hybrid product: GitHub writes, reader publishes | Locked |
| No author-facing build; Markdown remains the source of truth | Locked |
| Binder home lists only `Status: Published` | Locked |
| V1 chrome: lean Kindle core + night light + reading stats | Locked |
| Notes/highlights deferred; position model must support them later | Locked |
| Canonical position `{ book, chapter, offset }` in chapter Markdown | Locked |
| URLs `/#/b/<slug>/` and `/#/b/<slug>/<chapter>/<offset>` | Locked |
| Storage namespaced by book slug | Locked |
| App lives in `reader/` (MIT). Root `index.html` sends Pages visitors there | Locked |
| Pages publishes the **repo root** with `.nojekyll` so `books/` is fetchable | Locked |
| Catalog = portal README book list, then Status double-checked on the book README | Locked |
| Publish = one change set: Status `Published` + a portal README row | Locked |
| Agent-operable: authors/agents only touch Markdown and `media/` | Locked |
| Unlisted deep links preview drafts (binder still hides them) | Locked |

## Non-goals (v1)

- Notes, highlights, full-text search
- Recommended-reading shelves, per-book resource grids
- ePub / PDF export
- Accounts, comments, or reader login
- Per-book theme files
- Making drafts secret (this is a public repo; the gate is listing, not access)
- A write GUI. GitHub (web editor, PRs, or a GitHub-authed agent) is the writing tool

## Author and agent verbs

An author, or a GitHub-authed agent acting for them, can run the whole public lifecycle by editing Markdown.

| Verb | What changes | Must not change |
|---|---|---|
| **Start a book** | Copy `books/_TEMPLATE/` → `books/<slug>/`. Fill title, authors, `Status: Drafting`. Add slug to the chapter-feedback dropdown. | Portal catalog. `reader/`. |
| **Write / edit** | One chapter file (plus the book README TOC if chapters were added, renamed, or removed). | Reader code. Other chapters. |
| **Preview** | Push, then open `/reader/#/b/<slug>/`. Works while Drafting. Not listed on the binder. | Status, catalog. |
| **Publish** | Set Status to the exact string `Published`. Add one portal README row linking `books/<slug>/`. | Reader code. |
| **Revise a published book** | Edit Markdown and push. The reader fetches live files. | No version stamp in v1. |
| **Unpublish** | Set Status to anything except `Published` **and** remove the portal README row. | Deleting the folder is optional. |

Lead author of that book merges. `_TEMPLATE` is never a catalog entry.

## Catalog format

Portal `README.md` section `## The books` lists published (or soon-to-be-published) books as Markdown links whose target is `books/<slug>/`. The reader:

1. Parses those slugs from the portal README.
2. Fetches each `books/<slug>/README.md`.
3. Includes the book on the binder **only if** Status is exactly `Published`.

A leftover catalog line cannot leak a draft. A Status flip with no catalog line cannot appear on the binder (unlisted URL still works).

## Reader architecture

Modules, in order:

1. **base** — repo base path (works at `/` and at `/openbookbinder/`), `fetch` of repo files.
2. **catalog** — parse portal README + book README (title, authors, status, TOC).
3. **markdown** — CommonMark via vendored `marked`; rewrite `../media/` to repo paths.
4. **paginate** — chapter Markdown → pages. Each page carries `chapter`, `start` offset, `end` offset. Pages are derived; they are not stored.
5. **storage** — `obb:prefs` and `obb:<slug>:*` in `localStorage`.
6. **router** — hash URLs above.
7. **app** — binder home + reading chrome.

V2 notes attach to `{ chapter, start, end }` offset ranges. Do not store page numbers.

### Pagination

- Tokenize Markdown with `marked.lexer` so each block knows its source offsets.
- Fill an offscreen page whose box matches the visible page (font size, width, height).
- Overflow splits at block boundaries; a single overflowing paragraph splits on word boundaries and interpolates offsets.
- Re-paginate on resize and font-size change, then restore the page that still contains the saved offset.
- Desktop default: two-page spread. Narrow viewports and the Single toggle: one page.
- Keyboard, click halves, and swipe turn pages.

### Markdown subset (v1)

CommonMark as `marked` parses it: headings, paragraphs, emphasis, links, images, blockquotes, lists, thematic breaks. Images resolve relative to the book folder. Optional `media/cover.png` (or `.jpg` / `.webp`) on the generated cover; otherwise a cloth cover from title + author.

### Author / publisher / reader tools

Still no author-facing build. Optional README rows: Publisher, Edition,
Language, ISBN. The reader uses them as imprint, colophon, and a shelf
filter. Draft covers list missing or empty chapter files. Cover open
refetches Markdown. Print/PDF is the browser print dialog over derived
pages (draft wash on unpublished books). Copy link shares the current URL.

Readers: in-book search, focus mode, typeface/line-height, text selection
(copy / note / share), notes stored as `{ chapter, offset, quote, body }`,
export notes as Markdown, edit-this-chapter GitHub link, continue-reading
on the shelf.

### Chrome (v1)

From the Leveraging Luck reader, kept:

- Cover → pages → back cover
- Two-page spread / single / swipe
- Dark (default) / light
- Font size
- TOC from the book README, with search
- Bookmarks (offset-based, per book)
- Resume where you left off
- Progress bar
- Night light (warm overlay)
- Session reading stats

Dropped: recommended library, resources grid, ambient orbs, hardcoded HTML pages, Luck branding.

Binder home is a shelf of published volumes. Empty state explains how to publish.

Drafts opened by unlisted URL show a small Draft badge. They still do not appear on the shelf.

## Hosting

- `.nojekyll` at repo root so GitHub Pages does not run Jekyll on manuscripts.
- Pages **source** = `main` branch, **/** (root), not `/docs`.
- `index.html` at repo root redirects to `reader/`.
- github.com still renders `README.md` as the writing portal.
- Local preview: serve the repo root (`python3 -m http.server`) and open `/reader/`. `file://` cannot fetch Markdown.

Draft Markdown is fetchable on Pages because the repo is public. That is the same visibility as github.com.

## Layout added this phase

```
openbookbinder/
├── .nojekyll
├── index.html                 # redirect → reader/
├── reader/
│   ├── index.html
│   ├── css/style.css
│   ├── js/                    # modules listed above
│   └── vendor/marked.min.js
└── books/the-example-book/    # first Published sample (framework demo)
```

## Testing

- Catalog parser: portal README with zero, one, and mixed Drafting/Published books.
- Unlisted URL loads a Drafting book; binder shelf does not list it.
- Publish both-gates: Status only, catalog only, both.
- Paginate a long chapter; change font size; offset resume still lands in the same passage.
- Relative images in a chapter resolve.
- Keyboard, swipe, spread/single, night light, bookmark, stats.
- Agent walkthrough of AGENTS.md verbs against the example book.

## Later (foundation already allows)

- Notes/highlights on offset ranges
- Full-text search
- ePub/PDF derived from the same Markdown
- Per-book CSS variables
- Dedicated `books/CATALOG.md` if the portal README outgrows a table
- Custom domain
