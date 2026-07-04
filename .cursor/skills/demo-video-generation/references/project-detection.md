# Project Detection Heuristics

Detect stack and dev-server settings before recording.

## Detection order

1. Read `package.json` dependencies and scripts
2. Check config files: `next.config.*`, `vite.config.*`, `astro.config.*`, `remix.config.*`
3. Read `README.md` getting started section
4. Check `AGENTS.md` or `.cursor/` for project-specific run instructions

## Framework signals

| Signal | Framework | Port (default) |
| --- | --- | --- |
| `"next"` in dependencies | Next.js | 3000 |
| `"vite"` in dependencies | Vite | 5173 |
| `"astro"` in dependencies | Astro | 4321 |
| `"@remix-run/node"` | Remix | 5173 |
| `"react-scripts"` | Create React App | 3000 |
| `"nuxt"` | Nuxt | 3000 |
| `"@angular/core"` | Angular | 4200 |
| `"svelte"` + `"vite"` | SvelteKit | 5173 |

## Start command priority

1. `npm run dev` (most common)
2. `npm start`
3. `npm run serve`
4. `yarn dev` / `pnpm dev` if lockfile matches

## Dependency install notes

- React 19 peer conflicts: try `npm install --legacy-peer-deps`
- Monorepos: run dev from the app package directory, not root
- Docker: prefer local `npm run dev` for Playwright unless user requests container recording

## Health check before recording

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:PORT
# Expect 200
```

## Artifacts directory

| Environment | Default `ARTIFACTS_DIR` |
| --- | --- |
| Cursor Cloud Agent | `/opt/cursor/artifacts` |
| Local development | `./artifacts` (create if missing) |
