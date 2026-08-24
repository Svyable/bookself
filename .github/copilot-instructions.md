# Bookself — GitHub agent instructions

Bookself is open-source, Git-native publishing software for books, papers, course texts, and other long-form work. Manuscripts are plain Markdown. Git provides history and review. A private Binder holds work in progress; a public Shelf holds intentionally released snapshots. The Reader and Publishing Desk are shared static software.

Before changing anything, read the root `AGENTS.md`. It is the canonical cross-agent rule set. Use `llms.txt` as the compact project map and `CONTRIBUTING.md` for contribution lanes.

## Preserve these invariants

- The normal authoring, preview, release, and reading path must work locally without required CI/CD or GitHub Actions minutes.
- A real Binder is private. A Shelf is public. Do not weaken that boundary or expose private Binder content.
- Shared UI is `reader/` + `desk/`; instance identity belongs in `imprint.json`.
- Books and papers remain portable files under `books/`.
- Prefer small, reviewable changes. Do not perform drive-by rewrites or broad cleanup.
- Do not invent DOI, version, release, citation, or publication claims.

## Fast orientation

- Product overview: `README.md`
- Architecture: `docs/bookself.md`
- Beginner author path: `START-HERE.md`
- Local health check: `python3 scripts/doctor.py`
- Contribution map: `docs/contributor-map.md`
- Agent rules: `AGENTS.md`

## The recursive specimen

For exploratory “improve Bookself” work, start with `books/making-bookself/`.

It is an intentionally public Binder-style teaching specimen, not a real private Binder. Read its working proof, `REVIEW.md`, and the linked public review thread before proposing a change. The goal is to shorten the innermost loop:

**read → locate → understand → propose → review → revise → read again**

Choose one bounded improvement that makes the book, the workflow, or the agent onramp clearer for the next person or agent. Leave enough evidence in the commit or pull request that the next reviewer can understand why the change exists.

## Verification

Run only checks relevant to the files touched. Do not add a build system merely to validate a small change. For repository-wide health, use the dependency-free local doctor. For shared Reader/Desk changes, follow the synchronization rules in `AGENTS.md`.