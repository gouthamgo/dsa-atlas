import { describe, it, expect } from "vitest";
import { ALL_PROBLEMS } from "@/data/problems";
import { PATTERN_PREREQS, TOPIC_ORDER } from "@/data/types";

describe("dataset", () => {
  it("has at least 60 problems", () => {
    expect(ALL_PROBLEMS.length).toBeGreaterThanOrEqual(60);
  });

  it("has unique ids", () => {
    const ids = ALL_PROBLEMS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses only known patterns and topics", () => {
    const patterns = new Set(Object.keys(PATTERN_PREREQS));
    const topics = new Set<string>(TOPIC_ORDER);
    for (const p of ALL_PROBLEMS) {
      expect(patterns.has(p.pattern)).toBe(true);
      expect(topics.has(p.topic)).toBe(true);
    }
  });

  it("links every problem to leetcode", () => {
    for (const p of ALL_PROBLEMS) {
      expect(p.url).toMatch(/^https:\/\/leetcode\.com\/problems\/[a-z0-9-]+\/$/);
    }
  });

  it("gives every problem a positive time estimate", () => {
    for (const p of ALL_PROBLEMS) expect(p.minutes).toBeGreaterThan(0);
  });

  it("only declares prereqs that are known patterns", () => {
    const patterns = new Set(Object.keys(PATTERN_PREREQS));
    for (const p of ALL_PROBLEMS) {
      for (const req of p.prereqs) expect(patterns.has(req)).toBe(true);
    }
  });
});
