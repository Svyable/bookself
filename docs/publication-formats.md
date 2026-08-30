# Publication formats

Bookself can stay simple while publishing more than books. The underlying rule is the same in every case: **keep the source close to the thing being published**.

## Books

Copy `books/_TEMPLATE/` and write chapters as Markdown. A released book appears on the Shelf and opens in the full Reader.

## Screenplays, teleplays, and scripts

Copy `books/_SCREENPLAY_TEMPLATE/` or choose **Screenplay / teleplay** in the New Publication Studio. The script remains plain text in `manuscript/script.md`, using Bookself's deliberately small Fountain-compatible screenplay core for scene headings, action, character cues, dialogue, parentheticals, transitions, centered text, writer-room sections, and explicit page breaks.

The Reader recognizes `Format: Screenplay`, `Teleplay`, or `Script`, recommends the `screenplay` Reader preset, and exposes actor rehearsal controls. An actor can select a role, hide that role's dialogue without changing page geometry, reveal individual lines, and move cue by cue. Rehearsal state is browser-local and never edits the script.

See [Screenwriting with Bookself](screenwriting.md) for the source conventions, collaboration model, actor workflow, print behavior, and the deliberate boundary between Bookself's writing/rehearsal layer and production-locking tools.

## Papers, whitepapers, and research notes

Copy `books/_PAPER_TEMPLATE/` instead. The generic starter begins with the neutral `Format: Paper` label and uses the same publication folder and Git history as other Bookself work. Change the format to a more specific real form such as `Whitepaper`, `Research Paper`, `Preprint`, `Thesis`, or `Dissertation` when that better describes the publication. Paper metadata can include:

```md
| **Format** | Paper |
| **Venue**  | Optional venue or working-paper series |
| **DOI**    | Optional DOI |
```

The manuscript normally lives in one `manuscript/paper.md` file. Use `##` headings for sections such as Abstract, Methods, Results, Discussion, and References. Those headings become Reader navigation automatically.

A paper is still plain Markdown, so it remains readable without Bookself and reviewable line by line on GitHub.

`Thesis` and `Dissertation` use the same paper treatment. They keep their exact format label on the cover while reusing the scholarly Reader behavior rather than introducing another rendering engine.

### Academic apparatus

Books and papers can keep footnotes, simple citations and bibliography entries,
figure captions, and numbered equation references in ordinary Markdown. See
[Academic writing in Bookself](academic-writing.md) for the source conventions
and their deliberate first-layer limits.

### Mathematical notation

Papers and books may include LaTeX-style mathematics directly in Markdown. Inline `$...$` / `\(...\)`, display `$$...$$` / `\[...\]`, and common equation environments are rendered in Pages and Scroll while the TeX remains part of the source file.

See [LaTeX math in Bookself](latex.md) for supported delimiters, equation labels/references, security/fallback behavior, offline caching, the working example paper, and the boundary between build-free Markdown math and optional full `.tex` compilation.

## Magazines, newspapers, journals, newsletters, and other editions

A publication folder can represent more than a conventional book. Set the `Format` row in that publication's README and the Reader will label the object appropriately while keeping the same Markdown source and reading tools.

Recognized format families include:

- `Screenplay`, `Teleplay`, or `Script`
- `Magazine`, `Periodical`, or `Zine`
- `Newspaper` or `Gazette`
- `Journal`, `Proceedings`, or `Conference Proceedings`
- `Newsletter` or `Bulletin`
- `Comic` or `Graphic Novel`
- `Anthology`, `Collection`, `Chapbook`, `Poetry Collection`, or `Story Collection`
- `Report`, `Annual Report`, `Field Report`, `Manual`, `Handbook`, `Guide`, `Catalog` / `Catalogue`, `Pamphlet`, or `Brochure`
- `Thesis` or `Dissertation` using the paper treatment

The underscore-prefixed folders such as `books/_SCREENPLAY_TEMPLATE/`, `books/_MAGAZINE_TEMPLATE/`, and `books/_JOURNAL_TEMPLATE/` are **blank authoring templates, not public Reader examples**. The Reader intentionally does not put those starters on the Shelf. To preview a real script, issue, or edition, copy the appropriate template to a normal publication slug on the private Desk, replace its placeholder content and media, and list that publication in the Desk inventory. It should reach the public Shelf only through a deliberate release.

These are format families, not rigid schemas. Bookself keeps the author's exact `Format` label for display and maps related forms onto a small number of Reader treatments so the product does not grow a separate application for every publishing noun.

Periodical-style publications can add issue metadata without introducing a second configuration file:

```md
| **Format**           | Magazine |
| **Volume**           | 4 |
| **Issue**            | 2 |
| **Publication date** | 2026-08-24 |
| **Frequency**        | Quarterly |
| **ISSN**             | your assigned ISSN, if any |
```

The same fields also work for newspapers, journals, newsletters, and other serial publications. Omit anything that does not apply. Use an ISSN, ISBN, DOI, or other publication identifier only when it has actually been assigned to that work; do not copy example values or invent one for completeness. Bookself deliberately does not require a periodical database or build pipeline just to publish an issue.

## Author profiles and finding a publication elsewhere

A Bookself publication can link its authors and the work itself to the rest of the publishing ecosystem. These are ordinary HTTPS links stored in the publication README, so the author stays in control of the destination.

To make an author name linkable, use a normal Markdown link in `Authors`:

```md
| **Authors** | [Author Name](https://author.example/) |
```

Additional author identities can go in `Author Links`:

```md
| **Author Links** | [Goodreads](https://www.goodreads.com/author/example) · [ORCID](https://orcid.org/example) |
```

To help readers find a physical, ebook, audiobook, library, or retailer edition outside Bookself, add `Links` or `Find elsewhere`:

```md
| **ISBN** | your assigned ISBN, if any |
| **Links** | [Goodreads](https://www.goodreads.com/book/example) · [Amazon](https://www.amazon.com/example) · [WorldCat](https://search.worldcat.org/example) · [Open Library](https://openlibrary.org/example) |
```

You can also link a publisher catalog, an independent bookstore, a university library, the Library of Congress, an Internet Archive item, a DOI landing page, or another lawful source. Bookself does not generate affiliate links, scrape those services, or assume that one retailer or library is authoritative. It simply gives the publication a native place to expose author-selected destinations.

### Identifier fallbacks

Bookself can derive two conservative discovery links from standard identifiers:

- A checksum-valid 10- or 13-digit `ISBN` adds an **Open Library** link using Open Library's documented stable `/isbn/<ISBN>` route.
- A syntactically valid `DOI` adds a canonical **DOI** link at `https://doi.org/<DOI>`.

If `Find elsewhere` / `Links` already contains a link labeled `Open Library` or `DOI`, that explicit author-supplied destination wins and the fallback is not added.

Bookself intentionally does **not** synthesize Amazon product pages, Goodreads records, WorldCat records, Library of Congress records, or local-library holdings from an identifier. Those services can have multiple editions, changing URLs, regional availability, or no exact record at all. Put the real destination in `Find elsewhere` when you know it.

The Reader shows outbound destinations on the publication cover. Links open the original service in a new tab; Bookself remains the source of the Markdown edition it is hosting.

## Images and figures

Put image files in the publication's `media/` folder. PNG, JPG, WebP, and SVG are all appropriate.

### Publication cover art

To give a publication artwork on both its Shelf volume and Reader cover, put one image in `media/` named `cover.png`, `cover.jpg`, `cover.webp`, or `cover.jpeg`. The Reader discovers those names automatically; no README field or asset manifest is required.

Keep the cover inside the publication folder so it travels with the same Desk → Shelf snapshot as the manuscript. Other image filenames remain ordinary figures or page art and are not treated as the publication cover.

Reference manuscript images with ordinary Markdown:

```md
![A concise description of the figure](../media/figure-1.png)
```

Add a quoted Markdown image title when the image should have a visible figure
caption:

```md
![A concise description](../media/figure-1.png "Figure 1. A concise caption.")
```

That is the whole hosting workflow. The image is committed with the publication, versioned by Git, and served by the same GitHub Pages site as the Reader. There is no separate image account or asset database.

The Reader keeps images within the page, repaginates once dimensions are known, and lets readers open figures at a larger size. Good alt text remains important because it is used by assistive technology and as the expanded-image label.

## Web volumes

A website, app, documentation site, interactive essay, lab, or other web-native work can occupy a physical-looking volume on the Bookself Shelf without being copied into the repository.

Add one ordinary link to the root README:

```md
## The web shelf

- [Project name](https://example.com/) — A short optional note
```

The Reader binds that link visually as a book: it gets a deterministic cloth color, spine, paper block, WEB badge, title, domain, and optional note. Selecting the volume opens the original site in a new tab. The URL remains the source of truth.

Use this treatment when an external creation should feel like a durable object in the collection. It requires no publication folder, screenshot service, favicon fetch, metadata API, or build step.

## The stand

The stand is the lighter magazine treatment for external creations. It is useful for issues, features, experiments, timely links, and work that should feel more like something picked up from a newsstand than something bound on the Shelf.

Add a section to the root README:

```md
## The stand

- [Project name](https://example.com/) — A short optional note
- [Another creation](https://another.example/)
```

The Reader turns those lines into magazine-style cards that show the title and domain and open the original site in a new tab. The external site remains the source of truth.

## Why one system works for all of them

| Format | Source of truth | Reader behavior |
|---|---|---|
| Book | Markdown + media in a publication folder | Opens in Bookself Reader |
| Screenplay / teleplay / script | Fountain-compatible plain text + optional media in a publication folder | Screenplay typesetting + actor rehearsal controls |
| Whitepaper / thesis / dissertation | Markdown + media in a publication folder | Opens in Bookself Reader with paper labeling and citation metadata |
| Magazine / newspaper / journal / newsletter | Markdown + media in a publication folder | Opens in Bookself Reader with format and issue labeling |
| Comic / anthology / report / manual / catalog | Markdown + media in a publication folder | Opens in Bookself Reader with format labeling |
| Web volume | External website | Appears as a bound volume on the Shelf and opens the source |
| Stand link | External website | Appears as a magazine-style card and opens the source |

The format changes, but the publishing model does not: plain files when Bookself owns the work, ordinary links when it does not.
