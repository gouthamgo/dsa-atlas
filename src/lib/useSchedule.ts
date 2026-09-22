"use client";

import { useMemo } from "react";
import { buildSchedule, type Day } from "@/lib/scheduler";
import { ALL_PROBLEMS } from "@/data/problems";
import { useProgress, type Settings, type ProblemProgress } from "@/lib/store";
import type { Problem } from "@/data/types";

export type DayState = "done" | "partial" | "missed" | "today" | "rest" | "future";

export type ScheduleView = {
  schedule: Day[];
  today: Day | null;
  /** Problems scheduled before today that are still unsolved. */
  behindBy: number;
  solvedCount: number;
  totalCount: number;
  streak: number;
};

export function dayState(
  day: Day,
  progress: Record<string, ProblemProgress>,
  todayISO: string,
): DayState {
  if (day.isRest) return "rest";
  const done = day.problems.filter((p) => progress[p.id]?.status === "solved").length;
  if (day.problems.length > 0 && done === day.problems.length) return "done";
  if (day.date === todayISO) return "today";
  if (day.date > todayISO) return "future";
  return done > 0 ? "partial" : "missed";
}

function streakFrom(schedule: Day[], progress: Record<string, ProblemProgress>, todayISO: string) {
  let streak = 0;
  const past = schedule.filter((d) => d.date <= todayISO && !d.isRest).reverse();
  for (const day of past) {
    const done = day.problems.filter((p) => progress[p.id]?.status === "solved").length;
    if (day.problems.length === 0) continue;
    if (done === 0) break;
    streak++;
  }
  return streak;
}

export function computeView(
  problems: Problem[],
  settings: Settings,
  progress: Record<string, ProblemProgress>,
  todayISO: string,
): ScheduleView {
  const schedule = buildSchedule({
    problems,
    days: settings.days,
    startDate: settings.startDate,
    restEvery: settings.restEvery,
  });

  const today = schedule.find((d) => d.date === todayISO) ?? null;

  const behindBy = schedule
    .filter((d) => d.date < todayISO)
    .flatMap((d) => d.problems)
    .filter((p) => {
      const status = progress[p.id]?.status;
      return status !== "solved" && status !== "skipped";
    }).length;

  const solvedCount = problems.filter((p) => progress[p.id]?.status === "solved").length;

  return {
    schedule,
    today,
    behindBy,
    solvedCount,
    totalCount: problems.length,
    streak: streakFrom(schedule, progress, todayISO),
  };
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useSchedule(): ScheduleView {
  const settings = useProgress((s) => s.settings);
  const problems = useProgress((s) => s.problems);
  const iso = todayISO();
  return useMemo(() => computeView(ALL_PROBLEMS, settings, problems, iso), [settings, problems, iso]);
}
