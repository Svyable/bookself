# Canonical Bookself skills

Bookself skills are portable operational specifications for professional publishing work.

They are not a mandatory multi-agent framework, not a job-title hierarchy, and not a fixed workflow graph. One agent may perform many skills; many agents may share one publication; an external orchestrator may choose different skill sequences as the work changes.

The durable interface is the repository state plus these skill contracts.

## Choose the smallest skill that fits

Do not load every skill. Inspect repository/publication state first, then load the one nearest capability. Add another skill only when the work actually crosses that boundary.

| Need | Start with |
|---|---|
| You inherited unfamiliar, changed, stalled, or multi-stage work and need to decide what happens next | `bookself-steward` |
| The user asked for an end-to-end Bookself outcome and no narrower skill covers the job | `bookself-publisher` |
| The work is specifically about prose voice, rhythm, specificity, or removing generic/synthetic writing | `human-prose` |
| The work is covers, edition production, PDF/EPUB/print geometry, exports, or production preflight | `publishing-production` |

`bookself-publisher` is the broad fallback, not a prerequisite for every task. `bookself-steward` routes work; it should hand off to the bounded capability once the next job is clear.

If no canonical skill fits, use the repository contracts directly and leave the gap visible rather than pretending an unrelated skill applies.

## Why skills exist

A capable agent can already write prose or edit files. Bookself skills exist to encode the less obvious parts of competent full-chain authorship:

- what state to inspect before acting;
- what evidence and provenance must survive;
- what a good result looks like;
- which files are authoritative;
- which boundaries require explicit user intent;
- which changes are reversible and routine;
- how to validate a result;
- how to leave the work intelligible for the next unknown agent.

The goal is not to force agents into Bookself-specific orchestration. The goal is to make real publishing practice discoverable and composable.

## Canonical skill contract

Every canonical `SKILL.md` should answer the following questions clearly.

### Purpose

What professional publishing capability does this skill provide?

The purpose should describe the outcome, not merely a persona. Prefer “verify factual claims and release freshness” over “act as a fact checker.”

### When to use

State the situations that should trigger the skill and the situations where another skill or no action is more appropriate.

### Required context

List the durable state that must be inspected before mutation. Depending on the skill this may include:

- repository `AGENTS.md`;
- `bookself.json`;
- publication README/metadata;
- manuscript files;
- `research/`;
- media/cover sources;
- `RIGHTS.md` / `rights.json`;
- `reader.json`;
- current Shelf release/provenance;
- relevant Git history;
- target-platform requirements.

A cold agent should not need hidden conversational context to use the skill well.

### Inputs

Describe the facts, files, publication state, or user intent the skill consumes.

Do not require invented metadata merely to satisfy the skill.

### Work

Describe competent practice rather than generic encouragement.

For judgment-heavy skills, explain what to test, what mistakes to avoid, what competing evidence or interpretations to consider, and when no change is the correct result.

For deterministic skills, define the checks and transformations precisely enough to be repeatable.

### Durable outputs

State what repository artifacts may be created or changed.

Prefer durable publication state over chat-only conclusions. Research should leave provenance. Media work should preserve source/provenance. Release work should leave release provenance. Verification should leave enough evidence for another agent to understand what was checked.

### Invariants

State what must remain true after the skill runs.

Examples:

- Shelf never gains Desk authoring state;
- rights are not broadened without rightsholder intent;
- generated derivatives do not replace canonical source files;
- research provenance is preserved;
- a release identifies its exact Desk source state;
- reader-local preferences are not silently persisted as publication content.

### Validation

Explain how another agent or deterministic tool can test the result.

Prefer objective checks where possible. Do not turn taste or editorial judgment into fake numerical certainty.

### Intent boundaries

State the consequential actions that require explicit user/rightsholder intent.

Common boundaries include:

- making unpublished material public;
- changing repository visibility;
- changing rights/licensing grants;
- destructive history deletion;
- distributing content to a new third party;
- publishing/replacing a public release when publication was not requested.

### Idempotency and retry behavior

For skills likely to be used by automated workers, describe whether rerunning the skill is safe and what identity/state prevents duplicate effects.

A retry should not normally create duplicate editions, duplicate metadata records, duplicate catalog entries, or accidental repeated distribution.

### Handoff

Describe what the next unknown agent needs to know from durable repository state.

Do not rely on private chain-of-thought, ephemeral chat context, or one agent's memory.

### Completion standard

State what “done” means in inspectable terms.

A completion standard should make it possible for another agent to distinguish complete, blocked, failed, and judgment-pending work.

## Skills are capabilities, not a required order

The canonical publishing vocabulary may include responsibilities such as:

- steward/orchestration;
- research;
- authorship;
- human prose;
- editing;
- critique;
- fact verification;
- media;
- illustration;
- publication design;
- reader experience;
- accessibility;
- rights;
- metadata;
- publishing production;
- release;
- edition maintenance.

Do not encode this list as a mandatory linear pipeline.

A plausible publication path might be:

```text
research → author → editor → verifier → release
```

Another may be:

```text
author → critic → research → restructure → illustration → reader-experience → verifier → release
```

Another may involve one agent applying several skills in a single bounded change.

Bookself should preserve the contracts that make those paths safe, not prescribe the orchestration graph.

## Skill composition at scale

In large installations, a supervisor or event-driven worker system may use skill names as capabilities.

A bounded job should ideally receive:

- publication ID;
- exact relevant source state/commit;
- requested capability;
- known blockers or reason for the job;
- any explicit user intent relevant to consequential actions.

The worker then:

1. inspects durable publication state;
2. applies the skill;
3. validates the result;
4. records durable outputs or verification state;
5. reports complete / blocked / failed / needs-judgment;
6. leaves the publication safe to inspect or retry.

The queue/orchestrator is not publication truth. Git and publication artifacts remain authoritative.

See [`docs/scaling-agentic-authorship.md`](../../../docs/scaling-agentic-authorship.md) for the optional large-catalog operating model.

## Current canonical skills

The routing table above is the current canonical set. The skill library may become more granular over time. Until then, existing broader skills may cover several responsibilities.

## Quality bar

A Bookself skill should be useful to an unfamiliar capable agent that arrives with no private conversation history.

If a skill is only a persona prompt, it is not finished.

If it cannot say what state to inspect, what artifacts to leave, what boundaries to preserve, and how another agent can verify the result, it is not yet a canonical Bookself skill.
