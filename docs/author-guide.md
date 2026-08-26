# Author guide

You do not need to know Git.

You do not need to know what a repository is, either. If you can edit text in a
browser, you can start writing here. GitHub will occasionally use a strange
noun; this guide translates it when it appears.

If you want the shortest possible version first, read **[START HERE](../START-HERE.md)**.

## The useful mental model

This place is a binder with an excellent memory:

- a **book** is a folder
- a **chapter** is a plain-text file
- a **commit** is a saved version with a note
- **history** is all those saved versions in order
- a **pull request** is a proposed change with a conversation attached

That is enough vocabulary for quite a while.

## Your first writing loop

1. Open your book.
2. Open a chapter.
3. Click the pencil icon: **Edit this file**.
4. Write.
5. Click **Commit changes** — read that as **Save this version**.
6. Preview the book in the Reader.
7. Revise.
8. Repeat until the chapter stops making faces at you.

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
- `media/` — optional cover art and images

Structurally, you now have a book. Whether it is any good remains charmingly
outside the scope of the file system.

In a private Binder, also add one row for the new folder under the repository
root README's `## The books` section, for example:

`| [The Long Way Home](books/the-long-way-home/) | Book |`

That Binder catalog entry is how the Publishing Desk and Reader discover the
working publication. It does **not** publish the draft: the Binder remains
private and the publication can remain `Status: Drafting`. On a public Shelf,
by contrast, `## The books` should list only deliberately released publications
with `Status: Published`; the release helper prepares that Shelf entry for you.

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
lost. A failed experiment can be compared with the version before it.

That does not make every mistake effortless to undo, but it makes ordinary
rewrites much less scary than overwriting one giant document forever.

## The table of contents and checkboxes

The book `README.md` has a Contents list like:

    - [ ] [Ch 1 — Opening the Binder](manuscript/ch01-example.md)

The checkbox is a tiny progress marker. GitHub does not toggle it when you click
it in the rendered page.

To mark something drafted:

1. Edit the book `README.md`.
2. Change `[ ]` to `[x]`.
3. Update the **Chapters** count if needed.
4. Save the version.

The Contents list is also the official reading order. Trust it more than the
alphabetical file list.

## Read while you write

The Bookself Reader is not only for finished books. It is part of revision.

Open:

`reader/#/b/<your-book-folder>/`

Reading prose in a book-like layout catches different problems than reading it
inside an editor. Preview early enough to be annoyed usefully.

The Reader needs the repository to be served over HTTP. On a public Shelf that
usually means GitHub Pages. In a private Binder, the Publishing Desk and Reader
can be served locally from the checkout.

## Personal Reader notes stay personal

Reader notes are stored in your browser for that Bookself site. They are not
committed to the manuscript, posted to GitHub, or shared with the author. Use a
Reader note for a private thought; use the feedback flow when the author or
reviewers should see it.

Browser-local also means the note does not automatically follow you to another
device or browser profile, and clearing site data can remove it. For notes you
want to keep, open **Type and tools** and choose **Export notes**. The Reader
downloads them as a Markdown file you can save wherever you keep your own work.

## The private Binder and public Shelf

Bookself's default model uses two spaces:

- **Binder** — private drafting and working history
- **Shelf** — public books intended for readers

This is deliberate. A draft hidden from the Shelf list but stored in a public
repository is still public.

So the normal lifecycle is:

**write in Binder → review → release to Shelf → publish**

The [Writing lifecycle](writing-lifecycle.md) explains the larger loop.

## Publishing a book

Publishing should answer a simple question:

**Do I mean for strangers to be able to read this version?**

If yes, first save the finished Binder version as a commit. Then, from the
Binder checkout, run:

```bash
scripts/release-book.sh <your-book-folder> ../shelf
```

The release helper works locally. It checks that the Binder copy you are
releasing is committed, verifies that the source is a Binder and the destination
is a Shelf, copies that exact publication snapshot, sets the Shelf copy to
`Published`, and adds or updates the Shelf catalog row.

It **stops before commit or push**. That pause is intentional: review the Shelf
diff and make sure you really mean for those files to become public. When it
looks right, commit and push the Shelf change through your normal Git workflow.
A pull request is useful when you want another person to review the release,
but Bookself does not require one.

The Binder copy stays in place as your private working history and the home of
the next revision. The Shelf copy is an independent public snapshot; it does
not point back into the private Binder.

Nothing in `reader/` should be edited to publish a book. Publishing is manuscript
and catalog state, not a JavaScript ceremony, and the normal release path does
not require GitHub Actions or a hosted build.

To unpublish, remove the Shelf catalog row and change the public copy's status
away from `Published`. Remember that content already pushed to public Git
history may still exist in that history, clones, forks, or caches.

## Getting feedback without learning everything

You have several levels of ceremony available.

**Just read this:** send someone the Reader preview.

**Please comment on a passage:** use a GitHub issue or the Reader's feedback
flow when available.

**Please propose exact edits:** open a pull request. Reviewers can comment on
specific lines and suggest replacements.

You can adopt those tools gradually. Bookself should still be useful before you
become fluent in any of them.

## Editing someone else's book

If you have permission to edit but are not the lead author, prefer a pull
request rather than saving straight into the main version.

Keep editorial changes narrow. Preserve the author's voice. A precise change
with a reason is much easier to review than a surprise rewrite of half the
chapter.

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
- [Writing lifecycle](writing-lifecycle.md) — the authorship model
- [Book anatomy](book-anatomy.md) — what files make up a book
- [Editor guide](editor-guide.md) — review and proposed changes
- [Bookself architecture](bookself.md) — Binder, Shelf, and platform details

If your next question is actually about the sentence you are writing, close the
documentation. That is a good sign.
