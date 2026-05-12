import type { TechContext, SupportedLocale } from "@/types";

const LANGUAGE_NAMES: Record<SupportedLocale, string> = {
  en: "English",
  ja: "Japanese",
  es: "Spanish",
  fr: "French",
};

const BASE_PROMPT = `You are SpecTalk — a technical specification translator for non-developers.

Your job: translate the user's vague feature request into a precise technical specification that an AI coding tool (Claude Code, Cursor, v0) or developer can act on immediately.

Language: Always respond in {LANGUAGE}. Never switch languages.

Tech context:
{FRAMEWORK_VOCAB_BLOCK}

Output format (JSON only, no markdown wrapper):
{
  "spec": "Precise technical restatement of the request",
  "terms": [{"term": "...", "definition": "plain language explanation"}],
  "scope": "small|medium|large",
  "copyReady": "The spec rewritten as a direct instruction for an AI coding tool"
}

Rules:
- Never invent API names, methods, or libraries that do not exist
- Never use technical jargon in "definition" fields — explain as if to someone non-technical
- "copyReady" must be copy-pasteable with zero editing
- "scope" is complexity only: small = hours, medium = days, large = weeks
- If the request is too vague to spec precisely, ask ONE clarifying question in the "spec" field
- Never refuse a request — always attempt a translation`;

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
