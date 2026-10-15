## Cursor Cloud specific instructions

- This repo is a single Next.js portfolio app. Standard setup/run/check commands are documented in `README.md` and `package.json`.
- Keep the startup dependency refresh on npm's legacy peer resolver unless the React 19 / `react-day-picker@8.10.1` peer conflict is resolved; a plain `npm install` fails during setup.
- Baseline local development does not require `.env.local`. Groq AI chat/summaries require a server-only `GROQ_API_KEY`; leave it blank to use deterministic fallbacks. Never expose provider keys via `NEXT_PUBLIC_` or `next.config.mjs`. Telegram contact delivery is optional.
- `npm run lint` is configured to run non-interactively, but the current application has existing lint violations. `npm run build` succeeds because `next.config.mjs` skips type and lint validation during builds.
- Optional external integrations are Groq for AI chat/summaries and Telegram for contact delivery. Neither is required for the core portfolio browse/persona/gamification flow.
- Demo video: run `npm run record:demo` (production build + testreel walkthrough). Skill scripts live globally at `~/.cursor/skills/record-app/scripts/` (mirror: `~/.claude/skills/record-app/`). One-time testreel install: clone [LuC-9/testreel](https://github.com/LuC-9/testreel) to `~/.local/testreel`, then `npm install && npm run build && npm link`. Output: `demo/portfolio-demo.mp4` (Git LFS). Ephemeral recording configs are deleted after each run.
