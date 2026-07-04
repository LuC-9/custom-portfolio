import { chromium } from "playwright"
import { execSync } from "node:child_process"
import { mkdirSync, readdirSync, statSync, copyFileSync } from "node:fs"
import { join } from "node:path"

const BASE_URL = process.env.DEMO_URL || "http://localhost:3000"
const ARTIFACTS_DIR = process.env.ARTIFACTS_DIR || "/opt/cursor/artifacts"
const VIDEO_DIR = join(ARTIFACTS_DIR, "demo-raw")
const OUTPUT_MP4 = join(ARTIFACTS_DIR, "portfolio-demo.mp4")
const VIEWPORT = { width: 1920, height: 1080 }

mkdirSync(VIDEO_DIR, { recursive: true })
mkdirSync(ARTIFACTS_DIR, { recursive: true })

const CURSOR_INIT = () => {
  if (document.getElementById("demo-cursor")) return

  const style = document.createElement("style")
  style.textContent = `
    #demo-cursor {
      position: fixed;
      width: 28px;
      height: 28px;
      border: 3px solid #ff3b5c;
      border-radius: 50%;
      background: rgba(255, 59, 92, 0.25);
      pointer-events: none;
      z-index: 2147483646;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 0 2px rgba(255,255,255,0.95), 0 0 18px rgba(255, 59, 92, 0.65);
      transition: left 0.04s linear, top 0.04s linear;
    }
    #demo-cursor::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 7px;
      height: 7px;
      background: #ff3b5c;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
    #demo-ripple {
      position: fixed;
      width: 52px;
      height: 52px;
      border: 3px solid rgba(255, 59, 92, 0.85);
      border-radius: 50%;
      pointer-events: none;
      z-index: 2147483645;
      transform: translate(-50%, -50%) scale(0.35);
      opacity: 0;
    }
    @keyframes demo-click {
      0% { transform: translate(-50%, -50%) scale(0.35); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
    }
    #demo-label {
      position: fixed;
      top: 28px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2147483647;
      background: rgba(8, 10, 18, 0.82);
      color: #f8fafc;
      padding: 14px 28px;
      border-radius: 999px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 20px;
      letter-spacing: 0.02em;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.14);
      box-shadow: 0 12px 40px rgba(0,0,0,0.35);
      opacity: 0;
      transition: opacity 0.35s ease;
      pointer-events: none;
    }
    #demo-title-card {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2147483644;
      background: radial-gradient(circle at center, rgba(15,23,42,0.35), rgba(2,6,23,0.72));
      pointer-events: none;
    }
    #demo-title-card h1 {
      margin: 0;
      color: white;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 56px;
      text-align: center;
      text-shadow: 0 8px 30px rgba(0,0,0,0.45);
    }
    #demo-title-card p {
      margin: 16px 0 0;
      color: rgba(226,232,240,0.88);
      font-size: 22px;
      text-align: center;
    }
  `
  document.head.appendChild(style)

  const cursor = document.createElement("div")
  cursor.id = "demo-cursor"
  cursor.style.left = "960px"
  cursor.style.top = "540px"
  document.body.appendChild(cursor)

  const ripple = document.createElement("div")
  ripple.id = "demo-ripple"
  document.body.appendChild(ripple)

  const label = document.createElement("div")
  label.id = "demo-label"
  document.body.appendChild(label)
}

let cursorPos = { x: 960, y: 540 }

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

async function wait(page, ms) {
  await page.waitForTimeout(ms)
}

async function preparePage(page) {
  await page.evaluate(() => {
    window.scrollTo(0, 0)
    document.documentElement.style.transform = "scale(1)"
    document.documentElement.style.transformOrigin = "center center"
  })
  await page.evaluate(CURSOR_INIT)
  await wait(page, 250)
}

async function goto(page, path = "/") {
  await page.goto(`${BASE_URL}${path}`, { waitUntil: "load", timeout: 30000 })
  await preparePage(page)
}

async function moveCursor(page, x, y, steps = 24) {
  const from = { ...cursorPos }
  for (let i = 0; i <= steps; i++) {
    const t = easeInOut(i / steps)
    const cx = from.x + (x - from.x) * t
    const cy = from.y + (y - from.y) * t
    await page.mouse.move(cx, cy)
    await page.evaluate(({ cx, cy }) => {
      const el = document.getElementById("demo-cursor")
      if (el) {
        el.style.left = `${cx}px`
        el.style.top = `${cy}px`
      }
    }, { cx, cy })
    await wait(page, 12)
  }
  cursorPos = { x, y }
}

async function clickAt(page, x, y) {
  await moveCursor(page, x, y, 16)
  await page.evaluate(({ x, y }) => {
    const ripple = document.getElementById("demo-ripple")
    if (ripple) {
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`
      ripple.style.animation = "none"
      void ripple.offsetWidth
      ripple.style.animation = "demo-click 0.55s ease-out"
    }
  }, { x, y })
  await page.mouse.down()
  await wait(page, 80)
  await page.mouse.up()
  await wait(page, 220)
}

async function setZoom(page, x, y, scale = 1.35) {
  await page.evaluate(({ x, y, scale }) => {
    const html = document.documentElement
    html.style.transition = "transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)"
    html.style.transformOrigin = `${x}px ${y}px`
    html.style.transform = `scale(${scale})`
  }, { x, y, scale })
  await wait(page, 650)
}

async function resetZoom(page) {
  await page.evaluate(() => {
    document.documentElement.style.transform = "scale(1)"
  })
  await wait(page, 450)
}

async function showLabel(page, text, holdMs = 1600) {
  await page.evaluate((text) => {
    const label = document.getElementById("demo-label")
    if (label) {
      label.textContent = text
      label.style.opacity = "1"
    }
  }, text)
  await wait(page, holdMs)
}

async function hideLabel(page) {
  await page.evaluate(() => {
    const label = document.getElementById("demo-label")
    if (label) label.style.opacity = "0"
  })
  await wait(page, 300)
}

async function showTitleCard(page, title, subtitle) {
  await page.evaluate(({ title, subtitle }) => {
    document.getElementById("demo-title-card")?.remove()
    const card = document.createElement("div")
    card.id = "demo-title-card"
    card.innerHTML = `<div><h1>${title}</h1><p>${subtitle}</p></div>`
    document.body.appendChild(card)
  }, { title, subtitle })
  await wait(page, 2200)
  await page.evaluate(() => document.getElementById("demo-title-card")?.remove())
  await wait(page, 350)
}

async function clickLocator(page, locator, options = {}) {
  const target = typeof locator === "string" ? page.locator(locator).first() : locator
  await target.waitFor({ state: "visible", timeout: 15000 })
  await target.scrollIntoViewIfNeeded()
  await wait(page, options.preDelay ?? 250)
  const box = await target.boundingBox()
  if (!box) throw new Error(`Unable to locate element: ${locator}`)
  const x = box.x + box.width / 2
  const y = box.y + box.height / 2
  if (options.zoom) await setZoom(page, x, y, options.zoom)
  await clickAt(page, x, y)
  if (options.zoom) await resetZoom(page)
  if (options.postDelay) await wait(page, options.postDelay)
}

async function smoothScroll(page, deltaY, steps = 16) {
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, deltaY / steps)
    await wait(page, 30)
  }
}

async function runDemo(page) {
  const step = (label) => console.log(`  → ${label}`)
  step("home intro")
  await goto(page, "/")
  await wait(page, 900)

  await showTitleCard(page, "LuC Portfolio", "Developer & Gamer dual-persona site")

  await showLabel(page, "Developer persona home")
  await smoothScroll(page, 100, 6)
  await wait(page, 700)
  await hideLabel(page)

  step("persona toggle")
  await showLabel(page, "Dual persona toggle")
  await clickLocator(page, 'button[aria-label*="Switch to gamer"]', { zoom: 1.45, postDelay: 1000 })
  await hideLabel(page)
  await wait(page, 1000)

  await showLabel(page, "Gamer profile & social links")
  await smoothScroll(page, 160, 8)
  await wait(page, 900)
  await hideLabel(page)

  step("game hud")
  await showLabel(page, "Gamification HUD — XP & quests")
  const hud = page.locator('section:has-text("Explored")').first()
  if (await hud.count()) {
    const box = await hud.boundingBox()
    if (box) {
      const x = box.x + box.width / 2
      const y = box.y + box.height / 2
      await setZoom(page, x, y, 1.5)
      await moveCursor(page, x - 30, y - 10)
      await wait(page, 1500)
      await resetZoom(page)
    }
  }
  await hideLabel(page)

  step("focus mode")
  await showLabel(page, "Focus mode vs game mode")
  await clickLocator(page, 'button[aria-label*="Switch to focus mode"]', { zoom: 1.4, postDelay: 1100 })
  await wait(page, 900)
  await clickLocator(page, 'button[aria-label*="Switch to game mode"]', { zoom: 1.4, postDelay: 800 })
  await hideLabel(page)

  step("projects")
  await showLabel(page, "Projects showcase")
  await goto(page, "/projects")
  await smoothScroll(page, 380, 12)
  await wait(page, 600)
  await clickLocator(page, ".grid .cursor-pointer", { zoom: 1.35, postDelay: 1400 })
  await page.keyboard.press("Escape")
  await wait(page, 600)
  await hideLabel(page)

  step("blog")
  await showLabel(page, "Blog search & persona filters")
  await goto(page, "/blog")
  await clickLocator(page, 'input[placeholder="Search blogs..."]', { zoom: 1.35 })
  await page.keyboard.type("next", { delay: 80 })
  await wait(page, 900)
  await clickLocator(page, 'button:has-text("Gamer")', { zoom: 1.35, postDelay: 800 })
  await clickLocator(page, 'button:has-text("Dev")', { zoom: 1.35, postDelay: 800 })
  await clickLocator(page, 'button:has-text("All")', { zoom: 1.35, postDelay: 600 })
  await hideLabel(page)

  step("blog post")
  await showLabel(page, "Blog post reading experience")
  await smoothScroll(page, 650, 14)
  await wait(page, 400)
  await clickLocator(page, 'a[href="/blog/getting-started-with-nextjs"]', { zoom: 1.3, postDelay: 1200 })
  await smoothScroll(page, 850, 16)
  await wait(page, 1000)
  await hideLabel(page)

  step("contact")
  await showLabel(page, "Contact form")
  await goto(page, "/contact")
  await clickLocator(page, 'input[name="name"]', { zoom: 1.35 })
  await page.keyboard.type("Demo Visitor", { delay: 65 })
  await clickLocator(page, 'input[name="email"]', { zoom: 1.35 })
  await page.keyboard.type("demo@example.com", { delay: 55 })
  await clickLocator(page, 'textarea[name="message"]', { zoom: 1.3 })
  await page.keyboard.type("Interested in collaborating on a Next.js project.", { delay: 40 })
  await wait(page, 900)
  await hideLabel(page)

  step("community")
  await showLabel(page, "Community & streams")
  await goto(page, "/community")
  await clickLocator(page, '[role="tab"]:has-text("Streams")', { zoom: 1.35, postDelay: 1000 })
  await clickLocator(page, '[role="tab"]:has-text("Community")', { zoom: 1.35, postDelay: 800 })
  await hideLabel(page)

  step("experience")
  await showLabel(page, "Experience timeline & featured content")
  await goto(page, "/")
  const devToggle = page.locator('button[aria-label*="Switch to developer"]').first()
  if (await devToggle.isVisible().catch(() => false)) {
    await clickLocator(page, devToggle, { zoom: 1.4, postDelay: 800 })
  }
  await smoothScroll(page, 950, 18)
  await wait(page, 1200)
  await smoothScroll(page, 850, 16)
  await wait(page, 1200)
  await hideLabel(page)

  step("outro")
  await showTitleCard(page, "Explore the portfolio", "byluc.in")
  await wait(page, 400)
  console.log("  → recording complete")
}

async function withTimeout(promise, ms, label) {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
  })
  try {
    return await Promise.race([promise, timeout])
  } finally {
    clearTimeout(timer)
  }
}

function newestWebm(dir) {
  return readdirSync(dir)
    .filter((name) => name.endsWith(".webm"))
    .map((name) => ({ name, mtime: statSync(join(dir, name)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)[0]?.name
}

async function main() {
  console.log(`Recording demo from ${BASE_URL}`)
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: {
      dir: VIDEO_DIR,
      size: VIEWPORT,
    },
    deviceScaleFactor: 1,
    colorScheme: "dark",
  })

  const page = await context.newPage()
  try {
    await runDemo(page)
  } catch (error) {
    console.error("Demo recording error:", error)
    throw error
  }

  console.log("  → closing browser")
  await withTimeout(page.close(), 5000, "page.close").catch(() => {})
  await withTimeout(context.close(), 10000, "context.close").catch(() => {})
  await withTimeout(browser.close(), 5000, "browser.close").catch(() => {})

  const latest = newestWebm(VIDEO_DIR)
  if (!latest) throw new Error("No recorded webm found")

  const capturePath = join(VIDEO_DIR, "capture.webm")
  copyFileSync(join(VIDEO_DIR, latest), capturePath)
  console.log(`Saved raw recording to ${capturePath}`)

  console.log("Converting to MP4...")
  execSync(
    `ffmpeg -y -i "${capturePath}" -vf "scale=1920:1080:flags=lanczos,format=yuv420p" -c:v libx264 -preset medium -crf 20 -movflags +faststart -an "${OUTPUT_MP4}"`,
    { stdio: "inherit", timeout: 120000 },
  )

  console.log(`Demo video ready: ${OUTPUT_MP4}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
