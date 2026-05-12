"use client";

import type { SessionEntry } from "@/types";

const SESSION_KEY = "spectalk_session";
const MAX_ENTRIES = 50;

export function getSession(): SessionEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addToSession(entry: SessionEntry): SessionEntry[] {
  const current = getSession();
  const updated = [entry, ...current].slice(0, MAX_ENTRIES);
  localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  return updated;
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function exportSession(entries: SessionEntry[]): void {
  if (entries.length === 0) return;

  const date = new Date().toISOString().split("T")[0];
  const lines: string[] = [`# SpecTalk Session — ${date}`, ""];

  for (const entry of entries) {
    const d = new Date(entry.timestamp).toLocaleString();
    lines.push(`## ${d}`);
    lines.push(`**Input:** ${entry.input}`);
    lines.push("");
    lines.push(`**Spec:**`);
    lines.push(entry.output.spec);
    lines.push("");
    lines.push(`**AI Prompt:**`);
    lines.push(entry.output.copyReady);
    lines.push("");
    lines.push(`**Scope:** ${entry.output.scope}`);
    if (entry.output.terms.length > 0) {
      lines.push("");
      lines.push("**Terms:**");
      for (const t of entry.output.terms) {
        lines.push(`- **${t.term}**: ${t.definition}`);
      }
    }
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `spectalk-session-${date}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
