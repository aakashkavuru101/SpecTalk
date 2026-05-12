# Changelog

All notable changes to SpecTalk are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.1.0] — 2025-05-12

### Added

- **Prompt translator** — translates vague feature requests into precise, copy-pasteable technical specifications via LLM
- **BYOK multi-provider system** — users bring their own API keys; supported providers: Anthropic (Claude), OpenAI, Google (Gemini), Groq (free tier), OpenRouter, Ollama (local)
- **Provider settings panel** — gear icon in nav; key stored in localStorage, never sent to any server
- **Tech context selector** — optional stack picker (frontend, backend, database, AI tool target) for stack-specific output
- **Session history** — last 50 translations persisted in localStorage; exportable as Markdown
- **Multilingual UI** — English, Japanese, Spanish, French via next-intl; output language matches input locale
- **Hero sections** — Ethereal Shadow (framer-motion), Anomalous Matter (THREE.js wireframe), full-height visual design
- **Edge Runtime API route** — low-latency `/api/translate` endpoint; routes to correct provider SDK per request
- **Framework vocabulary** — 16 framework JSON files with accurate, real API names for stack-specific spec generation
- **Unit tests** — 17 Vitest tests covering `buildSystemPrompt`, `parseOutput`, `session`, and framework loading
- **E2E tests** — 9 Playwright tests covering translate flow, session history, and i18n routing
- **GitHub Actions CI** — lint → typecheck → unit tests → E2E tests on every push and PR to `main`
- **MIT license**
