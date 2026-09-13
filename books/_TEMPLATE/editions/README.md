# Editions

An edition describes how this work should become a particular digital or physical book.

The publication remains the source of truth. These files are production intent, not uploaded artifacts.

Starter examples:

- `kindle.json` — reflowable EPUB for Amazon KDP;
- `paperback-6x9.json` — 6 × 9 perfect-bound paperback;
- `hardcover-6x9.json` — 6 × 9 case-laminate hardcover.

Copy or rename an edition file when you deliberately want another trim, binding, paper, or target. Do not mutate the manuscript just to satisfy one printer.

`pageCount` stays `null` until the interior is actually paginated. Final print-cover geometry must not be guessed before then.

The shared human/machine preset data lives at `../../../publishing/edition-presets.json`. Current production guidance lives at `../../../docs/covers-and-editions.md`.

A future Desk Publication Studio can read these files to calculate trim, bleed, spine, safe zones, cover geometry, and preflight checks while keeping the author-facing workflow simple.