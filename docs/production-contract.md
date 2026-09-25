# Production contracts

Bookself's publication source and its delivery artifacts are different things. A manuscript can be read in the Reader long before it has a paperback, EPUB, audio edition, or platform listing. When an edition needs structured production evidence, a publication may add an optional `production/manifest.json`.

The contract is deliberately **capability-based** rather than a closed list of formats. It is designed to absorb lessons from visual and coloring-book production without importing one book's identity, page count, ISBN strategy, or protected decisions into the framework.

## The layers

```text
manuscript/ + research/ + rights + media
        ↓
production/manifest.json
        ↓
declared page / scene / asset / QA capabilities
        ↓
edition intent + target profile
        ↓
rebuildable EPUB / PDF / cover / preview artifacts
```

The manuscript remains the reader-facing source. `production/` records intent, evidence, review state, and handoff information; it does not become a second manuscript. `editions/` remains the home for target-specific edition intent. Generated files are derivatives and never the only surviving source.

## Open names, not a closed format registry

`kind` is an open, namespaced identifier:

```json
"kind": "activity/coloring"
```

Other valid examples might be `book/chaptered`, `visual/essay`, `comic/serial`, `digital/audio`, or a project-specific family. `status` is likewise open: core tooling recognizes a few conventional states for its own warnings, but an unfamiliar state is not automatically invalid.

The contract's `requires` object declares the capabilities this particular edition needs:

```json
"requires": {
  "pageMap": true,
  "scenePlan": true,
  "assetInventory": true,
  "qaChecklist": true
}
```

A future format can require `audioManifest`, `translationMap`, or another named capability without changing the core schema. A validator should treat unknown capability names as forward-compatible and either validate them through an opt-in plugin or report that no validator is installed—not silently claim they are satisfied.

`canonicalPaths` points to publication-local files. The built-in checker understands page maps, scene plans, asset inventories, and QA checklists, but additional paths are allowed for future capabilities.

## The built-in checker

From a Bookself repository root:

```bash
python3 scripts/production_check.py <slug> --root . --json
python3 scripts/production_check.py <slug> --root . --strict --json
```

Omit the slug to inspect every publication that currently has a production manifest. The command uses only Python's standard library and does not require a renderer, npm package, hosted service, or CI run.

The result separates:

- **errors** — malformed paths, contradictory page/scene data, missing imported binaries, known target violations, or a print asset promoted without required evidence;
- **warnings** — truthful incomplete work such as pending pagination, missing physical proof, unchecked QA, or an unverified target profile;
- **information** — capability or target checks that completed without making a human decision.

`healthy` means the contract is structurally valid. `productionStatus: ready` is stricter: it means the declared work has no warnings and enough evidence to proceed. Neither result means that Amazon, IngramSpark, or another distributor has accepted a file.

## What the checker protects

### Page sequence

A declared page map must cover pages `1..pageCount` exactly once. For left-to-right reading, odd pages are right pages and even pages are left pages; a manifest can explicitly select RTL. A visual contract may declare scene side, parity, scene page types, and blank reverses.

### Scene and asset relationships

Scene IDs are stable references, not prose labels. The checker verifies that a scene points to a mapped page, that page type and side agree with declared rules, and that scene/asset references do not silently drift. Asset records distinguish missing, imported, candidate, keeper, print, and released states without treating a missing binary as print-ready. Project-specific classification and lifecycle names are preserved as extensions, but produce a warning until a validator knows how to interpret them; they never inherit print semantics accidentally.

### Provenance and resolution

Print/released assets require an imported binary, approval, and provenance. When a raster asset declares placed dimensions, the checker calculates effective PPI from pixel dimensions and physical placement. The actual image header, when readable, is the source of truth; embedded DPI metadata is not. Vector, PDF, and complex layered workflows remain explicit human/validator decisions rather than being silently treated as ordinary rasters.

### Target profile and proof

The local `publishing/edition-presets.json` provides reviewed convenience data for known targets. The checker can compare trim, page-count ranges, spine-text thresholds, margins, and image baselines when a manifest selects a supported paperback profile. The current live distributor specification wins when it disagrees. A physical proof or platform preview is a human gate, not something a JSON schema can infer.

Keep the target's source URL and `profileReviewed` date in the manifest. Recheck them immediately before export and upload; do not turn a historical review into a permanent compliance claim.

## Human and machine files together

LPPA's coloring-book workflow provides a useful pattern: a human-readable scene plan and QA checklist should stay synchronized with machine-readable page and asset manifests. Bookself keeps that pattern optional and publication-local:

```text
production/
  README.md
  manifest.json
  page-map.json
  scene-plan.json
  asset-inventory.json
  print-art-spec.md
  qa-checklist.md
  TASKS.md
```

When a human decision changes a page, scene, asset state, or proof gate, update the corresponding Markdown and JSON artifacts in the same change. A zero page count, missing candidate binary, `drafting` status, and pending proof are valid truthful states. Do not manufacture progress to make a checklist look complete.

## Mapping LPPA's pattern into Bookself

LPPA's Book 1 module provides valuable production details, but its Book-1-specific `book.json`, tracker, metadata document, and hard-coded validator rules should not be copied into Bookself.

| LPPA idea | Bookself home |
|---|---|
| 42-page/8.5 × 11 decision | `editions/<id>.json` and the selected production manifest |
| 19-scene human plan | `production/scene-plan.json` plus its readable companion |
| exact page sequence | `production/page-map.json` |
| candidate → keeper → print asset lineage | `production/asset-inventory.json` |
| KDP margin/line-art acceptance | `production/print-art-spec.md` and target profile data |
| physical proof checklist | `production/qa-checklist.md` and `qualityGates` |
| critical-path task ledger | `production/TASKS.md` or another publication-owned task artifact |

The transfer is the **discipline**: exact page accounting, explicit asset states, provenance, target recheck, and a human proof gate. The title, creator credits, page count, ISBN, price, and character decisions remain with the publication's rightsholder.

## Safe completion boundary

A production contract is complete for an agent handoff when another person can answer:

- which source files and binaries belong to the edition;
- which declared capabilities were checked and which remain pending;
- which target profile and review date informed the calculation;
- what was generated versus human-approved;
- where provenance and AI-generation/editing disclosures live;
- whether a physical proof or platform preview is still required;
- how to rebuild the artifact without a proprietary source of truth.

If those answers are not durable in the repository, leave better evidence before calling the edition finished.
