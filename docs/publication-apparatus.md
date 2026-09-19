# Publication apparatus

Bookself should let a publication become as scholarly, navigable, or richly
finished as the work requires without making every author adopt a heavyweight
document system.

The governing idea is simple:

**Describe meaning in the manuscript. Let editions decide geometry.**

Notes, citations, references, glossaries, appendices, indexes, credits, and
similar apparatus are parts of the work. Page breaks, margin width, popovers,
columns, and printed page numbers belong to a particular rendering or edition.
Keeping those layers separate lets one manuscript remain useful on a phone,
tablet, desktop, EPUB-like reflow, accessible large type, PDF, and print.

## Back matter is composable

`manuscript/back-matter.md` is a container, not a checklist. Authors should use
only the sections the publication actually needs. Common sections include:

- epilogue or afterword;
- notes or endnotes;
- references, works cited, sources, or bibliography;
- further reading;
- glossary or terminology;
- appendices;
- index, or specialized indexes for people, places, cases, concepts, works,
  symbols, recipes, species, statutes, or other domain-specific subjects;
- acknowledgments and credits;
- colophon, production note, or edition note;
- about the author or contributors.

The headings are intentionally ordinary Markdown. A Reader may eventually give
recognized sections richer navigation or presentation, but the publication must
remain coherent when rendered as plain Markdown or simple HTML.

Authors do not need to use every section, use these exact names, or put every
kind of apparatus in the same visual form. A trade book and a legal treatise can
share Bookself without pretending they should have identical back matter.

## Indexes are navigation, not pagination

A traditional print index often maps a term to page numbers because printed
pages are stable inside one edition. A reflowable digital edition is different:
font size, screen width, accessibility settings, and device geometry can all
change where a passage appears.

For Bookself's digital Reader, treat the durable destination as the important
part. An index entry may point to a chapter or other stable structural target
that exists independently of current pagination. For example:

```markdown
## Index

**Agency**
- institutional agency — [[ch03-institutions|Chapter 3]]
- machine agency — [[ch08-machines|Chapter 8]]

**Citations**
- responsive presentation — [[ch05-evidence|Chapter 5]]
- source identity — [[ch05-evidence|Chapter 5]]
```

This first layer is deliberately author-curated. Bookself does not currently
claim to scan prose for index terms, generate page ranges, infer subentries, or
produce a professional index automatically.

A future semantic indexing layer may add author markers, generated alphabetical
views, `see` / `see also` relationships, subentries, ranges, specialized indexes,
and export-specific locators. If it does, the semantic destination should remain
the source of truth. A fixed PDF or print renderer may then translate those
relationships into edition-specific page numbers after pagination is known.

## Glossaries and definitions

A glossary is also a semantic map. In the simplest form it is ordinary Markdown
in back matter:

```markdown
## Glossary

**Source offset.** A location in the manuscript source used to return a reader
to the same underlying passage without relying on displayed page geometry.

**Shelf.** The public repository that contains deliberately released publication
snapshots.
```

Future Reader behavior may make glossary terms tappable or expose definitions in
context. The plain-text definition remains the durable fallback.

## Notes, references, and bibliography

Notes answer a different reading need from bibliography entries, and Bookself
should not force them into one mechanism. An author may use inline links for
ordinary web destinations, parenthetical citations for scholarly attribution,
footnotes for local explanation, endnotes for material that would interrupt the
page, and a bibliography or sources section for recoverability.

The style may be Chicago, APA, MLA, Vancouver, Bluebook-like legal citation, an
author's own house style, or a deliberate mixture where the publication type
calls for it. Core Bookself preserves the relationship and readable source; it
does not currently impose or automatically normalize a universal citation style.

## Appendices and supplementary material

Appendices are appropriate for material that belongs to the publication but
would overload the main narrative: methods, proofs, tables, questionnaires,
chronologies, document excerpts within lawful quotation limits, technical
specifications, datasets described rather than copied, or other supporting
material.

Keep the same publication rule as elsewhere: if readers need it to understand
the released work, it belongs in the manuscript or other released publication
files. Deeper provenance, claim checks, calculations, and source ledgers belong
in `research/`.

## Graceful enhancement

New apparatus features should follow four constraints:

1. **Plain source first.** The manuscript remains understandable Markdown.
2. **Semantic identity first.** References target sources, concepts, sections,
   figures, notes, or other durable objects rather than temporary screen pages.
3. **Renderer freedom.** Phone, tablet, desktop, print, and accessible layouts
   may present the same semantic object differently.
4. **No mandatory compiler.** Richer presentation may be optional, but ordinary
   authoring, preview, release, and reading must preserve Bookself's local-first,
   no-build baseline.

A useful shorthand is:

**The author chooses structure. The renderer chooses geometry. The reader chooses comfort.**

That leaves Bookself room to become more elegant over time without making old
books obsolete or making new authors learn a publishing language before they
can write.
