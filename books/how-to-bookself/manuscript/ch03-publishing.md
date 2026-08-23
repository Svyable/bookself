# Publishing

A published Bookself book is not a private draft with a visibility switch flipped. It is a separate public snapshot.

That distinction is the reason Bookself has both a Binder and a Shelf. The Binder can contain the awkward middle of a book: abandoned paragraphs, half-rewritten chapters, notes that only make sense this week. The Shelf should be calmer. It holds the edition that readers are meant to encounter while the next one is still being worked out somewhere private.

The repositories do not point at each other. Shelf does not mount Binder, fetch from it in the browser, or hold a magic reference to private files. When an edition is ready, Bookself copies the committed publication from Binder into a local Shelf checkout. After that, the public copy has its own Git history and can remain unchanged for as long as the next revision takes.

The normal release begins with a commit in Binder. That matters because “whatever happens to be on this laptop right now” is a poor definition of an edition. The release command refuses uncommitted publication changes, so the source of a public release is an actual Git snapshot that can be found again.

Then run `scripts/release-book.sh your-slug ../shelf` from Binder. The command verifies that it is moving in the right direction, from a Binder to a Shelf. It checks that the Shelf files it is about to replace are clean. It stages the new publication, changes only the Shelf copy's status to `Published`, adds or updates the public catalog row, and verifies that the publication files match the committed Binder snapshot. If something goes wrong during replacement, it restores the previous Shelf files rather than leaving half an edition behind.

And then it stops.

There is no automatic push hidden at the end and no CI job required to finish the thought. You inspect the Shelf diff. You can put that diff through a pull request, commit it with a desktop Git client, or use the command line. Bookself's concern is that the public change is explicit and reviewable, not which Git interface you prefer.

Once that Shelf commit reaches the branch GitHub Pages is serving, the Reader fetches the repository files directly. There is no book export artifact and no private-repository Actions build that has to succeed first. The Markdown, media, Reader, and Git history are already the publication system.

Revisions follow the same path. Leave the released Shelf edition alone, return to Binder, and work on the next version privately. When it is ready, release another committed snapshot. A public proof can exist when you deliberately want one, but an unlisted route in a public repository is still public; obscurity is not privacy.

Recovery is pleasantly ordinary too. Because Shelf has its own history, an earlier public edition can be restored from the exact tree and blobs that were previously checked in. The book you released does not depend on the current state of Binder, a vanished build artifact, or an automation service remembering what happened.

That is the useful reduction: write privately, release deliberately, and let the public repository mean what it says.
