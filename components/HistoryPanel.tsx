"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Trash2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { exportSession } from "@/lib/session";
import type { SessionEntry } from "@/types";

function CopyItemButton({ text }: { text: string }) {
  const t = useTranslations("history");
  const [copied, setCopied] = useState(false);

  const handle = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handle}
      className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
      title={t("copyItem")}
    >
      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
    </button>
  );
}

interface HistoryPanelProps {
  entries: SessionEntry[];
  onClear: () => void;
}

export function HistoryPanel({ entries, onClear }: HistoryPanelProps) {
  const t = useTranslations("history");

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 text-center">
        <p className="text-xs text-muted-foreground">{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {t("title")} ({entries.length})
        </span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => exportSession(entries)}
          >
            <Download size={12} />
            {t("export")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-muted-foreground hover:text-destructive"
            onClick={onClear}
          >
            <Trash2 size={12} />
            {t("clear")}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-lg border border-border bg-card/30 p-3 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{entry.input}</p>
                  <p className="text-xs text-foreground mt-1 line-clamp-2 font-mono leading-relaxed">
                    {entry.output.spec}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      entry.output.scope === "small"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : entry.output.scope === "medium"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    {entry.output.scope}
                  </span>
                  <CopyItemButton text={entry.output.copyReady} />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground/40 mt-2">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
