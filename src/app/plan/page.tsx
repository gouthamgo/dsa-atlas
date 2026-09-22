"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSchedule, todayISO, dayState, type DayState } from "@/lib/useSchedule";
import { useProgress } from "@/lib/store";
import { weeksOf, dayTitle } from "@/lib/planMeta";
import { AppShell } from "@/components/AppShell";
import { ProblemRow } from "@/components/ProblemRow";

const STATE_COLOR: Record<DayState, string> = {
  done: "var(--mint)",
  partial: "var(--sand)",
  missed: "var(--rose)",
  today: "var(--ink)",
  rest: "var(--muted)",
  future: "var(--muted)",
};

export default function PlanPage() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const view = useSchedule();
  const progress = useProgress((s) => s.problems);
  const iso = todayISO();
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [openWeek, setOpenWeek] = useState<number | null>(null);

  const weeks = weeksOf(view.schedule);
  const currentWeek = view.today ? Math.floor(view.today.index / 7) + 1 : 1;

  useEffect(() => {
    if (ready) setOpenWeek(currentWeek);
  }, [ready, currentWeek]);

  return (
    <AppShell>
      {!ready ? (
        <div className="h-96" aria-hidden />
      ) : (
        <div>
          <header>
            <h1 className="font-display text-3xl font-bold">
              {view.schedule.length} days, {weeks.length} weeks
            </h1>
            <p className="mt-2 max-w-[62ch] text-[var(--muted)]">
              Each week is named after what you spend it on. The seventh day of every week is
              revision — no new problems, on purpose.
            </p>
          </header>

          <ol className="mt-8 space-y-3">
            {weeks.map((week) => {
              const problems = week.days.flatMap((d) => d.problems);
              const done = problems.filter((p) => progress[p.id]?.status === "solved").length;
              const isOpen = openWeek === week.number;
              const isNow = week.number === currentWeek;

              return (
                <li
                  key={week.number}
                  id={`week-${week.number}`}
                  className="overflow-hidden rounded-xl border scroll-mt-24"
                  style={{ borderColor: isNow ? "var(--mint)" : "var(--line)" }}
                >
                  <button
                    onClick={() => setOpenWeek(isOpen ? null : week.number)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-4 bg-[var(--surface)] px-4 py-3 text-left"
                  >
                    <span className="w-16 shrink-0 text-sm text-[var(--muted)]">
                      Week {week.number}
                    </span>
                    <span className="flex-1 truncate font-display font-bold">{week.title}</span>
                    {isNow && <span className="shrink-0 text-xs text-[var(--mint)]">you are here</span>}
                    <span className="shrink-0 text-sm text-[var(--muted)] tabular-nums">
                      {done}/{problems.length}
                    </span>
                  </button>

                  {isOpen && (
                    <ol className="divide-y divide-[var(--line)]">
                      {week.days.map((day) => {
                        const state = dayState(day, progress, iso);
                        const dayDone = day.problems.filter(
                          (p) => progress[p.id]?.status === "solved",
                        ).length;
                        const dayOpen = openDay === day.index;

                        return (
                          <li key={day.index} id={`day-${day.index}`} className="scroll-mt-24">
                            <button
                              onClick={() => setOpenDay(dayOpen ? null : day.index)}
                              aria-expanded={dayOpen}
                              className="flex w-full items-center gap-4 px-4 py-2.5 text-left hover:bg-[var(--surface)]"
                            >
                              <span
                                className="w-8 shrink-0 text-sm font-medium tabular-nums"
                                style={{ color: STATE_COLOR[state] }}
                              >
                                {day.index + 1}
                              </span>
                              <span className="w-24 shrink-0 text-xs text-[var(--muted)] tabular-nums">
                                {day.date}
                              </span>
                              <span className="flex-1 truncate text-sm">{dayTitle(day)}</span>
                              <span className="shrink-0 text-xs text-[var(--muted)] tabular-nums">
                                {day.isRest ? "revision" : `${dayDone}/${day.problems.length}`}
                              </span>
                            </button>

                            {dayOpen && day.problems.length > 0 && (
                              <ul className="border-t border-[var(--line)] bg-[var(--bg)] px-2">
                                {day.problems.map((p) => (
                                  <ProblemRow key={p.id} problem={p} />
                                ))}
                              </ul>
                            )}

                            {dayOpen && day.isRest && (
                              <p className="border-t border-[var(--line)] px-4 py-3 text-sm text-[var(--muted)]">
                                Revision day. Your due problems appear on{" "}
                                <Link href="/today" className="underline underline-offset-4">
                                  Today
                                </Link>
                                .
                              </p>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </AppShell>
  );
}
