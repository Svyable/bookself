#!/bin/sh
# Sync Bookself's shared UI into one or more desk/shelf instances.
#
# Usage:
#   scripts/sync-ui.sh [path-to-instance ...]
#
# With no arguments, sibling ../desk and ../shelf directories are used
# when they exist. Only reader/ and desk/ are replaced; books, README.md,
# imprint.json, and other instance-owned files are never touched.
set -e

ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)

sync_one() {
  DEST=$1
  if [ ! -d "$DEST" ]; then
    echo "instance not found: $DEST" >&2
    return 1
  fi

  mkdir -p "$DEST/reader" "$DEST/desk"
  rsync -a --delete --exclude '.DS_Store' "$ROOT/reader/" "$DEST/reader/"
  rsync -a --delete --exclude '.DS_Store' "$ROOT/desk/" "$DEST/desk/"
  echo "Synced shared UI → $DEST (reader/ + desk/)"
}

if [ "$#" -gt 0 ]; then
  for DEST in "$@"; do
    sync_one "$DEST"
  done
  exit 0
fi

FOUND=0
for DEST in "$ROOT/../desk" "$ROOT/../shelf"; do
  if [ -d "$DEST" ]; then
    sync_one "$DEST"
    FOUND=1
  fi
done

if [ "$FOUND" -eq 0 ]; then
  echo "no sibling desk or shelf found" >&2
  echo "usage: scripts/sync-ui.sh [path-to-instance ...]" >&2
  exit 1
fi
