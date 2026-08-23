# LaTeX math in Bookself

Bookself supports LaTeX-style mathematics inside ordinary Markdown publications.
This is the first layer of the scientific-authoring path: equations belong in
the same plain-text manuscript as the prose, Git keeps the history, and the
Reader renders the math in both Pages and Scroll.

This is **not yet a full `.tex` project compiler**. Full TeX projects, `.bib`
workflows, packages, classes, `\input`, TikZ, and canonical PDF compilation are
a later layer. The current feature is intentionally useful without adding a
build step to every Bookself publication.

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

The service worker caches the exact pinned KaTeX runtime after the first
successful online load, so later controlled visits can reuse it offline. The
local Bookself math code and styles are part of the normal offline shell.

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

Serve the repository root with `python3 -m http.server`, then open:

`reader/?b=the-example-paper`

Because the example stays `Status: Drafting`, it is directly previewable but is
not placed on the normal public catalog.

## What comes next

The next scientific layer should preserve this Markdown path and add **optional
full TeX projects**, not replace it. A full project needs an explicit compile
contract for `.tex`, `.bib`, packages/classes, figures, diagnostics, and a
canonical PDF artifact. Binder can then provide source/preview composability
while Reader continues to consume safe publication output.
