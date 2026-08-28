#!/bin/sh
# Compatibility entrypoint for the canonical dependency-free Python stamper.
#
# Usage:
#   scripts/stamp-instance.sh <dest> <desk|shelf> [github-owner] [repo-name]
#
# Keep the instance-copy contract in one implementation. In particular, the
# Python stamper discovers every underscore-prefixed publication template for a
# private Desk while keeping a public Shelf empty until deliberate release.
set -e

ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
exec python3 "$ROOT/scripts/stamp-instance.py" "$@"
