"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import type { SpecOutput } from "@/types";

const SCOPE_COLORS = {
  small: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  large: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const t = useTranslations("output");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 text-xs">
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Check size={12} className="text-emerald-400" />
          </motion.span>
        ) : (
          <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Copy size={12} />
          </motion.span>
        )}
      </AnimatePresence>
      {copied ? t("copied") : label}
    </Button>
  );
}

interface OutputPanelProps {
  output: SpecOutput;
}

export function OutputPanel({ output }: OutputPanelProps) {
  const t = useTranslations("output");
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="bg-card border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              {t("title")}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border font-medium ${SCOPE_COLORS[output.scope]}`}
            >
              {t(`scope.${output.scope}`)} · {t(`scope.${output.scope}Hint`)}
            </span>
          </div>
          <div className="flex gap-2">
            <CopyButton text={output.spec} label={t("copySpec")} />
            <CopyButton text={output.copyReady} label={t("copyPrompt")} />
          </div>
        </div>

        {/* Plain-English summary for the non-dev */}
        {output.summary && (
          <div className="px-5 py-4 bg-indigo-500/5 border-b border-indigo-500/10">
            <p className="text-[10px] text-indigo-400/70 uppercase tracking-wider font-medium mb-1.5">
              What this does
            </p>
            <p className="text-sm text-foreground/90 leading-relaxed font-[family-name:var(--font-dm-sans)]">
              {output.summary}
            </p>
          </div>
        )}

        {/* Spec output — monospace, prominent */}
        <div className="px-5 py-5">
          <pre className="font-mono text-sm leading-relaxed text-foreground whitespace-pre-wrap break-words">
            {output.spec}
          </pre>
        </div>

        {/* AI-ready prompt */}
        {output.copyReady !== output.spec && (
          <>
            <Separator />
            <div className="px-5 py-4 bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                AI prompt
              </p>
              <pre className="font-mono text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">
                {output.copyReady}
              </pre>
            </div>
          </>
        )}

        {/* Terms — collapsible */}
        {output.terms.length > 0 && (
          <>
            <Separator />
            <div>
              <button
                onClick={() => setTermsOpen((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>{t("terms")} ({output.terms.length})</span>
                {termsOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>

              <AnimatePresence>
                {termsOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 space-y-3">
                      {output.terms.map((term) => (
                        <div key={term.term}>
                          <span className="text-xs font-mono font-semibold text-foreground">
                            {term.term}
                          </span>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                            {term.definition}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </Card>
    </motion.div>
  );
}
