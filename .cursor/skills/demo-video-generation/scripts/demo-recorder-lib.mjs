/**
 * Reusable Playwright demo recorder utilities.
 * Copy into any project's scripts/ folder or import from the demo-video-generation skill.
 */
import { chromium } from "playwright"
import { execSync } from "node:child_process"
import { mkdirSync, readdirSync, statSync, copyFileSync } from "node:fs"
import { join } from "node:path"

const DEFAULT_VIEWPORT = { width: 1920, height: 1080 }

export function createRecorderConfig(overrides = {}) {
  const artifactsDir =
    overrides.artifactsDir ||
    process.env.ARTIFACTS_DIR ||
    (process.env.CURSOR_CLOUD ? "/opt/cursor/artifacts" : join(process.cwd(), "artifacts"))

  return {
    baseUrl: overrides.baseUrl || process.env.DEMO_URL || "http://localhost:3000",
    artifactsDir,
    videoDir: join(artifactsDir, "demo-raw"),
    outputMp4: overrides.outputMp4 || join(artifactsDir, "demo.mp4"),
    viewport: overrides.viewport || DEFAULT_VIEWPORT,
    colorScheme: overrides.colorScheme || "dark",
  }
}

const CURSOR_INIT = () => {
  if (document.getElementById("demo-cursor")) return

  const style = document.createElement("style")
  style.textContent = `
    #demo-cursor {
      position: fixed; width: 28px; height: 28px;
      border: 3px solid #ff3b5c; border-radius: 50%;
      background: rgba(255, 59, 92, 0.25); pointer-events: none;
      z-index: 2147483646; transform: translate(-50%, -50%);
      box-shadow: 0 0 0 2px rgba(255,255,255,0.95), 0 0 18px rgba(255, 59, 92, 0.65);
      transition: left 0.04s linear, top 0.04s linear;
    }
    #demo-cursor::after {
      content: ""; position: absolute; top: 50%; left: 50%;
      width: 7px; height: 7px; background: #ff3b5c; border-radius: 50%;
      transform: translate(-50%, -50%);
    }
    #demo-ripple {
      position: fixed; width: 52px; height: 52px;
      border: 3px solid rgba(255, 59, 92, 0.85); border-radius: 50%;
      pointer-events: none; z-index: 2147483645;
      transform: translate(-50%, -50%) scale(0.35); opacity: 0;
    }
    @keyframes demo-click {
      0% { transform: translate(-50%, -50%) scale(0.35); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
    }
    #demo-label {
      position: fixed; top: 28px; left: 50%; transform: translateX(-50%);
      z-index: 2147483647; background: rgba(8, 10, 18, 0.82); color: #f8fafc;
      padding: 14px 28px; border-radius: 999px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 20px; letter-spacing: 0.02em; backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.14); box-shadow: 0 12px 40px rgba(0,0,0,0.35);
      opacity: 0; transition: opacity 0.35s ease; pointer-events: none;
    }
    #demo-title-card {
      position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;
      z-index: 2147483644;
      background: radial-gradient(circle at center, rgba(15,23,42,0.35), rgba(2,6,23,0.72));
      pointer-events: none;
    }
    #demo-title-card h1 {
      margin: 0; color: white;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 56px; text-align: center; text-shadow: 0 8px 30px rgba(0,0,0,0.45);
    }
    #demo-title-card p {
      margin: 16px 0 0; color: rgba(226,232,240,0.88); font-size: 22px; text-align: center;
    }
  `
  document.head.appendChild(style)

  for (const [id, left, top] of [
    ["demo-cursor", "960px", "540px"],
    ["demo-ripple", "0", "0"],
    ["demo-label", "0", "0"],
  ]) {
    if (!document.getElementById(id)) {
      const el = document.createElement("div")
      el.id = id
      if (left !== "0") {
        el.style.left = left
        el.style.top = top
      }
      document.body.appendChild(el)
    }
  }
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
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

/**
 * Launch browser and return recording helpers.
 * Call `finish()` after the tour to export MP4.
 */
export async function createRecorder(overrides = {}) {
  const config = createRecorderConfig(overrides)
  mkdirSync(config.videoDir, { recursive: true })
  mkdirSync(config.artifactsDir, { recursive: true })

  let cursorPos = { x: 960, y: 540 }
  let browser
  let context
  let page

  const wait = (ms) => page.waitForTimeout(ms)

  const preparePage = async () => {
    await page.evaluate(() => {
      window.scrollTo(0, 0)
      document.documentElement.style.transform = "scale(1)"
      document.documentElement.style.transformOrigin = "center center"
    })
    await page.evaluate(CURSOR_INIT)
    await wait(250)
  }

  const goto = async (path = "/") => {
    await page.goto(`${config.baseUrl}${path}`, { waitUntil: "load", timeout: 30000 })
    await preparePage()
  }

  const moveCursor = async (x, y, steps = 24) => {
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
      await wait(12)
    }
    cursorPos = { x, y }
  }

  const clickAt = async (x, y) => {
    await moveCursor(x, y, 16)
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
    await wait(80)
    await page.mouse.up()
    await wait(220)
  }

  const setZoom = async (x, y, scale = 1.35) => {
    await page.evaluate(({ x, y, scale }) => {
      const html = document.documentElement
      html.style.transition = "transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)"
      html.style.transformOrigin = `${x}px ${y}px`
      html.style.transform = `scale(${scale})`
    }, { x, y, scale })
    await wait(650)
  }

  const resetZoom = async () => {
    await page.evaluate(() => {
      document.documentElement.style.transform = "scale(1)"
    })
    await wait(450)
  }

  const showLabel = async (text, holdMs = 1600) => {
    await page.evaluate((text) => {
      const label = document.getElementById("demo-label")
      if (label) {
        label.textContent = text
        label.style.opacity = "1"
      }
    }, text)
    await wait(holdMs)
  }

  const hideLabel = async () => {
    await page.evaluate(() => {
      const label = document.getElementById("demo-label")
      if (label) label.style.opacity = "0"
    })
    await wait(300)
  }

  const showTitleCard = async (title, subtitle) => {
    await page.evaluate(({ title, subtitle }) => {
      document.getElementById("demo-title-card")?.remove()
      const card = document.createElement("div")
      card.id = "demo-title-card"
      card.innerHTML = `<div><h1>${title}</h1><p>${subtitle}</p></div>`
      document.body.appendChild(card)
    }, { title, subtitle })
    await wait(2200)
    await page.evaluate(() => document.getElementById("demo-title-card")?.remove())
    await wait(350)
  }

  const clickLocator = async (locator, options = {}) => {
    const target = typeof locator === "string" ? page.locator(locator).first() : locator
    await target.waitFor({ state: "visible", timeout: 15000 })
    await target.scrollIntoViewIfNeeded()
    await wait(options.preDelay ?? 250)
    const box = await target.boundingBox()
    if (!box) throw new Error(`Unable to locate element: ${locator}`)
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    if (options.zoom) await setZoom(x, y, options.zoom)
    await clickAt(x, y)
    if (options.zoom) await resetZoom()
    if (options.postDelay) await wait(options.postDelay)
  }

  const smoothScroll = async (deltaY, steps = 16) => {
    for (let i = 0; i < steps; i++) {
      await page.mouse.wheel(0, deltaY / steps)
      await wait(30)
    }
  }

  const finish = async () => {
    await wait(300)
    await withTimeout(page.close(), 5000, "page.close").catch(() => {})
    await withTimeout(context.close(), 10000, "context.close").catch(() => {})
    await withTimeout(browser.close(), 5000, "browser.close").catch(() => {})

    const latest = newestWebm(config.videoDir)
    if (!latest) throw new Error("No recorded webm found")

    const capturePath = join(config.videoDir, "capture.webm")
    copyFileSync(join(config.videoDir, latest), capturePath)

    execSync(
      `ffmpeg -y -i "${capturePath}" -vf "scale=1920:1080:flags=lanczos,format=yuv420p" -c:v libx264 -preset medium -crf 20 -movflags +faststart -an "${config.outputMp4}"`,
      { stdio: "inherit", timeout: 120000 },
    )

    console.log(`Demo video ready: ${config.outputMp4}`)
    return config.outputMp4
  }

  console.log(`Recording demo from ${config.baseUrl}`)
  browser = await chromium.launch({ headless: true })
  context = await browser.newContext({
    viewport: config.viewport,
    recordVideo: { dir: config.videoDir, size: config.viewport },
    deviceScaleFactor: 1,
    colorScheme: config.colorScheme,
  })
  page = await context.newPage()

  return {
    page,
    config,
    goto,
    wait,
    moveCursor,
    clickAt,
    setZoom,
    resetZoom,
    showLabel,
    hideLabel,
    showTitleCard,
    clickLocator,
    smoothScroll,
    finish,
  }
}
