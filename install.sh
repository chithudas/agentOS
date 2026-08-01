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

STATUS_BOARD="agentos-status.html"
STATUS_SERVER="status-server.js"
TASKS_LEDGER="agentos-tasks.json"
installed_any=0

if [ -f "$TARGET/dashboard/dashboard-template.html" ]; then
  if [ -e "$STATUS_BOARD" ]; then
    echo
    echo "Skipped — ./$STATUS_BOARD already exists at project root (not overwritten)."
  else
    cp "$TARGET/dashboard/dashboard-template.html" "$STATUS_BOARD"
    installed_any=1
  fi

  if [ -e "$STATUS_SERVER" ]; then
    echo "Skipped — ./$STATUS_SERVER already exists at project root (not overwritten)."
  else
    cp "$TARGET/dashboard/status-server.js" "$STATUS_SERVER"
    installed_any=1
  fi

  if [ -e "$TASKS_LEDGER" ]; then
    echo "Skipped — ./$TASKS_LEDGER already exists at project root (not overwritten)."
  else
    cp "$TARGET/dashboard/agentos-tasks.example.json" "$TASKS_LEDGER"
    installed_any=1
  fi

  if [ "$installed_any" = "1" ]; then
    echo
    echo "Status board installed at ./$STATUS_BOARD, ./$STATUS_SERVER, and ./$TASKS_LEDGER."
    echo "This is a real live server, not a static preview — it polls ./$TASKS_LEDGER on disk, which your"
    echo "orchestrator updates as it dispatches and completes tasks (see DASHBOARD_SPEC.md)."
  fi
fi

echo
echo "AgentOS installed at ./$TARGET"
echo
echo "Next steps:"
echo "  1. cd $TARGET"
echo "  2. Copy a starting point from templates/ over PROJECT_SPEC.md, e.g.:"
echo "       cp templates/web-saas.md PROJECT_SPEC.md"
echo "  3. Fill in the bracketed specifics in PROJECT_SPEC.md"
echo "  4. Hand AgentOS_MASTER_BUILD_SPEC.md + PROJECT_SPEC.md to your orchestrator to begin"
echo "  5. Run \`node status-server.js\` and open http://localhost:4500 for a live view"
echo "     as the orchestrator writes real progress to ./agentos-tasks.json"
