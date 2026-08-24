#!/bin/sh
# Copy this Bookself tree into an empty destination and stamp instance identity.
#
# Usage:
#   scripts/stamp-instance.sh <dest> <binder|shelf> [github-owner] [repo-name]
#
# If github-owner is omitted, github is left in auto mode. GitHub Pages can
# infer public shelf identity automatically; private/local binders can still
# use reader + desk and may fill owner/repo in imprint.json later.
set -e

ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
DEST=${1:-}
ROLE=${2:-}
OWNER=${3:-auto}
REPO=${4:-}

if [ -z "$DEST" ] || [ -z "$ROLE" ]; then
  echo "usage: scripts/stamp-instance.sh <dest> <binder|shelf> [github-owner] [repo-name]" >&2
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

if [ -z "$REPO" ]; then
  REPO=$(basename "$DEST")
fi

mkdir -p "$DEST"
rsync -a \
  --exclude '.git/' \
  --exclude '.DS_Store' \
  --exclude '.github/workflows/' \
  --include 'books/' \
  --include 'books/_TEMPLATE/***' \
  --include 'books/_PAPER_TEMPLATE/***' \
  --exclude 'books/*' \
  --exclude 'docs/superpowers/' \
  --exclude 'docs/instances/' \
  --exclude 'imprint.json' \
  --exclude 'README.md' \
  "$ROOT/" "$DEST/"

# Binder keeps the blank authoring starters. Shelf starts with no publication
# content; the first intentional release creates books/<slug>/.
if [ "$ROLE" = "shelf" ]; then
  rm -rf "$DEST/books/_TEMPLATE" "$DEST/books/_PAPER_TEMPLATE"
fi

cp "$ROOT/docs/instances/${ROLE}-README.md" "$DEST/README.md"

if [ "$ROLE" = "binder" ]; then
  NAME="Private Binder"
  SHORT="Binder"
  DESCRIPTION="Private Bookself workspace for drafts and manuscripts."
  KICKER="Private manuscripts · Git-native writing"
  LEDE="Draft and revise here. The same reader and publishing desk are shared with your public shelf."
  HOME="Binder"
else
  NAME="Public Shelf"
  SHORT="Shelf"
  DESCRIPTION="Public Bookself shelf for published Markdown books."
  KICKER="Published on Git · Read like a book"
  LEDE="Published books live here. Drafts stay in the private binder."
  HOME="Shelf"
fi

PREFIX=$(printf '%s-%s' "$ROLE" "$REPO" | tr '[:upper:]_ ' '[:lower:]--' | tr -cd 'a-z0-9-')

cat > "$DEST/imprint.json" <<EOF
{
  "role": "$ROLE",
  "name": "$NAME",
  "shortName": "$SHORT",
  "description": "$DESCRIPTION",
  "kicker": "$KICKER",
  "lede": "$LEDE",
  "credit": "",
  "creditHref": "",
  "writeHref": "../desk/",
  "writeLabel": "Publishing desk",
  "forkHref": "",
  "forkLabel": "",
  "homeLabel": "$HOME",
  "storagePrefix": "$PREFIX",
  "steps": [],
  "github": {
    "owner": "$OWNER",
    "repo": "$REPO",
    "branch": "main"
  }
}
EOF

echo "Stamped $ROLE → $DEST"
echo "Shared UI included: reader/ + desk/"
echo "Instance-owned files: books/, README.md, imprint.json"
if [ "$ROLE" = "shelf" ]; then
  echo "Publication content starts empty; the first release creates books/<slug>/."
  echo "Enable GitHub Pages for the public shelf."
else
  echo "Blank starters included: books/_TEMPLATE + books/_PAPER_TEMPLATE"
  echo "Keep the binder private. Do not enable public Pages for unpublished manuscripts."
fi
if [ "$OWNER" = "auto" ]; then
  echo "Optional: edit imprint.json and set github.owner for repository edit/history links."
fi
