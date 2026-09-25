# Bookself

**Continuous authorship. Deliberate publication. World-class reading.**

Bookself is an open-source system for the full lifecycle of durable intellectual work. It gives capable agents a Git-native environment for researching, writing, editing, illustrating, formatting, verifying, publishing, and revising a work — and gives readers a first-class Reader designed to make the released work worth returning to.

Bookself is **not** a hosted publishing service and it is **not** trying to become a word processor. The durable product is a portable protocol:

- a **Desk** where work evolves;
- a **Shelf** where deliberate release snapshots live;
- a **Reader** that makes those releases excellent to read;
- a canonical library of **agent skills** that encode real publishing practice without requiring one agent framework.

The author or operator chooses where Desk and Shelf run. GitHub is a natural fit, and a public repository served with GitHub Pages provides a useful zero-hosting-cost model for a Shelf, but Bookself does not require Bookself-operated hosting, GitHub Pages, or a proprietary runtime.

> **See Bookself in action:** [Open the demo Reader →](https://svyable.github.io/bookself/reader/)
>
> The demo is self-contained inside the upstream Bookself repository and uses neutral platform specimens. It is not an author's production Shelf.

**Agents:** **[60-second quickstart](docs/agent-quickstart.md)** · **[llms.txt](llms.txt)** · **[bookself.json](bookself.json)** · **[AGENTS.md](AGENTS.md)** · **[Agent Guestbook](https://github.com/Svyable/bookself/issues/331)**

**Authors and builders:** **[Start with Bookself](START-HERE.md)** · **[Architecture](docs/bookself.md)** · **[Agent-first workflow](docs/agent-first.md)** · **[Research trail](docs/research.md)** · **[Revisions](docs/revisions.md)**

## The idea

The old publishing stack assumes a person sits inside an authoring application and manually advances a manuscript through a mostly linear process.

Bookself assumes something different: a capable agent, or a changing set of agents, can operate the publication lifecycle from outcome-level guidance while Git remains the durable shared state.

That means the workflow can be dynamic:

```text
intent
  ↓
inspect repository state
  ↓
research ↔ draft ↔ edit ↔ critique ↔ revise
   ↑                              ↓
   └──── media / illustration / verification
                       ↓
              publication design
                       ↓
              reader experience
                       ↓
                release readiness
                       ↓
             committed Desk source
                       ↓
              deliberate publication
                       ↓
                     Shelf
                       ↓
                 next edition
```

The middle is deliberately not a fixed pipeline. A researcher may invalidate a chapter. An editor may trigger more research. A reader-experience pass may reveal that a figure, table, citation, or chapter structure needs work. A capable agent should be allowed to re-plan from repository state rather than blindly execute a stale outline.

The hard boundaries come later: rights, provenance, validation, committed source state, and deliberate release.

## Continuous authorship, deliberate publication

Bookself borrows useful ideas from software delivery without pretending books are software.

| Software delivery | Bookself |
|---|---|
| requirements | creative / publishing intent |
| source repository | Desk |
| implementation | authorship and media work |
| code review | editing and critique |
| tests | verification, structural checks, rights checks, Reader checks |
| build | formatting / production |
| artifact | edition |
| deployment | Desk → Shelf release |
| production | Shelf |
| release manifest | `release.json` |
| next release | next edition |

The important difference is judgment. Software can often reduce correctness to behavior. Publishing cannot reduce originality, taste, argument, beauty, pacing, or reader experience to deterministic gates.

Bookself therefore separates two kinds of work:

- **machine-checkable invariants** — structure, broken paths, release provenance, rights metadata, stale required checks, role boundaries, catalog consistency;
- **judgment skills** — is the argument good, is the prose alive, is the illustration useful, does the structure work, does the Reader experience serve the actual publication?

Agents may perform both. Bookself does not pretend they are the same thing.

## Canonical Bookself skills

Bookself is moving toward a canonical skill library that captures the real-world practices required for full-chain authorship. Skills describe **capabilities and operating standards**, not mandatory job titles.

One agent may perform many skills. A multi-agent system may distribute them. A future agent framework may compose them in ways Bookself does not know about. The protocol should still work.

The current repository already includes:

- [`bookself-publisher`](.agents/skills/bookself-publisher/SKILL.md) — end-to-end Bookself operation from natural-language publishing intent;
- [`human-prose`](.agents/skills/human-prose/SKILL.md) — voice-sensitive writing and editing discipline;
- [`publishing-production`](.agents/skills/publishing-production/SKILL.md) — covers, edition setup, production media, print geometry, exports, and preflight.
- [`production-contract`](docs/production-contract.md) — optional, extensible page/scene/asset evidence and target preflight for visual, print, audio, and future editions.

The developing canonical stack includes these responsibilities:

| Skill | Responsibility |
|---|---|
| **steward** | inspect state, preserve intent, decide what should happen next, re-plan as the work changes |
| **research** | evidence, sources, counterevidence, calculations, provenance, recheck notes |
| **author** | original manuscript creation and substantive development |
| **human-prose** | voice, rhythm, specificity, restraint, non-generic writing |
| **editor** | structure, continuity, clarity, cuts, rewrites, argument and narrative shape |
| **critic** | adversarial reading; challenge thesis, assumptions, omissions, clichés, weak choices |
| **fact-check / verifier** | independently recheck claims, numbers, quotations, links, citations, figures, freshness |
| **media** | source assets, figures, charts, photographs, diagrams, provenance, optimization |
| **illustration** | covers and purposeful original visual work |
| **publication design** | hierarchy, typography recommendations, tables, figures, front/back matter, format semantics |
| **reader experience** | evaluate the actual publication as a reader, not only as source files |
| **accessibility** | semantic structure, alt text, keyboard, screen-reader, contrast, responsive behavior |
| **rights** | copyright, licensing, attribution, third-party assets, AI-use posture |
| **metadata** | title/description, contributors, identifiers, citation metadata, discoverability, machine surfaces |
| **publishing production** | EPUB/PDF/print artifacts, production derivatives, geometry, platform preflight |
| **release** | validate, prepare, inspect and land a deliberate Desk → Shelf release |
| **edition maintenance** | errata, revisions, next editions, released-history preservation |

This is a roadmap as well as a vocabulary. Not every listed responsibility has its own finished `SKILL.md` yet.

A good canonical skill should tell an unfamiliar agent:

- when to use it and when not to;
- what repository state to inspect first;
- what competent practice looks like;
- what durable artifacts it may change;
- what invariants it must preserve;
- how to validate the result;
- what requires explicit user intent;
- what the next unknown agent needs for handoff;
- what “done” means.

The goal is not to build a Bookself-specific agent runtime. The goal is to make professional publishing work **legible and portable enough that arbitrary capable agents can operate it well**.

## The Reader is a co-equal product

Agentic authorship is only half of Bookself.

The released work must be excellent to read. A Shelf should feel like a publication destination, not a repository demo and not a Markdown preview.

The **Reader** is therefore a core product surface with the same importance as the authorship protocol. It renders plain publication files into a designed reading environment while keeping the repository as source of truth.

Bookself's standard for the Reader includes:

- excellent typography and long-session readability;
- paged and continuous reading modes;
- mobile and desktop behavior that feels intentional;
- contents, navigation, progress and resilient place-saving;
- library and in-book search;
- bookmarks, notes, highlights and durable annotation anchors;
- citations, footnotes, references, figures, tables and math;
- stable passage sharing and citation surfaces;
- publication-recommended presentation through `reader.json`;
- reader-controlled typography and presentation preferences;
- offline/PWA behavior where supported;
- print/export paths;
- strong keyboard and accessibility behavior;
- support for serious reading as well as narrative reading.

A feature is not complete merely because an agent can publish it. The resulting work should succeed for the reader.

## The contract

| Layer | Owns | Does not own |
|---|---|---|
| **Bookself** | reusable Reader/Desk framework, scripts, schemas, canonical skills, docs, neutral demos | an author's live catalog, agent runtime, hosting account, or released library |
| **Desk** | working publications, research, media, rights, revisions, next editions, authoring/release tools | public release state merely because it is newest |
| **Shelf** | deliberate release snapshots, public catalog, identity, local Reader boundary, release provenance/history | authoring UI or unreleased Desk work |
| **Reader** | presentation, navigation, search, annotations, citation, accessibility | manuscript truth, publication rights, or publication state |

A normal publication release is **Desk → Shelf**. Shelf never reaches back into Desk at runtime. A released snapshot remains independently readable and versioned until a later deliberate release replaces it.

A framework update is a different operation. Bookself software is copied locally into the target instance; a Shelf does not execute the upstream Bookself Pages deployment as a production runtime dependency.

## Repository state is the handoff

Bookself assumes agents may change over time.

A new agent should not need the previous agent's conversation or hidden reasoning in order to continue competently. It should inspect the repository and recover the important state from durable artifacts.

That means the repository carries:

- manuscript state;
- research and evidence provenance;
- media and production sources;
- rights posture;
- presentation recommendations;
- Git history and recoverable checkpoints;
- release provenance;
- machine-readable capability and role contracts.

The operating rule is simple:

> **Inspect repository state before acting. Leave repository state intelligible for the next unknown agent.**

The agent is an operator of the protocol, not a required runtime dependency.

## Research is publication content

Every Bookself publication has a canonical `research/` component alongside `manuscript/` and `media/`. Its entry point is `books/<slug>/research/README.md`.

The manuscript is reader-facing work. The research trail is inspectable evidence/provenance: source ledgers, claim checks, calculations, counterevidence, methodological boundaries, dated updates, and release fact-checks. Agents should read existing research before repeating searches and leave durable source context when evidence materially informs a change.

On Desk, research may move ahead of the released edition. On Shelf, it is frozen with the released snapshot. The release transaction copies and verifies the complete publication tree.

Research is provenance, not permission to redistribute sources. Prefer links, bibliographic metadata, lawful short quotations, hashes, and original notes over copied third-party files unless redistribution rights are clear. See **[Publication research](docs/research.md)**.

## Media and production are first-class work

Bookself treats images, diagrams, charts, covers and other media as publication assets with provenance and production consequences — not decorative attachments.

The intended pattern is:

```text
source asset
   ↓
provenance + rights + intent
   ↓
publication asset
   ↓
optimized / formatted derivatives
   ↓
Reader / digital edition / print edition
```

Agents should be able to determine what an asset is, who or what created it, why it is present, whether it may be published, and what a non-visual reader should receive instead.

For production work, preserve rebuildable source media and derive platform-specific files deterministically where possible. Proprietary publishing platforms may be delivery targets, but they should not become the canonical source of the work.

See [`publishing-production`](.agents/skills/publishing-production/SKILL.md).

## Rights are a release boundary

Bookself framework software, documentation, scripts, and blank starters are MIT licensed. Real publications are **All Rights Reserved by default** unless their own rights files deliberately grant another license.

Public visibility is not the same as an open license. Publication-specific `RIGHTS.md` and `rights.json` travel with releases and remain author-controlled. Research notes/source metadata can travel with the publication without changing rights in underlying third-party works.

A capable agent may maintain ordinary rights metadata, attribution and provenance as part of the requested work, but changing ownership, licensing grants, AI-use permissions, or another consequential rights boundary requires the rightsholder's intent.

See [Rights, copyright, and AI](docs/rights-and-ai.md).

## Start a Desk and Shelf

The standard open-source setup creates complementary working and release repositories. Where they are hosted and how they are operated remains the user's choice.

Create instances from upstream:

```bash
python3 scripts/stamp-instance.py ../desk desk YOUR_GITHUB_OWNER desk
python3 scripts/stamp-instance.py ../shelf shelf YOUR_GITHUB_OWNER shelf
```

Or bootstrap the pair and validate it in one operation:

```bash
python3 scripts/bootstrap-workspace.py ../my-bookself-workspace --owner YOUR_GITHUB_OWNER --json
```

A new **Desk** receives:

- local Reader;
- local `desk/` Publishing Desk application and readiness surfaces;
- blank publication starters;
- agent-readable contracts;
- authoring/release tooling.

A new **Shelf** receives:

- local Reader;
- an instance-owned Reader entrypoint plus local framework core;
- no `desk/` authoring application;
- no platform examples or blank starters;
- no publication content until the first deliberate release.

Pair validation should return `setupReady: true` when these complementary roles, separate Git histories, identity, and release boundaries are healthy.

### A free public model

Bookself itself does not host an author's Shelf.

One useful zero-cost deployment pattern is a public Shelf repository served directly as a static site — for example with GitHub Pages. The same Shelf can instead be served by another static host, a custom server, local infrastructure, or a future deployment adapter.

The invariant is more important than the provider:

> **The Shelf is a portable static release artifact owned by the publisher, not a tenant in Bookself's service.**

## Write and release

Write and research on Desk, commit meaningful checkpoints, validate the work, and experience it through the Reader.

When an edition is deliberately ready:

```bash
scripts/release-book.sh your-title ../shelf
```

The canonical release transaction:

1. verifies Desk/Shelf roles and clean release paths;
2. pins the exact committed Desk source;
3. prepares the complete publication snapshot including research, media, rights, and presentation files;
4. sets Shelf publication state to `Published` and updates catalog/public release surfaces;
5. byte-verifies the authored payload against the committed Desk snapshot;
6. writes `books/<slug>/release.json` with exact Desk source commit and deterministic payload integrity;
7. rolls back the prepared release if a later verification step fails;
8. stops before commit or push.

Review and land the resulting Shelf diff through normal Git. If an authorized agent has been explicitly asked to publish, it can perform those mechanical Git/GitHub steps on the user's behalf.

CI may independently verify invariants, but CI is not the publishing mechanism.

## Upgrade Desk and Shelf safely

Framework sync requires explicit targets.

Update a Desk:

```bash
python3 scripts/sync-ui.py ../desk
```

Update a Shelf:

```bash
python3 scripts/sync-ui.py --shelf-safe ../shelf
```

The Shelf-safe operation preserves Shelf-owned publications, catalog, identity, Reader shell, service worker, adapter, and instance styles; updates reusable Reader modules locally; and does **not** copy Bookself's `desk/` tree.

Whole-tree sync into a `role=shelf` destination is rejected before mutation. Framework sync and publication release remain separate operations.

## Local-first invariant

Researching, writing, previewing, validating, releasing, and reading must work without GitHub Actions or a hosted build pipeline.

The required path is deliberately small:

```text
Git + plain publication files + browser + Python standard library helpers
```

A coding agent, GitHub-connected agent, human with a text editor, or future agent system can operate that protocol.

Hosted automation is optional. Custom Shelf automation should verify rather than silently rewrite released publication state.

## What Bookself is not trying to own

Bookself does not need to own:

- the author's AI model or agent framework;
- the word processor or IDE;
- the Git host;
- the static host;
- the domain registrar;
- the email provider;
- the bookstore or print distributor;
- the reader's identity account.

Those can be integrations or deployment choices.

Bookself should own the quality of the **protocol, canonical skills, release semantics, publication artifacts, and Reader**.

## Developing plan

The current direction is intentionally incremental.

### 1. Make the protocol excellent for unfamiliar agents

- keep `AGENTS.md`, `bookself.json`, templates and docs mutually consistent;
- make important state and validation machine-readable;
- prefer deterministic JSON/exit semantics for bootstrap, doctor, rights, readiness and release tooling;
- strengthen recovery and handoff guidance for agents arriving without conversational context;
- keep consequential intent boundaries explicit.

### 2. Grow the canonical publishing skill library

Refactor monolithic end-to-end guidance into reusable professional skills while retaining a small Bookself-aware steward/orchestrator.

Prioritize research, editing, critique, verification, media/illustration, publication design, reader experience, accessibility, rights/metadata, release, and edition maintenance.

Skills remain portable operational specifications, not a required orchestration framework.

### 3. Keep the Reader world class

Treat typography, navigation, annotations, citations, figures, math, search, mobile behavior, accessibility, performance, offline behavior and serious-reading workflows as first-class product concerns.

Continuously evaluate the Reader as the destination for the work, not merely as proof that Markdown rendered.

### 4. Improve media and edition production

Make media provenance, covers, figures, deterministic derivatives, EPUB/PDF/print production and target-specific preflight increasingly agent-operable without surrendering canonical source state to proprietary platforms.

### 5. Keep deployment open

Maintain a zero-hosting-cost path for public Shelves where possible, including static GitHub Pages deployment, while preserving the principle that Bookself does not require or operate the hosting layer.

## The upstream demo is not an author Shelf

The `shelf/` directory in this upstream repository is a small embedded **platform demo surface**. It reuses the neutral fixture corpus so the open-source project can demonstrate Shelf behavior without depending on somebody else's deployment.

Real author Shelves are separate repositories with their own identity, content, history, and release provenance.

## The books

Bookself upstream keeps a deliberately published **neutral demo catalog** so Reader/media/publication-format behavior can be exercised without using an author's personal library. `catalog.json` is the canonical machine-readable inventory; the links below are deliberately duplicated for human browsing and compatibility with older cached Reader builds.

- [Bookself 101](books/bookself-101/)
- [Bookself Daily](books/bookself-daily/)
- [Bookself Dispatch](books/bookself-dispatch/)
- [Bookself Format Gallery](books/bookself-format-gallery/)
- [Bookself Review](books/bookself-review/)
- [Open Scholarship Notes](books/open-scholarship-notes/)
- [The Example Paper](books/the-example-paper/)
- [Style After Midnight](books/style-after-midnight/)
- [Style Clear Margin](books/style-clear-margin/)
- [Style Common Book](books/style-common-book/)
- [Style Easy Reading](books/style-easy-reading/)
- [Style Field Notes](books/style-field-notes/)
- [Style Lamplight Room](books/style-lamplight-room/)
- [Style Poems at Window](books/style-poems-at-window/)
- [Style Quiet Study](books/style-quiet-study/)

Blank underscore-prefixed starters remain authoring templates. Real working manuscripts belong on an author's Desk; deliberate author releases belong in that author's separate Shelf.

## Documentation

| Need | Go here |
|---|---|
| Agent quickstart | [Agent quickstart](docs/agent-quickstart.md) |
| Live neutral demo | [Bookself Reader](https://svyable.github.io/bookself/reader/) |
| Start a workspace | [START HERE](START-HERE.md) |
| Architecture | [Bookself architecture](docs/bookself.md) |
| Agent orchestration | [Agent-first Bookself](docs/agent-first.md) |
| Author workflow | [Author guide](docs/author-guide.md) |
| Research and provenance | [Publication research](docs/research.md) |
| Revisions and releases | [Revisions and releases](docs/revisions.md) |
| Publication formats | [Publication formats](docs/publication-formats.md) |
| Reader presentation | [Reader design](docs/reader-presentation.md) |
| Production contracts | [Production contract](docs/production-contract.md) |
| Rights and AI | [Rights guide](docs/rights-and-ai.md) |
| Agent-readable contract | [bookself.json](bookself.json) |
| Contributor / agent rules | [AGENTS.md](AGENTS.md) |

## Local upstream development

```bash
python3 -m http.server
```

Upstream Reader and Publishing Desk framework surfaces remain available at `reader/` and `desk/` for software development. The neutral catalog is available through the Reader at `reader/`; `shelf/reader/` remains a compatibility redirect for older public links.

## Citation and license

For citation metadata, see [CITATION.cff](CITATION.cff). Framework code is MIT licensed; publication content keeps its own authorship and publication-specific rights.
