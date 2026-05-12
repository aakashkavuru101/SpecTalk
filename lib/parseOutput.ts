import type { SpecOutput } from "@/types";

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
  const spec = typeof obj.spec === "string" ? obj.spec : String(obj.spec ?? raw);
  const copyReady =
    typeof obj.copyReady === "string" ? obj.copyReady : String(obj.copyReady ?? spec);
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
