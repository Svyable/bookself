# Custom Reader styles

Bookself keeps `reader/` and `desk/` as shared platform software. Binder and Shelf instances should not fork those directories just to change typography, colors, spacing, or publication presentation.

For instance-specific Reader design, keep your CSS outside `reader/` and declare it in the instance-owned `imprint.json`.

## Minimal example

Create a repository-root file such as `styles/reader.css`:

```css
html[data-bookself-style-api="1"] {
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

For reusable styles, target the documented [Reader Style API v1](reader-style-api.md) rather than relying on incidental DOM nesting.

## Why the file belongs outside `reader/`

`scripts/sync-ui.sh` replaces `reader/` and `desk/` when platform UI is synchronized into a Binder or Shelf. Root files and other instance-owned paths are left alone.

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

## Validate locally

Run the dependency-free repository doctor after changing `readerStyles`:

```bash
python3 scripts/doctor.py
```

The doctor reports invalid `readerStyles` shapes, unsafe paths, too many configured stylesheets, and CSS files that are declared but missing from the repository. A valid configured stylesheet is also included in the healthy summary.

This check is intentionally local-first. It does not need npm, a browser automation stack, or GitHub Actions.

## What you can safely customize

Prefer the versioned Style API variables and semantic selectors over deeply nested implementation selectors. The API documents supported state attributes, reading surfaces, palette tokens, and typography-role tokens.

When a customization needs a stable hook that Bookself does not expose yet, propose the hook upstream instead of depending on a brittle DOM path. A small semantic hook is easier for every downstream instance to maintain than a copy of platform CSS.

## Portability expectations

Custom styles are an instance extension, not a new Bookself build system:

- plain books still work with no custom CSS;
- the Reader remains static browser software;
- authors do not need Node, npm, Sass, Tailwind, or a bundler;
- the Binder → Shelf release path remains local-first;
- `reader/` and `desk/` can stay byte-for-byte synchronized with the platform.

If you distribute a reusable design for other Bookself users, keep it as ordinary CSS plus a short README explaining which Style API version it targets.

## Trust model

A stylesheet can reference network resources using CSS features such as `url()` or `@import`. Only enable instance styles from repositories you trust. Bookself validates the configured stylesheet path, but it does not attempt to sandbox CSS contents.
