/**
 * Mobile audit: capture screenshots of every major surface at iPhone-scale
 * viewport (390x844) so we can see what's actually broken on mobile.
 *
 * Also captures hero-only crops to inspect the first-viewport-fit rule (Section 4.7).
 */
import { chromium, devices } from "playwright"
import { mkdirSync, existsSync } from "node:fs"
import { join } from "node:path"

const OUT = "artifacts/mobile-audit"
mkdirSync(OUT, { recursive: true })

const BASE = "http://localhost:3000"

const iphone = devices["iPhone 13 Pro"]
const browser = await chromium.launch({ headless: true })

async function shoot(persona, path, name) {
  const context = await browser.newContext({
    ...iphone,
    colorScheme: "dark",
  })
  await context.addInitScript((p) => {
    try {
      localStorage.setItem("persona", p)
      sessionStorage.setItem("portfolio:hero-intro:v1", "1")
    } catch {}
  }, persona)
  const page = await context.newPage()
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(600)

  // hero-fit shot: viewport crop only
  await page.screenshot({ path: join(OUT, `${name}-hero.png`) })

  // scroll pass to trigger whileInView animations
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  const step = 500
  for (let y = 0; y < height; y += step) {
    await page.evaluate((py) => window.scrollTo(0, py), y)
    await page.waitForTimeout(200)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(400)

  // full-page shot
  await page.screenshot({ path: join(OUT, `${name}-full.png`), fullPage: true })
  console.log(`  ${name}: hero + full captured`)
  await context.close()
}

console.log("mobile audit @ 390x844")

await shoot("developer", "/", "01-home-dev")
await shoot("gamer", "/", "02-home-gamer")
await shoot("developer", "/projects", "03-projects")
await shoot("developer", "/blog", "04-blog")
await shoot("developer", "/contact", "05-contact")
await shoot("gamer", "/community", "06-community")

await browser.close()
console.log("done —", OUT)
