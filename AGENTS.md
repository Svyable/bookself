# AGENTS.md

Rules for AI agents working in this repository.

## Scope

- Do only what was asked. Do not rewrite neighboring chapters, "clean up"
  prose, or reformat files you were not told to touch.
- One chapter per pull request. If a task spans books or chapters, stop and
  split the work.
- When you add, rename, or remove a chapter, update that book's README
  table of contents and the Chapters count in the same change.
- Do not put book prose in `reader/` or `desk/`. Authors and agents edit
  Markdown under `books/<slug>/`.
- Public source is not permission for unrestricted reuse. Read and preserve the
  applicable root and per-publication `RIGHTS.md` files before changing a real
  publication.

## Architecture: Bookself, Desk, Shelf, Reader

Bookself is the whole product/ecosystem. It deliberately separates portable
software from user-owned writing and releases:

- **Bookself upstream / `platform` role** — this repository; source of truth for
  shared software, templates, docs, and neutral demos
- **Desk / `desk` role** — private authoring instance; unpublished manuscripts
  and the next revision of published books live here
- **Shelf / `shelf` role** — public publishing instance; deliberately released
  manuscript snapshots live here
- **Reader** — the reading interface, shared by Desk proofs and Shelf releases

Desk and Shelf are separate Git repositories with separate histories. A release
copies a publication snapshot from Desk to Shelf. It is not a live reference,
submodule, symlink, shared branch, or runtime dependency on the private
repository. After release, the two copies are independent until the next
release.

Current authoring instances use `role: "desk"`.

Shared UI consists of **both** `reader/` and `desk/`. Those directories must
remain byte-for-byte aligned across the upstream platform, Desk, and Shelf after
sync.

Instance-owned files are never overwritten by UI sync:
- `books/`
- root `README.md`
- `imprint.json`
- instance-specific collaboration/configuration files

After changing anything under `reader/` or `desk/`:

```bash
scripts/sync-ui.sh
```

With no arguments, sibling `../desk` and `../shelf` are synced when present.
Explicit destination paths are also accepted. Commit each instance separately.
`scripts/sync-reader.sh` is only a compatibility alias for `sync-ui.sh`.

Do not hard-code a person, organization, repository name, Shelf URL, or Desk URL
into shared `reader/` or `desk/` code. Instance identity belongs in
`imprint.json`. Platform defaults must remain portable.

## Local-first publishing invariant

Bookself must not require CI/CD to write, preview, release, or read a
publication. The complete private-Desk workflow must work with zero GitHub
Actions minutes.

The required publishing path is deliberately small: Git + Markdown + a browser,
with Python's standard library for the release helper. GitHub Actions, hosted
runners, PR checks, and other automation may be added as optional conveniences,
but they must never become a prerequisite for the Desk → Shelf release path.

GitHub Pages is a static public delivery surface for Shelf, not a required
Actions-based build pipeline. Do not replace the no-build Reader with a hosted
build step unless a human explicitly asks to change that architecture.

## Rights, copyright, and external AI

Bookself separates open software from author-owned publication content.

- Framework code, docs, shared UI, scripts, and underscore-prefixed blank
  publication starters are MIT licensed.
- A real `books/<slug>/` publication is **All Rights Reserved by default** unless
  its own `RIGHTS.md` expressly grants another license.
- A public repository or public Reader URL does not turn a manuscript into open
  source or grant a general right to republish, adapt, commercialize, train on,
  or ingest it into generative systems.
- Publication README rows such as `Rights`, `AI use`, and `Rights file` are
  rights metadata. Preserve them unless the rightsholder explicitly asks for a
  licensing change.
- The default Bookself rights posture reserves model training/fine-tuning,
  RAG/grounding, AI-specific indexing, synthetic narration/translation, and
  other generative reuse. It does not purport to override uses independently
  permitted by applicable law.
- Do not copy a manuscript into a new external dataset, service, model-training
  pipeline, vector store, RAG corpus, or publishing platform merely because it
  is convenient. A human must explicitly authorize a new external use that may
  grant, expose, or sublicense publication rights.
- Accessing repository text to perform the requested Bookself task is not a
  license to retain, republish, train on, or reuse that text for unrelated work.
- Hosting-provider terms are a separate rights layer. Do not claim that
  `RIGHTS.md`, RSL, TDMRep, `robots.txt`, or another machine signal cancels
  permissions the author separately granted the host by contract.
- Rights notices and machine-readable reservations are not secrecy controls.
  Confidential work must remain behind actual access control.

Read `RIGHTS.md` and `docs/rights-and-ai.md` for the current product policy. When
releasing a publication, its publication-specific rights file is part of the
publication snapshot and should travel with the manuscript.

## Voice

- For book, essay, narrative, or other voice-sensitive prose tasks, read and apply
  `.agents/skills/human-prose/SKILL.md` before drafting, reviewing, or editing.
- Preserve the author's voice, tense, and rhythm. Match the surrounding
  sentences, not a house style you brought with you.
- Do not substitute synonyms "for clarity" unless the author asked for that.
- Do not add headings, lists, or emphasis the surrounding chapter does not
  already use.

## Markdown

- Book chapters use one `# Title` heading, then prose. Whitepapers and research
  notes may also use `##` section headings inside their manuscript file so the
  Reader can expose Abstract, Methods, Results, Discussion, and References in
  the table of contents. No YAML front matter. No HTML comments in manuscript
  files.
- Publication READMEs use the info-table/contents shape supplied by their chosen
  starter and preserve format-specific metadata when applicable. Books may use
  fields such as `Series` and `ISBN`; serials may use `Volume`, `Issue`,
  `Publication date`, `Frequency`, and `ISSN`; scholarly works may use `Venue`
  and `DOI`. Rights rows are publication data too. Omit fields that do not apply
  and never invent identifiers, dates, ownership, license grants, or publication
  claims.
- Follow existing naming: `books/<slug>/`, `chNN-slug.md`, `front-matter.md`,
  `back-matter.md`. Whitepapers normally use one `manuscript/paper.md` file.
- Images live in that publication's `media/` folder and are referenced with
  relative links (`![alt](../media/figure-1.png)`). PNG, JPG, WebP, and SVG are
  all appropriate Reader assets. A quoted Markdown image title on a standalone
  image becomes its figure caption, for example
  `![alt](../media/figure-1.png "Figure 1. Caption.")`.
- Footnotes use a marker such as `[^method]` and a same-chapter definition such
  as `[^method]: Note text.`. Keep first-layer footnote definitions to one
  Markdown paragraph.
- Simple citations use `[@source|Visible author-year label]` with a same-chapter
  bibliography definition such as `[@source]: Full reference.`. The visible
  label and bibliography style are author-controlled; core Bookself does not
  pretend to be a CSL or BibTeX style engine.
- LaTeX-style math may be embedded directly in Markdown. Use `$...$` or
  `\(...\)` for inline math; use `$$...$$`, `\[...\]`, or the display
  environments `equation`, `align`, `alignat`, and `gather` (including starred
  forms) for display math. Put literal TeX examples in code spans/fences.
- A display equation with one `\label{...}` is numbered chapter-locally and can
  be referenced later in that same chapter with `\eqref{...}`. Do not claim
  book-wide TeX reference semantics unless the Reader actually gains a
  book-wide reference registry.
- See `docs/academic-writing.md` for the scholarly Markdown conventions and
  `docs/latex.md` for mathematical notation.
- The current academic/math layer is not a full `.tex` compiler. Do not
  introduce document classes, package installation, `.bib` parsing,
  BibTeX/Biber, CSL, TikZ, or a required build step unless the task explicitly
  advances the optional full-TeX workflow.
- External creations do not need a publication folder. Put durable sites/apps
  under root `## The web shelf` to render them as bound Shelf volumes. Put
  lighter links under root `## The stand` to render magazine-style cards.
  Both forms open the external source and keep that URL as the source of truth.

## Do not

- Do not touch `LICENSE`, root `RIGHTS.md`, or a publication's `RIGHTS.md`, or
  change licensing/AI-use grants, without the rightsholder's explicit approval.
- Do not reformat a file wholesale as a drive-by.
- Do not add a build step, CODEOWNERS, or branch protection unless a human
  asked for that by name.
- Do not make private-Desk publishing depend on GitHub Actions, CI runners,
  hosted build artifacts, or paid automation minutes. Optional CI must remain
  optional to the complete authoring and release lifecycle.
- Do not change GitHub Pages source away from the repository root, or add a
  custom domain, unless a human asked.
- Do not commit secrets, credentials, or unpublished manuscripts copied from
  outside this repository.
- Do not revise the next edition of a published book on the public Shelf by
  default. Keep the released Shelf snapshot stable and revise the Desk copy.
  A live public hotfix or public proof requires explicit human intent.

## Verbs (author and agent)

These are the public lifecycle. Each manuscript change is Markdown (and maybe
`media/`).

**Start a book.** Copy `books/_TEMPLATE/` to `books/<slug>/`. Fill title,
authors, `Status: Drafting`, and replace the rights placeholders in
`RIGHTS.md`. On a private Desk, also list the manuscript under root **The books**
so the local Publishing Desk can discover it.

**Start a paper.** Copy `books/_PAPER_TEMPLATE/` to `books/<slug>/`. Fill title,
authors, optional venue / DOI, replace the rights placeholders, and keep
`Status: Drafting` while the work is in progress. The same Git history, review,
media, preview, and release flow applies. Use
[docs/academic-writing.md](docs/academic-writing.md) for citations, footnotes,
figures, and references, and [docs/latex.md](docs/latex.md) when the paper
contains mathematical notation.

**Start another publication format.** Choose the closest blank starter under
`books/`: `_MAGAZINE_TEMPLATE`, `_NEWSPAPER_TEMPLATE`, `_JOURNAL_TEMPLATE`,
`_NEWSLETTER_TEMPLATE`, `_ANTHOLOGY_TEMPLATE`, `_REPORT_TEMPLATE`,
`_MANUAL_TEMPLATE`, or `_COMIC_TEMPLATE`. Copy it to a normal lowercase,
hyphenated `books/<slug>/` folder on the private Desk, replace the placeholder
metadata and rights notice, and keep `Status: Drafting` until a deliberate
Desk → Shelf release. Use [docs/publication-formats.md](docs/publication-formats.md)
when choosing between format families. Do not publish or edit the
underscore-prefixed starter itself.

**Add a web volume.** Under root `## The web shelf`, add one Markdown link such
as `- [Project name](https://example.com/) — a short optional note`. The Reader
binds the link visually as a book while the linked website remains the source
of truth.

**Add to the stand.** Under root `## The stand`, add one Markdown link such as
`- [Project name](https://example.com/) — a short optional note`. The linked
site remains the source of truth; Bookself presents it as a magazine-style
curated doorway.

**Write / edit.** One chapter file per change. If you add, rename, or remove a
chapter, update that book's README TOC and Chapters count in the same change.

**Preview.** On a private Desk, serve locally (`python3 -m http.server`) and
open `reader/#/b/<slug>/`. Use `desk/` for manuscript readiness. Do not make a
private Desk public just to preview it.

**Release.** Normal Desk → Shelf publication. Commit the Desk publication, then
run `scripts/release-book.sh <slug> [path-to-shelf]`. The command runs locally;
it does not require GitHub Actions or a hosted build. It refuses uncommitted
release-path changes, verifies Desk/Shelf roles, prepares an exact replacement
Shelf snapshot including publication rights metadata/files, sets the Shelf copy
to `Published`, updates the Shelf catalog row, verifies copied publication files
against the committed Desk snapshot, and stops before commit or push. Review and
land the Shelf change through its normal Git workflow; a pull request is useful
but not required by Bookself itself.

**Promote / copy only.** `scripts/promote-book.sh <slug> [path-to-shelf]` is the
lower-level file-copy operation. It does not publish, verify a release
transaction, or create a live relationship between Desk and Shelf. Prefer
**Release** for normal publishing.

**Publish.** On a public Shelf, a released book has the exact Status
`Published` and one root README row under **The books**. Normally the Release
command prepares both together; do not change only one side.

**Unpublish.** On the Shelf, set Status to anything except `Published` and
remove the root catalog row. Remember that removing current files does not make
content already pushed to public Git history private.

**Revise a published book.** Leave the current Shelf edition unchanged. Revise
and commit the private Desk copy, then Release the replacement when ready. Do
not change the public Shelf copy to `Drafting` or `Revision in progress` just to
work on the next edition.

Optional book README rows (omit or leave blank if unused): **Publisher**,
**Series**, **Tags**, **Edition**, **Language**, **ISBN**, **Format**, **Venue**,
**DOI**, **Rights**, **AI use**, **Rights file**. Series groups volumes on the
public Shelf. Tags are comma-separated. Wiki links `[[ch03-publishing|label]]`
in chapter Markdown become in-Reader jumps. Do not invent another config file
for these.
