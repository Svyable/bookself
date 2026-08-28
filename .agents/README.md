# Agent compatibility note

Bookself's portability contract is intentionally small:

> Read with a browser. Author with a browser. Work locally with Git + Python. Install no application dependencies.

Supported desktop operating systems are **macOS, Windows, and Linux**.

For the human-facing compatibility policy, read `docs/compatibility.md`.

For end-to-end outcome requests such as creating Desk/Shelf repositories, starting a publication, drafting it, validating it, and releasing it, read:

- root `AGENTS.md` for repository invariants;
- root `bookself.json` for machine-readable capabilities and intent boundaries;
- `docs/agent-first.md` for the orchestration model;
- `.agents/skills/bookself-publisher/SKILL.md` for a portable agent execution skill;
- `.agents/skills/human-prose/SKILL.md` for voice-sensitive manuscript work.

When changing tooling:

- prefer Python standard-library code for canonical automation;
- do not make Node, npm, pip packages, Docker, `rsync`, Bash, WSL, Homebrew, apt, or another package manager a core requirement;
- keep shell scripts optional convenience wrappers;
- keep Reader and Desk usable as static browser software;
- keep browser-only authoring possible;
- treat GitHub Actions as verification, not as a publishing runtime requirement.

If a new dependency is unavoidable, document it explicitly and explain why the existing minimal contract cannot satisfy the feature.
