"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { GitFork } from "lucide-react";
import { EtherealShadow } from "@/components/ui/etheral-shadow";
import { AnomalousMatterHero } from "@/components/ui/anomalous-matter-hero";
import { ContextSelector } from "@/components/ContextSelector";
import { TranslatorInput } from "@/components/TranslatorInput";
import { OutputPanel } from "@/components/OutputPanel";
import { HistoryPanel } from "@/components/HistoryPanel";
import { ProviderSelector } from "@/components/ProviderSelector";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { HowItWorks } from "@/components/HowItWorks";
import { useTranslator } from "@/hooks/useTranslator";

export default function Home() {
  const t = useTranslations("nav");
  const tHero = useTranslations("hero");

  const {
    input,
    output,
    context,
    history,
    isLoading,
    error,
    setInput,
    setContext,
    translate,
    clearHistory,
  } = useTranslator();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <span className="font-[family-name:var(--font-sora)] font-semibold text-sm tracking-tight text-foreground">
          {t("tagline")}
        </span>
        <div className="flex items-center gap-3 sm:gap-4">
          <ProviderSelector />
          <LocaleSwitcher />
          <a
            href="https://github.com/aakashkavuru101/SpecTalk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <GitFork size={14} />
            <span className="hidden sm:inline">{t("github")}</span>
          </a>
        </div>
      </nav>

      {/* Hero 1 — Ethereal Shadow (full height) */}
      <section className="h-screen w-full relative">
        <EtherealShadow
          color="rgba(99, 102, 241, 0.8)"
          animation={{ scale: 100, speed: 90 }}
          noise={{ opacity: 1, scale: 1.2 }}
          sizing="fill"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20 pt-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="font-[family-name:var(--font-sora)] text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight"
          >
            {tHero("tagline")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="mt-4 max-w-xl text-base md:text-lg text-white/70 leading-relaxed"
          >
            {tHero("subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-10"
          >
            <a
              href="#translator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium backdrop-blur-sm hover:bg-white/20 transition-all"
            >
              ↓ Try it
            </a>
          </motion.div>
        </div>
      </section>

      {/* Demo video */}
      <section className="relative py-16 md:py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-xs font-mono text-indigo-400/60 uppercase tracking-widest mb-6">
            See it in action
          </p>
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/10">
            <video
              src="/video/demo.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto block"
              style={{ aspectRatio: "16/9" }}
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <HowItWorks />

      {/* Translator section */}
      <section id="translator" className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-4">
            <ContextSelector context={context} onChange={setContext} />
            <TranslatorInput
              value={input}
              onChange={setInput}
              onSubmit={translate}
              isLoading={isLoading}
              error={error ?? undefined}
            />
            {output && <OutputPanel output={output} />}
          </div>

          {/* History sidebar — divider on mobile */}
          <div className="lg:col-span-1 border-t border-border/40 pt-6 lg:border-0 lg:pt-0">
            <HistoryPanel entries={history} onClear={clearHistory} />
          </div>
        </div>
      </section>

      {/* Hero 2 — Anomalous Matter (full height) */}
      <AnomalousMatterHero
        title="SpecTalk — Open source"
        subtitle="Framework vocabulary stays current because the community updates it."
        description="No account. No database. No tracking. Your session stays on your device."
      />
    </div>
  );
}
