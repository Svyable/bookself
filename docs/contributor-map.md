# Contributor map

Bookself is intentionally small enough that you should not need to understand the whole project before improving one part of it.

Pick the lane that matches the change you want to make. Stay in that lane unless the change genuinely crosses a boundary.

## Where changes belong

| You want to change… | Work here | Keep the PR shaped like… |
|---|---|---|
| A sentence, chapter, book, or paper | `books/<slug>/` | One numbered chapter per PR; update that publication's README only when its TOC/count needs to match |
| Reading, navigation, accessibility, media, math, citations, or shelf presentation | `reader/` | One coherent Reader behavior; no manuscript edits |
| Publishing readiness and author-facing workflow | `desk/` | One coherent Desk behavior; no manuscript edits |
| Binder → Shelf release behavior or instance setup | `scripts/` and relevant docs | One local-first workflow change with tests where practical |
| Templates and publication conventions | `books/_TEMPLATE/`, `books/_PAPER_TEMPLATE/`, docs | Keep the default simple; avoid adding configuration just because a format can support it |
| Explanations, examples, onboarding, or community guidance | root docs, `docs/`, `.github/` | Documentation/community change only unless code is required to make the documentation true |

If you are unsure, open a **Platform idea** issue and describe the problem before designing a new subsystem.

## The architectural boundary that matters most

Bookself has three roles:

- **Bookself** — reusable platform source
- **Binder** — private working edition
- **Shelf** — public released edition

`reader/` and `desk/` are shared platform UI. `books/`, root `README.md`, and `imprint.json` belong to each instance.

A platform contributor does **not** need access to somebody's private Binder in order to improve Bookself. Make the shared change in this repository. Maintainers can mirror the final `reader/` / `desk/` bytes into reference instances when the change lands.

Do not hard-code a repository owner, private URL, publication identity, or Svyable-specific behavior into shared UI.

## Local verification without a build system

Bookself should remain useful with Git, a browser, and Python's standard library. You do not need a Node package install, container, cloud project, or GitHub Actions run just to contribute.

For a dependency-free repository health check, start with:

```bash
python3 scripts/doctor.py
```

The doctor is read-only. It checks the repository role, Git worktree state, Reader and Desk presence, catalog/publication consistency, and other structural invariants so you can spot a baseline problem before attributing it to your change.

Serve a checkout from its root:

```bash
python3 -m http.server
```

Then inspect:

- `http://127.0.0.1:8000/reader/`
- `http://127.0.0.1:8000/desk/`

For Reader parser work, run the relevant zero-install Node tests when Node is available. Current focused tests include:

```bash
node reader/js/catalog.test.mjs
node reader/js/math.test.mjs
node reader/js/academic.test.mjs
```

For release-tooling changes:

```bash
python3 scripts/test_release_book.py
```

Run the checks related to your change; Bookself does not require every contributor to install a giant test stack for a typo or documentation fix.

## Shared Reader / Desk changes

If you maintain local Binder or Shelf instances, sync shared UI after changing `reader/` or `desk/`:

```bash
scripts/sync-ui.sh /path/to/instance
```

The command replaces only `reader/` and `desk/`; it does not own books, root README content, or imprint identity.

If you are contributing only to the public Bookself repository and do not have instance checkouts, say so in the PR. That is fine. The important review question is whether the shared change remains instance-neutral and portable.

## Academic and research features

Bookself welcomes scholarly features when they make plain publications stronger without silently turning every publication into a build project.

Core academic Markdown currently includes figures/captions, footnotes, citations/bibliography definitions, LaTeX-style math, and chapter-local equation labels/references. See [Academic writing](academic-writing.md).

A proposal for CSL, `.bib`, full TeX projects, executable notebooks, or another richer system should explain the **optional boundary**: ordinary Markdown books must keep working without that subsystem.

## What makes a good platform PR

A strong platform PR is usually easy to answer in five questions:

1. What reader/author problem does this solve?
2. What is the smallest coherent behavior that solves it?
3. Which files own that behavior?
4. How did you verify it locally?
5. Does the normal Bookself path still work without hosted CI or a mandatory build?

Screenshots are useful for visual changes. Small reproduction snippets are useful for parser bugs. A failing example is often more valuable than a long architectural essay.

## Stacked PRs: verify where the merge lands

Sometimes one review genuinely depends on another. If you stack PRs, the child PR may temporarily use the parent branch as its base. That is useful for keeping the child diff small, but it creates one easy-to-miss trap: GitHub can report the child as **merged** even when it merged only into the old review branch rather than into `main`.

When the parent lands:

1. re-check the child PR's **base branch**;
2. retarget it to `main` if the parent change is now on `main`;
3. re-check the child diff;
4. after merging, verify the intended files on `main` directly.

Do not treat the green “Merged” badge as proof that the default branch received the change. The destination branch is part of the review.

## What not to bundle

Please split changes when review would otherwise require unrelated decisions. In particular, avoid combining:

- manuscript prose with Reader/Desk code;
- a new academic syntax with an unrelated visual redesign;
- release tooling with a private-repository Actions workflow;
- repo-wide formatting with a functional change;
- a bug fix with a new configuration system that is not needed to fix the bug.

Small does not mean timid. It means the reviewer can see the idea clearly.

## You do not need permission to notice something

If you found a bug, confusing interaction, accessibility problem, broken example, missing academic case, or awkward contributor workflow, that is useful information even if you do not know how to fix it.

Use the issue form that best matches what you saw. A good report is already a contribution.
