#!/bin/sh
# Prepare a Binder publication for release to a local Shelf checkout.
# Usage: scripts/release-book.sh <slug> [path-to-shelf]
set -eu

ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
SLUG=${1:-}
DEST=${2:-"$ROOT/../shelf"}

if [ -z "$SLUG" ] || [ "$SLUG" = "-h" ] || [ "$SLUG" = "--help" ]; then
  echo "usage: scripts/release-book.sh <slug> [path-to-shelf]" >&2
  exit 1
fi

"$ROOT/scripts/promote-book.sh" "$SLUG" "$DEST"
python3 "$ROOT/scripts/release-book.py" "$SLUG" "$DEST"

echo
echo "Release prepared in: $DEST"
echo "Nothing was committed or pushed."
echo "Review:"
echo "  git -C \"$DEST\" diff -- README.md books/$SLUG"
echo
echo "When it looks right:"
echo "  git -C \"$DEST\" add README.md books/$SLUG"
echo "  git -C \"$DEST\" commit -m \"Publish $SLUG\""
echo "  git -C \"$DEST\" push"
