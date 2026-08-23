# Teaching with Reviewable Change

Most course materials are collaborative even when one professor's name appears on the cover. Teaching assistants catch errors. Students ask questions that reveal weak explanations. Colleagues suggest better examples. A librarian may correct a citation. The practical problem is not whether other people will influence the text. It is how to let them do so without making the current edition difficult to trust.

**Learning objectives**

After working through this chapter, a student should be able to:

- explain why a branch is useful for a proposed change;
- distinguish a pull request from the published text itself;
- describe a simple instructor–TA review workflow;
- identify when an issue or comment is enough and when a source edit is more useful;
- explain why students can benefit from Git-backed materials without learning Git first.

Return to Dr. Rivera's environmental-history course. Her teaching assistant, Malik, notices that a paragraph in the assigned text gives two dates in a confusing order. He could send a message saying, “Page 34 is confusing.” That is useful, but it leaves Dr. Rivera to find the passage and reconstruct the intended fix. He could also edit the public book directly, which is faster in the moment but makes review harder and risks changing the assigned edition before anyone has checked the revision.

A branch gives Malik a third option. It is a temporary line of work based on a known version of the repository. He can make the small correction there without changing the current public text. A pull request then presents the proposed difference for review.

The important part is not the vocabulary. The important part is that the proposed text and the accepted text are visibly different states.

**Key terms**

| Term | Meaning in this course |
|---|---|
| **Branch** | A separate line of work used to prepare a change without immediately altering the current edition. |
| **Pull request** | A review surface showing a proposed set of changes before they are accepted. |
| **Issue** | A discussion item that can record a problem, question, or idea without editing the manuscript. |
| **Reviewer** | A person who inspects a proposed change before it becomes part of the accepted text. |
| **Diff** | A comparison that shows what was added, removed, or changed. |

For teaching materials, small changes are easier to review than large ones. If Malik corrects one date, rewrites three pages, changes two images, and reorganizes the bibliography in the same proposal, Dr. Rivera has to evaluate several different decisions at once. A narrow change makes the intellectual question clearer: is this correction accurate and does it improve the passage?

Bookself's one-chapter-per-PR convention is one way to preserve that clarity. It is not a claim that every course must organize work this way. It is a practical editorial constraint for a repository where chapters are meaningful review units.

Students do not need to participate at the same technical level. A student can read in the Reader and submit ordinary feedback. A teaching assistant or advanced student working on an editorial assignment might make a branch and propose the exact wording. The professor can choose the level of Git literacy appropriate to the course rather than making repository mechanics a prerequisite for reading.

That distinction matters in classes outside computer science. A historian may want students to practice source criticism, not terminal commands. A writing instructor may care about revision history but not about Git syntax. A lab course may want teams to review figures and methods while the instructor controls the released manual. Bookself can expose the history to the people who need it without forcing every reader to manage it.

**Worked example**

Suppose a sentence currently reads:

> The National Park Service was established in 1915, one year before Congress passed the Organic Act.

A student flags the sentence. Malik checks the source and finds that the National Park Service was created in 1916. He creates a branch, corrects the year, and opens a pull request with a short note explaining the source he checked. Dr. Rivera can review exactly one factual change. If she accepts it, the repository records both the correction and the reason it was made.

The history now carries editorial context that a silent file replacement would not.

**Discussion questions**

1. When is a comment or issue more appropriate than editing the manuscript directly?
2. What kinds of course-material changes deserve a second reviewer?
3. How might a visible diff change the quality of feedback compared with a general note such as “this section is unclear”?

**Lab: propose one bounded revision**

Choose one sentence in a course text that could be clearer. Write the original sentence, your proposed revision, and a two-sentence explanation of why the change helps. If you are working in a repository, make that revision on a branch and inspect the diff before opening a pull request. If you are not using Git yet, the paper exercise is enough: the goal is to separate the proposed change from the accepted text and make the reason inspectable.

A reviewable course text does not eliminate editorial judgment. It gives that judgment a place to happen before the class silently inherits the result.
