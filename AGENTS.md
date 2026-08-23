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
- Do not put book prose in `reader/` or `desk/`. Authors and agents edit
  Markdown under `books/<slug>/`.

## Architecture: platform, binder, shelf

Bookself deliberately separates portable software from user instances:

- **platform** — this repository; source of truth for shared software,
  templates, docs, and setup tooling
- **binder** — private authoring instance; unpublished manuscripts live here
- **shelf** — public publishing instance; published manuscripts live here

Shared UI consists of **both** `reader/` and `desk/`. Those directories must
remain byte-for-byte aligned across platform, binder, and shelf after sync.

Instance-owned files are never overwritten by UI sync:
- `books/`
- root `README.md`
- `imprint.json`
- instance-specific collaboration/configuration files

After changing anything under `reader/` or `desk/`:

```bash
scripts/sync-ui.sh
```

With no arguments, sibling `../binder` and `../shelf` are synced when present.
Explicit destination paths are also accepted. Commit each instance separately.
`scripts/sync-reader.sh` is only a compatibility alias for `sync-ui.sh`.

Do not hard-code a person, organization, repository name, shelf URL, or binder
URL into shared `reader/` or `desk/` code. Instance identity belongs in
`imprint.json`. Platform defaults must remain portable.

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
  reader can expose Abstract, Methods, Results, Discussion, and References in
  the table of contents. No YAML front matter. No HTML comments in manuscript
  files.
- Book READMEs are an info table plus a checkbox table of contents. A
  publication may add `Format: Whitepaper` and optional `Venue` / `DOI` rows.
- Follow existing naming: `books/<slug>/`, `chNN-slug.md`, `front-matter.md`,
  `back-matter.md`. Whitepapers normally use one `manuscript/paper.md` file.
- Images live in that publication's `media/` folder and are referenced with
  relative links (`![alt](../media/figure-1.png)`). PNG, JPG, WebP, and SVG are
  all appropriate reader assets.
- External creations do not need a publication folder. Put ordinary Markdown
  links under root `## The stand`; the reader renders those as magazine-stand
  cards that open the source site.

## Do not

- Do not touch `LICENSE` or change licensing without the repository owner's
  explicit approval.
- Do not reformat a file wholesale as a drive-by.
- Do not add a build step, CODEOWNERS, or branch protection unless a human
  asked for that by name.
- Do not change GitHub Pages source away from the repository root, or add a
  custom domain, unless a human asked.
- Do not commit secrets, credentials, or unpublished manuscripts copied from
  outside this repository.

## Verbs (author and agent)

These are the public lifecycle. Each manuscript change is Markdown (and maybe
`media/`).

**Start a book.** Copy `books/_TEMPLATE/` to `books/<slug>/`. Fill title,
authors, `Status: Drafting`. Add the slug to the chapter-feedback dropdown in
platform-style repositories when that template is present. In a private
binder, also list the manuscript under root **The books** so the local Desk can
discover it.

**Start a paper.** Copy `books/_PAPER_TEMPLATE/` to `books/<slug>/`. Fill title,
authors, optional venue / DOI, and keep `Status: Drafting` while the work is in
progress. The same Git history, review, media, preview, and publish flow applies.

**Add to the stand.** Under root `## The stand`, add one Markdown link such as
`- [Project name](https://example.com/) — a short optional note`. The linked
site remains the source of truth; Bookself is the curated doorway.

**Write / edit.** One chapter file per change. If you add, rename, or remove a
chapter, update that book's README TOC and Chapters count in the same change.

**Preview.** In a private binder, serve locally (`python3 -m http.server`) and
open `reader/#/b/<slug>/`. Use `desk/` for manuscript readiness. Do not make a
private binder public just to preview it.

**Publish.** On the public shelf, in one change set: set the book README Status
to the exact string `Published`, and add one row to the shelf root README under
**The books** linking `books/<slug>/`. Both are required.

**Promote.** Copy `books/<slug>/` from the private binder into the public shelf
(`scripts/promote-book.sh <slug> [path-to-shelf]`), then Publish on the shelf.
Do not edit shared UI to add a book.

**Unpublish.** On the shelf, set Status to anything except `Published` and
remove the root catalog row.

**Revise a published book.** Edit the Markdown and push. The reader fetches
live files. Do not bump a version stamp.

Optional book README rows (omit or leave blank if unused): **Publisher**,
**Series**, **Tags**, **Edition**, **Language**, **ISBN**, **Format**, **Venue**,
**DOI**. Series groups volumes on the public shelf. Tags are comma-separated.
Wiki links `[[ch03-publishing|label]]` in chapter Markdown become in-reader
jumps. Do not invent another config file for these.
