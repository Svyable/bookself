# Author guide

You do not need to know Git.

You do not need to know what a repository is, either. If you can edit text in a
browser, you can start writing here. GitHub will occasionally use a strange
noun; this guide translates it when it appears.

If you want the shortest possible version first, read **[START HERE](../START-HERE.md)**.

## The useful mental model

Your **Desk** is a writing workspace with an excellent memory:

- a **book** is a folder
- a **chapter** is a plain-text file
- **research** is the book's evidence notebook and provenance trail
- a **commit** is a saved version with a note
- **history** is all those saved versions in order
- a **pull request** is a proposed change with a conversation attached

That is enough vocabulary for quite a while.

## Your first writing loop

1. Open your book on the Desk.
2. Open a chapter.
3. Click the pencil icon: **Edit this file**.
4. Write.
5. If a factual claim depends on research, preserve the useful source trail in the book's `research/` folder.
6. Click **Commit changes** — read that as **Save this version**.
7. Preview the book in the Reader.
8. Revise.
9. Repeat until the chapter stops making faces at you.

That loop is Bookself in miniature.

## If you are starting a new book

Find `books/_TEMPLATE/`. It is a blank book with example chapter files.

Copy it to a new folder named with lowercase words and hyphens, such as:

`books/the-long-way-home/`

The folder name is a computer-friendly label, not the title readers see.

Open the new book's `README.md` and replace **Your Book Title**. Then replace the
example prose in `manuscript/` one chapter at a time.

Inside the book:

- `README.md` — title, author, status, and reading order
- `manuscript/` — the writing
- `research/` — the canonical source/evidence trail behind factual work
- `media/` — optional cover art and images

Structurally, you now have a book. Whether it is any good remains charmingly
outside the scope of the file system.

On a Desk, also add one row for the new folder under the repository root README's
`## The books` section, for example:

`| [The Long Way Home](books/the-long-way-home/) | Book |`

That Desk inventory entry is how the Publishing Desk and Reader discover the
working publication. It does **not** make the publication a Shelf release.
A Desk is private by default in Bookself's standard setup, but it may deliberately
be public or lower-profile. If the repository is public, the draft and its
research files are public even when nobody advertises them. On a public Shelf,
`## The books` should list only deliberately released publications with
`Status: Published`; the release helper prepares that Shelf entry for you.

## Research without turning the book into homework

Every starter includes `research/README.md`. Think of it as the book's durable
evidence notebook: not necessarily something a casual reader must read, but
something Future You, an editor, a researcher, or an agent can inspect when a
claim needs to be checked or updated.

A useful research entry says more than “here is a link.” It records enough to
recover why the source mattered:

- who published or authored it and what it is called;
- its date or version when that matters;
- a URL, DOI, report number, dataset version, or other identifier;
- when a changing web source was accessed;
- which chapter, claim, figure, or calculation it informed;
- what the source actually established;
- what remained uncertain, conditional, disputed, or easy to overstate;
- any calculation needed to get from the source to the number in the book;
- whether the fact should be checked again before the next release.

The goal is not maximum citations. A memoir might need almost none. A book about
public policy, science, economics, medicine, technology, or history may need a
substantial trail. The useful question is: **could someone later understand why
we believed this strongly enough to print it?**

Keep reader-facing evidence in the reading experience when it belongs there.
Citations, footnotes, references, figures, and necessary methodology should go
in the manuscript when they help the reader follow or trust the argument. Keep
the deeper source ledger, claim checks, calculations, counterevidence, and dated
fact-check notes in `research/`.

Research files are part of the publication snapshot. When you release the book,
the committed research trail travels to Shelf with the manuscript. Your Desk can
then keep researching the next edition while the Shelf preserves the evidence
package that belonged to the released one.

A source trail is not permission to copy the source itself. Prefer links,
bibliographic information, lawful short quotations, hashes, and your own notes
over copied PDFs, articles, datasets, images, or transcripts. Include third-party
files only when redistribution is clearly allowed and preserve their provenance
and license information.

For the complete convention, see [Publication research](research.md).

## Making an edit on GitHub

This walkthrough uses the GitHub website on a computer.

1. Open the chapter you want to change.
2. Click the pencil icon near the top-right of the file view. GitHub calls it
   **Edit this file**.
3. The page becomes a text editor.
4. Change the words.
5. Leave the single `#` title at the top unless you are renaming the chapter.

Markdown is just plain text with a few formatting marks. You do not need to
learn it all first. The main things are:

- `# Chapter title` — chapter heading
- `## Smaller heading` — section heading
- `*words*` — italics
- `**words**` — bold

If you pasted from Word or another rich-text editor, give the result a quick
look for strange formatting. The prose matters more than preserving invisible
word-processor furniture.

## Saving a version — GitHub calls this a commit

When you finish an edit, click **Commit changes**.

GitHub asks for a short message. Write what Future You would want to know:

- `Draft the opening scene`
- `Make chapter 2 less repetitive`
- `Add the CBO source trail behind chapter 3`
- `Try the version where the argument starts later`
- `Fix two typos and an overconfident semicolon`

A commit is not publication. It is simply a named save point in the book's
history.

If GitHub offers these choices:

- **Commit directly to `main`** — save the change into the current working book.
  This is fine for a lead author making ordinary edits in their own book.
- **Create a new branch and start a pull request** — make a safe side copy and
  propose the change for review. Use this when editing someone else's work or
  when a change deserves discussion first.

A **branch** is a side path. A **pull request** is “here is the side-path version;
do we want to keep it?”

## What if I make a mistake?

Version history is the point.

Yesterday's wording is still there. A deleted paragraph is not spiritually
lost. A failed experiment can be compared with the version before it. The same
is true for research notes: a source that turned out to be weak can be corrected
without pretending nobody ever relied on it.

That does not make every mistake effortless to undo, but it makes ordinary
rewrites much less scary than overwriting one giant document forever.

## The table of contents and checkboxes

The book `README.md` has a Contents list like:

    - [ ] [Ch 1 — Opening the Desk](manuscript/ch01-example.md)

The checkbox is a tiny progress marker. GitHub does not toggle it when you click
it in the rendered page.

To mark something drafted:

1. Edit the book `README.md`.
2. Change `[ ]` to `[x]`.
3. Update the **Chapters** count if needed.
4. Save the version.

The Contents list is also the official reading order. Trust it more than the
alphabetical file list.

`research/` does not automatically join that reading order. It is publication
provenance, not another chapter sequence.

## Read while you write

The Bookself Reader is not only for finished books. It is part of revision.

Open:

`reader/#/b/<your-book-folder>/`

Reading prose in a book-like layout catches different problems than reading it
inside an editor. Preview early enough to be annoyed usefully.

The Reader needs the repository to be served over HTTP. On a public Shelf that
usually means GitHub Pages. On a private Desk, the Publishing Desk and Reader
can be served locally from the checkout. A deliberately public Desk can also be
served publicly, but public is public even if you do not advertise the URL.

## Personal Reader notes stay personal

Reader notes are stored in your browser for that Bookself site. They are not
committed to the manuscript, posted to GitHub, or shared with the author. Use a
Reader note for a private thought; use the feedback flow when the author or
reviewers should see it.

Browser-local also means the note does not automatically follow you to another
device or browser profile, and clearing site data can remove it. For notes you
want to keep, open **Type and tools** and choose **Export notes**. The Reader
downloads them as a Markdown file you can save wherever you keep your own work.

A Reader note is also different from a publication research note. Reader notes
are personal. `books/<slug>/research/` is committed, shared publication context.

## Desk, Shelf, and Reader

Bookself has a simple publishing geography:

- **Desk** — where you write, research, revise, and keep working history; private by default, optionally public or lower-profile
- **Shelf** — where deliberately released publications live for readers and where Bookself treats the release as canonical
- **Reader** — the reading interface for a Desk proof or Shelf release

This separation is deliberate. A draft hidden from the Shelf list but stored in
a public repository is still public.

So the normal lifecycle is:

**write + research + revise on the Desk → review → release manuscript + research to the Shelf → keep revising on the Desk**

The [Writing lifecycle](writing-lifecycle.md) explains the larger loop.

## Releasing a book

Release should answer a simple question:

**Do I mean for strangers to be able to read this version and inspect the publication files that travel with it?**

If yes, first save the finished Desk version as a commit. Recheck any fast-aging
facts that materially affect this edition. Then, from the Desk checkout, run:

```bash
scripts/release-book.sh <your-book-folder> ../shelf
```

The release helper works locally. It checks that the Desk copy you are releasing
is committed, verifies that the source is a Desk and the destination is a Shelf,
copies that exact publication snapshot—including manuscript, research, media,
presentation, and rights files—sets the Shelf copy to `Published`, and adds or
updates the Shelf catalog row.

It **stops before commit or push**. That pause is intentional: review the Shelf
diff and make sure you really mean for those files to become public. When it
looks right, commit and push the Shelf change through your normal Git workflow.
A pull request is useful when you want another person to review the release, but
Bookself does not require one.

The Desk copy stays in place as your working history and the home of the next
revision. The Shelf copy is an independent public snapshot; it does not point
back into the Desk. Research can immediately move ahead on Desk without changing
the evidence trail attached to the released edition.

Nothing in `reader/` should be edited to release a book. Publication is
manuscript, research, metadata, rights, and catalog state—not a JavaScript
ceremony—and the normal release path does not require GitHub Actions or a hosted
build.

To unpublish, remove the Shelf catalog row and change the public copy's status
away from `Published`. Remember that content already pushed to public Git
history may still exist in that history, clones, forks, or caches.

## Getting feedback without learning everything

You have several levels of ceremony available.

**Just read this:** send someone the Reader preview.

**Please comment on a passage:** use a GitHub issue or the Reader's feedback
flow when available.

**Please check the evidence:** point a reviewer or researcher at the publication's
`research/README.md` plus the relevant chapter.

**Please propose exact edits:** open a pull request. Reviewers can comment on
specific lines and suggest replacements.

You can adopt those tools gradually. Bookself should still be useful before you
become fluent in any of them.

## Editing someone else's book

If you have permission to edit but are not the lead author, prefer a pull
request rather than saving straight into the main version.

Keep editorial changes narrow. Preserve the author's voice. A precise change
with a reason is much easier to review than a surprise rewrite of half the
chapter. When factual evidence is part of the reason, update or cite the
research trail so the review does not depend on an ephemeral chat transcript.

The [Editor guide](editor-guide.md) goes deeper on review.

## Cover art, metadata, print, and other useful extras

Optional book README rows include:

- Publisher
- Series
- Tags
- Edition
- Language
- ISBN

They are useful but not required to begin writing.

Optional cover art goes in `media/cover.png` (or `.jpg` / `.webp`). If there is
no cover image, the Reader makes a cloth-style cover automatically.

The Reader can print or save a PDF through the browser print dialog. Drafts are
visually marked so an unfinished proof is less likely to escape into the world
wearing a fake mustache.

## A tiny dictionary for later

| GitHub word | Plain-English meaning |
|---|---|
| repository / repo | project folder with history |
| commit | named save point |
| branch | safe side copy / alternate path |
| pull request | proposed changes + discussion |
| merge | accept the proposed changes |
| fork | your own copy of another repository |
| diff | a before-and-after view of changed lines |

You do not need to memorize this table. It will still be here later.

## Where next?

- [START HERE](../START-HERE.md) — the shortest path
- [Publication research](research.md) — evidence, provenance, and agent handoffs
- [Writing lifecycle](writing-lifecycle.md) — the authorship model
- [Book anatomy](book-anatomy.md) — what files make up a book
- [Editor guide](editor-guide.md) — review and proposed changes
- [Bookself architecture](bookself.md) — Desk, Shelf, Reader, and upstream details

If your next question is actually about the sentence you are writing, close the
documentation. That is a good sign.
