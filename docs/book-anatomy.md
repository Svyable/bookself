# Book anatomy

What every book folder contains, and the naming rules that keep GitHub's
file list readable.

## Folder layout

Each book lives at `books/<slug>/`:

    books/<slug>/
    ├── README.md          # Hub: info table + checkbox table of contents
    ├── reader.json        # Optional recommended Reader presentation
    ├── manuscript/
    │   ├── front-matter.md
    │   ├── ch01-<short-slug>.md
    │   ├── ch02-<short-slug>.md
    │   └── back-matter.md
    ├── research/
    │   └── README.md      # Canonical evidence / provenance trail
    └── media/             # Cover art and figures (optional files)

Start a book by copying `books/_TEMPLATE/` on the Desk and renaming the copy.
The standard setup keeps Desk private by default, but a Desk may deliberately be
public or lower-profile. Repository visibility is separate from the `desk` role.

`reader.json` is presentation guidance, not manuscript content. It can recommend
a starting atmosphere, type treatment, measure, paragraph rhythm, and Pages or
Scroll mode. Readers can override those choices in their own browser without
editing the publication.

`research/` is publication content, but not automatically Reader narrative. It
holds the deeper source and provenance trail behind factual work. Its canonical
entry point is `research/README.md`; larger publications may add chapter notes,
methods, calculations, source ledgers, counterevidence, or release fact-checks.
See [Publication research](research.md).

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

**Research notes.** Keep `research/README.md` as the index. Other research
filenames should describe the claim, chapter, method, dataset, or check they
cover, for example `ch06-mortgage-lockin.md` or `release-review.md`. Bookself
does not require a second metadata database for research.

## The book README (hub)

Plain Markdown. No YAML front matter. An info table and a checkbox contents
list:

    # Title

    | | |
    |---|---|
    | **Authors**   | @username |
    | **Status**    | Drafting |
    | **Publisher** |  |
    | **Edition**   |  |
    | **Chapters**  | 1 of 12 drafted |

    ## Contents

    - [ ] [Front Matter](manuscript/front-matter.md)
    - [ ] [Ch 1 — Getting Started](manuscript/ch01-getting-started.md)
    - [ ] [Back Matter](manuscript/back-matter.md)

Tick boxes by editing `[ ]` to `[x]` (see the author guide). Update the
Chapters count when it drifts.

**Status** describes the publication copy in the repository where it lives.

- On a **Desk**, use `Drafting`, `Revision in progress`, or another non-published
  status while writing. List the working publication under the Desk root
  `## The books` inventory so the Publishing Desk can discover it. Open a proof
  directly at `reader/#/b/<slug>/`.
- On a **Shelf**, a released publication uses the exact status `Published` and
  the Shelf root `## The books` catalog links `books/<slug>/`. The normal
  Desk → Shelf release helper prepares those two public states together.

A Desk is private by default, not private by definition. An intentionally public
Desk is valid working history, but an unlisted file in a public repository is
still public. Shelf remains the canonical promoted release surface. See
[Bookself architecture](bookself.md) for the repository boundary.

Optional cover art: `media/cover.png` (or `.jpg` / `.webp`). The Reader
uses it on the generated cover. If it is missing, the Reader makes a cloth
cover from the title.

Optional hub rows the Reader understands if present: **Publisher**,
**Series**, **Tags**, **Edition**, **Language**, **ISBN**. Empty Publisher
is fine. Publisher filters the Shelf. Series draws a labelled stack.
Tags are comma-separated. In chapters, `[[ch03-publishing|Publishing]]`
jumps inside the Reader. Download Markdown or HTML from Type and tools —
the files, not a database dump.

## Manuscript

- One file per chapter.
- A chapter is a single `# Title` heading, then paragraphs. No metadata,
  no HTML comments, nothing an author has to understand beyond Markdown.
- Front matter holds the title page, a copyright line (`©` year author),
  and an optional dedication.
- Back matter holds epilogue, acknowledgments, and about-the-author —
  use `##` headings for those sections.
- Reader-facing evidence belongs here when readers need it in context: citations,
  footnotes, references, figures, or enough methodology to understand the claim.

## Research

The manuscript asks the reader to follow the work. `research/` lets a later
reader, reviewer, researcher, author, or agent inspect why factual claims were
made and how they should be updated.

For material sources, preserve source identity, date/version, URL or stable
identifier, access date for changing web sources, manuscript use, limitations,
counterevidence, and any calculations or transformations needed to reproduce a
derived claim. Mark fast-aging facts for recheck before release.

Research notes are not disposable agent scratchpads. Read the existing trail
before repeating searches, and leave enough context for the next person or agent
to continue without reconstructing the whole session.

A research trail is also not a source dump. Prefer links, bibliographic metadata,
lawful short quotations, hashes, and original notes. Put third-party files in
the publication only when redistribution is clearly authorized and provenance /
license information is preserved.

On Desk, research may move ahead of the released edition. On Shelf, the research
tree is frozen with the release snapshot until the next deliberate release.

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
