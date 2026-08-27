# Bookself

**Write a publication like software — without needing to be a software person.**

Bookself is a Git-native publishing workspace with two clear roles: a private **Binder** for work in progress and a public **Shelf** for intentional releases. The same Reader can show either role, but the artifacts and status should make that distinction obvious.

## Try the demos first

| Demo | What it shows | Open it |
|---|---|---|
| **Binder demo — working proof** | A deliberately unfinished, fictional manuscript with Draft/Proof UI, review links, source, and history | [Open the Binder proof →](https://svyable.github.io/bookself/reader/#/b/making-bookself/) |
| **Shelf demo — released examples** | Published Bookself-owned specimens across books, textbooks, magazines, newspapers, newsletters, journals, papers, and Reader styles | [Open the example Shelf →](https://svyable.github.io/bookself/reader/) |

The platform demo contains **example writing only**. It should not be a showcase for an individual author's personal manuscripts, projects, or identity. The separate `Svyable/shelf` deployment is not the Bookself example Shelf and is intentionally not linked from the main demo path.

Useful direct examples:

- [Textbook — *Bookself 101* →](https://svyable.github.io/bookself/reader/#/b/bookself-101/)
- [Magazine — *The Bookself Review* →](https://svyable.github.io/bookself/reader/#/b/bookself-review/)
- [Newspaper — *The Bookself Daily* →](https://svyable.github.io/bookself/reader/#/b/bookself-daily/)
- [Newsletter — *Bookself Dispatch* →](https://svyable.github.io/bookself/reader/#/b/bookself-dispatch/)
- [Journal — *Open Scholarship Notes* →](https://svyable.github.io/bookself/reader/#/b/open-scholarship-notes/)
- [Paper — *The Example Paper* →](https://svyable.github.io/bookself/reader/#/b/the-example-paper/)
- [Publication-format gallery →](https://svyable.github.io/bookself/reader/#/b/bookself-format-gallery/)
- [Reader style gallery →](https://svyable.github.io/bookself/reader/#/b/style-common-book/)

> New here? Start with **[START HERE](START-HERE.md)**. You do not need to know GitHub before you begin.

## The model

**idea → shape → draft → read → revise → review → publish → revise again**

| Place | Job |
|---|---|
| **Bookself platform** | Reusable Reader, Publishing Desk, helpers, templates, and neutral demos |
| **Binder** | Private writing room: drafts, experiments, review, and the next edition |
| **Shelf** | Public bookcase: released snapshots you intentionally publish |

A release copies a committed publication snapshot from Binder to Shelf. A public Shelf should not point back into a private Binder, and an unlisted draft in a public repository is still public.

## What is free, and what needs GitHub Pro?

Bookself itself is open source and does not require a paid Bookself plan. GitHub plan requirements depend only on how you choose to host the repositories and Reader.

| Setup | GitHub plan | What you get |
|---|---|---|
| **Private Binder + local Reader/Desk** | GitHub Free is enough | Keep the Git repository private and preview locally. No Pages or Actions are required. |
| **Public Shelf + public GitHub Pages Reader** | GitHub Free is enough | A public repository can publish its released Shelf with GitHub Pages. |
| **Private Binder + public GitHub Pages working preview** | GitHub Pro for a personal repository, or an eligible Team/Enterprise plan | Keep the Git repository private while deliberately serving the Binder Reader publicly as a working-in-public proof. |

The third option is an **optional convenience**, not part of Bookself's core publishing requirement. GitHub Pages sites are public by default even when their source repository is private, so a private Binder repository plus a Pages preview means **private Git history, public website content**. Do not use that mode for material that must remain confidential.

A truly private or author-only GitHub Pages site is a separate GitHub Enterprise access-control feature. Bookself does not rely on that feature and does not present a client-side password as a privacy boundary.

## If you just want to write

1. Open **[START HERE](START-HERE.md)**.
2. Copy the appropriate blank starter under `books/` to a normal publication slug in your private Binder.
3. Keep `Status: Drafting` while you work.
4. Save your changes with a commit.
5. Proof the work in the Reader.
6. When ready, prepare a release to the public Shelf.

The starters cover books, papers, magazines, newspapers, journals, newsletters, anthologies, reports, manuals/handbooks, and comics.

## Local-first publishing

Bookself does not require CI/CD to write, preview, release, or read a publication. A private Binder can work with zero GitHub Actions minutes. The normal release helper runs locally, verifies a committed snapshot, prepares the Shelf diff, and stops before commit or push.

Use the cross-platform Python 3 entrypoints below. On systems where Python 3 uses a different launcher name, use the equivalent `python` or `py -3` command. The `.sh` files remain optional convenience wrappers for shell users.

```bash
python3 scripts/stamp-instance.py ../binder binder YOUR_GITHUB_OWNER binder
python3 scripts/stamp-instance.py ../shelf shelf YOUR_GITHUB_OWNER shelf
```

Create the Binder repository as **private** and the Shelf repository as **public**. On GitHub Free, preview the private Binder locally and publish the public Shelf with Pages. If you deliberately want a public Pages preview from the private Binder itself, that private-repository Pages feature requires GitHub Pro or another eligible paid GitHub plan.

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

This section is the Bookself platform's **released example Shelf catalog**. Draft/Binder specimens do not belong in this list.

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

## The Binder demo

[**Making Bookself**](books/making-bookself/) is intentionally **not** in `## The books`. It is a public teaching stand-in for a private Binder artifact, so it remains `Status: Drafting` and should show Proof/Draft UI when opened directly.

That distinction is the point:

- **Shelf catalog** = released example artifacts.
- **Binder demo** = unfinished example artifact.
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

Shared platform software:

- `reader/` — reading, navigation, notes, and reading preferences
- `desk/` — author/editor readiness and publishing workspace
- `scripts/` — local stamping, release, verification, and UI sync helpers

A real instance owns its own:

- `books/`
- root `README.md`
- `imprint.json`

Shared UI must not contain a personal author name, private Binder URL, or unrelated public Shelf identity.

## Documentation

| Need | Go here |
|---|---|
| Start writing | [START HERE](START-HERE.md) |
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

For citation metadata, see **[CITATION.cff](CITATION.cff)**. The framework outside `books/` is MIT licensed; publication content keeps its own authorship and rights as described in [LICENSE](LICENSE).
