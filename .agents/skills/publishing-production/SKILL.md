---
name: publishing-production
description: Prepare Bookself editions, cover source media, print geometry, and distributor-ready exports without surrendering the publication source to a proprietary platform. Use for cover generation, edition setup, KDP/Ingram print preparation, export preflight, ISBN/barcode placement, and media-production tasks.
---

# Publishing production

## Purpose

Turn an author-owned Bookself work into professional digital and print editions while preserving a rebuildable source tree.

This skill is subordinate to explicit author instructions, repository-level `AGENTS.md`, publication rights files, and current printer/distributor requirements.

Read `docs/open-publishing.md`, `docs/covers-and-editions.md`, and `publishing/edition-presets.json` before making production decisions.

## Core rule

**Generate source media; calculate production geometry.**

Do not ask an image model to guess a final paperback or hardcover wrap. Do not bake page-count-dependent spine widths, trim guides, barcode boxes, or printer marks into generative artwork.

An agent may generate or commission:

- front-cover master artwork;
- continuous wraparound source artwork;
- back-cover texture/background;
- ornamental elements;
- author or publisher assets when authorized.

Bookself or another deterministic layout step should place:

- title and subtitle;
- author name;
- spine text;
- back-cover copy;
- publisher mark;
- ISBN/barcode;
- trim/bleed/safe geometry;
- platform-specific wrap dimensions.

## Before generating cover artwork

Read enough of the book to understand what the cover is actually about. At minimum inspect the publication README, front matter, synopsis/description if present, and enough manuscript to avoid a generic genre pastiche.

Resolve these inputs when available:

1. title and subtitle;
2. author/pen name;
3. genre / shelf context;
4. audience;
5. intended emotional promise;
6. central visual concept;
7. clichés or motifs to avoid;
8. edition family: eBook only, trade print, large-format visual, etc.;
9. front-only vs continuous-wrap source art;
10. source/provenance and rights constraints.

Do not block source-art generation merely because final page count is unknown. Page count is required for the final print wrap, not for a front-cover master.

## Image-generation brief

Default to a brief like this, adapted to the actual book:

> Create high-resolution source artwork for a professional book cover. Do not render title text, subtitle text, author name, logos, price, barcode, trim marks, spine copy, or printer guides. Keep important subjects away from the edges and leave intentional negative space for later typography. Make the background capable of extending or cropping beyond the visible front cover so it can survive bleed and alternate trim sizes. The final cover geometry will be composed deterministically from the Bookself edition specification.

For a continuous wrap:

> Create wide continuous source artwork that can span back cover, spine, and front cover. Do not place text or barcode elements. Keep critical visual detail away from the future spine/fold region. Treat the front-cover side as the primary focal area. Final spine width and wrap geometry will be calculated after pagination.

Then add the author's actual art direction.

## Source file discipline

Prefer `books/<slug>/cover/` for production sources and `books/<slug>/media/` for reader-facing in-book assets.

A cover source should be:

- high-resolution enough for at least 300 ppi at intended print size;
- saved at the highest useful quality;
- free of printer guides and fake barcodes;
- accompanied by prompt/provenance notes when generated;
- licensed or owned for the intended use;
- preserved independently of any one printer's CMYK/PDF conversion.

Do not delete or overwrite the best source merely because a delivery derivative exists.

## Edition selection

Use `publishing/edition-presets.json` as convenience data, not eternal law. For a target printer, verify live platform requirements before final export when web access is available.

A good default sequence is:

- general trade fiction/nonfiction: 5.5 × 8.5 or 6 × 9;
- compact literary/memoir/self-help: 5 × 8 or 5.25 × 8;
- academic/technical: 6 × 9, 6.14 × 9.21, or 7 × 10;
- workbook/reference: 8 × 10 or 8.5 × 11;
- visual/children's: square or larger format as the actual content requires.

Never choose a trim merely because it is available. Consider genre expectations, line length, page count, image needs, production cost, and whether the edition should share interior geometry with a hardcover.

## Print-cover sequence

Do not finalize a print wrap until these are known:

1. binding;
2. trim size;
3. final interior page count;
4. ink/paper choice;
5. target platform;
6. ISBN/barcode policy;
7. back-cover copy;
8. cover finish.

Then:

1. calculate platform-specific spine/wrap geometry;
2. verify against the platform's current calculator/template where available;
3. compose front, spine, back, typography, and barcode reserve;
4. check safe areas and effective image resolution;
5. export the target PDF/profile;
6. run platform preview/preflight;
7. order a physical proof for print when practical.

## Digital-cover sequence

For reflowable EPUB/Kindle:

1. derive a clean portrait cover from the master artwork;
2. preserve legibility at thumbnail size;
3. use RGB;
4. follow current storefront pixel/file constraints;
5. embed/associate the cover in the EPUB and keep the marketing-cover derivative reproducible.

## Never do these by default

- Do not let a generated image contain invented ISBNs, publisher marks, review blurbs, endorsements, awards, or trademarked badges.
- Do not invent an author photo.
- Do not copy a living artist's recognizable style when the user only needs broad art direction; describe visual properties instead.
- Do not use a third-party image merely because it appears in web search. Confirm licensing/provenance.
- Do not claim a printer-ready file is compliant without checking the current target requirements.
- Do not make KDP, IngramSpark, Adobe, Canva, Word, or another vendor the canonical source of the book.

## Preflight result

When reviewing an edition, report findings as:

- **green** — deterministic requirement satisfied;
- **yellow** — technically allowed but needs judgment;
- **red** — known target constraint is violated.

Show the calculation behind a red or yellow production warning. Prefer objective gates over human-review ceremony.

## Completion standard

A publishing-production task is complete when another agent or human can answer:

- Which source files created this edition?
- Which edition specification was used?
- Which platform profile and reviewed date governed the geometry?
- What was generated vs typeset/calculated?
- Where did artwork and third-party assets come from?
- Can the artifact be rebuilt without the original proprietary application?

If not, leave better source/provenance files before calling the edition finished.