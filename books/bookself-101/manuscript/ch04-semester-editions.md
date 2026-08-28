# Semester Editions and Release

A course has a calendar even when a book does not. Students need to know which reading was assigned on a particular week, while instructors need room to improve the material as the course reveals its weak spots. Those needs pull in different directions: stability for the class, revision for the author.

Bookself's Desk and Shelf model is a way to keep both.

**Learning objectives**

After working through this chapter, a student should be able to:

- distinguish the working edition of a course text from the assigned public edition;
- describe a simple semester release process;
- explain why a public Shelf should not be used as the normal drafting workspace;
- identify the difference between an urgent public correction and a next-edition revision;
- describe how Git history supports recovery of an earlier assigned edition.

At the start of a semester, Dr. Rivera has a version of her course text she is prepared to assign. She releases that edition to the public Shelf and links the Reader from the syllabus. Students do not need access to her private notes, half-written examples, or the chapter she is reconsidering for spring. They need the edition she actually assigned.

During the fall, her private Desk keeps moving. She rewrites an explanation after a difficult class discussion. She saves a stronger map for next year. A teaching assistant proposes a new primary-source example. None of those changes have to alter what the current students see immediately.

**Key terms**

| Term | Meaning in this course |
|---|---|
| **Working edition** | The private Desk copy being drafted or revised for a future release. |
| **Released edition** | The committed public Shelf snapshot readers are meant to use. |
| **Release** | The deliberate operation that prepares a verified copy of a committed Desk publication for the Shelf. |
| **Hotfix** | A small public correction intentionally applied to the currently released edition. |
| **Rollback** | Restoring an earlier known-good public state from Git history. |

The normal release begins only after the Desk version has been committed. From the private Desk checkout, an instructor can prepare the Shelf replacement with:

```sh
scripts/release-book.sh bookself-101 ../shelf
```

The command runs locally. It checks that the source is a Desk and the destination is a Shelf, refuses relevant uncommitted changes, copies the publication snapshot, sets the Shelf copy to `Published`, updates the public catalog, verifies the copied publication, and stops before commit or push.

That final pause is important. Release preparation is not the same thing as publication. The instructor can inspect the public diff before deciding to commit and push it. A department can use a pull request for that review if it wants one; an individual instructor can use an ordinary local Git review. Bookself does not require a private-repository GitHub Actions job to move the book from Desk to Shelf.

A stable Shelf does not mean errors must remain visible until the next semester. Suppose Dr. Rivera discovers that a map caption names the wrong river. She may decide that the correction matters to the current class and make an explicit public hotfix. The useful question is not whether public text can change. It is whether the change is intentional enough that the instructor can explain which edition students were expected to read.

More substantial revisions usually belong in the next working edition. If a chapter is being reorganized, if examples are changing, or if a new argument is still under review, the Desk is the safer place to work. Changing a public book to `Drafting` does not make it private; it merely changes how the Reader catalogs it while the raw repository remains public.

Git history gives the course another useful property: an earlier public edition is recoverable. If a release accidentally introduces a bad chapter or removes material that should have remained assigned, the Shelf's earlier commit contains the previous files. Recovery can use that historical public state rather than guessing what the Desk looked like at the time.

The same history can help with academic citation. A syllabus may link the current Reader because that is convenient for students, while a research project that needs exact provenance can record a specific public commit or tagged release. The simple reading path and the precise archival path do not have to be the same URL.

There are also things a public course text should not contain. Grades, private student records, unpublished student submissions, confidential peer-review notes, and credentials do not become safe because they sit beside a textbook. Bookself's public Shelf is a publishing surface, not a student-record system or secrets store.

**Worked example**

Dr. Rivera teaches the fall edition from September through December. She collects revisions on the Desk during those months but leaves the assigned Shelf text stable except for two documented factual corrections. In January she reviews the Desk changes, commits the new course-text state, runs the local release command, inspects the Shelf diff, and publishes the spring edition. The fall version remains recoverable in Shelf Git history even though the Reader now opens the spring text by default.

The workflow is not complicated, but it makes an editorial fact explicit: “what I am writing now” and “what I assigned to students” are not always the same object.

**Discussion questions**

1. Which kinds of corrections would you make during a live semester, and which would you defer to the next edition?
2. When would a course need a specific commit or release identifier rather than a link to the current Reader?
3. What information belongs in a public course-text repository, and what should remain somewhere else entirely?

**Lab: plan a semester release**

Write a short release plan for a course text you know. Name the moment when the public edition becomes the assigned edition, who is allowed to approve changes during the semester, what counts as a hotfix, and when the next edition is released. If you have a local Bookself Desk and Shelf, run the release command on a small test publication and inspect the resulting Shelf diff without committing it.

The result is a textbook with two useful tempos. Students get the slower tempo of an assigned edition. Authors and instructors keep the faster tempo of revision. Git remembers both.
