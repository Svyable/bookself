# Bookself FAQ

This page answers practical questions from authors, professors, students,
researchers, editors, and technical writers evaluating Git- and Markdown-based
publishing workflows.

## Can I use Git to write a book?

Yes. Git can track prose just as it tracks code. In Bookself, a book is a folder
of Markdown files, and Git provides named save points, revision history, safe
branches for experiments, line-level review, and a record of who changed what.

Bookself's goal is not to make authors behave like programmers. It translates
the useful parts of Git into a publication workflow and makes the terminology
optional until it becomes useful.

## How do I version-control a book or textbook?

Keep the manuscript in plain files, commit meaningful changes with short notes,
and use branches when you want to try a risky rewrite or prepare a larger
revision. Bookself adds an explicit release boundary: unfinished work stays in a
private **Binder**, while an intentional committed snapshot is copied into a
public **Shelf** when it is ready.

That separation means the public edition can remain stable while the next
edition continues privately.

## Can I write an open textbook on GitHub?

Yes. Bookself includes a textbook example, **Bookself 101**, showing learning
objectives, key terms, discussion questions, labs, semester editions, and a
stable browser reading surface. The manuscript remains ordinary Markdown in a
Git repository.

See [Bookself 101](../books/bookself-101/) and the
[publication formats guide](publication-formats.md).

## What should I give students when I assign a Bookself course text?

Give students the **public Shelf Reader link**, not a Binder link. The Shelf is
the released edition intended for readers; the Binder is the private workspace
for drafts and the next revision.

For a syllabus or LMS, it is useful to record two things together:

- the normal Shelf Reader link students open to read the text
- the **public Shelf commit SHA** (and optionally its date) that identifies the
  exact assigned edition

Keep next-semester edits in the private Binder while the class reads the current
Shelf edition. If you intentionally hotfix the public edition during the term,
record the new public Shelf commit with the course materials. Do not use a
private Binder commit or Binder URL as the student-facing provenance reference.

This requires no tag, GitHub Release, DOI, build pipeline, or CI job. See
[revisions and releases](revisions.md#record-the-assigned-edition) for the full
semester-edition workflow.

## Can students take private notes without sending them to the author or class?

Yes. Reader notes are browser-local to that Bookself site. They are not committed
to the publication, posted to GitHub, or shared with the author, instructor, or
other students. Use Reader notes for private study thoughts; use the publication's
feedback flow or GitHub review tools when an observation should be shared.

Because browser-local notes do not automatically follow a student to another
device or browser profile, notes worth keeping should be exported before
clearing site data or switching devices. In the Reader, open **Type and tools**
and choose **Export notes** to download a Markdown copy.

## Can I use Markdown for an academic paper?

Yes. Bookself supports paper-shaped publications as well as books. A paper can
include sections such as Abstract, Methods, Results, Discussion, and References,
along with figures and LaTeX-style math in Markdown.

For workflows centered on executable notebooks, complex citation pipelines, or
many generated output formats, tools such as Quarto, MyST, Jupyter Book, or
Manubot may be a better primary engine. Bookself can also coexist with them.
See [alternatives and neighboring tools](alternatives.md).

## Is Bookself an Overleaf alternative?

Sometimes, but they optimize for different things. Overleaf is excellent for
real-time collaborative LaTeX editing and polished typesetting. Bookself starts
with plain Markdown and Git history and focuses on the lifecycle around a
publication: drafting, reviewing, releasing, revising, and reading.

If LaTeX-first PDF production is the center of your workflow, Overleaf may be
the better fit. If portable plain files, explicit revision history, and a
private-to-public release model matter more, Bookself is worth comparing.

## Is Bookself a Manubot alternative?

They are close conceptual neighbors. Both treat Git and plain-text scholarly
writing as useful infrastructure. Manubot is particularly strong for scholarly
manuscripts, citations, and automated manuscript builds.

Bookself broadens the idea to books, papers, and course texts and emphasizes an
approachable author workflow, a private Binder/public Shelf boundary, a browser
Reader, and a Publishing Desk without making CI/CD part of the normal release
path.

## Is Bookself a GitBook alternative?

Bookself and GitBook both demonstrate the value of plain-text and Git-aware
content, but GitBook is primarily optimized for product and technical
documentation. Bookself treats books, papers, editions, review, publication
status, and release boundaries as first-class concepts.

## Does Bookself require GitHub Actions or CI/CD?

No. The normal authoring, preview, release, and reading workflow is deliberately
local-first. A private Binder must work with zero GitHub Actions minutes.

Optional automation can be added for convenience, but it is not part of the
publishing contract.

## Do authors need to know Git or GitHub already?

No. Bookself deliberately translates repository, commit, branch, pull request,
and merge into plain-language writing concepts. An author can begin with the
[Start Here guide](../START-HERE.md) and learn the machinery only when it becomes
useful.

## How does private drafting and public publishing work?

Bookself uses separate repositories:

- **Binder** — private drafts, experiments, and the next edition.
- **Shelf** — public snapshots that the author deliberately released.

A release copies a committed Binder snapshot into the Shelf. The public Shelf
does not point into the private Binder, and the two copies remain independent
until the next release.

See [Bookself architecture](bookself.md) for the full model.

## Can collaborators review exact sentences?

Yes. Because manuscripts are plain text in Git, collaborators can use diffs,
pull requests, and line comments to discuss exact changes. Bookself also keeps
the manuscript readable outside the review interface, so Git history does not
become the only way to experience the work.

## Can Bookself publish PDF or EPUB?

Bookself's built-in reading surface is a static browser Reader, and its primary
source format is Markdown. It does not try to replace dedicated conversion and
typesetting tools.

For PDF, EPUB, Word, JATS, or other specialized outputs, a Bookself publication
can use tools such as Pandoc or Quarto alongside the same durable manuscript and
revision history.

## Is Bookself self-hosted?

Bookself is open-source software and the publication source remains ordinary
files in repositories you control. The Reader and Publishing Desk are static
web software, and a public Shelf can be served directly from GitHub Pages.

There is no proprietary publishing database required to remain the source of
truth.

## Is Bookself only for books?

No. Bookself supports books, academic-style papers and whitepapers, course texts,
and links to external web creations. The common idea is a durable publication
lifecycle rather than one mandatory output format.

## What happens when I revise something after publication?

Revise the private Binder copy, commit the new work, review it, and release a
new snapshot when it is ready. The currently public Shelf can remain stable
while the next edition is still changing.

See [revisions and releases](revisions.md).

## How is Bookself different from just putting Markdown on GitHub Pages?

GitHub Pages can serve files, but Bookself adds publication-specific structure
and workflow: a Reader, a Publishing Desk, book and paper conventions, review
semantics, publication status, edition/revision guidance, and an explicit
private Binder/public Shelf release model.

## Can Bookself work with Quarto, Pandoc, notebooks, or other editors?

Yes. Bookself is intentionally interoperable. A manuscript can begin in another
editor, use Pandoc or Quarto for specialized output, include material developed
in notebooks, or link to an external web volume. Bookself's main job is to keep
the publication's source and lifecycle understandable and durable.

## How do I cite Bookself?

Use the repository's `CITATION.cff` metadata. On GitHub, the repository landing
page exposes a **Cite this repository** control when the citation file is present
on the default branch, including generated citation formats such as APA and
BibTeX.

See [CITATION.cff](../CITATION.cff).

## What should I compare before choosing Bookself?

Start with the problem you most need to solve. Overleaf, Manubot, Quarto,
Jupyter Book, MyST Markdown, bookdown, Pressbooks, PubPub, Leanpub, GitBook,
mdBook, Antora, Typst, Zettlr, HedgeDoc, and Pandoc all solve important parts of
the broader writing and publishing landscape.

The [alternatives guide](alternatives.md) gives a friendly chooser by use case
and explains where Bookself takes a different path.