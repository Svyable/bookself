#!/bin/sh
# Promote a book from this repo into a public library (Bookself).
# Usage: scripts/promote-book.sh <slug> [path-to-library]
# Default library: ../shelf
# Does not set Status or edit the library README — those two edits are
# Publish, done on the library after this copy.
set -e
ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
SLUG=${1:-}
DEST=${2:-"$ROOT/../shelf"}

if [ -z "$SLUG" ] || [ "$SLUG" = "-h" ] || [ "$SLUG" = "--help" ]; then
  echo "usage: scripts/promote-book.sh <slug> [path-to-library]" >&2
  exit 1
fi
if [ "$SLUG" = "_TEMPLATE" ]; then
  echo "refusing to promote _TEMPLATE" >&2
  exit 1
fi

SRC="$ROOT/books/$SLUG"
if [ ! -d "$SRC" ]; then
  echo "book not found: $SRC" >&2
  exit 1
fi
if [ ! -d "$DEST" ]; then
  echo "library not found at $DEST" >&2
  exit 1
fi

mkdir -p "$DEST/books/$SLUG"
rsync -a --delete \
  --exclude '.DS_Store' \
  "$SRC/" "$DEST/books/$SLUG/"

echo "Copied $SLUG → $DEST/books/$SLUG"
echo "On the library: set Status to Published, add a README row, commit, push."
echo "See docs/bookself.md"
