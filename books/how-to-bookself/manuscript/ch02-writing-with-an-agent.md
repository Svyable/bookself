# Writing with an Agent

You can write here the slow way: open a Markdown file, change a sentence, make a commit. You can also hand the work to an agent and speak in ordinary language. The important part is that both approaches touch the same things. There is no hidden manuscript database behind the agent and no second version of the book waiting in a service somewhere.

That constraint is useful. An agent working on Bookself should be able to point to the file it changed, the diff it produced, and the Git commit that remembers the change. If it needs to invent a new configuration language, put prose into JavaScript, or spin up a publishing pipeline just to fix a paragraph, something has probably gone sideways.

The first question is not really what tool is writing. It is **where the manuscript is living**.

The private Desk is the working room. Drafts, experiments, and the next edition of a published book belong there. The public Shelf is different: it holds the edition readers are supposed to be reading now. An agent should not quietly turn the Shelf into a drafting workspace because it happens to be convenient to edit a public repository.

So a normal session is almost boring. Pick the book on the Desk. Read enough surrounding prose to hear its voice. Change the chapter that was asked for and leave the neighboring chapters alone. Commit the work. Serve the Desk locally and open the Reader if the prose needs to be proofed as pages rather than as source text.

None of that requires GitHub Actions. A private repository may have a limited automation budget, or no hosted automation at all. Bookself treats that as normal. Git keeps the history, the browser renders the Reader and Desk, and Python's standard library is enough for the release helper. CI can check things when it is useful, but the book cannot depend on a meter running somewhere else.

When the manuscript is ready to become the next public edition, the agent does not copy and paste a few files by intuition. The Desk publication is committed first. Then `scripts/release-book.sh` prepares the Shelf copy locally. It checks that the source and destination are the right kinds of Bookself instance, refuses dirty release paths, replaces the public publication snapshot, changes the Shelf copy to `Published`, updates the catalog, and verifies the copied files. It stops before commit or push so a human can still read the diff.

That stopping point matters. An agent can do a lot of useful mechanical work without becoming the person who silently decides that a manuscript is public. The release can be reviewed through a pull request, a Git client, or plain command-line Git. Bookself does not care which review surface you prefer.

The same restraint applies inside a sentence. An agent that “improves” every paragraph will eventually erase the reason the author wrote it. A better rule is smaller: understand the request, make the requested change, preserve the voice that was already there, and let Git remember enough that the decision can be revisited.

The agent, in other words, is another pair of hands at the Desk. The book is still the files.
