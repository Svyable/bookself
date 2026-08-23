# Opening the Binder

This place is a binder. Each book is a folder. Each chapter is a page. GitHub keeps every version — who changed a sentence, when they changed it, and the note they left.

You do not need special software. You do not run a build. You write Markdown the way you would write a letter: a title at the top, then paragraphs.

![Git-native publishing flow from Markdown and media through Git history into the reader](../media/git-native-publishing.svg)

A chapter is one file. The title is the only heading. Everything after that is the writing — the way you'd speak it if you were sitting across a table.

Images work the same way. Put a PNG, JPG, WebP, or SVG in the book's `media/` folder, then point to it from Markdown. The picture is versioned with the words and served with the reader; there is no separate image host to configure.

![A media file beside a chapter, referenced with ordinary Markdown and served by the public reader](../media/hosted-media-flow.svg)

When you want a new chapter, add another file named like the others: `ch04-something-short.md`. Then add a line for it in the book's README. The README is the cover of the binder and the table of contents. Trust that list, not the file listing. GitHub sorts files alphabetically, so back-matter will not sit at the end. The two edits that put a book on the shelf are in [[ch03-publishing|Publishing]].

This sample book exists so the public reader has something to hold. Copy `books/_TEMPLATE/` when you start a real title. Overwrite these pages. Change the authors. Keep the Status on Drafting until you mean for strangers to find it on the shelf.

The public face of the binder is a Kindle-style reader. It does not replace GitHub. It is how a finished book is read: two pages, a lamp, a bookmark, the progress of an evening. The words it shows are these files, fetched as they stand.
