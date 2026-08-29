# Bookself

**Write like a repo. Publish like a book.**

Bookself is a Git-native publishing system for long-form work. Write and revise in the **Desk**, release intentional snapshots to the **Shelf**, and read both through the same beautiful **Reader**.

Your manuscript stays plain text. Git keeps the history. The Desk keeps the next edition moving. The Shelf gives readers a clean, deliberate release.

**[✍️ Open the live Desk proof →](https://svyable.github.io/bookself/reader/#/b/making-bookself/)** · **[📚 Browse the example Shelf →](https://svyable.github.io/bookself/reader/)** · **[🚀 Start writing →](START-HERE.md)**

## See Bookself in two clicks

No install. No setup. Open these two demos and the model becomes obvious.

### ✍️ Desk — where the next edition lives

The Desk is the authoring side of Bookself: the place for drafts, revision, proofing, review, source, history, and whatever comes next. A real Desk is private by default; this public demo is intentionally unfinished so you can see the working state.

**[Open the Desk proof — *Making Bookself* →](https://svyable.github.io/bookself/reader/#/b/making-bookself/)**

Look for the **Draft / Proof** treatment, review links, source access, and revision history. Nothing is pretending to be finished.

### 📚 Shelf — where released editions live

The Shelf is the publishing side: a public bookcase of snapshots the author deliberately chose to release. It uses the same Reader, but the promise is different — this is the edition readers are meant to encounter.

**[Browse the example Shelf →](https://svyable.github.io/bookself/reader/)**

The Shelf demo includes books, textbooks, magazines, newspapers, newsletters, journals, papers, and multiple Reader styles, all built from ordinary repository files.

**Same Reader. Different promise.** Desk means *work in motion*. Shelf means *this snapshot is released*.

Want to jump straight into an example? [*Bookself 101*](https://svyable.github.io/bookself/reader/#/b/bookself-101/) · [*The Bookself Review*](https://svyable.github.io/bookself/reader/#/b/bookself-review/) · [*The Bookself Daily*](https://svyable.github.io/bookself/reader/#/b/bookself-daily/) · [*Bookself Dispatch*](https://svyable.github.io/bookself/reader/#/b/bookself-dispatch/) · [*Open Scholarship Notes*](https://svyable.github.io/bookself/reader/#/b/open-scholarship-notes/) · [*The Example Paper*](https://svyable.github.io/bookself/reader/#/b/the-example-paper/) · [Format gallery](https://svyable.github.io/bookself/reader/#/b/bookself-format-gallery/) · [Reader styles](https://svyable.github.io/bookself/reader/#/b/style-common-book/)

> **New to Git?** Start with **[START HERE](START-HERE.md)**. Bookself is designed so you can use the publishing model without first becoming a software person.

The platform demos contain **example writing only**. They are there to demonstrate Bookself itself, not an individual author's personal manuscripts or identity.

## The model

**idea → shape → draft → read → revise → review → release → revise again**

| Name | Job |
|---|---|
| **Bookself** | The whole product/ecosystem: reusable software, helpers, templates, docs, Desk, Shelf, and Reader |
| **Desk** | Private writing workspace: drafts, experiments, review, and the next edition |
| **Shelf** | Public bookcase: released snapshots you intentionally publish |
| **Reader** | The reading interface used to read a Desk proof or a released Shelf publication |

A release copies a committed publication snapshot from Desk to Shelf. A public Shelf should not point back into a private Desk, and an unlisted draft in a public repository is still public.

## Open tools. Author-owned words.

**Public is a visibility setting. Open is a license. They are not the same thing.**

Bookself software and blank underscore-prefixed starters are MIT licensed so people can build with them. A real publication is **All Rights Reserved by default** unless its author deliberately chooses another license in that publication's `RIGHTS.md`.

New publications created from a starter or the Publishing Desk include a rights file and explicit metadata. The default grants ordinary public reading when an author publishes an official copy, while reserving broader reproduction, republication, adaptation, commercial exploitation, AI training/fine-tuning, RAG/grounding, AI-specific indexing, synthetic narration/translation, and other generative reuse except where the author separately grants permission or applicable law independently permits the use.

The Reader also carries a machine-readable RSL reservation on the rendered publication surface: conventional search is permitted; AI uses are not licensed by the Bookself default. These signals communicate rights—they are not encryption or a promise that every crawler will comply.

**Hosting terms are separate.** Copyright ownership and an author's public license do not cancel permissions the author may separately grant a hosting provider by accepting that provider's terms. This matters on services such as GitHub. Authors with strict provider-level requirements should review the current hosting agreement before uploading manuscripts.

See **[Rights, copyright, and AI](docs/rights-and-ai.md)** for the full 2026 model, registration guidance, GitHub-hosting caveat, RSL/TDM guidance, and deployment limits. See [RIGHTS.md](RIGHTS.md) for the repository-level boundary.

## What is free, and what needs GitHub Pro?

Bookself itself is open source and does not require a paid Bookself plan. GitHub plan requirements depend only on how you choose to host the repositories and Reader.

| Setup | GitHub plan | What you get |
|---|---|---|
| **Private Desk + local Reader/Desk** | GitHub Free is enough | Keep the Git repository private and preview locally. No Pages or Actions are required. |
| **Public Shelf + public GitHub Pages Reader** | GitHub Free is enough | A public repository can publish its released Shelf with GitHub Pages. |
| **Private Desk + public GitHub Pages working preview** | GitHub Pro for a personal repository, or an eligible Team/Enterprise plan | Keep the Git repository private while deliberately serving the Desk Reader publicly as a working-in-public proof. |

The third option is an **optional convenience**, not part of Bookself's core publishing requirement. GitHub Pages sites are public by default even when their source repository is private, so a private Desk repository plus a Pages preview means **private Git history, public website content**. Do not use that mode for material that must remain confidential.

A truly private or author-only GitHub Pages site is a separate GitHub Enterprise access-control feature. Bookself does not rely on that feature and does not present a client-side password as a privacy boundary.

## If you just want to write

1. Open **[START HERE](START-HERE.md)**.
2. Copy the appropriate blank starter under `books/` to a normal publication slug on your private Desk.
3. Keep `Status: Drafting` while you work.
4. Save your changes with a commit.
5. Proof the work in the Reader.
6. When ready, release it to the public Shelf.

The starters cover books, papers, magazines, newspapers, journals, newsletters, anthologies, reports, manuals/handbooks, and comics.

## Local-first publishing

Bookself does not require CI/CD to write, preview, release, or read a publication. A private Desk can work with zero GitHub Actions minutes. The normal release helper runs locally, verifies a committed snapshot, prepares the Shelf diff, and stops before commit or push.

Use the cross-platform Python 3 entrypoints below. On systems where Python 3 uses a different launcher name, use the equivalent `python` or `py -3` command. The `.sh` files remain optional convenience wrappers for shell users.

```bash
python3 scripts/stamp-instance.py ../desk desk YOUR_GITHUB_OWNER desk
python3 scripts/stamp-instance.py ../shelf shelf YOUR_GITHUB_OWNER shelf
```

Create the Desk repository as **private** and the Shelf repository as **public**. On GitHub Free, preview the private Desk locally and publish the public Shelf with Pages. If you deliberately want a public Pages preview from the private Desk itself, that private-repository Pages feature requires GitHub Pro or another eligible paid GitHub plan.

For a release:

```bash
python3 scripts/release-book.py your-title ../shelf
```

For shared Reader/Desk upgrades:

```bash
python3 scripts/sync-ui.py
```

Only shared UI is replaced; instance publications and identity remain owned by the instance.

## The books

This section is the Bookself platform's **released example Shelf catalog**. Draft/Desk specimens do not belong in this list.

| Publication | Format |
|---|---|
| [How to Bookself](books/how-to-bookself/) | Book guide specimen |
| [Bookself 101](books/bookself-101/) | Academic textbook specimen |
| [The Bookself Review](books/bookself-review/) | Illustrated magazine specimen |
| [The Bookself Daily](books/bookself-daily/) | Illustrated newspaper specimen |
| [Bookself Dispatch](books/bookself-dispatch/) | Newsletter specimen |
| [Open Scholarship Notes](books/open-scholarship-notes/) | Scholarly journal specimen |
| [The Example Paper](books/the-example-paper/) | Whitepaper / research-paper specimen |
| [Bookself Format Gallery](books/bookself-format-gallery/) | Publication-format gallery |
| [The Common Book](books/style-common-book/) | Reader style specimen — book |
| [The Lamplight Room](books/style-lamplight-room/) | Reader style specimen — literary |
| [A Clear Margin](books/style-clear-margin/) | Reader style specimen — modern essay |
| [Field Notes Quarterly](books/style-field-notes/) | Reader style specimen — editorial |
| [Poems at the Window](books/style-poems-at-window/) | Reader style specimen — poetry |
| [After Midnight](books/style-after-midnight/) | Reader style specimen — night story |
| [Easy Reading](books/style-easy-reading/) | Reader style specimen — accessible |
| [Study in Green](books/style-quiet-study/) | Reader style specimen — quiet study |

All entries above are intentionally published demo artifacts. Their metadata should say `Status: Published`, and their authorship should use neutral Bookself demo/editorial identities rather than personal account handles.

## The Desk demo

[**Making Bookself**](books/making-bookself/) is intentionally **not** in `## The books`. It is a public teaching stand-in for a private Desk artifact, so it remains `Status: Drafting` and should show Proof/Draft UI when opened directly.

That distinction is the point:

- **Shelf catalog** = released example artifacts.
- **Desk demo** = unfinished example artifact.
- **Blank templates** = starting points, not publications and not Shelf entries.

## Reader style options

Authors can recommend a starting composition in `reader.json`:

```json
{
  "version": 1,
  "preset": "literary"
}
```

Available presets include `book`, `literary`, `modern-essay`, `editorial`, `poetry`, `night-story`, `accessible`, and `quiet-study`. The publication can suggest; the reader decides. Reader customizations stay in that browser and do not modify the publication.

See [Publication Reader design](docs/reader-presentation.md) for the complete schema.

## What belongs where

Shared Bookself software:

- `reader/` — the Reader: reading, navigation, notes, and reading preferences
- `desk/` — the Publishing Desk UI: author/editor readiness and publishing workspace
- `scripts/` — local stamping, release, verification, and UI sync helpers

A real Desk or Shelf instance owns its own:

- `books/`
- root `README.md`
- `imprint.json`

Shared UI must not contain a personal author name, private Desk URL, or unrelated public Shelf identity.

## Documentation

| Need | Go here |
|---|---|
| Start writing | [START HERE](START-HERE.md) |
| Rights, copyright, and AI | [Rights guide](docs/rights-and-ai.md) |
| Author workflow | [Author guide](docs/author-guide.md) |
| Publication formats | [Publication formats](docs/publication-formats.md) |
| Writing lifecycle | [Writing lifecycle](docs/writing-lifecycle.md) |
| Revisions and releases | [Revisions and releases](docs/revisions.md) |
| Book anatomy | [Book anatomy](docs/book-anatomy.md) |
| Editing and review | [Editor guide](docs/editor-guide.md) |
| Full architecture | [Bookself architecture](docs/bookself.md) |
| Alternatives | [Alternatives and neighboring tools](docs/alternatives.md) |
| FAQ | [FAQ](docs/faq.md) |
| AI project map | [llms.txt](llms.txt) |
| Contributor instructions | [AGENTS.md](AGENTS.md) |

## Local platform demo

```bash
python3 -m http.server
```

Then open `http://127.0.0.1:8000/reader/` or `http://127.0.0.1:8000/desk/`.

## Citation and license

For citation metadata, see **[CITATION.cff](CITATION.cff)**. Bookself framework code, documentation, shared UI, scripts, and blank underscore-prefixed starters are MIT licensed. Real publication content keeps its authorship and publication-specific rights as described in [LICENSE](LICENSE), [RIGHTS.md](RIGHTS.md), and each publication's own `RIGHTS.md` when present.
