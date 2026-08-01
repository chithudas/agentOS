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
  console.log(`create-agent-os — scaffold the AgentOS framework into a project

Usage:
  npx @chithudas/create-agent-os [target-dir]
  npm create @chithudas/agent-os@latest [target-dir]

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

  const rel = path.relative(process.cwd(), target) || target;
  console.log(`
AgentOS installed at ./${rel}

Next steps:
  1. cd ${rel}
  2. Copy a starting point from templates/ over PROJECT_SPEC.md, e.g.:
       cp templates/web-saas.md PROJECT_SPEC.md
  3. Fill in the bracketed specifics in PROJECT_SPEC.md
  4. Hand AgentOS_MASTER_BUILD_SPEC.md + PROJECT_SPEC.md to your orchestrator to begin
`);
}

main();
