# Agent-first Bookself

Bookself is designed so a person can understand and operate every step, but the person does not need to execute every step.

A capable coding or GitHub-connected agent should be able to receive an outcome-level request such as:

> Set this up for me.

or:

> Use Bookself to create a private Desk and a public Shelf for me. Start my first book from this idea, choose a good reading style, validate it, and publish the first finished version to my Shelf.

and translate that request into the ordinary Bookself lifecycle without asking the person to manually copy folders, edit metadata tables, run release scripts, choose computer-shaped names, or learn Git terminology first.

The canonical machine-readable map is [`../bookself.json`](../bookself.json). Repository editing rules remain in [`../AGENTS.md`](../AGENTS.md).

## The product boundary

Agent-first does **not** mean agent-owned.

The durable artifacts remain:

- plain Markdown manuscript files;
- normal Git repositories and history;
- a private Desk for unpublished work and revision;
- a public Shelf containing deliberate release snapshots;
- ordinary `README.md`, `imprint.json`, and optional `reader.json` files;
- the same Reader and Publishing Desk a human can inspect directly.

The agent is an operator of the protocol, not a required runtime dependency. If the original agent disappears tomorrow, the publication should still be readable, editable, diffable, exportable, and releasable.

## Outcome-oriented behavior

When the user asks for an end state, agents should optimize for the end state rather than turning Bookself's internal steps into a questionnaire.

A plain **“set this up for me”** is sufficient intent for the standard Bookself installation shape: a private repository named `desk` and an empty public repository named `shelf`, unless the user asks for other names or an existing setup already establishes them. Do not personalize repository names merely because setup is being performed for a particular person.

Creating an empty public Shelf during setup is not the same thing as publishing a manuscript. Moving unpublished writing from Desk to Shelf remains a separate consequential boundary and still requires publication intent.

For example, if the user says **“write my first book on my Desk and publish it to my Shelf”**, that is explicit intent to:

1. create or locate the Desk and Shelf;
2. validate them as one Bookself installation;
3. scaffold the publication;
4. make reasonable mechanical choices such as slug and starter format;
5. draft the requested content;
6. choose a reasonable Reader recommendation;
7. validate and preview when possible;
8. commit the release source on the Desk;
9. prepare the Shelf release;
10. review the release diff;
11. commit and push the public Shelf release when the environment is authorized to do so.

Do not ask the user to approve each mechanical transition again. Do stop when a new action crosses a boundary the user did **not** authorize—for example making unpublished material public when they asked only for a draft.

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

- create a private repository named `desk` and an empty public repository named `shelf` when repository-creation capability exists;
- copy/stamp the upstream files according to `scripts/stamp-instance.py` semantics;
- preserve `reader/` and `desk/` as shared UI;
- keep `books/`, root `README.md`, and `imprint.json` instance-owned;
- keep the blank starter library on Desk and off Shelf;
- make manuscript changes on the Desk;
- create a Shelf release as an independent snapshot rather than a live reference to Desk.

If the connected tool cannot create repositories, the correct fallback is narrow: complete every deterministic step the environment can perform, then ask for only the missing external action—for example, “Create `desk` as private and `shelf` as public, then I can finish the setup.” Do not expand that capability gap into a Git tutorial, and do not pretend the repositories exist.

When repository metadata is available through the connected environment, verify that Desk is actually private and Shelf is actually public before reporting setup complete.

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

A user does not need to choose the computer-shaped details. Agents may infer a lowercase hyphenated slug, filenames, an initial Reader preset, and ordinary mechanical metadata.

The user **does** own consequential editorial choices: claims, voice, facts, rights, attribution, intended audience, and whether work should become public. Ask only when those cannot safely be inferred from the conversation or supplied source material.

## Writing with an agent

The goal is not to generate a giant disposable manuscript in one opaque write.

Prefer bounded, recoverable progress:

- establish the publication shape;
- write a strong first chapter/piece;
- validate structure;
- continue in coherent chapter-sized changes;
- keep the publication README contents/count accurate;
- use Git history as checkpoints;
- read the result in Reader when the environment permits;
- revise based on the publication experience, not only the source text.

For voice-sensitive prose, apply the repository's human-prose skill and preserve user-supplied voice samples and constraints.

## Reader design

An agent may choose a named `reader.json` preset as a reasonable default when the user has not specified typography. The choice is an author recommendation only.

A reader's browser-local choices still win. An agent must not “solve” design consistency by disabling reader controls or persisting one reader's choices into repository content.

## Validation and release

On the Desk:

```text
python3 scripts/doctor.py --root .
```

Before release, commit the Desk publication state that is being released.

Then from the Desk:

```text
python3 scripts/release-book.py <slug> <path-to-shelf>
```

The release helper prepares and verifies the Shelf snapshot but intentionally stops before commit/push. If the user's outcome request explicitly includes publishing and the agent has authorized Git/GitHub write capability, the agent may review that prepared diff and complete the Shelf commit/push without asking the user to execute those mechanics.

If the user requested only drafting or review, do not release.

## Good one-prompt outcomes

A successful setup-only session can end this simply:

- Private Desk: `owner/desk`.
- Public Shelf: `owner/shelf`, currently empty.
- Pair validation: `setupReady`.
- Rights default for new publications: All Rights Reserved.
- First publication: not started yet.

A successful end-to-end publishing session can add:

- `books/the-working-title/` contains the drafted first edition.
- Reader style: `literary`, still fully reader-overridable.
- Structural and rights validation passed.
- Desk release source committed at `<sha>`.
- Shelf snapshot published at `<url>`.

The person should not need a transcript of every `mkdir`, metadata edit, or Git command unless they ask for it.

## Why keep the human workflow at all?

Because the scaffold is the specification.

The visual Studio, templates, scripts, docs, Reader, and Publishing Desk make the protocol:

- inspectable by humans;
- executable by local agents;
- reproducible by GitHub-connected agents;
- testable in CI without becoming dependent on CI;
- recoverable when an agent makes a bad choice;
- portable to future agent systems that do not exist yet.

The long-term goal is not “AI buttons everywhere.” It is a durable publishing system whose mechanics are explicit enough that a capable agent can reliably operate them on a person's behalf.
