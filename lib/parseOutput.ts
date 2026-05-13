import type { SpecOutput } from "@/types";

function coerceToString(value: unknown, fallback: string): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item;
        if (typeof item === "object" && item !== null) {
          const obj = item as Record<string, unknown>;
          // Handle {step, description} or {description} or {text} shapes
          const text = obj.description ?? obj.text ?? obj.content ?? obj.step;
          if (typeof text === "string") return text;
          const num = obj.step ?? obj.number;
          const desc = obj.description ?? obj.text;
          if (num !== undefined && desc !== undefined) return `${num}. ${desc}`;
        }
        return String(item);
      })
      .join("\n");
  }
  return fallback;
}

export function parseOutput(raw: string): SpecOutput {
  const stripped = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripped);
  } catch {
    return {
      summary: "",
      spec: raw,
      terms: [],
      scope: "medium",
      copyReady: raw,
    };
  }

  if (typeof parsed !== "object" || parsed === null) {
    return { summary: "", spec: raw, terms: [], scope: "medium", copyReady: raw };
  }

  const obj = parsed as Record<string, unknown>;

  const summary = typeof obj.summary === "string" ? obj.summary : "";
  const spec = coerceToString(obj.spec, raw);
  const copyReady = coerceToString(obj.copyReady, spec);
  const scope = ["small", "medium", "large"].includes(obj.scope as string)
    ? (obj.scope as "small" | "medium" | "large")
    : "medium";

  const rawTerms = Array.isArray(obj.terms) ? obj.terms : [];
  const terms = rawTerms
    .filter(
      (t): t is { term: string; definition: string } =>
        typeof t === "object" &&
        t !== null &&
        typeof (t as Record<string, unknown>).term === "string" &&
        typeof (t as Record<string, unknown>).definition === "string"
    )
    .map((t) => ({ term: t.term, definition: t.definition }));

  return { summary, spec, terms, scope, copyReady };
}
