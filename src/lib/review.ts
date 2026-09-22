import type { Rating, ProblemProgress } from "@/lib/store";
import { addDays } from "@/lib/scheduler";

/** Deliberately simpler than SM-2: three buttons, and the interval fits in a sentence. */
export const REVIEW_INTERVALS: Record<Rating, number> = { again: 3, hard: 7, good: 21 };

export function nextDueDate(rating: Rating, fromISO: string): string {
  return addDays(fromISO, REVIEW_INTERVALS[rating]);
}

/** Ids due on or before today, oldest first, capped so revision never buries new work. */
export function dueProblems(
  problems: Record<string, ProblemProgress>,
  todayISO: string,
  cap = 5,
): string[] {
  return Object.entries(problems)
    .filter(([, p]) => p.dueAt !== undefined && p.dueAt <= todayISO)
    .sort((a, b) => a[1].dueAt!.localeCompare(b[1].dueAt!) || a[0].localeCompare(b[0]))
    .slice(0, cap)
    .map(([id]) => id);
}
