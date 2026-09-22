import { describe, it, expect } from "vitest";
import { buildSchedule } from "@/lib/scheduler";
import { ALL_PROBLEMS } from "@/data/problems";

const base = { problems: ALL_PROBLEMS, startDate: "2026-01-01" } as const;

describe("buildSchedule", () => {
  it("returns exactly the requested number of days", () => {
    expect(buildSchedule({ ...base, days: 90 }).length).toBe(90);
    expect(buildSchedule({ ...base, days: 120 }).length).toBe(120);
    expect(buildSchedule({ ...base, days: 180 }).length).toBe(180);
  });

  it("schedules every problem exactly once", () => {
    const ids = buildSchedule({ ...base, days: 90 }).flatMap((d) => d.problems.map((p) => p.id));
    expect(ids.length).toBe(ALL_PROBLEMS.length);
    expect(new Set(ids).size).toBe(ALL_PROBLEMS.length);
  });

  it("never schedules a problem before its prerequisite patterns", () => {
    const schedule = buildSchedule({ ...base, days: 90 });
    const firstDayOfPattern = new Map<string, number>();
    for (const day of schedule) {
      for (const p of day.problems) {
        if (!firstDayOfPattern.has(p.pattern)) firstDayOfPattern.set(p.pattern, day.index);
      }
    }
    for (const day of schedule) {
      for (const p of day.problems) {
        for (const req of p.prereqs) {
          const reqDay = firstDayOfPattern.get(req);
          if (reqDay !== undefined) expect(reqDay).toBeLessThanOrEqual(day.index);
        }
      }
    }
  });

  it("leaves every 7th day empty for revision", () => {
    const schedule = buildSchedule({ ...base, days: 90, restEvery: 7 });
    for (const day of schedule) {
      if ((day.index + 1) % 7 === 0) {
        expect(day.isRest).toBe(true);
        expect(day.problems).toHaveLength(0);
      }
    }
  });

  it("advances the date by one day per entry", () => {
    const schedule = buildSchedule({ ...base, days: 90 });
    expect(schedule[0].date).toBe("2026-01-01");
    expect(schedule[1].date).toBe("2026-01-02");
    expect(schedule[31].date).toBe("2026-02-01");
  });

  it("is deterministic", () => {
    const a = buildSchedule({ ...base, days: 120 });
    const b = buildSchedule({ ...base, days: 120 });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it("keeps working days near the target load", () => {
    const schedule = buildSchedule({ ...base, days: 90 });
    const working = schedule.filter((d) => !d.isRest && d.problems.length > 0);
    const target = working.reduce((s, d) => s + d.totalMinutes, 0) / working.length;
    for (const d of working) {
      expect(d.totalMinutes).toBeLessThanOrEqual(target * 1.2 + 60);
    }
  });

  it("changing plan length keeps the same problem set", () => {
    const ids = (days: 90 | 180) =>
      buildSchedule({ ...base, days })
        .flatMap((d) => d.problems.map((p) => p.id))
        .sort();
    expect(ids(90)).toEqual(ids(180));
  });
});
