# Pack name

One sentence describing the reading experience this pack creates.

| | |
|---|---|
| **Reader Style API** | 1 |
| **Entry stylesheet** | `reader.css` |
| **Network dependencies** | None |
| **Specializes** | General books |

## Install

Copy this folder into your Bookself instance, for example as `styles/pack-name/`, then add the entry stylesheet to the instance-owned `imprint.json`:

```json
{
  "readerStyles": [
    "styles/pack-name/reader.css"
  ]
}
```

Do not copy the pack into `reader/`; shared Reader files are replaced during UI sync.

## Design intent

Explain the typographic, spatial, or atmospheric decisions the pack makes. Mention whether it is meant to be subtle, publication-specific, accessibility-oriented, or a full house style.

## Supported surfaces

List only the Style API v1 hooks this pack intentionally changes, for example:

- palette tokens;
- display typography roles;
- cover treatment;
- paged chapter openings;
- continuous reading measure.

## Compatibility notes

Describe any meaningful limitations. Test Pages and Scroll, light and dark atmospheres, narrow/wide measure, large text, and reduced motion when applicable.

## Assets and dependencies

List local assets and any network dependencies. Prefer repository-local assets and system/platform typefaces so the pack remains useful offline.
