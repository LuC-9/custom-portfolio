---
name: demo-video-generation
description: Record polished demo videos of web apps with Playwright — animated cursor, click ripples, zoom-ins, section labels, and MP4 export. Use when the user asks for a demo video, product walkthrough, feature tour, screen recording, or marketing capture of any web project.
---

# Demo Video Generation

Record professional feature walkthrough videos for any web application using Playwright + ffmpeg.

## When to Use

- User asks for a demo video, walkthrough, feature tour, or product capture
- User wants zoom-ins, mouse pointer clicks, or labeled sections in a recording
- Any web project (Next.js, Vite, CRA, static sites, dashboards, portfolios)

## Deliverable

- **Primary output:** MP4 at `{ARTIFACTS_DIR}/demo.mp4` (default `/opt/cursor/artifacts/demo.mp4` in cloud, `./artifacts/demo.mp4` locally)
- **Format:** 1920×1080, H.264, no audio, 60–120 seconds ideal
- **Also save:** raw `.webm` in `{ARTIFACTS_DIR}/demo-raw/` for debugging

## Workflow

Copy this checklist and track progress:

```
Demo Video Progress:
- [ ] Step 1: Detect project type and start command
- [ ] Step 2: Install Playwright + ffmpeg if missing
- [ ] Step 3: Inventory all demo-worthy features
- [ ] Step 4: Write or adapt recording script
- [ ] Step 5: Run recording and convert to MP4
- [ ] Step 6: Verify duration, cursor visibility, and feature coverage
```

### Step 1 — Detect project and start server

Read `package.json`, `README.md`, and framework config. Common start commands:

| Stack | Dev command | Default URL |
| --- | --- | --- |
| Next.js | `npm run dev` | http://localhost:3000 |
| Vite | `npm run dev` | http://localhost:5173 |
| CRA | `npm start` | http://localhost:3000 |
| Astro | `npm run dev` | http://localhost:4321 |
| Remix | `npm run dev` | http://localhost:5173 |

Start the server in tmux (long-running). Wait until the URL returns HTTP 200 before recording.

**Important:** Use `waitUntil: "load"` in Playwright — never `networkidle` (polling/analytics prevents it from resolving).

### Step 2 — Install tooling

```bash
npm install --legacy-peer-deps playwright   # or pnpm/yarn equivalent
npx playwright install chromium
# ffmpeg must be on PATH (apt install ffmpeg / brew install ffmpeg)
```

Add to `devDependencies` and a `"record:demo"` script only if the user wants it committed to the repo.

### Step 3 — Inventory features

Explore the app (routes, components, README features list). Cover **every major user-facing feature**, grouped into labeled sections (~5–12 sections, ~90 s total).

Use [references/feature-inventory.md](references/feature-inventory.md) as a checklist. Prioritize:

1. Hero / landing
2. Core differentiators (toggles, modes, themes)
3. Primary workflows (CRUD, search, filters)
4. Secondary pages (settings, profile, admin)
5. Outro title card

### Step 4 — Write the recording script

Use the reusable library in [scripts/demo-recorder-lib.mjs](scripts/demo-recorder-lib.mjs).

**Project-specific script** goes in `scripts/record-demo.mjs` (or `{project}/scripts/record-demo.mjs`):

```javascript
import { createRecorder } from "./demo-recorder-lib.mjs" // or copy lib into project

const { page, run, finish, showLabel, clickLocator, goto, smoothScroll, showTitleCard } =
  await createRecorder({
    baseUrl: process.env.DEMO_URL || "http://localhost:3000",
    outputMp4: process.env.ARTIFACTS_DIR
      ? `${process.env.ARTIFACTS_DIR}/demo.mp4`
      : "./artifacts/demo.mp4",
    title: "My App",
    subtitle: "One-line tagline",
  })

// --- project-specific tour ---
await goto("/")
await showTitleCard("My App", "Tagline here")
await showLabel("Feature name")
await clickLocator('button[data-testid="hero-cta"]', { zoom: 1.4 })
// ... more steps ...
await showTitleCard("Get started today", "myapp.com")
await finish()
```

See [scripts/record-demo-template.mjs](scripts/record-demo-template.mjs) for a full starter.

**Portfolio example:** This repo's `scripts/record-demo.mjs` is a complete reference implementation.

### Step 5 — Recording conventions (required)

Every demo MUST include:

1. **Visible cursor** — red ring injected via `demo-recorder-lib.mjs` (updated on every `moveCursor`)
2. **Click ripples** — pulse animation on every click via `clickAt`
3. **Zoom-ins** — `clickLocator(..., { zoom: 1.35 })` or `setZoom(x, y, 1.5)` before highlighting a control
4. **Section labels** — `showLabel("Feature name")` at top of each segment, then `hideLabel()`
5. **Title cards** — intro + outro via `showTitleCard(title, subtitle)`
6. **Smooth motion** — eased cursor movement, incremental scroll (`smoothScroll`), typing with delay

### Step 6 — Run and verify

```bash
DEMO_URL=http://localhost:3000 ARTIFACTS_DIR=./artifacts node scripts/record-demo.mjs
```

Verify with ffprobe:

```bash
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 artifacts/demo.mp4
# Target: 60–120 seconds
```

Extract a sample frame to confirm cursor/zoom are visible:

```bash
ffmpeg -y -i artifacts/demo.mp4 -ss 00:00:10 -frames:v 1 /tmp/frame.png
```

## API reference (demo-recorder-lib.mjs)

| Function | Purpose |
| --- | --- |
| `createRecorder(opts)` | Launch browser, return helpers + `finish()` |
| `goto(path)` | Navigate (uses `load`, resets zoom/cursor) |
| `showLabel(text, ms?)` | Top pill label |
| `hideLabel()` | Fade label out |
| `showTitleCard(title, subtitle)` | Full-screen intro/outro card |
| `clickLocator(selector, { zoom, postDelay })` | Scroll, zoom, move cursor, click, ripple |
| `clickAt(x, y)` | Raw coordinate click |
| `setZoom(x, y, scale)` / `resetZoom()` | CSS transform zoom centered on point |
| `smoothScroll(deltaY, steps?)` | Incremental wheel scroll |
| `moveCursor(x, y)` | Eased cursor movement |
| `wait(ms)` | Pause |
| `finish()` | Close browser with timeout, convert webm → MP4 |

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Script hangs forever | Replace `networkidle` with `load`; add `withTimeout` on browser close |
| `localStorage` access denied | Avoid localStorage in Playwright; use UI clicks or `addInitScript` |
| Element not found | Use `goto()` directly instead of nav clicks that depend on app state |
| Browser close hangs | Call `finish()` which copies newest `.webm` without waiting on `saveAs` |
| No cursor in video | Ensure `CURSOR_INIT` runs after every navigation via `preparePage()` |
| Video too long | Target 8–12 sections, ~1.5 s per label, trim waits |

## Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `DEMO_URL` | `http://localhost:3000` | App base URL |
| `ARTIFACTS_DIR` | `/opt/cursor/artifacts` (cloud) or `./artifacts` | Output directory |

## Optional: commit to repo

Only when the user wants regeneration in CI or by teammates:

- `scripts/record-demo.mjs` — project-specific tour
- `scripts/demo-recorder-lib.mjs` — copy from skill or symlink
- `playwright` in `devDependencies`
- `"record:demo": "node scripts/record-demo.mjs"` in package.json

Do **not** commit generated `.mp4` files — keep them as artifacts.

## Additional references

- [references/feature-inventory.md](references/feature-inventory.md) — feature discovery checklist
- [references/project-detection.md](references/project-detection.md) — stack detection heuristics
