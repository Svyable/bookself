# Agent-first Bookself

Bookself is designed so a person can understand and operate every step, but the person does not need to execute every step.

A capable coding or GitHub-connected agent should be able to receive an outcome-level request such as:

> Set this up for me.

or:

> Use Bookself to create a Desk and a public Shelf for me. Start my first book from this idea, research the claims that need evidence, choose a good reading style, validate it, and publish the first finished version to my Shelf.

and translate that request into the ordinary Bookself lifecycle without asking the person to manually copy folders, edit metadata tables, run release scripts, choose computer-shaped names, or learn Git terminology first.

The canonical machine-readable map is [`../bookself.json`](../bookself.json). Repository editing rules remain in [`../AGENTS.md`](../AGENTS.md). The publication research contract is [`research.md`](research.md).

## The product boundary

Agent-first does **not** mean agent-owned.

The durable artifacts remain:

- plain Markdown manuscript files;
- a canonical `research/` evidence and provenance trail inside each publication;
- normal Git repositories and history;
- a Desk for working drafts, research, and revision, private by default but optionally public or lower-profile;
- a public Shelf containing deliberate release snapshots;
- ordinary `README.md`, `imprint.json`, and optional `reader.json` files;
- the same Reader and Publishing Desk a human can inspect directly.

The agent is an operator of the protocol, not a required runtime dependency. If the original agent disappears tomorrow, the publication should still be readable, editable, researchable, diffable, exportable, and releasable.

## Outcome-oriented behavior

When the user asks for an end state, agents should optimize for the end state rather than turning Bookself's internal steps into a questionnaire.

A plain **“set this up for me”** is sufficient intent for the standard Bookself installation shape: a private-by-default repository named `desk` and an empty public repository named `shelf`, unless the user asks for other names or an existing setup already establishes them. A Desk may deliberately be public or lower-profile; that visibility choice does not turn it into a Shelf. Shelf is the canonical promoted release surface.

Creating an empty public Shelf during setup is not the same thing as publishing a manuscript. Moving working publication content from Desk to Shelf remains a separate consequential boundary and still requires publication intent.

For example, if the user says **“write my first book on my Desk and publish it to my Shelf”**, that is explicit intent to:

1. create or locate the Desk and Shelf;
2. validate them as one Bookself installation;
3. scaffold the publication, including its canonical `research/` trail;
4. make reasonable mechanical choices such as slug and starter format;
5. research material factual claims as needed and preserve durable provenance;
6. draft the requested content;
7. promote reader-relevant evidence into manuscript citations, references, figures, methodology, or back matter;
8. choose a reasonable Reader recommendation;
9. validate and preview when possible;
10. recheck time-sensitive evidence for the intended edition;
11. commit the release source on the Desk;
12. prepare the Shelf release;
13. review the release diff, including research and rights files;
14. commit and push the public Shelf release when the environment is authorized to do so.

Do not ask the user to approve each mechanical transition again. Do stop when a new action crosses a boundary the user did **not** authorize—for example making working material public when they asked only for a draft, changing repository visibility, changing rights, or redistributing third-party source files without a clear basis.

## Two execution environments

### Local coding agent

When the agent can execute local commands, clone or open the Bookself upstream repository and run:

```text
python3 scripts/bootstrap-workspace.py <workspace> --owner <github-owner> --json
```

The defaults create sibling directories named `desk` and `shelf`, stamp their roles, initialize separate Git repositories, and run the pair-level setup doctor. The JSON result gives stable paths plus `pairValidation.setupReady`. A normal completed bootstrap should return `true` there.

If another tool will initialize Git, `--no-git` may be used; pair validation is deliberately deferred until both repositories exist as separate Git worktrees.

Then work primarily on the Desk until the user has asked for a public release.

### GitHub-connected conversational agent

When the agent has authorized GitHub tools but no local shell, it should reproduce the **results** of the local tools using the same file contracts:

- create a private-by-default repository named `desk` and an empty public repository named `shelf` when repository-creation capability exists;
- honor an existing or explicitly requested public/lower-profile Desk rather than treating privacy as the definition of the role;
- copy/stamp the upstream files according to `scripts/stamp-instance.py` semantics;
- preserve `reader/` and `desk/` as shared UI;
- keep `books/`, root `README.md`, and `imprint.json` instance-owned;
- keep the blank starter library, including canonical `research/README.md` scaffolds, on Desk and off Shelf;
- make manuscript and research changes on the Desk;
- create a Shelf release as an independent snapshot rather than a live reference to Desk.

If the connected tool cannot create repositories, the correct fallback is narrow: complete every deterministic step the environment can perform, then ask for only the missing external action. Do not expand that capability gap into a Git tutorial, and do not pretend the repositories exist.

When repository metadata is available through the connected environment, verify that Shelf is public and record the Desk's actual visibility before reporting setup complete. Never treat an unadvertised public Desk as private.

## Validating the installation

Bookself has two levels of health checking.

For one repository:

```text
python3 scripts/doctor.py --root .
```

For the installation as a whole:

```text
python3 scripts/doctor-pair.py <desk-path> <shelf-path>
```

The pair doctor checks the invariants that matter specifically at the Desk/Shelf boundary:

- exact `desk` and `shelf` roles;
- separate Git worktrees and histories;
- byte-for-byte parity for shared `reader/` and `desk/` software;
- the complete blank starter library on Desk;
- no blank starters on Shelf;
- distinct repository/browser-storage identity;
- every publication present on Shelf is `Published` and cataloged.

Warnings do not by themselves block `setupReady`; structural or boundary errors do.

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

Every starter includes `research/README.md`. Preserve it when copying a starter into a real publication.

A user does not need to choose the computer-shaped details. Agents may infer a lowercase hyphenated slug, filenames, an initial Reader preset, ordinary mechanical metadata, and sensible organization within `research/`.

The user **does** own consequential editorial choices: claims, voice, facts, rights, attribution, intended audience, and whether work should become public. Ask only when those cannot safely be inferred from the conversation or supplied source material.

## Researching with an agent

Research is part of the publication, not hidden chain-of-thought and not a disposable browser session.

Before searching, read the relevant manuscript and existing `research/` trail. When new evidence materially informs the work, leave behind a durable record that identifies the source, explains what manuscript claim or question it bears on, distinguishes evidence from inference, preserves limitations and counterevidence, and notes when a fast-aging fact needs to be checked again.

Prefer primary and authoritative sources when they answer the question. Secondary sources are useful for synthesis, discovery, context, and competing interpretations. Do not confuse the prestige of a source with the strength of the specific inference being made.

A strong research change can conclude that the manuscript should **not** change. Recording a boundary, failed hypothesis, stale statistic, or useful counterexample is productive work because it prevents a later agent from repeating the same mistake.

Promote evidence a reader needs while reading into the manuscript: citations, footnotes, references, figures, methodology, or back matter. Keep the deeper ledger, claim checks, calculations, alternatives, and release review in `research/`.

Do not use `research/` as a copyright dump. Prefer links, bibliographic metadata, lawful short quotations, hashes, and original notes. Commit third-party source files only when redistribution is clearly authorized and provenance/license information is preserved.

See [`research.md`](research.md) for the complete contract.

## Writing with an agent

The goal is not to generate a giant disposable manuscript in one opaque write.

Prefer bounded, recoverable progress:

- establish the publication shape;
- read the relevant research trail;
- write a strong first chapter/piece;
- validate structure;
- continue in coherent chapter-sized changes;
- keep the publication README contents/count accurate;
- keep material factual provenance current as claims evolve;
- use Git history as checkpoints;
- read the result in Reader when the environment permits;
- revise based on the publication experience, not only the source text.

For voice-sensitive prose, apply the repository's human-prose skill and preserve user-supplied voice samples and constraints.

## Reader design

An agent may choose a named `reader.json` preset as a reasonable default when the user has not specified typography. The choice is an author recommendation only.

A reader's browser-local choices still win. An agent must not “solve” design consistency by disabling reader controls or persisting one reader's choices into repository content.

The deeper research trail is not automatically part of Reader chapter navigation. Keep the narrative experience intentional and move the evidence readers need in context into the manuscript. The repository remains the inspectable source of truth for the fuller trail and can support richer research surfaces later without changing the publication contract.

## Validation and release

On the Desk:

```text
python3 scripts/doctor.py --root .
```

Before release, recheck time-sensitive evidence that materially affects the intended edition and commit the Desk publication state that is being released.

Then from the Desk:

```text
python3 scripts/release-book.py <slug> <path-to-shelf>
```

The release helper prepares and verifies the complete Shelf publication snapshot—including `research/`—but intentionally stops before commit/push. If the user's outcome request explicitly includes publishing and the agent has authorized Git/GitHub write capability, the agent may review that prepared diff and complete the Shelf commit/push without asking the user to execute those mechanics.

If the user requested only drafting or review, do not release.

## Good one-prompt outcomes

A successful setup-only session can end this simply:

- Desk: `owner/desk`, with its actual visibility stated when relevant.
- Public Shelf: `owner/shelf`, currently empty.
- Pair validation: `setupReady`.
- Rights default for new publications: All Rights Reserved.
- First publication: not started yet.

A successful end-to-end publishing session can add:

- `books/the-working-title/` contains the drafted first edition plus its research trail.
- Reader style: `literary`, still fully reader-overridable.
- Material time-sensitive claims were rechecked for the release.
- Structural and rights validation passed.
- Desk release source committed at `<sha>`.
- Shelf snapshot published at `<url>` with manuscript, research, and rights provenance preserved.

The person should not need a transcript of every `mkdir`, metadata edit, or Git command unless they ask for one.

## Why keep the human workflow at all?

Because the scaffold is the specification.

The visual Studio, templates, scripts, docs, research trail, Reader, and Publishing Desk make the protocol:

- inspectable by humans;
- executable by local agents;
- reproducible by GitHub-connected agents;
- researchable and fact-checkable across agent handoffs;
- testable in CI without becoming dependent on CI;
- recoverable when an agent makes a bad choice;
- portable to future agent systems that do not exist yet.

The long-term goal is not “AI buttons everywhere.” It is a durable publishing system whose mechanics are explicit enough that a capable agent can reliably operate them on a person's behalf while leaving the reasoning-relevant evidence in ordinary files another person or agent can inspect.
