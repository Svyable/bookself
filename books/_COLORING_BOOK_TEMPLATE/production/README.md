# Production workspace

This optional workspace records the handoff from a readable publication to a target edition. It is not a second manuscript and it does not make a printer the source of truth.

## Canonical layers

- `manuscript/` — reader-facing text and ordinary Markdown.
- `media/` — approved or clearly labeled source/preview assets.
- `production/manifest.json` — machine-readable production intent and capability requirements.
- `production/page-map.json` — exact interior sequence and page sides.
- `production/scene-plan.json` — scene briefs and review state.
- `production/asset-inventory.json` — asset lineage, binary state, dimensions, and provenance.
- `production/qa-checklist.md` — human evidence and proof decisions.
- `editions/` — target-specific intent; generated PDFs/EPUBs are disposable derivatives.

`kind` and `status` are open namespaced values. Add a new production family without changing core Bookself tooling. Declare new required capabilities in `requires` and give tooling a documented, opt-in validator.

When a human-readable checklist and a JSON field describe the same decision, update both in the same change. Keep the JSON truthful when the work is incomplete: a missing binary, pending review, and zero page count are valid states, not reasons to invent progress.
