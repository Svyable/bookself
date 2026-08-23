# The Example Paper

## Abstract

This deliberately small research note exists to exercise Bookself's mathematical reading path. It uses ordinary Markdown for prose and LaTeX notation for the places where notation is clearer than words. The model is intentionally simple: if a document has $W$ words and a reader moves at an effective rate of $r$ words per minute, a first estimate of reading time is $T = W/r$ minutes.

## Model

The basic relationship is

$$
T = \frac{W}{r}.
$$

The same expression can be written with bracket delimiters when that is more natural in a LaTeX-heavy manuscript:

\[
T(r) = \frac{W}{r}, \qquad r \in [180, 300].
\]

The interval is illustrative rather than prescriptive. Real reading speed depends on the material, the reader, interruptions, rereading, notation density, and many other factors that this tiny model intentionally ignores.

## Worked example

For a synthetic document with 3,600 words and an illustrative rate of 240 words per minute, an aligned calculation keeps the assumptions visible:

\begin{align}
W &= 3600, \\
r &= 240, \\
T &= \frac{3600}{240} = 15\text{ minutes}.
\end{align}

Inline notation should remain part of the sentence rather than forcing a separate figure. For example, changing $r$ changes the estimate monotonically because $\partial T / \partial r = -W/r^2$ when $W > 0$ and $r > 0$.

## A deliberately wide expression

Scientific papers sometimes contain expressions that are wider than a phone. Bookself should preserve the equation and let the reader inspect it horizontally rather than shrinking the entire publication:

$$
\mathcal{L}(\theta) = -\sum_{i=1}^{n}\left[y_i\log \sigma(x_i^\top\theta) + (1-y_i)\log\left(1-\sigma(x_i^\top\theta)\right)\right] + \lambda\lVert\theta\rVert_2^2.
$$

## Literal TeX and ordinary dollars

Sometimes the source itself is the point. A code span such as `$x^2 + y^2$` should stay code instead of becoming an equation.

Ordinary prose can also contain money. A sentence such as “one copy costs $5 and another costs $10” should remain ordinary text rather than being treated as mathematical delimiters.

## Limitations

This example tests LaTeX-style math embedded in Markdown. It does not claim that Bookself already compiles arbitrary `.tex` projects. Features such as `\input`, document classes, BibTeX or Biber, TikZ, journal packages, automatic cross-references, and a canonical TeX-built PDF belong to the next scientific-authoring layer.

That boundary is deliberate: lightweight mathematical writing should stay build-free, while full TeX compilation should be an explicit opt-in workflow for publications that need it.
