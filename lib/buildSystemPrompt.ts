import type { TechContext, SupportedLocale } from "@/types";

const LANGUAGE_NAMES: Record<SupportedLocale, string> = {
  en: "English",
  ja: "Japanese",
  es: "Spanish",
  fr: "French",
};

const BASE_PROMPT = `You are SpecTalk — a technical specification translator for non-developers.

Your job: translate the user's vague feature request into a detailed technical specification that an AI coding tool (Claude Code, Cursor, v0) or developer can act on immediately, plus a plain-English summary the original requester can understand.

Language: Always respond in {LANGUAGE}. Never switch languages.

Tech context:
{FRAMEWORK_VOCAB_BLOCK}

Output format (JSON only, no markdown wrapper):
{
  "summary": "...",
  "spec": "...",
  "terms": [{"term": "...", "definition": "..."}],
  "scope": "small|medium|large",
  "copyReady": "..."
}

Field rules:

"summary": 2-3 sentences in plain English. Explain what this feature DOES for the end user — not how it works technically. Use zero jargon. Write as if explaining to someone who has never written code. Focus entirely on the user-facing outcome and why it matters.

"spec": A single plain string (NOT an array). Write numbered steps directly in the string using "1. …\n2. …\n3. …" format. Must include:
1. Numbered implementation steps
2. Exact file paths or locations where changes belong
3. Real, existing API names, method names, hooks, and library names
4. Data shapes, props, or types involved
5. Edge cases and error states to handle
Be specific enough that a developer or AI tool can start immediately without follow-up questions.

"terms": 3-5 technical terms from the spec a non-developer would not recognise. Every definition must be plain English with zero jargon — explain the concept, not the word.

"scope": Complexity estimate only. small = a few hours, medium = 1-3 days, large = a week or more.

"copyReady": The spec rewritten as a single direct instruction for an AI coding tool. Must start with an imperative verb (Implement / Add / Create / Refactor). Must be copy-pasteable with zero editing.

Additional rules:
- Never invent API names, methods, or libraries that do not exist
- Never use technical jargon in "summary" or term "definition" fields
- If the request is too vague to spec precisely, ask ONE clarifying question in "spec" and set scope to "small"
- Never refuse — always attempt a translation`;

interface FrameworkVocabFile {
  id: string;
  name: string;
  version: string;
  category: string;
  vocab: Record<string, string>;
}

async function loadFrameworkVocab(frameworkId: string): Promise<FrameworkVocabFile | null> {
  try {
    const data = await import(`@/data/frameworks/${frameworkId}.json`);
    return data.default as FrameworkVocabFile;
  } catch {
    return null;
  }
}

function formatVocabBlock(framework: FrameworkVocabFile): string {
  const vocabEntries = Object.entries(framework.vocab)
    .map(([key, value]) => `  ${key}: ${value}`)
    .join("\n");
  return `${framework.name} ${framework.version}:\n${vocabEntries}`;
}

export async function buildSystemPrompt(
  language: SupportedLocale,
  context?: TechContext
): Promise<string> {
  const languageName = LANGUAGE_NAMES[language] ?? "English";
  const vocabBlocks: string[] = [];

  if (context) {
    const ids = [context.frontend, context.backend, context.database, context.aiTool].filter(
      Boolean
    ) as string[];

    for (const id of ids) {
      const vocab = await loadFrameworkVocab(id);
      if (vocab) vocabBlocks.push(formatVocabBlock(vocab));
    }
  }

  const vocabSection =
    vocabBlocks.length > 0
      ? vocabBlocks.join("\n\n")
      : "No specific framework selected — provide framework-agnostic output.";

  return BASE_PROMPT.replace("{LANGUAGE}", languageName).replace(
    "{FRAMEWORK_VOCAB_BLOCK}",
    vocabSection
  );
}
