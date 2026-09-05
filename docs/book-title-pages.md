# Book titles and title pages

Bookself books should feel like editions of the same publishing system without erasing each book's individual voice. The title layer is therefore deliberately small and predictable.

## Display title

Use the same display title in the publication `README.md` and in the manuscript front matter.

- Use normal title case rather than whole-title all caps.
- Keep conventional internal small words lowercase when they are not the first or last word: *a, an, and, as, at, but, by, for, from, in, of, on, or, the, to, with*.
- Preserve real acronyms and intentional proper-name casing.
- When a subtitle is displayed on its own line, omit a trailing colon from the title.
- Do not rename the publication slug merely to change display typography.

## Publication README

The reader-facing metadata page starts with the title, then an optional subtitle, then the information table:

```md
# Your Book Title

*Optional Subtitle Goes Here*

| | |
|---|---|
| **Authors** | Your Name |
| **Status** | Drafting |
```

Omit the subtitle line entirely when the book has no subtitle. Do not use a `##` heading for a subtitle; section headings are reserved for real document sections.

## Manuscript front matter

Use this order:

```md
# Your Book Title

*Optional Subtitle Goes Here*

**Your Name**

© YEAR Your Name. All Rights Reserved.

---

## Dedication

...
```

The subtitle is optional. A copyright line is publication metadata: preserve an existing line exactly unless the rightsholder deliberately changes it, and do not invent a year, owner, registration status, or license grant.

After the divider, the book may keep whatever opening material fits it: dedication, epigraph, author's note, preface, introduction, or other front matter. Alignment applies to the title-page stack, not to the book's voice.

## Existing books

Mechanical cleanup should be conservative: normalize the title-page structure and obvious casing inconsistencies, but do not rewrite subtitles, dedications, epigraphs, or prose simply to make books sound alike.
