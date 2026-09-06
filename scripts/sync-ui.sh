#!/bin/sh
set -e

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
exec python3 "$SCRIPT_DIR/sync-ui.py" "$@"
