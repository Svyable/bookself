#!/bin/sh
# Lower-level copy: Binder publication -> Shelf checkout.
# Usage: scripts/promote-book.sh <slug> [path-to-shelf]
# Default shelf: ../shelf
# For normal releases, prefer scripts/release-book.sh.
set -eu

ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
SLUG=${1:-}
DEST=${2:-"$ROOT/../shelf"}

if [ -z "$SLUG" ] || [ "$SLUG" = "-h" ] || [ "$SLUG" = "--help" ]; then
  echo "usage: scripts/promote-book.sh <slug> [path-to-shelf]" >&2
  exit 1
fi

case "$SLUG" in
  [a-z0-9]*) ;;
  *)
    echo "invalid slug: use lowercase letters, numbers, and hyphens" >&2
    exit 1
    ;;
esac
case "$SLUG" in
  *[!a-z0-9-]*|_TEMPLATE)
    echo "invalid slug: use lowercase letters, numbers, and hyphens" >&2
    exit 1
    ;;
esac

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
echo "This is only a file copy; it does not publish or link Binder to Shelf."
echo "For normal releases, use scripts/release-book.sh instead."
