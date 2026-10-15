# Heuristic portfolio assistant

## Final scope update

The user subsequently requested AI through a free alternative. Use Groq's Free Plan with `openai/gpt-oss-20b` by default, a server-only `GROQ_API_KEY`, and optional `GROQ_MODEL`. Both server routes attempt AI generation once with a 15-second timeout and bounded source/history input. Missing credentials, quota errors, empty responses, and provider failures use the heuristic engine. UI distinguishes AI output from fallback. Contact collection stays deterministic and contact details are excluded from AI history. Keep the account on the Free Plan; upgrading enables usage-based billing. No model credentials are currently available for a live provider test.

The original approved heuristic design below remains the fallback specification.

Approved design: replace all model calls with a shared deterministic engine. Rank portfolio entries by query tokens and intent, quote source content, and return an explicit fallback for unknown questions. Extract up to three relevant sentences in source order under 150 words for summaries. Strip markup and executable content before extraction.

Keep chat and summary widgets available without credentials. Guide contact through name, validated email, one of the existing reasons, message, and explicit send confirmation; use /api/contact and preserve retry/cancel behavior on delivery failure. Keep /api/chat and /api/summarize contracts with validated requests. Remove SDK, key exposure, and outdated documentation. Telegram remains optional for contact delivery.

Branch migration: old main is deprecated; redesign/ui-revamp is now default main. Commit and push changes to main.

Verification: deterministic engine, contact transitions, API validation and widget tests, full suite, build, and targeted lint. Record pre-existing failures separately.
