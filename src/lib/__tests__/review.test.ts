import { describe, it, expect } from "vitest";
import { nextDueDate, dueProblems } from "@/lib/review";

describe("review scheduling", () => {
  it("schedules 'again' three days out", () => {
    expect(nextDueDate("again", "2026-01-01")).toBe("2026-01-04");
  });

  it("schedules 'hard' a week out", () => {
    expect(nextDueDate("hard", "2026-01-01")).toBe("2026-01-08");
  });

  it("schedules 'good' three weeks out", () => {
    expect(nextDueDate("good", "2026-01-01")).toBe("2026-01-22");
  });

  it("returns problems due today or earlier", () => {
    const due = dueProblems(
      {
        a: { status: "solved", dueAt: "2025-12-31" },
        b: { status: "solved", dueAt: "2026-01-01" },
        c: { status: "solved", dueAt: "2026-02-01" },
      },
      "2026-01-01",
    );
    expect(due).toEqual(["a", "b"]);
  });

  it("caps the daily queue", () => {
    const problems = Object.fromEntries(
      Array.from({ length: 20 }, (_, i) => [
        `p${i}`,
        { status: "solved" as const, dueAt: "2026-01-01" },
      ]),
    );
    expect(dueProblems(problems, "2026-01-01", 5)).toHaveLength(5);
  });

  it("ignores problems with no due date", () => {
    expect(dueProblems({ a: { status: "solved" } }, "2026-01-01")).toEqual([]);
  });
});
