#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { cpSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const app = join(root, "app");

const res = spawnSync("npx", ["next", "build"], { cwd: app, stdio: "inherit", shell: process.platform === "win32" });
if (res.status !== 0) process.exit(res.status || 1);

rmSync(join(app, ".next-cli-build"), { recursive: true, force: true });
cpSync(join(app, ".next"), join(app, ".next-cli-build"), { recursive: true });
