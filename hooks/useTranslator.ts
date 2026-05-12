"use client";

import { useState, useCallback, useEffect } from "react";
import { useLocale } from "next-intl";
import { addToSession, getSession, clearSession } from "@/lib/session";
import type { TechContext, SpecOutput, SessionEntry, SupportedLocale } from "@/types";

interface TranslatorState {
  input: string;
  output: SpecOutput | null;
  context: TechContext;
  history: SessionEntry[];
  isLoading: boolean;
  error: string | null;
}

export function useTranslator() {
  const locale = useLocale() as SupportedLocale;

  const [state, setState] = useState<TranslatorState>({
    input: "",
    output: null,
    context: {},
    history: [],
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    setState((s) => ({ ...s, history: getSession() }));
  }, []);

  const setInput = useCallback((input: string) => {
    setState((s) => ({ ...s, input, error: null }));
  }, []);

  const setContext = useCallback((context: TechContext) => {
    setState((s) => ({ ...s, context }));
  }, []);

  const translate = useCallback(async () => {
    const { input, context } = state;

    if (!input.trim()) {
      setState((s) => ({ ...s, error: "empty" }));
      return;
    }
    if (input.length > 1000) {
      setState((s) => ({ ...s, error: "tooLong" }));
      return;
    }

    setState((s) => ({ ...s, isLoading: true, error: null }));

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request: input.trim(),
          language: locale,
          context: Object.keys(context).length > 0 ? context : undefined,
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "apiError");
      }

      const output: SpecOutput = await res.json();

      const entry: SessionEntry = {
        id: crypto.randomUUID(),
        input: input.trim(),
        output,
        context,
        language: locale,
        timestamp: Date.now(),
      };

      const history = addToSession(entry);
      setState((s) => ({ ...s, output, history, isLoading: false }));
    } catch (err: unknown) {
      const msg =
        err instanceof Error && err.name === "TimeoutError" ? "timeout" : "apiError";
      setState((s) => ({ ...s, isLoading: false, error: msg }));
    }
  }, [state, locale]);

  const clearHistory = useCallback(() => {
    clearSession();
    setState((s) => ({ ...s, history: [] }));
  }, []);

  return {
    input: state.input,
    output: state.output,
    context: state.context,
    history: state.history,
    isLoading: state.isLoading,
    error: state.error,
    setInput,
    setContext,
    translate,
    clearHistory,
  };
}
