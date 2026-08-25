# Start here

If you came here to write a book, paper, course text, magazine, journal, newsletter, report, comic, or another long-form publication and GitHub is currently
giving you the same feeling as the cockpit of a small aircraft, this page is
for you.

You do **not** need to learn Git before you begin. You do not need to know what
a repository is. You do not need a terminal, a command line, a branching
strategy, or a strong opinion about tabs versus spaces.

You need a publication, a piece of writing, and somewhere to put the next
sentence.

If you do not have a GitHub account yet, or you want the basic connection steps
for ChatGPT, Claude, Claude Code, or OpenCode, start with **[Getting Set Up](books/how-to-bookself/manuscript/ch00-getting-set-up.md)** in *How to Bookself*. The local/direct paths described there do not require private-repository GitHub Actions.

## The five-minute version

A Bookself publication is just a folder containing plain-text manuscript files.

Your first loop is:

1. **Open your publication.**
2. **Open a chapter or manuscript file.**
3. Click the little **pencil** to edit it.
4. Write something.
5. Click **Commit changes**.
6. Read it in the Bookself Reader.
7. Decide what you hate about it now.
8. Repeat.

GitHub calls step 5 a **commit**. We call it **saving a version**.

That is enough to start.

### Make the Reader comfortable

The Reader is not a fixed page. Open its **Settings** control to switch between
Pages and continuous Scroll, change text size and typeface, adjust weight,
spacing, line width, alignment, paragraph rhythm, indentation, and hyphenation,
or use a ready-made reading preset. The existing Paper choices can also change
the reading surface between Ink, Parchment, and Paper.

Those reading preferences are stored in your browser. They change how the
publication is presented to you; they do not edit the manuscript or create a
new public version. That makes them safe to experiment with while proofreading,
teaching, or simply making a long reading session easier on your eyes.

## If there is no publication yet

There are two friendly paths.

### Easiest: ask to start one

Open **Issues → New issue → Start a publication**.

The form asks what kind of publication you are making, plus the working title,
author, premise, and whatever structure you already have in mind. You may leave
the computer-shaped details, such as the folder name, to whoever or whatever is
helping scaffold it.

This is especially useful in a shared Binder or when a connected agent is doing
the setup work.

**Privacy note:** an issue has the same visibility as its repository. Do not put
private manuscript text in a public issue.

### Hands-on: use a blank starter

A private Binder includes a small library of blank publication templates under
`books/`. Choose the one closest to what you are making, copy it to a new folder,
and edit the copy rather than the template itself.

Common starters include:

- `books/_TEMPLATE/` — books, novels, course texts, and general chaptered work
- `books/_PAPER_TEMPLATE/` — papers, whitepapers, theses, and research notes
- `books/_MAGAZINE_TEMPLATE/` — magazines and zines
- `books/_NEWSPAPER_TEMPLATE/` — newspapers and gazettes
- `books/_JOURNAL_TEMPLATE/` — journals and proceedings
- `books/_NEWSLETTER_TEMPLATE/` — newsletters and bulletins
- `books/_ANTHOLOGY_TEMPLATE/` — anthologies, chapbooks, and collections
- `books/_REPORT_TEMPLATE/` — reports and evidence-heavy publications
- `books/_MANUAL_TEMPLATE/` — manuals, handbooks, and guides
- `books/_COMIC_TEMPLATE/` — comics and graphic narratives

If none is a perfect match, choose the nearest shape. The templates are starter
structures, not rigid schemas. The [publication formats guide](docs/publication-formats.md)
explains the supported format families and metadata.

Copy your chosen starter to a new folder with a simple name such as:

- `the-long-way-home`
- `fall-2026-course-reader`
- `quarterly-field-report`

The folder name is not the publication title. It is just the tidy label
computers use to find it. Lowercase letters and hyphens keep everyone calm.

Then open the new publication's `README.md` and replace the placeholder title
with the actual title.

Congratulations: structurally, that is now a publication. Literature, scholarship,
or journalism may take a bit longer.

## Papers and course texts

You do not need a different publishing system.

- **Research paper or whitepaper:** start from `books/_PAPER_TEMPLATE/`. The
  [academic writing guide](docs/academic-writing.md) covers citations,
  footnotes, figures, references, and the supported math conventions.
- **Course text or textbook:** start from `books/_TEMPLATE/` like any other
  chaptered book. Keep the next semester's revision private in Binder and
  release a deliberate public Shelf snapshot when students should receive it.
  See [Revisions and releases](docs/revisions.md) for the edition model.

Both paths keep the same plain Markdown, Git history, Reader, Desk, and
Binder → Shelf release workflow. Neither requires a hosted build or CI/CD.

## What am I looking at?

Inside a publication you will usually see:

- **`README.md`** — the publication's little control card: title, author, status,
  format, and contents.
- **`manuscript/`** — the actual writing. A book may use one file per chapter;
  a paper or issue may use one longer manuscript file.
- **`media/`** — optional cover art, figures, page art, and other images.

The `.md` ending means **Markdown**. Markdown is plain text with a few tiny
formatting conventions. A line starting with `#` is a heading. `*this*` makes
italics. You can learn the rest only when you need it.

## The only GitHub words you need today

| Word | Translation |
|---|---|
| **repo** | the whole project folder, with history |
| **commit** | save this version and give the save a short name |
| **history** | all those saves, in order |
| **pull request** | “I changed this; can we look at it together before keeping it?” |

You may encounter **branch**, **fork**, **merge**, and several other nouns that
sound like forestry. They can wait.

## What should I write in the commit box?

Anything that will help Future You remember what this save was about.

Good:

- `Draft the opening scene`
- `Cut the slow paragraph in chapter 3`
- `Try the version where Mara leaves`
- `Fix three typos and one regrettable semicolon`

Less useful:

- `changes`
- `stuff`
- `asdf`

There is no grading. The note is for humans.

## Can I break the publication?

Probably, briefly. That is one reason Bookself uses version history.

If yesterday's paragraph was better, yesterday's paragraph still exists. If an
experiment goes sideways, the old version still exists. Git is unusually good
at remembering things people wish they had not overwritten.

The safest beginner rule is simple: **change prose, not plumbing**.

Stay mostly inside:

- `books/<your-publication>/README.md`
- `books/<your-publication>/manuscript/`
- `books/<your-publication>/media/`

You can ignore `reader/`, `desk/`, `scripts/`, and most of the rest of the
repository while writing.

## How the writing lifecycle works

Bookself is not trying to turn a novel into software. It borrows a few useful
ideas from software work and gives them back to writers in less alarming
clothes.

**Shape → Draft → Read → Revise → Review → Publish → Keep living**

At each stage, the manuscript remains plain files and the history remembers
how it got there.

Read the fuller version in **[Books have a lifecycle too](docs/writing-lifecycle.md)**.

## How do I get feedback?

For informal feedback, send someone the Reader preview and let them read the
publication like a publication.

For precise editorial feedback, GitHub can attach a comment to an exact line.
If someone proposes an edit, GitHub may call it a **pull request**. Think of a
pull request as a review copy with a conversation attached.

You do not have to use that on day one.

## When does a publication become public?

Bookself can use two spaces:

- the **Binder** — private writing room
- the **Shelf** — public bookcase

Draft privately in the Binder. When the work is actually meant for readers,
release a committed snapshot to the Shelf and publish that copy there. The
Binder stays private and keeps its own history; the Shelf copy is independent
until you deliberately release another snapshot.

A public repository is public even when a draft is not linked from the shelf.
“Unlisted” is not the same thing as private.

## Where next?

If you want the same path with screenshots-in-words and exact GitHub buttons,
read the **[Author guide](docs/author-guide.md)**.

If you are curious about the machinery, read **[Bookself architecture](docs/bookself.md)**.

If you are currently writing, you have permission to stop reading documentation
and go write the next paragraph.
