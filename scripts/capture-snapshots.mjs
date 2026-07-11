#!/usr/bin/env node
/**
 * Fast snapshot-only pass for the site's marketing/README stills:
 *
 *   public/ss1.png         Developer full-page landing
 *   public/ss2.png         Gamer full-page landing
 *   public/portfolioSS.png Viewport-only developer landing (project card
 *                          thumbnail — 4:3 so it crops well inside the
 *                          project cards' aspect-video / aspect-[4/3] boxes).
 *
 * Walks each page top-to-bottom first so scroll-driven reveals (CSS
 * animation-timeline: view()) and Motion `whileInView` fallbacks settle
 * before capture.
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
const CARD = join(REPO_ROOT, "public", "portfolioSS.png")
const VIEWPORT = { width: 1440, height: 900 }
// 4:3 crop that project cards render at up to 50vw / 33vw.
const CARD_VIEWPORT = { width: 1600, height: 1200 }

/**
 * Pin every scroll-driven reveal to its finished state. CSS SDA
 * (animation-timeline: view()) sets .reveal-on-view / .reveal-stagger-item
 * to opacity: 0 whenever they're outside the viewport, so a fullPage stitch
 * would otherwise capture the featured bento and skills strip blank. Motion's
 * `whileInView` reveals use `once: true` and survive the prime scroll, but a
 * belt-and-braces reset for common transform props keeps mid-flight cards
 * from being caught partially animated.
 */
async function forceRevealsSettled(page) {
  await page.addStyleTag({
    content: `
      .reveal-on-view,
      .reveal-stagger-item {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
    `,
  })
  await page.waitForTimeout(200)
}

async function primeAndShoot(page, dest) {
  const height = await page.evaluate(() => document.body.scrollHeight)
  const stride = 400
  for (let y = 0; y <= height; y += stride) {
    await page.evaluate((y) => window.scrollTo(0, y), y)
    await page.waitForTimeout(200)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(500)
  await forceRevealsSettled(page)
  await page.screenshot({ path: dest, fullPage: true })
  console.log(`  Saved ${dest}`)
}

async function shootViewport(page, dest) {
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(400)
  await page.screenshot({ path: dest, fullPage: false })
  console.log(`  Saved ${dest}`)
}

async function withPersonaPage(browser, { persona, viewport, run }) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    colorScheme: "dark",
  })
  await context.addInitScript(({ persona }) => {
    try { localStorage.setItem("persona", persona) } catch {}
    try { sessionStorage.setItem("portfolio:hero-intro:skip:v1", "1") } catch {}
    try { document.documentElement.setAttribute("data-persona", persona) } catch {}
  }, { persona })
  const page = await context.newPage()
  try {
    await page.goto(BASE_URL, { waitUntil: "load", timeout: 30000 })
    await page.waitForTimeout(1200)
    await run(page)
  } finally {
    await context.close()
  }
}

const browser = await chromium.launch({ headless: true })
try {
  await withPersonaPage(browser, {
    persona: "developer",
    viewport: VIEWPORT,
    run: (page) => primeAndShoot(page, SS1),
  })
  await withPersonaPage(browser, {
    persona: "gamer",
    viewport: VIEWPORT,
    run: (page) => primeAndShoot(page, SS2),
  })
  await withPersonaPage(browser, {
    persona: "developer",
    viewport: CARD_VIEWPORT,
    run: (page) => shootViewport(page, CARD),
  })
} finally {
  await browser.close()
}

console.log("Done.")
