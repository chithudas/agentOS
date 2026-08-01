#!/usr/bin/env bash
# Installs the AgentOS spec/framework into an existing project as a subdirectory.
#
# Usage:
#   ./install.sh [target-dir] [repo-url]
#
#   target-dir   Where to copy AgentOS into (default: agentos)
#   repo-url     Git URL to clone from (default: this project's GitHub repo)
#
# Example:
#   curl -fsSL https://raw.githubusercontent.com/chithudas/agentos-kit/main/install.sh | bash -s -- agentos

set -euo pipefail

TARGET="${1:-agentos}"
REPO_URL="${2:-https://github.com/chithudas/agentos-kit.git}"

if [ -e "$TARGET" ]; then
  echo "Error: '$TARGET' already exists. Choose a different target directory or remove it first." >&2
  exit 1
fi

echo "Cloning AgentOS from $REPO_URL into ./$TARGET ..."
git clone --depth 1 "$REPO_URL" "$TARGET"

# Detach from the AgentOS repo's own git history and installer script —
# this copy belongs to the target project now, not to AgentOS's own repo.
rm -rf "$TARGET/.git" "$TARGET/install.sh"

echo
echo "AgentOS installed at ./$TARGET"
echo
echo "Next steps:"
echo "  1. cd $TARGET"
echo "  2. Copy a starting point from templates/ over PROJECT_SPEC.md, e.g.:"
echo "       cp templates/web-saas.md PROJECT_SPEC.md"
echo "  3. Fill in the bracketed specifics in PROJECT_SPEC.md"
echo "  4. Hand AgentOS_MASTER_BUILD_SPEC.md + PROJECT_SPEC.md to your orchestrator to begin"
