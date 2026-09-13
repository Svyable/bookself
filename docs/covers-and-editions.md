# Covers and editions

Bookself keeps **source media** separate from **edition geometry**.

That separation is the whole trick. An image model is good at making visual material. It should not be asked to guess spine width, bleed, trim, barcode placement, page-count-dependent wrap geometry, or printer-specific safe zones. Bookself can calculate those deterministically once the edition is known.

This document describes the portable Bookself contract and records current Amazon KDP / industry production guidance. External platform rules change; the source book should not have to.

**Last external-spec review:** 2026-09-12.

## The three layers

### 1. Work

The work is the book itself: manuscript, research, rights, metadata, and durable media.

### 2. Edition

An edition chooses a physical or digital manifestation: reflowable Kindle EPUB, 5.5 × 8.5 paperback, 6 × 9 paperback, 7 × 10 manual, 6 × 9 case-laminate hardcover, and so on.

Edition files live under `books/<slug>/editions/` and should describe intent rather than contain printer-generated coordinates.

### 3. Export

An export is the disposable delivery artifact: `.epub`, interior PDF, paperback cover PDF, hardcover cover PDF, JPEG storefront cover, or another printer/distributor file.

Exports can always be rebuilt from source + edition data.

## Source-media contract for covers

Use `books/<slug>/cover/` for cover-production source material.

Recommended files:

```text
cover/
├── README.md
├── cover.json
├── front-source.png
├── back-source.png          # optional
├── author-photo.jpg         # optional
└── publisher-mark.svg       # optional
```

Do **not** require a finished wrap image as source. Paperback and hardcover wraps depend on final page count and binding geometry.

### What to ask an image-generation agent for

For the main visual artwork, ask for a clean source image rather than a finished cover:

> Create high-resolution source artwork for the front cover of this book. Do not render title text, subtitle text, author name, logos, price, barcode, trim marks, spine copy, or printer guides. Keep important subjects away from the edges and leave intentional negative space where Bookself can later typeset the title and author. Make the background capable of extending or cropping beyond the visible front cover so the artwork can survive bleed and multiple trim sizes.

Then give the agent the book-specific visual brief: subject, period, mood, palette, symbolism, realism/stylization, exclusions, audience, and comparison covers if the author has rights to use them as reference.

For a wraparound concept, ask for **continuous artwork**, not a final wrap:

> Create a wide continuous background/source composition that can span back cover, spine, and front cover. Do not place text or a barcode. Keep critical subjects on the front-cover side and avoid critical detail near the future spine/fold zone. The final spine width and wrap geometry will be calculated later from the print edition.

### Source-resolution rule

Generate source artwork larger than the final use whenever practical. Print exports should target at least **300 pixels per inch at final placed size**. Keep the highest-quality source; derive smaller storefront images from it.

For a 6 × 9 inch front cover, 300 ppi corresponds to 1800 × 2700 pixels before bleed. A useful source target is therefore at least that large, and preferably larger if the artwork may be recropped for other editions.

Do not rely on DPI metadata alone. Pixel dimensions divided by intended physical size determine effective print resolution.

## Kindle / reflowable eBook cover

Amazon KDP currently asks for a separate eBook marketing-cover image in JPEG or TIFF. Its stated ideal is **1600 × 2560 px** (width × height), approximately a 1:1.6 ratio, RGB, under 50 MB. KDP lists minimum dimensions of 625 × 1000 px and maximum dimensions of 10,000 px on either side, and recommends high-resolution source imagery. See:

- https://kdp.amazon.com/en_US/help/topic/G200645690

Bookself recommendation:

- keep `cover/front-source.*` as the master;
- derive the KDP storefront JPEG from it;
- preserve text as deterministic composition where possible rather than baking text into generated artwork;
- test the cover at thumbnail size as well as full size.

## Paperback trim sizes — current KDP US set

KDP currently lists these paperback trim sizes for Amazon.com. Availability and page-count limits vary by ink/paper combination.

| Trim (in) | Metric | Notes |
|---|---:|---|
| 5 × 8 | 127 × 203.2 mm | regular |
| 5.06 × 7.81 | 128.5 × 198.4 mm | regular |
| 5.25 × 8 | 133.4 × 203.2 mm | regular |
| 5.5 × 8.5 | 139.7 × 215.9 mm | regular |
| 6 × 9 | 152.4 × 228.6 mm | KDP default / very common |
| 6.14 × 9.21 | 156 × 233.9 mm | large trim |
| 6.69 × 9.61 | 169.9 × 244.1 mm | large trim |
| 7 × 10 | 177.8 × 254 mm | large trim |
| 7.44 × 9.69 | 189 × 246.1 mm | large trim |
| 7.5 × 9.25 | 190.5 × 235 mm | large trim |
| 8 × 10 | 203.2 × 254 mm | large trim |
| 8.25 × 6 | 209.6 × 152.4 mm | landscape |
| 8.25 × 8.25 | 209.6 × 209.6 mm | square |
| 8.5 × 8.5 | 215.9 × 215.9 mm | square |
| 8.5 × 11 | 215.9 × 279.4 mm | large / workbook |
| 8.27 × 11.69 | 210 × 297 mm | A4 |

KDP also supports custom paperback trim within **4–8.5 inches wide** and **6–11.69 inches high**, subject to its current production rules. KDP classifies a book as large trim when width exceeds 6.12 inches or height exceeds 9 inches.

Current page-count ranges depend on paper and ink. For many listed sizes, black/white paper supports 24–828 pages, cream 24–776, groundwood 24–812, standard color 72–600, and premium color 24–828; larger square/letter/A4 formats have narrower maxima. Always validate the chosen edition against the current KDP table before final export.

Source:

- https://kdp.amazon.com/en_US/help/topic/GVBQ3CMEQW3W2VL6

## Hardcover trim sizes — current KDP US set

KDP currently lists five case-laminate hardcover trims:

| Trim (in) | Metric | Current page range |
|---|---:|---:|
| 5.5 × 8.5 | 139.7 × 215.9 mm | 75–550 |
| 6 × 9 | 152.4 × 228.6 mm | 75–550 |
| 6.14 × 9.21 | 156 × 233.9 mm | 75–550 |
| 7 × 10 | 177.8 × 254 mm | 75–550 |
| 8.25 × 11 | 209.6 × 279.4 mm | 75–550 |

KDP hardcover is case laminate, not a dust-jacket workflow. Standard color is not currently offered for KDP hardcover; black/white on white or cream and premium color on white are supported in the current table.

Sources:

- https://kdp.amazon.com/en_US/help/topic/G201834180
- https://kdp.amazon.com/en_US/help/topic/GDTKFJPNQCBTMRV6

## Bookself genre/use presets

These are **Bookself recommendations**, not printer mandates. They are meant to give authors a sane first choice while preserving a custom option.

| Preset | Trim | Typical use |
|---|---:|---|
| compact | 5 × 8 | poetry, spiritual, compact literary work |
| trade-small | 5.25 × 8 | memoir, self-help, mystery/thriller |
| trade | 5.5 × 8.5 | nonfiction, literary fiction, YA |
| trade-large | 6 × 9 | general fiction/nonfiction, business, technical |
| academic | 6.14 × 9.21 | academic/European trade feel |
| reference | 7 × 10 | manuals, reference, technical books |
| visual | 8 × 10 | image-forward books, workbooks |
| square-small | 8.25 × 8.25 | visual/children's formats |
| square | 8.5 × 8.5 | children's/visual formats |
| letter | 8.5 × 11 | workbook, textbook, reference |
| a4 | 8.27 × 11.69 | reports/manuals where A4 is appropriate |

IngramSpark's current trim guidance supports paperback ranges up to 8.5 × 11 on white paper and hardcover ranges up to 8.5 × 11 on white paper, with smaller maxima for cream/groundwood. Its current file guidance also uses 0.125 inch bleed and recommends 300 ppi cover assets. This makes the Bookself presets intentionally useful beyond one vendor.

Sources:

- https://www.ingramspark.com/plan-your-book/print/trim-sizes
- https://www.ingramspark.com/hubfs/downloads/file-creation-guide.pdf

## Paperback cover geometry — KDP

KDP requires 0.125 inch (3.2 mm) bleed around paperback covers.

For a perfect-bound paperback:

```text
cover width  = 0.125 + back trim width + spine width + front trim width + 0.125
cover height = 0.125 + trim height + 0.125
```

Current KDP spine-width multipliers:

| Interior | Spine inches per page |
|---|---:|
| black/white, white paper | 0.002252 |
| black/white, cream paper | 0.002500 |
| black/white, groundwood | 0.002350 |
| premium color | 0.002347 |
| standard color | use current KDP calculator/spec; current cover guide also lists 0.002252 |

KDP currently prints spine text only above 79 pages. Spine text should retain at least 0.0625 inch (1.6 mm) between text and either spine edge, and the design should tolerate binding variance around fold lines.

Keep non-bleed cover content at least 0.25 inch (6.4 mm) from the outside cover edge.

Sources:

- https://kdp.amazon.com/en_US/help/topic/G201857950
- https://kdp.amazon.com/en_US/help/topic/G201953020

For production, prefer KDP's own cover calculator/template as the final authority for a specific page count and paper choice:

- https://kdp.amazon.com/cover-calculator

Bookself should calculate a preview itself, then compare/validate against the platform template rather than treating hand-entered constants as eternal truth.

## Hardcover cover geometry — KDP

Hardcover geometry is not paperback geometry with a wider spine. KDP case laminate currently requires a **0.51 inch (15 mm) wrap** beyond the front/back board edge. KDP also describes a 0.4 inch (10 mm) hinge zone near the spine and requires important text/images to remain at least 0.635 inch (16 mm) from the outer edge of the cover file.

Do not generate a hardcover wrap until binding type, trim, paper/ink, and final page count are known. Use the current KDP cover calculator/template for the final case dimensions.

Source:

- https://kdp.amazon.com/en_US/help/topic/GDTKFJPNQCBTMRV6

## Interior bleed and margins — KDP

All KDP covers require bleed. Print interiors only need bleed when content reaches the edge, but if one interior page requires bleed, the entire interior is treated as a bleed file and should be submitted as PDF.

For KDP interiors with bleed:

```text
page width  = trim width + 0.125 in
page height = trim height + 0.250 in
```

The 0.125 inch is added to the outside edge; 0.125 inch is added to both top and bottom.

Current KDP minimum inside margins by page count:

| Pages | Inside/gutter minimum |
|---:|---:|
| 24–150 | 0.375 in |
| 151–300 | 0.500 in |
| 301–500 | 0.625 in |
| 501–700 | 0.750 in |
| 701–828 | 0.875 in |

Current outside minimum is 0.25 inch without bleed and 0.375 inch with bleed.

Source:

- https://kdp.amazon.com/en_US/help/topic/GVBQ3CMEQW3W2VL6

## Print file expectations

Current KDP print guidance includes:

- cover upload as one PDF containing back + spine + front for print;
- at least 300 dpi images for print;
- embedded fonts/images;
- flattened transparencies/layers;
- no crop/trim marks, comments, annotations, invisible objects, placeholder text, or printer-guide furniture in submitted files;
- PDF required for interiors containing bleed;
- proofing in KDP's Print Previewer before publication.

Source:

- https://kdp.amazon.com/en_US/help/topic/G201857950

IngramSpark currently expects print covers as separate PDFs, 300 ppi, CMYK, 0.125 inch bleed for standard covers, and recommends approximately 0.25 inch type safety. This is useful cross-platform discipline even where KDP accepts somewhat different production choices.

## Color strategy

Keep generated/source artwork in a high-quality RGB master unless the author has a color-managed print workflow and understands the consequences of committing only a CMYK derivative.

Then:

- derive RGB JPEG/TIFF for Kindle/storefront use;
- derive the printer-specific PDF with the color profile expected by that printer;
- preserve the original master so a different printer can be targeted later.

Do not make a printer's current CMYK conversion the only surviving cover source.

## Barcode strategy

Reserve space; do not generate fake barcode art.

ISBN assignment and barcode generation are deterministic metadata operations. A source-art generator should leave a quiet area on the back when requested. The final export can place the actual barcode or leave the platform's reserved barcode area according to the destination workflow.

## Agent preflight for cover generation

Before generating source art, an agent should know:

1. title and subtitle;
2. author/pen name;
3. genre / shelf context;
4. intended audience;
5. primary visual idea and forbidden clichés;
6. target edition family (eBook only, trade print, visual print, etc.);
7. whether front-only or continuous wrap source art is wanted;
8. whether author/publisher already owns logos, photos, illustrations, or trademarks that must be incorporated later;
9. rights/provenance requirements for generated or third-party material.

The agent does **not** need final spine width to create front source art.

Before final print export, Bookself should know:

1. exact trim size;
2. binding;
3. final page count;
4. paper/ink choice;
5. bleed choice for the interior;
6. title/subtitle/author typography;
7. back-cover copy;
8. ISBN/barcode policy;
9. cover finish;
10. target platform/profile.

## Preflight philosophy

A future Desk Publication Studio should show checks in three levels:

- **green** — deterministic requirement satisfied;
- **yellow** — allowed but worth human judgment (for example unusually low contrast or a genre-atypical trim);
- **red** — export would violate a known target constraint.

Do not hide platform arithmetic. Show authors the derived width, height, spine, bleed, safe zones, effective image resolution, and the source rule used to calculate each value.

## Source-of-truth rule

External platform documentation is authoritative for upload acceptance. Bookself presets are convenience data and must carry a reviewed date. When Bookself and a live printer template disagree, stop export or warn clearly and prefer the printer's current specification.

The point of an open publishing stack is not to freeze today's Amazon rules forever. It is to make those rules replaceable without sacrificing the book.