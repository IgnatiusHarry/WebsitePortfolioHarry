#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

cd "$ROOT_DIR"

REMOTE_URL="${ADMIN_DEPLOY_REMOTE:-$(git remote get-url origin)}"
DEPLOY_BRANCH="${ADMIN_DEPLOY_BRANCH:-gh-pages}"
COMMIT_MESSAGE="${ADMIN_DEPLOY_COMMIT_MESSAGE:-chore: sync public content to github pages}"
CNAME_VALUE="${ADMIN_PAGES_CNAME:-}"

if [[ -z "$CNAME_VALUE" && -f "$ROOT_DIR/CNAME" ]]; then
  CNAME_VALUE="$(tr -d '\r' < "$ROOT_DIR/CNAME")"
fi

if [[ ! -d "$ROOT_DIR/public" ]]; then
  echo "Missing public/ directory" >&2
  exit 1
fi

if git ls-remote --exit-code --heads "$REMOTE_URL" "$DEPLOY_BRANCH" >/dev/null 2>&1; then
  git clone --branch "$DEPLOY_BRANCH" --single-branch "$REMOTE_URL" "$TMP_DIR/site"
else
  mkdir -p "$TMP_DIR/site"
  git -C "$TMP_DIR/site" init
  git -C "$TMP_DIR/site" checkout -b "$DEPLOY_BRANCH"
  git -C "$TMP_DIR/site" remote add origin "$REMOTE_URL"
fi

mkdir -p "$TMP_DIR/site"
cp -a "$ROOT_DIR/public/." "$TMP_DIR/site/"
: > "$TMP_DIR/site/.nojekyll"

if [[ -n "$CNAME_VALUE" ]]; then
  printf '%s\n' "$CNAME_VALUE" > "$TMP_DIR/site/CNAME"
fi

cd "$TMP_DIR/site"
git add -A
if git diff --cached --quiet; then
  echo "No public-content changes to publish."
  exit 0
fi

git -c user.name="${GIT_AUTHOR_NAME:-Portfolio Admin}" \
    -c user.email="${GIT_AUTHOR_EMAIL:-portfolio-admin@local}" \
    commit -m "$COMMIT_MESSAGE"

git push origin "$DEPLOY_BRANCH"
echo "Published public content to ${DEPLOY_BRANCH}."
