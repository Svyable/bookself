# Agent-first Bookself

Bookself is designed so a person can understand and operate every step, but the person does not need to execute every step.

A capable coding or GitHub-connected agent should be able to receive an outcome-level request such as:

> Set this up for me.

or:

> Use Bookself to create a Desk and a public Shelf for me. Start my first book from this idea, research the claims that need evidence, choose a good reading style, validate it, and publish the first finished version to my Shelf.

and translate that request into the ordinary Bookself lifecycle without making the person manually copy folders, edit metadata tables, run release scripts, choose computer-shaped names, or learn Git terminology first.

The canonical machine-readable map is [`../bookself.json`](../bookself.json). Repository editing rules remain in [`../AGENTS.md`](../AGENTS.md). The publication research contract is [`research.md`](research.md).

## The product boundary

Agent-first does **not** mean agent-owned.

The durable artifacts remain:

- plain Markdown manuscript files;
- a canonical `research/` evidence and provenance trail inside each publication;
- normal Git repositories and history;
- a Desk for working drafts, research, revision, and authoring tools;
- a public Shelf containing deliberate release snapshots and a local Reader;
- ordinary `README.md`, `imprint.json`, optional `reader.json`, and release provenance files;
- software a human can inspect directly.

The agent is an operator of the protocol, not a required runtime dependency. If the original agent disappears tomorrow, the publication should still be readable, editable, researchable, diffable, exportable, and releasable.

## Outcome-oriented behavior

When the user asks for an end state, optimize for the end state rather than turning internal mechanics into a questionnaire.

A plain **“set this up for me”** is sufficient intent for the standard installation shape: a private-by-default repository named `desk` and an empty public repository named `shelf`, unless the user asks for other names or an existing setup establishes them. A Desk may deliberately be public or lower-profile; visibility does not define the role. Shelf is canonical released state.

Creating an empty public Shelf during setup is not publication intent. Moving working content from Desk to Shelf remains a separate consequential boundary.

If the user says **“write my first book on my Desk and publish it to my Shelf”**, that authorizes the normal sequence:

1. create or locate the Desk and Shelf;
2. validate them as one complementary Bookself installation;
3. scaffold the publication and its `research/` trail on Desk;
4. make reasonable mechanical choices such as slug and starter format;
5. research material factual claims and preserve provenance;
6. draft the requested content;
7. promote reader-relevant evidence into citations/references/methodology where needed;
8. choose a reasonable Reader recommendation;
9. validate and preview;
10. recheck time-sensitive evidence for the intended edition;
11. commit the release source on Desk;
12. prepare the verified Shelf release and release provenance;
13. review the Shelf diff, including research, rights, and `release.json`;
14. commit and push the public Shelf release when authorized.

Do not ask the user to re-approve each mechanical transition. Stop when an action crosses a boundary they did not authorize—for example making working material public, changing repository visibility or rights, or redistributing third-party source files without a clear basis.

## The role boundary agents must preserve

Desk, Shelf, and Bookself are deliberately **not mirrors**.

### Desk

Desk contains:

- local Reader;
- local `desk/` Publishing Desk application;
- blank publication starters;
- working publications and next editions;
- authoring/release tooling.

### Shelf

Shelf contains:

- local Reader;
- released publication snapshots;
- release catalog/identity/history;
- a Shelf-owned Reader adapter and local framework core;
- **no `desk/` authoring application**.

Shelf must not execute the Bookself Pages deployment as a runtime dependency. Framework code is copied locally and committed to the instance.

### Bookself upstream

Bookself contains the reusable framework, templates, bootstrap/validation/release tooling, and neutral examples. It is a software source, not a publication source and not a production CDN for Shelf.

## Two execution environments

### Local coding agent

When the agent can execute local commands, clone/open Bookself upstream and run:

```text
python3 scripts/bootstrap-workspace.py <workspace> --owner <github-owner> --json
```

The defaults create sibling `desk` and `shelf` directories, stamp complementary roles, initialize separate Git repositories, and run pair validation. A normal completed bootstrap returns `pairValidation.setupReady: true`.

The healthy pair is intentionally asymmetric: Desk has authoring UI/starters; Shelf has no `desk/` tree and has a local Reader adapter/core boundary.

If another tool will initialize Git, `--no-git` may be used; pair validation is deferred until both repositories are independent Git worktrees.

Work primarily on Desk until the user authorizes public release.

### GitHub-connected conversational agent

When authorized GitHub tools are available but no local shell, reproduce the **results** of the local tools using the same contracts:

- create a private-by-default `desk` repository and empty public `shelf` when repository creation is available;
- honor an existing or explicitly requested public/lower-profile Desk;
- stamp role-specific software according to `scripts/stamp-instance.py` semantics;
- give Desk Reader + Publishing Desk UI + starters;
- give Shelf a local Reader boundary but **no `desk/` authoring tree** and no blank starters;
- keep `books/`, root `README.md`, `catalog.json`, and `imprint.json` instance-owned;
- make manuscript/research changes on Desk;
- create Shelf releases as independent verified snapshots rather than live references;
- never make Shelf import executable code from the upstream Bookself Pages deployment.

If the connected tool cannot create repositories, complete every deterministic step available and ask only for the genuinely missing external action. Do not turn that capability gap into a Git tutorial and do not pretend repositories exist.

When repository metadata is available, verify Shelf is public and record Desk's actual visibility before reporting setup complete. Never treat an unadvertised public Desk as private.

## Validating the installation

For one repository:

```text
python3 scripts/doctor.py --root .
```

For the installation as a whole:

```text
python3 scripts/doctor-pair.py <desk-path> <shelf-path>
```

The pair doctor checks the invariants at the Desk/Shelf boundary:

- exact `desk` and `shelf` roles;
- separate Git worktrees/histories;
- local Reader in both roles;
- Publishing Desk application and blank starters on Desk;
- **no Publishing Desk application and no blank starters on Shelf**;
- Shelf local Reader adapter/framework core boundary;
- distinct repository/browser-storage identity;
- every publication present on Shelf is `Published` and cataloged.

Warnings do not by themselves block `setupReady`; structural or ownership errors do.

## Framework updates

Framework updates and publication releases are separate operations.

With a local Bookself upstream checkout, target instances explicitly. A normal Desk update may target the Desk directly. A Shelf update must select the safe role-aware mode:

```text
python3 scripts/sync-ui.py <desk-path>
python3 scripts/sync-ui.py --shelf-safe <shelf-path>
```

The sync command preflights destinations before mutation. Whole-tree sync into `role=shelf` is rejected. Shelf-safe sync preserves Shelf-owned integration/publication state and updates the local Reader core instead of creating a runtime upstream dependency.

## Creating the first publication

Infer the closest publication family from the request:

| Intent | Starter |
|---|---|
| novel, nonfiction book, course text | `_TEMPLATE` |
| paper, whitepaper, research note | `_PAPER_TEMPLATE` |
| magazine or zine | `_MAGAZINE_TEMPLATE` |
| newspaper or gazette | `_NEWSPAPER_TEMPLATE` |
| journal or proceedings | `_JOURNAL_TEMPLATE` |
| newsletter or bulletin | `_NEWSLETTER_TEMPLATE` |
| anthology, chapbook, collection | `_ANTHOLOGY_TEMPLATE` |
| report | `_REPORT_TEMPLATE` |
| manual, handbook, guide | `_MANUAL_TEMPLATE` |
| comic or graphic narrative | `_COMIC_TEMPLATE` |

Every starter includes `research/README.md`. Preserve it when creating a real publication.

Agents may infer lowercase slugs, filenames, initial Reader preset, ordinary mechanical metadata, and sensible research-file organization. Users own consequential editorial choices: claims, voice, facts, rights, attribution, intended audience, and whether work becomes public.

## Researching with an agent

Research is part of the durable publication, not hidden reasoning and not a disposable browser session.

Before searching, read the relevant manuscript and existing `research/` trail. When evidence materially informs the work, leave a record that identifies the source, explains what claim/question it bears on, distinguishes evidence from inference, preserves limitations/counterevidence, and notes fast-aging facts for release recheck.

Prefer primary/authoritative sources when they answer the question. Secondary sources are useful for synthesis, discovery, context, and competing interpretations. A good research change may conclude that manuscript prose should not change.

Promote evidence a reader needs while reading into manuscript citations, footnotes, references, figures, methodology, or back matter. Keep the deeper ledger/calculations/alternatives/release review in `research/`.

Do not use `research/` as a copyright dump. Prefer links, bibliographic metadata, lawful short quotations, hashes, and original notes. Commit third-party files only when redistribution is clearly authorized and provenance/license information is preserved.

See [`research.md`](research.md).

## Writing with an agent

Prefer bounded, recoverable progress:

- establish publication shape;
- read the relevant research trail;
- write coherent chapter-sized changes;
- validate structure;
- keep publication README contents/count accurate;
- keep factual provenance current;
- use Git history as checkpoints;
- read the result in Reader when possible;
- revise from the publication experience, not only source text.

For voice-sensitive prose, apply the repository's human-prose skill and preserve user-supplied voice samples/constraints.

## Reader design

An agent may choose a named `reader.json` preset as a reasonable starting recommendation. Reader browser-local choices still win. Do not disable reader controls or persist one reader's preferences as publication content.

The deeper research trail is not automatically chapter navigation. Keep the reading experience intentional and promote evidence readers need in context into the manuscript.

## Validation and release

On Desk:

```text
python3 scripts/doctor.py --root .
```

Before release, recheck material time-sensitive evidence and commit the exact Desk publication state being released.

Then from Desk use the canonical transaction wrapper:

```text
scripts/release-book.sh <slug> <path-to-shelf>
```

The transaction prepares/verifies the complete Shelf snapshot—including `research/`, media, rights, and presentation—sets Shelf release state, updates catalog/public surfaces, and writes `books/<slug>/release.json` containing the exact Desk source commit plus deterministic payload integrity. It intentionally stops before commit/push.

`release.json` is release-transaction provenance; research release reviews are evidence/review artifacts and are not substitutes for the actual source identity used by the transaction.

If the user's outcome explicitly includes publishing and the agent has authorized Git/GitHub write capability, it may review the prepared diff and complete the Shelf commit/push. If the user requested only drafting/review, do not release.

## Good one-prompt outcomes

A successful setup-only session can report:

- Desk: `owner/desk`, with actual visibility when relevant;
- public Shelf: `owner/shelf`, empty and release-only;
- pair validation: `setupReady: true`;
- Shelf boundary: local Reader, no `desk/` authoring tree;
- rights default for new publications;
- first publication not started unless requested.

A successful publishing session can additionally report:

- publication slug and Desk source commit;
- research/recheck state for material claims;
- structural and rights validation;
- Reader recommendation;
- Shelf release provenance (`release.json` source commit/digest);
- public release location.

The person should not need a transcript of every filesystem/Git operation unless they ask.

## Why keep the human workflow at all?

Because the scaffold is the specification.

The visual Studio, templates, scripts, docs, research trail, Reader, and Publishing Desk make the protocol inspectable by humans, executable by local agents, reproducible by GitHub-connected agents, testable without becoming dependent on CI, recoverable when an agent makes a bad choice, and portable to future agent systems.

The goal is not “AI buttons everywhere.” It is a durable publishing system whose mechanics and ownership boundaries are explicit enough that a capable agent can reliably operate them on a person's behalf.
