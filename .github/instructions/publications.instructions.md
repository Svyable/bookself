---
applyTo: "books/**/*.md"
---

# Bookself publication instructions

When editing a Bookself publication:

- Read the root `AGENTS.md` first.
- Read that publication's `README.md` before changing manuscript prose.
- If the publication has a `REVIEW.md`, read it for active questions and review state.
- Preserve the author's voice, tense, rhythm, and local structure. Do not rewrite neighboring prose merely to make it sound more uniform.
- Keep one numbered chapter per pull request unless a human explicitly asks for broader manuscript work.
- When adding, renaming, or removing a chapter, update the publication README contents/count in the same change.
- When starting a new publication, use the matching underscore-prefixed starter under `books/` (`_TEMPLATE`, `_PAPER_TEMPLATE`, `_MAGAZINE_TEMPLATE`, `_NEWSPAPER_TEMPLATE`, `_JOURNAL_TEMPLATE`, `_NEWSLETTER_TEMPLATE`, `_ANTHOLOGY_TEMPLATE`, `_REPORT_TEMPLATE`, `_MANUAL_TEMPLATE`, or `_COMIC_TEMPLATE`). Copy it to a normal lowercase-hyphenated slug in the private Binder, replace the placeholders there, and keep `Status: Drafting` until a deliberate Binder → Shelf release.
- Keep manuscript source plain and portable. Do not add a required CMS, database, hosted build, or CI dependency.
- Treat Reader notes as personal reading notes; use issues/review threads for shared editorial feedback and pull requests/diffs for proposed source changes.
- Preview the changed publication in the Reader when practical. For a draft, preserve Draft/Proof state rather than silently marking it Published.
- Do not move or copy unfinished work into a public Shelf unless the human explicitly intends a release.

For the recursive public specimen under `books/making-bookself/`, inspect its `REVIEW.md` and public review thread before proposing an exploratory improvement. It is intentionally public for teaching; it does not change the rule that real Binders should be private.