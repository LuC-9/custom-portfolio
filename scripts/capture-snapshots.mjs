#!/usr/bin/env node
/**
 * Fast snapshot-only pass: captures public/ss1.png (developer home) and
 * public/ss2.png (gamer home) as full-page stills. Walks the page top-to-
 * bottom first so Motion `whileInView` reveals settle before capture.
 *
 * Usage:
 *   npm run capture:snapshots
 *   node scripts/capture-snapshots.mjs
 *
 * Overrides via env: DEMO_URL (default http://localhost:3000).
 */
import { chromium } from "playwright"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(HERE, "..")
const BASE_URL = process.env.DEMO_URL || "http://localhost:3000"
const SS1 = join(REPO_ROOT, "public", "ss1.png")
const SS2 = join(REPO_ROOT, "public", "ss2.png")
const VIEWPORT = { width: 1440, height: 900 }

async function primeAndShoot(page, dest) {
  const height = await page.evaluate(() => document.body.scrollHeight)
  const stride = 400
  for (let y = 0; y <= height; y += stride) {
    await page.evaluate((y) => window.scrollTo(0, y), y)
    await page.waitForTimeout(200)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(500)
  await page.screenshot({ path: dest, fullPage: true })
  console.log(`  Saved ${dest}`)
}

const browser = await chromium.launch({ headless: true })
try {
  for (const [persona, dest] of [
    ["developer", SS1],
    ["gamer", SS2],
  ]) {
    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: 1,
      colorScheme: "dark",
    })
    await context.addInitScript(({ persona }) => {
      try { localStorage.setItem("persona", persona) } catch {}
      try { sessionStorage.setItem("portfolio:hero-intro:skip:v1", "1") } catch {}
      try { document.documentElement.setAttribute("data-persona", persona) } catch {}
    }, { persona })
    const page = await context.newPage()
    await page.goto(BASE_URL, { waitUntil: "load", timeout: 30000 })
    await page.waitForTimeout(1200)
    await primeAndShoot(page, dest)
    await context.close()
  }
} finally {
  await browser.close()
}

console.log("Done.")
