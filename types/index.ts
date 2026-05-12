export type SupportedLocale = "en" | "ja" | "es" | "fr";

export type ProviderId =
  | "anthropic"
  | "openai"
  | "groq"
  | "google"
  | "openrouter"
  | "ollama";

export type ProviderSettings = {
  provider: ProviderId;
  apiKey?: string;
  ollamaUrl?: string;
  model?: string;
};

export type Framework = {
  id: string;
  name: string;
  version: string;
  category: "frontend" | "backend" | "database" | "ai-tool";
  vocab: Record<string, string>;
};

export type TechContext = {
  frontend?: string;
  backend?: string;
  database?: string;
  aiTool?: string;
};

export type SpecOutput = {
  summary: string;
  spec: string;
  terms: { term: string; definition: string }[];
  scope: "small" | "medium" | "large";
  copyReady: string;
};

export type SessionEntry = {
  id: string;
  input: string;
  output: SpecOutput;
  context: TechContext;
  language: SupportedLocale;
  timestamp: number;
};
