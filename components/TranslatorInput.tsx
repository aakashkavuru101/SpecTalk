"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

interface TranslatorInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error?: string;
}

export function TranslatorInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  error,
}: TranslatorInputProps) {
  const t = useTranslations("input");
  const tErr = useTranslations("errors");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (!isLoading && value.trim()) onSubmit();
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("placeholder")}
          disabled={isLoading}
          rows={4}
          maxLength={1000}
          className="resize-none bg-card/50 border-border focus:border-primary/50 text-foreground placeholder:text-muted-foreground/50 font-[family-name:var(--font-dm-sans)] text-sm sm:text-base leading-relaxed pr-4 pb-10 transition-colors min-h-[100px]"
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="text-xs text-muted-foreground/40">{value.length}/1000</span>
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-destructive"
        >
          {tErr(error as Parameters<typeof tErr>[0])}
        </motion.p>
      )}

      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={isLoading || !value.trim()}
          size="lg"
          className="gap-2 font-[family-name:var(--font-sora)] font-semibold px-6"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {t("submitting")}
            </>
          ) : (
            <>
              {t("submit")}
              <ArrowRight size={16} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
