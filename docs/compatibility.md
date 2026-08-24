# Compatibility and requirements

Bookself is designed to have as little machinery as possible.

## The short version

| What you want to do | What you need |
|---|---|
| Read a Bookself publication | A modern web browser |
| Write or edit on GitHub.com | A browser and a GitHub account |
| Work locally | Git and Python 3 |
| Use GitHub from the terminal | GitHub CLI is optional |

**Supported desktop operating systems:** macOS, Windows, and Linux.

Bookself does **not** require Node.js, npm, pip packages, Docker, Java, Ruby, a database, a build system, or a package manager.

The Reader and Publishing Desk are static browser software. Manuscripts are plain Markdown files.

## Three levels of use

### 1. Read

Open the Reader in a current browser. There is nothing to install.

### 2. Write

You can create, edit, review, and commit books entirely on GitHub.com. You do not need a terminal or a local development environment.

### 3. Work locally

For local preview, health checks, releases, synchronization, and agent-assisted work, use:

- **Git**
- **Python 3**

Bookself's Python tools use the Python standard library. There is no `pip install` step and no `requirements.txt` because there are no third-party Python packages to install.

GitHub CLI (`gh`) is useful for authentication and repository work from a terminal, but Bookself does not require it.

## Operating-system policy

Canonical Bookself automation should run through Python and use cross-platform standard-library APIs such as `pathlib`, `shutil`, and `subprocess`.

Shell scripts may exist as convenience wrappers for macOS and Linux users, but `/bin/sh`, Bash, `rsync`, Homebrew, apt, WSL, and similar environment-specific tools are not part of the core Bookself requirement.

When adding a new required tool or dependency, prefer not to. If it is genuinely necessary, document why and keep browser-only reading and authoring unaffected.

## Browser support

Bookself targets current versions of the major evergreen browsers:

- Chrome
- Edge
- Firefox
- Safari

Because the Reader and Desk are static HTML, CSS, and JavaScript, they should not depend on an operating-system-specific runtime.

## What “minimal requirements” means

The portability contract is:

> **Read with a browser. Author with a browser. Work locally with Git + Python. Install no application dependencies.**

That is the baseline new features should preserve.

## Verification

Platform tests should be able to run on macOS, Windows, and Linux with Python alone, plus Git where repository behavior is being tested.

GitHub Actions may be used to verify compatibility, but hosted CI is not part of the publishing runtime. A private Binder must remain usable with zero GitHub Actions minutes.
