# The Innermost Loop

Bookself is easiest to understand when it is used on itself.

This chapter is being written inside the same publication system it is trying to explain. You are not reading a marketing screenshot of a hypothetical workflow. You are reading a working manuscript whose source is Markdown, whose revisions are Git commits, whose review happens in public Git artifacts, and whose proof is rendered by the Bookself Reader.

That recursion is not a gimmick. It is the shortest path to making the tool better.

A writing system has an outer loop and an inner loop. The outer loop is the big visible journey: start a book, draft it, review it, publish it, revise it later. The inner loop happens dozens of times an hour: write a sentence, read it back, notice what is wrong, leave yourself or someone else a note, change the source, compare the change, and read it again.

If the inner loop is awkward, every author pays the tax repeatedly. If the inner loop becomes calm, legible, and recoverable, the improvement compounds across every chapter and every edition.

Bookself therefore needs to dogfood the innermost loop.

## The two readers are the same software with different jobs

A Bookself **Binder** is the private writing room. It contains work that is not ready for strangers: incomplete chapters, experiments, next-edition changes, arguments with yourself, and the occasional paragraph that seemed brilliant at midnight.

A Bookself **Shelf** is the public release surface. It contains snapshots the author deliberately chose to publish.

Both can use the same Reader software. The important distinction is not the renderer. It is the publication state and the repository boundary.

In a Binder, the Reader is a proofing surface. Drafts can carry a Draft badge and Proof ribbon. The point is to see unfinished work as a reader will see it before deciding that it deserves release.

On a Shelf, the Reader is the public reading surface. The manuscript is no longer merely the latest thing in a working directory. It is an intentional release.

This public **Making Bookself** copy is a teaching exception. Real private drafts should stay private. This specimen is intentionally visible so anyone can inspect how the loop works without being granted access to somebody's actual Binder.

## Reading should lead back to evidence

A useful proof is not a dead preview.

This proof carries its seams with it. From here you can inspect [the exact Markdown source](https://github.com/Svyable/bookself/blob/main/books/making-bookself/manuscript/ch01-the-innermost-loop.md), follow [the publication history](https://github.com/Svyable/bookself/commits/main/books/making-bookself), read [the current review map](https://github.com/Svyable/bookself/blob/main/books/making-bookself/REVIEW.md), or join [the public review thread](https://github.com/Svyable/bookself/issues/35). If you want to look at the released side of the model instead, open [the public Shelf](https://svyable.github.io/shelf/reader/).

Use a Reader note for a thought you want to keep to yourself. Use the review thread when the thought should survive as shared context. Use a pull request when you know the source change you want to propose. The point is not to collect more links. It is to shorten the distance between noticing something in the book and reaching the evidence that can improve it.

When a sentence feels wrong, the reader should be able to move toward the artifact that can change it. Bookself already treats the manuscript source, Git history, and feedback path as part of the reading experience. The cover can show a revision. The Reader can link to source and history. A reviewer can comment on exact lines in GitHub. A reader can make personal notes against source positions without changing the manuscript.

Those are different kinds of notes, and keeping the distinction matters:

- **Personal reading notes** belong to the reader and can stay local.
- **Editorial feedback** belongs in a review conversation that collaborators can see.
- **Proposed prose changes** belong in a diff or pull request where the exact before-and-after can be inspected.
- **Publication state** belongs in the manuscript metadata and repository boundary, not in somebody's memory.

The goal is not to force every thought into GitHub. The goal is to make every thought that *should* become shared or durable easy to attach to the text it concerns.

## A book about making books should expose its own seams

Most documentation tells you what the finished system is supposed to do. A recursive publication can do something more useful: reveal where the system still gets in the way.

If adding a review note requires too many clicks, that friction should become a Bookself issue.

If a professor cannot tell whether students are reading the released semester edition or a draft for next term, that confusion should become a Bookself design problem.

If an AI agent can understand the architecture but cannot discover the smallest safe change to make, the repository instructions are incomplete.

If an author can see a typo in the Reader but cannot get from that sentence to the exact source quickly, the innermost loop is still too long.

The manuscript is therefore also an instrument panel. Every time we use Bookself to improve **Making Bookself**, we are testing whether the system makes its own next improvement easier.

## The loop humans and agents can share

The same compact loop can work for a student, an independent author, a professor, an editor, or an AI agent:

**read → locate → understand → propose → review → revise → read again**

The roles differ, but the evidence can remain shared.

A human may notice that a paragraph is confusing. An agent may notice that the Reader's behavior contradicts the documented lifecycle. A professor may notice that an edition boundary is unclear. An editor may notice that two chapters make the same claim differently.

All of them should be able to point to the source, explain the problem, make or request a bounded change, and preserve the reasoning that led to it.

That is where Git becomes less like programmer machinery and more like institutional memory.

## The viral loop is usefulness, not hype

If Bookself is going to spread through agents, the repository should not merely contain keywords that say "AI agents welcome." It should give an agent a useful job it can understand immediately.

An agent arriving here should be able to answer:

1. What is Bookself trying to preserve?
2. What is private and what is public?
3. Where is the manuscript?
4. What is safe to change?
5. How do I verify that change?
6. Where should I leave a durable explanation?
7. What real artifact can I improve right now?

A living book about making books gives that last question an unusually good answer.

The agent can read the same proof a person reads, inspect the source, consult `AGENTS.md`, follow the review thread, propose one small improvement, and leave the repository easier for the next agent to understand.

That is the recursive promise: each pass through the loop should improve both the book and the machinery that made the pass possible.

The innermost loop is where Bookself earns the right to exist.