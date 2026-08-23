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

### Mathematical notation

Papers and books may include LaTeX-style mathematics directly in Markdown. Inline `$...$` / `\(...\)`, display `$$...$$` / `\[...\]`, and common equation environments are rendered in Pages and Scroll while the TeX remains part of the source file.

See [LaTeX math in Bookself](latex.md) for supported delimiters, security/fallback behavior, offline caching, the working example paper, and the boundary between build-free Markdown math and future full `.tex` compilation.

## Images and figures

Put image files in the publication's `media/` folder. PNG, JPG, WebP, and SVG are all appropriate.

Reference them from a manuscript with ordinary Markdown:

```md
![A concise description of the figure](../media/figure-1.png)
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

## Why one system works for all four

| Format | Source of truth | Reader behavior |
|---|---|---|
| Book | Markdown + media in a publication folder | Opens in Bookself reader |
| Whitepaper | Markdown + media in a publication folder | Opens in Bookself reader with paper labeling and citation metadata |
| Web volume | External website | Appears as a bound volume on the shelf and opens the source |
| Stand link | External website | Appears as a magazine-style card and opens the source |

The format changes, but the publishing model does not: plain files when Bookself owns the work, ordinary links when it does not.
