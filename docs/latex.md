# LaTeX math in Bookself

Bookself supports LaTeX-style mathematics inside ordinary Markdown publications.
This is the first layer of the scientific-authoring path: equations belong in
the same plain-text manuscript as the prose, Git keeps the history, and the
Reader renders the math in both Pages and Scroll.

This is **not a full `.tex` project compiler**. Bookself now has simple
Markdown-native citations, bibliography entries, footnotes, figure captions,
and equation references; see [Academic writing in Bookself](academic-writing.md).
Full TeX projects, BibTeX/Biber, packages, classes, `\input`, TikZ, and canonical
TeX compilation remain a later optional Binder layer rather than a requirement
for ordinary Bookself publications.

## Write math in Markdown

Inline math can use dollar delimiters:

```markdown
The estimated reading time is $T = W/r$ minutes.
```

or LaTeX parentheses:

```markdown
The state is \(x \in \mathbb{R}^n\).
```

Display math can use double dollars:

```markdown
$$
T = \frac{W}{r}
$$
```

or LaTeX brackets:

```markdown
\[
p(\theta \mid x) \propto p(x \mid \theta)p(\theta)
\]
```

The Reader also recognizes the common display environments `equation`,
`align`, `alignat`, and `gather`, including their starred forms:

```latex
\begin{align}
W &= 3600, \\
r &= 240, \\
T &= 15\text{ minutes}.
\end{align}
```

Put literal examples in Markdown code spans or fenced code blocks when you want
readers to see the TeX source rather than a rendered equation.

## Labels and equation references

Add a LaTeX-style `\label{...}` to a display block when the equation should be
numbered and referenced:

```latex
$$
T = \frac{W}{r}
\label{eq:reading-time}
$$
```

Refer to it later in the same chapter with:

```latex
Equation \eqref{eq:reading-time} estimates the reading time.
```

Bookself numbers labeled display equations sequentially within each chapter.
Unlabeled display equations remain unnumbered. Use one label per display block.
The label is removed before the expression is sent to KaTeX; Bookself keeps the
label, number, and source offset on the surrounding Reader element instead.
That lets `\eqref{...}` use the same source-offset navigation as the rest of the
Reader in both Pages and Scroll.

A missing equation reference is displayed as `(?)` rather than silently linking
to an incorrect location. Cross-chapter equation references are outside this
first layer; keeping the registry chapter-local avoids introducing a hidden
book-wide compilation database.

## What the Reader does

The math tokenizer runs as part of the Markdown pipeline, before pagination.
That matters: equation height is included when the Reader decides where a page
break belongs. The same rendered blocks are used by continuous Scroll mode.

When the math engine is available, Bookself asks KaTeX for MathML output. The
browser renders that semantic MathML directly, so equations remain selectable
and accessible without shipping KaTeX's font and CSS bundle.

Long display equations are horizontally scrollable instead of forcing the page
wider. Touching or clicking an equation does not turn the page, which makes
selection and horizontal inspection practical on phones and tablets.

Print/PDF and HTML export reuse the same rendered Markdown, so mathematical
content is not a Reader-only decoration.

## Failure and offline behavior

Bookself pins the browser math parser to KaTeX 0.18.4 and verifies the CDN
script with Subresource Integrity. The Reader itself never waits for that
network request in order to open a publication.

If the parser is unavailable, the equation stays visible as readable TeX source
instead of disappearing or blocking the Reader. When KaTeX arrives later, the
Reader upgrades those placeholders in place and triggers a normal repagination.
Equation labels and numbers live on the wrapper, so they survive that hydration.

The service worker caches the exact pinned KaTeX runtime after the first
successful online load, so later controlled visits can reuse it offline. The
local Bookself math and academic code and styles are part of the normal offline
shell.

## Security boundary

Reader math is rendered with conservative KaTeX options:

- `trust: false` — commands that can inject HTML attributes or load arbitrary
  resources are not trusted;
- `maxSize: 20` — user-controlled sizing is bounded;
- `maxExpand: 1000` — macro expansion is bounded;
- `throwOnError: false` — malformed or unsupported math does not crash reading;
- MathML-only output — visual rendering stays in the browser's math engine.

A publication should still keep figures in its own `media/` folder rather than
trying to use `\includegraphics` inside an equation.

## A working example

`books/the-example-paper/` is a single-manuscript draft specifically for testing
scientific reading. It exercises inline math, both display delimiters, an
`align` environment, a deliberately long expression, code examples, and text
containing dollar amounts.

`books/bookself-101/` exercises the broader academic-textbook path, including
numbered equations and the Markdown-native scholarly apparatus described in
[Academic writing in Bookself](academic-writing.md).

Serve the repository root with `python3 -m http.server`, then open:

`reader/?b=the-example-paper`

Because the example paper stays `Status: Drafting`, it is directly previewable
but is not placed on the normal public catalog.

## Optional full-TeX boundary

A future full-TeX workflow should preserve this Markdown path rather than
replace it. The appropriate boundary is the **private Binder**: an author who
needs a real TeX project could opt into local compilation of `.tex`, `.bib`,
packages/classes, figures, diagnostics, and a canonical PDF artifact.

That compiler must not become a prerequisite for writing, previewing, releasing,
or reading an ordinary Bookself publication. Core Reader math and academic
Markdown remain no-build; full TeX is an additional authoring/output path for
work that genuinely needs TeX project semantics.
