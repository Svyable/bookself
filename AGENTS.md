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
  publication content under `books/<slug>/`.
- Treat `books/<slug>/research/` as canonical publication content. Read the
  existing trail before repeating research and preserve material provenance when
  factual evidence changes the manuscript.
- Public source is not permission for unrestricted reuse. Read and preserve the
  applicable root and per-publication `RIGHTS.md` files before changing a real
  publication.

## Agent setup entrypoint

If a user points you at this repository and says **“set this up for me”** or an
equivalent outcome-level request, treat Bookself setup as an operation you can
perform, not as documentation to hand back to the user.

- Read `bookself.json` and `docs/agent-first.md`, then optimize for the requested
  end state.
- The standard new-instance names are simply **`desk`** and **`shelf`**. Do not
  invent person-prefixed or personalized repository names unless the user asks
  for them.
- Standard setup means a private-by-default Desk plus an empty public Shelf.
  A Desk may deliberately be public or lower-profile; visibility is an authoring
  policy, not the definition of the `desk` role. Creating the empty Shelf does
  **not** authorize publishing manuscript content to it; a Desk → Shelf release
  remains a separate intent boundary.
- With a local shell, prefer
  `python3 scripts/bootstrap-workspace.py <workspace> --owner <owner> --json`.
  A normal bootstrap must finish with `pairValidation.setupReady: true`.
- Validate an existing pair with
  `python3 scripts/doctor-pair.py <desk-path> <shelf-path>`.
- With authorized GitHub tools but no local shell, reproduce the same durable
  Desk/Shelf result using the file contracts in `bookself.json` and
  `scripts/stamp-instance.py`.
- If the current toolset cannot create repositories, complete every deterministic
  step that is available and ask for only the minimum missing external action.
  Do not turn that capability gap into a multi-step Git tutorial.

A successful setup report should state durable outcomes—Desk, Shelf,
`setupReady`, actual visibility when relevant, and any genuine blocker—rather
than narrating every file copy or Git command.

## Architecture: Bookself, Desk, Shelf, Reader

Bookself is the whole product/ecosystem. It deliberately separates portable
software from user-owned writing and releases:

- **Bookself upstream / `platform` role** — this repository; source of truth for
  shared software, templates, docs, and neutral demos
- **Desk / `desk` role** — authoring instance; manuscripts, research, experiments,
  and the next revision of published books live here. Private is the standard
  setup default, not a semantic requirement.
- **Shelf / `shelf` role** — public publishing instance and canonical promoted
  release surface; deliberately released publication snapshots live here
- **Reader** — the reading interface, shared by Desk proofs and Shelf releases

Desk and Shelf are separate Git repositories with separate histories. A release
copies a publication snapshot from Desk to Shelf. It is not a live reference,
submodule, symlink, shared branch, or runtime dependency on the Desk repository.
After release, the two copies are independent until the next release.

Current authoring instances use `role: "desk"`.

Shared software sync is **role-aware**, not a whole-tree mirroring contract.
Bookself owns reusable Reader/Desk framework code; each instance owns its
integration boundary and publication state.

- A **Desk** may receive shared Reader and Desk framework updates through its
  instance-specific local sync contract. Desk-owned identity, adapters,
  manuscripts, catalog/release state, and authoring policy remain instance data.
- A **Shelf must never receive Bookself's `desk/` tree**. A Shelf framework
  update uses `--shelf-safe`, preserves the Shelf-owned Reader shell, service
  worker, adapter, identity-specific styles, and publication state, and
  materializes upstream `reader/js/app.js` locally as `reader/js/app-core.js`.
- A Shelf must never execute Reader code from the Bookself Pages deployment at
  runtime. Framework updates are copied into the instance and committed there;
  `/bookself/` is not a production CDN for `/shelf/`.
- Unsafe whole-tree sync into a destination whose imprint role is `shelf` must
  fail before mutation.

Instance-owned files are never overwritten by framework sync:
- `books/`
- root `README.md`
- `catalog.json`
- `imprint.json`
- instance-specific collaboration/configuration files
- Shelf-owned Reader integration files protected by the `--shelf-safe` contract

Framework sync requires explicit destinations. Do not rely on sibling
auto-discovery:

```bash
scripts/sync-ui.sh ../desk
scripts/sync-ui.sh --shelf-safe ../shelf
```

Preflight all destinations before mutation. `scripts/sync-reader.sh` is only a
compatibility alias where retained; it must not weaken these ownership rules.

Do not hard-code a person, organization, repository name, Shelf URL, or Desk URL
into portable shared `reader/` or `desk/` code. Instance identity belongs in
`imprint.json`. Platform defaults must remain portable.

## Local-first publishing invariant

Bookself must not require CI/CD to write, research, preview, release, or read a
publication. The complete Desk workflow must work with zero GitHub Actions
minutes.

The required publishing path is deliberately small: Git + Markdown + a browser,
with Python's standard library for the release helper. GitHub Actions, hosted
runners, PR checks, and other automation may be added as optional conveniences,
but they must never become a prerequisite for the Desk → Shelf release path.

GitHub Pages is a static public delivery surface for Shelf, not a required
Actions-based build pipeline. Do not replace the no-build Reader with a hosted
build step unless a human explicitly asks to change that architecture.

## Research and provenance

`books/<slug>/research/` is the canonical publication research component. Every
blank starter includes `research/README.md` as its human- and agent-readable
entry point. See `docs/research.md` for the full contract.

The manuscript is the reader-facing work. The research trail records the deeper
evidence and provenance behind factual claims: source ledgers, claim checks,
calculations, counterevidence, methodological boundaries, dated update notes,
and release fact-checks.

When research materially informs a writing or revision task:

1. Read the relevant manuscript and existing `research/` trail before searching.
2. Identify the factual claim, uncertainty, missing mechanism, or counterexample
   that needs evidence.
3. Prefer primary and authoritative sources when they can answer the question;
   use secondary sources for synthesis, discovery, context, or competing views.
4. Record source identity, date/version, URL or stable identifier, access date
   for changing web sources, manuscript use, limitations, and any calculations.
5. Record counterevidence and argument boundaries; do not collect only support
   for the current draft.
6. Change the manuscript only to the extent justified by the evidence.
7. Promote evidence readers need while reading into manuscript citations,
   footnotes, references, figures, methodology, or back matter.
8. Mark fast-aging claims for recheck before release and perform that recheck
   before a deliberate Shelf release.

Research files are durable publication artifacts, not disposable agent
scratchpads. Leave enough context for another human or agent to reproduce,
update, or disagree with the work without reconstructing the whole conversation.

On Desk, research may move ahead of the released edition. On Shelf, research is
edition-bound and should remain frozen with the released manuscript until the
next deliberate release. The release helper already copies and verifies the
complete publication tree, so committed `research/` files travel automatically.

A research trail is provenance, not a source dump. Prefer links, bibliographic
metadata, lawful short quotations, hashes, and original notes. Do not commit
third-party PDFs, article copies, datasets, images, transcripts, or other source
artifacts merely because an agent can access them. Include third-party files
only when redistribution is clearly authorized and preserve provenance/license
metadata. Never put secrets, credentials, confidential material, or personal
data that should not be public into the publication trail.

Desk visibility is a security/publication fact. If a Desk is public, committed
research is public immediately even if the Desk is not promoted or advertised.

## Rights, copyright, and external AI

Bookself separates open software from author-owned publication content.

- Framework code, docs, shared UI, scripts, and underscore-prefixed blank
  publication starters are MIT licensed.
- A real `books/<slug>/` publication is **All Rights Reserved by default** unless
  its own `RIGHTS.md` expressly grants another license.
- A public repository or public Reader URL does not turn a manuscript or
  research trail into open source or grant a general right to republish, adapt,
  commercialize, train on, or ingest it into generative systems.
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
- The publication's rights files do not silently relicense third-party research
  sources. Preserve source-specific licenses/provenance where third-party files
  are legitimately included.

Read `RIGHTS.md` and `docs/rights-and-ai.md` for the current product policy. When
releasing a publication, its publication-specific rights files and committed
research trail are part of the publication snapshot and should travel with the
manuscript.

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
- Keep `research/README.md` as the canonical research index. Additional research
  files may be organized by claim, chapter, method, dataset, or release check.
  Do not invent a second mandatory metadata database.
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
- See `docs/academic-writing.md` for the scholarly Markdown conventions,
  `docs/research.md` for publication provenance, and `docs/latex.md` for
  mathematical notation.
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
- Do not make Desk publishing depend on GitHub Actions, CI runners, hosted build
  artifacts, or paid automation minutes. Optional CI must remain optional to the
  complete authoring and release lifecycle.
- Do not change GitHub Pages source away from the repository root, or add a
  custom domain, unless a human asked.
- Do not commit secrets, credentials, confidential research, or unpublished
  manuscripts copied from outside this repository without authorization.
- Do not treat an unadvertised public Desk as private.
- Do not revise the next edition of a published book on the public Shelf by
  default. Keep the released Shelf snapshot stable and revise the Desk copy.
  A live public hotfix or public proof requires explicit human intent.

## Verbs (author and agent)

These are the public lifecycle. Each manuscript change is Markdown (and maybe
`research/` or `media/`).

**Start a book.** Copy `books/_TEMPLATE/` to `books/<slug>/`. Fill title,
authors, `Status: Drafting`, and replace the rights placeholders in
`RIGHTS.md`. Preserve the starter's `research/README.md`. On a Desk, also list
the manuscript under root **The books** so the local Publishing Desk can
discover it.

**Start a paper.** Copy `books/_PAPER_TEMPLATE/` to `books/<slug>/`. Fill title,
authors, optional venue / DOI, replace the rights placeholders, preserve the
research trail, and keep `Status: Drafting` while the work is in progress. The
same Git history, review, media, research, preview, and release flow applies. Use
[docs/academic-writing.md](docs/academic-writing.md) for citations, footnotes,
figures, and references, [docs/research.md](docs/research.md) for provenance,
and [docs/latex.md](docs/latex.md) when the paper contains mathematical
notation.

**Start another publication format.** Choose the closest blank starter under
`books/`: `_MAGAZINE_TEMPLATE`, `_NEWSPAPER_TEMPLATE`, `_JOURNAL_TEMPLATE`,
`_NEWSLETTER_TEMPLATE`, `_ANTHOLOGY_TEMPLATE`, `_REPORT_TEMPLATE`,
`_MANUAL_TEMPLATE`, or `_COMIC_TEMPLATE`. Copy it to a normal lowercase,
hyphenated `books/<slug>/` folder on the Desk, replace the placeholder metadata
and rights notice, preserve `research/README.md`, and keep `Status: Drafting`
until a deliberate Desk → Shelf release. Use
[docs/publication-formats.md](docs/publication-formats.md) when choosing between
format families. Do not publish or edit the underscore-prefixed starter itself.

**Research / fact-check.** Read the existing publication research trail first.
Add or update source provenance, manuscript use, limitations, counterevidence,
and recheck notes as needed. Research can be a useful standalone change even
when the evidence shows the manuscript should not change.

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
When factual research materially changes the prose, update the relevant
`research/` trail in the same coherent change or in a preceding research change.

**Preview.** Serve the Desk locally (`python3 -m http.server`) and open
`reader/#/b/<slug>/`. Use `desk/` for manuscript readiness. Do not change
repository visibility merely to preview work.

**Release.** Normal Desk → Shelf publication. Commit the Desk publication, then
run `scripts/release-book.sh <slug> [path-to-shelf]`. The command runs locally;
it does not require GitHub Actions or a hosted build. It refuses uncommitted
release-path changes, verifies Desk/Shelf roles, prepares an exact replacement
Shelf snapshot including manuscript, research, media, presentation, and
publication rights files, sets the Shelf copy to `Published`, updates the Shelf
catalog row, verifies copied publication files against the committed Desk
snapshot, and stops before commit or push. Review and land the Shelf change
through its normal Git workflow; a pull request is useful but not required by
Bookself itself.

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
and commit the Desk copy, including its evolving research trail, then Release
the replacement when ready. Do not change the public Shelf copy to `Drafting`
or `Revision in progress` just to work on the next edition.

Optional book README rows (omit or leave blank if unused): **Publisher**,
**Series**, **Tags**, **Edition**, **Language**, **ISBN**, **Format**, **Venue**,
**DOI**, **Rights**, **AI use**, **Rights file**. Series groups volumes on the
public Shelf. Tags are comma-separated. Wiki links `[[ch03-publishing|label]]`
in chapter Markdown become in-Reader jumps. Do not invent another config file
for these.