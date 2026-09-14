---
name: bookself-steward
description: Supervise Bookself publication work from durable repository state. Use to inspect current state, choose the next bounded publishing capability, reconcile stalled or changed work, and preserve Desk/Shelf intent boundaries without becoming the researcher, author, editor, or publisher by default.
---

# Bookself Steward

## Purpose

Supervise continuous agentic authorship from durable Bookself state.

The steward is not a mandatory manager agent and not a fixed workflow engine. It is the capability for answering:

> Given the user's outcome, the repository as it exists now, and the publication(s) that actually changed, what should happen next?

A single capable agent may use this skill before switching into research, authoring, editing, verification, media, production, or release work. A large deployment may use the same contract in a supervisor that dispatches bounded workers.

## When to use

Use this skill when:

- an agent inherits an unfamiliar Bookself workspace;
- a request spans more than one publishing lifecycle stage;
- repository state may have changed since the previous agent acted;
- a publication is stalled, failed, or ambiguous about its next step;
- a supervisor needs to select only the publications affected by a change;
- a large catalog needs reconciliation without rereading every manuscript;
- another skill has completed and the next action should be chosen from current state.

Do not use stewardship as an excuse to perform every specialist task in one giant reasoning pass. When the next job is clearly research, editing, rights review, reader review, production, or release, operate that bounded capability with its own standards.

## Required context

Before changing publication state:

1. Read repository `AGENTS.md`.
2. Read `bookself.json`.
3. Read `.agents/skills/README.md`.
4. For large-catalog work, read `docs/scaling-agentic-authorship.md` and `docs/publication-state.md`.
5. Identify the repository role from `imprint.json`.
6. Inspect the target publication state rather than assuming the previous agent completed what it intended.

For one publication, prefer:

```text
python3 scripts/publication_state.py <publication-id> --root . --json
```

For a Git change affecting an unknown subset of publications, prefer:

```text
python3 scripts/changed_publications.py <base> [head] --root . --json
```

Then inspect only the publications that need deeper reasoning unless a genuine global change requires broader fan-out.

## Inputs

The steward consumes:

- the user's requested outcome and consequential intent boundaries;
- repository role and Git state;
- affected publication IDs;
- publication-scoped state and blockers;
- available canonical skills/capabilities;
- prior durable research, media, rights, release, and edition artifacts;
- optional external orchestration state when the operator uses one.

Do not treat private chat history or an agent's memory as authoritative state when repository evidence can answer the question.

## Work

### 1. Narrow the scope

Determine which publication IDs actually require attention.

At small scale this may be one explicitly named work. At large scale derive the affected set from events, queue records, or Git diffs. Do not deeply inspect the whole catalog merely because it exists.

### 2. Inspect before acting

For each affected publication, establish at minimum:

- publication ID/path;
- repository role;
- current publication Status;
- catalog membership when relevant;
- whether the publication path is dirty;
- structural errors/warnings;
- relevant research/provenance state;
- rights state when the next operation touches rights or public release;
- current release provenance when a Shelf edition exists.

### 3. Decide the next bounded capability

Select work from the state, not from a stale predetermined graph.

Examples:

- missing evidence → research;
- supported thesis but weak structure → edit;
- major argument uncertainty → critique;
- stale material claim → verification;
- figure needed for comprehension → media/illustration;
- rendering/typography problem → publication design / reader experience;
- unknown third-party asset rights → rights review;
- structurally complete and release authorized → release preparation;
- failed deterministic check → repair or rerun the relevant bounded step.

It is valid to conclude that no action is needed.

### 4. Re-evaluate after meaningful changes

A publication is a changing object. Research can invalidate prose; editing can create new factual claims; production can reveal missing media; Reader review can expose structural problems.

After a meaningful bounded task, inspect durable state again before assuming the next planned step is still correct.

### 5. Prefer objective routing signals

Use deterministic findings for routing when available:

- missing files;
- invalid metadata;
- dirty release source;
- broken catalog state;
- rights-manifest failures;
- stale release checks;
- failed build/preflight;
- missing release provenance.

Do not invent fake numerical certainty for taste, originality, argument quality, or reader delight. Those require judgment skills.

## Durable outputs

Stewardship should primarily route work rather than create a second source of truth.

Durable outputs may include:

- normal publication changes produced by the bounded specialist skill chosen next;
- repaired Bookself structural state;
- operator-specific registry/queue state when that deployment already uses one;
- concise issue/blocker records when a problem cannot safely advance automatically.

Do not introduce a mandatory central registry, queue, database, or agent transcript into a normal Bookself repository merely to demonstrate stewardship.

## Invariants

After stewardship:

- Desk remains working source state;
- Shelf remains deliberate release state;
- an unpublished work is not made public without user intent;
- rights grants are not broadened without rightsholder intent;
- the steward does not silently reinterpret a global framework change as permission to rewrite every publication;
- publication IDs remain durable within the installation;
- expensive reasoning is scoped to publications that actually need it whenever possible;
- durable repository state remains sufficient for a future agent to resume.

## Validation

For affected publications, re-run the smallest relevant deterministic checks after mutation.

Useful commands include:

```text
python3 scripts/publication_state.py <slug> --root . --json
python3 scripts/doctor.py --root .
python3 scripts/rights-check.py --root .
```

Use pair validation when Desk/Shelf relationship or setup state is involved.

A steward may report a publication as blocked rather than forcing it forward when the next decision is genuinely ambiguous or consequential.

## Intent boundaries

Explicit user/rightsholder intent is required before:

- publishing or replacing a public Shelf edition when publication was not requested;
- making unpublished work public;
- changing repository visibility;
- changing licensing, copyright ownership, or AI-use grants;
- destructive history/repository deletion;
- sending publication content to a new external service when that use crosses existing rights/privacy boundaries.

Routine routing, inspection, validation, repair of reversible mechanical state, and bounded specialist work already implied by the user's requested outcome do not need repeated approval.

## Idempotency and retry behavior

Stewardship should be safe to rerun.

A retry should re-read current state, recognize work that already completed, and avoid duplicate releases, duplicate queue entries, duplicate catalog rows, or repeated distribution.

External orchestrators should use publication ID plus the relevant source commit/build/release identity as deduplication keys rather than assuming one scheduled run corresponds to one unique job.

## Handoff

Leave enough durable state that another unknown agent can determine:

- which publication(s) were in scope;
- what state currently blocks or enables progress;
- what bounded work completed;
- what still needs judgment or explicit intent;
- what commit/release identity represents the current source or published edition.

Do not require the next agent to reconstruct a private chain-of-thought or chat transcript.

## Completion standard

A stewardship pass is complete when:

- the affected publication set is correctly narrowed;
- current durable state has been inspected;
- the next bounded capability has been completed or clearly routed;
- deterministic blockers are resolved or explicitly recorded;
- consequential boundaries remain respected;
- no unnecessary full-catalog reasoning was performed;
- the repository/orchestration state is intelligible for the next pass.
