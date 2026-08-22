# AGENTS.md

Rules for AI agents working in this repository.

## Scope

- Do only what was asked. Do not rewrite neighboring chapters, "clean up"
  prose, or reformat files you were not told to touch.
- One chapter per pull request. If a task spans books or chapters, stop and
  split the work.
- When you add, rename, or remove a chapter, update that book's README
  table of contents and the Chapters count in the same change.
- When you add a book, add its slug to the Book dropdown in
  `.github/ISSUE_TEMPLATE/chapter-feedback.yml` in the same change.

## Voice

- Preserve the author's voice, tense, and rhythm. Match the surrounding
  sentences, not a house style you brought with you.
- Do not substitute synonyms "for clarity" unless the author asked for that.
- Do not add headings, lists, or emphasis the surrounding chapter does not
  already use.

## Markdown

- Chapters are a single `# Title` heading, then paragraphs. No YAML front
  matter. No HTML comments in chapter files.
- Book READMEs are an info table plus a checkbox table of contents. No YAML
  front matter.
- Follow existing naming: `books/<slug>/`, `chNN-slug.md`, `front-matter.md`,
  `back-matter.md`.
- Images live in that book's `media/` folder and are referenced with
  relative links (`![alt](../media/figure-1.png)`).

## Do not

- Do not touch `LICENSE` or change licensing without the repository owner's
  explicit approval.
- Do not reformat a file wholesale (line wrapping, heading levels, quote
  style) as a drive-by.
- Do not add a build step, GitHub Pages, CODEOWNERS, or branch protection
  unless a human asked for that by name.
- Do not commit secrets, credentials, or unpublished manuscripts copied from
  outside this repository.
