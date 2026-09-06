---
name: bookself-publisher
description: Operate Bookself end to end from natural-language intent. Use when a user asks an agent to create or configure Desk/Shelf repositories, research a publication, start a publication, write or structure manuscript content, choose Reader presentation, validate, preview, release, or publish a Bookself work without making the user execute the intermediate Git/file workflow manually.
---

# Bookself Publisher

## Purpose

Turn outcome-level publishing requests into ordinary Bookself artifacts and Git history.

Examples:

- “Set Bookself up for me.”
- “Set this up for me.”
- “Make me a Desk and Shelf.”
- “Write my first book on the Desk.”
- “Research and strengthen this chapter.”
- “Turn these notes into a Bookself course text.”
- “Publish the finished version to my Shelf.”
- “Use this Bookself repo as the model and do the whole thing for me.”

The user should not need to execute mechanical Bookself steps merely because the repository documents those steps. Treat the documented workflow as the protocol you operate on their behalf.

This skill is subordinate to the user's explicit instructions and repository-level `AGENTS.md`.

## Required reading

Before mutating a Bookself workspace:

1. Read `AGENTS.md`.
2. Read `bookself.json`.
3. Read `docs/research.md` when research, factual claims, sourcing, fact-checking, or release evidence is material.
4. Read `docs/agent-first.md` when orchestrating more than one lifecycle stage.
5. For voice-sensitive manuscript writing, also read `.agents/skills/human-prose/SKILL.md`.

## Core principle

**Optimize for the requested publishing outcome, not for exposing the workflow.**

If the user has clearly asked for an end-to-end result, perform the mechanical substeps needed to reach it without repeatedly asking them to approve details the agent can safely infer.

For a new standard setup, infer the repository names `desk` and `shelf`. Do not invent person-prefixed names unless the user asks. A normal setup request authorizes creating a private-by-default Desk and empty public Shelf, but does not authorize moving manuscript content onto Shelf.

A Desk may deliberately be public or lower-profile. Do not treat private visibility as the definition of the role, and never treat an unadvertised public Desk as secret. Shelf remains the canonical promoted release surface.

Do not infer across consequential boundaries the user did not authorize. In particular, do not publish working manuscript content merely because a Shelf exists, change repository visibility without intent, change rights, or redistribute third-party research source files without a clear basis.

## Environment detection

### Local agent

When local Git + Python are available, prefer canonical Bookself tools over hand-reimplementing their semantics.

For a new workspace:

```text
python3 scripts/bootstrap-workspace.py <workspace> --owner <owner> --json
```

Consume the returned JSON paths and require `pairValidation.setupReady` before reporting normal setup complete. The bootstrap defaults to sibling repositories/directories named `desk` and `shelf`.

For an existing pair, run:

```text
python3 scripts/doctor-pair.py <desk-path> <shelf-path>
```

### GitHub-connected agent

When operating through authorized GitHub APIs/tools, reproduce the durable result of the canonical tools:

- create `desk` as private by default unless the user or existing installation intentionally uses another visibility;
- create an empty `shelf` as public by default for a standard setup request;
- stamp `imprint.json` role and repository identity correctly;
- keep `reader/` and `desk/` shared and aligned;
- keep the blank starter library on Desk and off Shelf;
- preserve the canonical `research/README.md` scaffold in every copied publication starter;
- keep `books/`, root `README.md`, and `imprint.json` instance-owned;
- treat Shelf releases as copied snapshots, never live pointers into Desk;
- when repository metadata is available, verify Shelf public visibility and record the Desk's actual visibility before declaring setup complete.

If repository creation is unavailable, narrow the fallback to the actual capability gap. Complete every deterministic step that is available, then ask for only the missing external action. Do not turn that one blocker into a Git tutorial, and never claim an external resource exists when it does not.

## End-to-end protocol

### 1. Resolve intent

Infer when reasonable:

- standard repository names `desk` and `shelf`
- publication family
- slug
- mechanical metadata
- chapter filenames
- sensible organization within `research/`
- an initial Reader preset
- sensible commit messages

Ask only when the missing answer materially changes authorship, facts, rights, audience, manuscript publication intent, repository visibility, or another consequential choice.

### 2. Establish and validate Desk and Shelf

Prefer `scripts/bootstrap-workspace.py` locally. In connected environments, create equivalent repositories/files using available authorized tools.

A complete setup satisfies the `setupReady` contract in `bookself.json`: correct roles, separate Git repositories, aligned shared UI, starters on Desk but not Shelf, no unreleased Shelf publications, and distinct instance identity. Hosting visibility is checked when the environment exposes it; Shelf must be public for the normal release model, while Desk visibility follows the intended working mode.

Do not change Desk visibility merely to preview work. Preview locally when privacy matters.

### 3. Create the publication on the Desk

Use the nearest format contract from `bookself.json` and its mapped starter under `books/` (for example, `books/_TEMPLATE/` for a book or `books/_PAPER_TEMPLATE/` for a paper).

Create a normal lowercase hyphenated `books/<slug>/` folder. Fill the publication README metadata and contents. Preserve `research/README.md`. Add the Desk inventory link under root `## The books` so Reader and Publishing Desk can discover it.

If `reader.json` is useful, choose a named preset or tune explicit values. Remember: this is an author recommendation, not a reader lock.

### 4. Research before and alongside factual writing

`books/<slug>/research/` is canonical publication content and durable handoff context.

Before searching, read the relevant manuscript and existing research trail. When new evidence materially informs the requested work:

- identify the exact claim, uncertainty, mechanism, statistic, example, or counterexample that needs evidence;
- prefer primary and authoritative sources when they can answer the question;
- use secondary sources for synthesis, discovery, context, and competing interpretations;
- record source identity, date/version, URL or stable identifier, and access date for changing web sources;
- say which manuscript claim, passage, chapter, figure, or calculation the source informs;
- distinguish what the source establishes from what the publication infers;
- preserve limitations, uncertainty, counterevidence, and competing explanations;
- record transformations/calculations needed for derived numbers;
- mark fast-aging facts `recheck before release`.

Do not collect only evidence that agrees with the draft. A research change that establishes a boundary or shows that no manuscript change is warranted can be valuable on its own.

Promote evidence readers need while reading into manuscript citations, footnotes, references, figures, methodology, or back matter. Keep the deeper ledger, claim checks, derivations, alternatives, and release review in `research/`.

Research notes are not hidden chain-of-thought. They are concise, inspectable provenance artifacts another human or agent can verify and continue. Do not dump raw internal reasoning or conversational transcripts into the repo.

A research trail is also not a copyright dump. Prefer links, bibliographic metadata, lawful short quotations, hashes, and original notes. Commit third-party PDFs, datasets, images, transcripts, or other source files only when redistribution is clearly authorized and provenance/license information is preserved.

### 5. Write in recoverable increments

For substantive manuscript creation, work in coherent chapter/piece-sized changes and keep history useful. An end-to-end request may span many such changes; do not force the user to manually re-prompt after each one.

Keep README contents/counts consistent with manuscript files. Keep material research provenance current as factual claims evolve.

For authorial prose, apply the human-prose skill. Do not fabricate sources, quotations, biographical facts, or numerical precision to make a generated book feel complete.

### 6. Validate and experience the work

Run:

```text
python3 scripts/doctor.py --root .
```

When browser/local preview is available, serve the Desk and inspect both Reader and Publishing Desk. Fix structural or presentation problems before declaring the draft ready.

For evidence-heavy work, also review `research/README.md` as a handoff document: can another person or agent tell what sources mattered, where they were used, what remains uncertain, and what needs rechecking?

### 7. Commit the Desk state

A normal release must come from a committed Desk publication state. Create clear checkpoints in Git history.

When one factual research pass and one manuscript edit form a coherent claim-level change, they may land together. Research may also land first when it establishes the evidence boundary for a later edit.

### 8. Release only when intended

If public release is explicitly in scope, first recheck material time-sensitive claims marked for release review, then run:

```text
python3 scripts/release-book.py <slug> <path-to-shelf>
```

Review the prepared Shelf diff. The helper copies and verifies the complete publication tree—including `research/`—and stops before commit/push by design.

When the user's request explicitly includes publishing and the environment has authorized write capability, complete the Shelf commit/push/publication mechanics on their behalf. Do not bounce those mechanics back to the user merely because the helper stops before them.

If public release was not requested, stop at the Desk.

### 9. Preserve edition semantics

After release:

- Shelf manuscript + research are the frozen evidence-bearing release snapshot;
- Desk remains the working edition and may accumulate newer research immediately;
- do not live-update Shelf research to match unreleased Desk discoveries;
- publish a replacement snapshot when the manuscript and research trail for the next edition are ready together.

### 10. Report outcomes

For setup-only work, prefer a concise result like:

- Desk: `owner/desk`, with actual visibility stated when relevant
- Shelf: public `owner/shelf`, currently empty
- Pair validation: `setupReady`
- Rights default: All Rights Reserved for new real publications
- First publication: not started yet

For publication work, add the publication slug/title, what was drafted or researched, Reader recommendation, relevant commit SHA(s), research/recheck state when material, rights/structural validation state, and whether a public Shelf release exists.

Do not make the final response a transcript of shell commands unless the user asks for one.

## Reviewability rule

Bookself's small files and Git history are a safety feature for agentic work. Use them.

For a large first-draft request, prefer several coherent commits or review units rather than one giant mutation. This keeps bad generations reversible and lets another agent or human resume from a known point without reconstructing the whole session.

Research trails strengthen that handoff: they preserve evidence and uncertainty without requiring the next agent to inherit the previous agent's private reasoning process.

## Portability rule

Do not add an agent framework as a required dependency to make Bookself “agentic.” The protocol must remain usable by multiple current and future agents.

The durable interface is:

- repository files
- `AGENTS.md`
- `bookself.json`
- `books/<slug>/research/`
- standard Git
- standard-library Python helpers
- static Reader/Desk

Agent integrations may wrap this interface, but they must not replace it.
