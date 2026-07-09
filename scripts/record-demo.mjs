#!/usr/bin/env node
/**
 * Comprehensive portfolio demo recording — testreel edition.
 *
 * Wraps a Playwright page with testreel's `recordPage` so we get:
 *   - macOS-style window chrome (traffic lights, title bar)
 *   - Padded gradient background with rounded corners
 *   - Animated cursor with click ripples
 *   - Native `recorder.click/type/hover/scroll/zoom` that align with the overlays
 *
 * On top of that we drive a 17-beat tour of every major component and add our
 * own section-label pill + intro/outro title-card overlays.
 *
 * Note: ss1.png / ss2.png are handled by `scripts/capture-snapshots.mjs` (clean
 * full-page stills, no window chrome).
 *
 * Usage:
 *   npm run record:demo
 *
 * Env overrides:
 *   DEMO_URL          default http://localhost:3000
 *   ARTIFACTS_DIR     default ./artifacts (also mirrored to demo/portfolio-demo.mp4)
 */
import { chromium } from "playwright"
import { copyFileSync, existsSync, mkdirSync } from "node:fs"
import { execSync } from "node:child_process"
import os from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(HERE, "..")

const BASE_URL = process.env.DEMO_URL || "http://localhost:3000"
const ARTIFACTS_DIR = process.env.ARTIFACTS_DIR || join(REPO_ROOT, "artifacts")
const DEMO_OUT = process.env.DEMO_OUT || join(REPO_ROOT, "demo", "portfolio-demo.mp4")

mkdirSync(ARTIFACTS_DIR, { recursive: true })
mkdirSync(dirname(DEMO_OUT), { recursive: true })

// -----------------------------------------------------------------------------
// testreel resolution — mirrors record-app skill's `resolve-testreel-deps.mjs`.
// Prefers the LuC-9 fork at ~/.local/testreel (no `npm link` needed), falls
// back to `node_modules/testreel` if the project installed it locally.
// -----------------------------------------------------------------------------
function resolveTestreelEntry() {
  const home = process.env.USERPROFILE ?? os.homedir()
  const globalEntry = join(home, ".local", "testreel", "dist", "index.js")
  if (existsSync(globalEntry)) return globalEntry
  const projectEntry = join(REPO_ROOT, "node_modules", "testreel", "dist", "index.js")
  if (existsSync(projectEntry)) return projectEntry
  throw new Error(
    [
      "testreel not found. Install once:",
      "  git clone https://github.com/LuC-9/testreel.git ~/.local/testreel",
      "  cd ~/.local/testreel && npm install && npm run build",
      "Or per-project: npm install -D github:LuC-9/testreel",
    ].join("\n"),
  )
}
const testreelEntry = resolveTestreelEntry()
const { recordPage, hideCursor, showCursor } = await import(pathToFileURL(testreelEntry).href)

// -----------------------------------------------------------------------------
// ffmpeg — testreel's git fork doesn't ship ffmpeg-static, so `recorder.stop()`
// fails with ENOENT unless FFMPEG_PATH is set. Same detection as the skill's
// `ffmpeg-utils.mjs → ensureFfmpeg()` (silent variant).
// -----------------------------------------------------------------------------
if (!process.env.FFMPEG_PATH) {
  const home = process.env.USERPROFILE ?? os.homedir()
  const candidates = [
    home && join(home, "scoop", "shims", "ffmpeg.exe"),
    home && join(home, "scoop", "apps", "ffmpeg", "current", "bin", "ffmpeg.exe"),
    "C:/ProgramData/chocolatey/bin/ffmpeg.exe",
    "C:/ffmpeg/bin/ffmpeg.exe",
    "/opt/homebrew/bin/ffmpeg",
    "/usr/local/bin/ffmpeg",
    "/usr/bin/ffmpeg",
  ].filter(Boolean)
  let resolved = candidates.find((p) => existsSync(p))
  if (!resolved) {
    try {
      const cmd = process.platform === "win32" ? "where ffmpeg" : "which ffmpeg"
      const out = execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim().split(/\r?\n/)[0]
      if (out && existsSync(out)) resolved = out
    } catch {
      /* leave unset — testreel will surface a clear error */
    }
  }
  if (resolved) process.env.FFMPEG_PATH = resolved
}
if (process.env.FFMPEG_PATH) console.log(`Using ffmpeg: ${process.env.FFMPEG_PATH}`)

// -----------------------------------------------------------------------------
// Overlay helpers (labels + title cards) — sit above testreel's chrome overlay.
// -----------------------------------------------------------------------------

const OVERLAY_CSS = `
  #demo-label {
    position: fixed; top: 68px; left: 50%; transform: translateX(-50%);
    z-index: 2147483647;
    background: rgba(8, 10, 18, 0.88); color: #f8fafc;
    padding: 12px 26px; border-radius: 999px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 18px; letter-spacing: 0.02em; backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.16);
    box-shadow: 0 12px 40px rgba(0,0,0,0.45);
    opacity: 0; transition: opacity 0.35s ease; pointer-events: none;
  }
  #demo-title-card {
    position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;
    z-index: 2147483647;
    background: radial-gradient(circle at center, rgba(15,23,42,0.55), rgba(2,6,23,0.92));
    pointer-events: none;
  }
  #demo-title-card h1 {
    margin: 0; color: white; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 64px; text-align: center; text-shadow: 0 8px 30px rgba(0,0,0,0.55);
  }
  #demo-title-card p {
    margin: 20px 0 0; color: rgba(226,232,240,0.9); font-size: 24px; text-align: center;
  }
`

async function installOverlays(page) {
  await page.evaluate((css) => {
    if (document.getElementById("demo-overlays-css")) return
    const style = document.createElement("style")
    style.id = "demo-overlays-css"
    style.textContent = css
    document.head.appendChild(style)
    if (!document.getElementById("demo-label")) {
      const label = document.createElement("div")
      label.id = "demo-label"
      document.body.appendChild(label)
    }
  }, OVERLAY_CSS)
}

async function showLabel(page, text, holdMs = 1600) {
  await installOverlays(page)
  await page.evaluate((text) => {
    const label = document.getElementById("demo-label")
    if (label) { label.textContent = text; label.style.opacity = "1" }
  }, text)
  await page.waitForTimeout(holdMs)
}

async function hideLabel(page) {
  await page.evaluate(() => {
    const label = document.getElementById("demo-label")
    if (label) label.style.opacity = "0"
  })
  await page.waitForTimeout(300)
}

async function showTitleCard(page, title, subtitle, holdMs = 2200) {
  await installOverlays(page)
  await page.evaluate(({ title, subtitle }) => {
    document.getElementById("demo-title-card")?.remove()
    const card = document.createElement("div")
    card.id = "demo-title-card"
    card.innerHTML = `<div><h1>${title}</h1><p>${subtitle}</p></div>`
    document.body.appendChild(card)
  }, { title, subtitle })
  await page.waitForTimeout(holdMs)
  await page.evaluate(() => document.getElementById("demo-title-card")?.remove())
  await page.waitForTimeout(350)
}

// -----------------------------------------------------------------------------
// Browser + testreel recorder
// -----------------------------------------------------------------------------

console.log("Recording demo from", BASE_URL)

const VIEWPORT = { width: 1920, height: 1080 }
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: VIEWPORT,
  recordVideo: { dir: join(ARTIFACTS_DIR, "demo-raw"), size: VIEWPORT },
  deviceScaleFactor: 1,
  colorScheme: "dark",
})

// Seed initial persona (developer). Persona swaps mid-tour happen via UI clicks
// so the animate-out / animate-in visuals actually appear in the recording.
await context.addInitScript(() => {
  try { localStorage.setItem("persona", "developer") } catch {}
})

const page = await context.newPage()

const recorder = await recordPage(page, {
  outputDir: ARTIFACTS_DIR,
  name: "portfolio-demo",
  outputFormat: "mp4",
  keepIntermediates: false,
  chrome: {
    enabled: true,
    titleBarHeight: 38,
    titleBarColor: "#0b0d14",
    trafficLights: true,
    url: "byluc.in",
  },
  background: {
    enabled: true,
    gradient: { from: "#0f172a", to: "#1e1b4b" },
    padding: 44,
    borderRadius: 14,
  },
  cursor: {
    enabled: true,
    size: 44,
    color: "#ff3b5c",
    rippleColor: "#ff3b5c",
    rippleSize: 96,
    transitionMs: 220,
    idleHide: true,
    idleHideMs: 4000,
    fadeMs: 350,
  },
})

// -----------------------------------------------------------------------------
// Tour helpers
// -----------------------------------------------------------------------------

async function runBeat(name, fn) {
  try {
    await fn()
  } catch (err) {
    console.warn(`  ! Beat "${name}" skipped: ${err.message?.split("\n")[0] ?? err}`)
    try { await hideLabel(page) } catch {}
  }
}

async function nav(path) {
  await recorder.navigate(`${BASE_URL}${path}`)
  await page.waitForTimeout(600)
  await installOverlays(page)
}

// -----------------------------------------------------------------------------
// Tour (17 beats)
// -----------------------------------------------------------------------------

// Beat 1 — Intro title card + hero cinematic
await runBeat("intro", async () => {
  await recorder.navigate(BASE_URL)
  await page.waitForTimeout(400)
  await installOverlays(page)
  await hideCursor(page)
  await showTitleCard(page, "Aarsh Mishra", "Portfolio · Developer & Gamer")
  await showLabel(page, "Hero cinematic", 800)
  await page.waitForTimeout(3200)
  await hideLabel(page)
  await showCursor(page)
})

// Beat 2 — Developer hero
await runBeat("hero developer", async () => {
  await showLabel(page, "Hero · developer persona")
  await recorder.hover("h1", { timeout: 5000 }).catch(() => {})
  await recorder.zoom({ selector: "h1", scale: 1.25, duration: 700 }).catch(() => {})
  await page.waitForTimeout(1400)
  await recorder.zoom({ scale: 1, duration: 500 }).catch(() => {})
  await hideLabel(page)
})

// Beat 3 — Persona toggle to gamer
await runBeat("toggle to gamer", async () => {
  await showLabel(page, "Persona toggle")
  await recorder.click('[role="group"][aria-label="Persona toggle"] button:has-text("GAMER")', {
    zoom: 1.4,
    zoomOut: true,
  })
  await page.waitForTimeout(900)
  await hideLabel(page)
})

// Beat 4 — Gamer hero
await runBeat("gamer hero", async () => {
  await showLabel(page, "Gamer persona")
  await recorder.scroll({ y: -2000, scrollSpeed: 2 })
  await recorder.hover("h1").catch(() => {})
  await recorder.zoom({ selector: "h1", scale: 1.2, duration: 700 }).catch(() => {})
  await page.waitForTimeout(1400)
  await recorder.zoom({ scale: 1, duration: 500 }).catch(() => {})
  await hideLabel(page)
})

// Beat 5 — Toggle back to developer for the deeper tour
await runBeat("toggle back to developer", async () => {
  await recorder.click('[role="group"][aria-label="Persona toggle"] button:has-text("DEVELOPER")', {
    zoom: 1.3,
    zoomOut: true,
  })
  await page.waitForTimeout(800)
})

// Beat 6 — Kinetic marquee
await runBeat("kinetic marquee", async () => {
  await showLabel(page, "Kinetic marquee · always in motion")
  const marqueeExists = await page.locator(".skills-marquee-track, [data-marquee]").count()
  if (marqueeExists) {
    await recorder.hover(".skills-marquee-track, [data-marquee]").catch(() => {})
  }
  await page.waitForTimeout(2200)
  await hideLabel(page)
})

// Beat 7 — Experience timeline
await runBeat("experience timeline", async () => {
  await showLabel(page, "Zigzag experience timeline")
  await recorder.scroll({ y: 700, scrollSpeed: 1.4 })
  const exp = page.locator('section[aria-label="Selected experience"] article, section[aria-label="Selected experience"] li').first()
  if (await exp.count()) {
    await recorder.hover(exp).catch(() => {})
    await recorder.zoom({ selector: exp, scale: 1.2, duration: 700 }).catch(() => {})
    await page.waitForTimeout(1200)
    await recorder.zoom({ scale: 1, duration: 500 }).catch(() => {})
  }
  await recorder.scroll({ y: 400, scrollSpeed: 1.4 })
  await hideLabel(page)
})

// Beat 8 — Featured bento
await runBeat("featured bento", async () => {
  await showLabel(page, "Featured work · project + blog bento")
  await recorder.scroll({ y: 500, scrollSpeed: 1.4 })
  const card = page.locator('main a[href^="/projects/"], main a[href^="/blog/"]').first()
  if (await card.count()) {
    await recorder.hover(card).catch(() => {})
    await recorder.zoom({ selector: card, scale: 1.22, duration: 700 }).catch(() => {})
    await page.waitForTimeout(1200)
    await recorder.zoom({ scale: 1, duration: 500 }).catch(() => {})
  }
  await hideLabel(page)
})

// Beat 9 — Projects page
await runBeat("projects grid", async () => {
  await showLabel(page, "Projects grid")
  await nav("/projects")
  await recorder.scroll({ y: 500, scrollSpeed: 1.4 })
  const proj = page.locator('a[href^="/projects/"]').first()
  if (await proj.count()) {
    await recorder.hover(proj).catch(() => {})
    await recorder.zoom({ selector: proj, scale: 1.25, duration: 700 }).catch(() => {})
    await page.waitForTimeout(1100)
    await recorder.zoom({ scale: 1, duration: 500 }).catch(() => {})
  }
  await hideLabel(page)
})

// Beat 10 — Blog search
await runBeat("blog search", async () => {
  await showLabel(page, "Blog · search & filter")
  await nav("/blog")
  const search = page.locator("#blog-search").first()
  if (await search.count()) {
    await recorder.click(search, { zoom: 1.25 })
    await recorder.type(search, "next", { delay: 100 })
    await page.waitForTimeout(1200)
    await recorder.type(search, "", { clear: true })
    await recorder.zoom({ scale: 1, duration: 400 }).catch(() => {})
  }
  await hideLabel(page)
})

// Beat 11 — Persona filter chip
await runBeat("persona filter", async () => {
  await showLabel(page, "Persona filter chips")
  const chip = page.locator('button:has-text("Code")').first()
  if (await chip.count()) {
    await recorder.click(chip, { zoom: 1.3, zoomOut: true })
    await page.waitForTimeout(600)
  }
  await hideLabel(page)
})

// Beat 12 — More posts divider
await runBeat("more posts divider", async () => {
  await showLabel(page, "More posts · edge-to-edge divider")
  await recorder.scroll({ y: 700, scrollSpeed: 1.4 })
  await page.waitForTimeout(1200)
  await hideLabel(page)
})

// Beat 13 — Article view
await runBeat("article view", async () => {
  await showLabel(page, "Article view · markdown & TL;DR")
  await recorder.scroll({ y: -500, scrollSpeed: 1.5 })
  const article = page.locator('a[href^="/blog/"]').first()
  if (await article.count()) {
    await recorder.click(article, { zoom: 1.15, zoomOut: true })
    await page.waitForTimeout(1400)
  }
  await recorder.scroll({ y: 800, scrollSpeed: 1.3 })
  await page.waitForTimeout(700)
  await hideLabel(page)
})

// Beat 14 — Contact form
await runBeat("contact form", async () => {
  await showLabel(page, "Contact · form + Telegram delivery")
  await nav("/contact")
  await recorder.scroll({ y: 200, scrollSpeed: 1.3 })
  const name = page.locator('input[name="name"], input[id*="name"]').first()
  if (await name.count()) {
    await recorder.click(name, { zoom: 1.2 })
    await recorder.type(name, "LuC", { delay: 110 })
    await page.waitForTimeout(500)
    await recorder.zoom({ scale: 1, duration: 400 }).catch(() => {})
  }
  await hideLabel(page)
})

// Beat 15 — Community (gamer)
await runBeat("community", async () => {
  await showLabel(page, "Community · streams & Discord")
  // Flip persona through UI so the transition shows
  await nav("/")
  await recorder.click('[role="group"][aria-label="Persona toggle"] button:has-text("GAMER")', {
    zoom: 1.3,
    zoomOut: true,
  })
  await page.waitForTimeout(700)
  await nav("/community")
  await recorder.scroll({ y: 600, scrollSpeed: 1.4 })
  await page.waitForTimeout(700)
  await hideLabel(page)
})

// Beat 16 — Gamification HUD (left-rail floating hint)
await runBeat("game HUD", async () => {
  await nav("/")
  // We're still on gamer persona
  await showLabel(page, "Gamification HUD · floating hints & class card")
  const hint = page.locator("a, button").filter({
    hasText: /Open (GitHub|LinkedIn|YouTube|LeetCode|Twitch)|Visit Contact|Download resume/i,
  }).first()
  if (await hint.count()) {
    await recorder.hover(hint).catch(() => {})
    await recorder.zoom({ selector: hint, scale: 1.4, duration: 700 }).catch(() => {})
    await page.waitForTimeout(1400)
    await recorder.zoom({ scale: 1, duration: 500 }).catch(() => {})
  }
  await hideLabel(page)
})

// Beat 17 — Live status card (Discord / Spotify)
await runBeat("live status card", async () => {
  await showLabel(page, "Live status · Discord + Spotify")
  const card = page.locator("text=/PLAYING/i").first()
  if (await card.count()) {
    await recorder.hover(card).catch(() => {})
    await recorder.zoom({ selector: card, scale: 1.4, duration: 700 }).catch(() => {})
    await page.waitForTimeout(1600)
    await recorder.zoom({ scale: 1, duration: 500 }).catch(() => {})
  }
  await hideLabel(page)
})

// Outro title card
await runBeat("outro", async () => {
  await hideCursor(page)
  await showTitleCard(page, "Custom portfolio", "Next.js 15 · React 19 · Motion · Gemini")
})

// -----------------------------------------------------------------------------
// Finalize — testreel does the ffmpeg conversion + chrome composite
// -----------------------------------------------------------------------------

console.log("Stopping recorder and running testreel post-processing…")
const result = await recorder.stop().catch((err) => {
  console.error("recorder.stop failed:", err.message)
  return null
})

await browser.close().catch(() => {})

if (result?.video && existsSync(result.video)) {
  console.log(`Video: ${result.video}`)
  copyFileSync(result.video, DEMO_OUT)
  console.log(`Copied to ${DEMO_OUT}`)
} else {
  console.warn("No video path returned from recorder.stop()")
}

console.log("Done.")
