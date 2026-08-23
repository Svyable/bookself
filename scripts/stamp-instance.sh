#!/bin/sh
# Copy this Bookself tree into an empty destination (no .git, no example book).
# Usage: scripts/stamp-instance.sh <dest> <binder|shelf>
set -e
ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
DEST=${1:-}
ROLE=${2:-}

if [ -z "$DEST" ] || [ -z "$ROLE" ]; then
  echo "usage: scripts/stamp-instance.sh <dest> <binder|shelf>" >&2
  exit 1
fi
if [ "$ROLE" != "binder" ] && [ "$ROLE" != "shelf" ]; then
  echo "role must be binder or shelf" >&2
  exit 1
fi
if [ -e "$DEST" ] && [ "$(ls -A "$DEST" 2>/dev/null)" ]; then
  echo "destination is not empty: $DEST" >&2
  exit 1
fi

mkdir -p "$DEST"
rsync -a \
  --exclude '.git/' \
  --exclude '.DS_Store' \
  --exclude 'books/the-example-book/' \
  --exclude 'docs/superpowers/' \
  --exclude 'docs/instances/' \
  --exclude 'imprint.json' \
  --exclude 'README.md' \
  "$ROOT/" "$DEST/"

cp "$ROOT/docs/instances/${ROLE}-README.md" "$DEST/README.md"
echo "Stamped $ROLE → $DEST"
echo "Write imprint.json, git init, create the GitHub repo. Pages on shelf only."
