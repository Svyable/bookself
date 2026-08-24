# Start here

If you came here to write a book, paper, or course text and GitHub is currently
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

A Bookself book is just a folder containing plain-text chapter files.

Your first loop is:

1. **Open your book.**
2. **Open a chapter.**
3. Click the little **pencil** to edit it.
4. Write something.
5. Click **Commit changes**.
6. Read it in the Bookself Reader.
7. Decide what you hate about it now.
8. Repeat.

GitHub calls step 5 a **commit**. We call it **saving a version**.

That is enough to start.

## If there is no book yet

There are two friendly paths.

### Easiest: ask to start one

Open **Issues → New issue → Start a book**.

The form asks for the working title, author, premise, and whatever chapter ideas
you already have. You may leave the computer-shaped details, such as the folder
name, to whoever or whatever is helping scaffold the book.

This is especially useful in a shared Binder or when a connected agent is doing
the setup work.

**Privacy note:** an issue has the same visibility as its repository. Do not put
private manuscript text in a public issue.

### Hands-on: use the blank book

Find `books/_TEMPLATE/`. That folder is the blank book.

Copy it to a new folder with a simple name such as:

- `the-long-way-home`
- `notes-from-a-small-planet`
- `my-suspiciously-ambitious-first-novel`

The folder name is not the book title. It is just the tidy label computers use
to find the book. Lowercase letters and hyphens keep everyone calm.

Then open the new book's `README.md` and replace **Your Book Title** with the
actual title.

Congratulations: structurally, that is now a book. Literature may take a bit
longer.

## Starting a paper or course text

You do not need a different publishing system.

- **Research paper or whitepaper:** copy `books/_PAPER_TEMPLATE/`. The
  [academic writing guide](docs/academic-writing.md) covers citations,
  footnotes, figures, references, and the supported math conventions.
- **Course text or textbook:** start from `books/_TEMPLATE/` like any other
  book. Keep the next semester's revision private in Binder and release a
  deliberate public Shelf snapshot when students should receive it. See
  [Revisions and releases](docs/revisions.md) for the edition model.

Both paths keep the same plain Markdown, Git history, Reader, Desk, and
Binder → Shelf release workflow. Neither requires a hosted build or CI/CD.

## What am I looking at?

Inside a book you will usually see:

- **`README.md`** — the book's little control card: title, author, status, and
  table of contents.
- **`manuscript/`** — the actual writing, one file per chapter.
- **`media/`** — optional cover art and images.

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

## Can I break the book?

Probably, briefly. That is one reason Bookself uses version history.

If yesterday's paragraph was better, yesterday's paragraph still exists. If an
experiment goes sideways, the old version still exists. Git is unusually good
at remembering things people wish they had not overwritten.

The safest beginner rule is simple: **change prose, not plumbing**.

Stay mostly inside:

- `books/<your-book>/README.md`
- `books/<your-book>/manuscript/`
- `books/<your-book>/media/`

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
book like a book.

For precise editorial feedback, GitHub can attach a comment to an exact line.
If someone proposes an edit, GitHub may call it a **pull request**. Think of a
pull request as a review copy with a conversation attached.

You do not have to use that on day one.

## When does a book become public?

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
and go write the chapter.
