# Heuristic Assistant Implementation Plan

Goal: replace the existing provider with Groq Free Plan AI and deterministic retrieval/summary fallbacks, per the final user request.
Architecture: shared pure TypeScript engine, server-owned portfolio context, client contact state machine.
Tech Stack: Next.js, TypeScript, React, Vitest.

- [x] Add tests for content matching, unknown questions, extraction limits, markup removal, and contact validation/confirmation/retry.
- [x] Run npm test -- tests/heuristics.test.ts to establish missing implementation failures.
- [x] Implement lib/heuristics.ts and lib/contact-flow.ts with typed pure interfaces.
- [x] Connect chatbot and summary UI; replace both API routes with validated heuristic handlers.
- [x] Remove Google SDK, environment exposure, and stale documentation.
- [x] Run focused tests, full npm test, build, and targeted lint; inspect diff and push main.

Final verification: 19 focused tests pass; production build and targeted lint pass. The full suite has one home smoke failure reproduced on the unchanged starting commit. TypeScript diagnostics remain in baseline modules; no diagnostics involve the changed modules. Live Groq generation requires GROQ_API_KEY and was verified with mocked provider responses only.
