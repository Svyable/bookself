#!/bin/sh
# Copy a book from this binder into a public shelf checkout (Bookself).
# Usage: scripts/promote-book.sh <slug> [path-to-shelf]
# Default shelf: ../shelf
# This is the lower-level copy operation. For a normal release, prefer
# scripts/release-book.sh, which also marks the Shelf copy Published and
# ensures it is cataloged before you review/commit the release.
set -e
ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
SLUG=${1:-}
DEST=${2:-"$ROOT/../shelf"}

if [ -z "$SLUG" ] || [ "$SLUG" = "-h" ] || [ "$SLUG" = "--help" ]; then
  echo "usage: scripts/promote-book.sh <slug> [path-to-shelf]" >&2
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
  echo "shelf not found at $DEST" >&2
  exit 1
fi

mkdir -p "$DEST/books/$SLUG"
rsync -a --delete \
  --exclude '.DS_Store' \
  "$SRC/" "$DEST/books/$SLUG/"

echo "Copied $SLUG → $DEST/books/$SLUG"
echo "This copy is not published automatically."
echo "For normal releases, run scripts/release-book.sh instead."
