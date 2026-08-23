# Books have a lifecycle too

Software people talk about the **software development lifecycle**: understand the
problem, design a solution, build it, test it, release it, maintain it.

Books already have a lifecycle. Writers just use better nouns.

Bookself treats authorship as a living sequence of decisions rather than one
very long document that eventually becomes `FINAL_v8_USE_THIS_ONE.docx`.

## The Bookself writing lifecycle

| Stage | Writer version | What Bookself helps with |
|---|---|---|
| **Discover** | What am I trying to say? Who is this for? | notes, book setup, early structure |
| **Shape** | What belongs in this book, and in what order? | a visible table of contents and chapter files |
| **Draft** | Get words onto the page | plain Markdown, one chapter at a time |
| **Read** | Does it work when it feels like a book? | the Reader, not just an editor window |
| **Revise** | Change the thing without losing the old thing | version history and named save points |
| **Review** | Let another human disagree usefully | line comments, proposed changes, review copies |
| **Publish** | Make this version intentionally public | private Binder → public Shelf |
| **Maintain** | Fix, expand, correct, make a new edition | the same history continues after release |

The stages are not a waterfall. You are allowed to discover a better idea while
revising chapter 11 and ruin your afternoon accordingly.

## 1. Discover

Before there is a manuscript, there is usually a mess:

- a question
- a character
- a claim
- twelve voice notes
- a title that is much better than the current book

Bookself does not try to formalize inspiration. The useful part is that once an
idea becomes a book folder, the work gains a home and a history.

A practical starting question is:

**What would have to be true for me to call this book worth finishing?**

That might mean a complete argument, a specific emotional arc, a field guide
someone can actually use, or simply “the ending finally earns the beginning.”

## 2. Shape

Software calls this design. Writers call it outline, structure, beats, sections,
chapters, index cards, or “I moved everything around at 2 a.m.”

In Bookself, the book `README.md` is the visible spine of the manuscript. Its
Contents list says what exists and what order it belongs in.

The structure should stay boring enough that the prose can be interesting.

## 3. Draft

One chapter is one plain-text file.

That matters because a chapter becomes a manageable unit of work. You can draft
chapter 4 without loading the entire universe. An editor can discuss chapter 4
without accidentally reformatting chapter 9. History can show how chapter 4
changed over time.

A save point is called a **commit** on GitHub. The useful habit is not the word;
it is giving a meaningful name to a moment:

- `Draft the train-platform scene`
- `Make the introduction less defensive`
- `Cut 600 words from the tax chapter`

Small named saves turn history into something Future You can understand.

## 4. Read

Writing and reading are different cognitive jobs.

A paragraph that looks excellent in an editor can feel strangely lumpy when it
sits on a page between other paragraphs. Bookself therefore treats the Reader
as part of writing, not only the final display layer.

Preview early. Read on a narrow screen. Read in a wide spread. Change type size.
Notice where your attention drifts.

The Reader is a test environment for prose, except the test suite is your brain.
Terrifying, but familiar.

## 5. Revise

Revision is where version history earns its keep.

Writers often avoid a risky rewrite because the current paragraph is at least
*known*. Version history makes experimentation cheaper: the older version still
exists.

This changes the emotional contract with editing. Delete the paragraph. Try the
weird opening. Reverse the chapters. If the experiment is worse, congratulations:
you learned something and the previous version did not evaporate.

## 6. Review

Editorial review is most useful when feedback is attached to the thing it is
about.

GitHub's mechanics happen to be good at this:

- a comment can live on an exact line
- a proposed replacement can be shown beside the original
- a larger rewrite can happen on a **branch**, which is simply a safe side copy
- a **pull request** is the conversation about whether to keep that proposed
  version

The terminology is software-flavored. The behavior is just editorial markup
with unusually good memory.

## 7. Publish

Publishing should be a deliberate state change, not an accidental consequence
of where the draft happened to live.

Bookself separates:

- **Binder** — private working manuscripts
- **Shelf** — public books

When a book is ready for readers, promote it from Binder to Shelf, mark it
Published, and list it in the public catalog.

That boundary creates a useful question:

**Do I mean for strangers to be able to read this version?**

If the answer is not yet yes, keep it in the Binder.

## 8. Maintain

Software people call this maintenance. Publishers call it corrections,
revisions, new editions, updated references, or quietly fixing the typo someone
emailed about at 6:12 a.m.

A published book does not have to become a fossil.

Because the source remains plain Markdown and the history continues, a Bookself
book can evolve without losing the record of what readers saw before.

## The lifecycle is the product

The Reader is useful. The Publishing Desk is useful. Git history is useful.

But the deeper idea is the loop:

**write → save → read → discuss → revise → release → learn → write again**

Bookself should make that loop feel ordinary enough that an author can use it
without thinking about infrastructure, and powerful enough that a serious
editorial team does not outgrow it immediately.

That is the standard: not “can a programmer write a book here?”

**Can a writer benefit from versioned authorship before they know the word
versioning?**
