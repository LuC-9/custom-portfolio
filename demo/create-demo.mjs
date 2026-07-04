/**
 * Records a polished portfolio walkthrough and exports demo/portfolio-demo.mp4
 * with custom cursor, click ripples, zoom-ins, and burned-in captions.
 */
import { chromium } from "playwright"
import { spawn, execFileSync, execSync } from "node:child_process"
import ffmpegPath from "ffmpeg-static"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const OUT_DIR = path.join(__dirname)
const RAW_DIR = path.join(OUT_DIR, ".raw")
const FINAL_MP4 = path.join(OUT_DIR, "portfolio-demo.mp4")
const DEMO_PORT = Number(process.env.DEMO_PORT ?? 3002)
const BASE_URL = process.env.DEMO_URL ?? `http://localhost:${DEMO_PORT}`
const VIEWPORT = { width: 1920, height: 1080 }
const FPS = 30

const OVERLAY_CSS = `
  html, body, body * { cursor: none !important; }
  #demo-cursor-ring {
    position: fixed; z-index: 999999; pointer-events: none;
    width: 36px; height: 36px; margin: -18px 0 0 -18px;
    border: 2.5px solid rgba(99, 102, 241, 0.95);
    border-radius: 50%; box-shadow: 0 0 0 1px rgba(255,255,255,0.35), 0 4px 24px rgba(99,102,241,0.45);
    transition: transform 0.08s ease-out;
  }
  #demo-cursor-dot {
    position: fixed; z-index: 1000000; pointer-events: none;
    width: 8px; height: 8px; margin: -4px 0 0 -4px;
    background: #fff; border-radius: 50%;
    box-shadow: 0 0 8px rgba(99,102,241,0.9);
  }
  .demo-click-ripple {
    position: fixed; z-index: 999998; pointer-events: none;
    width: 12px; height: 12px; margin: -6px 0 0 -6px;
    border: 3px solid rgba(99, 102, 241, 0.85);
    border-radius: 50%;
    animation: demo-ripple 0.55s ease-out forwards;
  }
  @keyframes demo-ripple {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(4.5); opacity: 0; }
  }
`

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function waitForPortfolio(url, timeoutMs = 180_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url)
      const html = await res.text()
      if (res.ok && html.includes("Developer") && html.includes('href="/projects"')) return
    } catch {
      /* retry */
    }
    await sleep(1500)
  }
  throw new Error(`Portfolio not ready at ${url}`)
}

function recordingEnv() {
  return {
    ...process.env,
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "demo-recording-placeholder",
  }
}

function ensureBuild() {
  console.log("Building production bundle for demo recording...")
  execSync("npm run build", { cwd: ROOT, env: recordingEnv(), stdio: "inherit" })
}

function startProdServer(port = DEMO_PORT) {
  const child = spawn("npx", ["next", "start", "-p", String(port)], {
    cwd: ROOT,
    env: recordingEnv(),
    shell: true,
    stdio: ["ignore", "pipe", "pipe"],
  })
  child.stdout?.on("data", (chunk) => {
    const text = chunk.toString()
    if (text.includes("Ready") || text.includes("started")) process.stdout.write(text)
  })
  child.stderr?.on("data", (chunk) => process.stderr.write(chunk.toString()))
  return child
}

async function moveTo(page, selector) {
  const el = page.locator(selector).first()
  await el.waitFor({ state: "visible", timeout: 15_000 })
  const box = await el.boundingBox()
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 18 })
  }
  return el
}

async function dismissDevOverlays(page) {
  await page.evaluate(() => {
    document.querySelectorAll("nextjs-portal").forEach((el) => el.remove())
  })
}

async function demoClick(page, selector, options = {}) {
  await dismissDevOverlays(page)
  const el = await moveTo(page, selector)
  await el.click({ timeout: 15_000, ...options })
}

async function demoGoto(page, href) {
  const link = page.locator(`header a[href="${href}"]`).first()
  const visible = await link.isVisible().catch(() => false)
  if (visible) {
    await moveTo(page, `header a[href="${href}"]`)
    await link.click()
    await page.waitForURL(`**${href}`, { timeout: 15_000 })
  } else {
    await page.goto(`${BASE_URL}${href}`, { waitUntil: "networkidle" })
  }
  await sleep(900)
}

function markScene(scenes, startMs, caption, zoom = { x: 0.5, y: 0.45, scale: 1.12 }) {
  scenes.push({
    start: startMs / 1000,
    caption,
    zoomX: zoom.x,
    zoomY: zoom.y,
    zoomScale: zoom.scale,
  })
}


function buildSegmentFilter(s, frames, captionPath) {
  const cx = Math.round(VIEWPORT.width * s.zoomX)
  const cy = Math.round(VIEWPORT.height * s.zoomY)
  const captionEsc = captionPath.replace(/\\/g, "/").replace(/:/g, "\\:")
  const zoom = `zoompan=z='${s.zoomScale.toFixed(2)}':x='${cx}-iw/zoom/2':y='${cy}-ih/zoom/2':d=${frames}:s=${VIEWPORT.width}x${VIEWPORT.height}:fps=${FPS}`

  const fonts = [
    "C\\\\:/Windows/Fonts/segoeui.ttf",
    "C\\\\:/Windows/Fonts/arial.ttf",
  ]
  for (const font of fonts) {
    if (font.includes("segoeui") && !fs.existsSync("C:/Windows/Fonts/segoeui.ttf")) continue
    if (font.includes("arial") && !fs.existsSync("C:/Windows/Fonts/arial.ttf")) continue
    return `${zoom},drawtext=fontfile=${font}:textfile='${captionEsc}':fontsize=30:fontcolor=white:borderw=3:bordercolor=black@0.65:x=(w-text_w)/2:y=h-72:shadowcolor=black@0.5:shadowx=2:shadowy=2,format=yuv420p`
  }

  const srtEsc = captionPath.replace(/\\/g, "/").replace(/:/g, "\\:")
  return `${zoom},subtitles='${srtEsc}':force_style='FontSize=28,PrimaryColour=&H00FFFFFF,Outline=1,OutlineColour=&H00000000,Alignment=2,MarginV=48',format=yuv420p`
}

function postProcess(rawVideo, scenes, durationSec) {
  const segDir = path.join(RAW_DIR, "segments")
  fs.mkdirSync(segDir, { recursive: true })

  const segFiles = []
  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i]
    const nextStart = i < scenes.length - 1 ? scenes[i + 1].start : durationSec
    const dur = Math.max(1.8, nextStart - s.start)
    const frames = Math.ceil(dur * FPS)
    const captionPath = path.join(segDir, `caption_${i}.txt`)
    fs.writeFileSync(captionPath, s.caption, "utf8")
    const vf = buildSegmentFilter(s, frames, captionPath)

    const segOut = path.join(segDir, `seg_${String(i).padStart(2, "0")}.mp4`)
    execFileSync(
      ffmpegPath,
      [
        "-y",
        "-ss", String(s.start),
        "-t", String(dur),
        "-i", rawVideo,
        "-vf", vf,
        "-an",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "20",
        "-pix_fmt", "yuv420p",
        segOut,
      ],
      { stdio: "inherit" },
    )
    segFiles.push(segOut)
  }

  const listPath = path.join(segDir, "concat.txt")
  fs.writeFileSync(
    listPath,
    segFiles.map((f) => `file '${f.replace(/\\/g, "/")}'`).join("\n"),
    "utf8",
  )

  execFileSync(
    ffmpegPath,
    [
      "-y",
      "-f", "concat",
      "-safe", "0",
      "-i", listPath,
      "-c:v", "libx264",
      "-preset", "medium",
      "-crf", "20",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      FINAL_MP4,
    ],
    { stdio: "inherit" },
  )
}

async function recordWalkthrough() {
  fs.mkdirSync(RAW_DIR, { recursive: true })

  ensureBuild()
  const devProc = startProdServer()
  const startedServer = true
  await waitForPortfolio(BASE_URL)
  await sleep(3000)

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    recordVideo: { dir: RAW_DIR, size: VIEWPORT },
    viewport: VIEWPORT,
    colorScheme: "dark",
    reducedMotion: "no-preference",
  })

  await context.addInitScript({
    content: `window.__demoOverlayCss = ${JSON.stringify(OVERLAY_CSS)};`,
  })
  await context.addInitScript(() => {
    const boot = () => {
      if (window.__demoOverlayReady) return
      window.__demoOverlayReady = true
      const style = document.createElement("style")
      style.textContent = window.__demoOverlayCss
      document.head.appendChild(style)
      const ring = document.createElement("div")
      ring.id = "demo-cursor-ring"
      const dot = document.createElement("div")
      dot.id = "demo-cursor-dot"
      document.body.appendChild(ring)
      document.body.appendChild(dot)
      window.addEventListener("mousemove", (e) => {
        ring.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
        dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }, { passive: true })
      window.addEventListener("mousedown", (e) => {
        const ripple = document.createElement("div")
        ripple.className = "demo-click-ripple"
        ripple.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
        document.body.appendChild(ripple)
        setTimeout(() => ripple.remove(), 600)
      }, { passive: true })
    }
    if (document.body) boot()
    else window.addEventListener("DOMContentLoaded", boot)
  })

  await context.addInitScript(() => {
    localStorage.removeItem("pf.game.v2")
    localStorage.removeItem("pf.game.v1")
    localStorage.setItem("pf.game.focus", "1")
    localStorage.setItem("theme", "dark")
  })

  const page = await context.newPage()
  const scenes = []
  const t0 = Date.now()
  const elapsed = () => Date.now() - t0

  await page.goto(BASE_URL, { waitUntil: "networkidle" })
  await sleep(4000)

  const gameToggle = page.locator('button[aria-label="Switch to focus mode"], button[aria-label="Switch to game mode"]').first()
  await gameToggle.waitFor({ state: "visible", timeout: 30_000 })

  markScene(scenes, elapsed(), "Explore Aarsh Mishra's dual-persona portfolio", { x: 0.5, y: 0.38, scale: 1.08 })
  await sleep(1800)

  const gameToggleLabel = await gameToggle.getAttribute("aria-label")
  if (gameToggleLabel?.includes("game mode")) {
    await demoClick(page, 'button[aria-label="Switch to game mode"]')
    markScene(scenes, elapsed(), "Turn on Game Mode — earn XP as you explore", { x: 0.82, y: 0.78, scale: 1.35 })
    await sleep(2800)
  } else {
    markScene(scenes, elapsed(), "Game Mode tracks exploration with XP and achievements", { x: 0.82, y: 0.78, scale: 1.35 })
    await sleep(2200)
  }

  await demoClick(page, 'button[aria-label="Switch to gamer mode"]')
  await page.locator('header a[href="/community"], main').first().waitFor({ state: "visible", timeout: 10_000 })
  markScene(scenes, elapsed(), "Switch to the Gamer persona", { x: 0.72, y: 0.35, scale: 1.28 })
  await sleep(2200)

  await demoGoto(page, "/community")
  markScene(scenes, elapsed(), "Community streams, Discord, and content", { x: 0.5, y: 0.48, scale: 1.15 })
  await sleep(2200)

  await demoGoto(page, "/blog")
  markScene(scenes, elapsed(), "Read articles on engineering and gaming", { x: 0.42, y: 0.55, scale: 1.16 })
  await sleep(2200)

  await demoGoto(page, "/")
  await sleep(1200)
  await demoClick(page, 'button[aria-label="Switch to developer mode"]')
  await sleep(1200)

  await demoGoto(page, "/projects")
  markScene(scenes, elapsed(), "Browse featured engineering projects", { x: 0.5, y: 0.55, scale: 1.18 })
  await sleep(1800)

  const projectCard = page.locator("main .grid .cursor-pointer").first()
  if (await projectCard.count()) {
    await moveTo(page, "main .grid .cursor-pointer")
    await projectCard.click()
    markScene(scenes, elapsed(), "Open a project for tech stack and highlights", { x: 0.5, y: 0.5, scale: 1.22 })
    await sleep(2600)
    await page.keyboard.press("Escape")
    await sleep(800)
  }

  const chatBtn = page.locator("button.fixed.left-6.rounded-full").first()
  if (await chatBtn.isVisible().catch(() => false)) {
    await dismissDevOverlays(page)
    await moveTo(page, "button.fixed.left-6.rounded-full")
    await chatBtn.click({ force: true })
    markScene(scenes, elapsed(), "Ask the AI assistant about experience and projects", { x: 0.22, y: 0.72, scale: 1.3 })
    await sleep(2800)
    await page.keyboard.press("Escape")
    await sleep(600)
  }

  const endFocusToggle = page.locator('button[aria-label="Switch to focus mode"], button[aria-label="Switch to game mode"]').first()
  await endFocusToggle.waitFor({ state: "visible", timeout: 15_000 })
  const endFocusLabel = await endFocusToggle.getAttribute("aria-label")
  if (endFocusLabel?.includes("focus mode")) {
    await demoClick(page, 'button[aria-label="Switch to focus mode"]')
  }
  markScene(scenes, elapsed(), "Toggle Focus mode for a clean reading view", { x: 0.88, y: 0.18, scale: 1.25 })
  await sleep(2200)

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }))
  markScene(scenes, elapsed(), "Built with Next.js — deploy your own at github.com/LuC-9", { x: 0.5, y: 0.35, scale: 1.06 })
  await sleep(2400)

  const durationSec = elapsed() / 1000
  const video = page.video()
  await context.close()
  await browser.close()

  if (devProc && startedServer) {
    devProc.kill("SIGTERM")
  }

  const rawPath = await video.path()
  console.log(`Raw recording: ${rawPath}`)
  console.log(`Scenes: ${scenes.length}, duration ~${durationSec.toFixed(1)}s`)
  postProcess(rawPath, scenes, durationSec)
  console.log(`Demo saved: ${FINAL_MP4}`)
}

recordWalkthrough().catch((err) => {
  console.error(err)
  process.exit(1)
})
