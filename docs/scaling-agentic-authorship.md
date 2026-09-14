# Scaling agentic authorship

Bookself should remain useful for one person publishing one work from a laptop, and it should not become architecturally confused when an operator manages thousands or eventually hundreds of thousands of publications.

The scaling rule is simple:

> **Scale by narrowing work to the publications that changed, not by making a larger agent inspect the whole library more aggressively.**

Bookself's durable publication protocol remains Git-native and local-first. Large deployments may add an orchestration plane around that protocol, but the orchestration plane is optional infrastructure rather than the source of publication truth.

## Protocol versus orchestration

Bookself separates two concerns.

### Publication protocol

The protocol is the portable baseline:

- Desk owns working source state;
- Shelf owns deliberate released state;
- Git records recoverable history;
- publication files carry manuscript, research, media, rights, presentation, and metadata;
- canonical skills describe competent publishing work;
- release provenance identifies the exact source state used for a published edition;
- Reader makes released work useful to readers.

A single author should be able to operate this with ordinary Git, files, a browser, and Bookself's local helpers.

### Orchestration plane

A large operation may add:

- a publication registry;
- an event queue;
- workers;
- schedulers/reconciliation jobs;
- dashboards and metrics;
- batching and throttling;
- exception handling;
- external build/distribution systems.

Those systems coordinate work. They do not become the canonical manuscript, research trail, rights record, release snapshot, or edition history.

If the orchestration service disappears, the publications should remain inspectable, recoverable, and releasable from their durable Bookself state.

## Do not scan every book

At small scale, an agent can inspect the whole working library when useful. At large scale, full-catalog manuscript reasoning is the wrong primitive.

Treat every publication as a durable object with a stable identity and explicit operational state. An implementation might model states such as:

```text
draft
  ↓
editorial-ready
  ↓
validated
  ↓
queued
  ↓
building
  ↓
published
```

with orthogonal failure/blocking states such as:

```text
blocked
failed
needs-review
```

Bookself should not require one universal state machine for every deployment, but it should make publication identity, current source state, release state, blockers, and provenance sufficiently legible that an external orchestrator can maintain one safely.

## Publication registry

At scale, maintain a compact machine-readable record per publication rather than deriving every operational fact by repeatedly reading the manuscript.

Useful fields may include:

- stable publication ID;
- canonical Desk path;
- canonical Shelf path or release target;
- title and contributors;
- edition/version identity;
- publication state;
- last relevant Desk commit;
- last validated commit;
- last successful release/build;
- release source commit;
- artifact hashes;
- identifiers such as ISBN, DOI, ISSN, or other domain identifiers when real;
- requested output formats;
- distribution targets;
- current blockers;
- timestamps for checks that can become stale.

The registry is an operational index. It must not silently replace publication-owned source metadata or invent identifiers that do not exist.

## Events, not periodic full reasoning

Large installations should enqueue work when meaningful state changes.

Examples:

- manuscript or research commit changes a publication;
- metadata changes;
- new media arrives;
- an editorial/release gate changes;
- a build fails;
- a scheduled release time becomes active;
- a shared Reader/template change intentionally fans out to affected publications.

The preferred shape is:

```text
Desk
  ↓
publication registry
  ↓
event queue
  ↓
validation / editorial / production / release workers
  ↓
Shelf
  ↓
distribution targets
```

A periodic supervisor remains useful, but its job changes. It should reconcile global state, detect stalled work, enqueue missing jobs, resolve routine mechanical failures, and surface genuine exceptions. It should not reread every manuscript every hour.

## Reconciliation is a safety net

Event systems miss things. State drifts. Workers crash.

A scalable deployment should therefore combine event-driven work with periodic reconciliation.

For example:

- commits enqueue affected publication IDs immediately;
- hourly reconciliation checks for missed/stalled transitions and queue health;
- nightly or weekly integrity sweeps verify broader catalog invariants;
- expensive manuscript reasoning runs only for publications that need it.

At 10,000 publications, scanning 10,000 small registry records is different from deeply reasoning over 10,000 manuscripts. Keep those operations separate.

## Workers should be bounded and idempotent

Workers should have narrow responsibilities and be safe to retry.

A deployment may have workers for:

- structural/schema validation;
- research/fact-check work;
- editorial review;
- media/illustration processing;
- accessibility checks;
- EPUB/PDF/print/web production;
- Shelf release preparation;
- post-release verification;
- distribution adapters.

A worker should consume a publication ID plus durable source state, perform a bounded skill, record what it changed or verified, and leave the publication in a state another worker can inspect.

The same job running twice should not create two editions, duplicate catalog entries, silently mutate historical releases, or corrupt publication state.

## Skills are worker capabilities, not workflow nodes

Bookself's canonical skills should remain composable.

Do not encode a mandatory graph such as:

```text
research → author → editor → illustrator → publisher
```

A supervisor may choose research after editing. A verifier may send a publication back to research. Reader-experience review may trigger illustration or structural editing. A single capable agent may perform several skills in one bounded job.

The orchestration plane decides **which capability is useful next** from current state. The skill specifies **how that capability should be performed competently**.

## Incremental CI and changed-publication derivation

A large repository should derive affected publication IDs from the Git diff.

A change under:

```text
books/<publication-id>/...
```

should normally validate/build that publication, not the complete library.

Changes to shared framework or production templates may intentionally fan out. Fan-out should be explicit, batched, and observable rather than an accidental side effect of every commit.

Avoid architectures where thousands of books imply:

- thousands of independent long-lived branches;
- thousands of permanently running workflows;
- one giant catalog rebuild on every commit;
- one pull request per routine machine transition;
- full-manuscript reasoning for unchanged publications.

Git is source control and durable history. It does not need to be the queue.

## Batch and throttle fan-out

When a shared change affects thousands of publications, process it in controlled batches.

A scalable orchestrator should be able to answer:

- how many publications are affected;
- how many are queued;
- how many are building;
- how many succeeded;
- how many failed;
- what rate limits or infrastructure constraints apply;
- which failures are retryable;
- which failures require judgment.

Do not create unbounded simultaneous workflows merely because all publications are technically eligible.

## Objective gates and exception queues

Routine publication work should advance on objective evidence where possible.

Useful automated gates include:

- schema/structure validity;
- catalog consistency;
- release provenance integrity;
- media path and format checks;
- cover/metadata completeness where required;
- broken internal link checks;
- citation/reference integrity checks where mechanically possible;
- rights-manifest consistency;
- accessibility checks that can be mechanized;
- artifact checksums;
- build/render success;
- target-specific production preflight;
- exact Desk source commit for a release.

Do not manufacture a human-review ceremony for routine deterministic work.

Humans or higher-reasoning agents should receive the exception queue:

- ambiguous editorial judgment;
- contradictory evidence;
- legal/rights uncertainty;
- irreconcilable metadata;
- repeated failed builds;
- unusual publication decisions;
- unexpected release drift;
- decisions that cross an explicit user-intent boundary.

## Observability

A large Bookself operation should make state visible without opening every publication.

A useful operational view might show:

```text
100,000 registered
 96,842 published
    731 active
    209 queued
     18 building
     11 blocked
      4 failing
```

Every non-healthy item should expose a precise reason and the publication ID needed to investigate it.

Prefer actionable state over vague health scores.

## Immutable edition identity

Published editions should be attributable to exact Desk source state and deterministic publication artifacts.

At minimum, preserve:

- Desk source commit;
- edition/release identity;
- release manifest;
- payload/artifact hashes where applicable;
- publication metadata and rights state relevant to that edition.

A later source edit should create a new release/build relationship rather than silently rewriting the identity of the earlier edition.

Bookself may present the newest edition at a stable reader URL, but its provenance should still permit the older released state to be identified and reconstructed where the publisher retains that history.

## Source versus generated output

Desk should own authoritative source material.

Generated delivery artifacts should be treated as rebuildable outputs when possible:

```text
Desk source
  ↓
validation / production
  ↓
release artifacts
  ↓
Shelf / distributor
```

Do not make a proprietary storefront, PDF editor, build cache, or generated output tree the only place where the publication can be reconstructed.

Shelf remains the canonical promoted release surface in the standard Bookself model. Large deployments may choose to store built derivatives separately from human-authored source, but the release must retain enough provenance to identify exactly what source and production rules created them.

## Publishing scale versus editorial scale

Mechanical publishing infrastructure can scale farther and faster than good authorship.

Bookself should distinguish:

### Publishing scale

- validation;
- format generation;
- media processing;
- release transactions;
- catalog updates;
- distribution;
- integrity checks.

These can become highly automated.

### Editorial scale

- differentiated research;
- original argument and narrative;
- substantive editing;
- adversarial critique;
- fact verification;
- duplication detection across a catalog;
- reader-value judgment;
- quality assessment.

These remain reasoning-heavy. Increasing publication throughput must not be treated as evidence that the underlying works became worthwhile.

A catalog of 10,000 technically valid books can still be a bad catalog.

## Design target: 100,000 publications

Bookself does not need to ship a 100,000-publication orchestration service.

It should avoid assumptions that make such a deployment impossible or absurd.

Design implications include:

- stable per-publication identity;
- explicit machine-readable state;
- incremental operations;
- publication-scoped validation/build commands;
- deterministic outputs;
- idempotent release operations;
- event-friendly contracts;
- batch-friendly shared updates;
- no requirement for full-catalog reasoning loops;
- no requirement for one PR per routine transition;
- no hosted Bookself control plane dependency.

## The free baseline must stay simple

Scaling features must not make the basic Bookself workflow dependent on queues, databases, workers, GitHub Actions, or hosted services.

A single author should still be able to use:

```text
Desk → validate → release → Shelf → static Reader
```

A large operator may wrap the same protocol with:

```text
registry → events → workers → reconciliation → observability
```

The publication contract stays the same.

That is the point: **one durable publishing protocol, many possible operating models.**
