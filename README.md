# Bookself

**Write like a repo. Publish like a book.**

Bookself is a Git-native publishing system for long-form work. Write and revise on a **Desk**, release deliberate snapshots to a **Shelf**, and let readers encounter both through the same beautiful **Reader**.

Your manuscript stays plain text. Git keeps the history. The Desk keeps the next edition moving. The Shelf gives readers a clean public release.

**[✍️ Open the Desk proof →](https://svyable.github.io/bookself/reader/#/b/making-bookself/)** · **[📚 Browse the Shelf demo →](https://svyable.github.io/bookself/reader/)** · **[🧭 Open the Publishing Desk →](https://svyable.github.io/bookself/desk/)** · **[🚀 Start writing →](START-HERE.md)**

> **16 released demo publications · 1 deliberately unfinished Desk proof · 8 Reader styles · 10 blank publication starters**

## Bookself in one screen

| Surface | Promise | Try it | Source |
|---|---|---|---|
| **Desk** | *This is the work in motion.* Draft, revise, proof, inspect history, and prepare the next edition. | [Open the live proof →](https://svyable.github.io/bookself/reader/#/b/making-bookself/) | [Making Bookself](books/making-bookself/) |
| **Shelf** | *This snapshot is released.* A public library of editions the publisher deliberately chose to ship. | [Browse the Shelf demo →](https://svyable.github.io/bookself/reader/) | [Released examples](#the-books) |
| **Reader** | Read plain Markdown like a designed publication: pages or scroll, type controls, notes, search, citations, rights, and history. | [Open Reader →](https://svyable.github.io/bookself/reader/) | [`reader/`](reader/) |
| **Publishing Desk** | See readiness, publication state, metadata, release mismatches, and the next publishing action without adding a CMS. | [Open Publishing Desk →](https://svyable.github.io/bookself/desk/) | [`desk/`](desk/) |

**Same Reader. Different promise.** Desk means *work in motion*. Shelf means *this snapshot is released*.

That distinction is the heart of Bookself. A release is not “whatever file is newest.” It is an intentional Git event that copies a committed publication snapshot from the working Desk to the public Shelf.

### See a real deployment

Bookself is not only a demo repo. [Svyable Shelf](https://github.com/Svyable/shelf) is a public Bookself library running the same model. Its corresponding working Desk is a separate private repository, which is exactly the separation Bookself is designed to support.

**[📖 Read Svyable Shelf →](https://svyable.github.io/shelf/reader/)** · **[📚 Browse the Shelf source →](https://github.com/Svyable/shelf)** · **[✍️ See the public Desk proof →](https://svyable.github.io/bookself/reader/#/b/making-bookself/)**

> **New to Git?** Start with **[START HERE](START-HERE.md)**. Bookself is designed so you can use the publishing model without first becoming a software person.

## The model

**idea → shape → draft → read → revise → review → release → revise again**

| Name | Job |
|---|---|
| **Bookself** | The whole publishing system: Reader, Desk, Shelf model, templates, scripts, docs, and rights defaults |
| **Desk** | The working repository: drafts, experiments, research, review, and the next edition |
| **Shelf** | The public repository: deliberate publication snapshots and release history |
| **Reader** | The reading interface used for a working proof or released publication |

A public Shelf should never need to reach back into a private Desk to render a released book. The snapshot is copied, versioned, and independently readable.

## The books

This is Bookself's released **example Shelf**. Every row is an ordinary repository publication that can be opened as source or read through the same Reader.

### Publication formats

| Publication | Format | What it demonstrates | Read |
|---|---|---|---|
| [**How to Bookself**](books/how-to-bookself/) | Book guide | A conventional long-form guide built from plain Markdown and Bookself metadata. | [Read →](https://svyable.github.io/bookself/reader/#/b/how-to-bookself/) |
| [**Bookself 101**](books/bookself-101/) | Textbook | Structured teaching material, chapters, academic presentation, and a book-like reading flow. | [Read →](https://svyable.github.io/bookself/reader/#/b/bookself-101/) |
| [**The Bookself Review**](books/bookself-review/) | Magazine | Editorial hierarchy, illustrated feature-style publishing, and magazine composition. | [Read →](https://svyable.github.io/bookself/reader/#/b/bookself-review/) |
| [**The Bookself Daily**](books/bookself-daily/) | Newspaper | Headline-driven layout and a newspaper-shaped publication inside the same repository model. | [Read →](https://svyable.github.io/bookself/reader/#/b/bookself-daily/) |
| [**Bookself Dispatch**](books/bookself-dispatch/) | Newsletter | A compact recurring-publication shape that still gets source, history, and Reader treatment. | [Read →](https://svyable.github.io/bookself/reader/#/b/bookself-dispatch/) |
| [**Open Scholarship Notes**](books/open-scholarship-notes/) | Journal | Scholarly/editorial structure for journal-like work and research-oriented publishing. | [Read →](https://svyable.github.io/bookself/reader/#/b/open-scholarship-notes/) |
| [**The Example Paper**](books/the-example-paper/) | Research paper | A paper/whitepaper-shaped publication with the same Git-native release model. | [Read →](https://svyable.github.io/bookself/reader/#/b/the-example-paper/) |
| [**Bookself Format Gallery**](books/bookself-format-gallery/) | Gallery | A tour of publication shapes and the idea that Bookself is broader than “books only.” | [Read →](https://svyable.github.io/bookself/reader/#/b/bookself-format-gallery/) |

### Reader style specimens

A publication can recommend a starting reading composition without taking control away from the reader.

| Specimen | Preset | Reading feel | Open |
|---|---|---|---|
| [**The Common Book**](books/style-common-book/) | `book` | Ivory, Source Serif 4, balanced paged reading | [Open →](https://svyable.github.io/bookself/reader/#/b/style-common-book/) |
| [**The Lamplight Room**](books/style-lamplight-room/) | `literary` | Parchment, Literata, classic indents, pages | [Open →](https://svyable.github.io/bookself/reader/#/b/style-lamplight-room/) |
| [**A Clear Margin**](books/style-clear-margin/) | `modern-essay` | Porcelain, IBM Plex Sans, wide scroll | [Open →](https://svyable.github.io/bookself/reader/#/b/style-clear-margin/) |
| [**Field Notes Quarterly**](books/style-field-notes/) | `editorial` | Linen, humanist sans, compact editorial scroll | [Open →](https://svyable.github.io/bookself/reader/#/b/style-field-notes/) |
| [**Poems at the Window**](books/style-poems-at-window/) | `poetry` | Ivory, classic serif, airy open scroll | [Open →](https://svyable.github.io/bookself/reader/#/b/style-poems-at-window/) |
| [**After Midnight**](books/style-after-midnight/) | `night-story` | Midnight, Lora, narrow warm paged reading | [Open →](https://svyable.github.io/bookself/reader/#/b/style-after-midnight/) |
| [**Easy Reading**](books/style-easy-reading/) | `accessible` | High contrast, Atkinson Hyperlegible, larger scroll | [Open →](https://svyable.github.io/bookself/reader/#/b/style-easy-reading/) |
| [**Study in Green**](books/style-quiet-study/) | `quiet-study` | Sage, Literata, narrow left-aligned study scroll | [Open →](https://svyable.github.io/bookself/reader/#/b/style-quiet-study/) |

All entries above are intentionally published demo artifacts. The platform demos contain example writing only; they demonstrate Bookself rather than an individual author's personal manuscripts or identity.

## The Desk proof

[**Making Bookself**](books/making-bookself/) is intentionally **not** part of the released catalog above. It is the public teaching stand-in for a private Desk artifact and remains `Status: Drafting` so the Reader can show the Draft/Proof treatment.

That gives Bookself a working demonstration of the full lifecycle rather than a showroom containing only finished objects.

**Shelf catalog = released examples. Desk proof = unfinished on purpose. Blank templates = starting points, not publications.**

## If you just want to write

1. Open **[START HERE](START-HERE.md)**.
2. Create a private Desk and a public Shelf, or start locally with both folders side by side.
3. Copy the publication starter that matches what you are making.
4. Write in plain Markdown and commit meaningful revisions.
5. Proof the working copy in the Reader.
6. Release a committed snapshot to Shelf when you want readers to encounter that edition.

Blank starters cover books, papers, magazines, newspapers, journals, newsletters, anthologies, reports, manuals/handbooks, and comics.

## Local-first by design

Bookself does not require a CMS, database, hosted build pipeline, or GitHub Actions workflow to write, preview, release, or read a publication.

Stamp a working Desk and public Shelf:

```bash
python3 scripts/stamp-instance.py ../desk desk YOUR_GITHUB_OWNER desk
python3 scripts/stamp-instance.py ../shelf shelf YOUR_GITHUB_OWNER shelf
```

Release a committed publication snapshot:

```bash
python3 scripts/release-book.py your-title ../shelf
```

Synchronize shared Reader/Desk UI without replacing instance books or identity:

```bash
python3 scripts/sync-ui.py
```

The `.sh` wrappers remain optional conveniences; the Python entrypoints are the cross-platform source of truth.

## Reader presentation

Authors can recommend a starting composition in `reader.json`:

```json
{
  "version": 1,
  "preset": "literary"
}
```

Available presets include `book`, `literary`, `modern-essay`, `editorial`, `poetry`, `night-story`, `accessible`, and `quiet-study`.

**The publication can suggest. The reader decides.** Reader customizations stay in that browser and do not modify Git or the publication. See [Publication Reader design](docs/reader-presentation.md) for the complete schema.

## Open tools. Author-owned words.

**Public is a visibility setting. Open is a license. They are not the same thing.**

Bookself framework software, documentation, shared UI, scripts, and blank underscore-prefixed starters are MIT licensed. A real publication is **All Rights Reserved by default** unless its author deliberately chooses another license in that publication's rights files.

New publications include `RIGHTS.md` and machine-readable `rights.json`. The default reserves broader reproduction, republication, adaptation, commercial exploitation, AI training/fine-tuning, RAG/grounding, AI-specific indexing, synthetic narration/translation, and other generative reuse except where permission is granted or applicable law independently permits the use.

The Reader can also carry machine-readable rights signals. Those signals communicate permissions and reservations; they are not encryption and they do not override statutory exceptions or separate hosting-provider terms.

See **[Rights, copyright, and AI](docs/rights-and-ai.md)** and [RIGHTS.md](RIGHTS.md) for the full model.

## GitHub hosting choices

Bookself itself has no paid plan requirement. Hosting choices do.

| Setup | GitHub plan | Result |
|---|---|---|
| **Private Desk + local preview** | GitHub Free | Private Git history; proof locally; no Pages required |
| **Public Shelf + public Pages Reader** | GitHub Free | Public repository and public Reader |
| **Private Desk + public Pages proof** | GitHub Pro for a personal repo, or another eligible paid plan | Private Git repository with an intentionally public Pages surface |

A private repository plus public Pages is not a confidentiality boundary for anything rendered on that Pages site. Material that must remain confidential should not be placed on a public preview surface.

## What belongs where

| Shared Bookself platform | Instance-owned publication state |
|---|---|
| `reader/` — reading interface | `books/` — manuscripts/publications |
| `desk/` — publishing/readiness interface | root `README.md` — catalog/identity |
| `scripts/` — stamping, release, verification, sync | `imprint.json` — deployment identity and links |
| `docs/` — workflow and architecture | publication-specific rights and presentation metadata |

Shared UI should not contain a personal author identity, private Desk URL, or unrelated Shelf branding. Instances own their content and identity.

## Documentation

| Need | Go here |
|---|---|
| Start writing | [START HERE](START-HERE.md) |
| Author workflow | [Author guide](docs/author-guide.md) |
| Publication formats | [Publication formats](docs/publication-formats.md) |
| Writing lifecycle | [Writing lifecycle](docs/writing-lifecycle.md) |
| Revisions and releases | [Revisions and releases](docs/revisions.md) |
| Reader presentation | [Reader design](docs/reader-presentation.md) |
| Rights, copyright, and AI | [Rights guide](docs/rights-and-ai.md) |
| Book anatomy | [Book anatomy](docs/book-anatomy.md) |
| Editing and review | [Editor guide](docs/editor-guide.md) |
| Full architecture | [Bookself architecture](docs/bookself.md) |
| FAQ | [FAQ](docs/faq.md) |
| AI project map | [llms.txt](llms.txt) |
| Contributor / agent rules | [AGENTS.md](AGENTS.md) |

## Local platform demo

```bash
python3 -m http.server
```

Then open `http://127.0.0.1:8000/reader/` or `http://127.0.0.1:8000/desk/`.

## Citation and license

For citation metadata, see **[CITATION.cff](CITATION.cff)**. Framework code is MIT licensed; publication content keeps its authorship and publication-specific rights as described in [LICENSE](LICENSE), [RIGHTS.md](RIGHTS.md), and each publication's own rights files.
