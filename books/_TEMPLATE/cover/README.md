# Cover source

This folder holds **source material**, not a frozen printer wrap.

The durable rule is:

**AI or an illustrator creates source artwork. Bookself calculates the edition geometry.**

Do not put a final page-count-dependent paperback/hardcover wrap here as the only surviving source.

## Good source files

Add real files only when you have them, for example:

- `front-source.png` — high-resolution master artwork for the front;
- `back-source.png` — optional back-cover background/art;
- `wrap-source.png` — optional continuous back/spine/front artwork with no text;
- `author-photo.jpg` — optional, real and authorized;
- `publisher-mark.svg` — optional, real publisher/imprint mark.

Keep generated artwork free of title text, author text, ISBNs, barcodes, trim marks, fold guides, and fake endorsements. Those belong in deterministic composition.

## Prompt an image agent like this

Use the actual book concept, then add:

> Create high-resolution source artwork for a professional book cover. Do not render title text, subtitle text, author name, logos, price, barcode, trim marks, spine copy, or printer guides. Keep important subjects away from the edges and leave intentional negative space for later typography. Make the background capable of extending or cropping beyond the visible front cover so it can survive bleed and alternate trim sizes.

For continuous wrap source art:

> Create wide continuous source artwork that can span back cover, spine, and front cover. Do not place text or barcode elements. Keep critical detail away from the future spine/fold region. Treat the front-cover side as the primary focal area. Final spine width will be calculated after pagination.

## Provenance

Record enough in `cover.json` for another person or agent to understand where the art came from and whether it can be used for this publication. Do not claim rights you do not have.

See `../../../docs/covers-and-editions.md` for trim sizes, KDP geometry, industry guidance, and export preflight.