# Publication formats

Bookself can stay simple while publishing more than books. The underlying rule is the same in every case: **keep the source close to the thing being published**.

## Books

Copy `books/_TEMPLATE/` and write chapters as Markdown. A published book appears on the shelf and opens in the full reader.

## Whitepapers and research notes

Copy `books/_PAPER_TEMPLATE/` instead. A paper uses the same publication folder and Git history, but its README adds:

```md
| **Format** | Whitepaper |
| **Venue**  | Optional venue or working-paper series |
| **DOI**    | Optional DOI |
```

The manuscript normally lives in one `manuscript/paper.md` file. Use `##` headings for sections such as Abstract, Methods, Results, Discussion, and References. Those headings become reader navigation automatically.

A paper is still plain Markdown, so it remains readable without Bookself and reviewable line by line on GitHub.

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

- `Magazine`, `Periodical`, or `Zine`
- `Newspaper` or `Gazette`
- `Journal`
- `Newsletter` or `Bulletin`
- `Comic` or `Graphic Novel`
- `Anthology` or `Collection`
- `Report`

Periodical-style publications can add issue metadata without introducing a second configuration file:

```md
| **Format**           | Magazine |
| **Volume**           | 4 |
| **Issue**            | 2 |
| **Publication date** | 2026-08-24 |
| **Frequency**        | Quarterly |
| **ISSN**             | 1234-5678 |
```

The same fields also work for newspapers, journals, newsletters, and other serial publications. Omit anything that does not apply. Bookself deliberately does not require a periodical database or build pipeline just to publish an issue.

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
| **ISBN** | 978-0-000000-00-0 |
| **Links** | [Goodreads](https://www.goodreads.com/book/example) · [Amazon](https://www.amazon.com/example) · [WorldCat](https://search.worldcat.org/example) · [Open Library](https://openlibrary.org/example) |
```

You can also link a publisher catalog, an independent bookstore, a university library, the Library of Congress, an Internet Archive item, a DOI landing page, or another lawful source. Bookself does not generate affiliate links, scrape those services, or assume that one retailer or library is authoritative. It simply gives the publication a native place to expose author-selected destinations.

The Reader shows those outbound destinations on the publication cover. Links open the original service in a new tab; Bookself remains the source of the Markdown edition it is hosting.

## Images and figures

Put image files in the publication's `media/` folder. PNG, JPG, WebP, and SVG are all appropriate.

Reference them from a manuscript with ordinary Markdown:

```md
![A concise description of the figure](../media/figure-1.png)
```

Add a quoted Markdown image title when the image should have a visible figure
caption:

```md
![A concise description](../media/figure-1.png "Figure 1. A concise caption.")
```

That is the whole hosting workflow. The image is committed with the publication, versioned by Git, and served by the same GitHub Pages site as the reader. There is no separate image account or asset database.

The reader keeps images within the page, repaginates once dimensions are known, and lets readers open figures at a larger size. Good alt text remains important because it is used by assistive technology and as the expanded-image label.

## Web volumes

A website, app, documentation site, interactive essay, lab, or other web-native work can occupy a physical-looking volume on the Bookself shelf without being copied into the repository.

Add one ordinary link to the root README:

```md
## The web shelf

- [Project name](https://example.com/) — A short optional note
```

The reader binds that link visually as a book: it gets a deterministic cloth color, spine, paper block, WEB badge, title, domain, and optional note. Selecting the volume opens the original site in a new tab. The URL remains the source of truth.

Use this treatment when an external creation should feel like a durable object in the collection. It requires no publication folder, screenshot service, favicon fetch, metadata API, or build step.

## The stand

The stand is the lighter magazine treatment for external creations. It is useful for issues, features, experiments, timely links, and work that should feel more like something picked up from a newsstand than something bound on the shelf.

Add a section to the root README:

```md
## The stand

- [Project name](https://example.com/) — A short optional note
- [Another creation](https://another.example/)
```

The reader turns those lines into magazine-style cards that show the title and domain and open the original site in a new tab. The external site remains the source of truth.

## Why one system works for all of them

| Format | Source of truth | Reader behavior |
|---|---|---|
| Book | Markdown + media in a publication folder | Opens in Bookself reader |
| Whitepaper | Markdown + media in a publication folder | Opens in Bookself reader with paper labeling and citation metadata |
| Magazine / newspaper / journal / newsletter | Markdown + media in a publication folder | Opens in Bookself reader with format and issue labeling |
| Comic / anthology / report | Markdown + media in a publication folder | Opens in Bookself reader with format labeling |
| Web volume | External website | Appears as a bound volume on the shelf and opens the source |
| Stand link | External website | Appears as a magazine-style card and opens the source |

The format changes, but the publishing model does not: plain files when Bookself owns the work, ordinary links when it does not.
