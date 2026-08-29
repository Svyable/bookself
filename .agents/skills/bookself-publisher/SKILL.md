---
name: bookself-publisher
description: Operate Bookself end to end from natural-language intent. Use when a user asks an agent to create or configure Desk/Shelf repositories, start a publication, write or structure manuscript content, choose Reader presentation, validate, preview, release, or publish a Bookself work without making the user execute the intermediate Git/file workflow manually.
---

# Bookself Publisher

## Purpose

Turn outcome-level publishing requests into ordinary Bookself artifacts and Git history.

Examples:

- “Set Bookself up for me.”
- “Make me a Desk and Shelf.”
- “Write my first book on the Desk.”
- “Turn these notes into a Bookself course text.”
- “Publish the finished version to my Shelf.”
- “Use this Bookself repo as the model and do the whole thing for me.”

The user should not need to execute mechanical Bookself steps merely because the repository documents those steps. Treat the documented workflow as the protocol you operate on their behalf.

This skill is subordinate to the user's explicit instructions and repository-level `AGENTS.md`.

## Required reading

Before mutating a Bookself workspace:

1. Read `AGENTS.md`.
2. Read `bookself.json`.
3. Read `docs/agent-first.md` when orchestrating more than one lifecycle stage.
4. For voice-sensitive manuscript writing, also read `.agents/skills/human-prose/SKILL.md`.

## Core principle

**Optimize for the requested publishing outcome, not for exposing the workflow.**

If the user has clearly asked for an end-to-end result, perform the mechanical substeps needed to reach it without repeatedly asking them to approve details the agent can safely infer.

Do not infer across consequential boundaries the user did not authorize. In particular, do not publish private manuscript content merely because a Shelf exists.

## Environment detection

### Local agent

When local Git + Python are available, prefer canonical Bookself tools over hand-reimplementing their semantics.

For a new workspace:

```text
python scripts/bootstrap-workspace.py <workspace> --owner <owner> --json
```

Consume the returned JSON paths and continue on the Desk.

### GitHub-connected agent

When operating through authorized GitHub APIs/tools, reproduce the durable result of the canonical tools:

- Desk should be private by default.
- Shelf should be public only when the user intends public publication.
- Stamp `imprint.json` role and repository identity correctly.
- Keep `reader/` and `desk/` shared.
- Keep `books/`, root `README.md`, and `imprint.json` instance-owned.
- Treat Shelf releases as copied snapshots, never live pointers into Desk.

If repository creation or another required external action is unavailable in the current toolset, do every deterministic step that is available and state the precise remaining capability gap. Never claim an external resource exists when it does not.

## End-to-end protocol

### 1. Resolve intent

Infer when reasonable:

- publication family
- slug
- mechanical metadata
- chapter filenames
- an initial Reader preset
- sensible commit messages

Ask only when the missing answer materially changes authorship, facts, rights, audience, public/private intent, or another consequential choice.

### 2. Establish Desk and Shelf

Prefer `scripts/bootstrap-workspace.py` locally. In connected environments, create equivalent repositories/files using available authorized tools.

Do not expose Desk content for preview. Preview private work locally or through an already-private environment.

### 3. Create the publication on the Desk

Use the nearest format contract from `bookself.json` and its mapped starter under `books/` (for example, `books/_TEMPLATE/` for a book or `books/_PAPER_TEMPLATE/` for a paper).

Create a normal lowercase hyphenated `books/<slug>/` folder. Fill the publication README metadata and contents. Add the Desk inventory link under root `## The books` so Reader and Publishing Desk can discover it.

If `reader.json` is useful, choose a named preset or tune explicit values. Remember: this is an author recommendation, not a reader lock.

### 4. Write in recoverable increments

For substantive manuscript creation, work in coherent chapter/piece-sized changes and keep history useful. An end-to-end request may span many such changes; do not force the user to manually re-prompt after each one.

Keep README contents/counts consistent with manuscript files.

For authorial prose, apply the human-prose skill. Do not fabricate sources, quotations, or biographical facts to make a generated book feel complete.

### 5. Validate and experience the work

Run:

```text
python scripts/doctor.py --root .
```

When browser/local preview is available, serve the Desk and inspect both Reader and Publishing Desk. Fix structural or presentation problems before declaring the draft ready.

### 6. Commit the Desk state

A normal release must come from a committed Desk publication state. Create clear checkpoints in Git history.

### 7. Release only when intended

If public release is explicitly in scope:

```text
python scripts/release-book.py <slug> <path-to-shelf>
```

Review the prepared Shelf diff. The helper stops before commit/push by design.

When the user's request explicitly includes publishing and the environment has authorized write capability, complete the Shelf commit/push/publication mechanics on their behalf. Do not bounce those mechanics back to the user merely because the helper stops before them.

If public release was not requested, stop at the Desk.

### 8. Report outcomes

Prefer a concise result summary containing durable facts:

- Desk location/repository
- Shelf location/repository
- publication slug/title
- what was drafted
- Reader recommendation
- validation state
- relevant commit SHA(s)
- whether a public Shelf release exists and where
- any genuine blocker that remains

Do not make the final response a transcript of shell commands unless the user asks for one.

## Reviewability rule

Bookself's small files and Git history are a safety feature for agentic work. Use them.

For a large first-draft request, prefer several coherent commits or review units rather than one giant mutation. This keeps bad generations reversible and lets another agent or human resume from a known point without reconstructing the whole session.

## Portability rule

Do not add an agent framework as a required dependency to make Bookself “agentic.” The protocol must remain usable by multiple current and future agents.

The durable interface is:

- repository files
- `AGENTS.md`
- `bookself.json`
- standard Git
- standard-library Python helpers
- static Reader/Desk

Agent integrations may wrap this interface, but they must not replace it.
