"use client";

import Link from "next/link";
import type { Day } from "@/lib/scheduler";
import { dayState, type DayState } from "@/lib/useSchedule";
import type { ProblemProgress } from "@/lib/store";

const FILL: Record<DayState, string> = {
  done: "var(--mint)",
  partial: "var(--sand)",
  missed: "var(--rose)",
  today: "var(--ink)",
  rest: "var(--rest)",
  future: "var(--line)",
};

/**
 * The whole plan in one strip: one cell per day, coloured by what happened.
 * This is the page's anchor — everything else on Today stays quiet.
 */
export function DayComb({
  schedule,
  progress,
  todayISO,
}: {
  schedule: Day[];
  progress: Record<string, ProblemProgress>;
  todayISO: string;
}) {
  return (
    <div className="flex w-full gap-[2px]" role="img" aria-label={`Plan progress across ${schedule.length} days`}>
      {schedule.map((day) => {
        const state = dayState(day, progress, todayISO);
        return (
          <Link
            key={day.index}
            href={`/plan#day-${day.index}`}
            title={`Day ${day.index + 1} · ${day.date} · ${
              day.isRest ? "revision" : `${day.problems.length} problems`
            }`}
            className="group relative flex-1 outline-offset-2"
            style={{ minWidth: 2 }}
          >
            <span
              className="block w-full rounded-[1px] transition-[height,background] duration-200"
              style={{
                background: FILL[state],
                height: state === "today" ? 34 : state === "rest" ? 10 : 24,
                opacity: state === "future" ? 0.55 : 1,
              }}
            />
          </Link>
        );
      })}
    </div>
  );
}
