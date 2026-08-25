# Publication Reader design

A Bookself publication can recommend how it should first feel in the Reader without taking control away from the person reading it.

Authors and book designers can add an optional `reader.json` beside a publication's `README.md`:

```text
books/my-book/
  README.md
  reader.json
  manuscript/
  media/
```

`reader.json` is publication data. It travels with the book through Git and through the normal Binder → Shelf release path. Reader personalization is different: it stays in that reader's browser storage and is never written back to `reader.json`, Markdown, Git, or another reader's device.

## The precedence rule

Bookself uses a simple ownership model:

1. **Bookself defaults** provide a safe baseline.
2. **Publication defaults** from `reader.json` express the author's or designer's recommendation.
3. **Reader personalization** wins when that reader changes the experience in their browser.

The publication can suggest. The reader decides.

A reader changing Literata to Atkinson Hyperlegible, increasing text to 26px, switching from parchment to high contrast, or choosing Scroll changes only that browser profile. It does not change the repository and cannot change another person's reading experience.

## Start with a named preset

For most publications, a named preset is the fastest authoring tool. Presets are ordinary Reader defaults, not locked themes. A reader can still change every setting.

```json
{
  "version": 1,
  "preset": "literary"
}
```

Available presets:

| Preset | Intended feel | Starting point |
|---|---|---|
| `book` | classic general book | ivory, Source Serif 4, paged, balanced measure |
| `literary` | warm literary fiction/nonfiction | parchment, Literata, generous leading, classic indent |
| `modern-essay` | crisp essay / web-native longform | porcelain, IBM Plex Sans, wide left-aligned scroll |
| `editorial` | magazine/report voice | linen, humanist sans, compact editorial rhythm |
| `poetry` | open poetic page | ivory, Georgia, airy wide scroll, no hyphenation |
| `night-story` | low-light narrative | midnight, Lora, narrow paged reading |
| `accessible` | clarity-first reading | high contrast, Atkinson Hyperlegible, 22px, narrow left-aligned scroll |
| `quiet-study` | calm study / course text | sage, Literata, narrow left-aligned scroll |

A preset can be fine-tuned with explicit values. Explicit values win over the preset:

```json
{
  "version": 1,
  "preset": "night-story",
  "typography": {
    "fontSize": 21,
    "measure": "balanced"
  }
}
```

This makes `reader.json` useful as both a quick authoring tool and a precise styling contract.

## Fully specified example

```json
{
  "version": 1,
  "appearance": {
    "theme": "ivory",
    "warmth": "off"
  },
  "typography": {
    "font": "literary",
    "fontSize": 19,
    "fontWeight": 400,
    "tracking": 0,
    "leading": 1.62,
    "measure": "balanced",
    "align": "justify",
    "paragraph": "normal",
    "indent": "gentle",
    "mode": "paged",
    "hyphens": "auto"
  }
}
```

All properties are optional. Omit anything you do not want to recommend.

## Appearance values

### `theme`

A publication may recommend one of Bookself's coordinated Reader atmospheres:

- light: `light`, `linen`, `porcelain`, `sage`, `lavender`
- warm: `ivory`, `sepia`, `rose`, `sand`
- night: `dark`, `slate`, `midnight`, `forest`, `ember`, `deep-sea`, `aubergine`
- accessibility: `contrast`, `contrast-dark`

Use a theme as a starting point, not as a brand requirement. Readers must remain free to select a palette that meets their vision, contrast, lighting, or sensory needs.

### `warmth`

Accepted values are:

- `off`
- `soft`
- `golden`

Warmth is an ambient tint layered on top of the atmosphere. Readers can turn it off or change it locally.

## Typography values

### `font`

Accepted values are the Reader's curated faces:

- `book` — Source Serif 4
- `literary` — Literata
- `warm` — Lora
- `classic` — Georgia
- `modern` — IBM Plex Sans
- `clear` — Atkinson Hyperlegible
- `humanist` — humanist system sans
- `system` — the reader's device UI font stack

### `fontSize`

Pixels from `14` through `32`. Values outside the supported range are clamped.

### `fontWeight`

`400`, `500`, or `600`.

### `tracking`

Letter spacing in `em`, from `-0.02` through `0.08`.

### `leading`

Line-height from `1.3` through `2.0`.

### `measure`

- `narrow`
- `balanced`
- `wide`

### `align`

- `left`
- `justify`

### `paragraph`

- `compact`
- `normal`
- `airy`

### `indent`

- `none`
- `gentle`
- `classic`

### `mode`

- `paged`
- `scroll`

### `hyphens`

- `auto`
- `off`

## Reader ownership and privacy

Bookself does not need an account, database, or server-side profile to remember Reader preferences. The existing reading controls persist in browser `localStorage` under the instance's `storagePrefix`.

The presentation layer adds only a small ownership marker that records whether the reader has personally changed:

- appearance; and/or
- typography.

That marker is local to the browser. It is not synchronized through Git, included in exported books, visible to authors, or sent to other readers.

Author defaults themselves are not persisted as reader choices. Bookself may drive the existing Reader controls to realize a publication recommendation, but it snapshots and restores the relevant browser-storage values while doing so. This prevents one book's recommended typeface, size, or atmosphere from leaking into a later session as though the reader had personally selected it.

Returning readers who already had saved appearance or typography before publication defaults existed are treated as having made personal choices, so an upgrade does not suddenly replace their familiar setup with an author's defaults.

If browser site data is cleared, the local personalization disappears and the publication recommendation becomes the starting point again.

## “Use this book's design”

The Reading experience panel exposes a **Use this book's design** action when the reader has personal overrides.

That action clears the local ownership markers and reapplies the current publication's recommendation. It does not edit the book and does not affect any other browser.

The settings panel also labels the current source of the experience. With named presets it can show the recommendation more specifically, for example:

- `Following Literary`
- `Your browser settings · book suggests Literary`
- `Your colors · Literary typography`
- `Literary colors · your typography`

This makes the author/reader boundary visible instead of implicit.

## For stylists

`reader.json` and instance `readerStyles` solve different problems:

- use **`reader.json`** for reader-adjustable recommended settings;
- use **`readerStyles`** in `imprint.json` for instance-owned CSS and visual systems.

A good reusable design usually uses both layers conservatively: style the semantic page surfaces with CSS, then recommend a compatible starting atmosphere and typography through `reader.json`.

Do not use custom CSS to fight Reader accessibility controls. In particular, avoid forcing fixed body sizes, low-contrast colors, mandatory justified text, or motion that defeats a reader's local preferences.

## Versioning

The current publication presentation schema is version `1`.

Unknown presets and values are ignored and out-of-range numeric values are clamped. A malformed or absent `reader.json` simply falls back to Bookself/reader defaults; it never prevents the book from opening.

## Validate before release

Run the normal dependency-free repository health check after editing or generating a presentation file:

```bash
python3 scripts/doctor.py
```

The doctor inspects every `books/*/reader.json` it finds, including publication templates. It reports malformed JSON, unsupported schema versions, unknown keys, invalid enum values, and wrong numeric shapes as errors. Values that the Reader can safely clamp—such as an oversized font size or excessive leading—are warnings so the author can see that the rendered result will differ from the file.

`reader.json` remains optional. A publication with no design recommendation does not produce an error.

## Offline behavior

`reader.json` is fetched like the rest of a publication. The service worker keeps successful same-origin reads in the Reader cache, so a publication design that has been opened can participate in later offline reading without adding a build step or external dependency.
