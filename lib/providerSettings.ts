import type { ProviderSettings, ProviderId } from "@/types";

const STORAGE_KEY = "spectalk_provider_settings";

export const DEFAULT_MODELS: Record<ProviderId, string> = {
  anthropic: "claude-sonnet-4-6",
  openai: "gpt-4o-mini",
  google: "gemini-2.0-flash-lite",
  groq: "llama-3.1-8b-instant",
  openrouter: "openai/gpt-4o-mini",
  ollama: "llama3.2",
};

export function getProviderSettings(): ProviderSettings {
  if (typeof window === "undefined") return { provider: "anthropic" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { provider: "anthropic" };
    return JSON.parse(raw) as ProviderSettings;
  } catch {
    return { provider: "anthropic" };
  }
}

export function saveProviderSettings(settings: ProviderSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function clearProviderSettings(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
