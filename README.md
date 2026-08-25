# Bookself

**Write a publication like software — without needing to be a software person.**

A publication is a folder. A chapter or paper is a plain-text file. Every save
can have a note, every edit can be compared, and every published work can
become a calm browser reader.

No mysterious publishing database. No `final-final-really-final.docx`. No
requirement that you already know what a repository is.

## Experience Bookself

**The fastest way to understand Bookself is to see the same Reader do two different jobs.**

| Stage | What the Reader is doing | Open it |
|---|---|---|
| **Binder Reader — working proof** | Read an unfinished manuscript, see Draft/Proof state, inspect source/history, leave notes, and review what should change | [Read *Making Bookself* in proof →](https://svyable.github.io/bookself/reader/#/b/making-bookself/) |
| **Bookself example Shelf — released examples** | Browse published specimens that live in this platform repository and show what intentionally released work looks like | [Browse Bookself's example Shelf →](https://svyable.github.io/bookself/reader/) |

A real Binder should be **private**. The *Making Bookself* proof above is a
deliberately public teaching specimen so students, authors, professors,
maintainers, and AI agents can inspect the writing loop without being invited
into somebody's actual private drafts.

The example Shelf above belongs to the Bookself platform repository itself. It
is the clearest place to evaluate Bookself's built-in publication examples. A
separate `Svyable/shelf` deployment is listed later only as a reference showing
what an independent public Shelf instance looks like in practice.

The specimen is recursive: Bookself is being used to write a book about making
books, and the friction discovered while writing it becomes input for improving
Bookself itself. You can [read its review notes](books/making-bookself/REVIEW.md),
[join the live review thread](https://github.com/Svyable/bookself/issues/35), or
[inspect its source](books/making-bookself/).

From the platform example Shelf, you can also open completed specimens directly:

- [**How to Bookself** — practical guide →](https://svyable.github.io/bookself/reader/#/b/how-to-bookself/)
- [**Bookself 101** — academic textbook example →](https://svyable.github.io/bookself/reader/#/b/bookself-101/)
- [**The Bookself Review** — illustrated magazine specimen →](https://svyable.github.io/bookself/reader/#/b/bookself-review/)
- [**Bookself Format Gallery** — visual guide to the publication starters →](https://svyable.github.io/bookself/reader/#/b/bookself-format-gallery/)
- [**Reader Style Shelf** — eight contrasting type and atmosphere specimens →](https://svyable.github.io/bookself/reader/#/b/style-common-book/)
- [**Open the Bookself example Shelf →**](https://svyable.github.io/bookself/reader/)

These are ordinary Markdown publications. Binder and Shelf use the same shared
`reader/` software; the repository role and publication state give that Reader
its job.

> New here? Good. You are allowed to not know GitHub.
> Start with **[START HERE](START-HERE.md)** and ignore the machinery until it
> becomes useful.

## The whole idea in 30 seconds

Writing already has a lifecycle:

**idea → shape → draft → read → revise → review → publish → revise again**

Bookself gives that lifecycle memory.

| Writing moment | What Bookself gives you |
|---|---|
| I have an idea | A publication folder to begin in |
| I wrote something | A saved version with a short note |
| I changed my mind | The old version is still there |
| I want feedback | A clean way to comment on exact lines |
| I want to try a risky rewrite | A side copy that cannot hurt the original |
| I want to proof it | A real reader view, not just a file editor |
| I am ready | A deliberate move from private binder to public shelf |
| I found a typo three months later | Revise it in Binder and release the replacement. |

If software gets a development lifecycle, books and papers can have one too.
Preferably with fewer status meetings. See **[Books have a lifecycle too](docs/writing-lifecycle.md)**.

## GitHub words, translated into human

You only need these when they become useful:

| GitHub says | We mean |
|---|---|
| **repository / repo** | a project folder with a very good memory |
| **commit** | a save point with a note about what changed |
| **branch** | a safe side path where you can try something |
| **pull request / PR** | “here is my proposed change; want to look at it?” |
| **merge** | keep the proposed change |
| **fork** | your own copy of somebody else's project |
| **Markdown** | plain text with a few punctuation tricks for headings, links, and emphasis |

Nobody is born knowing these words. We try not to use one without either
translating it or making it optional.

## Three places, three jobs

Bookself separates the writing room from the shop window:

| Place | Plain-English job |
|---|---|
| **Bookself platform** | the reusable software; most authors can happily ignore its internals |
| **Binder** | the private writing room: drafts, experiments, and the next edition |
| **Shelf** | the public bookcase: released snapshots you actually mean to let people read |

Binder and Shelf are separate Git repositories. The public Shelf does not point
into the private Binder. Releasing a book **copies a committed snapshot** from
Binder into Shelf, verifies the copied publication, and leaves the two copies
independent until the next release.

The **Reader** makes Markdown feel like a publication. The **Publishing Desk**
shows what is drafted, what needs attention, and what is ready to move forward.

The binder should be private. The shelf should be public. An unlisted draft in
a public repository is still public; “hard to find” is not a privacy feature.

## Local first, not pipeline first

Bookself does not require CI/CD to write, preview, release, or read a book. A
private Binder must work with **zero GitHub Actions minutes**. The normal release
helper runs locally with Git and Python's standard library, prepares a Shelf
diff, and stops before commit or push.

GitHub Actions and other hosted automation can be useful optional checks, but
they are not part of the publishing contract. GitHub Pages serves the public
Shelf directly from repository files; Bookself does not need an Actions-based
build just to publish Markdown.

## If you just want to write

You can ignore almost everything else in this README.

1. Open **[START HERE](START-HERE.md)**.
2. Choose the matching blank starter under `books/` — book, paper, magazine, newspaper, journal, newsletter, anthology, report, manual/handbook, or comic — and copy it to a normal publication slug in your private Binder.
3. Keep `Status: Drafting` while you write one chapter, section, issue, or paper.
4. Save it — GitHub calls that a **commit**.
5. Open the Reader and see whether the work still works when it looks published.
6. Repeat until it is less wrong than yesterday.

That is a legitimate workflow. You do not need a branching strategy for your
first paragraph.

## Why this is strangely good for books and papers

Word processors are excellent at showing a page and surprisingly bad at
remembering the life of a sentence. Git was built for code, but several of its
habits are wonderful for prose and research writing:

- **Time travel.** You can see what a paragraph used to say.
- **Small, named saves.** “Tighten opening scene” or “Correct sample size” is more useful than “v27”.
- **Line-level conversation.** Editors and collaborators can point at the exact sentence.
- **Safe experiments.** Try the wild rewrite without deleting the sane one.
- **Clear authorship.** The history shows who changed what and when.
- **Plain files.** Your publication is still readable without Bookself.
- **A real reading surface.** Proof the work in a reader, not only in an editor.
- **Media beside the source.** Figures and images can be versioned with the text that explains them.

The goal is not to make authors or researchers behave like programmers. The
goal is to borrow the parts of software development that make creative and
technical work easier to remember, review, recover, and publish.

## See other solutions

Bookself is not the only thoughtful attempt to make long-form, technical, or
scholarly writing less fragile. If you are an author, professor, student,
researcher, or technical writer comparing **open-source book publishing**,
**collaborative academic writing**, **Markdown publishing**, **Git-based
writing**, **open textbooks**, or **version-controlled publishing**, these
projects are worth knowing about.

Different tools have different centers of gravity. Some are close relatives;
some solve one part of the problem exceptionally well.

| Project | Especially good at | Where Bookself takes a different path |
|---|---|---|
| [Overleaf](https://www.overleaf.com/) | Real-time collaborative LaTeX writing and typesetting; Overleaf Community Edition can be self-hosted | Bookself starts with ordinary Markdown files and Git history, with a publication lifecycle rather than a LaTeX-first editor |
| [Manubot](https://manubot.org/) | Open, GitHub-based scholarly manuscripts with citations, versioning, automated builds, and collaborative review | Probably Bookself's closest conceptual relative; Bookself broadens the pattern to books and papers, adds a Reader and Publishing Desk, and keeps normal publishing local-first rather than CI-dependent |
| [Quarto](https://quarto.org/) | Reproducible scientific and technical publishing from Markdown, notebooks, code, citations, and data to many output formats | Quarto is an excellent publishing engine; Bookself focuses more on the human lifecycle around drafts, reviews, editions, release boundaries, and reading |
| [Jupyter Book](https://jupyterbook.org/) | Interactive and reproducible computational books built from notebooks and Markdown | Bookself is aimed at general prose and research publications even when there is no executable computation at all |
| [bookdown](https://bookdown.org/) | Books and long-form reports from R Markdown with HTML, PDF, EPUB, Word, citations, and cross-references | Bookself is less about a rendering toolchain and more about making the repository itself the durable writing and revision record |
| [Pressbooks](https://pressbooks.org/) | Open-source web book publishing, especially textbooks and multi-format exports such as web, EPUB, and PDF | Pressbooks is a book CMS built on WordPress; Bookself deliberately keeps publications as plain files in ordinary Git repositories |
| [PubPub](https://www.pubpub.org/) | Open-source, community-led publishing with real-time editing, peer review, discussions, DOIs, metadata, and rich media | PubPub provides an end-to-end community platform; Bookself emphasizes portable folders, Git-native review, and a separate private Binder / public Shelf release model |
| [Leanpub](https://leanpub.com/) | Writing in Markdown, syncing with GitHub or Dropbox, publishing early and often, and selling evolving ebooks | Leanpub adds distribution and commerce; Bookself stays self-owned and open, with the public Shelf remaining an ordinary repository and static reading surface |
| [GitBook](https://www.gitbook.com/) | Collaborative documentation with Markdown, GitHub/GitLab sync, branching, review, and polished hosted docs | GitBook is optimized for product and technical documentation; Bookself treats books, papers, editions, and publication release as first-class concepts |
| [mdBook](https://rust-lang.github.io/mdBook/) | Turning a directory of Markdown chapters into a clean, searchable web book for documentation, tutorials, and courses | mdBook is a focused renderer; Bookself adds authoring lifecycle, review semantics, publication state, private/public separation, and a reader |
| [Pandoc](https://pandoc.org/) | Converting between Markdown, LaTeX, Word, EPUB, HTML, JATS, and many other formats, with powerful citation support | Pandoc is foundational infrastructure rather than a collaboration or release workflow; it can complement Bookself rather than compete with it |

**Manubot is probably the closest conceptual neighbor.** Both projects recognize
that Markdown plus Git can be surprisingly natural infrastructure for scholarly
writing. Bookself's distinctive bet is to make that repository lifecycle feel
safe and understandable to people who do not already think like software
developers, while making the boundary between private work-in-progress and an
intentional public release explicit.

Bookself is also happy to coexist with these tools. A publication can use
Pandoc or Quarto for specialized output, start life in another editor, or link
to an external web volume. The aim is not to own every step. It is to give the
work a durable memory and a calm path from draft to publication to revision.

For a longer chooser-style guide — including MyST Markdown, Antora, Typst,
Zettlr, and HedgeDoc — see **[Bookself alternatives and neighboring
tools](docs/alternatives.md)**. For direct answers to common workflow questions,
see the **[Bookself FAQ](docs/faq.md)**.

## What belongs where

The shared platform software is:

- `reader/` — reading, navigation, notes, reading preferences
- `desk/` — author/editor readiness and publishing workspace

A real Bookself instance owns its own:

- `books/`
- root `README.md`
- `imprint.json`

Shared UI must not contain an author's name, account, private binder URL, or
public shelf identity. Those belong to the instance, not the platform.

## I am ready for the machinery now

Great. Here is the more technical setup path.

```bash
scripts/stamp-instance.sh ../binder binder YOUR_GITHUB_OWNER binder
scripts/stamp-instance.sh ../shelf shelf YOUR_GITHUB_OWNER shelf
```

Create the binder repository as **private**. Create the shelf repository as
**public** with GitHub Pages served from the repository root.

After changing Bookself's shared UI, update both instances with:

```bash
scripts/sync-ui.sh
```

Only `reader/` and `desk/` are replaced. Your publications and instance
identity are left alone.

For a normal publication or new edition, commit the Binder manuscript and
prepare the Shelf release with:

```bash
scripts/release-book.sh your-title ../shelf
```

The command runs locally, verifies the committed Binder snapshot, and stops
before commit or push so the public change can be reviewed. No GitHub Actions
run is required.

For the complete architecture and publishing workflow, see
**[docs/bookself.md](docs/bookself.md)**.

## Reference deployment

Bookself is also developed against a separate real deployment so the platform
has to survive contact with an independent Binder and Shelf. These are examples
of an instance made with Bookself, not the Bookself platform's own example
Shelf:

| Role | Reference |
|---|---|
| Platform | this repository (`Svyable/bookself`) |
| Reference private Binder | `Svyable/binder` |
| Reference public Shelf | [Svyable/shelf](https://github.com/Svyable/shelf) |
| Reference public Reader | [Svyable Shelf](https://svyable.github.io/shelf/reader/) |

Those references demonstrate deployment boundaries; they are not identities
baked into the shared software.

## The books

| Publication | Format |
|---|---|
| [How to Bookself](books/how-to-bookself/) | Book |
| [Bookself 101](books/bookself-101/) | Academic textbook example |
| [The Bookself Review](books/bookself-review/) | Illustrated magazine specimen |
| [Bookself Format Gallery](books/bookself-format-gallery/) | Illustrated publication-format gallery |
| [The Common Book](books/style-common-book/) | Reader style specimen — book |
| [The Lamplight Room](books/style-lamplight-room/) | Reader style specimen — literary |
| [A Clear Margin](books/style-clear-margin/) | Reader style specimen — modern essay |
| [Field Notes Quarterly](books/style-field-notes/) | Reader style specimen — editorial |
| [Poems at the Window](books/style-poems-at-window/) | Reader style specimen — poetry |
| [After Midnight](books/style-after-midnight/) | Reader style specimen — night story |
| [Easy Reading](books/style-easy-reading/) | Reader style specimen — accessible |
| [Study in Green](books/style-quiet-study/) | Reader style specimen — quiet study |
| [Making Bookself](books/making-bookself/) | Living draft / public Binder-style specimen |

**How to Bookself** is the short practical guide. **Bookself 101** demonstrates
how a professor might structure a course text with learning objectives, key
terms, discussion questions, labs, semester editions, and a stable public
reading surface. **The Bookself Review** is a real published magazine specimen
with generated cover art. **Bookself Format Gallery** visually maps the blank
magazine, newspaper, journal, newsletter, anthology, report, manual, and comic
starters without copying those platform specimens into a user's Binder.

The eight **Reader style specimens** are intentionally small books with
contrasting `reader.json` recommendations. Together they demonstrate every
named presentation preset and make differences in atmosphere, typeface, size,
measure, alignment, paragraph rhythm, and Pages/Scroll mode easy to inspect.

**Making Bookself** is intentionally unfinished: it dogfoods Bookself's own
draft → proof → review → revision loop in public so the workflow can be
inspected and improved.

## Reader style options

Authors and stylists can recommend a complete starting composition with one
line in `reader.json`:

```json
{
  "version": 1,
  "preset": "literary"
}
```

| Preset | Example | Starting composition |
|---|---|---|
| `book` | [The Common Book](books/style-common-book/) | ivory · Source Serif 4 · balanced paged reading |
| `literary` | [The Lamplight Room](books/style-lamplight-room/) | parchment · Literata · classic indents · pages |
| `modern-essay` | [A Clear Margin](books/style-clear-margin/) | porcelain · IBM Plex Sans · wide left-aligned scroll |
| `editorial` | [Field Notes Quarterly](books/style-field-notes/) | linen · humanist sans · compact editorial scroll |
| `poetry` | [Poems at the Window](books/style-poems-at-window/) | ivory · classic serif · airy open scroll |
| `night-story` | [After Midnight](books/style-after-midnight/) | midnight · Lora · narrow warm paged reading |
| `accessible` | [Easy Reading](books/style-easy-reading/) | high contrast · Atkinson Hyperlegible · larger narrow scroll |
| `quiet-study` | [Study in Green](books/style-quiet-study/) | sage · Literata · narrow left-aligned study scroll |

Presets are shorthand, not locked themes. Authors can fine-tune the recommended
atmosphere, warmth, font, text size, weight, tracking, leading, measure,
alignment, paragraph rhythm, first-line indentation, Pages/Scroll mode, and
hyphenation with explicit `reader.json` values.

**The publication can suggest. The reader decides.** When a reader changes any
of those settings, that personalization belongs only to that browser. It does
not edit the publication, change Git, or change anybody else's reading
experience. See [Publication Reader design](docs/reader-presentation.md) for the
full schema and ownership model.

Real shelves can list books and whitepapers together; a publication with
`Format: Whitepaper` keeps the same folder-and-Markdown workflow and receives
paper labeling in the reader.

## The web shelf

- [Example Web Volume](https://example.com/) — External project example

A web volume is only a link. Bookself binds it visually like a book on the
shelf, but the website stays at its original URL and remains its own source of
truth. This is useful for apps, documentation sites, interactive essays, labs,
and other work that deserves shelf presence without being copied into Git.

## The stand

- [Example Feature](https://example.com/)

The stand is the lighter magazine treatment for external creations. Use the web
shelf when something should feel like a durable volume; use the stand when it
should feel like an issue, feature, or quick doorway.

## Pick your doorway

| You are thinking… | Go here |
|---|---|
| “I just want to write a book.” | **[START HERE](START-HERE.md)** |
| “Show me a draft being read, reviewed, and improved.” | [Making Bookself](books/making-bookself/) |
| “I have a practical question about Git, Markdown, textbooks, papers, or publishing.” | [FAQ](docs/faq.md) |
| “I want to publish a paper, figures, or link another creation.” | [Publication formats](docs/publication-formats.md) |
| “Please explain this without assuming I know GitHub.” | [Author guide](docs/author-guide.md) |
| “How does the writing lifecycle map to all this?” | [Writing lifecycle](docs/writing-lifecycle.md) |
| “How do revisions and releases stay safe?” | [Revisions and releases](docs/revisions.md) |
| “What files make up a book?” | [Book anatomy](docs/book-anatomy.md) |
| “What other writing and publishing tools should I compare?” | [Alternatives and neighboring tools](docs/alternatives.md) |
| “I edit or review other people's work.” | [Editor guide](docs/editor-guide.md) |
| “I want the full private-binder/public-shelf architecture.” | [Bookself architecture](docs/bookself.md) |
| “How should I cite Bookself?” | [CITATION.cff](CITATION.cff) |
| “I am contributing to the software itself.” | [Contributing](CONTRIBUTING.md) |
| “I am an AI agent trying to understand Bookself.” | [llms.txt](llms.txt) |
| “I am an AI agent modifying this repository.” | [AGENTS.md](AGENTS.md) |

## Local platform demo

If you already have the repository on your computer:

```bash
python3 -m http.server
```

Then open:

- `http://127.0.0.1:8000/reader/`
- `http://127.0.0.1:8000/desk/`

If that sentence made you wonder what a terminal is, skip it. The
[Author guide](docs/author-guide.md) starts in the GitHub website instead.

## Citation

If Bookself is part of research, teaching, publishing, or software work, use the
metadata in **[CITATION.cff](CITATION.cff)**. GitHub can render that metadata as
common citation formats from the repository page. When exact reproducibility
matters, also record the specific commit used.

## License

The framework (everything outside `books/`) is MIT. Book and paper manuscripts
remain copyright of their authors. See [LICENSE](LICENSE).