# Review notes — Making Bookself

This file is the durable review map for the living **Making Bookself** proof.
It is not manuscript prose and it is not a replacement for discussion. It tells
humans and agents where the current questions live and how to join the loop.

## Current state

- **Publication status:** Drafting
- **Working proof:** https://svyable.github.io/bookself/reader/#/b/making-bookself/
- **Public review thread:** https://github.com/Svyable/bookself/issues/35
- **Source folder:** https://github.com/Svyable/bookself/tree/main/books/making-bookself
- **History:** https://github.com/Svyable/bookself/commits/main/books/making-bookself
- **Bookself example Shelf:** https://svyable.github.io/bookself/reader/

This publication is intentionally public as a teaching specimen. Do not infer
from it that a real Binder should be public. A real Binder is the private work
room; this specimen exists so the workflow itself can be inspected by anyone.

Use the platform-owned Bookself example Shelf when comparing this Binder-style
proof with intentionally released examples. Independently deployed Shelves are
useful instance references, but they are not the canonical specimen surface for
this review loop.

## Questions under review

1. Is the difference between a Binder proof and a Shelf release obvious before
   somebody learns Git terminology?
2. Can a reader move naturally from a sentence in the Reader to source, history,
   feedback, and a proposed change?
3. Are personal notes, editorial feedback, and manuscript changes clearly
   distinguished?
4. Can professors use the same model for semester editions without students
   accidentally reading next term's draft?
5. Can an AI agent identify one small, safe improvement and verify it without
   first reverse-engineering the whole repository?
6. Does the recursive framing stay practical: use Bookself to improve the book,
   then use what the book reveals to improve Bookself?
7. Do chapter openings feel intentionally typeset as book pages—with enough
   placement, hierarchy, and breathing room to mark a new chapter—rather than
   generic web content starting at the top edge of the reading surface?

## For a human reviewer

Read the proof first. If something feels wrong, choose the smallest durable
place for the observation:

- personal thought → Reader note
- passage-level feedback → chapter feedback issue
- broader product/editorial question → issue #35
- exact proposed wording or code → pull request

You do not need to know Git terminology before you start reading.

## For an AI agent

1. Read `/llms.txt` for the project map.
2. Read `/AGENTS.md` before modifying files.
3. Read the working proof as a reader, not only the Markdown source.
4. Inspect this file and issue #35 for the active questions.
5. Scan the repository's open pull requests and the newest review-thread comments
   before choosing a lane. If the same problem is already being addressed,
   review or avoid that lane rather than opening a competing change from stale
   `main`.
6. Choose one bounded improvement. Do not rewrite neighboring chapters or
   silently broaden scope.
7. Preserve the private Binder / public Shelf boundary and the local-first,
   no-required-CI publishing path.
8. Verify the relevant behavior or document exactly what was inspected.
9. Leave a commit/PR explanation that lets the next human or agent understand
   why the change exists.

The target is not autonomous churn. The target is a shorter, clearer,
better-evidenced innermost loop.
