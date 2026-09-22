import { describe, it, expect } from "vitest";
import { LESSONS } from "@/data/lessons";

describe("lessons", () => {
  const lessons = Object.values(LESSONS);

  it("has the prelude and at least the first chapters", () => {
    expect(LESSONS.foundations).toBeDefined();
    expect(LESSONS["two-pointers"]).toBeDefined();
  });

  it("gives every lesson code in both languages", () => {
    for (const l of lessons) {
      expect(l!.code.python.trim().length).toBeGreaterThan(0);
      expect(l!.code.cpp.trim().length).toBeGreaterThan(0);
    }
  });

  it("keeps every pointer and window inside its frame", () => {
    for (const l of lessons) {
      for (const f of l!.figure.frames) {
        for (const p of f.pointers ?? []) expect(p.at).toBeLessThan(f.cells.length);
        for (const m of f.marks ?? []) expect(m.at).toBeLessThan(f.cells.length);
        if (f.window) {
          expect(f.window[0]).toBeLessThanOrEqual(f.window[1]);
          expect(f.window[1]).toBeLessThan(f.cells.length);
        }
      }
    }
  });
});
