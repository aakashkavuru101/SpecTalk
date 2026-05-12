<div align="center">

# SpecTalk

**Say what you mean. In tech.**

## 🌐 [spectalk.vercel.app](https://spectalk.vercel.app)

Translate vague feature requests into precise, copy-pasteable technical specs —  
for non-developers working with AI coding tools.

</div>

---

> *"Make it load faster"* → **"Implement lazy loading for image assets using React Suspense with a `loading.tsx` skeleton. For API-dependent data, stream the response using Next.js Suspense boundaries."**

---

## What it does

| | |
|---|---|
| **Translate** | Type any vague request. Get a precise spec ready to paste into Claude Code, Cursor, or v0. |
| **Stack-aware** | Select your stack (Next.js, Supabase, FastAPI…) for output that uses the right APIs. |
| **BYOK** | Bring your own key — Anthropic, OpenAI, Google Gemini, Groq (free tier), OpenRouter, or Ollama. Nothing stored server-side. |
| **Private** | No account. No database. No tracking. History lives in your browser only. |
| **Multilingual** | English · Japanese · Spanish · French |

---

## Run locally

```bash
git clone https://github.com/aakashkavuru101/SpecTalk
cd SpecTalk
pnpm install
pnpm dev
```

Open [localhost:3000](http://localhost:3000) → click the **⚙ gear icon** → add your API key → start translating.

No environment variables needed when using BYOK.

---

## Contributing

Framework vocabulary lives in [`data/frameworks/`](data/frameworks/) — improving output quality for any framework means editing a JSON file, no code required. See [`_template.json`](data/frameworks/_template.json) for the format.

---

<div align="center">

MIT · Open source · Built with Claude · [spectalk.vercel.app](https://spectalk.vercel.app)

</div>
