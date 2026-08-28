# Custom Reader styles

Bookself keeps `reader/` and `desk/` as shared platform software. Desk and Shelf instances should not fork those directories just to change typography, colors, spacing, or publication presentation.

For instance-specific Reader design, keep your CSS outside `reader/` and declare it in the instance-owned `imprint.json`.

## Minimal example

Create a repository-root file such as `styles/reader.css`:

```css
:root {
  --accent: #7b2639;
}

.page-inner,
.scroll-document {
  font-feature-settings: "liga" 1, "kern" 1;
}

body[data-stage="read"] .scroll-document {
  text-wrap: pretty;
}
```

Then add it to `imprint.json`:

```json
{
  "name": "My Shelf",
  "readerStyles": [
    "styles/reader.css"
  ]
}
```

The Reader loads instance styles after its shared platform styles, so ordinary CSS cascade rules can override Bookself defaults.

## Why the file belongs outside `reader/`

`scripts/sync-ui.sh` replaces `reader/` and `desk/` when platform UI is synchronized into a Desk or Shelf. Root files and other instance-owned paths are left alone.

A layout like this keeps the boundary explicit:

```text
imprint.json
styles/
  reader.css
reader/          # shared Bookself software
books/           # instance publications
```

That means a maintainer can pull a new Reader from Bookself without losing the instance design layer.

## Rules

`readerStyles` is optional. When present, it must be an array of repository-local CSS paths.

Bookself currently accepts:

- up to eight stylesheets;
- paths relative to the repository root;
- `.css` files only;
- duplicate paths once;
- `./styles/reader.css` as equivalent to `styles/reader.css`.

Bookself ignores:

- `http:` or `https:` stylesheet URLs;
- protocol-relative URLs;
- absolute paths;
- `..` parent-directory traversal;
- non-CSS files.

These constraints keep the extension seam portable and make an instance repository the source of truth for its presentation.

## What you can safely customize

Prefer stable Bookself variables and semantic selectors over deeply nested implementation selectors.

Useful variables include the existing color and type tokens such as:

```css
:root {
  --bg-page: #fffdf8;
  --text-primary: #201b18;
  --accent: #835f2f;
  --font-display: Georgia, serif;
}
```

Useful semantic surfaces include:

- `.page-surface` and `.page-inner` for paged reading;
- `.scroll-document` and `.scroll-chapter` for continuous reading;
- `.cover-page`, `.cover-front`, and `.cover-title` for covers;
- publication-format attributes and classes emitted by the Reader;
- atmosphere/theme data attributes on the document root.

When a customization needs a stable hook that Bookself does not expose yet, propose the hook upstream instead of depending on a brittle DOM path. A small semantic hook is easier for every downstream instance to maintain than a copy of platform CSS.

## Portability expectations

Custom styles are an instance extension, not a new Bookself build system:

- plain books still work with no custom CSS;
- the Reader remains static browser software;
- authors do not need Node, npm, Sass, Tailwind, or a bundler;
- the Desk → Shelf release path remains local-first;
- `reader/` and `desk/` can stay byte-for-byte synchronized with the platform.

If you distribute a reusable design for other Bookself users, keep it as ordinary CSS plus a short README explaining which stable variables and selectors it uses.

## Trust model

A stylesheet can reference network resources using CSS features such as `url()` or `@import`. Only enable instance styles from repositories you trust. Bookself validates the configured stylesheet path, but it does not attempt to sandbox CSS contents.
