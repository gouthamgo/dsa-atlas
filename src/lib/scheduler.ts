import type { Problem, PatternId } from "@/data/types";
import { PATTERN_PREREQS, TOPIC_ORDER } from "@/data/types";

export type Day = {
  index: number;
  /** ISO "YYYY-MM-DD" */
  date: string;
  problems: Problem[];
  totalMinutes: number;
  isRest: boolean;
};

export type PlanLength = 90 | 120 | 180;

const DIFFICULTY_RANK = { easy: 0, medium: 1, hard: 2 } as const;

export function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** Patterns in dependency order; ties keep their declaration order. */
function orderPatterns(): PatternId[] {
  const out: PatternId[] = [];
  const seen = new Set<PatternId>();
  const visit = (p: PatternId) => {
    if (seen.has(p)) return;
    seen.add(p);
    for (const req of PATTERN_PREREQS[p]) visit(req as PatternId);
    out.push(p);
  };
  for (const p of Object.keys(PATTERN_PREREQS) as PatternId[]) visit(p);
  return out;
}

/**
 * Pattern order first, so a technique is always introduced before it is needed,
 * then topic, then difficulty. Id breaks the final tie to keep this deterministic.
 */
export function sortProblems(problems: Problem[]): Problem[] {
  const patternRank = new Map(orderPatterns().map((p, i) => [p, i] as const));
  const topicRank = new Map(TOPIC_ORDER.map((t, i) => [t, i] as const));

  /**
   * A problem can need a technique that ranks later than its own pattern — a heap
   * problem over a sliding window, say. It waits for the latest thing it needs.
   */
  const effectiveRank = (p: Problem) =>
    Math.max(patternRank.get(p.pattern)!, ...p.prereqs.map((r) => patternRank.get(r)!));

  return [...problems].sort((a, b) => {
    const byPattern = effectiveRank(a) - effectiveRank(b);
    if (byPattern !== 0) return byPattern;
    const byTopic = topicRank.get(a.topic)! - topicRank.get(b.topic)!;
    if (byTopic !== 0) return byTopic;
    const byDifficulty = DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty];
    if (byDifficulty !== 0) return byDifficulty;
    return a.id.localeCompare(b.id);
  });
}

export function buildSchedule(input: {
  problems: Problem[];
  days: PlanLength;
  startDate: string;
  restEvery?: number;
}): Day[] {
  const restEvery = input.restEvery ?? 7;
  const ordered = sortProblems(input.problems);

  const isRestIndex = (i: number) => restEvery > 0 && (i + 1) % restEvery === 0;
  const workingIndexes = Array.from({ length: input.days }, (_, i) => i).filter(
    (i) => !isRestIndex(i),
  );

  const totalMinutes = ordered.reduce((sum, p) => sum + p.minutes, 0);
  const targetPerDay = totalMinutes / Math.max(workingIndexes.length, 1);

  const days: Day[] = [];
  let cursor = 0;

  for (let i = 0; i < input.days; i++) {
    const date = addDays(input.startDate, i);

    if (isRestIndex(i)) {
      days.push({ index: i, date, problems: [], totalMinutes: 0, isRest: true });
      continue;
    }

    // Working days still ahead of us, including this one.
    const workingDaysLeft = workingIndexes.filter((k) => k >= i).length;
    const picked: Problem[] = [];
    let minutes = 0;

    while (cursor < ordered.length) {
      const next = ordered[cursor];
      // Take at least one per working day so nothing is left stranded at the end.
      const mustTake = ordered.length - cursor >= workingDaysLeft;
      const wouldExceed = minutes + next.minutes > targetPerDay * 1.2;
      if (picked.length > 0 && wouldExceed && !mustTake) break;
      picked.push(next);
      minutes += next.minutes;
      cursor++;
      if (minutes >= targetPerDay) break;
    }

    days.push({ index: i, date, problems: picked, totalMinutes: minutes, isRest: false });
  }

  // More problems than the plan can hold: append the tail to the last working day
  // rather than silently dropping it.
  if (cursor < ordered.length) {
    const last = [...days].reverse().find((d) => !d.isRest);
    if (last) {
      const rest = ordered.slice(cursor);
      last.problems.push(...rest);
      last.totalMinutes += rest.reduce((sum, p) => sum + p.minutes, 0);
    }
  }

  return days;
}
