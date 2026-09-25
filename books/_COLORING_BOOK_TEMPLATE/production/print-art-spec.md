# Print-art acceptance specification

Use this as a project-specific supplement to the shared target profile. The target's current specification wins when the two disagree.

## Working target

- Trim: 8.5 × 11 inches, portrait.
- Interior: black ink on white paper.
- Bleed: none unless the manifest is deliberately changed.
- Page count: record the final paginated count; do not guess it for cover geometry.
- Scene pages: odd/right pages, with mostly blank reverses when `layout.blankReverse` is true.

At 300 PPI, a trim-size raster is 2550 × 3300 pixels before any bleed allowance. This is a production baseline, not permission to enlarge a small candidate or change DPI metadata.

## Scene gate

A scene may move from candidate to keeper/print only when the source and review record establish:

1. genuine resolution and suitable line-art construction;
2. large open regions appropriate to the intended audience;
3. continuous important outlines and no accidental gray fill;
4. essential content inside the chosen safe zone;
5. clean, intentional composition with no generation or editing debris;
6. a traceable relationship to the approved scene brief and character/reference model;
7. provenance sufficient for the rightsholder's distribution and AI disclosures.

Record actual binary dimensions and effective resolution at placed size. Do not label a file `print` because its metadata says 300 DPI.
