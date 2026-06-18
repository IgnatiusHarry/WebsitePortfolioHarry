#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

SOURCE_BRANCH="$(git branch --show-current)"
if [[ -z "$SOURCE_BRANCH" ]]; then
  echo "Could not determine current git branch" >&2
  exit 1
fi

COMMIT_MESSAGE="${ADMIN_SOURCE_COMMIT_MESSAGE:-chore: update portfolio content from admin}"

# Admin only edits files under public/, so stage only that scope.
git add public/

if git diff --cached --quiet; then
  echo "No source-branch changes to commit."
else
  git -c user.name="${GIT_AUTHOR_NAME:-Portfolio Admin}" \
      -c user.email="${GIT_AUTHOR_EMAIL:-portfolio-admin@local}" \
      commit -m "$COMMIT_MESSAGE"
  git push origin "$SOURCE_BRANCH"
  echo "Pushed source branch ${SOURCE_BRANCH}."
fi

"$ROOT_DIR/scripts/deploy-gh-pages.sh"
