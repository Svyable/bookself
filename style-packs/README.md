# Bookself Reader style packs

A Bookself style pack is deliberately small: **ordinary CSS plus documentation**, targeting a documented Reader Style API version.

There is no package manager, registry, build step, or runtime plugin loader. A pack is copied into an instance repository and enabled through that instance's `imprint.json`.

## Pack layout

A reusable pack should use this shape:

```text
my-pack/
  README.md
  reader.css
  assets/        # optional local images or other CSS assets
```

Start from [`_TEMPLATE/`](_TEMPLATE/).

A pack may contain more than one stylesheet when that makes the design easier to maintain, but it should expose one obvious entry stylesheet for installation.

## Install a pack

Copy the pack into an instance-owned path outside the shared `reader/` directory, for example:

```text
styles/
  my-pack/
    README.md
    reader.css
```

Then enable its entry stylesheet in `imprint.json`:

```json
{
  "readerStyles": [
    "styles/my-pack/reader.css"
  ]
}
```

Bookself loads the stylesheet after the shared Reader styles. The instance keeps ownership of the copied pack while `scripts/sync-ui.sh` remains free to replace `reader/` and `desk/` from the platform.

## Compatibility contract

Every reusable pack should declare the Reader Style API version it targets in its README.

For current packs:

```text
Reader Style API: 1
```

Target only hooks documented in [`../docs/reader-style-api.md`](../docs/reader-style-api.md). Internal Reader selectors may change without a Style API version change.

A pack may support multiple API versions when it can do so cleanly. Prefer selectors scoped by the version marker:

```css
html[data-bookself-style-api="1"] {
  --accent: #7b2639;
}
```

## Portable-pack expectations

A reusable pack should:

- remain plain CSS; no Sass, PostCSS, Tailwind, npm, or generated bundle is required;
- work when copied into a Binder or Shelf repository;
- avoid changing or depending on shared `reader/` files;
- use repository-relative assets when assets are needed;
- document any network dependency such as a remote font or image;
- avoid remote dependencies when practical so local/offline reading remains useful;
- preserve reader-controlled large text, reading measure, contrast, and reduced-motion behavior;
- avoid embedding secrets, analytics credentials, or instance identity in the pack;
- state any publication formats or atmospheres it intentionally specializes.

## Minimum manual test matrix

Before publishing a pack for others, check at least:

- Pages and Scroll reading modes;
- a light and dark atmosphere;
- narrow and wide reading measure;
- large text;
- a long chapter title;
- a chapter with lists, links, blockquotes, and media if the pack styles them;
- reduced motion if the pack changes animation.

The pack README should note meaningful limitations rather than hiding them behind browser-specific CSS.

## Multiple packs and overrides

`readerStyles` is ordered. Later stylesheets can override earlier ones through the normal CSS cascade:

```json
{
  "readerStyles": [
    "styles/base-house-style/reader.css",
    "styles/accessibility-overrides/reader.css"
  ]
}
```

Keep layering intentional. If two packs both try to own the same design tokens, document the expected order.

## Contributing a pack to Bookself

The platform's `style-packs/` directory is for reusable examples and templates, not instance branding. A contributed pack should be generally useful, target a documented Style API, contain no private assets or credentials, and explain what experience it is trying to create.

Do not modify shared Reader code merely to make one pack work. If a reusable pack needs a missing semantic hook, propose that hook upstream as a small Reader API change first.
