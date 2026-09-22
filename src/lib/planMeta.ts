import type { Day } from "@/lib/scheduler";
import { PATTERN_LABELS, TOPIC_LABELS, type PatternId, type TopicId } from "@/data/types";
import { PATTERN_GUIDES } from "@/data/patterns";

/** The topic a day is mostly about — what you would tell a friend you studied. */
export function dayTopic(day: Day): TopicId | null {
  if (day.problems.length === 0) return null;
  const counts = new Map<TopicId, number>();
  for (const p of day.problems) counts.set(p.topic, (counts.get(p.topic) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

export function dayPattern(day: Day): PatternId | null {
  if (day.problems.length === 0) return null;
  const counts = new Map<PatternId, number>();
  for (const p of day.problems) counts.set(p.pattern, (counts.get(p.pattern) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

export function dayTitle(day: Day): string {
  if (day.isRest) return "Revision";
  const topic = dayTopic(day);
  return topic ? TOPIC_LABELS[topic] : "Rest";
}

/**
 * One line explaining why these problems, today. Without this a schedule is just
 * a list with dates on it.
 */
export function dayReason(day: Day, previous: Day | undefined): string {
  if (day.isRest) return "No new problems. Redo what you rated shaky and read a pattern page.";

  const pattern = dayPattern(day);
  if (!pattern) return "Nothing scheduled.";

  const prevPattern = previous ? dayPattern(previous) : null;
  const tell = PATTERN_GUIDES[pattern].tell;

  if (prevPattern && prevPattern !== pattern) {
    return `New technique: ${PATTERN_LABELS[pattern]}. ${tell}`;
  }
  return `More ${PATTERN_LABELS[pattern]}. ${tell}`;
}

export type Week = { number: number; days: Day[]; title: string };

/** Weeks of seven, titled by what you spend them on. */
export function weeksOf(schedule: Day[]): Week[] {
  const weeks: Week[] = [];
  for (let i = 0; i < schedule.length; i += 7) {
    const days = schedule.slice(i, i + 7);
    const topics = new Map<TopicId, number>();
    for (const d of days) {
      const t = dayTopic(d);
      if (t) topics.set(t, (topics.get(t) ?? 0) + 1);
    }
    const ranked = [...topics.entries()].sort((a, b) => b[1] - a[1]);
    const title =
      ranked.length === 0
        ? "Revision"
        : ranked
            .slice(0, 2)
            .map(([t]) => TOPIC_LABELS[t])
            .join(" & ");
    weeks.push({ number: weeks.length + 1, days, title });
  }
  return weeks;
}
