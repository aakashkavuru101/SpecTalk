"use client";

import { useState, useEffect, useCallback } from "react";
import { Settings, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  getProviderSettings,
  saveProviderSettings,
  DEFAULT_MODELS,
} from "@/lib/providerSettings";
import type { ProviderId, ProviderSettings } from "@/types";

const PROVIDERS: { id: ProviderId; name: string; free?: boolean }[] = [
  { id: "anthropic", name: "Anthropic" },
  { id: "openai", name: "OpenAI" },
  { id: "google", name: "Google" },
  { id: "groq", name: "Groq", free: true },
  { id: "openrouter", name: "OpenRouter" },
  { id: "ollama", name: "Ollama" },
];

export function ProviderSelector() {
  const t = useTranslations("provider");
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<ProviderSettings>({
    provider: "anthropic",
  });

  useEffect(() => {
    // localStorage is unavailable during SSR; reading it here is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(getProviderSettings());
  }, []);

  const handleProviderChange = useCallback((id: ProviderId) => {
    setSettings((s) => ({
      provider: id,
      apiKey: id !== s.provider ? "" : s.apiKey,
      ollamaUrl: s.ollamaUrl,
      model: id !== s.provider ? "" : s.model,
    }));
  }, []);

  const handleSave = useCallback(() => {
    saveProviderSettings(settings);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setOpen(false);
    }, 900);
  }, [settings]);

  const isConfigured =
    settings.provider === "ollama" || !!settings.apiKey?.trim();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        aria-label={t("title")}
      >
        <Settings
          size={14}
          className={isConfigured ? "text-emerald-400" : ""}
        />
        <span className="hidden sm:inline">
          {PROVIDERS.find((p) => p.id === settings.provider)?.name ??
            t("title")}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.14, ease: "easeOut" }}
              className="absolute right-0 top-8 z-50 w-[min(320px,calc(100vw-2rem))] rounded-xl border border-border bg-background/95 backdrop-blur-md shadow-2xl p-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-foreground">
                  {t("title")}
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Provider grid */}
              <div className="mb-3">
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  {t("label")}
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {PROVIDERS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleProviderChange(p.id)}
                      className={`relative flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs border transition-all text-left ${
                        settings.provider === p.id
                          ? "border-indigo-500 bg-indigo-500/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-border/60 hover:text-foreground"
                      }`}
                    >
                      {p.name}
                      {p.free && (
                        <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium leading-none">
                          Free
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Key or URL */}
              {settings.provider === "ollama" ? (
                <div className="mb-3">
                  <label className="text-xs text-muted-foreground mb-1.5 block">
                    {t("ollamaUrl")}
                  </label>
                  <input
                    type="url"
                    value={settings.ollamaUrl ?? ""}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, ollamaUrl: e.target.value }))
                    }
                    placeholder={t("ollamaUrlPlaceholder")}
                    className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              ) : (
                <div className="mb-3">
                  <label className="text-xs text-muted-foreground mb-1.5 block">
                    {t("apiKey")}
                  </label>
                  <input
                    type="password"
                    value={settings.apiKey ?? ""}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, apiKey: e.target.value }))
                    }
                    placeholder={t("apiKeyPlaceholder")}
                    autoComplete="off"
                    className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Model override */}
              <div className="mb-4">
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  {t("model")}{" "}
                  <span className="opacity-40">
                    (default: {DEFAULT_MODELS[settings.provider]})
                  </span>
                </label>
                <input
                  type="text"
                  value={settings.model ?? ""}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, model: e.target.value }))
                  }
                  placeholder={t("modelPlaceholder")}
                  className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Save */}
              <button
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-medium py-2.5 transition-colors"
              >
                {saved ? (
                  <>
                    <Check size={12} />
                    {t("saved")}
                  </>
                ) : (
                  t("save")
                )}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
