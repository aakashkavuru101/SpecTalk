"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TechContext } from "@/types";

const FRONTEND_OPTIONS = [
  { id: "next15", label: "Next.js 15" },
  { id: "react19", label: "React 19" },
  { id: "vue3", label: "Vue 3" },
  { id: "svelte5", label: "Svelte 5" },
  { id: "vanilla", label: "Vanilla JS" },
];

const BACKEND_OPTIONS = [
  { id: "python-fastapi", label: "FastAPI" },
  { id: "nodejs-express", label: "Express" },
  { id: "nodejs-hono", label: "Hono" },
];

const DATABASE_OPTIONS = [
  { id: "supabase", label: "Supabase" },
  { id: "postgresql", label: "PostgreSQL" },
  { id: "mongodb", label: "MongoDB" },
  { id: "mysql", label: "MySQL" },
];

const AI_TOOL_OPTIONS = [
  { id: "claude-code", label: "Claude Code" },
  { id: "cursor", label: "Cursor" },
  { id: "v0", label: "v0" },
  { id: "github-copilot", label: "Copilot" },
];

interface PillGroupProps {
  options: { id: string; label: string }[];
  selected?: string;
  onSelect: (id: string | undefined) => void;
}

function PillGroup({ options, selected, onSelect }: PillGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(selected === opt.id ? undefined : opt.id)}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${
            selected === opt.id
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

interface ContextSelectorProps {
  context: TechContext;
  onChange: (context: TechContext) => void;
}

export function ContextSelector({ context, onChange }: ContextSelectorProps) {
  const t = useTranslations("context");
  const [open, setOpen] = useState(false);

  const activeCount = Object.values(context).filter(Boolean).length;

  return (
    <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="flex items-center gap-2">
          {t("toggle")}
          {activeCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeCount}
            </Badge>
          )}
        </span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">{t("description")}</p>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-foreground mb-2">{t("frontend")}</p>
              <PillGroup
                options={FRONTEND_OPTIONS}
                selected={context.frontend}
                onSelect={(v) => onChange({ ...context, frontend: v })}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground mb-2">{t("backend")}</p>
              <PillGroup
                options={BACKEND_OPTIONS}
                selected={context.backend}
                onSelect={(v) => onChange({ ...context, backend: v })}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground mb-2">{t("database")}</p>
              <PillGroup
                options={DATABASE_OPTIONS}
                selected={context.database}
                onSelect={(v) => onChange({ ...context, database: v })}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground mb-2">{t("aiTool")}</p>
              <PillGroup
                options={AI_TOOL_OPTIONS}
                selected={context.aiTool}
                onSelect={(v) => onChange({ ...context, aiTool: v })}
              />
            </div>
          </div>

          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={() => onChange({})}
            >
              {t("none")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
