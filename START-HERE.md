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

## Before anything else: your words are not MIT

Bookself's software is open source. **Your book is not open source just because you write it with Bookself or let people read it on the web.**

The default for a real publication is:

> **© the author · All Rights Reserved. Public reading by choice. Broader reuse only by permission or applicable law.**

Every new publication starter now includes `RIGHTS.md`. The Publishing Desk generates the same file. The default reserves republication, commercial reuse, adaptation, AI training/fine-tuning, RAG/grounding, AI-specific indexing, synthetic narration/translation, and other generative reuse unless you deliberately grant those rights.

You can choose Creative Commons or another open-content license later if that is what you want. Bookself will not choose one for you merely because your repository or Reader is public.

There is one separate thing to understand: **your hosting provider has its own contract with you.** An All Rights Reserved notice tells readers and third parties what you are granting; it does not erase permissions you separately gave GitHub or another host under its terms. If provider-level AI/data rights matter to you, read **[Rights, copyright, and AI](docs/rights-and-ai.md)** before uploading a manuscript.

For confidential work, use a private Binder and actual access control. A copyright notice, `robots.txt`, or unlisted URL is not secrecy.

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

There are three friendly paths.

### Easiest: use the New Publication Studio

Open the **Publishing Desk** and choose **Start a publication**.

The New Publication Studio asks what you are making, its working title, the
author, the first piece or chapter, and the Reader style you want to recommend.
It then generates a normal Bookself folder containing:

- `README.md` — title, author, format, status, rights summary, and contents
- `RIGHTS.md` — the publication-specific rights notice; All Rights Reserved by default
- `reader.json` — the book's suggested Reader starting design
- `manuscript/` — a first Markdown piece shaped for the selected format

On browsers that support direct folder writing, **Save starter folder** can
write that folder into the repository's `books/` directory. Everywhere else,
Bookself offers the same files as a small ZIP. Nothing is uploaded or published
automatically.

The studio also gives you the one catalog line needed under the root README's
`## The books` section so the Desk and Reader can discover the new folder.

See **[New Publication Studio](docs/new-publication-studio.md)** for the exact
behavior and privacy boundary.

### Collaborative: ask to start one

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

Then open the new publication's `README.md`, replace the placeholder title with
the actual title, and replace the placeholder author/year in `RIGHTS.md`.

In a private Binder, also add one row for that new folder under the repository
root README's `## The books` section. That catalog row is how the Publishing
Desk and Reader discover the working publication. It does **not** publish the
draft: the Binder remains private and the publication can stay
`Status: Drafting` until you deliberately release it to a public Shelf.

Congratulations: structurally, that is now a publication. Literature, scholarship,
or journalism may take a bit longer.

## Papers and course texts

You do not need a different publishing system.

- **Research paper or whitepaper:** choose **Paper / whitepaper** in the New
  Publication Studio or start from `books/_PAPER_TEMPLATE/`. The
  [academic writing guide](docs/academic-writing.md) covers citations,
  footnotes, figures, references, and the supported math conventions.
- **Course text or textbook:** choose **Book** as the publication format in the
  New Publication Studio, then choose a Reader starting style such as **Quiet
  study** if it suits the material; or start from `books/_TEMPLATE/` like any
  other chaptered book. Keep the next semester's revision private in Binder and
  release a deliberate public Shelf snapshot when students should receive it.
  See [Revisions and releases](docs/revisions.md) for the edition model.

Both paths keep the same plain Markdown, Git history, Reader, Desk, rights file,
and Binder → Shelf release workflow. Neither requires a hosted build or CI/CD.

## What am I looking at?

Inside a publication you will usually see:

- **`README.md`** — the publication's little control card: title, author, status,
  format, rights summary, and contents.
- **`RIGHTS.md`** — the publication's copyright/license choice and AI-use reservation.
- **`reader.json`** — optional recommended Reader design; readers remain free to
  override it in their own browser.
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
- `books/<your-publication>/RIGHTS.md` — change only when you deliberately mean to change rights
- `books/<your-publication>/reader.json`
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

- the **Binder** — private writing room by default, or an explicitly public working proof if the author chooses that mode
- the **Shelf** — public bookcase

The free/default path is to draft privately in the Binder. When the work is meant
for readers, release a committed snapshot to the Shelf and publish that copy
there. The Binder keeps its own history; the Shelf copy is independent until you
deliberately release another snapshot.

An author may instead choose to write in public and expose a Binder Reader. That
changes visibility, **not copyright ownership or the publication license**.

A public repository is public even when a draft is not linked from the shelf.
“Unlisted” is not the same thing as private. Public Git history, forks, caches,
and hosting-provider terms also matter, so read the [rights guide](docs/rights-and-ai.md)
before treating GitHub itself as a rights boundary.

## Where next?

If you want the same path with screenshots-in-words and exact GitHub buttons,
read the **[Author guide](docs/author-guide.md)**.

If you want the full copyright, AI-use, RSL/TDM, and hosting explanation, read
**[Rights, copyright, and AI](docs/rights-and-ai.md)**.

If you are curious about the machinery, read **[Bookself architecture](docs/bookself.md)**.

If you are currently writing, you have permission to stop reading documentation
and go write the next paragraph.