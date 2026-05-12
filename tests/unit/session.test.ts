import { describe, it, expect, beforeEach } from "vitest";

// jsdom provides localStorage; we import directly to avoid 'use client' guard
import { getSession, addToSession, clearSession } from "@/lib/session";
import type { SessionEntry } from "@/types";

function makeEntry(id: string): SessionEntry {
  return {
    id,
    input: `input ${id}`,
    output: {
      summary: "A plain-English explanation.",
      spec: "spec",
      terms: [],
      scope: "small",
      copyReady: "prompt",
    },
    context: {},
    language: "en",
    timestamp: Date.now(),
  };
}

describe("session storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns empty array when nothing stored", () => {
    expect(getSession()).toEqual([]);
  });

  it("adds an entry and retrieves it", () => {
    addToSession(makeEntry("1"));
    const session = getSession();
    expect(session).toHaveLength(1);
    expect(session[0].id).toBe("1");
  });

  it("prepends new entries (newest first)", () => {
    addToSession(makeEntry("first"));
    addToSession(makeEntry("second"));
    const session = getSession();
    expect(session[0].id).toBe("second");
    expect(session[1].id).toBe("first");
  });

  it("clears session", () => {
    addToSession(makeEntry("x"));
    clearSession();
    expect(getSession()).toEqual([]);
  });

  it("caps at 50 entries", () => {
    for (let i = 0; i < 55; i++) addToSession(makeEntry(String(i)));
    expect(getSession()).toHaveLength(50);
  });
});
