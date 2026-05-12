export const runtime = "edge";

import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/buildSystemPrompt";
import { parseOutput } from "@/lib/parseOutput";
import type { TechContext, SupportedLocale } from "@/types";

const SUPPORTED_LOCALES = new Set<string>(["en", "ja", "es", "fr"]);
const VALID_FRONTEND = new Set(["next15", "react19", "vue3", "svelte5", "vanilla"]);
const VALID_BACKEND = new Set(["python-fastapi", "nodejs-express", "nodejs-hono"]);
const VALID_DATABASE = new Set(["supabase", "postgresql", "mongodb", "mysql"]);
const VALID_AI_TOOL = new Set(["claude-code", "cursor", "v0", "github-copilot"]);

interface TranslateRequest {
  request: string;
  language: string;
  context?: {
    frontend?: string;
    backend?: string;
    database?: string;
    aiTool?: string;
  };
}

export async function POST(req: Request): Promise<Response> {
  let body: TranslateRequest;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { request: userRequest, language, context } = body;

  if (!userRequest || typeof userRequest !== "string" || userRequest.trim().length === 0) {
    return Response.json({ error: "request is required" }, { status: 400 });
  }
  if (userRequest.length > 1000) {
    return Response.json({ error: "request exceeds 1000 characters" }, { status: 400 });
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

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Service misconfigured" }, { status: 500 });
  }

  const systemPrompt = await buildSystemPrompt(
    locale,
    Object.keys(safeContext).length > 0 ? safeContext : undefined
  );

  const client = new Anthropic({ apiKey });

  let rawContent: string;
  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userRequest.trim() }],
    });
    rawContent =
      message.content[0].type === "text" ? message.content[0].text : "";
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: `AI error: ${msg}` }, { status: 502 });
  }

  const output = parseOutput(rawContent);
  return Response.json(output);
}
