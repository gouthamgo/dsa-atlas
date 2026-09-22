import { describe, it, expect } from "vitest";
import { ALL_PROBLEMS } from "@/data/problems";
import { PATTERN_PREREQS, TOPIC_ORDER } from "@/data/types";

describe("dataset", () => {
  it("covers the whole curriculum", () => {
    expect(ALL_PROBLEMS.length).toBeGreaterThanOrEqual(380);
  });

  it("gives every topic real coverage", () => {
    for (const topic of TOPIC_ORDER) {
      const count = ALL_PROBLEMS.filter((p) => p.topic === topic).length;
      expect({ topic, count }).toMatchObject({ topic });
      expect(count).toBeGreaterThanOrEqual(7);
    }
  });

  it("gives every pattern at least one problem", () => {
    for (const pattern of Object.keys(PATTERN_PREREQS)) {
      const count = ALL_PROBLEMS.filter((p) => p.pattern === pattern).length;
      expect(count).toBeGreaterThan(0);
    }
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
