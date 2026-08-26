#!/usr/bin/env python3
"""Create a sibling Binder + Shelf workspace for humans or agents."""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path


def run(command: list[str], *, cwd: Path | None = None) -> None:
    subprocess.run(
        command,
        cwd=cwd,
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def ensure_empty_workspace(path: Path) -> None:
    if path.exists() and any(path.iterdir()):
        raise ValueError(f"workspace is not empty: {path}")
    path.mkdir(parents=True, exist_ok=True)


def initialize_git(path: Path) -> None:
    if shutil.which("git") is None:
        raise RuntimeError("git is required to initialize Binder and Shelf repositories")
    run(["git", "init"], cwd=path)
    run(["git", "branch", "-M", "main"], cwd=path)


def bootstrap(
    workspace: Path,
    *,
    owner: str,
    binder_name: str,
    shelf_name: str,
    initialize_repos: bool = True,
) -> dict[str, object]:
    root = Path(__file__).resolve().parent.parent
    workspace = workspace.expanduser().resolve()
    if workspace == root or root in workspace.parents:
        raise ValueError("workspace must be outside the Bookself platform checkout")
    ensure_empty_workspace(workspace)

    stamp = root / "scripts" / "stamp-instance.py"
    binder = workspace / binder_name
    shelf = workspace / shelf_name

    run([sys.executable, str(stamp), str(binder), "binder", owner, binder_name])
    run([sys.executable, str(stamp), str(shelf), "shelf", owner, shelf_name])

    if initialize_repos:
        initialize_git(binder)
        initialize_git(shelf)

    return {
        "workspace": str(workspace),
        "binder": {
            "path": str(binder),
            "role": "binder",
            "repository": binder_name,
            "gitInitialized": initialize_repos,
        },
        "shelf": {
            "path": str(shelf),
            "role": "shelf",
            "repository": shelf_name,
            "gitInitialized": initialize_repos,
        },
        "next": [
            "Create the first publication in binder/books/<slug>/ and list it under Binder README ## The books.",
            "Run python scripts/doctor.py --root . inside the Binder after meaningful structural changes.",
            "Commit the Binder publication before release.",
            "Release with python scripts/release-book.py <slug> <path-to-shelf>.",
            "Review, commit, and push the Shelf snapshot only when public publication is intended.",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Create a local Bookself workspace containing sibling private Binder and public Shelf repositories."
    )
    parser.add_argument("workspace", help="empty parent directory to create or populate")
    parser.add_argument("--owner", default="auto", help="GitHub owner/login for instance links; defaults to auto")
    parser.add_argument("--binder", default="binder", help="Binder directory/repository name")
    parser.add_argument("--shelf", default="shelf", help="Shelf directory/repository name")
    parser.add_argument("--no-git", action="store_true", help="create folders without running git init")
    parser.add_argument("--json", action="store_true", help="emit only a machine-readable JSON result")
    args = parser.parse_args()

    try:
        result = bootstrap(
            Path(args.workspace),
            owner=args.owner,
            binder_name=args.binder,
            shelf_name=args.shelf,
            initialize_repos=not args.no_git,
        )
    except (ValueError, RuntimeError, subprocess.CalledProcessError) as error:
        parser.error(str(error))

    if args.json:
        print(json.dumps(result, ensure_ascii=False))
        return 0

    print("Bookself workspace ready")
    print(f"Binder: {result['binder']['path']}")
    print(f"Shelf:  {result['shelf']['path']}")
    print("Next: create and commit the first Binder publication, then release its snapshot to Shelf.")
    print("For agents: read bookself.json and AGENTS.md before continuing.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
