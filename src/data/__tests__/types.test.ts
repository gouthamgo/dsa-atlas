import { describe, it, expect } from "vitest";
import { TOPIC_ORDER, TOPIC_LABELS, PATTERN_PREREQS, PATTERN_LABELS } from "@/data/types";

describe("curriculum ordering", () => {
  it("starts with arrays and ends with dynamic programming", () => {
    expect(TOPIC_ORDER[0]).toBe("arrays");
    expect(TOPIC_ORDER[TOPIC_ORDER.length - 1]).toBe("dynamic-programming");
  });

  it("declares no pattern as its own prerequisite", () => {
    for (const [pattern, prereqs] of Object.entries(PATTERN_PREREQS)) {
      expect(prereqs).not.toContain(pattern);
    }
  });

  it("only references patterns that exist", () => {
    const known = new Set(Object.keys(PATTERN_PREREQS));
    for (const prereqs of Object.values(PATTERN_PREREQS)) {
      for (const p of prereqs) expect(known.has(p)).toBe(true);
    }
  });

  it("labels every topic and pattern", () => {
    for (const t of TOPIC_ORDER) expect(TOPIC_LABELS[t]).toBeTruthy();
    for (const p of Object.keys(PATTERN_PREREQS)) {
      expect(PATTERN_LABELS[p as keyof typeof PATTERN_LABELS]).toBeTruthy();
    }
  });
});
