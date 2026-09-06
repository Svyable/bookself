#!/usr/bin/env python3
"""Prepare one Desk -> Shelf release, including its canonical web identity."""

from __future__ import annotations

import importlib.util
import subprocess
import sys
from pathlib import Path
from types import ModuleType

HERE = Path(__file__).resolve().parent


def load_script(filename: str, module_name: str) -> ModuleType:
    path = HERE / filename
    if not path.is_file():
        raise RuntimeError(f"missing Bookself release component: {path}")
    spec = importlib.util.spec_from_file_location(module_name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"could not load Bookself release component: {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


release_core = load_script("release-book.py", "bookself_release_core")
publication_pages = load_script(
    "generate-publication-pages.py", "bookself_publication_pages"
)
ReleaseError = release_core.ReleaseError


def run_git(root: Path, *args: str, check: bool = True) -> subprocess.CompletedProcess[str]:
    proc = subprocess.run(
        ["git", "-C", str(root), *args],
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if check and proc.returncode:
        detail = proc.stderr.strip() or proc.stdout.strip() or "git command failed"
        raise ReleaseError(f"{root}: {detail}")
    return proc


def tracked_path(root: Path, rel: str) -> bool:
    proc = run_git(root, "ls-files", "--", rel, check=False)
    return bool(proc.stdout.strip())


def restore_clean_release_path(root: Path, rel: str) -> None:
    """Restore one path to HEAD after a failed generated-surface step.

    The release wrapper checks every affected path is clean before mutation, so
    restoring tracked bytes and deleting newly-created untracked bytes is safe.
    """

    if tracked_path(root, rel):
        run_git(root, "restore", "--source=HEAD", "--worktree", "--", rel)
    run_git(root, "clean", "-fd", "--", rel)


def rollback_release(root: Path, slug: str) -> None:
    for rel in (
        "README.md",
        "catalog.json",
        f"books/{slug}",
        "publication",
        "sitemap.xml",
    ):
        restore_clean_release_path(root, rel)


def publication_web(root: Path, slug: str) -> tuple[int, int, str]:
    try:
        outputs = publication_pages.build(root)
    except Exception as exc:  # generator owns its own typed errors
        raise ReleaseError(f"publication web generation failed: {exc}") from exc

    target = f"publication/{slug}/index.html"
    if target not in outputs:
        raise ReleaseError(
            f"publication web generation did not produce {target}; "
            "the released Shelf copy must be Published and cataloged"
        )

    try:
        changed, _ = publication_pages.write_outputs(root, outputs)
        _, stale = publication_pages.write_outputs(root, outputs, check=True)
    except Exception as exc:
        raise ReleaseError(f"publication web write failed: {exc}") from exc
    if stale:
        raise ReleaseError(
            f"publication web verification failed: {stale} generated file(s) remain stale"
        )

    record = publication_pages.publication_record(
        root,
        slug,
        publication_pages.derived_site_url(publication_pages.read_json(root / "imprint.json")),
        str(publication_pages.read_json(root / "imprint.json").get("name") or "Bookself Shelf").strip(),
    )
    canonical = record["canonical_url"] if record else ""
    return len(outputs), changed, canonical


def prepare_release(desk: Path, shelf: Path, slug: str) -> dict[str, str | int]:
    desk = Path(desk).resolve()
    shelf = Path(shelf).resolve()

    release_core.require_git_worktree(shelf, "Shelf")
    release_core.require_clean_paths(
        shelf,
        "Shelf",
        ["publication", "sitemap.xml"],
    )

    result = release_core.prepare_release(desk, shelf, slug)
    try:
        total, changed, canonical = publication_web(shelf, slug)
    except Exception as exc:
        try:
            rollback_release(shelf, slug)
        except Exception as rollback_exc:
            raise ReleaseError(
                f"{exc}; automatic rollback also failed: {rollback_exc}"
            ) from exc
        if isinstance(exc, ReleaseError):
            raise
        raise ReleaseError(str(exc)) from exc

    return {
        **result,
        "publication_files": total,
        "publication_changed": changed,
        "canonical_url": canonical,
    }


def main(argv: list[str]) -> int:
    if len(argv) not in {2, 3} or argv[1] in {"-h", "--help"}:
        print("usage: release.py <slug> [path-to-shelf]", file=sys.stderr)
        return 2

    desk = HERE.parent
    slug = argv[1].strip()
    shelf = (
        Path(argv[2]).expanduser()
        if len(argv) == 3
        else desk.parent / "shelf"
    )

    try:
        result = prepare_release(desk, shelf, slug)
    except ReleaseError as exc:
        print(f"release: {exc}", file=sys.stderr)
        return 1

    print(f"Prepared release: {result['title']}")
    print(f"Desk snapshot: {result['source_commit']}")
    print(f"Shelf branch: {result['shelf_branch']}")
    print(f"Catalog: {result['catalog_action']}")
    print(
        "Publication web: "
        f"{result['publication_changed']} changed / {result['publication_files']} generated files"
    )
    if result.get("canonical_url"):
        print(f"Canonical URL: {result['canonical_url']}")
    print(
        "Verified: Shelf content matches the committed Desk snapshot and the "
        "Published catalog, canonical publication pages, and sitemap are current."
    )
    print("Nothing was committed or pushed.")
    print()
    print("Review:")
    print(
        f'  git -C "{shelf.resolve()}" diff -- README.md catalog.json '
        f'books/{slug} publication sitemap.xml'
    )
    print()
    print(
        "When it looks right, commit the release on a branch/PR or push it "
        "according to your normal workflow."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
