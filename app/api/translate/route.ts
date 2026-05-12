export const runtime = "edge";

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildSystemPrompt } from "@/lib/buildSystemPrompt";
import { parseOutput } from "@/lib/parseOutput";
import type { TechContext, SupportedLocale, ProviderId } from "@/types";

const SUPPORTED_LOCALES = new Set<string>(["en", "ja", "es", "fr"]);
const VALID_FRONTEND = new Set([
  "next15",
  "react19",
  "vue3",
  "svelte5",
  "vanilla",
]);
const VALID_BACKEND = new Set([
  "python-fastapi",
  "nodejs-express",
  "nodejs-hono",
]);
const VALID_DATABASE = new Set(["supabase", "postgresql", "mongodb", "mysql"]);
const VALID_AI_TOOL = new Set([
  "claude-code",
  "cursor",
  "v0",
  "github-copilot",
]);
const VALID_PROVIDERS = new Set<ProviderId>([
  "anthropic",
  "openai",
  "groq",
  "google",
  "openrouter",
  "ollama",
]);

const DEFAULT_MODELS: Record<ProviderId, string> = {
  anthropic: "claude-sonnet-4-6",
  openai: "gpt-4o-mini",
  google: "gemini-2.0-flash-lite",
  groq: "llama-3.1-8b-instant",
  openrouter: "openai/gpt-4o-mini",
  ollama: "llama3.2",
};

const OPENAI_COMPAT_BASE_URLS: Partial<Record<ProviderId, string>> = {
  groq: "https://api.groq.com/openai/v1",
  openrouter: "https://openrouter.ai/api/v1",
};

interface TranslateRequest {
  request: string;
  language: string;
  context?: {
    frontend?: string;
    backend?: string;
    database?: string;
    aiTool?: string;
  };
  provider?: string;
  apiKey?: string;
  ollamaUrl?: string;
  model?: string;
}

async function callAnthropic(
  apiKey: string,
  model: string,
  system: string,
  userMsg: string
): Promise<string> {
  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model,
    max_tokens: 1024,
    system,
    messages: [{ role: "user", content: userMsg }],
  });
  return message.content[0].type === "text" ? message.content[0].text : "";
}

async function callOpenAICompat(
  apiKey: string,
  model: string,
  system: string,
  userMsg: string,
  baseURL?: string
): Promise<string> {
  const client = new OpenAI({
    apiKey,
    ...(baseURL ? { baseURL } : {}),
  });
  const completion = await client.chat.completions.create({
    model,
    max_tokens: 1024,
    messages: [
      { role: "system", content: system },
      { role: "user", content: userMsg },
    ],
  });
  return completion.choices[0]?.message?.content ?? "";
}

async function callGoogle(
  apiKey: string,
  model: string,
  system: string,
  userMsg: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const genModel = genAI.getGenerativeModel({
    model,
    systemInstruction: system,
  });
  const result = await genModel.generateContent(userMsg);
  return result.response.text();
}

export async function POST(req: Request): Promise<Response> {
  let body: TranslateRequest;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    request: userRequest,
    language,
    context,
    apiKey,
    ollamaUrl,
    model,
  } = body;
  const providerRaw = body.provider;

  if (
    !userRequest ||
    typeof userRequest !== "string" ||
    userRequest.trim().length === 0
  ) {
    return Response.json({ error: "request is required" }, { status: 400 });
  }
  if (userRequest.length > 1000) {
    return Response.json(
      { error: "request exceeds 1000 characters" },
      { status: 400 }
    );
  }

  const locale: SupportedLocale = SUPPORTED_LOCALES.has(language)
    ? (language as SupportedLocale)
    : "en";

  const safeContext: TechContext = {};
  if (context?.frontend && VALID_FRONTEND.has(context.frontend))
    safeContext.frontend = context.frontend;
  if (context?.backend && VALID_BACKEND.has(context.backend))
    safeContext.backend = context.backend;
  if (context?.database && VALID_DATABASE.has(context.database))
    safeContext.database = context.database;
  if (context?.aiTool && VALID_AI_TOOL.has(context.aiTool))
    safeContext.aiTool = context.aiTool;

  const provider: ProviderId =
    providerRaw && VALID_PROVIDERS.has(providerRaw as ProviderId)
      ? (providerRaw as ProviderId)
      : "anthropic";

  // For Anthropic, fall back to server env key when no user key provided
  const resolvedKey =
    apiKey?.trim() ||
    (provider === "anthropic" ? process.env.ANTHROPIC_API_KEY : undefined);

  if (!resolvedKey && provider !== "ollama") {
    return Response.json(
      {
        error:
          "No API key provided. Please configure your provider in settings.",
      },
      { status: 400 }
    );
  }

  const resolvedModel = model?.trim() || DEFAULT_MODELS[provider];
  const systemPrompt = await buildSystemPrompt(
    locale,
    Object.keys(safeContext).length > 0 ? safeContext : undefined
  );

  let rawContent: string;
  try {
    switch (provider) {
      case "anthropic":
        rawContent = await callAnthropic(
          resolvedKey!,
          resolvedModel,
          systemPrompt,
          userRequest.trim()
        );
        break;

      case "google":
        rawContent = await callGoogle(
          resolvedKey!,
          resolvedModel,
          systemPrompt,
          userRequest.trim()
        );
        break;

      case "ollama": {
        const base =
          ollamaUrl?.trim() || "http://localhost:11434/v1";
        rawContent = await callOpenAICompat(
          "ollama",
          resolvedModel,
          systemPrompt,
          userRequest.trim(),
          base
        );
        break;
      }

      default:
        rawContent = await callOpenAICompat(
          resolvedKey!,
          resolvedModel,
          systemPrompt,
          userRequest.trim(),
          OPENAI_COMPAT_BASE_URLS[provider]
        );
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: `AI error: ${msg}` }, { status: 502 });
  }

  const output = parseOutput(rawContent);
  return Response.json(output);
}
