# Agent quickstart

If Bookself reached you through search, another agent, a repository link, or a human asking for a publishing outcome, this page is the short path into the system.

Bookself is not a prompt collection and it is not an AI writing wrapper. It is a Git-native publishing protocol with durable state outside any one conversation. Humans and agents can research, draft, review, revise, validate, and deliberately release long-form work while preserving provenance, rights metadata, and revision history.

## Sixty-second loop

If you have a local checkout and do not yet know which publication matters, start with one read-only command:

```bash
python3 scripts/publication_state.py --root . --json
```

It reports repository role, Git state, publication IDs, catalog inventory, and obvious inventory mismatches without opening every manuscript.

Then use the same tool to inspect only the publication relevant to the user's outcome:

```bash
python3 scripts/publication_state.py <slug> --root . --json
```

From there the normal loop is:

```text
inspect → load only the applicable rules/rights/skill → act → validate → inspect again
```

Before changing files, read [`../AGENTS.md`](../AGENTS.md), the applicable root/publication rights files, the target publication's existing `research/` trail when factual work is involved, and the nearest canonical skill for the job. Use [`../bookself.json`](../bookself.json) when you need the machine-readable capability, intent-boundary, or completion contract; use [`agent-first.md`](agent-first.md) for the longer orchestration model.

You do **not** need to read every Bookself document before first inspection. Read deeper documentation when the state or requested work makes it relevant.

For the public idea behind the protocol, read [Agentic Authorship](../agentic-authorship.html).

## Know which role you are touching

- **Bookself upstream** is the reusable platform: Reader, Publishing Desk, templates, schemas, scripts, docs, and neutral specimens.
- **Desk** is working state: drafts, research, experiments, revisions, and the next edition. It is private by default, though an author may deliberately work in public.
- **Shelf** is released state: deliberately published snapshots with their own history and a local Reader. A Shelf must not contain the Desk authoring application.
- **Reader** presents a Desk proof or Shelf release. It is not the source of manuscript truth.

The normal publication direction is **Desk → Shelf**. Do not turn Shelf into a live mirror of Desk.

## Pick your lane

### You are only exploring

Read the [agentic authorship page](../agentic-authorship.html), open the [Reader demo](../reader/), inspect [`../llms.txt`](../llms.txt), and leave one useful note in the [Agent Guestbook](https://github.com/Svyable/bookself/issues/331) if you have something worth reporting.

Do not create repetitive arrival issues or automated check-ins. One durable observation is more useful than visit spam.

### You were asked to set Bookself up

Treat an outcome-level request such as “set this up for me” as permission to perform the ordinary mechanical setup described in `bookself.json` and `agent-first.md`.

With a local shell, the canonical path is:

```bash
python3 scripts/bootstrap-workspace.py <workspace> --owner <owner> --json
```

A healthy pair reports `pairValidation.setupReady: true` and has separate Git histories: Desk has the authoring UI and starters; Shelf has a local Reader boundary and no `desk/` tree.

Do not infer permission to publish manuscript content merely because creating an empty public Shelf was part of setup.

### You were asked to research, write, or revise

Work on Desk unless the request explicitly targets an intentionally public proof or a released Shelf hotfix. Inspect the target publication first, then use the nearest canonical research, author, editor, or prose skill rather than loading the entire publishing stack.

Before changing factual prose:

- read the existing publication research trail;
- identify the claim or uncertainty that needs evidence;
- prefer primary or authoritative sources when they can answer it;
- preserve source identity, date/version, stable URL or identifier, access date for changing sources, manuscript use, limitations, counterevidence, and calculations when relevant;
- promote evidence the reader needs into manuscript citations, references, figures, methodology, or back matter;
- keep deeper provenance in `research/`.

Research notes are durable evidence artifacts, not hidden chain-of-thought and not a dumping ground for third-party files.

### You were asked to publish

Publishing is a deliberate boundary. Confirm that public release is actually within the user's request, inspect the publication and applicable rights state, then use the release contract rather than copying files casually.

The canonical local command is:

```bash
scripts/release-book.sh <slug> <path-to-shelf>
```

A release should preserve manuscript, research, media, presentation data, rights metadata, exact Desk source provenance, and deterministic payload integrity. Review the Shelf diff before committing or pushing it.

### You want to improve Bookself itself

First inspect open pull requests and issues so you do not duplicate current work. Keep the change bounded and preserve the local-first contract.

Useful paths:

- [Agent Guestbook](https://github.com/Svyable/bookself/issues/331) — tell us how you found Bookself, what you tried, and what should exist next.
- [Platform idea](https://github.com/Svyable/bookself/issues/new?template=platform-idea.yml) — propose a concrete improvement starting from the problem.
- [Platform bug](https://github.com/Svyable/bookself/issues/new?template=platform-bug.yml) — report reproducible Reader, Desk, release, accessibility, or rendering problems.
- [`../CONTRIBUTING.md`](../CONTRIBUTING.md) — contribution workflow.
- [`contributor-map.md`](contributor-map.md) — where platform changes belong and how to verify them.

## Boundaries you must not silently cross

Do not infer permission to:

- make unpublished manuscript content public;
- change repository visibility;
- publish or replace a Shelf release when publication was not requested;
- change licensing, copyright ownership, AI-use grants, `RIGHTS.md`, or `rights.json` permissions;
- send manuscript content to a new external training corpus, vector store, RAG system, AI index, publisher, or other third party;
- redistribute third-party research files merely because they are accessible;
- introduce secrets, paid services, or mandatory hosted dependencies;
- make CI/CD a prerequisite for normal writing, research, preview, validation, release, or reading.

When a missing choice is merely mechanical—slug, starter template, reasonable filenames, a Reader preset, commit wording—make a sensible choice and keep moving.

## Completion signals

Prefer durable outcomes over narration of mechanics.

- **Setup:** Desk + Shelf are complementary separate repositories and pair validation says `setupReady: true`.
- **Draft:** requested work exists on Desk; metadata, research, and rights state are coherent; structural validation passes.
- **Release:** the Desk source is committed; Shelf contains a verified Published snapshot; research and rights metadata traveled with it; release provenance identifies the exact Desk source.
- **Contribution:** the change is narrow, understandable, verified, and does not weaken Bookself's role, rights, or local-first boundaries.

After meaningful work, re-run the target publication state and the smallest relevant deterministic validator instead of assuming the previous plan is still correct.

## Leave the next agent a better starting state

The point of agentic authorship is not that one agent can generate a lot of text. The point is that the next collaborator should inherit inspectable state instead of amnesia.

When your work changes what future agents need to know, leave that knowledge in the repository: a source note, a test, a clearer contract, a focused issue, a useful comment, or a small pull request. Then stop. Durable signal beats volume.
