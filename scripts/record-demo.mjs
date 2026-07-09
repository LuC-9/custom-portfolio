#!/usr/bin/env node
/** Thin project wrapper: delegates to globally installed record-app skill scripts. */
import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

const skillScript = path.join(
  process.env.USERPROFILE ?? process.env.HOME ?? "",
  ".cursor",
  "skills",
  "record-app",
  "scripts",
  "portfolio-walkthrough.mjs",
)

if (!fs.existsSync(skillScript)) {
  console.error(`Global record-app skill not found at:\n  ${skillScript}`)
  console.error(
    [
      "One-time setup:",
      "  git clone https://github.com/LuC-9/testreel.git ~/.local/testreel",
      "  cd ~/.local/testreel && npm install && npm run build && npm link",
      "  Copy ~/.cursor/skills/record-app/ from the record-app skill (see AGENTS.md)",
      "Per-project: npm install",
    ].join("\n"),
  )
  process.exit(1)
}

const { runPortfolioWalkthrough } = await import(pathToFileURL(skillScript).href)

await runPortfolioWalkthrough({
  projectRoot: process.cwd(),
  outputMp4: path.join(process.cwd(), "demo", "portfolio-demo.mp4"),
})
