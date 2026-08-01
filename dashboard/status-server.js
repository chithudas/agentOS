#!/usr/bin/env node
// Serves agentos-status.html plus a live /api/tasks endpoint reading
// agentos-tasks.json off disk, so the status board reflects real progress
// instead of the template's baked-in sample data. Zero dependencies.
//
// Run from the project root (where install placed agentos-status.html and
// agentos-tasks.json): `node status-server.js`, then open the printed URL.
// Bound to localhost only — this serves task/review data, including
// security findings, and has no auth of its own.
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const TASKS_FILE = path.join(ROOT, "agentos-tasks.json");
const HTML_FILE = path.join(ROOT, "agentos-status.html");
const PORT = process.env.STATUS_PORT || 4500;

const server = http.createServer((req, res) => {
  if (req.url === "/api/tasks") {
    fs.readFile(TASKS_FILE, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "could not read agentos-tasks.json" }));
        return;
      }
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      });
      res.end(data);
    });
    return;
  }

  fs.readFile(HTML_FILE, "utf8", (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("could not read agentos-status.html");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`AgentOS status board (live) — http://localhost:${PORT}`);
  console.log(`Reading task state from ${path.relative(ROOT, TASKS_FILE)}, polled every few seconds.`);
});
