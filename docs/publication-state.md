# Publication identity and scoped state

Bookself publications need a stable machine key that works for one book on a laptop and for a catalog with tens of thousands of independently scheduled works.

The first Bookself identity rule is deliberately small:

> **Within one Desk/Shelf installation, the publication slug is the publication ID.**

A publication at `books/the-example/` therefore has:

```text
publicationId: the-example
path: books/the-example
```

The human title may change. The publication ID should not change merely because a title, subtitle, cover, edition label, author display name, or marketing description changes.

Renaming `books/<slug>/` after a publication has acquired history is therefore an **identity migration**, not a cosmetic filesystem cleanup. A future migration helper may preserve aliases or registry references, but ordinary agents and automation should treat the slug as durable.

This keeps the base protocol free of mandatory UUID services, databases, or a second publication metadata store. A large operator may map the Bookself publication ID to an external registry ID if needed.

## Inspect one publication

Use:

```bash
python3 scripts/publication_state.py <slug> --root . --json
```

The command reads only the bounded state needed to describe that publication and its immediate repository context. It reports:

- `publicationId` and canonical `books/<slug>` path;
- title, authors, format, edition, language, and publication Status when present;
- repository role (`desk`, `shelf`, or `platform`);
- whether the publication is cataloged;
- current Git HEAD when available;
- whether that publication path has uncommitted changes;
- `release.json` when present;
- publication-scoped structural errors and warnings.

`checks.structurallyReady` means the bounded structural checks in this command passed. It does **not** mean the work is editorially excellent, factually verified, rights-cleared, accessible, or authorized for public release. Those are separate skills and gates.

The command exits nonzero when its scoped structural checks contain errors. Agents can therefore consume either the JSON result or the exit status.

## Find publications affected by a change

Use:

```bash
python3 scripts/changed_publications.py <base> [head] --root . --json
```

The helper performs a merge-base Git diff (`base...head`) and separates changed paths into two groups:

- `publications` — concrete `books/<publicationId>/...` objects that changed;
- `globalPaths` — framework, root, starter/template, tooling, or other non-publication paths.

The helper deliberately does **not** decide that every global change requires every publication to rebuild. It exposes `globalChange: true` and leaves fan-out policy to the supervisor or deployment.

For example, a manuscript-only change can produce one publication ID. A Reader framework change can produce no concrete publication IDs plus a global-change signal. A large operator can then decide whether that framework change requires a batched catalog-wide verification pass.

Deleted publications are still returned by ID with `present: false`, so cleanup/reconciliation workers do not silently miss them.

## Supervisor pattern

At scale, a supervisor should prefer:

```text
Git/event
   ↓
changed_publications
   ↓
publication IDs
   ↓
publication_state for affected IDs
   ↓
select bounded skill/work
   ↓
validate result
   ↓
record durable state
```

rather than:

```text
hourly wakeup
   ↓
read every manuscript
   ↓
reason about the whole catalog again
```

Periodic reconciliation can still scan compact metadata across the entire catalog, but expensive research, editorial reasoning, rendering, and distribution work should remain publication-scoped whenever possible.

## Identity scope

The current ID is `bookself-instance` scoped. In practice that means the paired Desk/Shelf installation owns the meaning of a slug.

External systems that aggregate many independent Bookself installations should key a publication with both installation identity and publication ID, for example conceptually:

```text
<installation>/<publicationId>
```

Bookself does not currently prescribe a universal global identifier. Existing identifiers such as DOI, ISBN, ISSN, arXiv ID, ORCID-linked authorship, or an operator's own registry identifier remain separate metadata and may coexist with the Bookself publication ID.

## What this does not introduce

Publication-scoped state does not require:

- a hosted Bookself service;
- a database;
- GitHub Actions;
- a queue;
- a scheduler;
- a specific agent framework;
- a central registry.

Those may be useful orchestration choices at scale. The durable publication remains ordinary repository state.
