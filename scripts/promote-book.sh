#!/bin/sh
# Promote a book from this binder into your public shelf (Bookself).
# Usage: scripts/promote-book.sh <slug> [path-to-shelf]
# Default shelf: ../shelf
# Does not set Status or edit the shelf README — those two edits are
# Publish, done on the shelf after this copy.
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
echo "On the shelf: set Status to Published, add a README row, commit, push."
echo "See docs/bookself.md"
