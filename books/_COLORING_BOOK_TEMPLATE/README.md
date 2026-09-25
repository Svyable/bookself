# Coloring Book Title

| | |
|---|---|
| **Authors** | Author Name · Illustrator Name |
| **Status** | Drafting |
| **Format** | Coloring book |
| **Publisher** |  |
| **Series** |  |
| **Tags** | coloring, activity |
| **Edition** |  |
| **Language** | English |
| **ISBN** |  |
| **Chapters** | 0 of 1 drafted |

This starter is for a visual or activity-first publication. Keep the reader-facing scene text in `manuscript/`, keep approved source and print evidence in `production/`, and keep the final generated PDFs outside the canonical source until they are deliberately frozen as release artifacts.

The machine-readable production contract is intentionally capability-based. `kind` is an open namespaced value (`activity/coloring` here), and `requires` declares which artifacts this particular edition needs. The same contract can describe a workbook, comic, visual essay, or a future production family without a Bookself release.

## Production map

- [`production/manifest.json`](production/manifest.json) — edition intent, target profile, capability requirements, and quality gates.
- [`production/page-map.json`](production/page-map.json) — exact interior sequence once pagination is decided.
- [`production/scene-plan.json`](production/scene-plan.json) — scene briefs, page assignments, composition, and approval state.
- [`production/asset-inventory.json`](production/asset-inventory.json) — source/keeper/print asset lineage and provenance.
- [`production/qa-checklist.md`](production/qa-checklist.md) — human review evidence and proof gate.
- [`production/print-art-spec.md`](production/print-art-spec.md) — target-aware art acceptance criteria.
- [`editions/`](editions/) — digital and print edition intent; exports remain disposable derivatives.

Run the local contract check from the repository root:

```bash
python3 scripts/production_check.py <publication-slug> --root .
```

## Contents

- [ ] [Scene 1](manuscript/scene-01.md)

Replace the placeholder title, contributors, rights metadata, and scene plan before treating this as a real publication. Do not promote candidate artwork to print or public status by changing a filename or DPI value.
