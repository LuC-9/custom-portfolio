/**
 * Multi-device UI audit.
 *
 * Boots a Playwright browser against a running Next.js server (default
 * http://localhost:3000) and captures full-page screenshots of every major
 * route on a range of viewport profiles (small phone, large phone, tablet
 * portrait, laptop, desktop). Also validates that the hero cinematic:
 *   - plays on the very first page load,
 *   - plays again after a hard reload,
 *   - stays hidden when a route is soft-navigated back to /.
 *
 * Output: artifacts/device-audit/<viewport>/<route>-<persona>-<state>.png plus
 * artifacts/device-audit/report.json summarizing intro presence checks and
 * console/pageerror events.
 *
 * Usage:
 *   npm run build && PORT=3000 npm run start &
 *   node scripts/audit-devices.mjs
 */
import { chromium, devices } from "playwright"
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const BASE = process.env.DEMO_URL || "http://localhost:3000"
const OUT = "artifacts/device-audit"
const SKIP_KEY = "portfolio:hero-intro:skip:v1"
mkdirSync(OUT, { recursive: true })

const VIEWPORTS = [
  { key: "phone-small", label: "iPhone SE (375x667)", device: devices["iPhone SE"], colorScheme: "dark" },
  { key: "phone-large", label: "iPhone 14 Pro Max (430x932)", device: devices["iPhone 14 Pro Max"], colorScheme: "dark" },
  { key: "tablet", label: "iPad Mini portrait (768x1024)", device: devices["iPad Mini"], colorScheme: "dark" },
  {
    key: "laptop",
    label: "Laptop (1366x768)",
    device: { viewport: { width: 1366, height: 768 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
    colorScheme: "dark",
  },
  {
    key: "desktop",
    label: "Desktop (1920x1080)",
    device: { viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
    colorScheme: "dark",
  },
]

const ROUTES = [
  { path: "/", key: "home", personas: ["developer", "gamer"] },
  { path: "/projects", key: "projects", personas: ["developer"] },
  { path: "/blog", key: "blog", personas: ["developer"] },
  { path: "/contact", key: "contact", personas: ["developer"] },
  { path: "/community", key: "community", personas: ["gamer"] },
]

const browser = await chromium.launch({ headless: true })
const report = { base: BASE, viewports: {} }

async function bootContext({ device, colorScheme }, { persona, bypassIntro }) {
  const context = await browser.newContext({ ...device, colorScheme })
  await context.addInitScript(
    ({ persona, bypassIntro, skipKey }) => {
      try { localStorage.setItem("persona", persona) } catch {}
      try {
        if (bypassIntro) sessionStorage.setItem(skipKey, "1")
        else sessionStorage.removeItem(skipKey)
      } catch {}
      try { document.documentElement.setAttribute("data-persona", persona) } catch {}
    },
    { persona, bypassIntro, skipKey: SKIP_KEY },
  )
  return context
}

async function scrollAndShoot(page, dest) {
  await page.waitForLoadState("networkidle").catch(() => {})
  await page.waitForTimeout(400)
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  const stride = 500
  for (let y = 0; y < height; y += stride) {
    await page.evaluate((py) => window.scrollTo(0, py), y)
    await page.waitForTimeout(180)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(350)
  await page.screenshot({ path: dest, fullPage: true })
}

async function heroIntroPresent(page, { timeout = 4000 } = {}) {
  try {
    await page
      .locator('[role="dialog"][aria-label^="Persona intro"]')
      .first()
      .waitFor({ state: "visible", timeout })
    return true
  } catch {
    return false
  }
}

async function runViewport(vp) {
  const vpDir = join(OUT, vp.key)
  mkdirSync(vpDir, { recursive: true })
  const vpReport = { label: vp.label, routes: {}, intro: {}, issues: [] }
  console.log(`\n[${vp.key}] ${vp.label}`)

  // Intro sanity checks: first load, hard reload, and soft nav.
  {
    const context = await bootContext(vp, { persona: "developer", bypassIntro: false })
    const page = await context.newPage()
    const errors = []
    page.on("pageerror", (e) => errors.push(String(e)))
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`)
    })

    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 20000 })
    const firstLoadIntro = await heroIntroPresent(page)
    await page.waitForTimeout(1200)
    await page.screenshot({ path: join(vpDir, `intro-first-load.png`) })
    // Wait for the cinematic to fully finish before reloading so we don't
    // race the exit animation (HOLD_MS + EXIT_MS ≈ 2470 ms).
    await page.waitForTimeout(2500)

    await page.reload({ waitUntil: "domcontentloaded" })
    const reloadIntro = await heroIntroPresent(page)
    await page.waitForTimeout(1200)
    await page.screenshot({ path: join(vpDir, `intro-after-reload.png`) })
    await page.waitForTimeout(2500)

    // Soft-nav test: click into another route via a Next.js <Link>, then
    // click the Home link in the header (also a <Link>). Both are SPA
    // transitions, so the intro must NOT replay.
    const projectsLink = page.getByRole("link", { name: "View my work" }).first()
    if (await projectsLink.count()) {
      await projectsLink.click().catch(() => {})
    } else {
      await page.getByRole("link", { name: "Projects" }).first().click().catch(() => {})
    }
    await page.waitForURL(/\/projects/, { timeout: 5000 }).catch(() => {})
    await page.waitForTimeout(400)
    const headerHome = page.locator('header a[href="/"]').first()
    if (await headerHome.count()) {
      await headerHome.click().catch(() => {})
    }
    await page.waitForTimeout(700)
    const softNavIntro = await heroIntroPresent(page, { timeout: 1500 })

    vpReport.intro = {
      firstLoad: firstLoadIntro,
      afterReload: reloadIntro,
      softNav: softNavIntro,
      errors,
    }
    if (!firstLoadIntro) vpReport.issues.push("Intro missing on first load")
    if (!reloadIntro) vpReport.issues.push("Intro missing after reload")
    if (softNavIntro) vpReport.issues.push("Intro replayed on SPA soft nav (unexpected)")
    await context.close()
  }

  // Full-page screenshots per route/persona with intro bypassed.
  for (const route of ROUTES) {
    for (const persona of route.personas) {
      const context = await bootContext(vp, { persona, bypassIntro: true })
      const page = await context.newPage()
      const errors = []
      page.on("pageerror", (e) => errors.push(String(e)))
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`)
      })
      const dest = join(vpDir, `${route.key}-${persona}.png`)
      try {
        await page.goto(`${BASE}${route.path}`, { waitUntil: "domcontentloaded", timeout: 25000 })
        await scrollAndShoot(page, dest)
        vpReport.routes[`${route.key}-${persona}`] = { ok: true, errors }
        console.log(`  ✓ ${route.key} (${persona})`)
      } catch (err) {
        vpReport.routes[`${route.key}-${persona}`] = { ok: false, error: String(err), errors }
        vpReport.issues.push(`${route.key} (${persona}) failed: ${err}`)
        console.log(`  ✗ ${route.key} (${persona}) → ${err}`)
      } finally {
        await context.close()
      }
    }
  }

  report.viewports[vp.key] = vpReport
}

for (const vp of VIEWPORTS) {
  await runViewport(vp)
}

await browser.close()
writeFileSync(join(OUT, "report.json"), JSON.stringify(report, null, 2))

console.log("\nSummary:")
for (const [key, data] of Object.entries(report.viewports)) {
  const badRoutes = Object.entries(data.routes).filter(([, r]) => !r.ok).map(([k]) => k)
  console.log(
    `  ${key.padEnd(12)} intro(first=${data.intro.firstLoad}, reload=${data.intro.afterReload}, softNav=${data.intro.softNav})`
      + (badRoutes.length ? ` | failed: ${badRoutes.join(", ")}` : ""),
  )
  for (const issue of data.issues) console.log(`    · ${issue}`)
}
console.log(`\nArtifacts written to ${OUT}`)
