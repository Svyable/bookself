# Academic writing in Bookself

Bookself can carry the ordinary apparatus of a course text or research publication
without turning the manuscript into a TeX project. Footnotes, citations,
bibliography entries, figure captions, and numbered equations remain plain
Markdown and LaTeX-style notation in the same files as the prose.

This layer is intentionally smaller than a reference manager or a full TeX
compiler. The source stays readable in Git, the Reader adds publication
semantics, and the no-build writing path remains intact.

## References are semantic; pages are renderings

A digital Bookself publication does not have one permanent page geometry. The
same chapter can break differently on a phone, tablet, desktop, large-print
setting, or another Reader layout. Treat a Reader page as a view of the work,
not as the work's canonical coordinate system.

That gives Bookself a simple reference rule:

**Sources belong to the work. Pages belong to a rendering or edition.**

Use stable source relationships and structural locations for Bookself's own
content. The current Reader already routes notes and labeled equations through
chapter + source-offset semantics rather than depending on a displayed page
number. Future reference features should preserve that invariant: a citation
may look different in another layout without changing what source, note, claim,
figure, equation, or passage it refers to.

Page numbers still have an important legitimate use. If a citation points to a
fixed external edition of a book, journal, legal opinion, report, or other
paginated source, its page number is source metadata and should be preserved.
Likewise, a fixed-layout PDF or print edition of a Bookself publication may have
edition-specific page references after pagination is known. Do not turn those
output-specific page numbers into the stable internal identity of reflowable
Bookself text.

Authors also do **not** need to choose one citation interface for an entire
publication. A book or paper may mix ordinary Markdown hyperlinks, simple
bibliography citations, footnotes, explanatory notes, methodology, and a
reference section when those forms serve different reading needs. Consistency
of scholarly style is an author or editor policy; Bookself should not require a
single visual mechanism merely because the work has one source model.

This distinction also leaves room for responsive citation presentation. A
future renderer might present the same semantic note as a compact marker on a
phone, a side note on a wide display, an endnote in a reflowable export, or a
footnote in a fixed-layout edition. That adaptive behavior is a design
invariant, not a claim about features implemented by the current Reader. The
current Markdown forms below remain explicit and author-controlled.

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

The key (`progit`) connects the citation to the definition. In the current
Reader, the text after the vertical bar is exactly what the reader sees inside
the parenthetical citation. Think of that visible label as presentation, not as
the source's permanent identity: the key and definition carry the relationship,
while an author may choose a different visible form where another reading
context calls for it.

This keeps citation style explicit and editable instead of pretending Bookself
has chosen a universal scholarly style. It also means an author can use a
parenthetical citation for one source, a direct Markdown hyperlink for another,
and a footnote for an explanatory source note without violating a platform
rule. A publication may still adopt Chicago, APA, MLA, legal, numbered, or
another consistent house style when that convention matters.

This is **not** CSL, BibTeX, or Biber. Bookself does not currently parse `.bib`
files, normalize author names, sort a bibliography, automatically restyle
citations, or choose citation presentation from screen width. Those capabilities
belong to a later optional scholarly-tooling layer if they can be added without
making core publishing depend on them.

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
When they are added, prefer stable structural or semantic targets over generated
page numbers so the same relationship survives reflow and alternate editions.

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
