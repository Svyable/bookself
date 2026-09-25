# Documentation

Start with the document that matches what you are trying to do:

- New to Bookself: [`../START-HERE.md`](../START-HERE.md)
- Agent-operated end-to-end publishing: [`agent-first.md`](agent-first.md)
- Open publishing model — work → edition → export: [`open-publishing.md`](open-publishing.md)
- Covers, trim sizes, source media, and print/eBook editions: [`covers-and-editions.md`](covers-and-editions.md)
- Extensible page, scene, asset, and production evidence contracts: [`production-contract.md`](production-contract.md)
- Start a publication without a terminal: [`new-publication-studio.md`](new-publication-studio.md)
- Requirements and OS support: [`compatibility.md`](compatibility.md)
- Architecture and workflow: [`bookself.md`](bookself.md)
- Writing lifecycle: [`writing-lifecycle.md`](writing-lifecycle.md)
- Author guidance: [`author-guide.md`](author-guide.md)
- Notes, references, glossaries, appendices, indexes, and back matter: [`publication-apparatus.md`](publication-apparatus.md)
- Publication Reader defaults and reader ownership: [`reader-presentation.md`](reader-presentation.md)
- Instance-specific Reader design: [`custom-reader-styles.md`](custom-reader-styles.md)
- Contributor lanes and local verification: [`contributor-map.md`](contributor-map.md)

Agents should also read root [`../bookself.json`](../bookself.json) for the machine-readable capability map and intent boundaries, plus root [`../AGENTS.md`](../AGENTS.md) for repository invariants. Cover/edition work should also use [`../.agents/skills/publishing-production/SKILL.md`](../.agents/skills/publishing-production/SKILL.md) and [`../publishing/edition-presets.json`](../publishing/edition-presets.json).

Bookself's baseline is deliberately small: **browser for reading/writing; Git + Python 3 for local work; macOS, Windows, and Linux supported.**
