"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LOCALES = [
  { code: "en", label: "EN", name: "English" },
  { code: "ja", label: "日本語", name: "Japanese" },
  { code: "es", label: "ES", name: "Español" },
  { code: "fr", label: "FR", name: "Français" },
];

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Switch language"
      >
        <span className="font-medium">{current.label}</span>
        <ChevronDown
          size={10}
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className="absolute right-0 top-7 z-50 min-w-[148px] rounded-lg border border-border bg-background/95 backdrop-blur-md shadow-xl overflow-hidden"
            >
              {LOCALES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    router.push(`/${l.code}`);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                    l.code === locale
                      ? "text-foreground bg-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <span className="font-medium">{l.label}</span>
                  <span className="ml-3 opacity-50">{l.name}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
