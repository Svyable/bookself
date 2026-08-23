#!/bin/sh
# Backward-compatible wrapper. Bookself now syncs the shared reader + desk
# together so binder and shelf instances stay on one UI revision.
set -e
ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
echo "sync-reader.sh is now an alias for sync-ui.sh (reader/ + desk/)." >&2
exec "$ROOT/scripts/sync-ui.sh" "$@"
