import { describe, it, expect } from "vitest";
import { parseOutput } from "@/lib/parseOutput";

describe("parseOutput", () => {
  it("parses a valid JSON string including summary", () => {
    const raw = JSON.stringify({
      summary: "This makes images load only when needed, speeding up the page.",
      spec: "Implement lazy loading",
      terms: [{ term: "lazy loading", definition: "loads data only when needed" }],
      scope: "small",
      copyReady: "Add lazy loading to the image gallery component",
    });
    const result = parseOutput(raw);
    expect(result.summary).toBe("This makes images load only when needed, speeding up the page.");
    expect(result.spec).toBe("Implement lazy loading");
    expect(result.scope).toBe("small");
    expect(result.terms).toHaveLength(1);
    expect(result.copyReady).toBe("Add lazy loading to the image gallery component");
  });

  it("defaults summary to empty string when absent", () => {
    const raw = JSON.stringify({ spec: "Do something", terms: [], scope: "small", copyReady: "Do something" });
    expect(parseOutput(raw).summary).toBe("");
  });

  it("strips markdown code fences", () => {
    const raw = '```json\n{"spec":"test","terms":[],"scope":"medium","copyReady":"test"}\n```';
    const result = parseOutput(raw);
    expect(result.spec).toBe("test");
  });

  it("falls back gracefully on invalid JSON", () => {
    const raw = "this is not JSON";
    const result = parseOutput(raw);
    expect(result.spec).toBe(raw);
    expect(result.scope).toBe("medium");
    expect(result.terms).toHaveLength(0);
  });

  it("defaults invalid scope to medium", () => {
    const raw = JSON.stringify({
      spec: "do something",
      terms: [],
      scope: "enormous",
      copyReady: "do something",
    });
    const result = parseOutput(raw);
    expect(result.scope).toBe("medium");
  });

  it("filters malformed terms", () => {
    const raw = JSON.stringify({
      spec: "test",
      terms: [
        { term: "valid", definition: "has both fields" },
        { term: "missing def" },
        null,
        "string",
      ],
      scope: "large",
      copyReady: "test",
    });
    const result = parseOutput(raw);
    expect(result.terms).toHaveLength(1);
    expect(result.terms[0].term).toBe("valid");
  });

  it("falls back copyReady to spec when absent", () => {
    const raw = JSON.stringify({ spec: "my spec", terms: [], scope: "small" });
    const result = parseOutput(raw);
    expect(result.copyReady).toBe("my spec");
  });

  it("coerces spec array-of-strings to newline-joined text", () => {
    const raw = JSON.stringify({
      spec: ["1. Step one", "2. Step two", "3. Step three"],
      terms: [],
      scope: "medium",
      copyReady: "Do it",
    });
    const result = parseOutput(raw);
    expect(result.spec).toBe("1. Step one\n2. Step two\n3. Step three");
  });

  it("coerces spec array-of-objects to readable text", () => {
    const raw = JSON.stringify({
      spec: [
        { step: "1", description: "Create the file" },
        { step: "2", description: "Add the component" },
      ],
      terms: [],
      scope: "small",
      copyReady: "Do it",
    });
    const result = parseOutput(raw);
    expect(result.spec).toContain("Create the file");
    expect(result.spec).toContain("Add the component");
    expect(result.spec).not.toContain("[object Object]");
  });
});
