/**
 * Starter template — copy to your project's scripts/record-demo.mjs and customize runDemo().
 *
 * Usage:
 *   cp .cursor/skills/demo-video-generation/scripts/demo-recorder-lib.mjs scripts/
 *   cp .cursor/skills/demo-video-generation/scripts/record-demo-template.mjs scripts/record-demo.mjs
 *   npm run dev
 *   node scripts/record-demo.mjs
 */
import { createRecorder } from "./demo-recorder-lib.mjs"

const APP_TITLE = process.env.DEMO_TITLE || "My App"
const APP_TAGLINE = process.env.DEMO_TAGLINE || "Short tagline here"
const APP_URL = process.env.DEMO_SITE || "myapp.com"

async function runDemo(rec) {
  const {
    goto,
    wait,
    showLabel,
    hideLabel,
    showTitleCard,
    clickLocator,
    smoothScroll,
  } = rec

  await goto("/")
  await wait(800)
  await showTitleCard(APP_TITLE, APP_TAGLINE)

  // --- customize below for your project ---

  await showLabel("Landing page")
  await smoothScroll(200)
  await wait(800)
  await hideLabel()

  await showLabel("Primary action")
  // await clickLocator('button[data-testid="hero-cta"]', { zoom: 1.4, postDelay: 1000 })
  await wait(1000)
  await hideLabel()

  await showLabel("Feature highlight")
  // await goto("/dashboard")
  // await clickLocator('nav a[href="/settings"]', { zoom: 1.35 })
  await wait(1000)
  await hideLabel()

  // --- end customization ---

  await showTitleCard(`Explore ${APP_TITLE}`, APP_URL)
}

async function main() {
  const rec = await createRecorder({
    outputMp4: process.env.ARTIFACTS_DIR
      ? `${process.env.ARTIFACTS_DIR}/demo.mp4`
      : undefined,
  })

  try {
    await runDemo(rec)
  } catch (error) {
    console.error("Demo recording error:", error)
    throw error
  } finally {
    await rec.finish()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
