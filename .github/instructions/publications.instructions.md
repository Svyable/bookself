---
applyTo: "books/**/*.md"
---

# Bookself publication instructions

When editing a Bookself publication:

- Read the root `AGENTS.md` first.
- Read that publication's `README.md` before changing manuscript prose.
- Read `research/README.md` before repeating research or changing a material factual claim. If the publication predates the canonical research component, add it when the task naturally involves research rather than fabricating provenance retroactively.
- If the publication has a `REVIEW.md`, read it for active questions and review state.
- Preserve the author's voice, tense, rhythm, and local structure. Do not rewrite neighboring prose merely to make it sound more uniform.
- Keep one numbered chapter per pull request unless a human explicitly asks for broader manuscript work.
- When adding, renaming, or removing a chapter, update the publication README contents/count in the same change.
- When starting a new publication, use the matching underscore-prefixed starter under `books/` (`_TEMPLATE`, `_PAPER_TEMPLATE`, `_MAGAZINE_TEMPLATE`, `_NEWSPAPER_TEMPLATE`, `_JOURNAL_TEMPLATE`, `_NEWSLETTER_TEMPLATE`, `_ANTHOLOGY_TEMPLATE`, `_REPORT_TEMPLATE`, `_MANUAL_TEMPLATE`, or `_COMIC_TEMPLATE`). Copy it to a normal lowercase-hyphenated slug on the Desk, replace the placeholders there, preserve `research/README.md`, and keep `Status: Drafting` until a deliberate Desk → Shelf release.
- Preserve the format-specific README metadata supplied by that starter. Serial publications may use `Volume`, `Issue`, `Publication date`, `Frequency`, and `ISSN`; scholarly publications may use `Venue` and `DOI`. Omit fields that do not apply, and do not invent identifiers, dates, or publication claims.
- When evidence materially informs the manuscript, leave durable provenance in `research/`: source identity, date/version, URL or stable identifier, access date for changing web sources, manuscript use, limitations, counterevidence, calculations, and recheck-before-release notes as relevant.
- Distinguish what a source establishes from what the publication infers. Do not turn estimates into facts, association into causation, one paper into consensus, or a baseline into a prediction merely to strengthen the prose.
- Promote reader-relevant evidence into manuscript citations, footnotes, references, figures, methodology, or back matter. Keep the deeper source ledger, claim checks, alternatives, calculations, and release review in `research/`.
- Treat research notes as durable publication context, not hidden chain-of-thought or conversational transcripts. Leave concise evidence and provenance another human or agent can verify and continue.
- Do not use `research/` as a source dump. Prefer links, bibliographic metadata, lawful short quotations, hashes, and original notes. Include third-party files only when redistribution is clearly authorized and preserve source/license provenance.
- Keep manuscript and research source plain and portable. Do not add a required CMS, database, hosted build, or CI dependency.
- Treat Reader notes as personal reading notes; use issues/review threads for shared editorial feedback, `research/` for publication evidence/provenance, and pull requests/diffs for proposed source changes.
- Preview the changed publication in the Reader when practical. For a draft, preserve Draft/Proof state rather than silently marking it Published.
- Recheck material fast-aging claims before a deliberate release.
- Do not move or copy unfinished work onto a public Shelf unless the human explicitly intends a release. A deliberately public/lower-profile Desk is still public working history, but it is not the canonical Shelf release surface.

For the recursive public specimen under `books/making-bookself/`, inspect its `REVIEW.md` and public review thread before proposing an exploratory improvement. It is intentionally public for teaching. Real Desks are private by default, but Bookself also supports deliberately public/lower-profile authoring; never confuse obscurity with privacy.
