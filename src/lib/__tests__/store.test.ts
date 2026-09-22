import { describe, it, expect, beforeEach } from "vitest";
import { useProgress, exportProgress, importProgress } from "@/lib/store";

describe("progress store", () => {
  beforeEach(() => {
    localStorage.clear();
    useProgress.getState().reset();
  });

  it("defaults to a 90 day plan", () => {
    expect(useProgress.getState().settings.days).toBe(90);
  });

  it("marks a problem solved", () => {
    useProgress.getState().solve("two-sum", 25);
    const p = useProgress.getState().problems["two-sum"];
    expect(p.status).toBe("solved");
    expect(p.minutesTaken).toBe(25);
  });

  it("keeps notes per problem", () => {
    useProgress.getState().setNote("two-sum", "hash map, O(n)");
    expect(useProgress.getState().problems["two-sum"].notes).toBe("hash map, O(n)");
  });

  it("round-trips through export and import", () => {
    useProgress.getState().solve("two-sum", 25);
    const json = exportProgress();
    useProgress.getState().reset();
    expect(useProgress.getState().problems["two-sum"]).toBeUndefined();
    const result = importProgress(json);
    expect(result.ok).toBe(true);
    expect(useProgress.getState().problems["two-sum"].status).toBe("solved");
  });

  it("rejects a malformed import without touching state", () => {
    useProgress.getState().solve("two-sum", 25);
    expect(importProgress('{"nope":true}').ok).toBe(false);
    expect(importProgress("not json at all").ok).toBe(false);
    expect(useProgress.getState().problems["two-sum"].status).toBe("solved");
  });

  it("changing plan length preserves solved problems", () => {
    useProgress.getState().solve("two-sum", 25);
    useProgress.getState().setDays(180);
    expect(useProgress.getState().problems["two-sum"].status).toBe("solved");
    expect(useProgress.getState().settings.days).toBe(180);
  });

  it("keeps notes when a problem is solved later", () => {
    useProgress.getState().setNote("3sum", "sort then two pointers");
    useProgress.getState().solve("3sum", 40);
    expect(useProgress.getState().problems["3sum"].notes).toBe("sort then two pointers");
  });
});
