# Scholarship, Media, and Evidence

A course text becomes more useful when the claims, figures, equations, and source trails survive revision along with the prose. In a research setting, the chapter is rarely the only object that matters. A graph may be redrawn. A DOI may need correction. A definition may change after peer review. The relationship between those materials is part of the scholarly record.

Bookself keeps that relationship close to the manuscript by storing publication media beside the text and tracking both through Git.

**Learning objectives**

After working through this chapter, a student should be able to:

- describe why figures and manuscript text should be versioned together;
- distinguish a citation link from a claim of authority;
- explain how Bookself handles mathematical notation without requiring a document build;
- identify when a course chapter should link to a paper, dataset, or external scholarly object rather than copy it;
- propose a simple evidence-review workflow for an academic publication.

Suppose Dr. Rivera adds a chart comparing annual visitation to two national parks. The chart is not decoration. Students may use it to answer a question, and the surrounding text may interpret a trend visible in the image. If the chart changes but the paragraph does not, or the paragraph changes while an old image remains in place, the course text can quietly contradict itself.

A Bookself publication puts images in that publication's `media/` folder and references them from Markdown with a relative path. The figure and the sentence that explains it can therefore be reviewed in the same history. A correction to a label, a replacement photograph, or a revised diagram is visible as a publication change rather than as an invisible upload to a separate asset service.

**Key terms**

| Term | Meaning in this course |
|---|---|
| **Media folder** | The publication-local directory for figures and images referenced by the manuscript. |
| **Relative link** | A path from one publication file to another that remains valid when the publication folder moves as a unit. |
| **DOI** | A persistent identifier commonly used to locate scholarly works. |
| **Source note** | A concise record of where a factual claim, figure, quotation, or dataset came from. |
| **LaTeX-style math** | Mathematical notation written in the Markdown source and rendered by the Reader. |

Bookself does not turn a hyperlink into evidence by itself. An instructor still has to decide whether a source is appropriate and whether a claim is represented accurately. Git can preserve the history of a citation; it cannot tell you whether the cited paper supports the sentence.

That makes review habits more important, not less. A useful scholarly change often includes the evidence change and the prose change together. If a new paper alters the interpretation of a topic, the pull request can show the revised paragraph and the updated reference in one comparison. A reviewer can then inspect both the wording and the basis for it.

Mathematical material follows the same principle. Bookself's Reader supports common LaTeX-style notation directly in Markdown. Inline notation can be written between dollar signs, while display equations can use double dollar signs or supported display environments. For example, a statistics course might write an ordinary sample mean as:

$$
\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i
$$

The equation remains text in Git. The Reader renders it for reading and provides semantic math output when the math runtime is available. There is no requirement to compile an entire `.tex` document merely to show an equation in a chapter.

The boundary is deliberate. Bookself is not pretending to be a full LaTeX distribution. A professor who needs document classes, BibTeX or Biber, TikZ, or a complex journal-production pipeline may still use those tools. The course text can link to or accompany that work without turning the Reader into a general-purpose TeX build system.

The same restraint applies to external scholarly objects. A dataset maintained by an archive should usually remain in the archive. A journal article should usually remain at its DOI or publisher page. A live simulation may belong on the web. The textbook can cite or link those objects while keeping its own explanatory prose and publication media in Git.

**Worked example**

Dr. Rivera replaces a chart because the original source released corrected data. Her proposed change contains three related edits: the new image in `media/`, the paragraph that interprets the chart, and a source link pointing to the corrected dataset. A reviewer can see that the image changed and read the revised interpretation in the same proposal.

If the old chart matters historically, Git already preserves the earlier committed version. She does not need to keep `chart-final-old.png`, `chart-final-new.png`, and `chart-final-new-2.png` in the live publication merely to retain a record of what students saw last semester.

**Discussion questions**

1. Which scholarly materials belong inside a course-text repository, and which are better referenced externally?
2. What can version history tell a reader about a citation change? What can it not tell them?
3. When a figure changes, what neighboring text should an editor inspect before accepting the revision?

**Lab: review an evidence-bearing change**

Choose one paragraph that depends on a source, figure, or equation. Identify the exact object the paragraph relies on. Then imagine that object changes: a dataset is corrected, a paper is retracted, or a figure is relabeled. Write a short revision note describing which publication files would need review and why. If you are working in a repository, make the smallest possible branch that keeps the evidence and explanatory change together.

Academic publishing is full of relationships between objects. Bookself's contribution is modest but useful: keep the publication's own objects near one another, keep their changes inspectable, and let the Reader present the result without hiding the source behind a separate authoring database.
