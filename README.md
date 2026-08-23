# Bookself

**Write a book like software — without needing to be a software person.**

A manuscript is a folder. A chapter is a plain-text file. Every save can have
a note, every edit can be compared, and every published book can become a calm
browser reader.

No mysterious publishing database. No `final-final-really-final.docx`. No
requirement that you already know what a repository is.

> New here? Good. You are allowed to not know GitHub.
> Start with **[START HERE](START-HERE.md)** and ignore the machinery until it
> becomes useful.

## The whole idea in 30 seconds

Writing already has a lifecycle:

**idea → shape → draft → read → revise → review → publish → revise again**

Bookself gives that lifecycle memory.

| Writing moment | What Bookself gives you |
|---|---|
| I have an idea | A book folder to begin in |
| I wrote something | A saved version with a short note |
| I changed my mind | The old version is still there |
| I want feedback | A clean way to comment on exact lines |
| I want to try a risky rewrite | A side copy that cannot hurt the original |
| I want to proof it | A real reader view, not just a file editor |
| I am ready | A deliberate move from private binder to public shelf |
| I found a typo three months later | Change it. Books are allowed to keep living. |

If software gets a development lifecycle, books can have one too. Preferably
with fewer status meetings. See **[Books have a lifecycle too](docs/writing-lifecycle.md)**.

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
| **Binder** | the private writing room: drafts, experiments, embarrassing chapter-seven detours |
| **Shelf** | the public bookcase: work you actually mean to let people read |

The **Reader** makes Markdown feel like a book. The **Publishing Desk** shows
what is drafted, what needs attention, and what is ready to move forward.

The binder should be private. The shelf should be public. An unlisted draft in
a public repository is still public; “hard to find” is not a privacy feature.

## If you just want to write

You can ignore almost everything else in this README.

1. Open **[START HERE](START-HERE.md)**.
2. Make a book from `books/_TEMPLATE/`.
3. Write one chapter.
4. Save it — GitHub calls that a **commit**.
5. Open the Reader and see whether the prose still works when it looks like a book.
6. Repeat until the book is less wrong than yesterday.

That is a legitimate workflow. You do not need a branching strategy for your
first paragraph.

## Why this is strangely good for books

Word processors are excellent at showing a page and surprisingly bad at
remembering the life of a sentence. Git was built for code, but several of its
habits are wonderful for prose:

- **Time travel.** You can see what a paragraph used to say.
- **Small, named saves.** “Tighten opening scene” is more useful than “v27”.
- **Line-level conversation.** Editors can point at the exact sentence.
- **Safe experiments.** Try the wild rewrite without deleting the sane one.
- **Clear authorship.** The history shows who changed what and when.
- **Plain files.** Your manuscript is still readable without Bookself.
- **A real reading surface.** Proof the work in a book-like Reader, not only in an editor.

The goal is not to make authors behave like programmers. The goal is to borrow
the parts of software development that make creative work easier to remember,
review, recover, and publish.

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

Only `reader/` and `desk/` are replaced. Your books and instance identity are
left alone.

For the complete architecture and publishing workflow, see
**[docs/bookself.md](docs/bookself.md)**.

## A real implementation

Bookself is developed against a real deployment so the platform has to survive
contact with actual books:

| Role | Reference |
|---|---|
| Platform | this repository (`Svyable/bookself`) |
| Private binder | `Svyable/binder` |
| Public shelf | [Svyable/shelf](https://github.com/Svyable/shelf) |
| Public reader | [Svyable Shelf](https://svyable.github.io/shelf/reader/) |

Those are examples, not identities baked into the shared software.

## Pick your doorway

| You are thinking… | Go here |
|---|---|
| “I just want to write a book.” | **[START HERE](START-HERE.md)** |
| “Please explain this without assuming I know GitHub.” | [Author guide](docs/author-guide.md) |
| “How does the writing lifecycle map to all this?” | [Writing lifecycle](docs/writing-lifecycle.md) |
| “What files make up a book?” | [Book anatomy](docs/book-anatomy.md) |
| “I edit or review other people's work.” | [Editor guide](docs/editor-guide.md) |
| “I want the full private-binder/public-shelf architecture.” | [Bookself architecture](docs/bookself.md) |
| “I am contributing to the software itself.” | [Contributing](CONTRIBUTING.md) |
| “I am an AI agent and have somehow ended up here.” | [AGENTS.md](AGENTS.md) |

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

## License

The framework (everything outside `books/`) is MIT. Book manuscripts remain
copyright of their authors. See [LICENSE](LICENSE).
