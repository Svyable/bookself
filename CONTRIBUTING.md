# Contributing

Thanks for helping make a book, a tool, or a sentence better.

You do not need to know GitHub's vocabulary before you are useful here. If you
spot something worth changing, there is a path for that.

If the words **branch** and **pull request** mean nothing to you, start with the
[Author guide](docs/author-guide.md). Nobody will make you take a quiz afterward.

If you are changing Bookself itself, keep the
[Contributor map](docs/contributor-map.md) nearby. It explains which directory
owns which kind of change and the smallest local checks that go with it.

## Pick the kind of contribution you are making

| You want to… | Best starting point |
|---|---|
| Improve a sentence or chapter | Edit that publication under `books/` |
| Report a Reader, Desk, release, accessibility, or academic-rendering bug | Open **Platform bug** |
| Propose a platform or research feature | Open **Platform idea** and start with the problem |
| Change Reader / Desk behavior | Read the [Contributor map](docs/contributor-map.md) |
| Improve docs, examples, templates, or onboarding | Make the smallest docs/community PR that makes the path clearer |

A good report is already a contribution. You do not have to arrive with a patch.

## Two easy ways in for book and paper work

### 1. Propose an edit

Change the Markdown and ask for the change to be reviewed.

GitHub calls that review package a **pull request (PR)**. Think: “here is my
proposed version; do we want to keep it?”

This is a good path for editors, co-authors, typo hunters with commitment, and
anyone who has replacement words rather than only a complaint.

See the [Editor guide](docs/editor-guide.md) for the branch → edit → review
walkthrough.

### 2. Point something out

If you spotted a problem and do not want to edit the text yourself, open an
**issue**. An issue is simply a tracked note or conversation.

Use **Chapter feedback** for a specific passage. Use **New book proposal** when
you are pitching a title that does not exist yet.

A useful issue says where the problem is and what you noticed. It does not need
to arrive wearing project-management language.

## Keep manuscript changes pleasantly small

For editorial work, prefer one chapter per pull request.

A chapter PR may also update that book's `README.md` when the table of contents,
chapter count, or status needs to stay in sync.

Please do not bundle unrelated chapters, repo-wide formatting changes, or
platform code into the same editorial change. Small changes are easier for an
author to understand, discuss, accept, reject, or steal one excellent sentence
from.

Changes to `reader/`, `desk/`, or platform tooling are software work rather than
chapter editing. Keep those separate from manuscript PRs.

## Lead authors can save directly

People named as authors on a book's README may commit directly to `main` for
ordinary changes to their own book. Small prose fixes should not require a
ceremony with robes.

If you are editing someone else's book, even if you have repository access,
prefer a pull request so the author gets to review the change before it becomes
the main version.

## Review like an editor, not a replacement author

- Comment on the exact passage when possible.
- Say why something is not working, especially when the fix is subjective.
- Use a suggested replacement when you have one.
- Preserve the author's voice unless changing the voice is the actual brief.
- Prefer a precise change over “rewrite this.”
- The lead author of the book decides what gets merged.

The goal is not to win the comment thread. The goal is a better book with an
understandable history.

## Platform changes do not require a cloud ceremony

Bookself's normal development path is intentionally local. Serve the repository
root with:

```bash
python3 -m http.server
```

Then inspect `reader/` or `desk/` in a browser.

For parser work, run the focused zero-install Node tests that match the change
when Node is available. For release-tooling work, run:

```bash
python3 scripts/test_release_book.py
```

You do not need access to the reference private Binder in order to contribute a
Reader or Desk improvement. The platform repository is the source of truth for
shared UI; maintainers can sync the final shared files into reference instances
when the change lands.

Please do not introduce a required GitHub Actions job, hosted build, package
manager, or external service merely to make a normal Bookself contribution
possible. Optional advanced integrations are welcome when the plain local path
remains complete.

See the [Contributor map](docs/contributor-map.md) for Reader/Desk sync rules,
academic-feature boundaries, focused test commands, and PR-shaping guidance.

## Publishing changes deserve one coherent moment

On a public Shelf, publication means both:

1. the book README says `Status: Published`
2. the Shelf root README lists the book under **The books**

Make those two changes together so the catalog and manuscript do not tell two
different stories.

For private drafting, use the Bookself [Binder → Shelf workflow](docs/bookself.md).
An unlisted file in a public repository is still public.

## Keeping issue forms current

`.github/ISSUE_TEMPLATE/chapter-feedback.yml` contains a **Book** dropdown.
When adding or retiring a book, keep that list in sync in the same change.
Details are in the [Editor guide](docs/editor-guide.md).

The platform bug and idea forms intentionally do not require contributors to
know which file owns a problem. Triage can happen after the report exists.

## If you are here to change the platform

Welcome to the plumbing.

Before changing shared Reader or Desk behavior, read the boundary in
[Bookself architecture](docs/bookself.md): `reader/` and `desk/` are shared
platform software; books and instance identity belong to each Binder or Shelf.
Then use the [Contributor map](docs/contributor-map.md) for the practical path.

If you are here to change a sentence in chapter 3, you can safely ignore that
entire paragraph.
