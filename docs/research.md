# Publication research

`research/` is Bookself's canonical publication-level evidence and provenance
component. It belongs inside the publication folder beside `manuscript/` and
`media/`:

```text
books/<slug>/
├── README.md
├── manuscript/
├── research/
│   ├── README.md
│   ├── ch03-example-claim.md
│   └── source-ledger.csv        # optional
├── media/
├── reader.json
├── RIGHTS.md
└── rights.json
```

The manuscript is what the reader reads. The research trail records how factual
claims, examples, calculations, quotations, and argument boundaries were
established. A Desk research trail is a living working apparatus; a Shelf
research trail is the edition-bound snapshot that accompanied the released
manuscript.

A release already copies the complete publication tree, so committed
`research/` files travel Desk → Shelf with the edition and remain frozen there
until the next deliberate release.

## Why it exists

A good research trail should improve four experiences at once.

**For the author**, it is durable working memory. Sources, dead ends, caveats,
calculations, and recheck notes survive beyond one browser session or one agent.
The next revision does not have to rediscover why a sentence was written the way
it was.

**For the reader**, it creates an inspectable path behind the prose without
turning every chapter into a literature review. Reader-facing citations,
footnotes, references, and acknowledgments still belong in the manuscript when
they improve the reading experience. The fuller research apparatus can remain
outside the narrative while staying available in the publication repository.

**For the researcher or reviewer**, it makes an edition auditable. A source can
be traced to the claim it supports or challenges, dated facts can be separated
from durable claims, transformations can be reproduced, and uncertainty can be
seen instead of silently edited away.

**For an agent**, it is shared, versioned context. Agents should read existing
research before repeating web searches, and should leave behind enough
provenance that another agent or human can verify, update, or disagree with the
work later.

## The canonical entry point

Every starter includes `research/README.md`. Treat that file as the human- and
agent-readable index to the publication's evidence trail.

It may be the entire research apparatus for a lightly sourced book. For larger
works, use it as a ledger and map to narrower files such as:

```text
research/
├── README.md
├── ch01-opening-statistics.md
├── ch06-housing-boundary.md
├── methods.md
├── release-review.md
└── source-ledger.csv
```

Do not require one filename scheme beyond the canonical `research/README.md`.
The useful unit is the claim, chapter, method, dataset, or release check—not an
arbitrary database schema.

## What to record

For material sources, record enough context for a later person or agent to know
what was actually relied on:

- author, organization, or publisher;
- title;
- publication or revision date when known;
- stable identifier such as DOI, ISBN, report number, docket, dataset version,
  or archival identifier when useful;
- source URL;
- access date for changing web sources;
- the manuscript claim, passage, chapter, figure, or calculation the source
  informs;
- the relevant observation or result in your own words;
- important limitations, assumptions, scope boundaries, or conflicting
  evidence;
- transformations or calculations needed to reproduce a derived number;
- a `recheck before release` note when the fact can age quickly.

Distinguish **what the source says** from **what the publication infers**. Do not
upgrade an estimate into a fact, an association into causation, a baseline into
a prediction, or one study into a consensus merely because the prose would be
cleaner that way.

## Agent research loop

When research is part of a writing or revision task, agents should normally use
this sequence:

1. Read the relevant manuscript and existing `research/` trail before searching.
2. Identify the factual claim, uncertainty, missing mechanism, or counterexample
   that needs evidence.
3. Prefer primary and authoritative sources when they can answer the question;
   use secondary sources for synthesis, discovery, context, or competing views.
4. Add or update the research trail with source identity, access date when
   relevant, manuscript use, and limitations.
5. Record counterevidence and argument boundaries instead of collecting only
   material that supports the draft.
6. Change the manuscript only to the extent justified by the evidence.
7. Promote evidence that readers need in order to follow or trust the argument
   into manuscript citations, footnotes, references, figures, or back matter.
8. Before release, recheck time-sensitive claims and unresolved research notes.

The research note and manuscript edit can land together when they are one
coherent claim-level change. Research may also land first when it establishes a
boundary or reveals that no manuscript change is warranted.

## Reader-facing evidence versus the full trail

`research/` is canonical publication content, but it is not automatically a
Reader chapter or part of the table of contents. This separation is deliberate.

Use the manuscript for evidence a reader needs while reading:

- citations and bibliography entries;
- footnotes;
- source acknowledgments;
- methodology needed to interpret the argument;
- figures and tables that carry part of the case.

Use `research/` for the deeper provenance layer:

- source ledgers;
- claim checks;
- research briefs;
- counterevidence;
- alternative interpretations;
- derivations and calculations;
- dated update notes;
- release review and fact-check notes;
- reproducibility instructions.

A future Reader or external tool may surface this apparatus more directly, so
write research files as durable publication artifacts rather than disposable
agent scratchpads.

## Desk and Shelf semantics

On a **Desk**, research is allowed to move ahead of the released edition. It can
contain new sources, open questions, and evidence for the next revision.

On a **Shelf**, research describes the released edition. Do not live-edit Shelf
research to reflect an unreleased Desk revision. Release the replacement
publication snapshot when the manuscript and research trail are ready together.

Desk visibility is an instance choice, not a semantic guarantee. A Desk is
private by default in the standard setup, but an author may deliberately keep a
Desk public or lower-profile. If the Desk repository is public, anything
committed under `research/` is public immediately even if it is not advertised
through the Shelf. Shelf remains the canonical promoted release surface.

## Rights and source-material boundary

A research trail is provenance, not a license to republish the sources it cites.

Prefer links, bibliographic metadata, lawful short quotations, hashes, and
agent-authored notes over copied third-party source files. Do **not** commit a
PDF, article copy, paywalled work, dataset, image, transcript, or other source
artifact merely because an agent can access it.

Commit third-party source files only when redistribution is clearly authorized
by the rightsholder, license, public-domain status, or another applicable basis,
and preserve source/license metadata. The publication's own `RIGHTS.md` does
not convert an included third-party work into the author's property or license.

Never put secrets, credentials, confidential research, unlawfully obtained
material, or personal data that should not be public into a publication research
trail. Repository visibility and Git history are publication/security facts,
not filing conventions.

See [Rights, copyright, and AI](rights-and-ai.md) for the broader Bookself rights
model.

## Release check

Before a deliberate Shelf release, the author or agent should be able to answer:

- Are material factual claims supported at the level the prose implies?
- Were time-sensitive claims rechecked recently enough for this edition?
- Are important counterexamples, uncertainty, and methodological boundaries
  preserved rather than silently discarded?
- Did reader-relevant evidence make it into the manuscript where appropriate?
- Does `research/README.md` make the deeper trail navigable?
- Are calculations and derived numbers reproducible enough for the claim being
  made?
- Are third-party files present only when redistribution is justified?
- Is anything in `research/` private, secret, or inappropriate for the Desk's
  actual repository visibility and the intended Shelf release?

Research completeness is proportional to the claims. A memoir may need almost
none; an evidence-heavy nonfiction book, report, or paper may need a substantial
trail. Bookself does not reward citation volume. It rewards inspectable reasons
for believing what the publication asks a reader to believe.
