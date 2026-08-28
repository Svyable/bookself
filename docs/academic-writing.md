# Academic writing in Bookself

Bookself can carry the ordinary apparatus of a course text or research publication
without turning the manuscript into a TeX project. Footnotes, citations,
bibliography entries, figure captions, and numbered equations remain plain
Markdown and LaTeX-style notation in the same files as the prose.

This layer is intentionally smaller than a reference manager or a full TeX
compiler. The source stays readable in Git, the Reader adds publication
semantics, and the no-build writing path remains intact.

## Footnotes

Put a footnote marker where the note belongs:

```markdown
A released course text can stay stable while the next edition changes privately.[^edition]
```

Define it elsewhere in the same chapter:

```markdown
[^edition]: In this first layer, keep a footnote definition on one Markdown paragraph.
```

Bookself numbers footnotes by first use in that chapter. Selecting the marker
in the Reader follows the existing chapter/source-offset route to the note, so
Pages and Scroll agree about where it lives.

Footnote keys are author-facing identifiers. Choose short, stable names such as
`edition`, `method`, or `sample-size`; the reader-facing number is generated.

## Citations and bibliography entries

A simple citation uses an author-controlled visible label:

```markdown
Git makes a useful distinction between a working tree and a committed snapshot
[@progit|Chacon and Straub, 2014].
```

Define the bibliography entry in the same chapter, normally under a
`## References` heading:

```markdown
[@progit]: Chacon, Scott, and Ben Straub. *Pro Git*. Second edition. Apress, 2014.
```

The key (`progit`) connects the citation to the definition. The text after the
vertical bar is exactly what the reader sees inside the parenthetical citation.
This keeps citation style explicit and editable instead of pretending Bookself
has chosen a universal scholarly style.

This is **not** CSL, BibTeX, or Biber. Bookself does not currently parse `.bib`
files, normalize author names, sort a bibliography, or automatically restyle
citations. Those capabilities belong to a later optional scholarly-tooling
layer if they can be added without making core publishing depend on them.

## Figure captions

Ordinary Markdown images continue to work exactly as before:

```markdown
![Revision loop](../media/revision-loop.svg)
```

To make an image a semantic figure with a caption, add a quoted Markdown image
title:

```markdown
![Revision loop](../media/revision-loop.svg "Figure 1. A private revision loop ending in a deliberate public release.")
```

The text inside `![...]` is the image's alternative text. Write it so a reader
who cannot see the figure still gets the visual information needed to follow
the surrounding argument. The quoted title is the visible caption, so it may
identify or contextualize the figure without merely repeating the alt text.

Bookself preserves that Markdown alt text on the rendered `<img>` and renders
the quoted title as a `<figcaption>`. The image still lives beside the
publication in `media/`, travels through Git with the prose that explains it,
and uses the existing responsive image and zoom behavior.

Caption numbering is author-controlled in this first layer. That is deliberate:
a figure can be called `Figure 1`, `Figure 3.2`, or left unnumbered without a
new document model hiding behind Markdown.

## Numbered equations and cross-references

A display equation becomes numbered when it carries a LaTeX-style label:

```latex
$$
R = D + F
\label{eq:revision-load}
$$
```

Refer back to it with:

```latex
The relationship in \eqref{eq:revision-load} separates drafting work from the
released edition.
```

Labeled display equations are numbered sequentially **within the chapter**.
The `\label{...}` command is Bookself metadata: it is removed before the TeX is
sent to KaTeX, while the Reader keeps the label, equation number, and source
offset on the rendered equation wrapper. `\eqref{...}` therefore follows the
same source-offset navigation model as the rest of Bookself.

Use one `\label{...}` per display block. Unlabeled display math remains
unnumbered. A missing reference is shown visibly as `(?)` rather than silently
pointing somewhere incorrect.

For the supported math delimiters and environments, see
[LaTeX math in Bookself](latex.md).

## Current reference boundary

The first academic layer keeps references chapter-local. A footnote, simple
bibliography citation, or `\eqref` should point to a definition or labeled
equation in the same Markdown chapter file.

That boundary preserves the Reader's existing chapter + source-offset routing
without creating a hidden book-wide compilation database. Cross-chapter
reference registries can be considered later if real publications need them.

## What this does not turn Bookself into

Core Bookself still does not require:

- a `.bib` parser or bibliography daemon;
- a CSL citation-style engine;
- TeX document classes or package installation;
- `\input` / `\include` project compilation;
- TikZ compilation;
- a server-side TeX service;
- a hosted build job;
- a canonical PDF artifact before a publication can be read.

A future full-TeX path should be an **optional Desk capability** for authors
who need a real TeX project and canonical compiled output. It must complement,
not replace, the Markdown-first Bookself path. A professor writing a normal
course text should still be able to clone the Desk years from now and work
with Git, Markdown, a browser, and local Python without needing a hosted
pipeline.

## A working textbook example

`books/bookself-101/` is the place to exercise these conventions as a real
academic text. Its academic-apparatus chapter demonstrates the syntax in the
same Reader students would use, rather than documenting a feature that the
example publication never touches.
