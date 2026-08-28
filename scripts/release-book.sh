#!/bin/sh
# Prepare a committed Desk publication for release to a local Shelf checkout.
# Usage: scripts/release-book.sh <slug> [path-to-shelf]
set -eu

ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
SLUG=${1:-}
DEST=${2:-"$ROOT/../shelf"}

if [ -z "$SLUG" ] || [ "$SLUG" = "-h" ] || [ "$SLUG" = "--help" ]; then
  echo "usage: scripts/release-book.sh <slug> [path-to-shelf]" >&2
  exit 1
fi

exec python3 "$ROOT/scripts/release-book.py" "$SLUG" "$DEST"
