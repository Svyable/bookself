# Editor guide

This is the path if you are comfortable with branches and pull requests.
Lead authors of a book may still commit directly to `main` for that book;
everyone else uses this flow.

If you have never used GitHub, start with the [author guide](author-guide.md)
instead.

## Branch → edit → pull request

1. Create a branch named after the chapter, for example
   `fix/example-book-ch02-typos`.
2. Edit one chapter file. If the table of contents must change to match
   (added, renamed, or removed chapter), edit that book's `README.md` in
   the same branch.
3. Open a pull request against `main`. The PR template asks for the book,
   the chapter, what changed, and why.
4. Wait for the book's lead author to review.

Keep the pull request to one chapter. A second chapter is a second PR.

## Chapter feedback

The chapter-feedback issue form accepts the publication slug as text rather
than keeping a platform-maintained dropdown. That keeps the form usable in
stamped Binder/Shelf repositories without carrying Bookself's own example-book
list into another author's collaboration workflow.

When reporting feedback, use the folder slug when you know it, for example
`leveraging-luck`. Readers who do not know the slug can still identify the book
by name and point to the chapter or passage in the next field.

## Publishing and the public catalog

For a house that keeps drafts off the street, see [Bookself](bookself.md):
private binder, public shelf. For a normal Binder → Shelf release, commit the
Binder publication and run:

```bash
scripts/release-book.sh <slug> [path-to-shelf]
```

The local release helper verifies the Binder and Shelf roles, refuses
uncommitted release-path changes, prepares an exact replacement snapshot, sets
the Shelf copy to `Published`, updates the public catalog row, verifies the
copied files, and stops before commit or push. Review the prepared Shelf change
and land it through that repository's normal Git workflow.

`scripts/promote-book.sh` remains available as the lower-level copy operation,
but it does not perform the full release transaction or publish the book.

The public reader lists a book only when **both** are true:

1. The book README Status is exactly `Published`.
2. The portal `README.md` table under **The books** links `books/<slug>/`.

The release helper normally prepares both together. Do not edit `reader/` to
add a book.

Unpublish by reversing both. Preview without publishing:
`reader/#/b/<slug>/`.

Publisher, Edition, Language, and ISBN are optional rows on the book
README. If a Publisher is set, the public shelf can filter by it. Print
from the reader (Type and tools) for a galley PDF. Drafts print with a
draft wash.

## Line-comment reviews

Review the manuscript, not the idea of the book, unless the PR is a new-book
proposal.

- Comment on the line that needs to change.
- Use GitHub's suggested-change feature when you have replacement text.
- Do not demand a voice that is not already on the page.
- If the TOC or chapter count in the book README is stale, say so and block
  merge until it is fixed.

## Merge etiquette

- The lead author named on the book's README merges that book's PRs.
- Do not squash away a carefully written chapter history unless the author
  asks. A regular merge (or squash of a messy fixup branch, if the author
  agrees) is fine.
- After merge, confirm the live README contents list still matches the
  files in `manuscript/`.
- Do not enable branch protection or CODEOWNERS as part of ordinary editing.
