## Cursor Cloud specific instructions

- This repo is a single Next.js portfolio app. Standard setup/run/check commands are documented in `README.md` and `package.json`.
- Keep the startup dependency refresh on npm's legacy peer resolver unless the React 19 / `react-day-picker@8.10.1` peer conflict is resolved; a plain `npm install` fails during setup.
- Baseline local development does not require `.env.local`. Avoid copying `.env.example` with placeholder values unless you are intentionally testing optional Gemini or Telegram integrations; a truthy placeholder `GEMINI_API_KEY` changes client-side AI widget behavior.
- `npm run lint` is configured to run non-interactively, but the current application has existing lint violations. `npm run build` succeeds because `next.config.mjs` skips type and lint validation during builds.
- Optional external integrations are Gemini for chatbot/blog summaries and Telegram for contact submission delivery. They are not required for the core portfolio browse/persona/gamification flow.
- Demo video generation is covered by the Cursor skill at `.cursor/skills/demo-video-generation/` (also install globally to `~/.cursor/skills/demo-video-generation/` for all projects). Run `npm run record:demo` after starting the dev server.
