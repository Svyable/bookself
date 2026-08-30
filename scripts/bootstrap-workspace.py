#!/usr/bin/env python3
"""Create a sibling Desk + Shelf workspace for humans or agents."""

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


def run_json(command: list[str], *, cwd: Path | None = None) -> dict[str, object]:
    proc = subprocess.run(
        command,
        cwd=cwd,
        check=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    if proc.returncode != 0:
        detail = proc.stderr.strip() or proc.stdout.strip() or "unknown validation error"
        raise RuntimeError(f"Bookself pair validation failed: {detail}")
    try:
        result = json.loads(proc.stdout)
    except json.JSONDecodeError as error:
        raise RuntimeError(f"Bookself pair validation returned invalid JSON: {error}") from error
    if not isinstance(result, dict):
        raise RuntimeError("Bookself pair validation did not return an object")
    return result


def ensure_empty_workspace(path: Path) -> None:
    if path.exists() and any(path.iterdir()):
        raise ValueError(f"workspace is not empty: {path}")
    path.mkdir(parents=True, exist_ok=True)


def initialize_git(path: Path) -> None:
    if shutil.which("git") is None:
        raise RuntimeError("git is required to initialize Desk and Shelf repositories")
    run(["git", "init"], cwd=path)
    run(["git", "branch", "-M", "main"], cwd=path)


def bootstrap(
    workspace: Path,
    *,
    owner: str,
    desk_name: str,
    shelf_name: str,
    initialize_repos: bool = True,
) -> dict[str, object]:
    root = Path(__file__).resolve().parent.parent
    workspace = workspace.expanduser().resolve()
    if workspace == root or root in workspace.parents:
        raise ValueError("workspace must be outside the Bookself platform checkout")
    ensure_empty_workspace(workspace)

    stamp = root / "scripts" / "stamp-instance.py"
    desk = workspace / desk_name
    shelf = workspace / shelf_name

    run([sys.executable, str(stamp), str(desk), "desk", owner, desk_name])
    run([sys.executable, str(stamp), str(shelf), "shelf", owner, shelf_name])

    if initialize_repos:
        initialize_git(desk)
        initialize_git(shelf)
        pair_validation = run_json(
            [
                sys.executable,
                str(root / "scripts" / "doctor-pair.py"),
                str(desk),
                str(shelf),
                "--json",
            ]
        )
    else:
        pair_validation = {
            "setupReady": False,
            "skipped": True,
            "reason": "Git initialization was delegated with --no-git; run doctor-pair.py after both repositories are initialized.",
        }

    return {
        "workspace": str(workspace),
        "desk": {
            "path": str(desk),
            "role": "desk",
            "repository": desk_name,
            "gitInitialized": initialize_repos,
        },
        "shelf": {
            "path": str(shelf),
            "role": "shelf",
            "repository": shelf_name,
            "gitInitialized": initialize_repos,
        },
        "pairValidation": pair_validation,
        "next": [
            "Create the first publication in desk/books/<slug>/ and list it under Desk README ## The books.",
            "Run python3 scripts/doctor.py --root . inside the Desk after meaningful structural changes.",
            "Run python3 scripts/doctor-pair.py . ../shelf after setup or shared-UI changes.",
            "Commit the Desk publication before release.",
            "Release with python3 scripts/release-book.py <slug> <path-to-shelf>.",
            "Review, commit, and push the Shelf snapshot only when public publication is intended.",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Create a local Bookself workspace containing sibling private Desk and public Shelf repositories."
    )
    parser.add_argument("workspace", help="empty parent directory to create or populate")
    parser.add_argument("--owner", default="auto", help="GitHub owner/login for instance links; defaults to auto")
    parser.add_argument("--desk", default="desk", help="Desk directory/repository name")
    parser.add_argument("--shelf", default="shelf", help="Shelf directory/repository name")
    parser.add_argument("--no-git", action="store_true", help="create folders without running git init; pair validation is deferred")
    parser.add_argument("--json", action="store_true", help="emit only a machine-readable JSON result")
    args = parser.parse_args()

    try:
        result = bootstrap(
            Path(args.workspace),
            owner=args.owner,
            desk_name=args.desk,
            shelf_name=args.shelf,
            initialize_repos=not args.no_git,
        )
    except (ValueError, RuntimeError, subprocess.CalledProcessError) as error:
        parser.error(str(error))

    if args.json:
        print(json.dumps(result, ensure_ascii=False))
        return 0

    print("Bookself workspace ready")
    print(f"Desk:  {result['desk']['path']}")
    print(f"Shelf: {result['shelf']['path']}")
    if result["pairValidation"].get("setupReady"):
        print("Pair validation: READY")
    else:
        print("Pair validation: deferred")
    print("Next: create and commit the first Desk publication, then release its snapshot to Shelf.")
    print("For agents: read bookself.json and AGENTS.md before continuing.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
