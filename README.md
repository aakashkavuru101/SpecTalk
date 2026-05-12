<div align="center">

# SpecTalk

### *Say what you mean. In tech.*

**Translate vague feature requests into precise, copy-pasteable technical specifications — for non-developers using AI coding tools.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Powered by Claude](https://img.shields.io/badge/Powered%20by-Claude%20Sonnet-orange)](https://anthropic.com)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

</div>

---

## What is SpecTalk?

You know what you want to build. You just can't say it in developer language.

> *"Make it load faster"*  →  SpecTalk  →  *"Implement lazy loading for image assets using React Suspense with a `loading.tsx` skeleton. For API-dependent data, stream the response using Next.js 15 Suspense boundaries."*

SpecTalk bridges the gap between what you *mean* and what your AI coding tool (Claude Code, Cursor, v0) actually needs to hear.

---

## Features

| | |
|---|---|
| **Prompt Translator** | Type any vague request. Get a precise, copy-pasteable technical spec back — in your language. |
| **Tech Context Selector** | Tell SpecTalk your stack (Next.js, Supabase, FastAPI…). Get stack-specific output that actually uses the right APIs. |
| **Session History** | Every translation saved in your browser. Review, copy, or export your whole session as Markdown. |
| **Multilingual** | English, Japanese, Spanish, French — output in the same language as your input. |
| **Privacy First** | No account. No database. No tracking. Everything stays in your browser. |

---

## Tech Stack

```
Frontend    Next.js 16 (App Router) · TypeScript · Tailwind CSS v4
UI          shadcn/ui · Framer Motion · Three.js
AI          Claude Sonnet (Anthropic API) · Edge Runtime
i18n        next-intl · EN / JA / ES / FR
Testing     Vitest (unit) · Playwright (E2E)
Deploy      Vercel
```

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/aakashkavuru101/SpecTalk.git
cd SpecTalk
pnpm install
```

### 2. Add your Anthropic API key

```bash
cp .env.example .env.local
```

Then open `.env.local` and replace the placeholder:

```env
ANTHROPIC_API_KEY=sk-ant-...
```

> Get a key at [console.anthropic.com](https://console.anthropic.com)

### 3. Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/en` automatically.

---

## Project Structure

```
spectalk/
├── app/
│   ├── [locale]/          # Locale-routed pages (en, ja, es, fr)
│   └── api/translate/     # Edge Runtime — Claude API call
├── components/
│   ├── ui/                # Hero + shadcn/ui components
│   ├── ContextSelector    # Stack picker
│   ├── TranslatorInput    # Prompt input
│   ├── OutputPanel        # Spec output + copy
│   └── HistoryPanel       # Session history
├── data/frameworks/       # Framework vocabulary JSON files
├── messages/              # i18n translation strings
├── lib/
│   ├── buildSystemPrompt  # Assembles Claude system prompt
│   ├── parseOutput        # Parses Claude response
│   └── session            # localStorage helpers
└── tests/
    ├── unit/              # Vitest tests
    └── e2e/               # Playwright tests
```

---

## Contributing

SpecTalk's power comes from its framework vocabulary files. You can improve output quality for any framework **without writing a single line of code** — just edit a JSON file.

### Add or improve a framework

1. Fork this repo
2. Open `data/frameworks/[framework].json`
3. Update the `vocab` entries with accurate, current patterns
4. Submit a PR

Each vocab entry should describe **what actually exists** in the framework — specific API names, hooks, patterns. No invented methods.

```json
{
  "id": "your-framework",
  "name": "Framework Name",
  "version": "1.0",
  "category": "frontend",
  "vocab": {
    "search": "Exact implementation pattern using real API names...",
    "loading": "How loading states actually work in this framework..."
  }
}
```

See [`data/frameworks/_template.json`](data/frameworks/_template.json) for the full template.

### Add a new language

1. Copy `messages/en.json` to `messages/[locale].json`
2. Translate all values (keep the keys in English)
3. Add the locale to `i18n/routing.ts`
4. Submit a PR

---

## Self-Hosting

SpecTalk deploys to Vercel in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aakashkavuru101/SpecTalk)

Set `ANTHROPIC_API_KEY` in your Vercel environment variables. Done.

---

## License

MIT — see [LICENSE](LICENSE).

---

<div align="center">

Built with Claude · Open source · No accounts required

</div>
