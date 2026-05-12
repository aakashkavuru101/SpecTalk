import { describe, it, expect } from "vitest";
import { buildSystemPrompt } from "@/lib/buildSystemPrompt";

describe("buildSystemPrompt", () => {
  it("includes the language name", async () => {
    const prompt = await buildSystemPrompt("ja");
    expect(prompt).toContain("Japanese");
    expect(prompt).not.toContain("{LANGUAGE}");
  });

  it("defaults to English for unsupported locale", async () => {
    // Casting to bypass TypeScript — tests the runtime path
    const prompt = await buildSystemPrompt("zz" as "en");
    expect(prompt).toContain("English");
  });

  it("includes no vocab block when no context provided", async () => {
    const prompt = await buildSystemPrompt("en");
    expect(prompt).toContain("framework-agnostic output");
    expect(prompt).not.toContain("{FRAMEWORK_VOCAB_BLOCK}");
  });

  it("includes framework vocab when context is provided", async () => {
    const prompt = await buildSystemPrompt("en", { frontend: "next15" });
    expect(prompt).toContain("Next.js");
    expect(prompt).not.toContain("framework-agnostic output");
  });

  it("skips invalid framework ids silently", async () => {
    const prompt = await buildSystemPrompt("en", { frontend: "nonexistent-framework" });
    expect(prompt).toContain("framework-agnostic output");
  });

  it("includes multiple frameworks when context has multiple", async () => {
    const prompt = await buildSystemPrompt("en", {
      frontend: "react19",
      database: "supabase",
    });
    expect(prompt).toContain("React");
    expect(prompt).toContain("Supabase");
  });
});
