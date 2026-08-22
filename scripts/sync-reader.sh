#!/bin/sh
# Copy reader/ from this repo (source of truth) into the personal shelf.
# Usage: scripts/sync-reader.sh [path-to-shelf]
set -e
ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
DEST=${1:-"$ROOT/../shelf"}
if [ ! -d "$DEST" ]; then
  echo "shelf not found at $DEST" >&2
  exit 1
fi
mkdir -p "$DEST/reader"
rsync -a --delete \
  --exclude '.DS_Store' \
  "$ROOT/reader/" "$DEST/reader/"
echo "Synced reader → $DEST/reader"
echo "Commit the shelf repo separately. imprint.json is not copied."
