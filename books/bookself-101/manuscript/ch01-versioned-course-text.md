# The Course Text as a Versioned Object

A professor preparing a course already works with versions, even when the software does not call them that. A reading list changes after a new article appears. A diagram gets corrected after a student notices a mislabeled axis. A paragraph that made sense in August becomes confusing in October. The course text is not a finished object so much as a sequence of decisions made visible to a class.

Bookself treats that sequence as part of the publication rather than as clutter around it.

**Learning objectives**

After working through this chapter, a student should be able to:

- distinguish a repository from an individual document;
- explain what a commit records and why a useful commit message matters;
- describe the different roles of a private Binder and a public Shelf;
- identify why a stable assigned edition can be useful during a semester;
- inspect the Markdown source behind a chapter in the Reader.

Imagine an instructor named Dr. Rivera teaching an introductory environmental-history course. She has written sixty pages of notes over several years. Some are polished lectures, some are reading summaries, and some are explanations she has revised repeatedly after seeing where students struggle. In a conventional folder, the files might be named `week-3-final.docx`, `week-3-final-revised.docx`, and `week-3-final-revised-2.docx`. The names tell her that change happened, but not much about why.

In Bookself, the course text is a repository. The repository is the whole project: manuscript files, figures, publication metadata, and the history of changes. A chapter is still just a file. The difference is that Git remembers each committed state of that file and the note attached to the change.

If Dr. Rivera corrects a paragraph after office hours, she might make a commit called `Clarify the difference between conservation and preservation`. Six months later, that note is more informative than `final-revised-2`. It also lets her compare the old paragraph with the new one instead of keeping duplicate documents around indefinitely.

**Key terms**

| Term | Meaning in this course |
|---|---|
| **Repository** | The project folder plus its recorded history. |
| **Commit** | A named save point containing a specific set of changes. |
| **Markdown** | Plain-text source used for chapters and other publication files. |
| **Binder** | The private working repository where drafts and the next edition can change. |
| **Shelf** | The public repository containing the released edition readers are meant to use. |
| **Reader** | The browser interface that turns the publication's Markdown into a reading experience. |

The Binder/Shelf distinction is especially useful in teaching. Suppose Dr. Rivera assigns the fall edition of her course text on September 1. During the semester, she notices several things she wants to improve for spring. If she edits the public copy every time she has a new thought, students can end up reading different versions of the same assigned passage without realizing it. Instead, the current Shelf edition can remain stable while she revises the next edition privately in Binder.

That does not mean a published text can never change. A typo or factual correction may justify a public hotfix. The point is that revision becomes deliberate. The professor can decide whether a change belongs in the current assigned edition or in the next one.

This is also why Bookself separates the publication source from the Reader. The Reader is not a second copy of the textbook. It fetches the same Markdown files that Git tracks. A student sees pages, navigation, search, and reading preferences; an instructor sees files and history. They are different views of the same publication.

**Worked example**

Consider a chapter with this source file:

```text
books/bookself-101/manuscript/ch01-versioned-course-text.md
```

The path tells us three useful things. The publication is `bookself-101`. The file belongs to its `manuscript` directory. The `ch01-` prefix gives the chapter a predictable place in the source tree. None of those details have to appear as technical furniture in the reading experience. The Reader can present the title simply as *The Course Text as a Versioned Object*.

The publication README serves as the manuscript hub. It records the title and publication metadata and, more importantly, gives an ordered contents list. That list is a contract between the source and the Reader: if an instructor adds a chapter, the new file and the contents entry should be reviewed together.

**Discussion questions**

1. What kinds of changes to a course text should happen immediately during a semester, and what kinds should wait for the next edition?
2. What does a meaningful commit message preserve that a timestamp or filename does not?
3. If students cite a passage from a course text, how could a stable public edition make that citation easier to interpret later?

**Lab: inspect the publication from both sides**

Open *Bookself 101* in the Reader and read the first few paragraphs. Then open the repository version of this chapter. Find the chapter title, one paragraph, and the contents entry that points to the file. The exercise is intentionally simple: notice that the reading surface and the source are not competing systems. They are two views of the same text.

For an instructor, that is the basic move Bookself makes possible. Write in plain files. Keep the history. Give students a stable reading surface. Revise the next edition without losing the one that was actually assigned.
