# Open publishing

Bookself treats publishing as an open protocol around author-owned source files.

The manuscript is not an upload waiting to be trapped inside a platform. It is a durable publication source tree that can be rendered into many editions: web Reader, EPUB, paperback, hardcover, PDF, or a future format that does not exist yet.

The core model is deliberately small:

**work → edition → export**

- **Work** is the intellectual publication: manuscript, research, rights, metadata, media, and history.
- **Edition** is a production decision: Kindle reflowable, 6 × 9 paperback, 7 × 10 manual, hardcover case laminate, and so on.
- **Export** is a deterministic artifact built for a distributor, printer, reader, or archive.

Amazon KDP, IngramSpark, a local printer, and Bookself Reader are destinations. None of them should become the canonical source of the book.

## Source before format

Keep author-controlled source material under `books/<slug>/` and derive delivery files from it.

A sophisticated publication may use:

```text
books/<slug>/
├── README.md
├── manuscript/
├── research/
├── media/
├── cover/
│   ├── README.md
│   ├── cover.json
│   ├── front-source.png
│   ├── back-source.png
│   ├── author-photo.jpg
│   └── publisher-mark.svg
├── editions/
│   ├── kindle.json
│   ├── paperback-6x9.json
│   └── hardcover-6x9.json
├── reader.json
├── RIGHTS.md
└── rights.json
```

The source tree is inspectable, versioned, portable, and understandable without proprietary software.

## The important cover rule

**AI generates source media; Bookself performs publishing geometry.**

Do not ask an image model to guess a final paperback wrap, spine width, bleed, trim marks, or barcode placement. Those values depend on edition choices and, for print, often on the final page count and paper stock.

Prefer source artwork with:

- no baked-in title, subtitle, author name, price, barcode, trim marks, or printer template;
- enough clean space for deterministic typography;
- important visual subjects away from likely trim and fold regions;
- background imagery that can extend or crop gracefully;
- documented provenance, license, and generation prompt when appropriate;
- a source resolution comfortably above the final 300 ppi print target.

Bookself should then compose title, subtitle, author, spine copy, back-cover copy, publisher mark, ISBN/barcode reserve, bleed, safe zones, and printer-specific geometry from structured edition data.

## Open does not mean unowned

Bookself software and blank starters can be open source while a real book remains All Rights Reserved. Open publishing means the production method is inspectable and replaceable; it does not force authors to give away copyright in their manuscripts, illustrations, research, or cover art.

Keep publication rights in the publication's existing `RIGHTS.md` and `rights.json`. Record third-party or generated-media provenance separately rather than assuming that repository visibility grants reuse rights.

## A humane author interface

The eventual Desk workflow should stay simpler than the machinery underneath it:

1. **Book** — choose the work.
2. **Edition** — Kindle, paperback, hardcover, or another target.
3. **Cover** — choose or generate source artwork; Bookself shows the actual geometry.
4. **Preflight** — green/yellow/red checks for metadata, images, fonts, page count, trim, bleed, spine, and unsupported assets.
5. **Export** — produce the delivery file without altering the source work.

An author should not have to memorize printer equations to make a professional book. The equations should remain open, testable, and visible to people who want to inspect them.

## Portability principle

When a distributor changes a requirement, update an edition adapter or preset rather than rewriting the manuscript or throwing away cover artwork.

This is the practical promise of Bookself open publishing:

> Own the source. Describe the edition. Rebuild the artifact.

See [Covers and editions](covers-and-editions.md) for production conventions and current print/eBook guidance.