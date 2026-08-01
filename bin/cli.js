#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const PKG_ROOT = path.join(__dirname, "..");
const EXCLUDE = new Set([
  ".git",
  "node_modules",
  "bin",
  "package.json",
  "package-lock.json",
  "install.sh",
  ".npmignore",
]);

function printHelp() {
  console.log(`agentos-kit — scaffold the AgentOS framework into a project

Usage:
  npx agentos-kit [target-dir]

  target-dir   Where to copy AgentOS into (default: agentos)

Options:
  -h, --help   Show this help
`);
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("-h") || args.includes("--help")) {
    printHelp();
    return;
  }

  const target = path.resolve(process.cwd(), args[0] || "agentos");

  if (fs.existsSync(target)) {
    console.error(
      `Error: '${path.relative(process.cwd(), target) || target}' already exists. Choose a different target directory or remove it first.`
    );
    process.exitCode = 1;
    return;
  }

  console.log(`Installing AgentOS into ${path.relative(process.cwd(), target) || target} ...`);

  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(PKG_ROOT)) {
    if (EXCLUDE.has(entry)) continue;
    copyRecursive(path.join(PKG_ROOT, entry), path.join(target, entry));
  }

  const statusBoard = installStatusBoard(target);

  const rel = path.relative(process.cwd(), target) || target;
  console.log(`
AgentOS installed at ./${rel}
${statusBoard}
Next steps:
  1. cd ${rel}
  2. Copy a starting point from templates/ over PROJECT_SPEC.md, e.g.:
       cp templates/web-saas.md PROJECT_SPEC.md
  3. Fill in the bracketed specifics in PROJECT_SPEC.md
  4. Hand AgentOS_MASTER_BUILD_SPEC.md + PROJECT_SPEC.md to your orchestrator to begin
  5. Run \`node status-server.js\` and open http://localhost:4500 for a live view
     as the orchestrator writes real progress to ./agentos-tasks.json
`);
}

const STATUS_BOARD_NAME = "agentos-status.html";
const STATUS_SERVER_NAME = "status-server.js";
const TASKS_LEDGER_NAME = "agentos-tasks.json";

function copyIfAbsent(src, dest, label) {
  if (!fs.existsSync(src)) return "";
  if (fs.existsSync(dest)) {
    return `Skipped — ./${label} already exists at project root (not overwritten).`;
  }
  fs.copyFileSync(src, dest);
  return null;
}

function installStatusBoard(target) {
  const dashboardDir = path.join(target, "dashboard");
  const root = process.cwd();

  if (!fs.existsSync(path.join(dashboardDir, "dashboard-template.html"))) return "";

  const results = [
    copyIfAbsent(path.join(dashboardDir, "dashboard-template.html"), path.join(root, STATUS_BOARD_NAME), STATUS_BOARD_NAME),
    copyIfAbsent(path.join(dashboardDir, "status-server.js"), path.join(root, STATUS_SERVER_NAME), STATUS_SERVER_NAME),
    copyIfAbsent(path.join(dashboardDir, "agentos-tasks.example.json"), path.join(root, TASKS_LEDGER_NAME), TASKS_LEDGER_NAME),
  ];

  const skipped = results.filter((r) => typeof r === "string" && r !== "");
  const installedCount = results.filter((r) => r === null).length;

  const lines = [];
  if (installedCount > 0) {
    lines.push(`\nStatus board installed at ./${STATUS_BOARD_NAME}, ./${STATUS_SERVER_NAME}, and ./${TASKS_LEDGER_NAME}.`);
    lines.push(`This is a real live server, not a static preview — it polls ./${TASKS_LEDGER_NAME} on disk, which your`);
    lines.push(`orchestrator updates as it dispatches and completes tasks (see DASHBOARD_SPEC.md).`);
  }
  skipped.forEach((msg) => lines.push(msg));
  return lines.length ? lines.join("\n") + "\n" : "";
}

main();
