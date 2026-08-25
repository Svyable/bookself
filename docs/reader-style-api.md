# Reader Style API v1

Bookself supports instance-owned Reader CSS without requiring an instance to fork shared `reader/` files. This document defines the small styling surface that reusable instance styles may rely on.

The goal is not to freeze the entire Reader DOM. The goal is to give downstream CSS enough stable semantic hooks to survive normal platform improvements.

## Detect the contract

When the imprint is applied, the Reader exposes the current contract version on the document root:

```css
html[data-bookself-style-api="1"] {
  /* This stylesheet targets Style API v1. */
}
```

The JavaScript constant is also exported as `READER_STYLE_API_VERSION` from `reader/js/imprint.js` for focused tests and tooling.

An additive new hook does not require a version change. Removing or changing the meaning of a hook documented as part of v1 requires a new Style API version.

## Supported state attributes

These state attributes are part of Style API v1:

| Hook | Meaning |
|---|---|
| `html[data-bookself-style-api="1"]` | Supported style-contract version |
| `html[data-bookself-role="platform|binder|shelf|instance"]` | Repository / instance role |
| `body[data-stage="binder|cover|read|end"]` | Current high-level Reader stage |
| `html[data-theme]` | Active reading atmosphere / paper palette |
| `html[data-reader-mode="paged|scroll"]` | Paged or continuous reading |
| `html[data-reader-font]` | Active reader typeface choice |
| `html[data-reader-measure="narrow|balanced|wide"]` | Reader line-measure preference |
| `html[data-reader-align="left|justify"]` | Paragraph alignment preference |
| `html[data-reader-paragraph="compact|normal|airy"]` | Paragraph rhythm preference |
| `html[data-reader-indent="none|gentle|classic"]` | First-line indent preference |
| `html[data-reader-hyphens="auto|off"]` | Hyphenation preference |

Values may grow additively. A downstream stylesheet should normally target the values it understands and let unfamiliar values inherit Bookself defaults.

## Supported semantic surfaces

The following selectors are stable semantic styling surfaces in v1.

### Library

- `.binder-view` — the library / binder screen
- `.binder-hero` — library introduction
- `.shelf` — a shelf of local publications
- `a.volume` — a publication volume
- `a.volume[data-publication-format]` — a shelf volume with parsed publication format metadata
- `.volume-cover`, `.volume-title`, `.volume-author`, `.volume-imprint` — cover anatomy on shelf volumes

### Cover

- `.book-stage` — book presentation area
- `.cover-page` — front-cover stage
- `.cover-front` — cover face
- `.cover-title`, `.cover-subtitle`, `.cover-author`, `.cover-imprint`, `.cover-meta` — cover typography
- `.back-cover` — end-of-book cover

### Paged reading

- `.pages-wrapper` — physical page/spread container
- `.page-surface` — one page
- `.page-inner` — rendered publication content on a page
- `.page-running` — running head
- `.page-num` — folio / page number
- `.gutter` — spread gutter

### Continuous reading

- `.scroll-reader` — scroll viewport
- `.scroll-document` — continuous publication content
- `.scroll-chapter` — chapter section in continuous mode
- `.scroll-block` — source-offset-preserving rendered Markdown block

These hooks describe roles, not exact nesting. Avoid selectors that depend on a precise chain such as `.app > main > div:nth-child(...)`.

## Supported design tokens

Style API v1 supports overriding these existing custom properties for instance presentation:

### Palette

```css
:root {
  --bg-primary: #0c0b0a;
  --bg-secondary: #161412;
  --bg-page: #1c1a17;
  --bg-elevated: #241f1a;
  --text-primary: #ede6d9;
  --text-secondary: #b7ad9e;
  --text-muted: #6e665c;
  --accent: #c4a265;
  --accent-dim: #8a7040;
  --accent-glow: rgba(196, 162, 101, 0.28);
  --border: #2a2a30;
  --shadow: rgba(0, 0, 0, 0.55);
  --header-bg: rgba(18, 18, 22, 0.75);
}
```

An active Bookself atmosphere may intentionally replace palette values. Instance styles that want to modify one particular atmosphere should combine their override with `html[data-theme="..."]` rather than fighting every theme globally.

### Typography roles

```css
:root {
  --font-display: Georgia, serif;
  --font-body: Georgia, serif;
  --font-ui: Georgia, serif;
  --font-accent: Georgia, serif;
}
```

These are presentation roles. Reader-controlled accessibility/type preferences remain reader preferences and may override body-copy details.

## Example

```css
html[data-bookself-style-api="1"] {
  --accent: #7b2639;
  --font-display: "Iowan Old Style", Georgia, serif;
}

html[data-bookself-role="shelf"] .binder-hero {
  max-width: 52rem;
}

body[data-stage="cover"] .cover-title {
  letter-spacing: 0.08em;
}

html[data-reader-mode="scroll"] .scroll-document {
  text-wrap: pretty;
}

a.volume[data-publication-format="paper"] .volume-title {
  letter-spacing: 0.08em;
}
```

## What is not part of v1

Unless listed above, a class, ID, inline style, generated wrapper, animation name, internal custom property, or DOM nesting detail should be treated as implementation detail.

In particular, do not build a reusable style pack around:

- `:nth-child()` positions in Reader chrome;
- generated settings-panel internals;
- page-turn animation implementation classes;
- private helper classes used only by one enhancement module;
- JavaScript function names that are not explicitly exported as an extension API.

If a useful semantic hook is missing, propose the smallest new hook upstream. That is preferable to copying or monkey-patching platform code.

## Reader preferences win where they should

Instance CSS should not defeat reader accessibility choices. Avoid hard-coding body text sizes, forced motion, low-contrast text, or layout assumptions that break large-print and narrow-measure settings.

A reusable style pack should be tested at minimum with:

- paged and continuous modes;
- a light and a dark atmosphere;
- narrow and wide reading measure;
- large text;
- reduced motion where animation is changed.

## Versioning policy

Style API v1 is intentionally small. Bookself may add new semantic hooks or custom properties without changing the version.

A future v2 is required before Bookself intentionally removes a v1 hook, renames it, or changes its documented semantic meaning. During a transition, the preferred approach is to expose old and new hooks together long enough for downstream styles to migrate.

This compatibility promise applies to the documented style API, not to every internal Reader selector.
